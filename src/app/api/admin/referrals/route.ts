import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/utils/admin-verify";
import { adminDb } from "@/lib/firebase-admin";
import { adminGuardError, toIso, resolveUsers } from "@/lib/admin-referrals-server";

export const dynamic = "force-dynamic";

/** Lista as indicações (gestão de indicações). */
export async function GET(request: NextRequest) {
  try {
    await verifyAdminRequest(request);

    const snap = await adminDb
      .collection("referrals")
      .orderBy("createdAt", "desc")
      .limit(100)
      .get();

    const docs = snap.docs;
    const users = await resolveUsers(
      docs.flatMap((d) => [d.data().referrerUid as string, d.data().referredUid as string])
    );

    const referrals = docs.map((d) => {
      const r = d.data();
      return {
        id: d.id,
        referrerUid: r.referrerUid as string,
        referrerName: users.get(r.referrerUid as string)?.name ?? (r.referrerUid as string),
        referredUid: r.referredUid as string,
        referredName: users.get(r.referredUid as string)?.name ?? (r.referredUid as string),
        code: (r.code as string | undefined) ?? "",
        status: (r.status as string | undefined) ?? "attributed",
        createdAt: toIso(r.createdAt),
        convertedAt: toIso(r.convertedAt),
      };
    });

    return NextResponse.json({ referrals });
  } catch (error) {
    return adminGuardError(error, "[admin/referrals]");
  }
}
