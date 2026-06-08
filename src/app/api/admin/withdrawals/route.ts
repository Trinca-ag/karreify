import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/utils/admin-verify";
import { adminDb } from "@/lib/firebase-admin";
import { adminGuardError, toIso, resolveUsers } from "@/lib/admin-referrals-server";

export const dynamic = "force-dynamic";

const STATUSES = ["requested", "approved", "paid", "rejected"];

/** Lista de saques (gestão de saques). Filtro opcional por ?status=. */
export async function GET(request: NextRequest) {
  try {
    await verifyAdminRequest(request);

    const status = new URL(request.url).searchParams.get("status");
    let query = adminDb
      .collection("withdrawals")
      .orderBy("requestedAt", "desc")
      .limit(100) as FirebaseFirestore.Query;
    if (status && STATUSES.includes(status)) {
      query = adminDb
        .collection("withdrawals")
        .where("status", "==", status)
        .orderBy("requestedAt", "desc")
        .limit(100);
    }

    const snap = await query.get();
    const docs = snap.docs;
    const users = await resolveUsers(docs.map((d) => d.data().uid as string));

    const withdrawals = docs.map((d) => {
      const w = d.data();
      const brief = users.get(w.uid as string);
      return {
        id: d.id,
        uid: w.uid as string,
        userName: brief?.name ?? (w.uid as string),
        userEmail: brief?.email ?? null,
        amountCents: (w.amountCents as number | undefined) ?? 0,
        pixKey: (w.pixKey as string | undefined) ?? "",
        pixKeyType: (w.pixKeyType as string | undefined) ?? "",
        status: (w.status as string | undefined) ?? "requested",
        requestedAt: toIso(w.requestedAt),
        decidedAt: toIso(w.decidedAt),
        paidAt: toIso(w.paidAt),
        rejectReason: (w.rejectReason as string | undefined) ?? null,
        payoutRef: (w.payoutRef as string | undefined) ?? null,
      };
    });

    return NextResponse.json({ withdrawals });
  } catch (error) {
    return adminGuardError(error, "[admin/withdrawals]");
  }
}
