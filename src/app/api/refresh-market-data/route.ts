import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { generateMarketData } from "@/services/ai-market";
import { cleanJsonResponse } from "@/utils/helpers";
import { adminDb } from "@/lib/firebase-admin";
import { requireUser, authErrorResponse } from "@/lib/auth-server";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";

export const maxDuration = 60;

/** Throttle the *underlying* IA call: at most one refresh per 60 minutes
 *  globally, regardless of how many users land on /market at the same time.
 *  Keeps DeepSeek spend bounded even if dozens of clients trigger refresh
 *  simultaneously. */
const STALE_THRESHOLD_MS = 60 * 60 * 1000;

export async function POST(request: NextRequest) {
  let ctx;
  try {
    ctx = await requireUser(request);
  } catch (e) {
    return authErrorResponse(e);
  }

  const perUser = rateLimit(ctx.uid, { scope: "refresh-market-user", limit: 5, windowMs: 60_000 });
  if (!perUser.allowed) return rateLimitResponse(perUser);

  try {
    const docRef = adminDb.collection("market").doc("global");
    const current = await docRef.get();
    const updatedAt = current.exists ? current.data()?.updatedAt : null;
    const updatedAtMs = updatedAt?.toMillis ? updatedAt.toMillis() : 0;
    const isFresh = updatedAtMs && Date.now() - updatedAtMs < STALE_THRESHOLD_MS;

    if (isFresh && current.exists) {
      const { updatedAt: _omit, ...data } = current.data() as Record<string, unknown>;
      void _omit;
      return NextResponse.json({ success: true, data, cached: true });
    }

    const raw = await generateMarketData();
    const parsed = JSON.parse(cleanJsonResponse(raw));
    await docRef.set({ ...parsed, updatedAt: FieldValue.serverTimestamp() });
    return NextResponse.json({ success: true, data: parsed, cached: false });
  } catch (error) {
    console.error("Market data refresh error:", error);
    return NextResponse.json({ success: false, error: "Erro ao gerar dados de mercado." }, { status: 500 });
  }
}
