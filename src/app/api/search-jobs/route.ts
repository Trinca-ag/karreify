import { NextRequest, NextResponse } from "next/server";
import { requireUser, authErrorResponse } from "@/lib/auth-server";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import {
  getCached,
  setCached,
  makeCacheKey,
  recordCall,
  getJoobleTotalBillable,
  bumpJoobleCount,
  JOOBLE_TOTAL_LIMIT,
  type CachedJob,
  type JobProvider,
} from "@/lib/adzuna-usage";
import { callAdzuna, AdzunaApiError } from "@/lib/adzuna";
import { callJooble, JoobleApiError } from "@/lib/jooble";

const JOBS_SEARCH_FEATURE = "jobs-search";

/** Limite de buscas por dia para usuários com passe ativo (reset à meia-noite BRT). */
const DAILY_SEARCH_LIMIT = 10;

/** Chave de dia no fuso de Brasília (YYYY-MM-DD). O limite diário zera à
 *  meia-noite BRT, por isso derivamos a data nesse fuso e não em UTC. */
function brtDateKey(d: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

/** Incrementa o contador diário de buscas do usuário (1 doc por dia). */
async function bumpDailySearch(uid: string, dateKey: string): Promise<void> {
  await adminDb
    .collection("users")
    .doc(uid)
    .collection("jobsSearchDaily")
    .doc(dateKey)
    .set(
      {
        count: FieldValue.increment(1),
        date: dateKey,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
}

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

    const dailyDateKey = brtDateKey();
    // `true` quando um usuário (não-tester) com passe ativo passa pelo gate de
    // limite diário na página 1 — usamos pra incrementar o contador só após a
    // busca dar certo (cache hit ou provider OK), nunca em falha.
    let countableSearch = false;

    // Modo de cobrança agora é por passe (semanal/mensal). Testers continuam
    // com 1 busca grátis. Para users, basta ter um passe ativo — porém limitado
    // a DAILY_SEARCH_LIMIT buscas por dia.
    if (targetPage === 1) {
      const userSnap = await adminDb.collection("users").doc(ctx.uid).get();
      const userData = userSnap.data() ?? {};
      const role = userData.role === "tester" ? "tester" : "user";

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
        const passExpiresAt = (userData.jobsPassExpiresAt as number | undefined) ?? 0;
        if (passExpiresAt <= Date.now()) {
          return NextResponse.json(
            {
              error: "Você não tem um passe ativo. Compre um passe semanal ou mensal para buscar vagas.",
              code: "NO_ACTIVE_PASS",
            },
            { status: 402 }
          );
        }

        // Mesmo com passe ativo, cada usuário tem no máximo DAILY_SEARCH_LIMIT
        // buscas por dia. Só checamos aqui; o incremento ocorre após a busca dar
        // certo. Paginação não conta — todo este gate está sob targetPage === 1.
        const dailySnap = await adminDb
          .collection("users")
          .doc(ctx.uid)
          .collection("jobsSearchDaily")
          .doc(dailyDateKey)
          .get();
        const usedToday = (dailySnap.data()?.count as number | undefined) ?? 0;
        if (usedToday >= DAILY_SEARCH_LIMIT) {
          return NextResponse.json(
            {
              error: `Você atingiu o limite de ${DAILY_SEARCH_LIMIT} buscas por dia. O limite zera amanhã.`,
              code: "DAILY_LIMIT_REACHED",
              limit: DAILY_SEARCH_LIMIT,
            },
            { status: 429 }
          );
        }
        countableSearch = true;
      }
    }

    const cacheKey = makeCacheKey(searchParams);
    const cached = await getCached(cacheKey);
    if (cached) {
      recordCall({
        status: "cache_hit",
        provider: "jooble", // Cache hits don't call any provider; rotulado como "jooble" porque é o primário.
        keyword: trimmedKeyword,
        uf: uf ?? "",
        city: city ?? "",
        period: safePeriod,
        page: targetPage,
        exactMatch: !!exactMatch,
        userId: ctx.uid,
      });
      if (countableSearch) await bumpDailySearch(ctx.uid, dailyDateKey);
      return NextResponse.json({
        jobs: cached.jobs,
        totalCount: cached.totalCount,
        page: targetPage,
      });
    }

    // Provider selection: Jooble é primária (resposta oficial confirmou cota
    // vitalícia de 500 por chave; usamos enquanto há crédito). Se já passou
    // do limite, rota direto pra Adzuna. JOOBLE_DISABLED=true força tudo
    // para Adzuna (kill-switch durante incidente).
    const joobleDisabled = process.env.JOOBLE_DISABLED === "true";
    let preferJooble = false;
    if (!joobleDisabled) {
      const joobleUsage = await getJoobleTotalBillable();
      preferJooble = joobleUsage < JOOBLE_TOTAL_LIMIT;
      if (!preferJooble) {
        console.warn(
          `[search-jobs] cota Jooble esgotada (${joobleUsage}/${JOOBLE_TOTAL_LIMIT}), roteando para Adzuna`
        );
      }
    } else {
      console.log("[search-jobs] JOOBLE_DISABLED=true, routing to Adzuna");
    }

    let result = preferJooble
      ? await searchViaJooble(searchParams)
      : await searchViaAdzuna(searchParams);

    // Reactive failover: se a Jooble falhou (qualquer status), tentamos
    // Adzuna. A documentação Jooble não garante código de erro consistente
    // quando a cota esgota — pode ser 403 (chave inválida) ou simplesmente
    // parar de responder. Tratamos qualquer erro como motivo pra cair na
    // Adzuna. Registramos o erro Jooble pra aparecer no console de erros.
    if (!result.ok && result.provider === "jooble") {
      console.warn(
        `[search-jobs] Jooble falhou (${result.status}), fallback Adzuna`
      );
      recordCall({
        status: "api_error",
        provider: "jooble",
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
      bumpJoobleCount();
      result = await searchViaAdzuna(searchParams);
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
      if (result.provider === "jooble") bumpJoobleCount();

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
    if (result.provider === "jooble") bumpJoobleCount();

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

    if (countableSearch) await bumpDailySearch(ctx.uid, dailyDateKey);
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
