import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { requireUser, authErrorResponse } from "@/lib/auth-server";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { WALLET_CENTS_PER_CREDIT } from "@/types";

export const dynamic = "force-dynamic";

/**
 * Converte saldo da carteira (R$) em créditos da plataforma à taxa
 * WALLET_CENTS_PER_CREDIT (R$ 3,00 = 1 crédito). Irreversível.
 *
 * Tudo numa transação: debita exatamente `credits * 300` centavos de
 * balanceCents (sobra fica na carteira, sem float drift), credita os créditos no
 * usuário, escreve os dois ledgers (carteira + créditos) e a auditoria. Saldo
 * negativo (pós-estorno) bloqueia naturalmente pela checagem de suficiência.
 */
export async function POST(request: NextRequest) {
  let ctx;
  try {
    ctx = await requireUser(request);
  } catch (e) {
    return authErrorResponse(e);
  }

  const rl = rateLimit(ctx.uid, { scope: "wallet-convert", limit: 10, windowMs: 60_000 });
  if (!rl.allowed) return rateLimitResponse(rl);

  let body: { credits?: unknown };
  try {
    body = await request.json();
  } catch {
    body = {};
  }
  const credits = typeof body.credits === "number" ? Math.floor(body.credits) : NaN;
  if (!Number.isFinite(credits) || credits < 1) {
    return NextResponse.json({ error: "Quantidade de créditos inválida" }, { status: 400 });
  }
  const costCents = credits * WALLET_CENTS_PER_CREDIT;

  try {
    const walletRef = adminDb.collection("wallets").doc(ctx.uid);
    const userRef = adminDb.collection("users").doc(ctx.uid);

    const result = await adminDb.runTransaction(async (tx) => {
      const [walletSnap, userSnap] = await tx.getAll(walletRef, userRef);
      if (!userSnap.exists) return { ok: false as const, reason: "no-user" };
      const balanceCents = (walletSnap.data()?.balanceCents as number | undefined) ?? 0;
      if (balanceCents < costCents) {
        return { ok: false as const, reason: "insufficient" };
      }

      tx.update(walletRef, {
        balanceCents: FieldValue.increment(-costCents),
        totalConvertedCents: FieldValue.increment(costCents),
        updatedAt: new Date(),
      });
      tx.update(userRef, {
        credits: FieldValue.increment(credits),
        updatedAt: new Date(),
      });

      const reais = `R$ ${(costCents / 100).toFixed(2).replace(".", ",")}`;
      tx.set(walletRef.collection("walletTransactions").doc(), {
        amountCents: -costCents,
        type: "credit-conversion",
        refType: "conversion",
        refId: "",
        description: `Conversão de saldo em ${credits} crédito${credits === 1 ? "" : "s"}`,
        createdAt: FieldValue.serverTimestamp(),
      });
      tx.set(userRef.collection("transactions").doc(), {
        amount: credits,
        type: "credit",
        feature: "wallet-conversion",
        description: `Conversão de carteira — ${credits} crédito${credits === 1 ? "" : "s"} (${reais})`,
        createdAt: FieldValue.serverTimestamp(),
      });
      tx.set(adminDb.collection("auditLogs").doc(), {
        actorUid: ctx.uid,
        actorType: "user",
        action: "wallet.converted",
        targetType: "wallet",
        targetId: ctx.uid,
        affectedUid: ctx.uid,
        amountCents: costCents,
        metadata: { credits },
        notes: null,
        createdAt: FieldValue.serverTimestamp(),
      });

      return { ok: true as const };
    });

    if (!result.ok) {
      if (result.reason === "insufficient") {
        return NextResponse.json(
          { error: "Saldo insuficiente para essa conversão" },
          { status: 402 }
        );
      }
      return NextResponse.json({ error: "Não foi possível converter" }, { status: 400 });
    }

    return NextResponse.json({ ok: true, creditsAdded: credits });
  } catch (error) {
    console.error("[credits/convert-wallet]", error);
    return NextResponse.json({ error: "Erro ao converter saldo" }, { status: 500 });
  }
}
