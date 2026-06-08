import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { requireUser, authErrorResponse } from "@/lib/auth-server";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { resolveReferralCode } from "@/lib/referral-server";
import { createWalletNotification } from "@/lib/notifications-server";
import { sendTransactionalEmail } from "@/lib/mailer";
import { referralBonusEmail, referralBonusEmailText } from "@/utils/email-templates";
import { REFERRAL_CREDITS, REFERRAL_ATTRIBUTION_WINDOW_MS } from "@/types";

export const dynamic = "force-dynamic";

/**
 * Atribui PERMANENTEMENTE um indicador ao usuário autenticado e credita o bônus
 * de indicação (REFERRAL_CREDITS) ao indicador — tudo na mesma transação.
 *
 * Idempotente e seguro:
 *  - guarda `referredBy` (definido uma única vez) → não atribui duas vezes;
 *  - bloqueia autoindicação (referrerUid === caller);
 *  - notificação/e-mail só disparam quando a atribuição de fato ocorre, então
 *    retries não geram spam nem crédito duplicado.
 *
 * A resposta ao client NÃO expõe nenhum dado do indicador (privacidade).
 */
export async function POST(request: NextRequest) {
  let ctx;
  try {
    ctx = await requireUser(request);
  } catch (e) {
    return authErrorResponse(e);
  }

  const rl = rateLimit(ctx.uid, { scope: "referral-attribute", limit: 5, windowMs: 60_000 });
  if (!rl.allowed) return rateLimitResponse(rl);

  let body: { code?: unknown };
  try {
    body = await request.json();
  } catch {
    body = {};
  }
  const code = typeof body.code === "string" ? body.code.trim().toUpperCase() : "";
  if (!code) {
    return NextResponse.json({ attributed: false, reason: "no-code" });
  }

  try {
    const referrerUid = await resolveReferralCode(code);
    if (!referrerUid) {
      return NextResponse.json({ attributed: false, reason: "invalid-code" });
    }
    if (referrerUid === ctx.uid) {
      return NextResponse.json({ attributed: false, reason: "self-referral" });
    }

    const userRef = adminDb.collection("users").doc(ctx.uid);
    const referrerRef = adminDb.collection("users").doc(referrerUid);
    // Doc id == uid do indicado: cada usuário tem no máximo UM indicador, então
    // o id determinístico reforça a unicidade e dá lookup direto na comissão.
    const referralRef = adminDb.collection("referrals").doc(ctx.uid);

    const result = await adminDb.runTransaction(async (tx) => {
      const userSnap = await tx.get(userRef);
      if (!userSnap.exists) {
        return { attributed: false as const, reason: "no-user-doc" };
      }
      if (userSnap.data()?.referredBy) {
        return { attributed: false as const, reason: "already-attributed" };
      }
      // Só atribui a contas recém-criadas: cadastros legítimos disparam isto
      // segundos após criar a conta. Bloqueia atribuir indicador a contas antigas.
      // (createdAt ausente/irreconhecível → não bloqueia; a guarda principal é o
      // referredBy não definido + anti-autoindicação.)
      const createdAt = userSnap.data()?.createdAt as { toMillis?: () => number } | undefined;
      const createdAtMs = typeof createdAt?.toMillis === "function" ? createdAt.toMillis() : null;
      if (createdAtMs !== null && Date.now() - createdAtMs > REFERRAL_ATTRIBUTION_WINDOW_MS) {
        return { attributed: false as const, reason: "account-too-old" };
      }
      const referrerSnap = await tx.get(referrerRef);
      if (!referrerSnap.exists) {
        return { attributed: false as const, reason: "referrer-not-found" };
      }

      // Atribuição permanente do indicador no doc do indicado.
      tx.update(userRef, { referredBy: referrerUid, updatedAt: new Date() });

      // +5 créditos ao indicador + entrada no ledger dele.
      tx.update(referrerRef, {
        credits: FieldValue.increment(REFERRAL_CREDITS),
        updatedAt: new Date(),
      });
      const ledgerRef = referrerRef.collection("transactions").doc();
      tx.set(ledgerRef, {
        amount: REFERRAL_CREDITS,
        type: "credit",
        feature: "referral-bonus",
        description: `Bônus de indicação (${REFERRAL_CREDITS} créditos)`,
        createdAt: FieldValue.serverTimestamp(),
      });

      // Vínculo permanente indicador↔indicado.
      tx.set(referralRef, {
        referrerUid,
        referredUid: ctx.uid,
        code,
        status: "attributed",
        signupBonusGranted: true,
        createdAt: FieldValue.serverTimestamp(),
      });

      const referrerData = referrerSnap.data() ?? {};
      return {
        attributed: true as const,
        referralId: referralRef.id,
        referrerEmail: (referrerData.email as string | undefined) ?? null,
        referrerName:
          (referrerData.displayName as string | undefined) ||
          (referrerData.email ? (referrerData.email as string).split("@")[0] : "Usuário"),
      };
    });

    if (result.attributed) {
      // Notificação + e-mail ao indicador (best-effort, fora da transação).
      createWalletNotification({
        uid: referrerUid,
        type: "referral-bonus",
        title: "Nova indicação confirmada!",
        message: `Um novo usuário se cadastrou com o seu link. Você ganhou ${REFERRAL_CREDITS} créditos.`,
        creditsDelta: REFERRAL_CREDITS,
        relatedId: result.referralId,
      }).catch((e) => console.error("[referral/attribute] notification failed:", e));

      if (result.referrerEmail) {
        sendTransactionalEmail({
          to: result.referrerEmail,
          subject: "Você ganhou créditos por indicação — Karreify",
          html: referralBonusEmail(result.referrerName, REFERRAL_CREDITS),
          text: referralBonusEmailText(result.referrerName, REFERRAL_CREDITS),
        }).catch((e) => console.error("[referral/attribute] email failed:", e));
      }

      return NextResponse.json({ attributed: true });
    }

    // Sem dados sensíveis do indicador na resposta.
    return NextResponse.json({ attributed: false, reason: result.reason });
  } catch (error) {
    console.error("[referral/attribute]", error);
    return NextResponse.json({ error: "Erro ao registrar indicação" }, { status: 500 });
  }
}
