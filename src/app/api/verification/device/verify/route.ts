import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { requireUser, authErrorResponse } from "@/lib/auth-server";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  let ctx;
  try {
    ctx = await requireUser(request);
  } catch (e) {
    return authErrorResponse(e);
  }

  const rl = rateLimit(ctx.uid, { scope: "device-verify-check", limit: 10, windowMs: 60_000 });
  if (!rl.allowed) return rateLimitResponse(rl);

  try {
    const { code } = await request.json();
    if (!code || typeof code !== "string" || !/^\d{6}$/.test(code)) {
      return NextResponse.json({ valid: false }, { status: 400 });
    }

    const snapshot = await adminDb
      .collection("verificationCodes")
      .where("userId", "==", ctx.uid)
      .where("code", "==", code)
      .where("used", "==", false)
      .get();

    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      const expiresAt = data.expiresAt?.toDate
        ? data.expiresAt.toDate()
        : new Date(data.expiresAt);

      if (expiresAt > new Date()) {
        await docSnap.ref.update({ used: true });
        return NextResponse.json({
          valid: true,
          deviceId: data.deviceId ?? null,
        });
      }
    }

    return NextResponse.json({ valid: false });
  } catch (error) {
    console.error("Error verifying device code:", error);
    return NextResponse.json({ error: "Erro ao verificar código" }, { status: 500 });
  }
}
