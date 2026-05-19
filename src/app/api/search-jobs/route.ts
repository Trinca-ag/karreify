import { NextRequest, NextResponse } from "next/server";
import { requireUser, authErrorResponse } from "@/lib/auth-server";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";

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

export async function POST(request: NextRequest) {
  let ctx;
  try {
    ctx = await requireUser(request);
  } catch (e) {
    return authErrorResponse(e);
  }

  const rl = rateLimit(ctx.uid, { scope: "search-jobs", limit: 30, windowMs: 60_000 });
  if (!rl.allowed) return rateLimitResponse(rl);

  try {
    const body = await request.json();
    const { keyword, uf, city, period, exactMatch, page } = body as {
      keyword?: string;
      uf?: string;
      city?: string;
      period?: "today" | "week" | "month";
      exactMatch?: boolean;
      page?: number;
    };

    if (!keyword || typeof keyword !== "string" || keyword.trim().length < 2 || keyword.length > 200) {
      return NextResponse.json(
        { error: "Informe entre 2 e 200 caracteres na busca." },
        { status: 400 }
      );
    }

    const appId = process.env.ADZUNA_APP_ID;
    const appKey = process.env.ADZUNA_APP_KEY;
    if (!appId || !appKey) {
      return NextResponse.json(
        {
          error:
            "Integração com Adzuna não configurada. Configure ADZUNA_APP_ID e ADZUNA_APP_KEY no .env.local.",
        },
        { status: 500 }
      );
    }

    const safePeriod = period === "today" || period === "week" ? period : "month";
    const targetPage = Math.max(1, Math.min(20, page || 1));

    // sort_by=date makes the Adzuna BR API surface jobs from a feed that
    // strips company.display_name (verified empirically — same query without
    // sort_by returns 100% jobs with company names, with sort_by=date returns
    // 0%). max_days_old already bounds the time window, so relevance sort is
    // the better trade.
    const params = new URLSearchParams({
      app_id: appId,
      app_key: appKey,
      results_per_page: "20",
      max_days_old: String(periodToMaxDays(safePeriod)),
      "content-type": "application/json",
    });

    const trimmedKeyword = keyword.trim().slice(0, 200);
    if (exactMatch) params.set("what_phrase", trimmedKeyword);
    else params.set("what", trimmedKeyword);

    const where = buildWhere(uf, city);
    if (where) params.set("where", where);

    const url = `${ADZUNA_API_BASE}/${targetPage}?${params.toString()}`;
    const sanitized = url
      .replace(encodeURIComponent(appId), "***")
      .replace(encodeURIComponent(appKey), "***")
      .replace(appId, "***")
      .replace(appKey, "***");
    console.log("[Adzuna] GET", sanitized);

    const response = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      console.error(
        "[Adzuna] HTTP",
        response.status,
        response.statusText,
        "body:",
        text
      );
      const isDev = process.env.NODE_ENV !== "production";
      const hint =
        response.status === 401 || response.status === 403
          ? "Credenciais Adzuna inválidas. Verifique ADZUNA_APP_ID e ADZUNA_APP_KEY no .env.local e reinicie o servidor."
          : response.status === 429
          ? "Limite de chamadas Adzuna atingido. Tente novamente em alguns minutos."
          : "Erro ao consultar fonte de vagas. Tente novamente em instantes.";
      return NextResponse.json(
        {
          error: hint,
          ...(isDev && {
            debug: { status: response.status, body: text.slice(0, 500) },
          }),
        },
        { status: 502 }
      );
    }

    const data = (await response.json()) as AdzunaResponse;
    const jobs = (data.results || []).map((j, idx) => ({
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

    return NextResponse.json({
      jobs,
      totalCount: data.count || 0,
      page: targetPage,
    });
  } catch (err) {
    console.error("[search-jobs]", err);
    return NextResponse.json({ error: "Erro ao buscar vagas." }, { status: 500 });
  }
}
