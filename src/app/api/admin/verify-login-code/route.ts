import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();
    if (!email || !code) {
      return NextResponse.json({ error: "Email e código obrigatórios" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const snap = await adminDb
      .collection("verificationCodes")
      .where("email", "==", normalizedEmail)
      .where("type", "==", "admin-login")
      .get();

    for (const doc of snap.docs) {
      const data = doc.data();
      if (data.used) continue;
      if (data.code !== code) continue;
      const expiresAt = data.expiresAt?.toDate ? data.expiresAt.toDate() : new Date(data.expiresAt);
      if (expiresAt > new Date()) {
        await doc.ref.update({ used: true });
        return NextResponse.json({ success: true });
      }
    }

    return NextResponse.json({ error: "Código inválido ou expirado" }, { status: 400 });
  } catch (error) {
    console.error("verify-login-code error:", error);
    return NextResponse.json({ error: "Erro ao verificar código" }, { status: 500 });
  }
}
