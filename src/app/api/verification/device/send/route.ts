import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { Timestamp } from "firebase-admin/firestore";
import { sendTransactionalEmail } from "@/lib/mailer";
import { verificationEmail, verificationEmailText } from "@/utils/email-templates";
import { requireUser, authErrorResponse } from "@/lib/auth-server";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const MAX_DEVICE_ID_LENGTH = 200;

export async function POST(request: NextRequest) {
  let ctx;
  try {
    ctx = await requireUser(request);
  } catch (e) {
    return authErrorResponse(e);
  }

  const rl = rateLimit(ctx.uid, { scope: "device-verify-send", limit: 5, windowMs: 60_000 });
  if (!rl.allowed) return rateLimitResponse(rl);

  if (!ctx.email) {
    return NextResponse.json({ error: "Email do usuário não disponível" }, { status: 400 });
  }

  try {
    const { deviceId } = await request.json();
    if (!deviceId || typeof deviceId !== "string" || deviceId.length > MAX_DEVICE_ID_LENGTH) {
      return NextResponse.json({ error: "Device ID inválido" }, { status: 400 });
    }

    const code = generateCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    const docId = `${ctx.uid}_${Date.now()}`;

    await adminDb.collection("verificationCodes").doc(docId).set({
      userId: ctx.uid,
      email: ctx.email,
      code,
      deviceId,
      type: "device",
      expiresAt: Timestamp.fromDate(expiresAt),
      used: false,
      createdAt: Timestamp.now(),
    });

    const result = await sendTransactionalEmail({
      to: ctx.email,
      subject: "Código de verificação — Karreify",
      html: verificationEmail(code),
      text: verificationEmailText(code),
      priority: "high",
    });

    if (result.fallback) {
      console.warn("[Email] SMTP not configured. Device code generated but not delivered.");
      return NextResponse.json({ success: true, fallback: true });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending device verification code:", error);
    return NextResponse.json({ error: "Erro ao enviar código" }, { status: 500 });
  }
}
