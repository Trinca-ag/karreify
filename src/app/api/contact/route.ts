import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { rateLimit, rateLimitResponse, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const ALLOWED_TOPICS = new Set(["help", "terms", "privacy"]);
const MAX_NAME = 120;
const MAX_EMAIL = 200;
const MAX_SUBJECT = 200;
const MAX_MESSAGE = 4000;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface Body {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  topic?: string;
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rl = rateLimit(ip, { scope: "contact-form", limit: 5, windowMs: 60_000 });
  if (!rl.allowed) return rateLimitResponse(rl);

  try {
    const body = (await request.json()) as Body;

    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const subject = String(body.subject ?? "").trim();
    const message = String(body.message ?? "").trim();
    const topic = String(body.topic ?? "help").trim();

    if (!name || name.length > MAX_NAME) {
      return NextResponse.json({ error: "Nome inválido" }, { status: 400 });
    }
    if (!email || email.length > MAX_EMAIL || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "E-mail inválido" }, { status: 400 });
    }
    if (!subject || subject.length > MAX_SUBJECT) {
      return NextResponse.json({ error: "Assunto inválido" }, { status: 400 });
    }
    if (!message || message.length > MAX_MESSAGE) {
      return NextResponse.json({ error: "Mensagem inválida" }, { status: 400 });
    }
    const safeTopic = ALLOWED_TOPICS.has(topic) ? topic : "help";

    await adminDb.collection("contact_messages").add({
      name,
      email,
      subject,
      message,
      topic: safeTopic,
      ip,
      userAgent: request.headers.get("user-agent") || "",
      status: "new",
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[contact POST]", error);
    return NextResponse.json(
      { error: "Erro ao enviar mensagem. Tente novamente." },
      { status: 500 }
    );
  }
}
