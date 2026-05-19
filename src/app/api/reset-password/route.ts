import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { rateLimit, rateLimitResponse, getClientIp } from "@/lib/rate-limit";

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

    const ipLimit = rateLimit(getClientIp(request), { scope: "reset-password-ip", limit: 10, windowMs: 60_000 });
    if (!ipLimit.allowed) return rateLimitResponse(ipLimit);
    const emailLimit = rateLimit(email.toLowerCase(), { scope: "reset-password-email", limit: 5, windowMs: 60_000 });
    if (!emailLimit.allowed) return rateLimitResponse(emailLimit);

    const normalizedEmail = email.toLowerCase();

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
      return NextResponse.json(
        { error: "Código inválido ou expirado" },
        { status: 400 }
      );
    }

    // Update password via Admin SDK
    const userRecord = await adminAuth.getUserByEmail(normalizedEmail);
    await adminAuth.updateUser(userRecord.uid, { password: newPassword });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error resetting password:", error);
    return NextResponse.json(
      { error: "Erro ao redefinir senha" },
      { status: 500 }
    );
  }
}
