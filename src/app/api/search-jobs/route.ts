import { NextRequest, NextResponse } from "next/server";
import { requireUser, authErrorResponse } from "@/lib/auth-server";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { deductCreditsServer, InsufficientCreditsError } from "@/lib/credits-server";
import {
  getCached,
  setCached,
  makeCacheKey,
  recordCall,
  getAdzunaMonthlyBillable,
  bumpAdzunaCount,
  ADZUNA_MONTHLY_THRESHOLD,
  type CachedJob,
  type JobProvider,
} from "@/lib/adzuna-usage";
import { callAdzuna, AdzunaApiError } from "@/lib/adzuna";
import { callJooble, JoobleApiError } from "@/lib/jooble";

const JOBS_SEARCH_FEATURE = "jobs-search";

interface SearchParams {
  keyword: string;
  uf?: string;
  city?: string;
  period: "today" | "week" | "month";
  exactMatch: boolean;
  page: number;
}

interface ProviderSuccess {
  ok: true;
  provider: JobProvider;
  jobs: CachedJob[];
  totalCount: number;
  durationMs: number;
}

interface ProviderFailure {
  ok: false;
  provider: JobProvider;
  status: number;
  body: string;
  durationMs: number;
}

async function searchViaAdzuna(
  params: SearchParams
): Promise<ProviderSuccess | ProviderFailure> {
  try {
    const result = await callAdzuna(params);
    return {
      ok: true,
      provider: "adzuna",
      jobs: result.jobs,
      totalCount: result.totalCount,
      durationMs: result.durationMs,
    };
  } catch (err) {
    if (err instanceof AdzunaApiError) {
      return {
        ok: false,
        provider: "adzuna",
        status: err.status,
        body: err.body,
        durationMs: err.durationMs,
      };
    }
    throw err;
  }
}

async function searchViaJooble(
  params: SearchParams
): Promise<ProviderSuccess | ProviderFailure> {
  try {
    const result = await callJooble(params);
    return {
      ok: true,
      provider: "jooble",
      jobs: result.jobs,
      totalCount: result.totalCount,
      durationMs: result.durationMs,
    };
  } catch (err) {
    if (err instanceof JoobleApiError) {
      return {
        ok: false,
        provider: "jooble",
        status: err.status,
        body: err.body,
        durationMs: err.durationMs,
      };
    }
    throw err;
  }
}

