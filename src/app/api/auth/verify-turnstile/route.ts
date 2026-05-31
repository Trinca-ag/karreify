import { NextRequest, NextResponse } from "next/server";
import { rateLimit, rateLimitResponse, getClientIp } from "@/lib/rate-limit";
import { verifyTurnstileToken } from "@/lib/turnstile";

/**
 * Valida um token do Cloudflare Turnstile vindo dos formulários de auth
 * (login, cadastro, recuperação de senha). O cliente chama este endpoint ANTES
 * de prosseguir com a ação (Firebase login/cadastro, ou /api/send-reset-code).
 *
 * Quando TURNSTILE_SECRET_KEY não está configurada, verifyTurnstileToken é
 * fail-open (success=true), então o endpoint responde 200 e nada trava.
 */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  const burst = rateLimit(ip, {
    scope: "verify-turnstile-ip",
    limit: 30,
    windowMs: 60_000,
  });
  if (!burst.allowed) return rateLimitResponse(burst);

  let token: unknown;
  try {
    const body = await request.json();
    token = body?.token;
  } catch {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  if (typeof token !== "string" || token.length === 0 || token.length > 2048) {
    return NextResponse.json(
      { error: "Verificação anti-robô inválida.", code: "CAPTCHA_FAILED" },
      { status: 403 }
    );
  }

  const result = await verifyTurnstileToken(token, ip);
  if (!result.success) {
    return NextResponse.json(
      {
        error:
          "Verificação anti-robô falhou. Recarregue a página e tente novamente.",
        code: "CAPTCHA_FAILED",
      },
      { status: 403 }
    );
  }

  return NextResponse.json({ success: true });
}
