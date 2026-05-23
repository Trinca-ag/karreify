import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/utils/admin-verify";
import { adminDb } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

const ALLOWED_STATUS = new Set(["new", "read", "resolved"]);

export async function GET(request: NextRequest) {
  try {
    await verifyAdminRequest(request);

    const snap = await adminDb
      .collection("contact_messages")
      .orderBy("createdAt", "desc")
      .limit(500)
      .get();

    const messages = snap.docs.map((d) => {
      const data = d.data();
      const createdAt =
        data.createdAt?.toDate?.()?.toISOString() ?? new Date().toISOString();
      return {
        id: d.id,
        name: data.name ?? "",
        email: data.email ?? "",
        subject: data.subject ?? "",
        message: data.message ?? "",
        topic: data.topic ?? "help",
        status: data.status ?? "new",
        ip: data.ip ?? "",
        userAgent: data.userAgent ?? "",
        createdAt,
      };
    });

    return NextResponse.json({ success: true, messages });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Erro";
    if (msg === "Não autorizado" || msg === "Acesso negado") {
      return NextResponse.json({ error: msg }, { status: 403 });
    }
    return NextResponse.json(
      { error: "Erro ao buscar mensagens" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await verifyAdminRequest(request);
    const { id, status } = await request.json();
    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }
    if (typeof status !== "string" || !ALLOWED_STATUS.has(status)) {
      return NextResponse.json({ error: "Status inválido" }, { status: 400 });
    }
    await adminDb.collection("contact_messages").doc(id).update({ status });
    return NextResponse.json({ success: true });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Erro";
    if (msg === "Não autorizado" || msg === "Acesso negado") {
      return NextResponse.json({ error: msg }, { status: 403 });
    }
    return NextResponse.json(
      { error: "Erro ao atualizar mensagem" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await verifyAdminRequest(request);
    const { id } = await request.json();
    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }
    await adminDb.collection("contact_messages").doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Erro";
    if (msg === "Não autorizado" || msg === "Acesso negado") {
      return NextResponse.json({ error: msg }, { status: 403 });
    }
    return NextResponse.json(
      { error: "Erro ao excluir mensagem" },
      { status: 500 }
    );
  }
}