function errorHint(provider: JobProvider, status: number): string {
  if (status === 401 || status === 403) {
    return provider === "adzuna"
      ? "Credenciais Adzuna inválidas. Verifique ADZUNA_APP_ID e ADZUNA_APP_KEY no .env.local e reinicie o servidor."
      : "Credenciais Jooble inválidas. Verifique JOOBLE_API_KEY no .env.local e reinicie o servidor.";
  }
  if (status === 429) {
    return "Limite de chamadas da fonte de vagas atingido. Tente novamente em alguns minutos.";
  }
  return "Erro ao consultar fonte de vagas. Tente novamente em instantes.";
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

    const safePeriod = period === "today" || period === "week" ? period : "month";
    const targetPage = Math.max(1, Math.min(20, page || 1));
    const trimmedKeyword = keyword.trim().slice(0, 200);
    const searchParams: SearchParams = {
      keyword: trimmedKeyword,
      uf,
      city,
      period: safePeriod,
      exactMatch: !!exactMatch,
      page: targetPage,
    };

    // Pagination of an already-paid search doesn't charge. Charging only on
    // page=1 keeps the cost predictable for users (1 moeda per "Buscar" click)
    // and gives testers a single search that they can paginate through freely.
    if (targetPage === 1) {
      const userSnap = await adminDb.collection("users").doc(ctx.uid).get();
      const role = userSnap.data()?.role === "tester" ? "tester" : "user";

      if (role === "tester") {
        const prior = await adminDb
          .collection("users")
          .doc(ctx.uid)
          .collection("transactions")
          .where("feature", "==", JOBS_SEARCH_FEATURE)
          .where("type", "==", "debit")
          .limit(1)
          .get();
        if (!prior.empty) {
          return NextResponse.json(
            {
              error: "Testers têm direito a apenas 1 busca de vagas gratuita.",
              code: "TESTER_LIMIT_REACHED",
            },
            { status: 403 }
          );
        }
        await adminDb
          .collection("users")
          .doc(ctx.uid)
          .collection("transactions")
          .add({
            amount: 0,
            type: "debit",
            feature: JOBS_SEARCH_FEATURE,
            description: "Busca de vagas (tester — primeira grátis)",
            createdAt: FieldValue.serverTimestamp(),
          });
      } else {
        try {
          await deductCreditsServer(ctx.uid, JOBS_SEARCH_FEATURE, "Busca de vagas");
        } catch (e) {
          if (e instanceof InsufficientCreditsError) {
            return NextResponse.json(
              { error: e.message, code: "INSUFFICIENT_CREDITS" },
              { status: 402 }
            );
          }
          throw e;
        }
      }
    }

    const cacheKey = makeCacheKey(searchParams);
    const cached = await getCached(cacheKey);
    if (cached) {
      recordCall({
        status: "cache_hit",
        provider: "adzuna", // Cache hits don't actually call any provider — keeping "adzuna" for legacy chart continuity.
        keyword: trimmedKeyword,
        uf: uf ?? "",
        city: city ?? "",
        period: safePeriod,
        page: targetPage,
        exactMatch: !!exactMatch,
        userId: ctx.uid,
      });
      return NextResponse.json({
        jobs: cached.jobs,
        totalCount: cached.totalCount,
        page: targetPage,
      });
    }

    // Provider selection: stay on Adzuna while monthly usage is under the
    // soft threshold; switch to Jooble preventively above it. The actual
    // Adzuna 2500/month ceiling is the hard backstop — see the 429 handler.
    // ADZUNA_DISABLED=true forces all traffic to Jooble (useful for testing
    // or as a kill-switch during an Adzuna incident).
    const adzunaDisabled = process.env.ADZUNA_DISABLED === "true";
    let preferAdzuna = false;
    if (!adzunaDisabled) {
      const adzunaUsage = await getAdzunaMonthlyBillable();
      preferAdzuna = adzunaUsage < ADZUNA_MONTHLY_THRESHOLD;
    } else {
      console.log("[search-jobs] ADZUNA_DISABLED=true, routing to Jooble");
    }

    let result = preferAdzuna
      ? await searchViaAdzuna(searchParams)
      : await searchViaJooble(searchParams);

    // Reactive failover: if Adzuna refused with 429 (rate limit), retry via
    // Jooble for this single request. Other 4xx/5xx aren't worth retrying —
    // auth errors mean the credentials need fixing, 5xx is usually transient.
    // Record the 429 as a billable Adzuna error so the threshold check and
    // admin panel see the failed attempt.
    if (!result.ok && result.provider === "adzuna" && result.status === 429) {
      console.warn("[search-jobs] Adzuna 429, falling back to Jooble");
      recordCall({
        status: "api_error",
        provider: "adzuna",
        keyword: trimmedKeyword,
        uf: uf ?? "",
        city: city ?? "",
        period: safePeriod,
        page: targetPage,
        exactMatch: !!exactMatch,
        userId: ctx.uid,
        httpStatus: 429,
        durationMs: result.durationMs,
      });
      bumpAdzunaCount();
      result = await searchViaJooble(searchParams);
    }

    if (!result.ok) {
      recordCall({
        status: "api_error",
        provider: result.provider,
        keyword: trimmedKeyword,
        uf: uf ?? "",
        city: city ?? "",
        period: safePeriod,
        page: targetPage,
        exactMatch: !!exactMatch,
        userId: ctx.uid,
        httpStatus: result.status,
        durationMs: result.durationMs,
      });
      if (result.provider === "adzuna") bumpAdzunaCount();

      const isDev = process.env.NODE_ENV !== "production";
      return NextResponse.json(
        {
          error: errorHint(result.provider, result.status),
          ...(isDev && {
            debug: {
              provider: result.provider,
              status: result.status,
              body: result.body.slice(0, 500),
            },
          }),
        },
        { status: 502 }
      );
    }

    recordCall({
      status: "api_call",
      provider: result.provider,
      keyword: trimmedKeyword,
      uf: uf ?? "",
      city: city ?? "",
      period: safePeriod,
      page: targetPage,
      exactMatch: !!exactMatch,
      userId: ctx.uid,
      httpStatus: 200,
      durationMs: result.durationMs,
    });
    if (result.provider === "adzuna") bumpAdzunaCount();

    setCached(
      cacheKey,
      { jobs: result.jobs, totalCount: result.totalCount, page: targetPage },
      {
        keyword: trimmedKeyword,
        uf: uf ?? "",
        city: city ?? "",
        period: safePeriod,
        page: targetPage,
      }
    );

    return NextResponse.json({
      jobs: result.jobs,
      totalCount: result.totalCount,
      page: targetPage,
    });
  } catch (err) {
    console.error("[search-jobs]", err);
    return NextResponse.json({ error: "Erro ao buscar vagas." }, { status: 500 });
  }
}
