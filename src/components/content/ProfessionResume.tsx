import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ArrowRight, Check, X, Sparkles, Briefcase, GraduationCap } from "lucide-react";
import { JsonLd } from "./JsonLd";
import type { Profession } from "@/content/types";
import { PROFESSIONS } from "@/content/professions";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://karreify.com";
const PUBLISHED = "2026-06-01";

export function ProfessionResume({ profession }: { profession: Profession }) {
  const p = profession;
  const r = p.sampleResume;
  const url = `${SITE_URL}/modelos-de-curriculo/${p.slug}`;
  const others = PROFESSIONS.filter((x) => x.slug !== p.slug).slice(0, 5);

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: p.h1,
    description: p.metaDescription,
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
    mainEntity: p.faqs.map((f) => ({
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
      { "@type": "ListItem", position: 2, name: "Modelos de Currículo", item: `${SITE_URL}/modelos-de-curriculo` },
      { "@type": "ListItem", position: 3, name: p.profession, item: url },
    ],
  };

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <JsonLd data={articleLd} />
      {p.faqs.length > 0 && <JsonLd data={faqLd} />}
      <JsonLd data={breadcrumbLd} />

      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-10 sm:pb-16">
        <nav className="text-xs text-gray-500 mb-6 flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-gray-300 transition-colors">Início</Link>
          <span>/</span>
          <Link href="/modelos-de-curriculo" className="hover:text-gray-300 transition-colors">Modelos de Currículo</Link>
          <span>/</span>
          <span className="text-gray-400">{p.profession}</span>
        </nav>

        <header>
          <h1 className="text-3xl sm:text-4xl font-heading font-bold leading-tight tracking-tight">
            {p.h1}
          </h1>
          <p className="mt-5 text-lg text-gray-300 leading-relaxed">{p.intro}</p>
        </header>

        {/* Sample resume */}
        <section className="mt-10">
          <h2 className="text-2xl font-heading font-bold text-white mb-4">Exemplo de currículo para {p.profession}</h2>
          <div className="rounded-2xl border border-white/[0.1] bg-white/[0.03] p-6 sm:p-8">
            <div className="border-b border-white/[0.08] pb-4">
              <p className="text-xl font-bold text-white">{r.name}</p>
              <p className="text-primary-300 font-medium">{r.headline}</p>
            </div>
            <div className="mt-4">
              <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-1.5">Resumo profissional</p>
              <p className="text-sm text-gray-300 leading-relaxed">{r.summary}</p>
            </div>

            <div className="mt-5">
              <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-2 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" /> Experiência
              </p>
              <div className="space-y-4">
                {r.experience.map((exp, i) => (
                  <div key={i}>
                    <div className="flex justify-between gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-white">{exp.role}</p>
                      <p className="text-xs text-gray-500">{exp.period}</p>
                    </div>
                    <p className="text-xs text-gray-400 mb-1.5">{exp.company}</p>
                    <ul className="space-y-1">
                      {exp.bullets.map((b, j) => (
                        <li key={j} className="flex items-start gap-2 text-[13px] text-gray-300">
                          <span className="mt-1.5 w-1 h-1 rounded-full bg-primary-400 flex-shrink-0" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-2 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5" /> Formação
              </p>
              <div className="space-y-2">
                {r.education.map((edu, i) => (
                  <div key={i} className="flex justify-between gap-2 flex-wrap">
                    <div>
                      <p className="text-sm text-white">{edu.degree}</p>
                      <p className="text-xs text-gray-400">{edu.institution}</p>
                    </div>
                    <p className="text-xs text-gray-500">{edu.period}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-2">Habilidades</p>
              <div className="flex flex-wrap gap-1.5">
                {r.skills.map((s, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-md bg-white/[0.05] border border-white/[0.08] text-xs text-gray-200">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Key skills */}
        <section className="mt-10">
          <h2 className="text-2xl font-heading font-bold text-white mb-4">Principais habilidades de {p.profession}</h2>
          <div className="flex flex-wrap gap-2">
            {p.keySkills.map((s, i) => (
              <span key={i} className="px-3 py-1.5 rounded-lg bg-primary-500/10 border border-primary-500/20 text-sm text-primary-200">
                {s}
              </span>
            ))}
          </div>
        </section>

        {/* ATS keywords */}
        <section className="mt-10">
          <h2 className="text-2xl font-heading font-bold text-white mb-3">Palavras-chave para passar no ATS</h2>
          <p className="text-sm text-gray-400 mb-4">
            Sistemas de triagem (ATS) filtram currículos por palavras-chave. Inclua estes termos (quando forem verdade) para aumentar suas chances:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {p.atsKeywords.map((k, i) => (
              <span key={i} className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-xs text-gray-300">
                {k}
              </span>
            ))}
          </div>
        </section>

        {/* Salary */}
        <section className="mt-10 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 sm:p-6">
          <h2 className="text-lg font-heading font-bold text-white mb-2">Faixa salarial</h2>
          <p className="text-sm text-gray-300 leading-relaxed">{p.salaryNote}</p>
        </section>

        {/* Dos and Donts */}
        <section className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.05] p-5">
            <h2 className="text-base font-heading font-bold text-emerald-300 mb-3">Faça</h2>
            <ul className="space-y-2">
              {p.dos.map((d, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-200">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" /> <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.05] p-5">
            <h2 className="text-base font-heading font-bold text-red-300 mb-3">Evite</h2>
            <ul className="space-y-2">
              {p.donts.map((d, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-200">
                  <X className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" /> <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA */}
        <div className="mt-12 rounded-2xl bg-gradient-to-br from-primary-600/15 to-accent-violet/15 border border-primary-500/25 p-6 sm:p-8 text-center">
          <Sparkles className="w-7 h-7 text-primary-400 mx-auto mb-3" />
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-white">
            Monte seu currículo de {p.profession} com IA
          </h2>
          <p className="mt-2 text-sm text-gray-300 max-w-md mx-auto">
            O Karreify gera e adapta seu currículo para a vaga, otimizado para ATS, em minutos. Comece grátis.
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
        {p.faqs.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-heading font-bold text-white mb-5">Perguntas frequentes</h2>
            <div className="space-y-3">
              {p.faqs.map((f, i) => (
                <details key={i} className="group rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 sm:p-5">
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

        {/* Related */}
        <section className="mt-12 border-t border-white/[0.08] pt-8">
          <h2 className="text-lg font-heading font-bold text-white mb-4">Modelos para outras profissões</h2>
          <div className="flex flex-wrap gap-2">
            {others.map((o) => (
              <Link
                key={o.slug}
                href={`/modelos-de-curriculo/${o.slug}`}
                className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-gray-300 hover:text-white hover:border-primary-500/30 transition-colors"
              >
                {o.profession}
              </Link>
            ))}
          </div>
          <Link
            href="/como-fazer-um-curriculo"
            className="mt-5 inline-flex items-center gap-2 text-sm text-primary-300 hover:text-primary-200 transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5" /> Guia completo: como fazer um currículo
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
