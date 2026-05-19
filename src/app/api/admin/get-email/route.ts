import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { rateLimit, rateLimitResponse, getClientIp } from "@/lib/rate-limit";

/**
 * Resolve an admin username to its email. Used by the admin login flow
 * BEFORE the user is authenticated, so we can't gate with requireAdmin.
 *
 * Surface-hardening:
 *  - Strict per-IP rate limit (10/min) to slow username enumeration.
 *  - Opaque response shape: we always return the same envelope, regardless
 *    of whether the admin exists. That way a probing attacker can't tell
 *    valid usernames from invalid ones based on the response.
 */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rl = rateLimit(ip, { scope: "admin-get-email", limit: 10, windowMs: 60_000 });
  if (!rl.allowed) return rateLimitResponse(rl);

  try {
    const { username } = await request.json();
    if (!username?.trim() || typeof username !== "string" || username.length > 64) {
      return NextResponse.json({ found: false }, { status: 200 });
    }

    const snap = await adminDb
      .collection("admins")
      .where("username", "==", username.toLowerCase().trim())
      .limit(1)
      .get();

    if (snap.empty) {
      return NextResponse.json({ found: false }, { status: 200 });
    }

    return NextResponse.json({ found: true, email: snap.docs[0].data().email });
  } catch (error) {
    console.error("get-email error:", error);
    return NextResponse.json({ found: false }, { status: 200 });
  }
}
