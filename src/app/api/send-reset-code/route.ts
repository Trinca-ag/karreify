import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { sendTransactionalEmail } from "@/lib/mailer";
import { passwordResetEmail, passwordResetEmailText } from "@/utils/email-templates";
import { rateLimit, rateLimitResponse, getClientIp } from "@/lib/rate-limit";

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string" || email.length > 320) {
      return NextResponse.json({ error: "Email é obrigatório" }, { status: 400 });
    }

    const ipLimit = rateLimit(getClientIp(request), { scope: "send-reset-code-ip", limit: 10, windowMs: 60_000 });
    if (!ipLimit.allowed) return rateLimitResponse(ipLimit);
    const emailLimit = rateLimit(email.toLowerCase(), { scope: "send-reset-code-email", limit: 3, windowMs: 60_000 });
    if (!emailLimit.allowed) return rateLimitResponse(emailLimit);

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
      subject: "Recuperação de senha — Karreify",
      html: passwordResetEmail(code),
      text: passwordResetEmailText(code),
      priority: "high",
    });

    if (result.fallback) {
      console.warn("[Email] SMTP not configured. Reset code generated but not delivered.");
      return NextResponse.json({ success: true, fallback: true });
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
