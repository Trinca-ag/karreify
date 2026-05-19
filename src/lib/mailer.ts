import nodemailer, { type Transporter } from "nodemailer";

/**
 * Shared transactional mailer. The goal here is twofold:
 *
 *  1) Reuse a single pooled SMTP connection across all routes — opening a new
 *     TLS handshake for every code email is what makes Outlook/Hotmail look
 *     slow (and sometimes greylists us into retry loops).
 *
 *  2) Always send multipart/alternative (text + html) with the headers that
 *     Microsoft's filters actually score on:
 *       - Reply-To matching From
 *       - X-Priority / Importance / X-MSMail-Priority for time-sensitive codes
 *       - Plain-text part with real sentences (single biggest spam-score lever
 *         for hotmail.com / outlook.com inboxes)
 */

let cachedTransporter: Transporter | null = null;

function buildTransporter(): Transporter | null {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  if (!user || !pass) return null;

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT || "587", 10),
    secure: false,
    auth: { user, pass },
    // Connection pool keeps a few TLS sockets warm so the second/third email
    // doesn't pay the handshake cost. This noticeably cuts the latency the
    // user feels between clicking "enviar código" and the code arriving.
    pool: true,
    maxConnections: 3,
    maxMessages: 50,
  });
}

function getTransporter(): Transporter | null {
  if (cachedTransporter) return cachedTransporter;
  cachedTransporter = buildTransporter();
  return cachedTransporter;
}

export interface SendTransactionalOptions {
  to: string;
  subject: string;
  html: string;
  /**
   * Plain-text alternative. Required. Outlook/Hotmail treat HTML-only emails
   * as a strong spam signal; passing a real text body (not just stripped HTML)
   * is the single most impactful deliverability change for that inbox.
   */
  text: string;
  /**
   * "Karreify" by default. Override for admin emails ("Karreify Admin") so the
   * inbox preview shows the right context.
   */
  fromName?: string;
  /**
   * "high" sets X-Priority/Importance/X-MSMail-Priority — use it for
   * verification, password reset, and login codes (where the user is actively
   * waiting). Avoid it for purchase receipts (overuse blunts the signal).
   */
  priority?: "high" | "normal";
}

export interface SendResult {
  /** True if SMTP was configured and the message was accepted by the server. */
  sent: boolean;
  /** True when no transporter was configured — caller can decide what to do. */
  fallback: boolean;
}

export async function sendTransactionalEmail(
  opts: SendTransactionalOptions
): Promise<SendResult> {
  const transporter = getTransporter();
  if (!transporter) return { sent: false, fallback: true };

  const user = process.env.EMAIL_USER!;
  const fromName = opts.fromName || "Karreify";
  const isHighPriority = opts.priority === "high";

  // Headers that move the needle on Microsoft inboxes. We intentionally do NOT
  // add List-Unsubscribe — these are transactional/security messages and an
  // unsubscribe link on a verification code would look fishy and could be
  // counted against us.
  const headers: Record<string, string> = {};
  if (isHighPriority) {
    headers["X-Priority"] = "1";
    headers["X-MSMail-Priority"] = "High";
    headers["Importance"] = "High";
  }

  await transporter.sendMail({
    from: `"${fromName}" <${user}>`,
    to: opts.to,
    replyTo: user,
    subject: opts.subject,
    text: opts.text,
    html: opts.html,
    headers,
    priority: isHighPriority ? "high" : "normal",
  });

  return { sent: true, fallback: false };
}
