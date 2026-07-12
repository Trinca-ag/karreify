import type { CachedJob } from "@/lib/adzuna-usage";

const ADZUNA_API_BASE = "https://api.adzuna.com/v1/api/jobs/br/search";

interface AdzunaJob {
  id?: string | number;
  title?: string;
  description?: string;
  company?: { display_name?: string };
  location?: { display_name?: string; area?: string[] };
  salary_min?: number;
  salary_max?: number;
  salary_is_predicted?: string;
  contract_type?: string;
  contract_time?: string;
  redirect_url?: string;
  created?: string;
  category?: { label?: string };
}

interface AdzunaResponse {
  count?: number;
  results?: AdzunaJob[];
}

export interface AdzunaSearchParams {
  keyword: string;
  uf?: string;
  city?: string;
  period: "today" | "week" | "month";
  exactMatch?: boolean;
  modality?: "presencial" | "hibrido" | "remoto";
  page: number;
}

export interface AdzunaSearchResult {
  jobs: CachedJob[];
  totalCount: number;
  durationMs: number;
}

export class AdzunaApiError extends Error {
  status: number;
  body: string;
  durationMs: number;
  constructor(status: number, body: string, durationMs: number) {
    super(`Adzuna API error ${status}`);
    this.status = status;
    this.body = body;
    this.durationMs = durationMs;
  }
}

function periodToMaxDays(period: "today" | "week" | "month"): number {
  if (period === "today") return 1;
  if (period === "week") return 7;
  return 30;
}

function buildWhere(uf?: string, city?: string): string {
  if (city) return city;
  if (uf) return uf;
  return "";
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

/** Adzuna returns the literal string "Unknown" when a field is missing
 *  (company, category, etc.) instead of omitting it. Treat those as empty. */
function cleanText(input?: string): string {
  const s = stripHtml(input);
  return s.toLowerCase() === "unknown" ? "" : s;
}

function formatSalary(min?: number, max?: number, predicted?: string): string {
  if (!min && !max) return "";
  const fmt = (n: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    }).format(n);
  let str = "";
  if (min && max) str = min === max ? fmt(min) : `${fmt(min)} – ${fmt(max)}`;
  else if (min) str = `A partir de ${fmt(min)}`;
  else if (max) str = `Até ${fmt(max)}`;
  if (predicted === "1" && str) str += " (est.)";
  return str;
}

function formatContractType(contractType?: string, contractTime?: string): string {
  const parts: string[] = [];
  if (contractTime === "full_time") parts.push("Tempo integral");
  else if (contractTime === "part_time") parts.push("Meio período");
  if (contractType === "permanent") parts.push("CLT/Efetivo");
  else if (contractType === "contract") parts.push("Contrato/PJ");
  return parts.join(" · ");
}

export async function callAdzuna(
  params: AdzunaSearchParams
): Promise<AdzunaSearchResult> {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;
  if (!appId || !appKey) {
    throw new Error(
      "Integração com Adzuna não configurada. Configure ADZUNA_APP_ID e ADZUNA_APP_KEY no .env.local."
    );
  }

  // sort_by=date makes the Adzuna BR API surface jobs from a feed that
  // strips company.display_name (verified empirically — same query without
  // sort_by returns 100% jobs with company names, with sort_by=date returns
  // 0%). max_days_old already bounds the time window, so relevance sort is
  // the better trade.
  const qs = new URLSearchParams({
    app_id: appId,
    app_key: appKey,
    results_per_page: "20",
    max_days_old: String(periodToMaxDays(params.period)),
    "content-type": "application/json",
  });

  if (params.exactMatch) qs.set("what_phrase", params.keyword.trim());
  else qs.set("what", params.keyword.trim());

  // Augment de modalidade — a Adzuna não tem filtro nativo; what_and exige
  // que todas as palavras apareçam no anúncio. Presencial não altera a query.
  if (params.modality === "remoto") qs.set("what_and", "home office");
  else if (params.modality === "hibrido") qs.set("what_and", "híbrido");

  const where = buildWhere(params.uf, params.city);
  if (where) qs.set("where", where);

  const url = `${ADZUNA_API_BASE}/${params.page}?${qs.toString()}`;
  const sanitized = url
    .replace(encodeURIComponent(appId), "***")
    .replace(encodeURIComponent(appKey), "***")
    .replace(appId, "***")
    .replace(appKey, "***");
  console.log("[Adzuna] GET", sanitized);

  const startedAt = Date.now();
  const response = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
  });
  const durationMs = Date.now() - startedAt;

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    console.error(
      "[Adzuna] HTTP",
      response.status,
      response.statusText,
      "body:",
      text.slice(0, 500)
    );
    throw new AdzunaApiError(response.status, text, durationMs);
  }

  const data = (await response.json()) as AdzunaResponse;
  const jobs: CachedJob[] = (data.results || []).map((j, idx) => ({
    id: String(j.id || `${idx}-${Date.now()}`),
    title: cleanText(j.title) || "Vaga sem título",
    company: cleanText(j.company?.display_name),
    location: cleanText(j.location?.display_name),
    snippet: stripHtml(j.description),
    salary: formatSalary(j.salary_min, j.salary_max, j.salary_is_predicted),
    source: cleanText(j.category?.label),
    type: formatContractType(j.contract_type, j.contract_time),
    link: j.redirect_url || "",
    updated: j.created || "",
  }));

  return {
    jobs,
    totalCount: data.count || 0,
    durationMs,
  };
}
