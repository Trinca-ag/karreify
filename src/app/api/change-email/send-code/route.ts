import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { sendTransactionalEmail } from "@/lib/mailer";
import { emailChangeEmail, emailChangeEmailText } from "@/utils/email-templates";

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const { uid, newEmail } = await request.json();

    if (!uid || !newEmail) {
      return NextResponse.json(
        { error: "uid e newEmail são obrigatórios" },
        { status: 400 }
      );
    }

    const normalizedEmail = String(newEmail).trim().toLowerCase();

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      return NextResponse.json(
        { error: "Email inválido" },
        { status: 400 }
      );
    }

    // Make sure the requested email isn't the same as the current one
    const currentUser = await adminAuth.getUser(uid).catch(() => null);
    if (!currentUser) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    if (currentUser.email?.toLowerCase() === normalizedEmail) {
      return NextResponse.json(
        { error: "O novo email é igual ao atual" },
        { status: 400 }
      );
    }

    // Make sure the new email isn't taken
    try {
      const existing = await adminAuth.getUserByEmail(normalizedEmail);
      if (existing) {
        return NextResponse.json(
          { error: "Este email já está em uso por outra conta" },
          { status: 409 }
        );
      }
    } catch {
      // getUserByEmail throws when not found — that's the happy path
    }

    const code = generateCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const docId = `email-change_${uid}_${Date.now()}`;
    await adminDb.collection("verificationCodes").doc(docId).set({
      uid,
      email: normalizedEmail,
      code,
      type: "email-change",
      expiresAt,
      used: false,
      createdAt: new Date(),
    });

    const result = await sendTransactionalEmail({
      to: normalizedEmail,
      subject: "Confirmação de novo email — NextCV",
      html: emailChangeEmail(code),
      text: emailChangeEmailText(code),
      priority: "high",
    });

    if (result.fallback) {
      console.warn(`[Email] SMTP not configured. Email-change code for ${normalizedEmail}: ${code}`);
      return NextResponse.json({ success: true, fallback: true, code });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending email-change code:", error);
    return NextResponse.json(
      { error: "Erro ao enviar código" },
      { status: 500 }
    );
  }
}
