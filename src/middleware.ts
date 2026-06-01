import { NextResponse, type NextRequest } from "next/server";

/**
 * Rastreadores de busca e bots de preview de link. São liberados ANTES do
 * geo-bloqueio e recebem o MESMO conteúdo que um usuário do Brasil — servir o
 * mesmo HTML que um visitante BR veria NÃO é cloaking (cloaking seria mostrar
 * conteúdo diferente pro bot). Sem isto, o Googlebot — que rastreia majoritaria-
 * mente de IPs dos EUA — cairia no bloqueio "só Brasil" e o site nunca seria
 * indexado. Inclui o Google-InspectionTool (usado pelo "Testar URL ao vivo" do
 * Search Console) e os bots de preview (WhatsApp, Facebook, etc.) pra os cards
 * de compartilhamento funcionarem.
 *
 * Obs.: a checagem é por User-Agent. Como o geo-bloqueio é uma restrição "soft"
 * (disponibilidade, não segurança), o risco de alguém forjar o UA do Googlebot
 * só pra ver um site de currículos é irrelevante.
 */
const SEARCH_AND_PREVIEW_BOTS =
  /googlebot|google-inspectiontool|storebot-google|google-extended|bingbot|applebot|duckduckbot|yandex|baiduspider|slurp|sogou|petalbot|facebookexternalhit|facebot|twitterbot|linkedinbot|whatsapp|telegrambot|discordbot|slackbot/i;

/**
 * Geo-bloqueio: o site só é liberado para visitantes do Brasil.
 *
 * Lê o header `x-vercel-ip-country` (injetado pela Vercel em produção). Quando o
 * país é resolvido e NÃO é BR, reescreve para a página /region-blocked (451).
 *
 *  - Rastreadores verificados passam direto (ver acima) — pré-requisito pra
 *    indexação no Google.
 *  - Sem header (dev local / geo desconhecida) → libera, pra não bloquear por
 *    engano quando a Vercel não resolveu o país.
 *  - O matcher abaixo exclui /api/*, internos do Next e arquivos estáticos
 *    (incl. /robots.txt e /sitemap.xml, que têm ponto) — então robots/sitemap
 *    respondem 200 pra qualquer origem, e webhooks continuam funcionando.
 *  - Geo-bloqueio é por IP: bloqueia VPN/proxy de fora do BR, mas não impede
 *    quem usa um IP brasileiro (limitação inerente, não tem como evitar 100%).
 */
export function middleware(request: NextRequest) {
  const ua = request.headers.get("user-agent") || "";
  if (SEARCH_AND_PREVIEW_BOTS.test(ua)) {
    return NextResponse.next();
  }

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
