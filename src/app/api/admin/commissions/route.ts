import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/utils/admin-verify";
import { adminDb } from "@/lib/firebase-admin";
import { adminGuardError, toIso, resolveUsers } from "@/lib/admin-referrals-server";

export const dynamic = "force-dynamic";

const STATUSES = ["held", "released", "reversed", "cancelled"];

/** Lista de comissões (gestão de comissões). Filtro opcional por ?status=. */
export async function GET(request: NextRequest) {
  try {
    await verifyAdminRequest(request);

    const status = new URL(request.url).searchParams.get("status");
    let query = adminDb
      .collection("commissions")
      .orderBy("createdAt", "desc")
      .limit(100) as FirebaseFirestore.Query;
    if (status && STATUSES.includes(status)) {
      query = adminDb
        .collection("commissions")
        .where("status", "==", status)
        .orderBy("createdAt", "desc")
        .limit(100);
    }

    const snap = await query.get();
    const docs = snap.docs;
    const users = await resolveUsers(
      docs.flatMap((d) => [d.data().referrerUid as string, d.data().referredUid as string])
    );

    const commissions = docs.map((d) => {
      const c = d.data();
      return {
        id: d.id,
        referrerUid: c.referrerUid as string,
        referrerName: users.get(c.referrerUid as string)?.name ?? (c.referrerUid as string),
        referredUid: c.referredUid as string,
        referredName: users.get(c.referredUid as string)?.name ?? (c.referredUid as string),
        sourcePaymentId: (c.sourcePaymentId as string | undefined) ?? d.id,
        packId: (c.packId as string | undefined) ?? "",
        amountCents: (c.amountCents as number | undefined) ?? 0,
        status: (c.status as string | undefined) ?? "held",
        holdUntil: (c.holdUntil as number | undefined) ?? null,
        createdAt: toIso(c.createdAt),
        releasedAt: toIso(c.releasedAt),
        reversedAt: toIso(c.reversedAt),
      };
    });

    return NextResponse.json({ commissions });
  } catch (error) {
    return adminGuardError(error, "[admin/commissions]");
  }
}
