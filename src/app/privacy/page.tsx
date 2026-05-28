"use client";

import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ContactForm from "@/components/ui/ContactForm";
import Link from "next/link";
import {
  Shield,
  ShieldCheck,
  Lock,
  Database,
  Eye,
  UserCog,
  Cookie,
  Globe,
  Server,
  Trash2,
  Download,
  Bell,
  CheckCircle2,
  Calendar,
  Mail,
  ChevronRight,
  ListChecks,
  Sparkles,
  KeyRound,
  FileCheck,
  type LucideIcon,
} from "lucide-react";

const lastUpdate = "22 de maio de 2026";

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
    id: "compromisso",
    number: "01",
    icon: ShieldCheck,
    title: "Nosso compromisso com você",
    intro:
      "Privacidade não é um detalhe técnico — é o alicerce do Karreify. Esta Política explica de forma transparente como tratamos seus dados.",
    paragraphs: [
      "O Karreify está em total conformidade com a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 — LGPD) e segue as melhores práticas internacionais de segurança e privacidade.",
      "Esta Política descreve quais dados coletamos, por que coletamos, como os armazenamos, com quem (e por quê) podemos compartilhá-los e quais são os seus direitos como titular.",
    ],
  },
  {
    id: "dados-coletados",
    number: "02",
    icon: Database,
    title: "Dados que coletamos",
    intro:
      "Coletamos apenas o estritamente necessário para entregar as ferramentas com IA e melhorar continuamente a sua experiência.",
    cards: [
      {
        icon: UserCog,
        title: "Dados de cadastro",
        description:
          "Nome, e-mail, senha (criptografada), foto opcional e preferências da conta.",
      },
      {
        icon: FileCheck,
        title: "Conteúdo enviado",
        description:
          "Currículos em PDF/DOC/DOCX, descrições de vagas e textos digitados nas ferramentas.",
      },
      {
        icon: Server,
        title: "Dados técnicos",
        description:
          "Endereço IP, tipo de navegador, dispositivo, sistema operacional e horários de acesso (logs de segurança).",
      },
      {
        icon: Cookie,
        title: "Uso e analytics",
        description:
          "Páginas visitadas, ferramentas usadas, tempo de sessão e métricas agregadas para evoluir o produto.",
      },
    ],
  },
  {
    id: "finalidades",
    number: "03",
    icon: Sparkles,
    title: "Para que usamos seus dados",
    intro:
      "Cada dado coletado tem uma finalidade específica — sem coleta especulativa, sem uso oculto.",
    bullets: [
      "Executar as ferramentas com IA (análises, criações, adaptações, relatórios) solicitadas por você.",
      "Manter sua conta segura, com verificações por código em ações sensíveis.",
      "Personalizar recomendações de vagas, mercado e habilidades.",
      "Enviar notificações operacionais e, com seu consentimento, comunicações de novidades.",
      "Cumprir obrigações legais, regulatórias e prevenir fraudes.",
      "Realizar análises agregadas e anônimas para melhorar a experiência geral da plataforma.",
    ],
  },
  {
    id: "base-legal",
    number: "04",
    icon: Shield,
    title: "Bases legais (LGPD)",
    intro:
      "Toda operação com seus dados é respaldada por uma base legal expressa da LGPD.",
    cards: [
      {
        icon: CheckCircle2,
        title: "Execução de contrato",
        description:
          "Tratamento necessário para entregar os serviços contratados (art. 7º, V).",
      },
      {
        icon: UserCog,
        title: "Consentimento",
        description:
          "Coletado de forma livre, informada e específica para comunicações de marketing (art. 7º, I).",
      },
      {
        icon: Lock,
        title: "Legítimo interesse",
        description:
          "Usado para segurança, prevenção de fraudes e melhoria do produto, sempre com balanceamento de direitos (art. 7º, IX).",
      },
      {
        icon: FileCheck,
        title: "Cumprimento legal",
        description:
          "Registros mantidos para atender obrigações fiscais, tributárias e regulatórias (art. 7º, II).",
      },
    ],
  },
  {
    id: "compartilhamento",
    number: "05",
    icon: Globe,
    title: "Com quem compartilhamos",
    intro:
      "Não vendemos, alugamos ou cedemos seus dados. Compartilhamentos ocorrem apenas com operadores essenciais ao funcionamento da plataforma.",
    paragraphs: [
      "Trabalhamos com fornecedores cuidadosamente selecionados que atuam como \"operadores\" sob nossa instrução: provedores de nuvem, gateways de pagamento, serviços de e-mail transacional, modelos de IA e ferramentas de analytics, todos com contratos de confidencialidade e tratamento de dados.",
    ],
    bullets: [
      "Provedores de infraestrutura em nuvem hospedados majoritariamente no Brasil.",
      "Gateways de pagamento certificados PCI-DSS, exclusivamente para processar compras.",
      "Provedores de modelos de IA — sem treinamento sobre seus dados.",
      "Autoridades públicas, apenas mediante ordem judicial ou obrigação legal expressa.",
    ],
  },
  {
    id: "seguranca",
    number: "06",
    icon: KeyRound,
    title: "Como protegemos seus dados",
    intro:
      "Adotamos múltiplas camadas de segurança técnicas, organizacionais e físicas.",
    cards: [
      {
        icon: Lock,
        title: "Criptografia AES-256",
        description:
          "Dados em trânsito (TLS 1.3) e em repouso são criptografados com padrão militar.",
      },
      {
        icon: KeyRound,
        title: "Acesso por privilégio mínimo",
        description:
          "Apenas pessoas autorizadas acessam dados — com logs de auditoria e autenticação multifator.",
      },
      {
        icon: Server,
        title: "Servidores no Brasil",
        description:
          "Infraestrutura hospedada em datacenters certificados, com redundância e backups diários.",
      },
      {
        icon: Bell,
        title: "Monitoramento contínuo",
        description:
          "Detecção 24/7 de anomalias, com resposta a incidentes formalizada e testada periodicamente.",
      },
    ],
  },
  {
    id: "retencao",
    number: "07",
    icon: Calendar,
    title: "Por quanto tempo guardamos",
    intro:
      "Os dados são retidos pelo tempo necessário para atender às finalidades descritas — nem mais, nem menos.",
    paragraphs: [
      "Enquanto sua conta estiver ativa, mantemos seus dados de cadastro e seu conteúdo armazenado. Após a exclusão da conta, removemos seus dados em até 48 horas, ressalvados registros que precisamos preservar por obrigação legal (ex.: registros fiscais por 5 anos, conforme legislação tributária).",
    ],
    bullets: [
      "Logs de segurança e auditoria: 6 meses.",
      "Dados de pagamento: tempo mínimo exigido pela legislação fiscal.",
      "Backups encriptados rotacionados: até 90 dias.",
    ],
  },
  {
    id: "cookies",
    number: "08",
    icon: Cookie,
    title: "Cookies e tecnologias similares",
    intro:
      "Usamos cookies essenciais para o funcionamento e, com seu consentimento, cookies funcionais, analíticos e de marketing.",
    paragraphs: [
      "Você decide cada categoria individualmente, com opt-in explícito (nada vem pré-marcado) e pode revogar a qualquer momento pelo botão flutuante de cookies ou pelo link \"Gerenciar Cookies\" no rodapé. Os detalhes completos — incluindo o catálogo de cada cookie utilizado, sua finalidade e duração — estão na nossa Política de Cookies.",
    ],
    bullets: [
      "Cookies estritamente necessários: indispensáveis para login, sessão e segurança. Sustentados em execução de contrato e legítimo interesse.",
      "Cookies funcionais: lembram preferências como tema, filtros e estado da interface.",
      "Cookies analíticos: medem uso de forma anônima e agregada para evoluir o produto.",
      "Cookies de marketing: atribuem campanhas e medem eficiência publicitária — apenas com seu consentimento explícito.",
    ],
  },
  {
    id: "direitos",
    number: "09",
    icon: UserCog,
    title: "Seus direitos como titular",
    intro:
      "A LGPD garante uma série de direitos — todos exercíveis diretamente pelo seu perfil ou contato com o DPO.",
    cards: [
      {
        icon: Eye,
        title: "Acesso",
        description:
          "Consultar quais dados temos sobre você e como são tratados.",
      },
      {
        icon: FileCheck,
        title: "Correção",
        description:
          "Atualizar dados incompletos, inexatos ou desatualizados.",
      },
      {
        icon: Download,
        title: "Portabilidade",
        description:
          "Exportar seus dados em formato estruturado (JSON ou CSV).",
      },
      {
        icon: Trash2,
        title: "Eliminação",
        description:
          "Solicitar a remoção completa dos seus dados pessoais.",
      },
      {
        icon: Lock,
        title: "Revogação",
        description:
          "Revogar consentimentos a qualquer momento, sem custos.",
      },
      {
        icon: Bell,
        title: "Informação",
        description:
          "Saber com quem seus dados foram compartilhados e em quais hipóteses.",
      },
    ],
  },
  {
    id: "menores",
    number: "10",
    icon: Shield,
    title: "Crianças e adolescentes",
    intro:
      "O Karreify destina-se a maiores de 16 anos.",
    paragraphs: [
      "Não coletamos intencionalmente dados de crianças. Se for identificado o cadastro indevido de um menor, a conta será desativada e os dados eliminados conforme nossos procedimentos internos.",
    ],
  },
  {
    id: "atualizacoes",
    number: "11",
    icon: Bell,
    title: "Alterações nesta Política",
    intro:
      "Quando esta Política for atualizada, você será sempre informado.",
    paragraphs: [
      "Mudanças substanciais serão comunicadas por e-mail e exibidas em destaque na plataforma. A versão sempre vigente é a publicada nesta página, com a data de \"última atualização\" no topo do documento.",
    ],
  },
  {
    id: "contato",
    number: "12",
    icon: Mail,
    title: "DPO e canais de contato",
    intro:
      "Temos um Encarregado de Proteção de Dados (DPO) para falar com você sobre qualquer questão de privacidade.",
    paragraphs: [
      "Você pode exercer seus direitos ou tirar dúvidas pelo e-mail privacidade@karreify.com. Respondemos em até 15 dias, conforme prevê a LGPD.",
    ],
  },
];

