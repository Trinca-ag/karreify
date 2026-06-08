import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/utils/admin-verify";
import { adminDb } from "@/lib/firebase-admin";
import { adminGuardError, toIso, resolveUsers } from "@/lib/admin-referrals-server";

export const dynamic = "force-dynamic";

/** Visualizador de auditoria financeira (paginado por cursor `before`=ISO). */
export async function GET(request: NextRequest) {
  try {
    await verifyAdminRequest(request);

    const before = new URL(request.url).searchParams.get("before");
    let query = adminDb
      .collection("auditLogs")
      .orderBy("createdAt", "desc")
      .limit(50) as FirebaseFirestore.Query;
    if (before) {
      const beforeDate = new Date(before);
      if (!Number.isNaN(beforeDate.getTime())) {
        query = adminDb
          .collection("auditLogs")
          .orderBy("createdAt", "desc")
          .startAfter(beforeDate)
          .limit(50);
      }
    }

    const snap = await query.get();
    const docs = snap.docs;
    const users = await resolveUsers(
      docs.flatMap((d) => [
        d.data().actorUid as string,
        (d.data().affectedUid as string | undefined) ?? "",
      ])
    );

    const logs = docs.map((d) => {
      const l = d.data();
      const actorBrief = users.get(l.actorUid as string);
      const affectedUid = (l.affectedUid as string | undefined) ?? null;
      return {
        id: d.id,
        actorUid: l.actorUid as string,
        actorType: (l.actorType as string | undefined) ?? "system",
        actorName: actorBrief?.name ?? (l.actorUid as string),
        action: (l.action as string | undefined) ?? "",
        targetType: (l.targetType as string | undefined) ?? "",
        targetId: (l.targetId as string | undefined) ?? "",
        affectedUid,
        affectedName: affectedUid ? users.get(affectedUid)?.name ?? affectedUid : null,
        amountCents: (l.amountCents as number | undefined) ?? null,
        notes: (l.notes as string | undefined) ?? null,
        createdAt: toIso(l.createdAt),
      };
    });

    const last = docs[docs.length - 1];
    const nextCursor = docs.length === 50 ? toIso(last?.data().createdAt) : null;

    return NextResponse.json({ logs, nextCursor });
  } catch (error) {
    return adminGuardError(error, "[admin/audit-logs]");
  }
}
