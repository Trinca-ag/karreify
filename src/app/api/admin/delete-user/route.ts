import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/utils/admin-verify";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function DELETE(request: NextRequest) {
  try {
    const caller = await verifyAdminRequest(request);
    const { uid } = await request.json();

    if (!uid) {
      return NextResponse.json({ error: "UID obrigatório" }, { status: 400 });
    }
    if (uid === caller.uid) {
      return NextResponse.json({ error: "Não é possível excluir sua própria conta" }, { status: 400 });
    }

    // Delete Firebase Auth user (ignore if already deleted)
    try {
      await adminAuth.deleteUser(uid);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      if (!msg.includes("user-not-found")) throw err;
    }

    // Delete Firestore user document
    await adminDb.doc(`users/${uid}`).delete();

    // Decrement stats
    const statsRef = adminDb.doc("stats/global");
    try {
      await statsRef.update({ totalUsers: FieldValue.increment(-1) });
    } catch { /* stats doc may not exist yet */ }

    return NextResponse.json({ success: true });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Erro";
    if (msg === "Não autorizado" || msg === "Acesso negado") {
      return NextResponse.json({ error: msg }, { status: 403 });
    }
    console.error("delete-user error:", error);
    return NextResponse.json({ error: "Erro ao excluir usuário" }, { status: 500 });
  }
}
