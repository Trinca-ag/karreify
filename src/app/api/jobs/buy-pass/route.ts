import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { JOBS_PASSES, type JobsPassId } from "@/types";
import { requireUser, authErrorResponse } from "@/lib/auth-server";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { InsufficientCreditsError } from "@/lib/credits-server";

/**
 * Compra um passe da página /jobs usando moedas (não R$).
 * Não é cobrança recorrente — usuário compra de novo quando expirar.
 * Se já tiver um passe ativo, somamos a duração ao expiresAt existente.
 */
export async function POST(request: NextRequest) {
  let ctx;
  try {
    ctx = await requireUser(request);
  } catch (e) {
    return authErrorResponse(e);
  }

  const rl = rateLimit(ctx.uid, { scope: "jobs-buy-pass", limit: 10, windowMs: 60_000 });
  if (!rl.allowed) return rateLimitResponse(rl);

  try {
    const { passId } = await request.json();
    const pass = JOBS_PASSES.find((p) => p.id === (passId as JobsPassId));
    if (!pass) {
      return NextResponse.json({ error: "Passe inválido" }, { status: 400 });
    }

    const userRef = adminDb.collection("users").doc(ctx.uid);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    if (userSnap.data()?.role === "tester") {
      return NextResponse.json(
        { error: "Contas Tester não precisam comprar passes" },
        { status: 403 }
      );
    }

    const result = await adminDb.runTransaction(async (tx) => {
      const snap = await tx.get(userRef);
      if (!snap.exists) throw new Error("Usuário não encontrado");
      const data = snap.data()!;
      const credits = (data.credits as number | undefined) ?? 0;
      if (credits < pass.cost) {
        throw new InsufficientCreditsError(pass.cost, credits);
      }

      const now = Date.now();
      const currentExpiry = (data.jobsPassExpiresAt as number | undefined) ?? 0;
      const base = currentExpiry > now ? currentExpiry : now;
      const newExpiry = base + pass.durationMs;

      tx.update(userRef, {
        credits: credits - pass.cost,
        jobsPassExpiresAt: newExpiry,
        jobsPassType: pass.id,
        updatedAt: new Date(),
      });

      const txRef = userRef.collection("transactions").doc();
      tx.set(txRef, {
        amount: pass.cost,
        type: "debit",
        feature: "jobs-pass",
        description: `${pass.name} — ${pass.description}`,
        passId: pass.id,
        createdAt: FieldValue.serverTimestamp(),
      });

      return { newExpiry, newBalance: credits - pass.cost };
    });

    return NextResponse.json({
      success: true,
      jobsPassExpiresAt: result.newExpiry,
      jobsPassType: pass.id,
      credits: result.newBalance,
    });
  } catch (error) {
    if (error instanceof InsufficientCreditsError) {
      return NextResponse.json(
        { error: error.message, code: "INSUFFICIENT_CREDITS" },
        { status: 402 }
      );
    }
    console.error("[jobs/buy-pass]", error);
    return NextResponse.json({ error: "Erro ao comprar passe" }, { status: 500 });
  }
}
