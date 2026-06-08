import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { Timestamp } from "firebase-admin/firestore";
import { requireUser, authErrorResponse } from "@/lib/auth-server";
import { resolveUsers, maskName } from "@/lib/admin-referrals-server";

export const dynamic = "force-dynamic";

function toIso(v: unknown): string | null {
  return v instanceof Timestamp ? v.toDate().toISOString() : null;
}

/**
 * Histórico de comissões do indicador (seção 6). O nome do comprador é exibido
 * MASCARADO por privacidade (ex.: "Matheus" → "Mat*****").
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
      .collection("commissions")
      .where("referrerUid", "==", ctx.uid)
      .orderBy("createdAt", "desc")
      .limit(50)
      .get();

    const docs = snap.docs;
    const users = await resolveUsers(docs.map((d) => d.data().referredUid as string));

    const commissions = docs.map((d) => {
      const c = d.data();
      const buyer = users.get(c.referredUid as string);
      return {
        id: d.id,
        amountCents: (c.amountCents as number | undefined) ?? 0,
        packId: (c.packId as string | undefined) ?? "",
        status: (c.status as string | undefined) ?? "held",
        maskedBuyer: maskName(buyer?.name ?? ""),
        holdUntil: (c.holdUntil as number | undefined) ?? null,
        createdAt: toIso(c.createdAt),
        releasedAt: toIso(c.releasedAt),
      };
    });

    return NextResponse.json({ commissions });
  } catch (error) {
    console.error("[commissions]", error);
    return NextResponse.json({ error: "Erro ao carregar comissões" }, { status: 500 });
  }
}
