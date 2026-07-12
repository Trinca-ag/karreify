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
import {
  FREE_SEARCH_LIMIT,
  FREE_SEARCH_WINDOW_MS,
  PASS_DAILY_SAFETY_CAP,
} from "@/types";

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

/** Incrementa o contador diário de buscas do usuário (1 doc por dia). Usado
 *  apenas como teto de segurança para quem tem passe ativo. */
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

/**
 * Reserva atomicamente uma busca gratuita: checa o limite E incrementa o
 * contador na MESMA transação. Como o runTransaction do Firestore é
 * serializável (re-tenta no conflito de escrita), o contador nunca ultrapassa
 * FREE_SEARCH_LIMIT mesmo com N buscas page-1 concorrentes — fecha a corrida em
 * que todas passariam por um gate de leitura antes de qualquer incremento.
 * Reabre a janela (count=1) quando já se passaram 24h desde a última busca.
 *
 * Retorna allowed:false (+retryAt) se a janela esgotou, ou allowed:true
 * (+remaining/resetAt) tendo gravado a reserva. Se a busca depois falhar, chame
 * refundFreeSearch para estornar.
 */
async function reserveFreeSearch(
  uid: string,
  now: number
): Promise<
  | { allowed: false; retryAt: number }
  | { allowed: true; remaining: number; resetAt: number }
> {
  const userRef = adminDb.collection("users").doc(uid);
  return adminDb.runTransaction(async (tx) => {
    const snap = await tx.get(userRef);
    const data = snap.data() ?? {};
    const lastAt = (data.freeSearchLastAt as number | undefined) ?? 0;
    const count = (data.freeSearchCount as number | undefined) ?? 0;
    const windowExpired = now - lastAt >= FREE_SEARCH_WINDOW_MS;
    const usedInWindow = windowExpired ? 0 : count;

    if (usedInWindow >= FREE_SEARCH_LIMIT) {
      return { allowed: false as const, retryAt: lastAt + FREE_SEARCH_WINDOW_MS };
    }

    const newCount = usedInWindow + 1;
    tx.update(userRef, {
      freeSearchCount: newCount,
      freeSearchLastAt: now,
      updatedAt: new Date(),
    });
    return {
      allowed: true as const,
      remaining: Math.max(0, FREE_SEARCH_LIMIT - newCount),
      resetAt: now + FREE_SEARCH_WINDOW_MS,
    };
  });
}

/**
 * Estorna uma reserva quando a busca acabou falhando (erro do provider ou erro
 * inesperado). Compensa com -1 dentro de uma transação — seguro mesmo se outra
 * busca concorrente incrementou no meio, e nunca deixa o contador negativo.
 */
async function refundFreeSearch(uid: string): Promise<void> {
  const userRef = adminDb.collection("users").doc(uid);
  await adminDb.runTransaction(async (tx) => {
    const snap = await tx.get(userRef);
    const count = (snap.data()?.freeSearchCount as number | undefined) ?? 0;
    if (count <= 0) return;
    tx.update(userRef, { freeSearchCount: count - 1, updatedAt: new Date() });
  });
}

type JobModality = "presencial" | "hibrido" | "remoto";
const MODALITIES: JobModality[] = ["presencial", "hibrido", "remoto"];

