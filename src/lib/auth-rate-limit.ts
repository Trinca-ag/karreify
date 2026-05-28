import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

/**
 * Rate-limit escalonado para endpoints sensíveis de auth (reset de senha, envio
 * de código, verificação de código). Persistido no Firestore para sobreviver a
 * cold starts do Vercel — o `rate-limit.ts` em memória só funciona dentro da
 * mesma instância e zera entre invocations.
 *
 * Esquema do doc em `authAttempts/{scope}__{normalizedIdentifier}`:
 *   - scope: identificador da rota (ex: "user-reset-send")
 *   - identifier: email/IP normalizado (lowercase trim)
 *   - count: tentativas falhadas desde o último bloqueio
 *   - level: quantos bloqueios já ocorreram (0..N)
 *   - lockedUntil: epoch ms até quando o identificador está bloqueado
 *
 * Quando `count` chega em `maxAttempts`:
 *   1. Sobe o `level`
 *   2. Pega `lockoutDurationsMs[min(level - 1, last index)]` como nova duração
 *   3. Seta `lockedUntil = now + duração`
 *   4. Zera `count` (a próxima janela começa após o bloqueio)
 */

export interface AuthRateLimitPolicy {
  /** Identificador único da rota — usado pra namespacear os contadores. */
  scope: string;
  /** Tentativas permitidas antes de aplicar bloqueio. */
  maxAttempts: number;
  /**
   * Durações progressivas de bloqueio em ms. Quando o user esgota tentativas
   * pela 1ª vez, aplica `[0]`; pela 2ª vez `[1]`; e assim por diante. O último
   * valor se repete indefinidamente nos bloqueios subsequentes.
   */
  lockoutDurationsMs: number[];
}

/**
 * Política para usuários comuns: 5 tentativas → 5min → 30min → 1h → 24h.
 */
export const USER_AUTH_LOCKOUTS_MS: number[] = [
  5 * 60 * 1000,
  30 * 60 * 1000,
  60 * 60 * 1000,
  24 * 60 * 60 * 1000,
];

/**
 * Política para admins: 5 tentativas → 30min → 1h → 24h. Sem o degrau inicial
 * de 5min — admin tem dados sensíveis, regime mais rígido.
 */
export const ADMIN_AUTH_LOCKOUTS_MS: number[] = [
  30 * 60 * 1000,
  60 * 60 * 1000,
  24 * 60 * 60 * 1000,
];

export const DEFAULT_MAX_ATTEMPTS = 5;

export interface AuthRateLimitResult {
  allowed: boolean;
  /** Quantas tentativas ainda restam na janela atual (só preenchido quando allowed). */
  attemptsRemaining?: number;
  /** Epoch ms até quando o identificador está bloqueado (só preenchido quando !allowed). */
  lockedUntil?: number;
  /** Segundos até o bloqueio acabar — pra header Retry-After. */
  retryAfterSeconds?: number;
  /** Nível atual de bloqueio (0 = nunca foi bloqueado). */
  level?: number;
}

function normalize(identifier: string): string {
  return identifier.toLowerCase().trim();
}

function docId(scope: string, identifier: string): string {
  return `${scope}__${normalize(identifier)}`;
}

/**
 * Verifica se o identificador pode prosseguir. Não incrementa contador — só
 * lê. Use ANTES da operação sensível; depois chame `recordAuthFailure` em caso
 * de erro ou `recordAuthSuccess` em caso de sucesso.
 */
export async function checkAuthRateLimit(
  identifier: string,
  policy: AuthRateLimitPolicy
): Promise<AuthRateLimitResult> {
  const ref = adminDb.collection("authAttempts").doc(docId(policy.scope, identifier));
  const snap = await ref.get();
  const now = Date.now();

  if (!snap.exists) {
    return { allowed: true, attemptsRemaining: policy.maxAttempts };
  }

  const data = snap.data() ?? {};
  const lockedUntil = (data.lockedUntil as number | undefined) ?? 0;
  const level = (data.level as number | undefined) ?? 0;

  if (lockedUntil > now) {
    return {
      allowed: false,
      lockedUntil,
      retryAfterSeconds: Math.ceil((lockedUntil - now) / 1000),
      level,
    };
  }

  const count = (data.count as number | undefined) ?? 0;
  return {
    allowed: true,
    attemptsRemaining: Math.max(0, policy.maxAttempts - count),
    level,
  };
}

