import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { rateLimit, rateLimitResponse, getClientIp } from "@/lib/rate-limit";
import {
  ADMIN_AUTH_LOCKOUTS_MS,
  DEFAULT_MAX_ATTEMPTS,
  USER_AUTH_LOCKOUTS_MS,
  authRateLimitResponse,
  checkAuthRateLimit,
  isAdminEmail,
  recordAuthFailure,
  recordAuthSuccess,
} from "@/lib/auth-rate-limit";

export async function POST(request: NextRequest) {
  try {
    const { email, code, newPassword } = await request.json();

    if (!email || !code || !newPassword) {
      return NextResponse.json(
        { error: "email, code e newPassword são obrigatórios" },
        { status: 400 }
      );
    }

    if (typeof email !== "string" || typeof code !== "string" || typeof newPassword !== "string") {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    if (newPassword.length < 6 || newPassword.length > 128) {
      return NextResponse.json(
        { error: "A senha deve ter entre 6 e 128 caracteres" },
        { status: 400 }
      );
    }

    // Burst limit — em paralelo ao lockout escalonado.
    const ipLimit = rateLimit(getClientIp(request), { scope: "reset-password-ip", limit: 10, windowMs: 60_000 });
    if (!ipLimit.allowed) return rateLimitResponse(ipLimit);

    const normalizedEmail = email.toLowerCase();

    // Política escalonada por scope `*-reset-verify`. Admin tem regime mais
    // rígido (começa direto em 30min).
    const isAdmin = await isAdminEmail(normalizedEmail);
    const policy = {
      scope: isAdmin ? "admin-reset-verify" : "user-reset-verify",
      maxAttempts: DEFAULT_MAX_ATTEMPTS,
      lockoutDurationsMs: isAdmin ? ADMIN_AUTH_LOCKOUTS_MS : USER_AUTH_LOCKOUTS_MS,
    };

    const check = await checkAuthRateLimit(normalizedEmail, policy);
    if (!check.allowed) return authRateLimitResponse(check);

    // Verify the reset code via Admin Firestore
    const snapshot = await adminDb
      .collection("verificationCodes")
      .where("email", "==", normalizedEmail)
      .where("code", "==", code)
      .where("type", "==", "password-reset")
      .where("used", "==", false)
      .get();

    let codeValid = false;

    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      const expiresAt = data.expiresAt?.toDate
        ? data.expiresAt.toDate()
        : new Date(data.expiresAt);

      if (expiresAt > new Date()) {
        await docSnap.ref.update({ used: true });
        codeValid = true;
        break;
      }
    }

    if (!codeValid) {
      const failResult = await recordAuthFailure(normalizedEmail, policy);
      if (!failResult.allowed) return authRateLimitResponse(failResult);
      return NextResponse.json(
        { error: "Código inválido ou expirado" },
        { status: 400 }
      );
    }

    // Update password via Admin SDK
    const userRecord = await adminAuth.getUserByEmail(normalizedEmail);
    await adminAuth.updateUser(userRecord.uid, { password: newPassword });

    // Sucesso — limpa tentativas tanto do verify quanto do send (o usuário
    // pode ter pedido reset várias vezes antes de acertar).
    await Promise.all([
      recordAuthSuccess(normalizedEmail, policy.scope),
      recordAuthSuccess(normalizedEmail, isAdmin ? "admin-reset-send" : "user-reset-send"),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error resetting password:", error);
    return NextResponse.json(
      { error: "Erro ao redefinir senha" },
      { status: 500 }
    );
  }
}
