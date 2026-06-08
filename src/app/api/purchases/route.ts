import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { Timestamp } from "firebase-admin/firestore";
import { requireUser, authErrorResponse } from "@/lib/auth-server";
import { creditsUsedSince } from "@/lib/refund-server";
import {
  CREDIT_PACKS,
  REFUND_WINDOW_MS,
  REFUND_MAX_CREDITS_USED_PCT,
  type CreditPackId,
} from "@/types";

export const dynamic = "force-dynamic";

function toIso(v: unknown): string | null {
  return v instanceof Timestamp ? v.toDate().toISOString() : null;
}

/**
 * Histórico de compras do usuário + elegibilidade de reembolso por compra
 * (≤7 dias e <30% dos créditos consumidos desde a compra) e o status de um
 * eventual reembolso já solicitado.
 */
export async function GET(request: NextRequest) {
  let ctx;
  try {
    ctx = await requireUser(request);
  } catch (e) {
    return authErrorResponse(e);
  }

  try {
    const snap = await adminDb
      .collection("pendingPayments")
      .where("userId", "==", ctx.uid)
      .orderBy("createdAt", "desc")
      .limit(20)
      .get();

    const docs = snap.docs;

    // Batch dos estados de reembolso (refunds/{paymentId}).
    const refundByPayment = new Map<string, Record<string, unknown>>();
    if (docs.length > 0) {
      const refundRefs = docs.map((d) => adminDb.collection("refunds").doc(d.id));
      const refundSnaps = await adminDb.getAll(...refundRefs);
      refundSnaps.forEach((rs) => {
        if (rs.exists) refundByPayment.set(rs.id, rs.data() as Record<string, unknown>);
      });
    }

    const now = Date.now();
    const purchases = await Promise.all(
      docs.map(async (d) => {
        const p = d.data();
        const packId = p.packId as CreditPackId;
        const packName = CREDIT_PACKS.find((x) => x.id === packId)?.name ?? packId;
        const status = (p.status as string | undefined) ?? "pending";
        const creditsGranted = (p.creditsToAdd as number | undefined) ?? 0;
        const amountCents = Math.round(((p.amount as number | undefined) ?? 0) * 100);
        const completedAt = p.completedAt instanceof Timestamp ? p.completedAt : null;

        const refund = refundByPayment.get(d.id) ?? null;
        const refundStatus = refund ? (refund.status as string) : null;

        let refundEligible = false;
        let creditsUsed: number | null = null;
        if (
          status === "completed" &&
          !refund &&
          completedAt &&
          now - completedAt.toMillis() <= REFUND_WINDOW_MS
        ) {
          const used = await creditsUsedSince(ctx.uid, completedAt);
          creditsUsed = used;
          refundEligible =
            creditsGranted > 0 ? used < REFUND_MAX_CREDITS_USED_PCT * creditsGranted : true;
        }

        return {
          id: d.id,
          packId,
          packName,
          amountCents,
          creditsGranted,
          creditsUsed,
          status,
          refundStatus,
          refundEligible,
          createdAt: toIso(p.createdAt),
          completedAt: toIso(p.completedAt),
          refundedAt: toIso(p.refundedAt),
        };
      })
    );

    return NextResponse.json({ purchases });
  } catch (error) {
    console.error("[purchases]", error);
    return NextResponse.json({ error: "Erro ao carregar compras" }, { status: 500 });
  }
}
