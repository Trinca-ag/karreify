import { NextRequest, NextResponse } from "next/server";
import { rateLimit, rateLimitResponse, getClientIp } from "@/lib/rate-limit";
import {
  ADMIN_AUTH_LOCKOUTS_MS,
  DEFAULT_MAX_ATTEMPTS,
  USER_AUTH_LOCKOUTS_MS,
  authRateLimitResponse,
  checkAuthRateLimit,
  isAdminEmail,
  recordAuthFailure,
  recordAuthSuccess,
  type AuthRateLimitPolicy,
  type AuthRateLimitResult,
} from "@/lib/auth-rate-limit";

/**
 * Endpoint de tracking pro login client-side (Firebase Auth SDK).
 *
 * `/auth/login` (user comum) e `/admin/login` (device trusted) chamam o Firebase
 * direto pelo browser — não passam pelo nosso server. Pra ter rate-limit
 * escalonado o cliente precisa chamar este endpoint antes de tentar o login e
 * depois de cada resultado.
 *
 * Dois tracks de bloqueio em paralelo:
 *   1. Por email   — limita ataques contra um user específico
 *   2. Por IP      — limita ataques que trocam de email a cada tentativa
 *                    (sem isso o atacante burlava trocando o input do email)
 *
 * Limitação intencional: atacante que chama a API REST do Firebase com curl
 * burla este check (não passa pelo nosso JS). Pra defesa real precisaria de
 * App Check / reCAPTCHA Enterprise. Aqui é defense-in-depth contra clientes
 * normais.
 *
 * Body: { email, action: "check" | "fail" | "success" }
 */

interface RequestBody {
  email?: string;
  action?: "check" | "fail" | "success";
}

const IP_LOGIN_POLICY: AuthRateLimitPolicy = {
  scope: "login-by-ip",
  maxAttempts: DEFAULT_MAX_ATTEMPTS,
  // Mesma escalada da policy user — IP é proxy pra "tentativas da sessão", e a
  // ameaça mais comum é alguém fuçando no mesmo navegador, não atacante real
  // com botnet. Se virar problema, sobe pra ADMIN_AUTH_LOCKOUTS_MS.
  lockoutDurationsMs: USER_AUTH_LOCKOUTS_MS,
};

function moreRestrictive(a: AuthRateLimitResult, b: AuthRateLimitResult): AuthRateLimitResult {
  if (!a.allowed && !b.allowed) {
    // Ambos bloqueados — pega o que tem maior espera.
    return (a.retryAfterSeconds ?? 0) >= (b.retryAfterSeconds ?? 0) ? a : b;
  }
  if (!a.allowed) return a;
  if (!b.allowed) return b;
  // Ambos liberados — devolve o que tem menos tentativas restantes (mais perto
  // do bloqueio), pra UI mostrar o aviso mais cedo.
  const aRem = a.attemptsRemaining ?? Number.POSITIVE_INFINITY;
  const bRem = b.attemptsRemaining ?? Number.POSITIVE_INFINITY;
  return aRem <= bRem ? a : b;
}

export async function POST(request: NextRequest) {
  // Burst limit pesado pra evitar que atacante use este endpoint pra mapear
  // qual email é admin (cada check faz lookup).
  const burst = rateLimit(getClientIp(request), {
    scope: "login-rate-track-ip",
    limit: 30,
    windowMs: 60_000,
  });
  if (!burst.allowed) return rateLimitResponse(burst);

  let body: RequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  const { email, action } = body;
  if (!email || typeof email !== "string" || email.length > 320) {
    return NextResponse.json({ error: "Email obrigatório" }, { status: 400 });
  }
  if (action !== "check" && action !== "fail" && action !== "success") {
    return NextResponse.json({ error: "Action inválida" }, { status: 400 });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const ip = getClientIp(request);

  try {
    const isAdmin = await isAdminEmail(normalizedEmail);
    const emailPolicy: AuthRateLimitPolicy = {
      scope: isAdmin ? "admin-login-password" : "user-login-password",
      maxAttempts: DEFAULT_MAX_ATTEMPTS,
      lockoutDurationsMs: isAdmin ? ADMIN_AUTH_LOCKOUTS_MS : USER_AUTH_LOCKOUTS_MS,
    };

    if (action === "check") {
      const [emailRes, ipRes] = await Promise.all([
        checkAuthRateLimit(normalizedEmail, emailPolicy),
        checkAuthRateLimit(ip, IP_LOGIN_POLICY),
      ]);
      const merged = moreRestrictive(emailRes, ipRes);
      if (!merged.allowed) return authRateLimitResponse(merged);
      return NextResponse.json({
        allowed: true,
        attemptsRemaining: merged.attemptsRemaining,
      });
    }

    if (action === "fail") {
      // Incrementa contadores nas DUAS dimensões (email e IP). Quem chegar no
      // limite primeiro bloqueia.
      const [emailRes, ipRes] = await Promise.all([
        recordAuthFailure(normalizedEmail, emailPolicy),
        recordAuthFailure(ip, IP_LOGIN_POLICY),
      ]);
      const merged = moreRestrictive(emailRes, ipRes);
      if (!merged.allowed) return authRateLimitResponse(merged);
      return NextResponse.json({
        allowed: true,
        attemptsRemaining: merged.attemptsRemaining,
      });
    }

    // action === "success" — login válido, zera ambos contadores.
    await Promise.all([
      recordAuthSuccess(normalizedEmail, emailPolicy.scope),
      recordAuthSuccess(ip, IP_LOGIN_POLICY.scope),
    ]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[login-rate]", error);
    // Em caso de erro do Firestore, fail-open (deixa o login prosseguir) pra
    // não impedir login legítimo por falha nossa. O Firebase nativo segura.
    return NextResponse.json({ allowed: true, fallback: true });
  }
}
