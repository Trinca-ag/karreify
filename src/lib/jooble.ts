import type { CachedJob } from "@/lib/adzuna-usage";

const JOOBLE_API_BASE = "https://br.jooble.org/api";

/** Jooble doesn't publish a hard quota for individual keys, but we soft-cap
 *  to stay safely within their fair-use policy (~50k/mo). */
export const JOOBLE_LIMITS = {
  perMinute: 30,
  perDay: 2000,
  perWeek: 10000,
  perMonth: 30000,
} as const;

interface JoobleJob {
  id?: number | string;
  title?: string;
  location?: string;
  snippet?: string;
  salary?: string;
  source?: string;
  type?: string;
  link?: string;
  company?: string;
  updated?: string;
}

interface JoobleResponse {
  totalCount?: number;
  jobs?: JoobleJob[];
}

export interface JoobleSearchParams {
  keyword: string;
  uf?: string;
  city?: string;
  period: "today" | "week" | "month";
  exactMatch?: boolean;
  modality?: "presencial" | "hibrido" | "remoto";
  page: number;
}

export interface JoobleSearchResult {
  jobs: CachedJob[];
  totalCount: number;
  durationMs: number;
}

export class JoobleApiError extends Error {
  status: number;
  body: string;
  durationMs: number;
  constructor(status: number, body: string, durationMs: number) {
    super(`Jooble API error ${status}`);
    this.status = status;
    this.body = body;
    this.durationMs = durationMs;
  }
}

function stripHtml(input?: string): string {
  if (!input) return "";
  return input
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function periodToDateFrom(period: "today" | "week" | "month"): string {
  const now = new Date();
  const days = period === "today" ? 1 : period === "week" ? 7 : 30;
  const from = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  return from.toISOString().slice(0, 10);
}

function buildLocation(uf?: string, city?: string): string {
  if (city) return city;
  if (uf) return uf;
  return "";
}

/** Jooble has no exactMatch flag — quotes act as a phrase operator. O
 *  augment de modalidade fica FORA das aspas para a frase continuar
 *  casando ("analista" home office). Presencial não altera a query. */
function buildKeywords(
  keyword: string,
  exactMatch?: boolean,
  modality?: "presencial" | "hibrido" | "remoto"
): string {
  const trimmed = keyword.trim();
  const base = !exactMatch
    ? trimmed
    : trimmed.startsWith('"') && trimmed.endsWith('"')
      ? trimmed
      : `"${trimmed}"`;
  if (modality === "remoto") return `${base} home office`;
  if (modality === "hibrido") return `${base} híbrido`;
  return base;
}

export async function callJooble(
  params: JoobleSearchParams
): Promise<JoobleSearchResult> {
  const apiKey = process.env.JOOBLE_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Integração Jooble não configurada. Defina JOOBLE_API_KEY no .env.local."
    );
  }

  const body = {
    keywords: buildKeywords(params.keyword, params.exactMatch, params.modality),
    location: buildLocation(params.uf, params.city),
    page: String(params.page),
    ResultOnPage: "20",
    datecreatedfrom: periodToDateFrom(params.period),
  };

  const url = `${JOOBLE_API_BASE}/${apiKey}`;
  const sanitized = `${JOOBLE_API_BASE}/***`;
  console.log("[Jooble] POST", sanitized, JSON.stringify(body));

  const startedAt = Date.now();
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });
  const durationMs = Date.now() - startedAt;

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    console.error(
      "[Jooble] HTTP",
      response.status,
      response.statusText,
      "body:",
      text.slice(0, 500)
    );
    throw new JoobleApiError(response.status, text, durationMs);
  }

  const data = (await response.json()) as JoobleResponse;
  const jobs: CachedJob[] = (data.jobs || []).map((j, idx) => ({
    id: String(j.id ?? `jooble-${idx}-${Date.now()}`),
    title: stripHtml(j.title) || "Vaga sem título",
    company: stripHtml(j.company),
    location: stripHtml(j.location),
    snippet: stripHtml(j.snippet),
    salary: stripHtml(j.salary),
    source: stripHtml(j.source),
    type: stripHtml(j.type),
    link: j.link || "",
    updated: j.updated || "",
  }));

  return {
    jobs,
    totalCount: data.totalCount || 0,
    durationMs,
  };
}
