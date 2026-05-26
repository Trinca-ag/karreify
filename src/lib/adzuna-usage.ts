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

/** Jooble REST API: por confirmação oficial do time Jooble (e-mail 2026-05),
 *  o limite é de 500 requisições no total para a chave (não por mês). Quando
 *  esgota, requisições novas simplesmente deixam de ser processadas. Não há
 *  headers de rate-limit. */
export const JOOBLE_TOTAL_LIMIT = 500;

/** Limite acima do qual ligamos um alerta visual no admin. Buffer pequeno
 *  porque a cota da Jooble é vitalícia. */
export const JOOBLE_WARNING_THRESHOLD = 400;

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

/** Total vitalício consumido pela chave Jooble (api_call + api_error).
 *  Cacheado por 60s pra não ler Firestore a cada busca — a cota de 500
 *  vitalícia se move devagar e cache_hit não conta.
 *
 *  Implementação: 1 query `where("provider", "==", "jooble").get()` + filtro
 *  in-memory. Evita índice composto (provider+status). Para 500 chamadas
 *  vitalícias + cache_hits, o read é pequeno o suficiente. */
let joobleCountCache: { value: number; expiresAt: number } | null = null;
const JOOBLE_COUNT_CACHE_MS = 60 * 1000;

export async function getJoobleTotalBillable(): Promise<number> {
  const now = Date.now();
  if (joobleCountCache && joobleCountCache.expiresAt > now) {
    return joobleCountCache.value;
  }

  try {
    const snap = await adminDb
      .collection(CALLS_COLLECTION)
      .where("provider", "==", "jooble")
      .limit(20000)
      .get();

    let value = 0;
    snap.docs.forEach((d) => {
      const status = (d.data() as { status?: string }).status;
      if (status === "api_call" || status === "api_error") value += 1;
    });

    joobleCountCache = { value, expiresAt: now + JOOBLE_COUNT_CACHE_MS };
    return value;
  } catch (err) {
    console.error("[jooble-tracker] count error", err);
    return 0;
  }
}

export function bumpJoobleCount(): void {
  if (joobleCountCache) {
    joobleCountCache.value += 1;
  }
}
