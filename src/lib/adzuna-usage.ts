import crypto from "crypto";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";

/** Adzuna free-tier limits from the official Terms of Service. */
export const ADZUNA_LIMITS = {
  perMinute: 25,
  perDay: 250,
  perWeek: 1000,
  perMonth: 2500,
} as const;

/** Switch to Jooble preventively when monthly Adzuna usage hits this number.
 *  Buffer of 200 absorbs concurrent races and lets manual testing breathe. */
export const ADZUNA_MONTHLY_THRESHOLD = 2300;

export type JobProvider = "adzuna" | "jooble";

const CACHE_TTL_MS = 30 * 60 * 1000;
const CACHE_COLLECTION = "adzuna_cache";
const CALLS_COLLECTION = "adzuna_calls";

export interface CachedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  snippet: string;
  salary: string;
  source: string;
  type: string;
  link: string;
  updated: string;
}

export interface CachedSearchResult {
  jobs: CachedJob[];
  totalCount: number;
  page: number;
}

export interface CacheKeyParams {
  keyword: string;
  uf?: string;
  city?: string;
  period: "today" | "week" | "month";
  exactMatch?: boolean;
  page: number;
}

export function makeCacheKey(p: CacheKeyParams): string {
  const norm = JSON.stringify({
    k: p.keyword.trim().toLowerCase(),
    uf: (p.uf ?? "").trim().toUpperCase(),
    c: (p.city ?? "").trim().toLowerCase(),
    p: p.period,
    e: p.exactMatch ? 1 : 0,
    pg: p.page,
  });
  return crypto.createHash("sha256").update(norm).digest("hex").slice(0, 40);
}

export async function getCached(
  cacheKey: string
): Promise<CachedSearchResult | null> {
  try {
    const snap = await adminDb.collection(CACHE_COLLECTION).doc(cacheKey).get();
    if (!snap.exists) return null;
    const data = snap.data();
    if (!data) return null;

    const expiresAt = data.expiresAt as Timestamp | undefined;
    if (!expiresAt || expiresAt.toMillis() < Date.now()) {
      adminDb
        .collection(CACHE_COLLECTION)
        .doc(cacheKey)
        .delete()
        .catch(() => {});
      return null;
    }
    return data.payload as CachedSearchResult;
  } catch (err) {
    console.error("[adzuna-cache] read error", err);
    return null;
  }
}

export async function setCached(
  cacheKey: string,
  payload: CachedSearchResult,
  meta: { keyword: string; uf: string; city: string; period: string; page: number }
): Promise<void> {
  try {
    const expiresAt = Timestamp.fromMillis(Date.now() + CACHE_TTL_MS);
    await adminDb.collection(CACHE_COLLECTION).doc(cacheKey).set({
      payload,
      meta,
      createdAt: FieldValue.serverTimestamp(),
      expiresAt,
    });
  } catch (err) {
    console.error("[adzuna-cache] write error", err);
  }
}

export type CallStatus = "cache_hit" | "api_call" | "api_error";

export interface CallRecord {
  status: CallStatus;
  /** Which job provider answered the call. Older records without this field
   *  predate the multi-provider rollout — treat them as "adzuna". */
  provider: JobProvider;
  keyword: string;
  uf: string;
  city: string;
  period: string;
  page: number;
  exactMatch: boolean;
  userId: string;
  httpStatus?: number;
  durationMs?: number;
}

/** Fire-and-forget: a tracker write must never block or fail the request. */
export async function recordCall(call: CallRecord): Promise<void> {
  try {
    await adminDb.collection(CALLS_COLLECTION).add({
      ...call,
      ts: FieldValue.serverTimestamp(),
    });
  } catch (err) {
    console.error("[adzuna-tracker] write error", err);
  }
}

/** In-process memoization of the monthly billable Adzuna count.
 *  Provider selection happens on every search, but the 2500/month quota
 *  moves slowly — caching for 60s avoids a Firestore round-trip per request
 *  without letting the threshold check go meaningfully stale. */
let adzunaCountCache: { value: number; expiresAt: number } | null = null;
const ADZUNA_COUNT_CACHE_MS = 60 * 1000;

/** Count of api_call + api_error records for Adzuna in the last 30 days,
 *  used only to decide when to switch to Jooble preventively.
 *
 *  Counts Adzuna explicitly *plus legacy records without a provider field*
 *  (Firestore equality filter excludes missing fields, so we do this in two
 *  passes via `total - jooble`). Errors are included because they consume
 *  the Adzuna free tier too. */
export async function getAdzunaMonthlyBillable(): Promise<number> {
  const now = Date.now();
  if (adzunaCountCache && adzunaCountCache.expiresAt > now) {
    return adzunaCountCache.value;
  }

  try {
    const monthAgo = Timestamp.fromMillis(now - 30 * 24 * 60 * 60 * 1000);
    const totalCall = adminDb
      .collection(CALLS_COLLECTION)
      .where("ts", ">=", monthAgo)
      .where("status", "==", "api_call")
      .count()
      .get();
    const totalError = adminDb
      .collection(CALLS_COLLECTION)
      .where("ts", ">=", monthAgo)
      .where("status", "==", "api_error")
      .count()
      .get();
    const joobleCall = adminDb
      .collection(CALLS_COLLECTION)
      .where("ts", ">=", monthAgo)
      .where("status", "==", "api_call")
      .where("provider", "==", "jooble")
      .count()
      .get();
    const joobleError = adminDb
      .collection(CALLS_COLLECTION)
      .where("ts", ">=", monthAgo)
      .where("status", "==", "api_error")
      .where("provider", "==", "jooble")
      .count()
      .get();

    const [tc, te, jc, je] = await Promise.all([
      totalCall,
      totalError,
      joobleCall,
      joobleError,
    ]);

    const value =
      tc.data().count +
      te.data().count -
      jc.data().count -
      je.data().count;
    adzunaCountCache = { value, expiresAt: now + ADZUNA_COUNT_CACHE_MS };
    return value;
  } catch (err) {
    console.error("[adzuna-tracker] count error", err);
    // On read failure, return 0 so we don't block Adzuna unnecessarily — the
    // real 429 from Adzuna itself is the hard backstop.
    return 0;
  }
}

/** Force-invalidate the count cache (e.g. after recording a new api_call). */
export function bumpAdzunaCount(): void {
  if (adzunaCountCache) {
    adzunaCountCache.value += 1;
  }
}
