import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/utils/admin-verify";
import { adminDb } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    await verifyAdminRequest(request);

    const [statsSnap, adminsSnap, recentUsersSnap] = await Promise.all([
      adminDb.doc("stats/global").get(),
      adminDb.collection("admins").get(),
      adminDb.collection("users").orderBy("createdAt", "desc").limit(5).get(),
    ]);

    const stats = statsSnap.data() ?? {};

    const recentUsers = recentUsersSnap.docs.map(d => {
      const data = d.data();
      const createdAt = data.createdAt?.toDate?.()?.toISOString() ?? new Date().toISOString();
      return {
        uid: d.id,
        displayName: data.displayName ?? null,
        email: data.email ?? "",
        plan: data.plan ?? "free",
        credits: data.credits ?? 0,
        createdAt,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        totalUsers: stats.totalUsers ?? 0,
        totalAdmins: adminsSnap.size,
        totalCreditsUsed: stats.totalCreditsUsed ?? 0,
        featureUsage: stats.featureUsage ?? {},
        recentUsers,
      },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Erro";
    if (msg === "Não autorizado" || msg === "Acesso negado") {
      return NextResponse.json({ error: msg }, { status: 403 });
    }
    console.error("admin stats error:", error);
    return NextResponse.json({ error: "Erro ao buscar estatísticas" }, { status: 500 });
  }
}
