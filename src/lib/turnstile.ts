const SITEVERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export interface TurnstileVerifyResult {
  success: boolean;
  errorCodes?: string[];
}

/**
 * Valida um token do Cloudflare Turnstile via endpoint `siteverify`.
 *
 * Comportamento de rollout/seguro:
 *  - Se `TURNSTILE_SECRET_KEY` NÃO estiver configurada → retorna success=true
 *    (fail-open). O captcha fica "desligado" até as chaves serem adicionadas,
 *    sem travar nenhum login/cadastro.
 *  - Erro de rede ao falar com a Cloudflare → também fail-open. O widget
 *    client-side já filtra bots no edge; não bloqueamos usuário legítimo por
 *    instabilidade externa (mesma filosofia do /api/auth/login-rate).
 *
 * Tokens são single-use e expiram em 300s — reusar retorna o erro
 * `timeout-or-duplicate`. Por isso o cliente reseta o widget após cada tentativa.
 */
export async function verifyTurnstileToken(
  token: string | null | undefined,
  remoteIp?: string
): Promise<TurnstileVerifyResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return { success: true }; // captcha não configurado → libera

  if (!token || typeof token !== "string") {
    return { success: false, errorCodes: ["missing-input-response"] };
  }

  try {
    const form = new URLSearchParams();
    form.set("secret", secret);
    form.set("response", token);
    if (remoteIp) form.set("remoteip", remoteIp);

    const res = await fetch(SITEVERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
    });
    const data = (await res.json()) as {
      success?: boolean;
      "error-codes"?: string[];
    };
    return {
      success: data.success === true,
      errorCodes: data["error-codes"],
    };
  } catch (err) {
    console.error("[turnstile] siteverify falhou:", err);
    return { success: true }; // fail-open por instabilidade externa
  }
}
