import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { requireUser, authErrorResponse, AuthError } from "@/lib/auth-server";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  let ctx;
  try {
    ctx = await requireUser(request);
  } catch (e) {
    return authErrorResponse(e);
  }

  const rl = rateLimit(ctx.uid, { scope: "change-email-verify", limit: 5, windowMs: 60_000 });
  if (!rl.allowed) return rateLimitResponse(rl);

  try {
    const { newEmail, code } = await request.json();

    if (!newEmail || !code) {
      return NextResponse.json(
        { error: "newEmail e code são obrigatórios" },
        { status: 400 }
      );
    }

    const normalizedEmail = String(newEmail).trim().toLowerCase();
    if (normalizedEmail.length > 320) {
      return NextResponse.json({ error: "Email muito longo" }, { status: 413 });
    }

    const snapshot = await adminDb
      .collection("verificationCodes")
      .where("uid", "==", ctx.uid)
      .where("email", "==", normalizedEmail)
      .where("code", "==", String(code))
      .where("type", "==", "email-change")
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
      throw new AuthError("Código inválido ou expirado", 400);
    }

    try {
      const existing = await adminAuth.getUserByEmail(normalizedEmail);
      if (existing && existing.uid !== ctx.uid) {
        return NextResponse.json(
          { error: "Este email já está em uso por outra conta" },
          { status: 409 }
        );
      }
    } catch {
      // Not found — safe to proceed
    }

    await adminAuth.updateUser(ctx.uid, {
      email: normalizedEmail,
      emailVerified: true,
    });

    await adminDb.collection("users").doc(ctx.uid).update({
      email: normalizedEmail,
      updatedAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("Error verifying email-change code:", error);
    return NextResponse.json(
      { error: "Erro ao alterar email" },
      { status: 500 }
    );
  }
}
