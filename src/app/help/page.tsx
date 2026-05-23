"use client";

import { useMemo, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ContactForm from "@/components/ui/ContactForm";
import Link from "next/link";
import {
  Search,
  HelpCircle,
  FileSearch,
  FilePlus,
  Target,
  ScrollText,
  Briefcase,
  Building2,
  Coins,
  CreditCard,
  Lock,
  User,
  Sparkles,
  LifeBuoy,
  ChevronDown,
  ArrowRight,
  BookOpen,
  Zap,
  Shield,
  type LucideIcon,
} from "lucide-react";

type Category = {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
};

type FAQ = {
  category: string;
  question: string;
  answer: string;
};

const categories: Category[] = [
  { id: "all", label: "Todos", icon: BookOpen, color: "from-primary-500 to-accent-violet" },
  { id: "conta", label: "Conta", icon: User, color: "from-primary-500 to-accent-cyan" },
  { id: "curriculo", label: "Currículo", icon: FileSearch, color: "from-emerald-500 to-teal-500" },
  { id: "vagas", label: "Vagas", icon: Briefcase, color: "from-amber-500 to-orange-500" },
  { id: "creditos", label: "Créditos", icon: Coins, color: "from-yellow-400 to-amber-500" },
  { id: "pagamento", label: "Pagamento", icon: CreditCard, color: "from-sky-500 to-blue-500" },
  { id: "seguranca", label: "Segurança", icon: Lock, color: "from-rose-500 to-pink-500" },
];

const faqs: FAQ[] = [
  // Conta
  {
    category: "conta",
    question: "Como faço para criar uma conta no Karreify?",
    answer:
      "É só clicar em \"Começar agora\" no topo da página, preencher seu nome, e-mail e senha. Em poucos segundos sua conta estará pronta — e você já começa com créditos gratuitos para testar todas as ferramentas.",
  },
  {
    category: "conta",
    question: "Esqueci minha senha. Como recupero o acesso?",
    answer:
      "Na tela de login, clique em \"Esqueci minha senha\". Vamos enviar um código de verificação por e-mail. Após confirmar o código, você poderá definir uma nova senha em poucos cliques.",
  },
  {
    category: "conta",
    question: "Posso alterar meu e-mail depois do cadastro?",
    answer:
      "Sim. Em \"Configurações\" você encontra a opção de alterar e-mail. Por segurança, enviamos um código de verificação para o novo endereço antes de concluir a troca.",
  },
  {
    category: "conta",
    question: "Como excluo minha conta permanentemente?",
    answer:
      "No menu de configurações há a opção de excluir conta. Todos os seus dados, currículos, análises e histórico são removidos permanentemente em até 48h, em conformidade com a LGPD.",
  },

  // Currículo
  {
    category: "curriculo",
    question: "Quais formatos de currículo são aceitos?",
    answer:
      "Aceitamos PDF, DOC e DOCX. Recomendamos PDF para análises mais precisas, já que o formato preserva a estrutura visual original do documento.",
  },
  {
    category: "curriculo",
    question: "A IA realmente entende meu currículo?",
    answer:
      "Sim. Usamos modelos de última geração treinados para o mercado brasileiro. A IA identifica seções, experiências, habilidades, formação e até detecta inconsistências como datas sobrepostas ou descrições muito genéricas.",
  },
  {
    category: "curriculo",
    question: "O que é compatibilidade com ATS?",
    answer:
      "ATS (Applicant Tracking System) são sistemas que recrutadores usam para filtrar currículos automaticamente. Nosso editor garante que seu currículo passe por esses filtros, evitando colunas, imagens e fontes que confundem o leitor automático.",
  },
  {
    category: "curriculo",
    question: "Quantas versões do meu currículo posso salvar?",
    answer:
      "Você pode manter múltiplas versões salvas em \"Meus Arquivos\". Cada vaga adaptada vira uma versão própria, então você consegue manter um histórico completo de candidaturas.",
  },

  // Vagas
  {
    category: "vagas",
    question: "De onde vêm as vagas exibidas na plataforma?",
    answer:
      "Buscamos vagas reais de múltiplas fontes públicas e parceiros, atualizadas diariamente. Você só vê oportunidades publicadas recentemente — nada de anúncios velhos ou já preenchidos.",
  },
  {
    category: "vagas",
    question: "Como funciona a adaptação do currículo para uma vaga?",
    answer:
      "Cole o anúncio da vaga ou selecione uma diretamente do nosso buscador. A IA compara seu currículo com a descrição, calcula um score de match e sugere palavras-chave faltantes — gerando uma versão otimizada do seu currículo.",
  },
  {
    category: "vagas",
    question: "Posso me candidatar pela própria plataforma?",
    answer:
      "Hoje o Karreify redireciona para o site oficial da vaga, mantendo todo o controle e segurança do recrutador original. Estamos trabalhando em candidaturas integradas para uma próxima versão.",
  },

  // Créditos
  {
    category: "creditos",
    question: "O que são créditos e para que servem?",
    answer:
      "Créditos são a unidade que move as ferramentas com IA: análise de currículo, criação, adaptação, carta de apresentação, análise de empresa, etc. Cada ação consome uma quantidade pré-definida e transparente de créditos.",
  },
  {
    category: "creditos",
    question: "Recebo créditos gratuitos ao me cadastrar?",
    answer:
      "Sim! Toda nova conta começa com créditos de boas-vindas para você testar as principais ferramentas sem compromisso. Use-os onde fizer mais sentido para o seu momento de carreira.",
  },
  {
    category: "creditos",
    question: "Meus créditos expiram?",
    answer:
      "Créditos comprados não expiram enquanto sua conta estiver ativa. Pacotes promocionais podem ter validade própria, sempre informada no momento da compra.",
  },

  // Pagamento
  {
    category: "pagamento",
    question: "Quais formas de pagamento são aceitas?",
    answer:
      "Aceitamos cartão de crédito (Visa, Mastercard, Elo, Amex), PIX e boleto bancário. Compras com PIX e cartão são liberadas instantaneamente.",
  },
  {
    category: "pagamento",
    question: "É possível obter reembolso?",
    answer:
      "Sim. Você pode solicitar reembolso integral em até 7 dias após a compra de créditos, desde que o saldo não tenha sido utilizado. Basta abrir um chamado em \"Suporte\".",
  },
  {
    category: "pagamento",
    question: "Recebo nota fiscal das compras?",
    answer:
      "Sim. A nota fiscal é emitida automaticamente após a confirmação do pagamento e enviada para o e-mail cadastrado na conta.",
  },

  // Segurança
  {
    category: "seguranca",
    question: "Meus dados estão seguros no Karreify?",
    answer:
      "Sim. Utilizamos criptografia AES-256 ponta-a-ponta, servidores no Brasil e seguimos todos os requisitos da LGPD. Seu currículo nunca é compartilhado com terceiros sem o seu consentimento explícito.",
  },
  {
    category: "seguranca",
    question: "A IA usa meu currículo para treinar modelos?",
    answer:
      "Não. Seu conteúdo nunca é usado para treinar modelos de IA. Os dados servem exclusivamente para gerar as análises e resultados solicitados por você.",
  },
  {
    category: "seguranca",
    question: "Posso baixar ou excluir meus dados a qualquer momento?",
    answer:
      "Sim, é seu direito pela LGPD. Em \"Configurações\" você pode exportar todos os seus dados ou solicitar a exclusão completa da sua conta, com tudo apagado em até 48h.",
  },
];

const quickGuides = [
  {
    icon: FileSearch,
    title: "Analisar meu currículo",
    description: "Receba um score detalhado e sugestões da IA em segundos.",
    href: "/auth/register",
    gradient: "from-primary-500 to-accent-cyan",
  },
  {
    icon: FilePlus,
    title: "Criar do zero",
    description: "Templates modernos otimizados para ATS, prontos em minutos.",
    href: "/auth/register",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: Target,
    title: "Adaptar para vaga",
    description: "Maximize seu match colando o anúncio da vaga.",
    href: "/auth/register",
    gradient: "from-orange-500 to-amber-500",
  },
  {
    icon: ScrollText,
    title: "Carta de apresentação",
    description: "Carta personalizada gerada pela IA em poucos segundos.",
    href: "/auth/register",
    gradient: "from-teal-500 to-cyan-500",
  },
  {
    icon: Briefcase,
    title: "Buscar vagas",
    description: "Vagas reais atualizadas diariamente, com filtros avançados.",
    href: "/auth/register",
    gradient: "from-amber-500 to-yellow-500",
  },
  {
    icon: Building2,
    title: "Analisar empresa",
    description: "Conheça cultura, salário e perguntas frequentes antes da entrevista.",
    href: "/auth/register",
    gradient: "from-sky-500 to-blue-500",
  },
];

const highlights = [
  { icon: Zap, value: "<10s", label: "Resposta média" },
  { icon: Shield, value: "LGPD", label: "100% conforme" },
  { icon: Sparkles, value: "+7", label: "Ferramentas com IA" },
  { icon: HelpCircle, value: "24/7", label: "Acesso ao suporte" },
];

function Particles({ count = 6 }: { count?: number }) {
  const particles = Array.from({ length: count }, (_, i) => {
    const size = 4 + (i % 3) * 3;
    const left = (i * 17) % 100;
    const top = (i * 23) % 100;
    const delay = (i % 6) * 2;
    return { size, left, top, delay, key: i };
  });
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {particles.map((p) => (
        <span
          key={p.key}
          className="particle"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: `${p.left}%`,
            top: `${p.top}%`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function HelpPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [openItem, setOpenItem] = useState<number | null>(0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return faqs.filter((f) => {
      const matchCategory = activeCategory === "all" || f.category === activeCategory;
      const matchQuery =
        !q ||
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q);
      return matchCategory && matchQuery;
    });
  }, [query, activeCategory]);

  return (
    <div className="min-h-screen bg-dark-900 text-white overflow-hidden">
      <Navbar />

      {/* ========== HERO ========== */}
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 noise-overlay">
        <div className="absolute inset-0 bg-grid-pattern opacity-60" />
        <div className="orb w-[600px] h-[600px] bg-primary-600 -top-[200px] -left-[200px] animate-pulse-glow" />
        <div className="orb w-[450px] h-[450px] bg-accent-violet -bottom-[100px] -right-[100px] animate-pulse-glow animation-delay-500" />
        <Particles count={8} />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 text-xs font-semibold tracking-wide animate-fade-in-up animation-delay-100">
            <LifeBuoy className="w-3.5 h-3.5" />
            CENTRAL DE AJUDA
          </div>

          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-heading font-bold tracking-tight leading-[1.1] animate-fade-in-up animation-delay-200">
            Como podemos <span className="gradient-text">te ajudar hoje?</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-300">
            Encontre respostas rápidas sobre conta, currículos, vagas, créditos
            e tudo o que você precisa para tirar o máximo do Karreify.
          </p>

          {/* Search */}
          <div className="mt-10 max-w-2xl mx-auto animate-fade-in-up animation-delay-400">
            <div className="relative group">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500/30 via-accent-violet/30 to-accent-cyan/30 blur-xl opacity-50 group-focus-within:opacity-100 transition-opacity duration-500" />
              <div className="relative glass-card !rounded-2xl flex items-center px-5 py-4">
                <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Pesquise por palavras-chave, ex: 'créditos', 'ATS'..."
                  className="flex-1 ml-3 bg-transparent outline-none text-white placeholder-gray-500 text-base"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded-md hover:bg-white/5 transition-colors"
                  >
                    Limpar
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Highlights */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto animate-fade-in-up animation-delay-500">
            {highlights.map((h) => (
              <div
                key={h.label}
                className="glass-card !rounded-xl px-4 py-4 text-center hover:-translate-y-1 transition-transform duration-300"
              >
                <h.icon className="w-5 h-5 text-primary-400 mx-auto mb-2" />
                <div className="text-xl font-heading font-bold text-white glow-text">
                  {h.value}
                </div>
                <div className="text-[11px] text-gray-500 mt-1">{h.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== QUICK GUIDES ========== */}
      <section className="relative py-20 lg:py-24 bg-dark-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-violet/10 border border-accent-violet/20 text-accent-violet text-xs font-semibold tracking-wide">
                <BookOpen className="w-3.5 h-3.5" />
                GUIAS RÁPIDOS
              </div>
              <h2 className="mt-5 text-3xl sm:text-4xl font-heading font-bold text-white">
                Comece pelo que importa
              </h2>
              <p className="mt-3 text-gray-400 max-w-2xl mx-auto">
                Acesso direto às principais ferramentas e fluxos do Karreify —
                tudo a um clique de distância.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {quickGuides.map((g, i) => (
              <ScrollReveal key={g.title} direction="up" delay={i * 80}>
                <Link
                  href={g.href}
                  className="group block glass-card !rounded-2xl p-6 h-full hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden"
                >
                  <div
                    className={`absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br ${g.gradient} opacity-10 blur-2xl group-hover:opacity-25 transition-opacity duration-500`}
                  />
                  <div
                    className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${g.gradient} flex items-center justify-center shadow-lg`}
                  >
                    <g.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="mt-5 text-lg font-heading font-semibold text-white">
                    {g.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                    {g.description}
                  </p>
                  <div className="mt-5 inline-flex items-center gap-1.5 text-sm text-primary-400 font-medium group-hover:gap-3 transition-all duration-300">
                    Acessar
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FAQ ========== */}
      <section className="relative py-20 lg:py-28 spotlight-bg">
        <div className="orb w-[400px] h-[400px] bg-accent-cyan top-[20%] -left-[100px] opacity-30" />
        <div className="orb w-[400px] h-[400px] bg-accent-pink bottom-[10%] -right-[100px] opacity-20" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 text-xs font-semibold tracking-wide">
                <HelpCircle className="w-3.5 h-3.5" />
                PERGUNTAS FREQUENTES
              </div>
              <h2 className="mt-5 text-3xl sm:text-4xl font-heading font-bold text-white">
                Tudo o que você precisa saber
              </h2>
              <p className="mt-3 text-gray-400 max-w-2xl mx-auto">
                Filtre por categoria ou use a busca acima para encontrar a
                resposta certa em segundos.
              </p>
            </div>
          </ScrollReveal>

          {/* Categories */}
          <ScrollReveal direction="up" delay={100}>
            <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10">
              {categories.map((c) => {
                const active = activeCategory === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setActiveCategory(c.id)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all duration-300 ${
                      active
                        ? "bg-white/10 border-white/20 text-white shadow-lg shadow-primary-500/10"
                        : "bg-white/[0.02] border-white/5 text-gray-400 hover:text-white hover:bg-white/[0.05] hover:border-white/10"
                    }`}
                  >
                    <c.icon className="w-4 h-4" />
                    {c.label}
                  </button>
                );
              })}
            </div>
          </ScrollReveal>

          {/* FAQ List */}
          <ScrollReveal direction="up" delay={150}>
            <div className="space-y-3">
              {filtered.length === 0 ? (
                <div className="glass-card !rounded-2xl p-10 text-center">
                  <Search className="w-8 h-8 text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-400">
                    Nenhuma resposta encontrada para essa busca. Tente outras
                    palavras-chave ou{" "}
                    <Link href="/auth/register" className="text-primary-400 hover:underline">
                      fale com o suporte
                    </Link>
                    .
                  </p>
                </div>
              ) : (
                filtered.map((f, i) => {
                  const isOpen = openItem === i;
                  return (
                    <div
                      key={`${f.category}-${f.question}`}
                      className={`glass-card !rounded-2xl overflow-hidden transition-all duration-300 ${
                        isOpen ? "border-primary-500/30" : ""
                      }`}
                    >
                      <button
                        onClick={() => setOpenItem(isOpen ? null : i)}
                        className="w-full flex items-center justify-between gap-4 px-5 py-5 sm:px-6 text-left group"
                      >
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div
                            className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${
                              isOpen
                                ? "bg-primary-500/20 text-primary-300"
                                : "bg-white/5 text-gray-400 group-hover:text-primary-300"
                            }`}
                          >
                            <HelpCircle className="w-4 h-4" />
                          </div>
                          <span className="text-base sm:text-lg font-heading font-semibold text-white pr-4 leading-snug">
                            {f.question}
                          </span>
                        </div>
                        <ChevronDown
                          className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${
                            isOpen ? "rotate-180 text-primary-400" : ""
                          }`}
                        />
                      </button>
                      <div
                        className={`grid transition-[grid-template-rows,opacity] duration-400 ease-out ${
                          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <div className="px-5 sm:px-6 pb-6 pl-16 sm:pl-[4.5rem] text-sm sm:text-base text-gray-400 leading-relaxed">
                            {f.answer}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ========== CONTACT FORM ========== */}
      <section className="relative py-20 lg:py-24 bg-dark-950">
        <div className="absolute inset-0 bg-grid-pattern opacity-40" />
        <div className="orb w-[500px] h-[500px] bg-primary-600 top-[20%] left-[50%] -translate-x-1/2 opacity-30 animate-pulse-glow" />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up">
            <ContactForm
              topic="help"
              badge="Suporte direto"
              title="Ainda com dúvidas?"
              description="Conte para a gente o que está acontecendo. Nosso time responde em até 24h em dias úteis."
              presetSubjects={[
                "Conta e acesso",
                "Currículo e ferramentas",
                "Vagas e busca",
                "Créditos e pagamento",
                "Outro assunto",
              ]}
              successMessage="Recebemos seu contato. Vamos te responder em breve no e-mail informado."
            />
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
