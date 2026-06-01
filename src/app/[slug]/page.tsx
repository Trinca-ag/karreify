import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getGuide, guideMetadata, allGuideSlugs } from "@/content/guides";
import { GuideArticle } from "@/components/content/GuideArticle";

// Catch-all dos guias em slug raiz (ex.: /como-fazer-um-curriculo). Só os slugs
// gerados são válidos; qualquer outro caminho de segmento único cai em 404.
// Rotas estáticas (/sobre, /modelos-de-curriculo, /help...) têm precedência.
export const dynamicParams = false;

export function generateStaticParams() {
  return allGuideSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  return guideMetadata(params.slug);
}

export default function Page({ params }: { params: { slug: string } }) {
  const guide = getGuide(params.slug);
  if (!guide) notFound();
  return <GuideArticle guide={guide} />;
}
