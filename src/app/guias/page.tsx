import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Sparkles,
  Mail,
  ScrollText,
  MessagesSquare,
  Linkedin,
  type LucideIcon,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { JsonLd } from "@/components/content/JsonLd";
import { GUIDES } from "@/content/guides";
import type { Guide } from "@/content/types";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://karreify.com";

export const metadata: Metadata = {
  title: "Guias de Currículo, Entrevista e Carreira",
  description:
    "Todos os guias do Karreify: currículo profissional, triagem de ATS, entrevista de emprego, negociação de salário, LinkedIn e recolocação. Conteúdo gratuito para 2026.",
  alternates: { canonical: "/guias" },
};

// Agrupamento temático — encoda os clusters reais de conteúdo. Os pilares saem no
// topo; qualquer slug não listado aqui cai em "Outros guias", então nenhum guia
// fica órfão ao adicionarmos conteúdo novo.
const GROUPS: { title: string; description: string; slugs: string[] }[] = [
  {
    title: "Fundamentos do currículo",
    description: "Do zero ao currículo pronto: estrutura, seções e o que incluir.",
    slugs: [
      "curriculo-sem-experiencia",
      "curriculo-para-primeiro-emprego",
      "o-que-colocar-no-curriculo",
      "objetivo-profissional-no-curriculo",
      "habilidades-para-curriculo",
      "erros-comuns-no-curriculo",
    ],
  },
  {
    title: "Currículo com IA e ATS",
    description: "Como usar inteligência artificial e passar na triagem automática.",
    slugs: [
      "como-a-ia-monta-um-curriculo",
      "curriculo-gerado-por-ia-e-confiavel",
      "ia-vs-modelo-manual-de-curriculo",
      "curriculo-otimizado-para-ats",
      "como-adaptar-curriculo-para-cada-vaga",
    ],
  },
  {
    title: "Modelos e formatos",
    description: "Qual modelo usar em cada situação — e como formatar sem perder pontos.",
    slugs: [
      "modelo-de-curriculo-simples",
      "modelo-de-curriculo-moderno",
      "modelo-de-curriculo-profissional",
      "modelo-de-curriculo-criativo",
      "modelo-de-curriculo-minimalista",
      "modelo-de-curriculo-para-word",
    ],
  },
  {
    title: "Carta de apresentação",
    description: "Modelos e exemplos prontos para acompanhar o seu currículo.",
    slugs: [
      "modelo-de-carta-de-apresentacao",
      "carta-de-apresentacao-primeiro-emprego",
      "carta-de-apresentacao-por-email",
    ],
  },
  {
    title: "Entrevista de emprego",
    description: "Como se preparar, o que responder e o que fazer depois.",
    slugs: [
      "perguntas-e-respostas-de-entrevista-de-emprego",
      "fale-sobre-voce-entrevista",
      "pontos-fortes-e-fracos-na-entrevista",
      "entrevista-comportamental-metodo-star",
      "entrevista-online-por-video",
      "perguntas-para-fazer-ao-recrutador",
      "o-que-fazer-depois-da-entrevista",
    ],
  },
  {
    title: "Salário, carreira e demissão",
    description: "Negociar, pedir aumento, sair bem e voltar ao mercado.",
    slugs: [
      "pretensao-salarial",
      "como-negociar-salario",
      "como-pedir-aumento-de-salario",
      "carta-de-demissao",
      "como-pedir-demissao",
      "transicao-de-carreira",
      "recolocacao-profissional",
    ],
  },
  {
    title: "LinkedIn e marca pessoal",
    description: "Ser encontrado por recrutadores e construir rede.",
    slugs: [
      "titulo-do-linkedin",
      "resumo-do-linkedin",
      "open-to-work-linkedin",
      "networking-profissional",
    ],
  },
  {
    title: "Ferramentas",
    description: "Como escolher onde criar o seu currículo.",
    slugs: ["melhores-sites-para-criar-curriculo"],
  },
];

const PILLAR_ICONS: Record<string, LucideIcon> = {
  "como-fazer-um-curriculo": ScrollText,
  "criar-curriculo-com-ia": Sparkles,
  "carta-de-apresentacao": Mail,
  "entrevista-de-emprego": MessagesSquare,
  "como-fazer-um-bom-linkedin": Linkedin,
};

