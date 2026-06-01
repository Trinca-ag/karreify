import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ArrowRight, ShieldCheck, Sparkles, Target, Mail } from "lucide-react";
import { JsonLd } from "@/components/content/JsonLd";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://karreify.com";

export const metadata: Metadata = {
  title: "Sobre o Karreify",
  description:
    "Conheça o Karreify: a plataforma brasileira que usa inteligência artificial para ajudar você a criar currículos que passam no ATS e conquistam entrevistas.",
  alternates: { canonical: "/sobre" },
};

export default function SobrePage() {
  const aboutLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    url: `${SITE_URL}/sobre`,
    inLanguage: "pt-BR",
    mainEntity: {
      "@type": "Organization",
      name: "Karreify",
      url: SITE_URL,
      logo: `${SITE_URL}/images/logo-karreify.png`,
      email: "suporte@karreify.com",
      description:
        "Plataforma brasileira de criação, adaptação e análise de currículos com inteligência artificial.",
    },
  };

  const values = [
    {
      icon: Target,
      title: "Foco em resultado",
      text: "Cada recurso existe para um único objetivo: aumentar suas chances de ser chamado para a entrevista — com currículos otimizados para os sistemas de triagem (ATS).",
    },
    {
      icon: Sparkles,
      title: "Inteligência artificial de verdade",
      text: "Usamos IA para escrever, adaptar e analisar seu currículo de forma personalizada para cada vaga, em português e em minutos.",
    },
    {
      icon: ShieldCheck,
      title: "Seus dados protegidos",
      text: "Tratamos seus dados pessoais com responsabilidade e em conformidade com a LGPD. Você tem controle sobre suas informações.",
    },
  ];

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <JsonLd data={aboutLd} />
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-10 sm:pb-16">
        <nav className="text-xs text-gray-500 mb-6 flex items-center gap-1.5">
          <Link href="/" className="hover:text-gray-300 transition-colors">Início</Link>
          <span>/</span>
          <span className="text-gray-400">Sobre</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-heading font-bold leading-tight tracking-tight">
          Sobre o Karreify
        </h1>
        <p className="mt-5 text-lg text-gray-300 leading-relaxed">
          O Karreify é uma plataforma brasileira que usa inteligência artificial para
          ajudar profissionais a criar, adaptar e analisar currículos que passam pelas
          triagens automáticas (ATS) e conquistam mais entrevistas.
        </p>

        <section className="mt-10">
          <h2 className="text-2xl font-heading font-bold text-white mb-4">Nossa missão</h2>
          <p className="text-[15px] sm:text-base text-gray-300 leading-relaxed">
            Conseguir um bom emprego não deveria depender de saber escrever um currículo
            perfeito. A maioria das pessoas perde oportunidades por detalhes — um currículo
            mal estruturado, sem resultados claros ou que sequer passa pelos filtros
            automáticos das empresas. Nossa missão é nivelar esse jogo: colocar nas mãos de
            qualquer pessoa, de graça para começar, as mesmas ferramentas de IA que tornam um
            currículo realmente competitivo.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-heading font-bold text-white mb-4">O que oferecemos</h2>
          <ul className="space-y-2.5">
            {[
              "Criação de currículos profissionais do zero, com modelos otimizados para ATS.",
              "Adaptação do seu currículo para cada vaga específica, com base na descrição.",
              "Análise inteligente do currículo, com pontuação e sugestões de melhoria.",
              "Geração de cartas de apresentação personalizadas.",
              "Busca de vagas reais e análise de empresas para preparar sua entrevista.",
            ].map((t, i) => (
              <li key={i} className="flex items-start gap-2.5 text-[15px] text-gray-300">
                <ArrowRight className="w-4 h-4 text-primary-400 flex-shrink-0 mt-1" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-heading font-bold text-white mb-5">Por que confiar no nosso conteúdo</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {values.map((v) => (
              <div key={v.title} className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
                <div className="w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center mb-3">
                  <v.icon className="w-5 h-5 text-primary-400" />
                </div>
                <h3 className="font-semibold text-white mb-1.5">{v.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm text-gray-400 leading-relaxed">
            Nossos guias e modelos são produzidos e revisados pela equipe do Karreify, com
            base em boas práticas de recrutamento e seleção e no funcionamento real dos
            sistemas de triagem usados pelas empresas brasileiras.
          </p>
        </section>

        <section className="mt-10 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 sm:p-6">
          <h2 className="text-lg font-heading font-bold text-white mb-2 flex items-center gap-2">
            <Mail className="w-4 h-4 text-primary-400" /> Fale com a gente
          </h2>
          <p className="text-sm text-gray-300">
            Dúvidas, sugestões ou questões sobre seus dados? Escreva para{" "}
            <a href="mailto:suporte@karreify.com" className="text-primary-300 hover:text-primary-200">
              suporte@karreify.com
            </a>
            .
          </p>
        </section>

        <div className="mt-12 text-center">
          <Link
            href="/auth/register"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold text-sm hover:from-primary-500 hover:to-primary-400 transition-all glow-blue"
          >
            Criar meu currículo grátis
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
