import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import nodemailer from "nodemailer";
import { passwordResetEmail } from "@/utils/email-templates";

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function getTransporter() {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  if (!user || !pass) return null;

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT || "587"),
    secure: false,
    auth: { user, pass },
  });
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email é obrigatório" }, { status: 400 });
    }

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

    // Send email
    const transporter = getTransporter();
    const html = passwordResetEmail(code);

    if (!transporter) {
      console.warn(`[Email] SMTP not configured. Reset code for ${normalizedEmail}: ${code}`);
      return NextResponse.json({ success: true, fallback: true, code });
    }

    await transporter.sendMail({
      from: `"NextCV" <${process.env.EMAIL_USER}>`,
      to: normalizedEmail,
      subject: "Recuperação de senha — NextCV",
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending reset code:", error);
    return NextResponse.json(
      { error: "Erro ao enviar código de recuperação" },
      { status: 500 }
    );
  }
}
