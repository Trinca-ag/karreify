import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { JsonLd } from "./JsonLd";
import type { Guide } from "@/content/types";
import { GUIDES } from "@/content/guides";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://karreify.com";
const PUBLISHED = "2026-06-01";

export function GuideArticle({ guide }: { guide: Guide }) {
  const related = (guide.relatedSlugs || [])
    .map((s) => GUIDES.find((g) => g.slug === s))
    .filter((g): g is Guide => Boolean(g));

  const url = `${SITE_URL}/${guide.slug}`;

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.h1,
    description: guide.metaDescription,
    inLanguage: "pt-BR",
    datePublished: PUBLISHED,
    dateModified: PUBLISHED,
    author: { "@type": "Organization", name: "Karreify", url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: "Karreify",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/images/logo-karreify.png` },
    },
    mainEntityOfPage: url,
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: guide.faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: guide.h1, item: url },
    ],
  };

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <JsonLd data={articleLd} />
      {guide.faqs.length > 0 && <JsonLd data={faqLd} />}
      <JsonLd data={breadcrumbLd} />

      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-10 sm:pb-16">
        {/* Breadcrumb */}
        <nav className="text-xs text-gray-500 mb-6 flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-gray-300 transition-colors">Início</Link>
          <span>/</span>
          <span className="text-gray-400">{guide.h1}</span>
        </nav>

        <article>
          <header>
            <h1 className="text-3xl sm:text-4xl font-heading font-bold leading-tight tracking-tight">
              {guide.h1}
            </h1>
            <p className="mt-2 text-xs text-gray-500">
              Por <span className="text-gray-400">Equipe Karreify</span> · Revisado em 2026
            </p>
            <p className="mt-5 text-lg text-gray-300 leading-relaxed">{guide.intro}</p>
          </header>

          {/* Key takeaways */}
          {guide.keyTakeaways.length > 0 && (
            <div className="mt-8 rounded-2xl border border-primary-500/20 bg-primary-500/[0.06] p-5 sm:p-6">
              <h2 className="text-sm font-semibold text-primary-300 uppercase tracking-wider mb-3">
                Resumo rápido
              </h2>
              <ul className="space-y-2">
                {guide.keyTakeaways.map((t, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-200">
                    <Check className="w-4 h-4 text-primary-400 flex-shrink-0 mt-0.5" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Sections */}
          <div className="mt-10 space-y-10">
            {guide.sections.map((section, i) => (
              <section key={i}>
                <h2 className="text-2xl font-heading font-bold text-white mb-4 leading-snug">
                  {section.heading}
                </h2>
                <div className="space-y-4">
                  {section.body.map((p, j) => (
                    <p key={j} className="text-[15px] sm:text-base text-gray-300 leading-relaxed">
                      {p}
                    </p>
                  ))}
                </div>
                {section.bullets && section.bullets.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {section.bullets.map((b, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-[15px] text-gray-300">
                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary-400 flex-shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 rounded-2xl bg-gradient-to-br from-primary-600/15 to-accent-violet/15 border border-primary-500/25 p-6 sm:p-8 text-center">
            <Sparkles className="w-7 h-7 text-primary-400 mx-auto mb-3" />
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-white">
              Crie seu currículo com Inteligência Artificial
            </h2>
            <p className="mt-2 text-sm text-gray-300 max-w-md mx-auto">
              Coloque em prática agora: o Karreify monta, adapta e analisa seu currículo com IA em minutos. Comece grátis.
            </p>
            <Link
              href="/auth/register"
              className="mt-5 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold text-sm hover:from-primary-500 hover:to-primary-400 transition-all glow-blue"
            >
              Criar meu currículo grátis
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* FAQ */}
          {guide.faqs.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-heading font-bold text-white mb-5">Perguntas frequentes</h2>
              <div className="space-y-3">
                {guide.faqs.map((f, i) => (
                  <details
                    key={i}
                    className="group rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 sm:p-5"
                  >
                    <summary className="cursor-pointer list-none font-medium text-white flex items-start justify-between gap-3">
                      <span>{f.question}</span>
                      <span className="text-primary-400 transition-transform group-open:rotate-45 text-lg leading-none flex-shrink-0">+</span>
                    </summary>
                    <p className="mt-3 text-sm text-gray-300 leading-relaxed">{f.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* Related + internal links */}
          <section className="mt-12 border-t border-white/[0.08] pt-8">
            <h2 className="text-lg font-heading font-bold text-white mb-4">Continue lendo</h2>
            <div className="flex flex-col gap-2">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/${r.slug}`}
                  className="inline-flex items-center gap-2 text-sm text-primary-300 hover:text-primary-200 transition-colors"
                >
                  <ArrowRight className="w-3.5 h-3.5" /> {r.h1}
                </Link>
              ))}
              <Link
                href="/modelos-de-curriculo"
                className="inline-flex items-center gap-2 text-sm text-primary-300 hover:text-primary-200 transition-colors"
              >
                <ArrowRight className="w-3.5 h-3.5" /> Modelos de currículo por profissão
              </Link>
            </div>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
}
