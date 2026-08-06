import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ArrowRight, FileText } from "lucide-react";
import { PROFESSIONS } from "@/content/professions";
import type { Profession } from "@/content/types";
import { JsonLd } from "@/components/content/JsonLd";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://karreify.com";

export const metadata: Metadata = {
  title: "Modelos de Currículo por Profissão",
  description:
    "Exemplos de currículo prontos por profissão, com habilidades, palavras-chave de ATS e dicas para cada área. Monte o seu com IA, grátis.",
  alternates: { canonical: "/modelos-de-curriculo" },
};

// Agrupamento por setor. Com dezenas de profissões, a lista plana vira um bloco
// sem hierarquia — o agrupamento ajuda o leitor e dá contexto semântico à página.
// Slugs não listados aqui caem em "Outras profissões", então nada fica órfão.
const SECTORS: { title: string; slugs: string[] }[] = [
  {
    title: "Administrativo e corporativo",
    slugs: [
      "auxiliar-administrativo",
      "secretaria",
      "recepcionista",
      "analista-de-rh",
      "analista-financeiro",
      "analista-de-dados",
      "contador",
      "advogado",
      "operador-de-telemarketing",
    ],
  },
  {
    title: "Comércio, vendas e atendimento",
    slugs: [
      "vendedor",
      "atendente",
      "operador-de-caixa",
      "balconista",
      "repositor",
      "promotor-de-vendas",
      "gerente-de-loja",
      "frentista",
      "estoquista",
    ],
  },
  {
    title: "Saúde e cuidados",
    slugs: [
      "enfermagem",
      "tecnico-de-enfermagem",
      "tecnico-em-radiologia",
      "dentista",
      "farmaceutico",
      "auxiliar-de-farmacia",
      "fisioterapeuta",
      "psicologo",
      "nutricionista",
      "cuidador-de-idosos",
    ],
  },
  {
    title: "Alimentação e hotelaria",
    slugs: ["cozinheiro", "auxiliar-de-cozinha", "garcom", "padeiro", "camareira"],
  },
  {
    title: "Indústria, logística e construção",
    slugs: [
      "auxiliar-de-producao",
      "almoxarife",
      "operador-de-empilhadeira",
      "motorista",
      "entregador",
      "soldador",
      "eletricista",
      "mecanico",
      "pedreiro",
      "pintor",
      "tecnico-de-seguranca-do-trabalho",
      "engenheiro-civil",
    ],
  },
  {
    title: "Tecnologia, marketing e criação",
    slugs: [
      "desenvolvedor",
      "tecnico-em-informatica",
      "designer-grafico",
      "marketing-digital",
      "social-media",
    ],
  },
  {
    title: "Educação, serviços e domésticos",
    slugs: [
      "professor",
      "jovem-aprendiz",
      "estagiario",
      "baba",
      "empregada-domestica",
      "auxiliar-de-limpeza",
      "porteiro",
      "vigilante",
      "cabeleireiro",
      "costureira",
    ],
  },
];

export default function Page() {
  const bySlug = new Map(PROFESSIONS.map((p) => [p.slug, p] as const));
  const covered = new Set(SECTORS.flatMap((s) => s.slugs));
  const others = PROFESSIONS.filter((p) => !covered.has(p.slug));
  const sectors = others.length
    ? [...SECTORS, { title: "Outras profissões", slugs: others.map((p) => p.slug) }]
    : SECTORS;

  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Modelos de Currículo por Profissão",
    url: `${SITE_URL}/modelos-de-curriculo`,
    inLanguage: "pt-BR",
  };

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <JsonLd data={collectionLd} />
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-10 sm:pb-16">
        <nav className="text-xs text-gray-500 mb-6 flex items-center gap-1.5">
          <Link href="/" className="hover:text-gray-300 transition-colors">Início</Link>
          <span>/</span>
          <span className="text-gray-400">Modelos de Currículo</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-heading font-bold leading-tight tracking-tight">
          Modelos de Currículo por Profissão
        </h1>
        <p className="mt-4 text-lg text-gray-300 leading-relaxed max-w-2xl">
          Escolha a sua área e veja um exemplo de currículo pronto, com as habilidades,
          palavras-chave de ATS e dicas específicas da profissão. Depois, monte o seu com
          inteligência artificial em minutos.
        </p>

        <div className="mt-12 space-y-12">
          {sectors.map((sector) => {
            const items = sector.slugs
              .map((s) => bySlug.get(s))
              .filter(Boolean) as Profession[];
            if (!items.length) return null;
            return (
              <section key={sector.title}>
                <h2 className="text-xl font-heading font-bold text-white mb-5 pb-3 border-b border-white/[0.08]">
                  {sector.title}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {items.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/modelos-de-curriculo/${p.slug}`}
                      className="group rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 hover:border-primary-500/30 hover:-translate-y-0.5 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-primary-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-white group-hover:text-primary-300 transition-colors">
                            Currículo para {p.profession}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            Exemplo + habilidades + ATS
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-primary-400 ml-auto flex-shrink-0 transition-colors" />
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/como-fazer-um-curriculo"
            className="inline-flex items-center gap-2 text-sm text-primary-300 hover:text-primary-200 transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5" /> Não sabe por onde começar? Veja o guia completo
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
