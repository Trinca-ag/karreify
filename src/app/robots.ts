import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_APP_URL || "https://karreify.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Só /api/ fica aqui, e por crawl budget — não por sigilo.
      //
      // O painel admin e as páginas de app atrás de login NÃO são listados de
      // propósito. robots.txt é público: listar "/admin" aqui entregaria o
      // caminho do painel para qualquer scanner. E `Disallow` bloqueia o
      // rastreamento, não o índice — com o crawl bloqueado o Google nunca veria
      // o noindex e a URL poderia continuar indexada via link externo.
      // A exclusão dessas rotas é feita por `X-Robots-Tag: noindex` em header
      // (ver NOINDEX_PATHS em next.config.mjs), que desindexa de verdade sem
      // divulgar caminho nenhum.
      disallow: ["/api/"],
    },
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
