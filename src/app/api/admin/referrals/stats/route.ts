import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/utils/admin-verify";
import { adminDb } from "@/lib/firebase-admin";
import { REFERRAL_CREDITS } from "@/types";

export const dynamic = "force-dynamic";

function adminError(error: unknown, ctx: string) {
  const msg = error instanceof Error ? error.message : "Erro";
  if (msg === "Não autorizado" || msg === "Acesso negado") {
    return NextResponse.json({ error: msg }, { status: 403 });
  }
  console.error(ctx, error);
  return NextResponse.json({ error: "Erro ao carregar métricas" }, { status: 500 });
}

/** Métricas do dashboard de indicação. Escaneia até SCAN docs (sistema jovem);
 *  agrega por código em memória. Os tops trazem nome resolvido. */
export async function GET(request: NextRequest) {
  try {
    await verifyAdminRequest(request);

    const SCAN = 3000;
    const [refsSnap, commsSnap, wReq, wApp, wPaid, rReq] = await Promise.all([
      adminDb.collection("referrals").limit(SCAN).get(),
      adminDb.collection("commissions").limit(SCAN).get(),
      adminDb.collection("withdrawals").where("status", "==", "requested").count().get(),
      adminDb.collection("withdrawals").where("status", "==", "approved").count().get(),
      adminDb.collection("withdrawals").where("status", "==", "paid").count().get(),
      adminDb.collection("refunds").where("status", "==", "requested").count().get(),
    ]);

    const totalReferrals = refsSnap.size;
    const convertedReferrals = refsSnap.docs.filter((d) => d.data().status === "converted").length;
    const referralCountByUser = new Map<string, number>();
    for (const d of refsSnap.docs) {
      const uid = d.data().referrerUid as string;
      referralCountByUser.set(uid, (referralCountByUser.get(uid) ?? 0) + 1);
    }
    const topReferrers = Array.from(referralCountByUser.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([uid, count]) => ({ uid, count }));

    let generatedCents = 0,
      heldCents = 0,
      releasedCents = 0,
      reversedCents = 0;
    const commByUser = new Map<string, number>();
    for (const d of commsSnap.docs) {
      const c = d.data();
      const amt = (c.amountCents as number | undefined) ?? 0;
      generatedCents += amt;
      if (c.status === "held") heldCents += amt;
      else if (c.status === "released") releasedCents += amt;
      else if (c.status === "reversed" || c.status === "cancelled") reversedCents += amt;
      if (c.status !== "reversed" && c.status !== "cancelled") {
        commByUser.set(c.referrerUid as string, (commByUser.get(c.referrerUid as string) ?? 0) + amt);
      }
    }
    const topEarners = Array.from(commByUser.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([uid, amountCents]) => ({ uid, amountCents }));

    // Resolve nomes dos tops.
    const topUids = Array.from(
      new Set([...topReferrers.map((t) => t.uid), ...topEarners.map((t) => t.uid)])
    );
    const nameByUid = new Map<string, string>();
    if (topUids.length) {
      const userSnaps = await adminDb.getAll(
        ...topUids.map((u) => adminDb.collection("users").doc(u))
      );
      userSnaps.forEach((s) => {
        if (s.exists) {
          nameByUid.set(
            s.id,
            (s.data()?.displayName as string | undefined) ||
              (s.data()?.email as string | undefined) ||
              s.id
          );
        }
      });
    }

    return NextResponse.json({
      referrals: {
        total: totalReferrals,
        converted: convertedReferrals,
        creditsDistributed: totalReferrals * REFERRAL_CREDITS,
      },
      commissions: { generatedCents, heldCents, releasedCents, reversedCents },
      pending: {
        withdrawalsRequested: wReq.data().count,
        withdrawalsApproved: wApp.data().count,
        withdrawalsPaid: wPaid.data().count,
        refundsRequested: rReq.data().count,
      },
      topReferrers: topReferrers.map((t) => ({ ...t, name: nameByUid.get(t.uid) ?? t.uid })),
      topEarners: topEarners.map((t) => ({ ...t, name: nameByUid.get(t.uid) ?? t.uid })),
      capped: refsSnap.size >= SCAN || commsSnap.size >= SCAN,
    });
  } catch (error) {
    return adminError(error, "[admin/referrals/stats]");
  }
}