/** Remove acentos e baixa a caixa para casar as regex de modalidade. */
function normalizeForMatch(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/** Classifica a modalidade pelo texto do anúncio. Híbrido tem precedência
 *  sobre remoto ("híbrido com home office" é híbrido); sem sinal =
 *  presencial. */
function classifyModality(job: CachedJob): JobModality {
  const text = normalizeForMatch(
    `${job.title} ${job.snippet} ${job.location} ${job.type}`
  );
  if (/hibrid/.test(text)) return "hibrido";
  if (/remot|home ?office|teletrabalho|anywhere/.test(text)) return "remoto";
  return "presencial";
}

/** Pós-filtro aplicado AO SERVIR (cache-hit e fresh); o cache guarda a
 *  página sem filtro, então refiltar é idempotente. */
function filterByModality(jobs: CachedJob[], modality?: JobModality): CachedJob[] {
  if (!modality) return jobs;
  return jobs.filter((j) => classifyModality(j) === modality);
}

interface SearchParams {
  keyword: string;
  uf?: string;
  city?: string;
  period: "today" | "week" | "month";
  exactMatch: boolean;
  modality?: JobModality;
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

  // Declarado fora do try para o catch poder estornar a reserva de busca
  // gratuita caso um erro inesperado ocorra depois de já termos reservado.
  let freeSearchReserved = false;

  try {
    const body = await request.json();
    const { keyword, uf, city, period, exactMatch, modality, page } = body as {
      keyword?: string;
      uf?: string;
      city?: string;
      period?: "today" | "week" | "month";
      exactMatch?: boolean;
      modality?: string;
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
    const safeModality = MODALITIES.includes(modality as JobModality)
      ? (modality as JobModality)
      : undefined;
    const searchParams: SearchParams = {
      keyword: trimmedKeyword,
      uf,
      city,
      period: safePeriod,
      exactMatch: !!exactMatch,
      modality: safeModality,
      page: targetPage,
    };

    const now = Date.now();
    const dailyDateKey = brtDateKey();
    // Cobrança: o passe (countablePassSearch) conta só a busca inicial (page 1)
    // no teto de segurança e é incrementado APÓS o sucesso. O tier gratuito
    // reserva por página ANTES da busca (reserveFreeSearch) — cada página conta
    // — e estorna (refundFreeSearch) se a busca falhar.
    let countablePassSearch = false; // passe ativo → conta no teto de segurança
    // Devolvido ao cliente para exibir "X buscas gratuitas restantes".
    let freeInfo: { remaining: number; resetAt: number } | null = null;

    // Buscar vagas é GRATUITO: FREE_SEARCH_LIMIT buscas por janela de 24h, e
    // CADA PÁGINA de resultados conta como uma busca (a reserva roda em TODA
    // página, não só na page 1). Testers usam exatamente este tier gratuito
    // (3/24h, como qualquer usuário). Passe ativo = ilimitado, com teto de
    // segurança invisível que conta só a busca inicial (page 1) — paginar
    // dentro do passe não consome.
    {
      const userSnap = await adminDb.collection("users").doc(ctx.uid).get();
      const userData = userSnap.data() ?? {};
      const passExpiresAt = (userData.jobsPassExpiresAt as number | undefined) ?? 0;
      const hasActivePass = passExpiresAt > now;

      if (hasActivePass) {
        // Passe ativo = buscas ilimitadas. Teto de segurança (invisível) conta
        // só a busca inicial de cada pesquisa (page 1); paginar não consome.
        if (targetPage === 1) {
          const dailySnap = await adminDb
            .collection("users")
            .doc(ctx.uid)
            .collection("jobsSearchDaily")
            .doc(dailyDateKey)
            .get();
          const usedToday = (dailySnap.data()?.count as number | undefined) ?? 0;
          if (usedToday >= PASS_DAILY_SAFETY_CAP) {
            return NextResponse.json(
              {
                error: "Muitas buscas em um curto período. Tente novamente mais tarde.",
                code: "DAILY_LIMIT_REACHED",
                limit: PASS_DAILY_SAFETY_CAP,
              },
              { status: 429 }
            );
          }
          countablePassSearch = true;
        }
      } else {
        // Tier gratuito: CADA PÁGINA (inclusive paginação) conta como uma das
        // FREE_SEARCH_LIMIT buscas por janela de 24h. Reserva atômica (checa +
        // incrementa numa transação) ANTES de chamar o provider, evitando que
        // requisições concorrentes furem o limite. Se a busca falhar adiante,
        // estornamos (refundFreeSearch). Revisitar uma página já vista é servido
        // do cache do client (jobs/page.tsx) e não chega aqui — só páginas novas.
        const reservation = await reserveFreeSearch(ctx.uid, now);
        if (!reservation.allowed) {
          return NextResponse.json(
            {
              error: `Você usou suas ${FREE_SEARCH_LIMIT} buscas gratuitas. Volte em 24h ou ative um passe para buscas ilimitadas.`,
              code: "FREE_LIMIT_REACHED",
              limit: FREE_SEARCH_LIMIT,
              retryAt: reservation.retryAt,
            },
            { status: 429 }
          );
        }
        freeSearchReserved = true;
        freeInfo = {
          remaining: reservation.remaining,
          resetAt: reservation.resetAt,
        };
      }
    }

    // Remoto/híbrido mudam a query enviada ao provider, então precisam de
    // chave própria; presencial/todas compartilham a MESMA busca de provider
    // (o filtro só roda ao servir) — sufixo aplicado apenas à chave, nunca
    // ao provider.
    const cacheKey = makeCacheKey(
      safeModality === "remoto" || safeModality === "hibrido"
        ? { ...searchParams, keyword: `${trimmedKeyword} §mod=${safeModality}` }
        : searchParams
    );
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
      if (countablePassSearch) await bumpDailySearch(ctx.uid, dailyDateKey);
      // Busca gratuita já foi reservada (incrementada) no gate; cache hit é
      // sucesso, então não há nada a estornar.
      return NextResponse.json({
        jobs: filterByModality(cached.jobs, safeModality),
        totalCount: cached.totalCount,
        page: targetPage,
        ...(freeInfo && {
          freeSearchesRemaining: freeInfo.remaining,
          freeSearchResetAt: freeInfo.resetAt,
        }),
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

      // Falhou nos dois providers — estorna a reserva para não consumir uma
      // busca gratuita que não entregou resultados.
      if (freeSearchReserved) await refundFreeSearch(ctx.uid);

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

    if (countablePassSearch) await bumpDailySearch(ctx.uid, dailyDateKey);
    // Busca gratuita já foi reservada no gate; provider OK = sucesso, nada a estornar.
    return NextResponse.json({
      jobs: filterByModality(result.jobs, safeModality),
      totalCount: result.totalCount,
      page: targetPage,
      ...(freeInfo && {
        freeSearchesRemaining: freeInfo.remaining,
        freeSearchResetAt: freeInfo.resetAt,
      }),
    });
  } catch (err) {
    console.error("[search-jobs]", err);
    // Erro inesperado depois de já termos reservado a busca gratuita → estorna.
    if (freeSearchReserved) {
      try {
        await refundFreeSearch(ctx.uid);
      } catch (refundErr) {
        console.error("[search-jobs] estorno da busca gratuita falhou:", refundErr);
      }
    }
    return NextResponse.json({ error: "Erro ao buscar vagas." }, { status: 500 });
  }
}