/**
 * Registra uma tentativa falhada. Se o contador chegar em `maxAttempts`, sobe o
 * nível de bloqueio e seta `lockedUntil`. Retorna o estado pós-operação.
 */
export async function recordAuthFailure(
  identifier: string,
  policy: AuthRateLimitPolicy
): Promise<AuthRateLimitResult> {
  const ref = adminDb.collection("authAttempts").doc(docId(policy.scope, identifier));
  const now = Date.now();

  return adminDb.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const data = snap.exists ? snap.data() ?? {} : {};

    const lockedUntil = (data.lockedUntil as number | undefined) ?? 0;
    const currentLevel = (data.level as number | undefined) ?? 0;

    // Já está bloqueado — só retorna o estado atual sem incrementar.
    if (lockedUntil > now) {
      return {
        allowed: false,
        lockedUntil,
        retryAfterSeconds: Math.ceil((lockedUntil - now) / 1000),
        level: currentLevel,
      } as AuthRateLimitResult;
    }

    const newCount = ((data.count as number | undefined) ?? 0) + 1;

    if (newCount >= policy.maxAttempts) {
      const nextLevel = currentLevel + 1;
      const lockoutIdx = Math.min(nextLevel - 1, policy.lockoutDurationsMs.length - 1);
      const durationMs = policy.lockoutDurationsMs[lockoutIdx];
      const newLockedUntil = now + durationMs;

      tx.set(ref, {
        scope: policy.scope,
        identifier: normalize(identifier),
        count: 0,
        level: nextLevel,
        lockedUntil: newLockedUntil,
        updatedAt: new Date(),
      });

      return {
        allowed: false,
        lockedUntil: newLockedUntil,
        retryAfterSeconds: Math.ceil(durationMs / 1000),
        level: nextLevel,
      } as AuthRateLimitResult;
    }

    tx.set(
      ref,
      {
        scope: policy.scope,
        identifier: normalize(identifier),
        count: newCount,
        level: currentLevel,
        updatedAt: new Date(),
      },
      { merge: true }
    );

    return {
      allowed: true,
      attemptsRemaining: policy.maxAttempts - newCount,
      level: currentLevel,
    } as AuthRateLimitResult;
  });
}

/**
 * Limpa o registro após sucesso — o identificador volta à estaca zero. Use
 * após login/reset bem-sucedido para não punir usuário legítimo que errou
 * algumas tentativas antes de acertar.
 */
export async function recordAuthSuccess(
  identifier: string,
  scope: string
): Promise<void> {
  await adminDb
    .collection("authAttempts")
    .doc(docId(scope, identifier))
    .delete()
    .catch(() => {});
}

/**
 * Formata uma resposta HTTP 429 padrão pra rate-limit escalonado de auth.
 * Mensagem em português pra renderização direta no frontend.
 */
export function authRateLimitResponse(result: AuthRateLimitResult): NextResponse {
  const retryAfter = result.retryAfterSeconds ?? 60;
  const minutes = Math.ceil(retryAfter / 60);

  let timeLabel: string;
  if (retryAfter < 60) {
    timeLabel = `${retryAfter} segundos`;
  } else if (minutes < 60) {
    timeLabel = `${minutes} minuto${minutes > 1 ? "s" : ""}`;
  } else if (minutes < 60 * 24) {
    const hours = Math.ceil(retryAfter / 3600);
    timeLabel = `${hours} hora${hours > 1 ? "s" : ""}`;
  } else {
    const days = Math.ceil(retryAfter / 86400);
    timeLabel = `${days} dia${days > 1 ? "s" : ""}`;
  }

  return NextResponse.json(
    {
      error: `Muitas tentativas. Tente novamente em ${timeLabel}.`,
      code: "AUTH_RATE_LIMITED",
      retryAfterSeconds: retryAfter,
      level: result.level,
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfter),
      },
    }
  );
}

/**
 * Lookup rápido para detectar se um email pertence a admin — usado pra escolher
 * entre políticas USER vs ADMIN nos endpoints compartilhados (reset de senha).
 */
export async function isAdminEmail(email: string): Promise<boolean> {
  const snap = await adminDb
    .collection("admins")
    .where("email", "==", normalize(email))
    .limit(1)
    .get();
  return !snap.empty;
}
