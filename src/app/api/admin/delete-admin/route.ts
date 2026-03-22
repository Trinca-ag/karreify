import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/utils/admin-verify";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

export async function DELETE(request: NextRequest) {
  try {
    const caller = await verifyAdminRequest(request);
    const { uid } = await request.json();

    if (!uid) return NextResponse.json({ error: "UID obrigatório" }, { status: 400 });
    if (uid === caller.uid) {
      return NextResponse.json({ error: "Não é possível remover sua própria conta de admin" }, { status: 400 });
    }

    // Check if this is the last admin
    const adminsSnap = await adminDb.collection("admins").count().get();
    if (adminsSnap.data().count <= 1) {
      return NextResponse.json({ error: "Não é possível remover o último administrador" }, { status: 400 });
    }

    try {
      await adminAuth.deleteUser(uid);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      if (!msg.includes("user-not-found")) throw err;
    }

    await adminDb.doc(`admins/${uid}`).delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Erro";
    if (msg === "Não autorizado" || msg === "Acesso negado") {
      return NextResponse.json({ error: msg }, { status: 403 });
    }
    console.error("delete-admin error:", error);
    return NextResponse.json({ error: "Erro ao remover administrador" }, { status: 500 });
  }
}
