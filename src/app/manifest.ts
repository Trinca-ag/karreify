import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Karreify — Currículo com IA",
    short_name: "Karreify",
    description:
      "Crie currículos profissionais com inteligência artificial, gere cartas de apresentação, encontre vagas e impulsione sua carreira.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a14",
    theme_color: "#2563eb",
    lang: "pt-BR",
    icons: [
      { src: "/images/favicon-karreify.png", sizes: "any", type: "image/png" },
    ],
  };
}
