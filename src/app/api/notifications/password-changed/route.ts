import { NextRequest, NextResponse } from "next/server";
import { requireUser, authErrorResponse } from "@/lib/auth-server";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { createSimpleNotification } from "@/lib/notifications-server";
import { sendTransactionalEmail } from "@/lib/mailer";
import { passwordChangedEmail, passwordChangedEmailText } from "@/utils/email-templates";

/**
 * Confirms a password change. Triggered client-side after Firebase Auth
 * accepts the new password (we don't intercept the password itself —
 * Firebase SDK handles re-auth + update — we just log the event).
 */
export async function POST(request: NextRequest) {
  let ctx;
  try {
    ctx = await requireUser(request);
  } catch (e) {
    return authErrorResponse(e);
  }

  const rl = rateLimit(ctx.uid, { scope: "password-changed", limit: 5, windowMs: 60_000 });
  if (!rl.allowed) return rateLimitResponse(rl);

  try {
    await createSimpleNotification({
      uid: ctx.uid,
      type: "password-changed",
      title: "Senha alterada",
      message: "A senha da sua conta foi atualizada com sucesso.",
    });

    if (ctx.email) {
      sendTransactionalEmail({
        to: ctx.email,
        subject: "Karreify — sua senha foi alterada",
        html: passwordChangedEmail(),
        text: passwordChangedEmailText(),
        priority: "high",
      }).catch((e) => console.error("password-changed email failed:", e));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("password-changed trigger error:", error);
    return NextResponse.json({ error: "Erro ao registrar mudança" }, { status: 500 });
  }
}
