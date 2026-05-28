"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Link from "next/link";
import {
  Cookie,
  Settings2,
  Info,
  ListChecks,
  ShieldCheck,
  Lock,
  Calendar,
  ChevronRight,
  CheckCircle2,
  Globe,
  UserCog,
  Sparkles,
  Database,
  Chrome,
  RefreshCw,
  Mail,
  Eye,
  Server,
  type LucideIcon,
} from "lucide-react";
import {
  CATEGORY_INFO,
  COOKIE_INVENTORY,
  type CookieCategory,
} from "@/lib/cookie-consent";
import { OPEN_COOKIE_PREFERENCES_EVENT } from "@/components/providers/CookieConsentProvider";

const lastUpdate = "28 de maio de 2026";

const categoryStyles: Record<
  CookieCategory,
  { label: string; pill: string; dot: string }
> = {
  necessary: {
    label: "Necessário",
    pill: "bg-emerald-500/10 border-emerald-400/30 text-emerald-300",
    dot: "bg-emerald-400",
  },
  functional: {
    label: "Funcional",
    pill: "bg-sky-500/10 border-sky-400/30 text-sky-300",
    dot: "bg-sky-400",
  },
  analytics: {
    label: "Analítico",
    pill: "bg-violet-500/10 border-violet-400/30 text-violet-300",
    dot: "bg-violet-400",
  },
  marketing: {
    label: "Marketing",
    pill: "bg-rose-500/10 border-rose-400/30 text-rose-300",
    dot: "bg-rose-400",
  },
};

type Section = {
  id: string;
  number: string;
  icon: LucideIcon;
  title: string;
  intro?: string;
  paragraphs?: string[];
  cards?: { icon: LucideIcon; title: string; description: string }[];
  bullets?: string[];
};

