import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

export async function POST(request: NextRequest) {
  try {
    const { name, username, email, password } = await request.json();

    if (!name?.trim() || !username?.trim() || !email?.trim() || !password) {
      return NextResponse.json({ error: "Todos os campos são obrigatórios" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "A senha deve ter pelo menos 6 caracteres" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedUsername = username.toLowerCase().trim();

    // Check email not already admin
    const emailSnap = await adminDb
      .collection("admins")
      .where("email", "==", normalizedEmail)
      .limit(1)
      .get();
    if (!emailSnap.empty) {
      return NextResponse.json({ error: "Este e-mail já está cadastrado como administrador" }, { status: 409 });
    }

    // Check username uniqueness
    const usernameSnap = await adminDb
      .collection("admins")
      .where("username", "==", normalizedUsername)
      .limit(1)
      .get();
    if (!usernameSnap.empty) {
      return NextResponse.json({ error: "Username já está em uso" }, { status: 409 });
    }

    // Create Firebase Auth user
    const userRecord = await adminAuth.createUser({
      email: normalizedEmail,
      password,
      displayName: name.trim(),
    });

    // Create admin Firestore document
    await adminDb.collection("admins").doc(userRecord.uid).set({
      uid: userRecord.uid,
      name: name.trim(),
      username: normalizedUsername,
      email: normalizedEmail,
      role: "admin",
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, uid: userRecord.uid });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "";
    if (msg.includes("email-already-exists")) {
      return NextResponse.json({ error: "Este e-mail já está em uso" }, { status: 409 });
    }
    console.error("admin create error:", error);
    return NextResponse.json({ error: "Erro ao criar administrador" }, { status: 500 });
  }
}
