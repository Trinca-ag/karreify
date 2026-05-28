import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { sendTransactionalEmail } from "@/lib/mailer";
import { passwordResetEmail, passwordResetEmailText } from "@/utils/email-templates";
import { rateLimit, rateLimitResponse, getClientIp } from "@/lib/rate-limit";
import {
  ADMIN_AUTH_LOCKOUTS_MS,
  DEFAULT_MAX_ATTEMPTS,
  USER_AUTH_LOCKOUTS_MS,
  authRateLimitResponse,
  checkAuthRateLimit,
  isAdminEmail,
  recordAuthFailure,
} from "@/lib/auth-rate-limit";

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Verifica se o email pertence a alguma conta (user ou admin). Usado pra
 * impedir reset em emails inexistentes — sem essa checagem, o user recebia
 * "código enviado" mesmo digitando errado e ficava esperando email que
 * nunca chega.
 */
async function emailHasAccount(email: string): Promise<boolean> {
  try {
    await adminAuth.getUserByEmail(email);
    return true;
  } catch {
    // getUserByEmail lança quando não existe. Cai pra lookup direto na
    // coleção admins (admin pode ter cadastro só lá em edge cases).
    const adminSnap = await adminDb
      .collection("admins")
      .where("email", "==", email)
      .limit(1)
      .get();
    return !adminSnap.empty;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, context } = await request.json();

    if (!email || typeof email !== "string" || email.length > 320) {
      return NextResponse.json({ error: "Email é obrigatório" }, { status: 400 });
    }

    // Context vem da UI ("admin" do /admin/login, "user" / undefined do /auth/reset-password).
    // Decide a policy aplicada quando o email NÃO existe (não dá pra fazer
    // lookup admin/user nesse caso). Quando o email existe, usamos lookup
    // direto pra escolher policy.
    const isAdminContext = context === "admin";

    // Burst limit (anti-spam de IP) — segura ataques tipo "spam um email a cada
    // 100ms" antes de chegar no lockout escalonado.
    const ipLimit = rateLimit(getClientIp(request), { scope: "send-reset-code-ip", limit: 10, windowMs: 60_000 });
    if (!ipLimit.allowed) return rateLimitResponse(ipLimit);

    const normalizedEmail = email.toLowerCase().trim();
    const ip = getClientIp(request);

    // ─── Tentativas com email inexistente — bloqueio por IP ─────────────
    // Atacante varia o email pra enumerar contas → bate aqui. Identifier = IP.
    const notFoundPolicy = {
      scope: isAdminContext ? "admin-reset-not-found" : "user-reset-not-found",
      maxAttempts: DEFAULT_MAX_ATTEMPTS,
      lockoutDurationsMs: isAdminContext ? ADMIN_AUTH_LOCKOUTS_MS : USER_AUTH_LOCKOUTS_MS,
    };

    const notFoundCheck = await checkAuthRateLimit(ip, notFoundPolicy);
    if (!notFoundCheck.allowed) return authRateLimitResponse(notFoundCheck);

    const accountExists = await emailHasAccount(normalizedEmail);
    if (!accountExists) {
      // Conta tentativa de "email inexistente" pra esse IP. Quando bater
      // maxAttempts → escala o bloqueio.
      const failResult = await recordAuthFailure(ip, notFoundPolicy);
      if (!failResult.allowed) return authRateLimitResponse(failResult);
      return NextResponse.json(
        {
          error: "Esta conta não está cadastrada.",
          code: "ACCOUNT_NOT_FOUND",
          attemptsRemaining: failResult.attemptsRemaining,
        },
        { status: 404 }
      );
    }

    // ─── Email existe — fluxo normal de envio (rate-limit por email) ────
    // Política escalonada: admin tem regime mais rígido (sem o degrau de 5min).
    const isAdmin = await isAdminEmail(normalizedEmail);
    const policy = {
      scope: isAdmin ? "admin-reset-send" : "user-reset-send",
      maxAttempts: DEFAULT_MAX_ATTEMPTS,
      lockoutDurationsMs: isAdmin ? ADMIN_AUTH_LOCKOUTS_MS : USER_AUTH_LOCKOUTS_MS,
    };

    const check = await checkAuthRateLimit(normalizedEmail, policy);
    if (!check.allowed) return authRateLimitResponse(check);

    // Cada envio conta como tentativa. O reset bem-sucedido em /api/reset-password
    // limpa esse contador (recordAuthSuccess), então usuário legítimo não fica
    // travado pelos envios prévios.
    const recordResult = await recordAuthFailure(normalizedEmail, policy);
    if (!recordResult.allowed) return authRateLimitResponse(recordResult);
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
