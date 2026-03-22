import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/utils/admin-verify";
import { adminDb } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    await verifyAdminRequest(request);

    const snap = await adminDb.collection("users").orderBy("createdAt", "desc").limit(100).get();

    const users = snap.docs.map(d => {
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

    return NextResponse.json({ success: true, users });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Erro";
    if (msg === "Não autorizado" || msg === "Acesso negado") {
      return NextResponse.json({ error: msg }, { status: 403 });
    }
    return NextResponse.json({ error: "Erro ao buscar usuários" }, { status: 500 });
  }
}
