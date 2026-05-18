import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { sendTransactionalEmail } from "@/lib/mailer";
import { passwordResetEmail, passwordResetEmailText } from "@/utils/email-templates";

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email é obrigatório" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase();
    const code = generateCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Store code in Firestore via Admin SDK (bypasses security rules)
    const docId = `reset_${Date.now()}`;
    await adminDb.collection("verificationCodes").doc(docId).set({
      email: normalizedEmail,
      code,
      type: "password-reset",
      expiresAt,
      used: false,
      createdAt: new Date(),
    });

    const result = await sendTransactionalEmail({
      to: normalizedEmail,
      subject: "Recuperação de senha — NextCV",
      html: passwordResetEmail(code),
      text: passwordResetEmailText(code),
      priority: "high",
    });

    if (result.fallback) {
      console.warn(`[Email] SMTP not configured. Reset code for ${normalizedEmail}: ${code}`);
      return NextResponse.json({ success: true, fallback: true, code });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending reset code:", error);
    return NextResponse.json(
      { error: "Erro ao enviar código de recuperação" },
      { status: 500 }
    );
  }
}
