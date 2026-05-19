import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/utils/admin-verify";
import { adminDb } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    await verifyAdminRequest(request);

    const snap = await adminDb
      .collection("talents")
      .orderBy("createdAt", "desc")
      .limit(1000)
      .get();

    const talents = snap.docs.map((d) => {
      const data = d.data();
      const createdAt =
        data.createdAt?.toDate?.()?.toISOString() ?? new Date().toISOString();
      const updatedAt =
        data.updatedAt?.toDate?.()?.toISOString() ?? createdAt;
      return {
        id: d.id,
        fullName: data.fullName ?? "",
        email: data.email ?? "",
        phone: data.phone ?? "",
        profession: data.profession ?? "",
        links: Array.isArray(data.links) ? data.links : [],
        source: data.source ?? "",
        createdAt,
        updatedAt,
      };
    });

    return NextResponse.json({ success: true, talents });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Erro";
    if (msg === "Não autorizado" || msg === "Acesso negado") {
      return NextResponse.json({ error: msg }, { status: 403 });
    }
    return NextResponse.json({ error: "Erro ao buscar talentos" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await verifyAdminRequest(request);
    const { id } = await request.json();
    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }
    await adminDb.collection("talents").doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Erro";
    if (msg === "Não autorizado" || msg === "Acesso negado") {
      return NextResponse.json({ error: msg }, { status: 403 });
    }
    return NextResponse.json({ error: "Erro ao excluir talento" }, { status: 500 });
  }
}