const principles = [
  {
    icon: Lock,
    title: "Criptografia AES-256",
    description: "Seus dados são protegidos em trânsito e em repouso.",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: Server,
    title: "Servidores no Brasil",
    description: "Datacenters certificados, conforme LGPD.",
    gradient: "from-primary-500 to-accent-cyan",
  },
  {
    icon: Sparkles,
    title: "Sem treinar IA",
    description: "Seu conteúdo nunca alimenta modelos de IA.",
    gradient: "from-accent-violet to-accent-pink",
  },
  {
    icon: Trash2,
    title: "Você controla",
    description: "Exporte ou exclua seus dados em poucos cliques.",
    gradient: "from-rose-500 to-orange-500",
  },
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

function ShieldHero() {
  return (
    <svg
      viewBox="0 0 240 240"
      className="w-56 h-56 sm:w-72 sm:h-72"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <radialGradient id="shieldGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="120" cy="120" r="110" fill="url(#shieldGlow)" />

      <g>
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 120 120"
          to="360 120 120"
          dur="30s"
          repeatCount="indefinite"
        />
        <circle
          cx="120"
          cy="120"
          r="100"
          fill="none"
          stroke="url(#shieldGrad)"
          strokeWidth="1"
          strokeDasharray="4 6"
          opacity="0.4"
        />
      </g>
      <g>
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="360 120 120"
          to="0 120 120"
          dur="22s"
          repeatCount="indefinite"
        />
        <circle
          cx="120"
          cy="120"
          r="85"
          fill="none"
          stroke="url(#shieldGrad)"
          strokeWidth="1"
          strokeDasharray="2 4"
          opacity="0.3"
        />
      </g>

      <path
        d="M120 50 L172 70 L172 130 Q172 175 120 200 Q68 175 68 130 L68 70 Z"
        fill="url(#shieldGrad)"
        opacity="0.95"
      />
      <path
        d="M120 50 L172 70 L172 130 Q172 175 120 200 Q68 175 68 130 L68 70 Z"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="1.5"
        fill="none"
      />

      <path
        d="M96 122 L114 140 L148 102"
        stroke="white"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        strokeDasharray="60"
        strokeDashoffset="60"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="60"
          to="0"
          dur="1.2s"
          begin="0.4s"
          fill="freeze"
        />
      </path>

      {[
        { x: 36, y: 80, d: 0 },
        { x: 200, y: 70, d: 0.5 },
        { x: 30, y: 160, d: 1 },
        { x: 208, y: 170, d: 1.5 },
        { x: 60, y: 215, d: 2 },
        { x: 180, y: 210, d: 2.5 },
      ].map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="#a78bfa">
          <animate
            attributeName="opacity"
            values="0;1;0"
            dur="3.2s"
            begin={`${p.d}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="r"
            values="1.5;4;1.5"
            dur="3.2s"
            begin={`${p.d}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
    </svg>
  );
}

export default function PrivacyPage() {
  const [progress, setProgress] = useState(0);
  const [activeId, setActiveId] = useState<string>(sections[0].id);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

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
        <div className="orb w-[600px] h-[600px] bg-accent-violet -top-[200px] -left-[200px] animate-pulse-glow" />
        <div className="orb w-[500px] h-[500px] bg-primary-600 -bottom-[150px] -right-[150px] animate-pulse-glow animation-delay-500" />
        <Particles count={8} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            <div className="max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold tracking-wide animate-fade-in-up animation-delay-100">
                <ShieldCheck className="w-3.5 h-3.5" />
                POLÍTICA DE PRIVACIDADE
              </div>

              <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-heading font-bold tracking-tight leading-[1.1] animate-fade-in-up animation-delay-200">
                Seus dados, sempre <span className="gradient-text">sob seu controle</span>
              </h1>

              <p className="mt-5 text-base sm:text-lg text-gray-400 leading-relaxed animate-fade-in-up animation-delay-300">
                Transparência total sobre o que coletamos, por que coletamos e
                como protegemos suas informações. Em total conformidade com a
                LGPD.
              </p>

              <div className="mt-8 inline-flex items-center gap-3 px-4 py-2 rounded-full glass animate-fade-in-up animation-delay-400">
                <Calendar className="w-4 h-4 text-emerald-300" />
                <span className="text-xs text-gray-300">
                  Última atualização: <strong className="text-white">{lastUpdate}</strong>
                </span>
              </div>
            </div>

            <div className="hidden lg:flex justify-center animate-fade-in-up animation-delay-400">
              <ShieldHero />
            </div>
          </div>
        </div>
      </section>

      {/* ========== PRINCIPLES ========== */}
      <section className="relative py-14 lg:py-16 bg-dark-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white">
                Princípios em <span className="gradient-text">4 pilares</span>
              </h2>
              <p className="mt-2 text-gray-400 text-sm">
                Tudo o que fazemos com seus dados orbita em torno destes
                compromissos.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {principles.map((p, i) => (
              <ScrollReveal key={p.title} direction="up" delay={i * 80}>
                <div className="glass-card !rounded-2xl p-5 h-full group hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden">
                  <div
                    className={`absolute -top-10 -right-10 w-28 h-28 rounded-full bg-gradient-to-br ${p.gradient} opacity-10 blur-2xl group-hover:opacity-25 transition-opacity duration-500`}
                  />
                  <div
                    className={`relative w-11 h-11 rounded-xl bg-gradient-to-br ${p.gradient} flex items-center justify-center shadow-lg`}
                  >
                    <p.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="mt-4 text-sm font-heading font-semibold text-white">
                    {p.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-gray-400 leading-relaxed">
                    {p.description}
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
              <div className="lg:sticky lg:top-24">
                <ScrollReveal direction="up">
                  <div className="glass-card !rounded-2xl p-5">
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-4">
                      <ListChecks className="w-4 h-4" />
                      Sumário
                    </div>
                    <nav className="space-y-1 max-h-[60vh] overflow-y-auto pr-1">
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
                    </div>
                  </article>
                </ScrollReveal>
              ))}

              {/* DPO Contact Form */}
              <ScrollReveal direction="up">
                <ContactForm
                  topic="privacy"
                  badge="Encarregado de Dados (DPO)"
                  title="Encarregado de Proteção de Dados"
                  description="Exerça seus direitos de titular ou tire dúvidas sobre o tratamento dos seus dados. Respondemos em até 15 dias, conforme a LGPD."
                  presetSubjects={[
                    "Acessar meus dados",
                    "Corrigir meus dados",
                    "Exportar (portabilidade)",
                    "Excluir minha conta",
                    "Revogar consentimento",
                    "Outra solicitação LGPD",
                  ]}
                  successMessage="Solicitação registrada. Nosso DPO entrará em contato em até 15 dias, conforme a LGPD."
                />
                <div className="mt-6 flex flex-wrap justify-center gap-4">
                  <Link
                    href="/cookies"
                    className="inline-flex items-center gap-1.5 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    Ver Política de Cookies
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/terms"
                    className="inline-flex items-center gap-1.5 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    Ver Termos de Uso
                    <ChevronRight className="w-4 h-4" />
                  </Link>
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
