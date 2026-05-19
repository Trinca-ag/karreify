import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { requireUser, authErrorResponse } from "@/lib/auth-server";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { createSimpleNotification } from "@/lib/notifications-server";
import { sendTransactionalEmail } from "@/lib/mailer";
import { feedbackThanksEmail, feedbackThanksEmailText } from "@/utils/email-templates";
import { FEEDBACK_MAX_COMMENT } from "@/types";

export const dynamic = "force-dynamic";

interface Body {
  rating?: number;
  comment?: string;
  userName?: string | null;
}

export async function POST(request: NextRequest) {
  let ctx;
  try {
    ctx = await requireUser(request);
  } catch (e) {
    return authErrorResponse(e);
  }

  const rl = rateLimit(ctx.uid, { scope: "feedback", limit: 3, windowMs: 60_000 });
  if (!rl.allowed) return rateLimitResponse(rl);

  try {
    const body = (await request.json()) as Body;
    const rating = Math.round(Number(body.rating ?? 0));
    const comment = String(body.comment ?? "").trim();

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Avaliação inválida (1–5)" }, { status: 400 });
    }
    if (comment.length > FEEDBACK_MAX_COMMENT) {
      return NextResponse.json({ error: "Comentário muito longo" }, { status: 413 });
    }

    // Pull canonical name/email from the user doc — the client can't be
    // trusted to claim someone else's identity.
    const userSnap = await adminDb.collection("users").doc(ctx.uid).get();
    const userData = userSnap.data() ?? {};
    const userName =
      (userData.displayName as string | undefined) ||
      (body.userName ?? null) ||
      (ctx.email ? ctx.email.split("@")[0] : "Usuário");
    const userEmail = (userData.email as string | undefined) || ctx.email || "";

    await adminDb.collection("feedbacks").add({
      uid: ctx.uid,
      userName,
      userEmail,
      rating,
      comment,
      createdAt: FieldValue.serverTimestamp(),
    });

    createSimpleNotification({
      uid: ctx.uid,
      type: "feedback-thanks",
      title: "Obrigado pelo feedback!",
      message: `Sua avaliação de ${rating} estrela${rating === 1 ? "" : "s"} foi registrada.`,
    }).catch((e) => console.error("feedback-thanks notification failed:", e));

    if (userEmail) {
      sendTransactionalEmail({
        to: userEmail,
        subject: "Obrigado pelo seu feedback — Karreify",
        html: feedbackThanksEmail(userName, rating),
        text: feedbackThanksEmailText(userName, rating),
      }).catch((e) => console.error("feedback-thanks email failed:", e));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[feedback POST]", error);
    return NextResponse.json({ error: "Erro ao enviar feedback" }, { status: 500 });
  }
}
