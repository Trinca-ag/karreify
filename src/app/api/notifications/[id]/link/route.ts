import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { requireUser, authErrorResponse } from "@/lib/auth-server";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";

/**
 * Associate a notification with the savedItem the client just persisted
 * (auto-save / manual-save-from-page flow). Clears the pendingPayload so
 * the notification doesn't try to save the doc a second time.
 */
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

  const rl = rateLimit(ctx.uid, { scope: "notification-link", limit: 60, windowMs: 60_000 });
  if (!rl.allowed) return rateLimitResponse(rl);

  try {
    const { savedItemId } = (await request.json()) as { savedItemId?: string };
    if (!savedItemId || typeof savedItemId !== "string") {
      return NextResponse.json({ error: "savedItemId obrigatório" }, { status: 400 });
    }

    const notifRef = adminDb
      .collection("users")
      .doc(ctx.uid)
      .collection("notifications")
      .doc(params.id);
    const snap = await notifRef.get();
    if (!snap.exists) {
      return NextResponse.json({ error: "Notificação não encontrada" }, { status: 404 });
    }

    await notifRef.update({
      savedItemId,
      pendingPayload: null,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("notification link error:", error);
    return NextResponse.json({ error: "Erro ao vincular notificação" }, { status: 500 });
  }
}
