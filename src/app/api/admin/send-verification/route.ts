import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { sendTransactionalEmail } from "@/lib/mailer";
import { adminVerificationEmail, adminVerificationEmailText } from "@/utils/email-templates";
import { rateLimit, rateLimitResponse, getClientIp } from "@/lib/rate-limit";

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email?.trim() || typeof email !== "string" || email.length > 320) {
      return NextResponse.json({ error: "Email obrigatório" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const ipLimit = rateLimit(getClientIp(request), { scope: "admin-verification-ip", limit: 10, windowMs: 60_000 });
    if (!ipLimit.allowed) return rateLimitResponse(ipLimit);
    const emailLimit = rateLimit(normalizedEmail, { scope: "admin-verification-email", limit: 3, windowMs: 60_000 });
    if (!emailLimit.allowed) return rateLimitResponse(emailLimit);

    // Prevent re-registration of existing admin
    const existing = await adminDb
      .collection("admins")
      .where("email", "==", normalizedEmail)
      .limit(1)
      .get();
    if (!existing.empty) {
      return NextResponse.json({ error: "Este e-mail já está cadastrado como administrador" }, { status: 409 });
    }

    const code = generateCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await adminDb.collection("verificationCodes").doc(`adminreg_${Date.now()}`).set({
      email: normalizedEmail,
      code,
      type: "admin-verification",
      expiresAt,
      used: false,
      createdAt: new Date(),
    });

    const result = await sendTransactionalEmail({
      to: normalizedEmail,
      subject: "Código de verificação — Admin Karreify",
      html: adminVerificationEmail(code),
      text: adminVerificationEmailText(code),
      fromName: "Karreify Admin",
      priority: "high",
    });

    if (result.fallback) {
      console.warn("[Admin Email] SMTP not configured. Code generated but not delivered.");
      return NextResponse.json({ success: true, fallback: true });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("send-admin-verification error:", error);
    return NextResponse.json({ error: "Erro ao enviar código" }, { status: 500 });
  }
}
