import { NextRequest, NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { verifyAdminRequest } from "@/utils/admin-verify";
import { adminDb } from "@/lib/firebase-admin";
import { ADZUNA_LIMITS } from "@/lib/adzuna-usage";

export const dynamic = "force-dynamic";

interface CallDoc {
  ts?: Timestamp;
  status: "cache_hit" | "api_call" | "api_error";
  keyword: string;
  uf: string;
  city: string;
  period: string;
  page: number;
  exactMatch?: boolean;
  httpStatus?: number;
  durationMs?: number;
  userId: string;
}

interface BucketStats {
  apiCalls: number;
  apiErrors: number;
  cacheHits: number;
  /** apiCalls + apiErrors — what actually consumes the Adzuna quota. */
  billable: number;
}

function emptyBucket(): BucketStats {
  return { apiCalls: 0, apiErrors: 0, cacheHits: 0, billable: 0 };
}

function accumulate(bucket: BucketStats, status: CallDoc["status"]) {
  if (status === "api_call") {
    bucket.apiCalls += 1;
    bucket.billable += 1;
  } else if (status === "api_error") {
    bucket.apiErrors += 1;
    bucket.billable += 1;
  } else if (status === "cache_hit") {
    bucket.cacheHits += 1;
  }
}

export async function GET(request: NextRequest) {
  try {
    await verifyAdminRequest(request);

    const now = Date.now();
    const minuteAgo = now - 60 * 1000;
    const dayAgo = now - 24 * 60 * 60 * 1000;
    const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
    const monthAgo = now - 30 * 24 * 60 * 60 * 1000;

    // Single read of the last 30 days, filter the smaller windows in memory.
    // For 2500 calls/month + cache hits this is a few thousand docs at most.
    const snap = await adminDb
      .collection("adzuna_calls")
      .where("ts", ">=", Timestamp.fromMillis(monthAgo))
      .orderBy("ts", "desc")
      .limit(10000)
      .get();

    const lastMinute = emptyBucket();
    const daily = emptyBucket();
    const weekly = emptyBucket();
    const monthly = emptyBucket();

    const keywordTally = new Map<string, number>();
    let totalLatencyMs = 0;
    let latencySamples = 0;

    const recent: Array<{
      ts: string;
      status: CallDoc["status"];
      keyword: string;
      uf: string;
      city: string;
      period: string;
      page: number;
      httpStatus: number | null;
      durationMs: number | null;
    }> = [];

    snap.docs.forEach((d) => {
      const data = d.data() as CallDoc;
      const tsMs = data.ts?.toMillis() ?? 0;
      if (!tsMs) return;

      accumulate(monthly, data.status);
      if (tsMs >= weekAgo) accumulate(weekly, data.status);
      if (tsMs >= dayAgo) accumulate(daily, data.status);
      if (tsMs >= minuteAgo) accumulate(lastMinute, data.status);

      if (data.status === "api_call") {
        const kw = (data.keyword || "").trim().toLowerCase();
        if (kw) keywordTally.set(kw, (keywordTally.get(kw) ?? 0) + 1);
        if (typeof data.durationMs === "number") {
          totalLatencyMs += data.durationMs;
          latencySamples += 1;
        }
      }

      if (recent.length < 50) {
        recent.push({
          ts: new Date(tsMs).toISOString(),
          status: data.status,
          keyword: data.keyword || "",
          uf: data.uf || "",
          city: data.city || "",
          period: data.period || "",
          page: data.page || 1,
          httpStatus: typeof data.httpStatus === "number" ? data.httpStatus : null,
          durationMs: typeof data.durationMs === "number" ? data.durationMs : null,
        });
      }
    });

    const topQueries = Array.from(keywordTally.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([keyword, count]) => ({ keyword, count }));

    const totalRequests = monthly.billable + monthly.cacheHits;
    const cacheHitRate = totalRequests > 0 ? monthly.cacheHits / totalRequests : 0;
    const avgLatencyMs = latencySamples > 0 ? Math.round(totalLatencyMs / latencySamples) : 0;

    return NextResponse.json({
      success: true,
      data: {
        limits: ADZUNA_LIMITS,
        counts: { lastMinute, daily, weekly, monthly },
        topQueries,
        recentCalls: recent,
        cacheHitRate,
        avgLatencyMs,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Erro";
    if (msg === "Não autorizado" || msg === "Acesso negado") {
      return NextResponse.json({ error: msg }, { status: 403 });
    }
    console.error("admin adzuna-usage error:", error);
    return NextResponse.json(
      { error: "Erro ao buscar uso do Adzuna" },
      { status: 500 }
    );
  }
}