export default function Page() {
  const bySlug = new Map(GUIDES.map((g) => [g.slug, g] as const));
  const pillars = GUIDES.filter((g) => g.pillar);

  // Slugs já cobertos (pilares + grupos). O resto vira "Outros guias" — garante
  // que todo guia apareça e seja linkado, mesmo sem estar categorizado.
  const covered = new Set<string>([
    ...pillars.map((g) => g.slug),
    ...GROUPS.flatMap((g) => g.slugs),
  ]);
  const others = GUIDES.filter((g) => !covered.has(g.slug));
  const groups = others.length
    ? [...GROUPS, { title: "Outros guias", description: "", slugs: others.map((g) => g.slug) }]
    : GROUPS;

  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Guias de Currículo, Entrevista e Carreira",
    url: `${SITE_URL}/guias`,
    inLanguage: "pt-BR",
  };

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <JsonLd data={collectionLd} />
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-10 sm:pb-16">
        <nav className="text-xs text-gray-500 mb-6 flex items-center gap-1.5">
          <Link href="/" className="hover:text-gray-300 transition-colors">Início</Link>
          <span>/</span>
          <span className="text-gray-400">Guias</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-heading font-bold leading-tight tracking-tight">
          Guias de Currículo e Carreira
        </h1>
        <p className="mt-4 text-lg text-gray-300 leading-relaxed max-w-2xl">
          Conteúdo gratuito e aprofundado para cada etapa da busca por emprego: montar um
          currículo que passa no ATS, se preparar para a entrevista, negociar salário,
          usar o LinkedIn a seu favor e se recolocar — tudo escrito para o mercado
          brasileiro em 2026.
        </p>

        {/* Pilares — os guias essenciais */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
          {pillars.map((g) => {
            const Icon = PILLAR_ICONS[g.slug] || BookOpen;
            return (
              <Link
                key={g.slug}
                href={`/${g.slug}`}
                className="group rounded-2xl border border-primary-500/20 bg-primary-500/[0.04] p-6 hover:border-primary-500/40 hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary-400" />
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-primary-400">
                    Guia essencial
                  </span>
                </div>
                <h2 className="text-lg font-heading font-bold text-white leading-snug group-hover:text-primary-300 transition-colors">
                  {g.h1}
                </h2>
                <p className="mt-2 text-sm text-gray-400 leading-relaxed line-clamp-2">
                  {g.metaDescription}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary-400 group-hover:gap-2.5 transition-all">
                  Ler guia <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            );
          })}
        </div>

        {/* Grupos temáticos */}
        <div className="mt-16 space-y-12">
          {groups.map((grp) => {
            const items = grp.slugs.map((s) => bySlug.get(s)).filter(Boolean) as Guide[];
            if (!items.length) return null;
            return (
              <section key={grp.title}>
                <div className="flex items-baseline justify-between gap-4 mb-5 pb-3 border-b border-white/[0.08]">
                  <h2 className="text-xl font-heading font-bold text-white">{grp.title}</h2>
                  {grp.description ? (
                    <p className="hidden sm:block text-sm text-gray-500 text-right">{grp.description}</p>
                  ) : null}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {items.map((g) => (
                    <Link
                      key={g.slug}
                      href={`/${g.slug}`}
                      className="group rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 hover:border-primary-500/30 hover:bg-white/[0.05] transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <BookOpen className="w-4 h-4 text-gray-500 group-hover:text-primary-400 mt-0.5 flex-shrink-0 transition-colors" />
                        <div className="min-w-0">
                          <h3 className="text-sm font-semibold text-white leading-snug group-hover:text-primary-300 transition-colors">
                            {g.h1}
                          </h3>
                          <p className="mt-1 text-xs text-gray-500 leading-relaxed line-clamp-2">
                            {g.metaDescription}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* CTA cruzado para o hub de profissões */}
        <div className="mt-16 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8 text-center">
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-white">
            Procurando um exemplo pronto da sua área?
          </h2>
          <p className="mt-2 text-sm text-gray-400 max-w-xl mx-auto">
            Veja modelos de currículo por profissão, com habilidades e palavras-chave de ATS.
          </p>
          <Link
            href="/modelos-de-curriculo"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-gradient-to-r from-primary-600 to-accent-violet text-white hover:opacity-90 transition-opacity"
          >
            Ver modelos por profissão <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