const sections: Section[] = [
  {
    id: "o-que-sao",
    number: "01",
    icon: Info,
    title: "O que são cookies?",
    intro:
      "Cookies são pequenos arquivos de texto armazenados pelo navegador quando você visita uma página. Eles permitem reconhecer seu dispositivo entre visitas e oferecer uma experiência consistente.",
    paragraphs: [
      "Além dos cookies clássicos (HTTP cookies), o Karreify também utiliza tecnologias equivalentes — como armazenamento local (localStorage) e identificadores anônimos — sempre sujeitos às mesmas regras de transparência e consentimento descritas aqui.",
      "Nenhum desses recursos consegue acessar arquivos pessoais do seu computador, executar programas ou enviar vírus. São apenas dados textuais que ajudam o site a funcionar e a evoluir.",
    ],
  },
  {
    id: "como-usamos",
    number: "02",
    icon: Sparkles,
    title: "Como usamos cookies no Karreify",
    intro:
      "Usamos o mínimo necessário para entregar uma plataforma rápida, segura e útil — sem rastreamento intrusivo e sem venda de dados.",
    cards: [
      {
        icon: Lock,
        title: "Segurança",
        description:
          "Detectamos sessões adulteradas, bloqueamos acessos suspeitos e protegemos formulários sensíveis.",
      },
      {
        icon: UserCog,
        title: "Preferências",
        description:
          "Lembramos seu tema, filtros e estado da interface para você não precisar reconfigurar a cada visita.",
      },
      {
        icon: Eye,
        title: "Medição agregada",
        description:
          "Acompanhamos uso de forma anônima para identificar gargalos e melhorar a experiência.",
      },
      {
        icon: Globe,
        title: "Atribuição de campanhas",
        description:
          "Quando consentido, medimos a origem de novas contas para investir em canais que funcionam.",
      },
    ],
  },
  {
    id: "categorias",
    number: "03",
    icon: ListChecks,
    title: "Categorias de cookies",
    intro:
      "Agrupamos os cookies em quatro categorias. Você decide quais ativar — exceto a estritamente necessária.",
  },
  {
    id: "catalogo",
    number: "04",
    icon: Database,
    title: "Catálogo de cookies utilizados",
    intro:
      "A lista completa do que armazenamos no seu navegador, sua finalidade e duração.",
  },
  {
    id: "controles",
    number: "05",
    icon: Settings2,
    title: "Como gerenciar suas escolhas",
    intro:
      "Você está no comando. Pode revisar, modificar ou revogar seu consentimento a qualquer momento.",
    bullets: [
      "Clique no botão flutuante de cookies (ícone de biscoito) presente em todas as páginas.",
      "Acesse o rodapé do site e clique em \"Gerenciar Cookies\".",
      "Use o botão abaixo nesta página para abrir o painel de preferências.",
      "Configure permissões diretamente nas configurações do seu navegador.",
    ],
  },
  {
    id: "terceiros",
    number: "06",
    icon: Globe,
    title: "Cookies de terceiros",
    intro:
      "Trabalhamos com poucos parceiros e somente quando estritamente necessário ao funcionamento da plataforma.",
    paragraphs: [
      "Atualmente, cookies de terceiros aparecem em duas situações:",
    ],
    bullets: [
      "Firebase Authentication (Google) — autenticação e proteção da sessão. Categoria: necessários.",
      "AbacatePay — processador de pagamento; cookies aparecem apenas na finalização de uma compra. Categoria: necessários.",
      "Provedores de analytics (quando habilitados por você) — medição agregada de uso. Categoria: analíticos.",
    ],
  },
  {
    id: "navegador",
    number: "07",
    icon: Chrome,
    title: "Bloqueio direto no navegador",
    intro:
      "Você também pode controlar cookies fora do nosso painel, direto no navegador.",
    paragraphs: [
      "A maioria dos navegadores permite bloquear, excluir ou ser notificado antes que cookies sejam armazenados. Note que desabilitar cookies essenciais pode impedir o login e o funcionamento básico do Karreify.",
    ],
    bullets: [
      "Google Chrome: Configurações → Privacidade e segurança → Cookies e outros dados do site.",
      "Mozilla Firefox: Configurações → Privacidade e Segurança → Cookies e dados do site.",
      "Microsoft Edge: Configurações → Cookies e permissões do site.",
      "Safari (macOS/iOS): Preferências/Ajustes → Privacidade → Gerenciar dados de sites.",
    ],
  },
  {
    id: "retencao",
    number: "08",
    icon: Calendar,
    title: "Por quanto tempo guardamos sua decisão",
    intro:
      "Sua decisão sobre cookies vale por até 6 meses. Depois disso, pediremos novamente.",
    paragraphs: [
      "Em conformidade com a recomendação da ANPD, o consentimento não é eterno. Pedimos sua confirmação a cada 6 meses, ou imediatamente em caso de mudança relevante nesta política. Você também pode revogar a qualquer momento — sem custo, sem perguntas.",
    ],
  },
  {
    id: "atualizacoes",
    number: "09",
    icon: RefreshCw,
    title: "Atualizações desta Política",
    intro:
      "Esta Política pode evoluir conforme o produto, a tecnologia e a regulação avançam.",
    paragraphs: [
      "Toda mudança substancial será comunicada com destaque na plataforma e, quando aplicável, por e-mail. A versão vigente é sempre a publicada aqui, com a data de \"última atualização\" no topo.",
    ],
  },
  {
    id: "contato",
    number: "10",
    icon: Mail,
    title: "Contato e exercício de direitos",
    intro:
      "Dúvidas, sugestões ou pedidos relacionados a cookies? Falamos com você.",
    paragraphs: [
      "Você pode entrar em contato com nosso Encarregado de Proteção de Dados (DPO) pelo e-mail privacidade@karreify.com. Respondemos em até 15 dias, conforme prevê a LGPD. Direitos como acesso, exclusão e portabilidade também são exercíveis pelo formulário disponível na Política de Privacidade.",
    ],
  },
];

