import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ArrowRight, FileText } from "lucide-react";
import { PROFESSIONS } from "@/content/professions";
import { JsonLd } from "@/components/content/JsonLd";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://karreify.com";

export const metadata: Metadata = {
  title: "Modelos de Currículo por Profissão",
  description:
    "Exemplos de currículo prontos por profissão, com habilidades, palavras-chave de ATS e dicas para cada área. Monte o seu com IA, grátis.",
  alternates: { canonical: "/modelos-de-curriculo" },
};

export default function Page() {
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

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PROFESSIONS.map((p) => (
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
                  <p className="text-xs text-gray-500 truncate">Exemplo + habilidades + ATS</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-primary-400 ml-auto flex-shrink-0 transition-colors" />
              </div>
            </Link>
          ))}
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
