import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { sendTransactionalEmail } from "@/lib/mailer";
import { adminVerificationEmail, adminVerificationEmailText } from "@/utils/email-templates";
import { rateLimit, rateLimitResponse, getClientIp } from "@/lib/rate-limit";
import {
  ADMIN_AUTH_LOCKOUTS_MS,
  DEFAULT_MAX_ATTEMPTS,
  authRateLimitResponse,
  checkAuthRateLimit,
  recordAuthFailure,
} from "@/lib/auth-rate-limit";

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const ADMIN_LOGIN_SEND_POLICY = {
  scope: "admin-login-send",
  maxAttempts: DEFAULT_MAX_ATTEMPTS,
  lockoutDurationsMs: ADMIN_AUTH_LOCKOUTS_MS,
};

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email?.trim() || typeof email !== "string" || email.length > 320) {
      return NextResponse.json({ error: "Email obrigatório" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Burst limit em paralelo ao escalonado.
    const ipLimit = rateLimit(getClientIp(request), { scope: "admin-login-code-ip", limit: 10, windowMs: 60_000 });
    if (!ipLimit.allowed) return rateLimitResponse(ipLimit);

    const check = await checkAuthRateLimit(normalizedEmail, ADMIN_LOGIN_SEND_POLICY);
    if (!check.allowed) return authRateLimitResponse(check);

    // Cada envio conta como tentativa (anti-abuso de SMTP). Login bem-sucedido
    // em /api/admin/verify-login-code limpa esse contador.
    const recordResult = await recordAuthFailure(normalizedEmail, ADMIN_LOGIN_SEND_POLICY);
    if (!recordResult.allowed) return authRateLimitResponse(recordResult);

    // Ensure the email belongs to an existing admin
    const adminSnap = await adminDb
      .collection("admins")
      .where("email", "==", normalizedEmail)
      .limit(1)
      .get();
    if (adminSnap.empty) {
      return NextResponse.json({ error: "Administrador não encontrado" }, { status: 404 });
    }

    const code = generateCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await adminDb.collection("verificationCodes").doc(`adminlogin_${Date.now()}`).set({
      email: normalizedEmail,
      code,
      type: "admin-login",
      expiresAt,
      used: false,
      createdAt: new Date(),
    });

    const result = await sendTransactionalEmail({
      to: normalizedEmail,
      subject: "Código de acesso — Admin Karreify",
      html: adminVerificationEmail(code),
      text: adminVerificationEmailText(code),
      fromName: "Karreify Admin",
      priority: "high",
    });

    if (result.fallback) {
      console.warn("[Admin Login] SMTP not configured. Code generated but not delivered.");
      return NextResponse.json({ success: true, fallback: true });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("send-login-code error:", error);
    return NextResponse.json({ error: "Erro ao enviar código" }, { status: 500 });
  }
}
