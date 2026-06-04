import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { requireUser, authErrorResponse } from "@/lib/auth-server";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { WELCOME_CREDITS } from "@/types";

/**
 * Concede o bônus de boas-vindas (WELCOME_CREDITS) uma única vez por conta.
 *
 * Idempotente e server-authoritative: a checagem do flag `welcomeCreditsGranted`
 * e o incremento acontecem na MESMA transação Firestore, então dois logins
 * simultâneos não conseguem creditar duas vezes. O cliente chama isto no login
 * (useAuth) para cobrir tanto novos cadastros quanto o backfill das contas já
 * existentes — em ambos os casos o grant ocorre apenas na primeira vez.
 */
export async function POST(request: NextRequest) {
  let ctx;
  try {
    ctx = await requireUser(request);
  } catch (e) {
    return authErrorResponse(e);
  }

  const rl = rateLimit(ctx.uid, { scope: "welcome-credits", limit: 5, windowMs: 60_000 });
  if (!rl.allowed) return rateLimitResponse(rl);

  try {
    const userRef = adminDb.collection("users").doc(ctx.uid);

    const result = await adminDb.runTransaction(async (tx) => {
      const snap = await tx.get(userRef);
      if (!snap.exists) {
        // Documento ainda não criado (corrida com o setDoc do cadastro). Sem
        // doc não dá pra creditar com segurança; o cliente tenta de novo no
        // próximo load.
        return { granted: false as const, reason: "no-user-doc" };
      }

      const data = snap.data() ?? {};
      if (data.welcomeCreditsGranted === true) {
        return { granted: false as const, reason: "already-granted", credits: (data.credits as number | undefined) ?? 0 };
      }

      const current = (data.credits as number | undefined) ?? 0;
      tx.update(userRef, {
        credits: FieldValue.increment(WELCOME_CREDITS),
        welcomeCreditsGranted: true,
        updatedAt: new Date(),
      });

      const txRef = userRef.collection("transactions").doc();
      tx.set(txRef, {
        amount: WELCOME_CREDITS,
        type: "credit",
        feature: "welcome-bonus",
        description: `Bônus de boas-vindas (${WELCOME_CREDITS} créditos)`,
        createdAt: FieldValue.serverTimestamp(),
      });

      return { granted: true as const, credits: current + WELCOME_CREDITS };
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("[credits/welcome]", error);
    return NextResponse.json({ error: "Erro ao conceder créditos de boas-vindas" }, { status: 500 });
  }
}
