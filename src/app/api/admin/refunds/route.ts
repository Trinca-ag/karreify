import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/utils/admin-verify";
import { adminDb } from "@/lib/firebase-admin";
import { adminGuardError, toIso, resolveUsers } from "@/lib/admin-referrals-server";

export const dynamic = "force-dynamic";

const STATUSES = ["requested", "approved", "rejected", "processed"];

/** Lista de reembolsos (gestão de reembolsos). Filtro opcional por ?status=. */
export async function GET(request: NextRequest) {
  try {
    await verifyAdminRequest(request);

    const status = new URL(request.url).searchParams.get("status");
    let query = adminDb
      .collection("refunds")
      .orderBy("createdAt", "desc")
      .limit(100) as FirebaseFirestore.Query;
    if (status && STATUSES.includes(status)) {
      query = adminDb
        .collection("refunds")
        .where("status", "==", status)
        .orderBy("createdAt", "desc")
        .limit(100);
    }

    const snap = await query.get();
    const docs = snap.docs;
    const users = await resolveUsers(docs.map((d) => d.data().uid as string));

    const refunds = docs.map((d) => {
      const r = d.data();
      const brief = users.get(r.uid as string);
      return {
        id: d.id,
        paymentId: (r.paymentId as string | undefined) ?? d.id,
        uid: r.uid as string,
        userName: brief?.name ?? (r.uid as string),
        userEmail: brief?.email ?? null,
        packId: (r.packId as string | undefined) ?? "",
        amountCents: (r.amountCents as number | undefined) ?? 0,
        creditsGranted: (r.creditsGranted as number | undefined) ?? 0,
        creditsUsedAtRequest: (r.creditsUsedAtRequest as number | undefined) ?? 0,
        status: (r.status as string | undefined) ?? "requested",
        reason: (r.reason as string | undefined) ?? null,
        commissionClawedBack: (r.commissionClawedBack as boolean | undefined) ?? false,
        createdAt: toIso(r.createdAt),
        decidedAt: toIso(r.decidedAt),
      };
    });

    return NextResponse.json({ refunds });
  } catch (error) {
    return adminGuardError(error, "[admin/refunds]");
  }
}
