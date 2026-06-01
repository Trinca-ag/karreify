import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_APP_URL || "https://karreify.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Páginas de app (atrás de login), painel admin, APIs e auxiliares não
      // têm valor de busca — fora do índice.
      disallow: [
        "/admin",
        "/api/",
        "/dashboard",
        "/create-resume",
        "/resume-analysis",
        "/adapt-resume",
        "/cover-letter",
        "/company-analysis",
        "/jobs",
        "/plans",
        "/market",
        "/my-files",
        "/profile",
        "/support",
        "/feedback",
        "/auth/",
        "/region-blocked",
      ],
    },
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
