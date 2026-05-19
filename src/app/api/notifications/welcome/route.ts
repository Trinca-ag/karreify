import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { requireUser, authErrorResponse } from "@/lib/auth-server";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { createSimpleNotification } from "@/lib/notifications-server";
import { sendTransactionalEmail } from "@/lib/mailer";
import { welcomeEmail, welcomeEmailText } from "@/utils/email-templates";

/**
 * Idempotent welcome trigger. Client calls this right after sign-up
 * (email/password OR Google). If a welcome notification already exists,
 * we no-op so reloads / retries don't spam the user.
 */
export async function POST(request: NextRequest) {
  let ctx;
  try {
    ctx = await requireUser(request);
  } catch (e) {
    return authErrorResponse(e);
  }

  const rl = rateLimit(ctx.uid, { scope: "welcome", limit: 5, windowMs: 60_000 });
  if (!rl.allowed) return rateLimitResponse(rl);

  try {
    const notifsCol = adminDb.collection("users").doc(ctx.uid).collection("notifications");
    const existing = await notifsCol.where("type", "==", "welcome").limit(1).get();
    if (!existing.empty) {
      return NextResponse.json({ success: true, alreadySent: true });
    }

    const userSnap = await adminDb.collection("users").doc(ctx.uid).get();
    const userData = userSnap.data() ?? {};
    const userName =
      (userData.displayName as string | undefined) ||
      (userData.name as string | undefined) ||
      (ctx.email ? ctx.email.split("@")[0] : "Usuário");

    await createSimpleNotification({
      uid: ctx.uid,
      type: "welcome",
      title: "Bem-vindo(a) ao Karreify!",
      message:
        "Sua conta foi criada com sucesso. Explore as ferramentas de IA no dashboard para começar.",
    });

    if (ctx.email) {
      sendTransactionalEmail({
        to: ctx.email,
        subject: "Bem-vindo(a) ao Karreify!",
        html: welcomeEmail(userName),
        text: welcomeEmailText(userName),
      }).catch((e) => console.error("welcome email failed:", e));
    }

    return NextResponse.json({ success: true, alreadySent: false });
  } catch (error) {
    console.error("welcome trigger error:", error);
    return NextResponse.json({ error: "Erro ao enviar boas-vindas" }, { status: 500 });
  }
}
