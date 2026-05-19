import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { requireUser, authErrorResponse } from "@/lib/auth-server";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { createTicketNotification } from "@/lib/notifications-server";
import { sendTransactionalEmail } from "@/lib/mailer";
import { ticketReplyEmail, ticketReplyEmailText } from "@/utils/email-templates";
import { TICKET_MAX_MESSAGE } from "@/types";

export const dynamic = "force-dynamic";

interface IncomingBody {
  content?: string;
  /** Optional override — the server still validates the user is actually an
   *  admin. Defaults to detecting via the admins collection. */
  senderRole?: "user" | "admin";
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  let ctx;
  try {
    ctx = await requireUser(request);
  } catch (e) {
    return authErrorResponse(e);
  }

  const rl = rateLimit(ctx.uid, { scope: "ticket-message", limit: 30, windowMs: 60_000 });
  if (!rl.allowed) return rateLimitResponse(rl);

  try {
    const ticketId = params.id;
    if (!ticketId) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const body = (await request.json().catch(() => ({}))) as IncomingBody;
    const content = (body.content ?? "").trim();
    if (!content) {
      return NextResponse.json({ error: "Mensagem vazia" }, { status: 400 });
    }
    if (content.length > TICKET_MAX_MESSAGE) {
      return NextResponse.json(
        { error: `Mensagem muito longa (máx ${TICKET_MAX_MESSAGE} caracteres)` },
        { status: 413 }
      );
    }

    const ticketRef = adminDb.collection("tickets").doc(ticketId);
    const ticketSnap = await ticketRef.get();
    if (!ticketSnap.exists) {
      return NextResponse.json({ error: "Chamado não encontrado" }, { status: 404 });
    }
    const ticketData = ticketSnap.data() ?? {};
    if (ticketData.status !== "open") {
      return NextResponse.json({ error: "Chamado já foi finalizado" }, { status: 409 });
    }

    const adminDoc = await adminDb.collection("admins").doc(ctx.uid).get();
    const isAdmin = adminDoc.exists;
    const isOwner = ticketData.userId === ctx.uid;
    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    }

    const senderRole: "user" | "admin" = isAdmin ? "admin" : "user";
    const senderName = isAdmin
      ? ((adminDoc.data()?.name as string | undefined) || "Suporte")
      : ((ticketData.userName as string | undefined) || "Usuário");

    const now = new Date();
    const msgRef = ticketRef.collection("messages").doc();
    await msgRef.set({
      senderId: ctx.uid,
      senderRole,
      senderName,
      content,
      createdAt: FieldValue.serverTimestamp(),
    });

    await ticketRef.update({
      lastMessageAt: now,
      lastMessageBy: senderRole,
      messageCount: FieldValue.increment(1),
      updatedAt: now,
    });

    // Notify the ticket owner whenever the admin replies. User replies don't
    // generate notifications (the admin sees them on their dashboard list).
    if (senderRole === "admin") {
      const ownerUid = ticketData.userId as string | undefined;
      const ownerEmail = ticketData.userEmail as string | undefined;
      const ticketTitle = (ticketData.title as string | undefined) ?? "Chamado";

      if (ownerUid) {
        createTicketNotification({
          uid: ownerUid,
          type: "ticket-reply",
          title: "Nova resposta no seu chamado",
          message: `O suporte respondeu o chamado #${ticketId}.`,
          ticketId,
        }).catch((e) => console.error("ticket-reply notification failed:", e));
      }

      if (ownerEmail) {
        sendTransactionalEmail({
          to: ownerEmail,
          subject: `Resposta no chamado #${ticketId} — Karreify`,
          html: ticketReplyEmail(ticketId, ticketTitle, content),
          text: ticketReplyEmailText(ticketId, ticketTitle, content),
        }).catch((e) => console.error("ticket-reply email failed:", e));
      }
    }

    return NextResponse.json({
      success: true,
      message: {
        id: msgRef.id,
        senderId: ctx.uid,
        senderRole,
        senderName,
        content,
        createdAt: now.toISOString(),
      },
    });
  } catch (error) {
    console.error("[ticket message POST]", error);
    return NextResponse.json({ error: "Erro ao enviar mensagem" }, { status: 500 });
  }
}
