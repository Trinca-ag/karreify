import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { Timestamp } from "firebase-admin/firestore";
import { requireUser, authErrorResponse } from "@/lib/auth-server";
import {
  WALLET_CENTS_PER_CREDIT,
  WITHDRAW_MIN_CENTS,
  WITHDRAW_MAX_CENTS,
} from "@/types";

export const dynamic = "force-dynamic";

function toIso(v: unknown): string | null {
  return v instanceof Timestamp ? v.toDate().toISOString() : null;
}

/** Resumo da carteira + últimas movimentações do usuário autenticado. */
export async function GET(request: NextRequest) {
  let ctx;
  try {
    ctx = await requireUser(request);
  } catch (e) {
    return authErrorResponse(e);
  }

  try {
    const walletRef = adminDb.collection("wallets").doc(ctx.uid);
    const [walletSnap, txSnap] = await Promise.all([
      walletRef.get(),
      walletRef
        .collection("walletTransactions")
        .orderBy("createdAt", "desc")
        .limit(40)
        .get(),
    ]);

    const w = walletSnap.data() ?? {};
    const wallet = {
      balanceCents: (w.balanceCents as number | undefined) ?? 0,
      pendingCents: (w.pendingCents as number | undefined) ?? 0,
      totalEarnedCents: (w.totalEarnedCents as number | undefined) ?? 0,
      totalWithdrawnCents: (w.totalWithdrawnCents as number | undefined) ?? 0,
      totalConvertedCents: (w.totalConvertedCents as number | undefined) ?? 0,
    };

    const transactions = txSnap.docs.map((d) => {
      const t = d.data();
      return {
        id: d.id,
        amountCents: (t.amountCents as number | undefined) ?? 0,
        type: (t.type as string | undefined) ?? "",
        description: (t.description as string | undefined) ?? "",
        createdAt: toIso(t.createdAt),
      };
    });

    return NextResponse.json({
      wallet,
      transactions,
      config: {
        centsPerCredit: WALLET_CENTS_PER_CREDIT,
        withdrawMinCents: WITHDRAW_MIN_CENTS,
        withdrawMaxCents: WITHDRAW_MAX_CENTS,
      },
    });
  } catch (error) {
    console.error("[wallet]", error);
    return NextResponse.json({ error: "Erro ao carregar carteira" }, { status: 500 });
  }
}
