import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { rateLimit, rateLimitResponse, getClientIp } from "@/lib/rate-limit";
import {
  ADMIN_AUTH_LOCKOUTS_MS,
  DEFAULT_MAX_ATTEMPTS,
  authRateLimitResponse,
  checkAuthRateLimit,
  recordAuthFailure,
  recordAuthSuccess,
} from "@/lib/auth-rate-limit";

const ADMIN_LOGIN_VERIFY_POLICY = {
  scope: "admin-login-verify",
  maxAttempts: DEFAULT_MAX_ATTEMPTS,
  lockoutDurationsMs: ADMIN_AUTH_LOCKOUTS_MS,
};

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();
    if (!email || !code) {
      return NextResponse.json({ error: "Email e código obrigatórios" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Burst limit anti-bruteforce de 6 dígitos.
    const ipLimit = rateLimit(getClientIp(request), { scope: "admin-verify-code-ip", limit: 20, windowMs: 60_000 });
    if (!ipLimit.allowed) return rateLimitResponse(ipLimit);

    const check = await checkAuthRateLimit(normalizedEmail, ADMIN_LOGIN_VERIFY_POLICY);
    if (!check.allowed) return authRateLimitResponse(check);

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
        // Sucesso — zera ambos os contadores (send e verify).
        await Promise.all([
          recordAuthSuccess(normalizedEmail, ADMIN_LOGIN_VERIFY_POLICY.scope),
          recordAuthSuccess(normalizedEmail, "admin-login-send"),
        ]);
        return NextResponse.json({ success: true });
      }
    }

    // Código não bateu — incrementa contador escalonado.
    const failResult = await recordAuthFailure(normalizedEmail, ADMIN_LOGIN_VERIFY_POLICY);
    if (!failResult.allowed) return authRateLimitResponse(failResult);

    return NextResponse.json({ error: "Código inválido ou expirado" }, { status: 400 });
  } catch (error) {
    console.error("verify-login-code error:", error);
    return NextResponse.json({ error: "Erro ao verificar código" }, { status: 500 });
  }
}
