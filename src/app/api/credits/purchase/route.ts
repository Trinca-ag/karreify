import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { CREDIT_PACKS, type CreditPackId } from "@/types";
import { requireUser, authErrorResponse } from "@/lib/auth-server";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { sendTransactionalEmail } from "@/lib/mailer";
import { packPurchaseEmail, packPurchaseEmailText } from "@/utils/email-templates";

/**
 * Credit purchase endpoint.
 *
 * ⚠️ PRODUCTION TODO: Integrate with payment gateway (Abacate Pay, Stripe,
 * Mercado Pago, etc.). The webhook should be the source of truth for what
 * was actually paid for — this endpoint should *queue* a pending purchase
 * and only release the credits once the webhook fires.
 *
 * Today this endpoint trusts that the user reached this code path through
 * the legitimate purchase flow. That is acceptable for a closed beta but
 * MUST be replaced before real payments go live.
 */
export async function POST(request: NextRequest) {
  let ctx;
  try {
    ctx = await requireUser(request);
  } catch (e) {
    return authErrorResponse(e);
  }

  const rl = rateLimit(ctx.uid, { scope: "credits-purchase", limit: 10, windowMs: 60_000 });
  if (!rl.allowed) return rateLimitResponse(rl);

  try {
    const { packId } = await request.json();
    const pack = CREDIT_PACKS.find((p) => p.id === (packId as CreditPackId));
    if (!pack) {
      return NextResponse.json({ error: "Pacote inválido" }, { status: 400 });
    }

    const description = pack.bonusCredits > 0
      ? `Compra do ${pack.name} — ${pack.baseCredits} moedas + ${pack.bonusCredits} bônus`
      : `Compra do ${pack.name} — ${pack.baseCredits} moedas`;

    const userRef = adminDb.collection("users").doc(ctx.uid);

    await adminDb.runTransaction(async (tx) => {
      const snap = await tx.get(userRef);
      if (!snap.exists) throw new Error("Usuário não encontrado");
      tx.update(userRef, {
        credits: FieldValue.increment(pack.totalCredits),
        updatedAt: new Date(),
      });
      const txRef = userRef.collection("transactions").doc();
      tx.set(txRef, {
        amount: pack.totalCredits,
        type: "credit",
        feature: "purchase",
        description,
        packId: pack.id,
        createdAt: FieldValue.serverTimestamp(),
      });
    });

    const updated = await userRef.get();
    const userData = updated.data();
    const userName =
      (userData?.displayName as string | undefined) ||
      (userData?.name as string | undefined) ||
      "Usuário";

    if (ctx.email) {
      try {
        await sendTransactionalEmail({
          to: ctx.email,
          subject: "Compra de moedas confirmada — Karreify",
          html: packPurchaseEmail(
            userName,
            pack.name,
            pack.baseCredits,
            pack.bonusCredits,
            pack.totalCredits,
            pack.price
          ),
          text: packPurchaseEmailText(
            userName,
            pack.name,
            pack.baseCredits,
            pack.bonusCredits,
            pack.totalCredits,
            pack.price
          ),
        });
      } catch (e) {
        console.error("Pack purchase email failed:", e);
      }
    }

    return NextResponse.json({
      success: true,
      credits: userData?.credits ?? 0,
      packName: pack.name,
      totalCredits: pack.totalCredits,
    });
  } catch (error) {
    console.error("Credits purchase error:", error);
    return NextResponse.json({ error: "Erro ao processar compra" }, { status: 500 });
  }
}
