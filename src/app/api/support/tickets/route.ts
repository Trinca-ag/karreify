import { NextRequest, NextResponse } from "next/server";
import { randomInt } from "node:crypto";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { TICKET_MAX_DESCRIPTION, TICKET_MAX_TITLE } from "@/types";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { createTicketNotification } from "@/lib/notifications-server";
import { sendTransactionalEmail } from "@/lib/mailer";
import { ticketCreatedEmail, ticketCreatedEmailText } from "@/utils/email-templates";

export const dynamic = "force-dynamic";

function generateFiveDigit(): string {
  // crypto.randomInt is CSPRNG-backed; harder to predict than Math.random
  // (which is fine but lets a determined attacker narrow candidate IDs).
  return randomInt(10000, 100000).toString();
}

export async function POST(request: NextRequest) {
  try {
    // 1. Auth
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    const token = authHeader.slice(7);
    const decoded = await adminAuth.verifyIdToken(token);

    const rl = rateLimit(decoded.uid, { scope: "support-tickets-create", limit: 5, windowMs: 60_000 });
    if (!rl.allowed) return rateLimitResponse(rl);

    // 2. Validate input
    const body = await request.json();
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const description = typeof body.description === "string" ? body.description.trim() : "";
    if (!title || title.length > TICKET_MAX_TITLE) {
      return NextResponse.json({ error: "Título inválido" }, { status: 400 });
    }
    if (!description || description.length > TICKET_MAX_DESCRIPTION) {
      return NextResponse.json({ error: "Descrição inválida" }, { status: 400 });
    }

    // 3. Resolve user profile for cached fields. Tickets carry userName/email so
    //    the admin listing doesn't need to join against the users collection.
    const userSnap = await adminDb.collection("users").doc(decoded.uid).get();
    if (!userSnap.exists) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 403 });
    }
    const userData = userSnap.data() ?? {};
    const userName = (userData.displayName as string) || decoded.name || "Usuário";
    const userEmail = (userData.email as string) || decoded.email || "";

    // 4. Pick a 5-digit id with collision retry. .create() throws ALREADY_EXISTS
    //    when the doc is already present, so we get atomic conflict detection.
    const now = new Date();
    const ticketData = {
      userId: decoded.uid,
      userName,
      userEmail,
      title,
      description,
      images: [] as string[],
      status: "open" as const,
      messageCount: 0,
      lastMessageAt: now,
      lastMessageBy: null,
      createdAt: now,
      updatedAt: now,
      closedAt: null,
      closedBy: null,
    };

    let ticketId: string | null = null;
    for (let attempt = 0; attempt < 8; attempt++) {
      const candidate = generateFiveDigit();
      try {
        await adminDb.collection("tickets").doc(candidate).create(ticketData);
        ticketId = candidate;
        break;
      } catch (err) {
        const code = (err as { code?: number | string })?.code;
        // Firestore ALREADY_EXISTS code is 6 (gRPC) or "6". Retry on conflict.
        if (code === 6 || code === "6" || code === "already-exists") continue;
        throw err;
      }
    }
    if (!ticketId) {
      return NextResponse.json(
        { error: "Não foi possível gerar um ID único, tente novamente" },
        { status: 503 }
      );
    }

    // Fire-and-forget: notify the user + email them. We don't want
    // notification or email failures to break the ticket creation flow.
    createTicketNotification({
      uid: decoded.uid,
      type: "ticket-created",
      title: "Chamado aberto",
      message: `Recebemos seu chamado #${ticketId}. Avisaremos quando houver uma resposta.`,
      ticketId,
    }).catch((e) => console.error("ticket-created notification failed:", e));

    if (userEmail) {
      sendTransactionalEmail({
        to: userEmail,
        subject: `Chamado #${ticketId} aberto — Karreify`,
        html: ticketCreatedEmail(ticketId, title),
        text: ticketCreatedEmailText(ticketId, title),
      }).catch((e) => console.error("ticket-created email failed:", e));
    }

    return NextResponse.json({
      success: true,
      ticket: {
        id: ticketId,
        ...ticketData,
        // Serialize Dates to ISO so the JSON survives the wire; the client
        // re-parses via subscribeTicket once it's mounted.
        lastMessageAt: now.toISOString(),
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        closedAt: null,
      },
    });
  } catch (error) {
    console.error("[support/tickets POST]", error);
    return NextResponse.json({ error: "Erro ao criar chamado" }, { status: 500 });
  }
}
