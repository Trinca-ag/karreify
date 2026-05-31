import { NextResponse, type NextRequest } from "next/server";

/**
 * Geo-bloqueio: o site só é liberado para visitantes do Brasil.
 *
 * Lê o header `x-vercel-ip-country` (injetado pela Vercel em produção). Quando o
 * país é resolvido e NÃO é BR, reescreve para a página /region-blocked (451).
 *
 *  - Sem header (dev local / geo desconhecida) → libera, pra não bloquear por
 *    engano quando a Vercel não resolveu o país.
 *  - O matcher abaixo exclui /api/* (webhooks do AbacatePay, auth, etc.), os
 *    internos do Next e arquivos estáticos — então pagamentos e callbacks
 *    server-to-server continuam funcionando de qualquer origem.
 *  - Geo-bloqueio é por IP: bloqueia VPN/proxy de fora do BR, mas não impede
 *    quem usa um IP brasileiro (limitação inerente, não tem como evitar 100%).
 */
export function middleware(request: NextRequest) {
  const country = request.headers.get("x-vercel-ip-country");

  if (country && country !== "BR") {
    const url = request.nextUrl.clone();
    url.pathname = "/region-blocked";
    return NextResponse.rewrite(url, { status: 451 });
  }

  return NextResponse.next();
}

export const config = {
  // Roda em todas as rotas de página, exceto API, internos do Next e arquivos
  // estáticos (qualquer path com ponto, ex.: .png/.ico/.css/.js).
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
