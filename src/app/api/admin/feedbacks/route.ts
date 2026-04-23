import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/utils/admin-verify";
import { adminDb } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    await verifyAdminRequest(request);

    const snap = await adminDb
      .collection("feedbacks")
      .orderBy("createdAt", "desc")
      .limit(500)
      .get();

    const feedbacks = snap.docs.map((d) => {
      const data = d.data();
      const createdAt =
        data.createdAt?.toDate?.()?.toISOString() ?? new Date().toISOString();
      return {
        id: d.id,
        uid: data.uid ?? "",
        userName: data.userName ?? null,
        userEmail: data.userEmail ?? "",
        rating: typeof data.rating === "number" ? data.rating : 0,
        comment: data.comment ?? "",
        createdAt,
      };
    });

    return NextResponse.json({ success: true, feedbacks });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Erro";
    if (msg === "Não autorizado" || msg === "Acesso negado") {
      return NextResponse.json({ error: msg }, { status: 403 });
    }
    return NextResponse.json({ error: "Erro ao buscar feedbacks" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await verifyAdminRequest(request);
    const { id } = await request.json();
    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }
    await adminDb.collection("feedbacks").doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Erro";
    if (msg === "Não autorizado" || msg === "Acesso negado") {
      return NextResponse.json({ error: msg }, { status: 403 });
    }
    return NextResponse.json({ error: "Erro ao excluir feedback" }, { status: 500 });
  }
}