const highlights = [
  {
    icon: ShieldCheck,
    title: "Sem dark patterns",
    description: "Aceitar e Rejeitar têm o mesmo peso visual.",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: Lock,
    title: "Opt-in explícito",
    description: "Nenhuma categoria opcional vem pré-marcada.",
    gradient: "from-primary-500 to-accent-cyan",
  },
  {
    icon: RefreshCw,
    title: "Revogável a qualquer hora",
    description: "Botão flutuante em todas as páginas.",
    gradient: "from-accent-violet to-accent-pink",
  },
  {
    icon: Server,
    title: "Decisão auditável",
    description: "Sua escolha é registrada com data e versão.",
    gradient: "from-sky-500 to-blue-500",
  },
];

function openCookiePreferences() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(OPEN_COOKIE_PREFERENCES_EVENT));
}

function CookieHero() {
  return (
    <svg
      viewBox="0 0 240 240"
      className="w-56 h-56 sm:w-72 sm:h-72"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <radialGradient id="cookieFill" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="60%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#7c2d12" />
        </radialGradient>
        <radialGradient id="cookieGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="120" cy="120" r="110" fill="url(#cookieGlow)" />

      <g>
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 120 120"
          to="360 120 120"
          dur="40s"
          repeatCount="indefinite"
        />
        <circle
          cx="120"
          cy="120"
          r="98"
          fill="none"
          stroke="#10b981"
          strokeOpacity="0.3"
          strokeWidth="1"
          strokeDasharray="3 6"
        />
      </g>

      {/* Cookie body */}
      <circle cx="120" cy="120" r="70" fill="url(#cookieFill)" />

      {/* Bite */}
      <path
        d="M 178 78 a 22 22 0 0 0 -28 22 a 18 18 0 0 0 28 18 a 22 22 0 0 0 0 -40 Z"
        fill="#030712"
      />

      {/* Chocolate chips */}
      {[
        { x: 100, y: 95, r: 6 },
        { x: 138, y: 115, r: 7 },
        { x: 105, y: 140, r: 5 },
        { x: 135, y: 155, r: 6 },
        { x: 88, y: 120, r: 4 },
        { x: 150, y: 138, r: 4 },
      ].map((c, i) => (
        <circle
          key={i}
          cx={c.x}
          cy={c.y}
          r={c.r}
          fill="#1c0d05"
        />
      ))}

      {/* Sparkles */}
      {[
        { x: 50, y: 90, d: 0 },
        { x: 200, y: 175, d: 0.6 },
        { x: 75, y: 200, d: 1.2 },
        { x: 195, y: 85, d: 1.8 },
      ].map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="3" fill="#34d399">
            <animate
              attributeName="opacity"
              values="0;1;0"
              dur="3s"
              begin={`${p.d}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="r"
              values="1.5;4;1.5"
              dur="3s"
              begin={`${p.d}s`}
              repeatCount="indefinite"
            />
          </circle>
        </g>
      ))}
    </svg>
  );
}

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

export default function CookiesPage() {
  const [progress, setProgress] = useState(0);
  const [activeId, setActiveId] = useState<string>(sections[0].id);
  const [filterCategory, setFilterCategory] = useState<CookieCategory | "all">("all");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const filteredInventory = useMemo(() => {
    if (filterCategory === "all") return COOKIE_INVENTORY;
    return COOKIE_INVENTORY.filter((c) => c.category === filterCategory);
  }, [filterCategory]);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const top = doc.scrollTop || document.body.scrollTop;
      const height = doc.scrollHeight - doc.clientHeight;
      const pct = height > 0 ? Math.min(100, Math.max(0, (top / height) * 100)) : 0;
      setProgress(pct);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-section-id");
            if (id) setActiveId(id);
          }
        });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    Object.values(sectionRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-dark-900 text-white overflow-hidden">
      <Navbar />

      {/* Reading progress bar */}
      <div className="fixed top-0 left-0 right-0 h-0.5 bg-white/5 z-50">
        <div
          className="h-full bg-gradient-to-r from-emerald-400 via-primary-500 to-accent-violet transition-[width] duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* ========== HERO ========== */}
      <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-20 noise-overlay">
        <div className="absolute inset-0 bg-grid-pattern opacity-50" />
        <div className="orb w-[600px] h-[600px] bg-emerald-500 -top-[200px] -left-[200px] animate-pulse-glow" />
        <div className="orb w-[500px] h-[500px] bg-primary-600 -bottom-[150px] -right-[150px] animate-pulse-glow animation-delay-500" />
        <Particles count={8} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            <div className="max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold tracking-wide animate-fade-in-up animation-delay-100">
                <Cookie className="w-3.5 h-3.5" />
                POLÍTICA DE COOKIES
              </div>

              <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-heading font-bold tracking-tight leading-[1.1] animate-fade-in-up animation-delay-200">
                Cookies sem mistério, <span className="gradient-text">sob seu controle</span>
              </h1>

              <p className="mt-5 text-base sm:text-lg text-gray-400 leading-relaxed animate-fade-in-up animation-delay-300">
                Aqui você descobre exatamente o que armazenamos, por quê,
                por quanto tempo — e ativa/desativa o que quiser, sempre
                que quiser. Tudo em conformidade com a LGPD e o Guia da ANPD.
              </p>

              <div className="mt-8 flex flex-wrap gap-3 justify-center lg:justify-start animate-fade-in-up animation-delay-400">
                <button
                  type="button"
                  onClick={openCookiePreferences}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-white text-sm font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:-translate-y-0.5 transition-all duration-200"
                >
                  <Settings2 className="w-4 h-4" />
                  Gerenciar minhas preferências
                </button>
                <div className="inline-flex items-center gap-2 px-4 py-3 rounded-xl glass text-xs text-gray-300">
                  <Calendar className="w-3.5 h-3.5 text-emerald-300" />
                  Última atualização: <strong className="text-white">{lastUpdate}</strong>
                </div>
              </div>
            </div>

            <div className="hidden lg:flex justify-center animate-fade-in-up animation-delay-400">
              <CookieHero />
            </div>
          </div>
        </div>
      </section>

      {/* ========== HIGHLIGHTS ========== */}
      <section className="relative py-14 lg:py-16 bg-dark-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white">
                Compromissos em <span className="gradient-text">4 pilares</span>
              </h2>
              <p className="mt-2 text-gray-400 text-sm">
                A forma como tratamos cookies sempre orbita em torno destes princípios.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {highlights.map((h, i) => (
              <ScrollReveal key={h.title} direction="up" delay={i * 80}>
                <div className="glass-card !rounded-2xl p-5 h-full group hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden">
                  <div
                    className={`absolute -top-10 -right-10 w-28 h-28 rounded-full bg-gradient-to-br ${h.gradient} opacity-10 blur-2xl group-hover:opacity-25 transition-opacity duration-500`}
                  />
                  <div
                    className={`relative w-11 h-11 rounded-xl bg-gradient-to-br ${h.gradient} flex items-center justify-center shadow-lg`}
                  >
                    <h.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="mt-4 text-sm font-heading font-semibold text-white">
                    {h.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-gray-400 leading-relaxed">
                    {h.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CONTENT ========== */}
      <section className="relative py-16 lg:py-20 spotlight-bg">
        <div className="orb w-[400px] h-[400px] bg-emerald-500 top-[20%] -right-[100px] opacity-20" />
        <div className="orb w-[400px] h-[400px] bg-primary-600 bottom-[20%] -left-[100px] opacity-25" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10">
            {/* Sidebar */}
            <aside className="lg:col-span-4 xl:col-span-3">
              <div className="lg:sticky lg:top-24 space-y-4">
                <ScrollReveal direction="up">
                  <div className="glass-card !rounded-2xl p-5">
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-4">
                      <ListChecks className="w-4 h-4" />
                      Sumário
                    </div>
                    <nav className="space-y-1 max-h-[55vh] overflow-y-auto pr-1">
                      {sections.map((s) => {
                        const active = activeId === s.id;
                        return (
                          <a
                            key={s.id}
                            href={`#${s.id}`}
                            className={`group flex items-start gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-300 ${
                              active
                                ? "bg-emerald-500/10 text-white border-l-2 border-emerald-400"
                                : "text-gray-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent"
                            }`}
                          >
                            <span
                              className={`text-[10px] font-bold mt-0.5 transition-colors ${
                                active ? "text-emerald-300" : "text-gray-600 group-hover:text-emerald-400"
                              }`}
                            >
                              {s.number}
                            </span>
                            <span className="leading-snug">{s.title}</span>
                            <ChevronRight
                              className={`w-3.5 h-3.5 ml-auto mt-0.5 flex-shrink-0 transition-all ${
                                active
                                  ? "text-emerald-300 translate-x-0.5"
                                  : "text-gray-700 group-hover:text-emerald-300"
                              }`}
                            />
                          </a>
                        );
                      })}
                    </nav>
                  </div>
                </ScrollReveal>

                <ScrollReveal direction="up">
                  <button
                    type="button"
                    onClick={openCookiePreferences}
                    className="w-full flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-br from-emerald-500/15 to-primary-500/10 border border-emerald-500/30 hover:border-emerald-400/50 transition-all duration-200 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <Settings2 className="w-4 h-4 text-emerald-300" />
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <div className="text-sm font-semibold text-white">
                        Painel de cookies
                      </div>
                      <div className="text-[11px] text-gray-400">
                        Revogue ou ajuste suas preferências
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-emerald-300 group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
                  </button>
                </ScrollReveal>
              </div>
            </aside>

            <main className="lg:col-span-8 xl:col-span-9 space-y-10">
              {sections.map((s, i) => (
                <ScrollReveal key={s.id} direction="up" delay={i * 40}>
                  <article
                    id={s.id}
                    ref={(el) => {
                      sectionRefs.current[s.id] = el;
                    }}
                    data-section-id={s.id}
                    className="glass-card !rounded-2xl p-6 sm:p-8 relative overflow-hidden group hover:border-emerald-500/30 transition-colors duration-500"
                  >
                    <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-gradient-to-br from-emerald-500/15 to-primary-500/15 blur-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-700" />

                    <div className="relative">
                      <div className="flex items-start gap-4 mb-5">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-primary-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                          <s.icon className="w-5 h-5 text-emerald-300" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[11px] font-bold text-emerald-400 tracking-widest">
                            SEÇÃO {s.number}
                          </div>
                          <h2 className="mt-1 text-2xl sm:text-3xl font-heading font-bold text-white leading-tight">
                            {s.title}
                          </h2>
                        </div>
                      </div>

                      {s.intro && (
                        <p className="text-base text-gray-300 leading-relaxed border-l-2 border-emerald-500/40 pl-4 mb-5 italic">
                          {s.intro}
                        </p>
                      )}

                      {s.paragraphs && (
                        <div className="space-y-4">
                          {s.paragraphs.map((p, idx) => (
                            <p
                              key={idx}
                              className="text-[15px] sm:text-base text-gray-400 leading-relaxed"
                            >
                              {p}
                            </p>
                          ))}
                        </div>
                      )}

                      {s.cards && (
                        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {s.cards.map((c, idx) => (
                            <div
                              key={idx}
                              className="p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-emerald-500/30 hover:bg-white/[0.05] transition-all duration-300"
                            >
                              <div className="flex items-center gap-2.5 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                  <c.icon className="w-4 h-4 text-emerald-300" />
                                </div>
                                <h4 className="text-sm font-heading font-semibold text-white">
                                  {c.title}
                                </h4>
                              </div>
                              <p className="text-xs text-gray-400 leading-relaxed">
                                {c.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {s.bullets && (
                        <ul className="mt-5 space-y-2.5">
                          {s.bullets.map((b, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-3 text-sm sm:text-[15px] text-gray-300"
                            >
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                              <span className="leading-relaxed">{b}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* SEÇÃO 03 — Categorias */}
                      {s.id === "categorias" && (
                        <div className="mt-5 space-y-3">
                          {CATEGORY_INFO.map((cat) => (
                            <div
                              key={cat.id}
                              className="rounded-2xl bg-white/[0.02] border border-white/8 p-4 sm:p-5"
                            >
                              <div className="flex items-start justify-between gap-3 flex-wrap">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                    <h3 className="text-sm sm:text-base font-heading font-semibold text-white">
                                      {cat.title}
                                    </h3>
                                    <span
                                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-bold tracking-wide uppercase ${categoryStyles[cat.id].pill}`}
                                    >
                                      <span
                                        className={`w-1.5 h-1.5 rounded-full ${categoryStyles[cat.id].dot}`}
                                      />
                                      {cat.required ? "Sempre ativo" : "Opcional"}
                                    </span>
                                  </div>
                                  <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                                    {cat.description}
                                  </p>
                                  <div className="mt-3">
                                    <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                                      Exemplos
                                    </div>
                                    <ul className="flex flex-wrap gap-1.5">
                                      {cat.examples.map((ex) => (
                                        <li
                                          key={ex}
                                          className="inline-flex items-center px-2 py-1 rounded-md bg-white/[0.04] border border-white/10 text-[11px] text-gray-300"
                                        >
                                          {ex}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* SEÇÃO 04 — Catálogo */}
                      {s.id === "catalogo" && (
                        <div className="mt-5 space-y-4">
                          {/* Filtro */}
                          <div className="flex flex-wrap gap-2">
                            <CategoryFilterPill
                              active={filterCategory === "all"}
                              onClick={() => setFilterCategory("all")}
                              label="Todos"
                              count={COOKIE_INVENTORY.length}
                            />
                            {(["necessary", "functional", "analytics", "marketing"] as const).map(
                              (cat) => {
                                const count = COOKIE_INVENTORY.filter(
                                  (c) => c.category === cat
                                ).length;
                                return (
                                  <CategoryFilterPill
                                    key={cat}
                                    active={filterCategory === cat}
                                    onClick={() => setFilterCategory(cat)}
                                    label={categoryStyles[cat].label}
                                    count={count}
                                    dotClass={categoryStyles[cat].dot}
                                  />
                                );
                              }
                            )}
                          </div>

                          {/* Tabela (desktop) */}
                          <div className="hidden sm:block overflow-x-auto rounded-2xl border border-white/8">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="bg-white/[0.03] text-[11px] font-bold uppercase tracking-wider text-gray-400">
                                  <th className="text-left px-4 py-3">Cookie</th>
                                  <th className="text-left px-4 py-3">Provedor</th>
                                  <th className="text-left px-4 py-3">Categoria</th>
                                  <th className="text-left px-4 py-3">Duração</th>
                                  <th className="text-left px-4 py-3">Finalidade</th>
                                </tr>
                              </thead>
                              <tbody>
                                {filteredInventory.map((c, idx) => (
                                  <tr
                                    key={c.name}
                                    className={`border-t border-white/5 hover:bg-white/[0.02] transition-colors ${
                                      idx % 2 === 0 ? "" : "bg-white/[0.015]"
                                    }`}
                                  >
                                    <td className="px-4 py-3 font-mono text-[12px] text-emerald-200 whitespace-nowrap">
                                      {c.name}
                                    </td>
                                    <td className="px-4 py-3 text-gray-300">
                                      {c.provider}
                                    </td>
                                    <td className="px-4 py-3">
                                      <span
                                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-bold tracking-wide uppercase ${categoryStyles[c.category].pill}`}
                                      >
                                        <span
                                          className={`w-1.5 h-1.5 rounded-full ${categoryStyles[c.category].dot}`}
                                        />
                                        {categoryStyles[c.category].label}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-300 whitespace-nowrap">
                                      {c.duration}
                                    </td>
                                    <td className="px-4 py-3 text-gray-400">
                                      {c.purpose}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          {/* Cards (mobile) */}
                          <div className="sm:hidden space-y-3">
                            {filteredInventory.map((c) => (
                              <div
                                key={c.name}
                                className="rounded-2xl bg-white/[0.03] border border-white/8 p-4"
                              >
                                <div className="flex items-start justify-between gap-2 mb-2">
                                  <span className="font-mono text-[12px] text-emerald-200 break-all">
                                    {c.name}
                                  </span>
                                  <span
                                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-bold tracking-wide uppercase flex-shrink-0 ${categoryStyles[c.category].pill}`}
                                  >
                                    {categoryStyles[c.category].label}
                                  </span>
                                </div>
                                <div className="text-xs text-gray-400 space-y-1.5">
                                  <div>
                                    <span className="text-gray-500">Provedor: </span>
                                    {c.provider}
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Duração: </span>
                                    {c.duration}
                                  </div>
                                  <p className="pt-1.5 border-t border-white/5">
                                    {c.purpose}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {filteredInventory.length === 0 && (
                            <div className="text-center py-8 text-sm text-gray-500">
                              Nenhum cookie cadastrado nesta categoria.
                            </div>
                          )}
                        </div>
                      )}

                      {/* SEÇÃO 05 — CTA de gerenciamento */}
                      {s.id === "controles" && (
                        <div className="mt-5 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-primary-500/10 border border-emerald-500/30">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
                            <div className="flex-1">
                              <h3 className="text-sm sm:text-base font-heading font-semibold text-white">
                                Pronto para revisar suas escolhas?
                              </h3>
                              <p className="mt-1 text-xs sm:text-sm text-gray-400">
                                Abra o painel de preferências e ajuste cada
                                categoria individualmente.
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={openCookiePreferences}
                              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-white text-sm font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:-translate-y-0.5 transition-all duration-200 flex-shrink-0"
                            >
                              <Settings2 className="w-4 h-4" />
                              Abrir painel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </article>
                </ScrollReveal>
              ))}

              {/* Footer links */}
              <ScrollReveal direction="up">
                <div className="glass-card !rounded-2xl p-6 sm:p-8 text-center">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-emerald-500/20 to-primary-500/20 border border-emerald-500/30 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-emerald-300" />
                  </div>
                  <h3 className="mt-4 text-xl font-heading font-bold text-white">
                    Quer entender o quadro completo?
                  </h3>
                  <p className="mt-2 text-sm text-gray-400 max-w-md mx-auto">
                    Esta Política de Cookies complementa nossa Política de
                    Privacidade e os Termos de Uso.
                  </p>
                  <div className="mt-5 flex flex-wrap justify-center gap-3">
                    <Link
                      href="/privacy"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white hover:bg-white/10 transition-colors"
                    >
                      Política de Privacidade
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                    <Link
                      href="/terms"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white hover:bg-white/10 transition-colors"
                    >
                      Termos de Uso
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            </main>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

interface CategoryFilterPillProps {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  dotClass?: string;
}

function CategoryFilterPill({
  active,
  onClick,
  label,
  count,
  dotClass,
}: CategoryFilterPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${
        active
          ? "bg-emerald-500/15 border-emerald-400/40 text-white"
          : "bg-white/[0.02] border-white/8 text-gray-400 hover:text-white hover:bg-white/5"
      }`}
    >
      {dotClass && <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />}
      {label}
      <span className="text-[10px] text-gray-500">({count})</span>
    </button>
  );
}
