import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();
    if (!username?.trim()) {
      return NextResponse.json({ error: "Username obrigatório" }, { status: 400 });
    }

    const snap = await adminDb
      .collection("admins")
      .where("username", "==", username.toLowerCase().trim())
      .limit(1)
      .get();

    if (snap.empty) {
      return NextResponse.json({ error: "Administrador não encontrado" }, { status: 404 });
    }

    return NextResponse.json({ email: snap.docs[0].data().email });
  } catch (error) {
    console.error("get-email error:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
