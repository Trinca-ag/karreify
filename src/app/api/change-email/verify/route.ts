import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

export async function POST(request: NextRequest) {
  try {
    const { uid, newEmail, code } = await request.json();

    if (!uid || !newEmail || !code) {
      return NextResponse.json(
        { error: "uid, newEmail e code são obrigatórios" },
        { status: 400 }
      );
    }

    const normalizedEmail = String(newEmail).trim().toLowerCase();

    const snapshot = await adminDb
      .collection("verificationCodes")
      .where("uid", "==", uid)
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
      return NextResponse.json(
        { error: "Código inválido ou expirado" },
        { status: 400 }
      );
    }

    // Double-check the email isn't taken between send-code and now
    try {
      const existing = await adminAuth.getUserByEmail(normalizedEmail);
      if (existing && existing.uid !== uid) {
        return NextResponse.json(
          { error: "Este email já está em uso por outra conta" },
          { status: 409 }
        );
      }
    } catch {
      // Not found — safe to proceed
    }

    await adminAuth.updateUser(uid, {
      email: normalizedEmail,
      emailVerified: true,
    });

    await adminDb.collection("users").doc(uid).update({
      email: normalizedEmail,
      updatedAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error verifying email-change code:", error);
    return NextResponse.json(
      { error: "Erro ao alterar email" },
      { status: 500 }
    );
  }
}
