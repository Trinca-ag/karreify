import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { adminVerificationEmail } from "@/utils/email-templates";
import nodemailer from "nodemailer";

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
    if (!email?.trim()) {
      return NextResponse.json({ error: "Email obrigatório" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

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

    const transporter = getTransporter();
    const html = adminVerificationEmail(code);

    if (!transporter) {
      console.warn(`[Admin Login] SMTP not configured. Code for ${normalizedEmail}: ${code}`);
      return NextResponse.json({ success: true, fallback: true, code });
    }

    await transporter.sendMail({
      from: `"NextCV Admin" <${process.env.EMAIL_USER}>`,
      to: normalizedEmail,
      subject: "Código de acesso — Admin NextCV",
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("send-login-code error:", error);
    return NextResponse.json({ error: "Erro ao enviar código" }, { status: 500 });
  }
}
