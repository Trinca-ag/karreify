import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";
import TiltCard from "@/components/ui/TiltCard";
import VideoMockup from "@/components/ui/VideoMockup";
import { CREDIT_PACKS } from "@/types";
import {
  FileSearch,
  FilePlus,
  Target,
  ScrollText,
  Briefcase,
  Building2,
  BarChart2,
  Sparkles,
  Upload,
  ArrowRight,
  Check,
  Zap,
  Shield,
  Smartphone,
  Cpu,
  Brain,
  TrendingUp,
  Coins,
  Clock,
  Award,
  Lightbulb,
  Lock,
  Globe,
  Gauge,
  Wifi,
  Languages,
  Gift,
  type LucideIcon,
} from "lucide-react";

/* =========================================================================
   FEATURE SPOTLIGHTS — dados de cada seção
   ========================================================================= */

type Spotlight = {
  id: string;
  badge: string;
  badgeColor: string;
  icon: LucideIcon;
  title: string;
  highlight: string;
  description: string;
  bullets: { icon: LucideIcon; text: string }[];
  ctaHref: string;
  ctaLabel: string;
  gradient: string;
  glowColor: string;
  /** Nome do arquivo em /public/videos (com extensão). */
  videoFile: string;
  /** Texto que aparece na "URL bar" do mockup. */
  videoUrl: string;
};

const spotlights: Spotlight[] = [
  {
    id: "analise-curriculo",
    badge: "Análise de Currículo",
    badgeColor: "bg-primary-500/10 border-primary-500/20 text-primary-300",
    icon: FileSearch,
    title: "Descubra o que está",
    highlight: "freando suas entrevistas",
    description:
      "Envie seu currículo em PDF, DOC ou DOCX e receba uma análise profunda gerada por IA com pontuação, pontos fortes, fracos e sugestões acionáveis em segundos.",
    bullets: [
      { icon: Check, text: "Score detalhado de estrutura, conteúdo e linguagem" },
      { icon: Check, text: "Compatibilidade com sistemas ATS de recrutamento" },
      { icon: Check, text: "Sugestões específicas por seção, prontas para aplicar" },
    ],
    ctaHref: "/auth/register",
    ctaLabel: "Analisar agora",
    gradient: "from-primary-500 to-accent-cyan",
    glowColor: "rgba(59, 130, 246, 0.4)",
    videoFile: "Análise de currículo.mp4",
    videoUrl: "karreify.com/resume-analysis",
  },
  {
    id: "criacao-curriculo",
    badge: "Criação de Currículo",
    badgeColor: "bg-emerald-500/10 border-emerald-500/20 text-emerald-300",
    icon: FilePlus,
    title: "Crie um currículo profissional",
    highlight: "do zero ou a partir de um modelo",
    description:
      "Templates modernos otimizados para ATS, geração automática de bullets pela IA e exportação em PDF pronta para enviar — sem precisar abrir o Word.",
    bullets: [
      { icon: Check, text: "Templates moderno, clássico e minimalista" },
      { icon: Check, text: "IA escreve descrições de cargos por você" },
      { icon: Check, text: "Edição visual com preview em tempo real" },
    ],
    ctaHref: "/auth/register",
    ctaLabel: "Criar meu currículo",
    gradient: "from-emerald-500 to-teal-500",
    glowColor: "rgba(16, 185, 129, 0.4)",
    videoFile: "criação de currículo.mp4",
    videoUrl: "karreify.com/create-resume",
  },
  {
    id: "adaptacao-vagas",
    badge: "Adaptação para Vagas",
    badgeColor: "bg-orange-500/10 border-orange-500/20 text-orange-300",
    icon: Target,
    title: "Customize seu currículo para",
    highlight: "cada vaga específica",
    description:
      "Cole o anúncio da vaga e veja sua compatibilidade em tempo real. A IA destaca palavras-chave faltantes e adapta seu currículo para maximizar suas chances.",
    bullets: [
      { icon: Check, text: "Score de match instantâneo com a vaga" },
      { icon: Check, text: "Palavras-chave do anúncio detectadas e injetadas" },
      { icon: Check, text: "Versão adaptada salva no seu histórico" },
    ],
    ctaHref: "/auth/register",
    ctaLabel: "Adaptar para vaga",
    gradient: "from-orange-500 to-amber-500",
    glowColor: "rgba(249, 115, 22, 0.4)",
    videoFile: "currículo para vaga.mp4",
    videoUrl: "karreify.com/adapt-resume",
  },
  {
    id: "carta-apresentacao",
    badge: "Carta de Apresentação",
    badgeColor: "bg-teal-500/10 border-teal-500/20 text-teal-300",
    icon: ScrollText,
    title: "Cartas persuasivas geradas",
    highlight: "em segundos, não em horas",
    description:
      "A IA combina seu perfil com a vaga e gera uma carta personalizada, com tom adequado e exemplos que demonstram fit cultural — pronta para enviar.",
    bullets: [
      { icon: Check, text: "Personalização por empresa e cargo" },
      { icon: Check, text: "Tom ajustável: formal, casual ou criativo" },
      { icon: Check, text: "Múltiplas versões para você escolher" },
    ],
    ctaHref: "/auth/register",
    ctaLabel: "Gerar minha carta",
    gradient: "from-teal-500 to-cyan-500",
    glowColor: "rgba(20, 184, 166, 0.4)",
    videoFile: "Carta de apresentação.mp4",
    videoUrl: "karreify.com/cover-letter",
  },
  {
    id: "busca-vagas",
    badge: "Busca de Vagas",
    badgeColor: "bg-amber-500/10 border-amber-500/20 text-amber-300",
    icon: Briefcase,
    title: "Encontre vagas reais",
    highlight: "publicadas nos últimos 30 dias",
    description:
      "Conectamos você a oportunidades reais da web, com filtros inteligentes por área, senioridade, localização e modalidade — sem perder tempo em portais lentos.",
    bullets: [
      { icon: Check, text: "Vagas atualizadas diariamente de múltiplas fontes" },
      { icon: Check, text: "Filtros por remoto, híbrido e presencial" },
      { icon: Check, text: "Adapte seu currículo direto na vaga encontrada" },
    ],
    ctaHref: "/auth/register",
    ctaLabel: "Buscar vagas",
    gradient: "from-amber-500 to-yellow-500",
    glowColor: "rgba(245, 158, 11, 0.4)",
    videoFile: "vagas.mp4",
    videoUrl: "karreify.com/jobs",
  },
  {
    id: "analise-empresa",
    badge: "Análise de Empresa",
    badgeColor: "bg-sky-500/10 border-sky-500/20 text-sky-300",
    icon: Building2,
    title: "Chegue na entrevista",
    highlight: "sabendo tudo sobre a empresa",
    description:
      "Pesquise cultura, valores, faixa salarial, modelo de trabalho e perguntas frequentes de processo seletivo — tudo consolidado em um relatório de IA.",
    bullets: [
      { icon: Check, text: "Cultura, valores e modelo de trabalho" },
      { icon: Check, text: "Faixa salarial e benefícios reportados" },
      { icon: Check, text: "Perguntas comuns no processo seletivo" },
    ],
    ctaHref: "/auth/register",
    ctaLabel: "Analisar empresa",
    gradient: "from-sky-500 to-blue-500",
    glowColor: "rgba(14, 165, 233, 0.4)",
    videoFile: "análise de empresa.mp4",
    videoUrl: "karreify.com/company-analysis",
  },
  {
    id: "mercado-tendencias",
    badge: "Mercado e Tendências",
    badgeColor: "bg-accent-violet/10 border-accent-violet/20 text-accent-violet",
    icon: BarChart2,
    title: "Visualize as carreiras",
    highlight: "e habilidades em alta",
    description:
      "Dados de mercado, faixas salariais e habilidades mais valorizadas. Saiba onde investir seu tempo de aprendizado e qual carreira tem maior crescimento.",
    bullets: [
      { icon: Check, text: "Salários médios por cargo e senioridade" },
      { icon: Check, text: "Skills mais demandadas no momento" },
      { icon: Check, text: "Comparativo entre áreas e localidades" },
    ],
    ctaHref: "/auth/register",
    ctaLabel: "Explorar mercado",
    gradient: "from-accent-violet to-accent-pink",
    glowColor: "rgba(139, 92, 246, 0.4)",
    videoFile: "mercado.mp4",
    videoUrl: "karreify.com/market",
  },
];

/* =========================================================================
   OUTROS DADOS
   ========================================================================= */

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Envie ou comece do zero",
    description:
      "Faça upload do seu currículo em PDF, DOC, DOCX ou comece um novo direto na plataforma.",
  },
  {
    icon: Brain,
    step: "02",
    title: "A IA analisa tudo",
    description:
      "Modelos de última geração processam cada detalhe e geram recomendações em segundos.",
  },
  {
    icon: TrendingUp,
    step: "03",
    title: "Receba seus resultados",
    description:
      "Score detalhado, sugestões personalizadas e materiais prontos para enviar.",
  },
];

type WhyChooseItem = {
  id: string;
  illustration: "speed" | "security" | "accessibility" | "ai";
  icon: LucideIcon;
  title: string;
  description: string;
  stat: string;
  statLabel: string;
  bullets: { icon: LucideIcon; text: string }[];
  gradient: string;
  glowColor: string;
  iconBg: string;
};

const whyChooseUs: WhyChooseItem[] = [
  {
    id: "speed",
    illustration: "speed",
    icon: Zap,
    title: "Resultados em segundos",
    description:
      "Análise completa do seu currículo em menos de 10 segundos. Sem fila, sem espera — IA otimizada para máxima performance, mesmo em horários de pico.",
    stat: "<10s",
    statLabel: "tempo médio de análise",
    bullets: [
      { icon: Gauge, text: "Processamento paralelo distribuído" },
      { icon: Sparkles, text: "Cache inteligente entre sessões" },
      { icon: ArrowRight, text: "Sem limite de tentativas" },
    ],
    gradient: "from-amber-400 to-orange-500",
    glowColor: "rgba(249, 115, 22, 0.4)",
    iconBg: "bg-amber-500/10 text-amber-400",
  },
  {
    id: "security",
    illustration: "security",
    icon: Shield,
    title: "Seus dados, blindados",
    description:
      "Criptografia AES-256 end-to-end e conformidade total com LGPD. Seu currículo é armazenado em servidores seguros e nunca compartilhado com terceiros.",
    stat: "AES-256",
    statLabel: "criptografia ponta-a-ponta",
    bullets: [
      { icon: Lock, text: "Conformidade total com a LGPD" },
      { icon: Shield, text: "Servidores hospedados no Brasil" },
      { icon: Check, text: "Você deleta seus dados quando quiser" },
    ],
    gradient: "from-emerald-400 to-green-500",
    glowColor: "rgba(16, 185, 129, 0.4)",
    iconBg: "bg-emerald-500/10 text-emerald-400",
  },
  {
    id: "accessibility",
    illustration: "accessibility",
    icon: Smartphone,
    title: "De qualquer dispositivo",
    description:
      "Web responsivo otimizado para celular, tablet e desktop. Comece a editar no ônibus, finalize no notebook em casa — tudo sincronizado em tempo real.",
    stat: "100%",
    statLabel: "responsivo em qualquer tela",
    bullets: [
      { icon: Smartphone, text: "Mobile-first para edição em movimento" },
      { icon: Wifi, text: "Sincronização automática entre dispositivos" },
      { icon: Globe, text: "Funciona em qualquer navegador moderno" },
    ],
    gradient: "from-primary-400 to-accent-cyan",
    glowColor: "rgba(59, 130, 246, 0.4)",
    iconBg: "bg-primary-500/10 text-primary-400",
  },
  {
    id: "ai",
    illustration: "ai",
    icon: Cpu,
    title: "IA treinada para o Brasil",
    description:
      "Modelos de última geração treinados com vagas e currículos brasileiros. A IA entende o seu mercado, sua cultura corporativa e o seu idioma.",
    stat: "+50",
    statLabel: "critérios analisados por IA",
    bullets: [
      { icon: Languages, text: "Português nativo, sem traduções estranhas" },
      { icon: TrendingUp, text: "Atualizações constantes baseadas no mercado" },
      { icon: Brain, text: "Aprende com cada análise para evoluir" },
    ],
    gradient: "from-accent-violet to-accent-pink",
    glowColor: "rgba(139, 92, 246, 0.4)",
    iconBg: "bg-accent-violet/10 text-accent-violet",
  },
];

const stats = [
  { value: "10k+", label: "Currículos analisados" },
  { value: "95%", label: "Satisfação dos usuários" },
  { value: "3x", label: "Mais entrevistas" },
  { value: "+7", label: "Ferramentas com IA" },
];

const marqueeTags = [
  "ATS otimizado",
  "Análise por IA",
  "Score em tempo real",
  "Templates modernos",
  "Cartas personalizadas",
  "Vagas reais",
  "Insights de mercado",
  "Compatibilidade de vaga",
];

/* =========================================================================
   PARTICLES — fundo decorativo
   ========================================================================= */

function Particles({ count = 6, className = "" }: { count?: number; className?: string }) {
  const particles = Array.from({ length: count }, (_, i) => {
    const size = 4 + (i % 3) * 3;
    const left = (i * 17) % 100;
    const top = (i * 23) % 100;
    const delay = (i % 6) * 2;
    return { size, left, top, delay, key: i };
  });
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden>
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


/* =========================================================================
   BENEFIT ILLUSTRATIONS — SVG customizados animados via SMIL
   ========================================================================= */

function SpeedIllustration() {
  return (
    <svg viewBox="0 0 140 140" className="w-full h-36" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <linearGradient id="speedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
        <radialGradient id="speedGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="70" cy="70" r="55" fill="url(#speedGlow)" />
      <circle cx="70" cy="70" r="42" stroke="url(#speedGrad)" strokeWidth="1.5" fill="none" opacity="0.3" />
      <circle cx="70" cy="70" r="48" stroke="url(#speedGrad)" strokeWidth="2" fill="none" opacity="0.6" strokeDasharray="120 200">
        <animate attributeName="stroke-dashoffset" from="0" to="-320" dur="3s" repeatCount="indefinite" />
      </circle>
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        const x1 = 70 + Math.cos(angle) * 38;
        const y1 = 70 + Math.sin(angle) * 38;
        const x2 = 70 + Math.cos(angle) * 42;
        const y2 = 70 + Math.sin(angle) * 42;
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(251, 191, 36, 0.5)" strokeWidth={i % 3 === 0 ? 2 : 1} strokeLinecap="round" />
        );
      })}
      <g>
        <animateTransform attributeName="transform" type="rotate" from="0 70 70" to="360 70 70" dur="2.5s" repeatCount="indefinite" />
        <line x1="70" y1="70" x2="70" y2="35" stroke="url(#speedGrad)" strokeWidth="3" strokeLinecap="round" />
        <circle cx="70" cy="35" r="3" fill="#fbbf24" />
      </g>
      <circle cx="70" cy="70" r="5" fill="url(#speedGrad)" />
      <circle cx="70" cy="70" r="2" fill="#fff" />
      <path
        d="M105 35 L92 55 L98 55 L88 75 L108 50 L100 50 Z"
        fill="url(#speedGrad)"
        opacity="0.9"
      >
        <animate attributeName="opacity" values="0.6;1;0.6" dur="1.5s" repeatCount="indefinite" />
      </path>
    </svg>
  );
}

function SecurityIllustration() {
  return (
    <svg viewBox="0 0 140 140" className="w-full h-36" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <linearGradient id="secGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
        <radialGradient id="secGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="70" cy="70" r="55" fill="url(#secGlow)" />
      <g>
        <animateTransform attributeName="transform" type="rotate" from="0 70 70" to="360 70 70" dur="20s" repeatCount="indefinite" />
        <circle cx="70" cy="70" r="55" stroke="url(#secGrad)" strokeWidth="1.5" fill="none" strokeDasharray="3 5" opacity="0.5" />
      </g>
      <g>
        <animateTransform attributeName="transform" type="rotate" from="360 70 70" to="0 70 70" dur="15s" repeatCount="indefinite" />
        <circle cx="70" cy="70" r="46" stroke="url(#secGrad)" strokeWidth="1" fill="none" strokeDasharray="2 4" opacity="0.35" />
      </g>
      <path
        d="M70 28 L96 38 L96 68 Q96 92 70 108 Q44 92 44 68 L44 38 Z"
        fill="url(#secGrad)"
        opacity="0.92"
      />
      <path
        d="M70 28 L96 38 L96 68 Q96 92 70 108 Q44 92 44 68 L44 38 Z"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="1"
        fill="none"
      />
      <path
        d="M58 68 L66 76 L82 60"
        stroke="white"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        <animate attributeName="stroke-dasharray" from="0 30" to="30 0" dur="1.2s" begin="0.3s" fill="freeze" />
      </path>
      {[
        { x: 30, y: 50, d: 0 },
        { x: 110, y: 55, d: 0.5 },
        { x: 28, y: 90, d: 1 },
        { x: 112, y: 95, d: 1.5 },
      ].map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="2" fill="#34d399">
          <animate attributeName="opacity" values="0;1;0" dur="3s" begin={`${p.d}s`} repeatCount="indefinite" />
          <animate attributeName="r" values="1;3;1" dur="3s" begin={`${p.d}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  );
}

function AccessibilityIllustration() {
  return (
    <svg viewBox="0 0 140 140" className="w-full h-36" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <linearGradient id="accGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <radialGradient id="accGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="70" cy="70" r="55" fill="url(#accGlow)" />
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0; 0 -3; 0 0" dur="4s" repeatCount="indefinite" />
        <rect x="20" y="55" width="60" height="40" rx="3" fill="url(#accGrad)" opacity="0.85" />
        <rect x="22" y="57" width="56" height="32" rx="2" fill="#0a1628" />
        <rect x="13" y="95" width="74" height="4" rx="2" fill="url(#accGrad)" opacity="0.6" />
        <line x1="30" y1="65" x2="65" y2="65" stroke="rgba(96, 165, 250, 0.7)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="30" y1="70" x2="55" y2="70" stroke="rgba(96, 165, 250, 0.5)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="30" y1="75" x2="60" y2="75" stroke="rgba(96, 165, 250, 0.5)" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="30" y="82" width="20" height="3" rx="1.5" fill="rgba(96, 165, 250, 0.4)" />
      </g>
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0; 0 -4; 0 0" dur="4s" begin="0.8s" repeatCount="indefinite" />
        <rect x="72" y="38" width="38" height="50" rx="4" fill="url(#accGrad)" opacity="0.95" />
        <rect x="74" y="42" width="34" height="40" rx="1.5" fill="#0a1628" />
        <circle cx="91" cy="85" r="1.5" fill="rgba(255,255,255,0.5)" />
        <rect x="80" y="48" width="22" height="2" rx="1" fill="rgba(96, 165, 250, 0.7)" />
        <rect x="80" y="53" width="16" height="2" rx="1" fill="rgba(96, 165, 250, 0.5)" />
        <rect x="80" y="62" width="22" height="14" rx="1" fill="rgba(96, 165, 250, 0.15)" />
      </g>
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0; 0 -5; 0 0" dur="4s" begin="1.6s" repeatCount="indefinite" />
        <rect x="98" y="60" width="22" height="38" rx="3" fill="url(#accGrad)" />
        <rect x="100" y="63" width="18" height="30" rx="1.5" fill="#0a1628" />
        <line x1="103" y1="68" x2="115" y2="68" stroke="rgba(96, 165, 250, 0.8)" strokeWidth="1" />
        <line x1="103" y1="72" x2="112" y2="72" stroke="rgba(96, 165, 250, 0.6)" strokeWidth="1" />
        <rect x="103" y="78" width="12" height="10" rx="1" fill="rgba(96, 165, 250, 0.2)" />
        <circle cx="109" cy="95" r="1" fill="rgba(255,255,255,0.6)" />
      </g>
    </svg>
  );
}

function AIIllustration() {
  const nodes = [
    { cx: 30, cy: 40, r: 4, delay: 0 },
    { cx: 30, cy: 70, r: 5, delay: 0.3 },
    { cx: 30, cy: 100, r: 4, delay: 0.6 },
    { cx: 70, cy: 50, r: 6, delay: 0.9 },
    { cx: 70, cy: 90, r: 6, delay: 1.2 },
    { cx: 110, cy: 70, r: 9, delay: 1.5, isOutput: true },
  ];
  const connections = [
    [0, 3], [1, 3], [1, 4], [2, 4],
    [3, 5], [4, 5],
  ];
  return (
    <svg viewBox="0 0 140 140" className="w-full h-36" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <linearGradient id="aiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
        <radialGradient id="aiGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
        </radialGradient>
        <filter id="aiBlur">
          <feGaussianBlur stdDeviation="1.5" />
        </filter>
      </defs>
      <circle cx="70" cy="70" r="55" fill="url(#aiGlow)" />
      {connections.map(([a, b], i) => {
        const from = nodes[a];
        const to = nodes[b];
        return (
          <line
            key={i}
            x1={from.cx}
            y1={from.cy}
            x2={to.cx}
            y2={to.cy}
            stroke="url(#aiGrad)"
            strokeWidth="1"
            opacity="0.35"
          />
        );
      })}
      {connections.map(([a, b], i) => {
        const from = nodes[a];
        const to = nodes[b];
        return (
          <line
            key={`flow-${i}`}
            x1={from.cx}
            y1={from.cy}
            x2={to.cx}
            y2={to.cy}
            stroke="url(#aiGrad)"
            strokeWidth="1.5"
            strokeDasharray="3 6"
            opacity="0.8"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="-18"
              dur={`${1.5 + i * 0.2}s`}
              repeatCount="indefinite"
            />
          </line>
        );
      })}
      {nodes.map((n, i) => (
        <g key={i}>
          {n.isOutput && (
            <circle cx={n.cx} cy={n.cy} r={n.r + 6} fill="url(#aiGrad)" opacity="0.3" filter="url(#aiBlur)">
              <animate attributeName="r" values={`${n.r + 4};${n.r + 10};${n.r + 4}`} dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.2;0.5;0.2" dur="2s" repeatCount="indefinite" />
            </circle>
          )}
          <circle cx={n.cx} cy={n.cy} r={n.r} fill="url(#aiGrad)">
            <animate
              attributeName="r"
              values={`${n.r};${n.r + 1.5};${n.r}`}
              dur="2s"
              begin={`${n.delay}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.7;1;0.7"
              dur="2s"
              begin={`${n.delay}s`}
              repeatCount="indefinite"
            />
          </circle>
        </g>
      ))}
      <text x="110" y="74" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" fontFamily="system-ui">
        AI
      </text>
    </svg>
  );
}

function renderIllustration(kind: WhyChooseItem["illustration"]) {
  switch (kind) {
    case "speed":
      return <SpeedIllustration />;
    case "security":
      return <SecurityIllustration />;
    case "accessibility":
      return <AccessibilityIllustration />;
    case "ai":
      return <AIIllustration />;
  }
}

/* =========================================================================
   PÁGINA PRINCIPAL
   ========================================================================= */

export default function Home() {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://karreify.com";
  const webAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Karreify",
    url: siteUrl,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    inLanguage: "pt-BR",
    description:
      "Crie, adapte e analise currículos com inteligência artificial. Gere cartas de apresentação, encontre vagas e impulsione sua carreira.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "BRL",
      description:
        "Comece grátis com créditos iniciais; pacotes de moedas a partir de R$ 14,90.",
    },
  };

  return (
    <div className="min-h-screen bg-dark-900 text-white overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webAppJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Navbar />

      {/* ========== HERO ========== */}
      <section className="relative lg:min-h-[90vh] flex flex-col noise-overlay">
        <div className="absolute inset-0 bg-grid-pattern opacity-60" />
        <div className="orb w-[700px] h-[700px] bg-primary-600 -top-[200px] -left-[200px] animate-pulse-glow" />
        <div className="orb w-[500px] h-[500px] bg-accent-violet -bottom-[150px] -right-[150px] animate-pulse-glow animation-delay-500" />
        <div className="orb w-[300px] h-[300px] bg-accent-cyan top-[40%] left-[60%] animate-pulse-glow animation-delay-300" />
        <Particles count={8} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10 sm:pt-20 lg:pt-32 lg:pb-32 w-full flex-1 flex items-center">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">
            <div className="max-w-2xl">
              <h1 className="text-center lg:text-left text-[2rem] leading-[1.15] sm:text-5xl lg:text-5xl xl:text-6xl font-heading font-bold tracking-tight sm:leading-[1.1] animate-fade-in-up animation-delay-100">
                Transforme sua carreira com o poder da{" "}
                <span className="gradient-text">Inteligência Artificial</span>
              </h1>

              <p className="mt-5 sm:mt-6 text-center lg:text-left text-base sm:text-lg lg:text-lg xl:text-xl text-gray-400 leading-relaxed max-w-xl mx-auto lg:mx-0 animate-fade-in-up animation-delay-200">
                Crie currículos profissionais, encontre vagas, analise empresas
                e planeje sua carreira com IA de última geração.
              </p>

              {/* Mockup — mobile/tablet only, between paragraph and CTAs.
                  Desktop renders the same card in the right grid column below. */}
              <div className="lg:hidden mt-8 max-w-md mx-auto animate-fade-in-up animation-delay-300">
                <div className="relative animate-float-slow">
                  <TiltCard intensity={8}>
                    <VideoMockup
                      src={`/videos/${encodeURIComponent("Análise de currículo.mp4")}`}
                      url="karreify.com/resume-analysis"
                    />
                  </TiltCard>
                  <div className="absolute -top-4 -right-4 float-badge z-10">
                    <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/30">
                      Score A+
                    </div>
                  </div>
                  <div
                    className="absolute -bottom-4 -left-4 float-badge z-10"
                    style={{ animationDelay: "2.5s" }}
                  >
                    <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-primary-500 to-accent-violet text-white text-xs font-bold shadow-lg shadow-primary-500/30 inline-flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3" /> IA Analisou
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-start gap-3 sm:gap-4 animate-fade-in-up animation-delay-300">
                <Link
                  href="/auth/register"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:px-8 sm:py-4 bg-gradient-to-r from-primary-600 to-accent-violet text-white font-semibold rounded-xl transition-all duration-300 btn-glow"
                >
                  Começar agora
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:px-8 sm:py-4 text-gray-300 font-semibold rounded-xl border border-white/10 hover:bg-white/5 hover:border-white/20 transition-all duration-300"
                >
                  Como funciona
                </a>
              </div>
            </div>

            {/* Right: Hero mockup com tilt — desktop only. The mobile/tablet
                rendering lives above the CTA buttons in the left column. */}
            <div className="hidden lg:block animate-fade-in-up animation-delay-400">
              <div className="relative animate-float-slow">
                <TiltCard intensity={8}>
                  <VideoMockup
                    src={`/videos/${encodeURIComponent("Análise de currículo.mp4")}`}
                    url="karreify.com/resume-analysis"
                  />
                </TiltCard>
                {/* Floating badges */}
                <div className="absolute -top-4 -right-4 float-badge z-10">
                  <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/30">
                    Score A+
                  </div>
                </div>
                <div
                  className="absolute -bottom-4 -left-4 float-badge z-10"
                  style={{ animationDelay: "2.5s" }}
                >
                  <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-primary-500 to-accent-violet text-white text-xs font-bold shadow-lg shadow-primary-500/30 inline-flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" /> IA Analisou
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar — flows in-page on mobile/tablet, sticks to the bottom
            of the hero on lg+ where there's space for the absolute layout. */}
        <div className="relative lg:absolute lg:bottom-0 lg:left-0 lg:right-0 z-10 glass border-t border-white/5">
          {/* Mobile/tablet: infinite marquee */}
          <div className="lg:hidden marquee py-4">
            <div className="marquee-track">
              {[...stats, ...stats].map((stat, i) => (
                <div key={`a-${i}`} className="flex-shrink-0 text-center px-6">
                  <div className="text-xl font-heading font-bold text-white glow-text">
                    {stat.value}
                  </div>
                  <div className="text-[11px] text-gray-500 mt-1 whitespace-nowrap">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
            <div className="marquee-track" aria-hidden>
              {[...stats, ...stats].map((stat, i) => (
                <div key={`b-${i}`} className="flex-shrink-0 text-center px-6">
                  <div className="text-xl font-heading font-bold text-white glow-text">
                    {stat.value}
                  </div>
                  <div className="text-[11px] text-gray-500 mt-1 whitespace-nowrap">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop: 4-up static grid */}
          <div className="hidden lg:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/5">
              {stats.map((stat) => (
                <div key={stat.label} className="py-5 px-4 text-center">
                  <div className="text-2xl font-heading font-bold text-white glow-text">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== MARQUEE (transição) ========== */}
      <section className="hidden lg:block relative py-10 bg-dark-900 border-y border-white/5">
        <div className="marquee">
          <div className="marquee-track">
            {[...marqueeTags, ...marqueeTags].map((tag, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2 text-sm text-gray-400 whitespace-nowrap"
              >
                <Sparkles className="w-4 h-4 text-primary-400" />
                {tag}
                <span className="text-gray-700">•</span>
              </span>
            ))}
          </div>
          <div className="marquee-track" aria-hidden>
            {[...marqueeTags, ...marqueeTags].map((tag, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2 text-sm text-gray-400 whitespace-nowrap"
              >
                <Sparkles className="w-4 h-4 text-primary-400" />
                {tag}
                <span className="text-gray-700">•</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FEATURES INTRO ========== */}
      <section id="features" className="relative py-20 bg-dark-900 noise-overlay scroll-mt-20">
        <div className="absolute inset-0 bg-radial-blue opacity-50" />
        <ScrollReveal direction="up" className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium bg-primary-500/10 border border-primary-500/20 text-primary-400 mb-6">
            Funcionalidades
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold leading-tight">
            Tudo que sua carreira precisa,{" "}
            <span className="gradient-text">em um só lugar</span>
          </h2>
          <p className="mt-5 text-lg text-gray-400">
            Sete ferramentas alimentadas por IA para cada etapa da sua jornada profissional.
          </p>
        </ScrollReveal>
      </section>

      {/* ========== SPOTLIGHTS + COMO FUNCIONA — container unificado ========== */}
      <div className="relative bg-dark-900 overflow-hidden">
        <Particles count={20} />
        {/* SPOTLIGHTS — sub-container que escopa as orbes só na área das 7 funcionalidades */}
        <div className="relative">
          {/* Orbes unificadas — distribuídas verticalmente, fluindo entre as seções sem cortes */}
          <div aria-hidden className="absolute inset-0 pointer-events-none">
            {spotlights.map((s, idx) => {
              const reversed = idx % 2 === 1;
              const verticalCenter = `${((idx + 0.5) * 100) / spotlights.length}%`;
              return (
                <div
                  key={`orb-${s.id}`}
                  className="orb w-[500px] h-[500px] opacity-50"
                  style={{
                    background: s.glowColor,
                    top: verticalCenter,
                    transform: "translate(0, -50%)",
                    left: reversed ? "auto" : "-150px",
                    right: reversed ? "-150px" : "auto",
                  }}
                />
              );
            })}
          </div>

        {spotlights.map((s, idx) => {
          const reversed = idx % 2 === 1;
          return (
            <section
              key={s.id}
              id={s.id}
              className="relative py-12 sm:py-16 lg:py-20 spotlight-bg"
            >
              <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
                  {/* Mockup — mobile: embaixo (order-2). Desktop: alterna lados via order-1/2 baseado em `reversed`. */}
                  <ScrollReveal
                    direction={reversed ? "right" : "left"}
                    className={`relative order-2 ${reversed ? "lg:order-2" : "lg:order-1"}`}
                    duration={900}
                  >
                    <div className="relative animate-float-slower">
                      <TiltCard intensity={6}>
                        <VideoMockup
                          src={`/videos/${encodeURIComponent(s.videoFile)}`}
                          url={s.videoUrl}
                        />
                      </TiltCard>
                      {/* Decorative icon badge */}
                      <div
                        className={`absolute -top-6 ${
                          reversed ? "-left-6" : "-right-6"
                        } w-16 h-16 rounded-2xl bg-gradient-to-br ${s.gradient} flex items-center justify-center shadow-2xl float-badge`}
                        style={{ animationDelay: "1s" }}
                      >
                        <s.icon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </ScrollReveal>

                  {/* Texto — mobile: em cima (order-1). Desktop: alterna lados via order. */}
                  <ScrollReveal
                    direction={reversed ? "left" : "right"}
                    delay={150}
                    duration={900}
                    className={`max-w-xl order-1 ${reversed ? "lg:order-1" : "lg:order-2"}`}
                  >
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-5 border ${s.badgeColor}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {s.badge}
                    </span>
                    <h3 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold leading-[1.15] tracking-tight">
                      {s.title}{" "}
                      <span
                        className={`bg-gradient-to-r ${s.gradient} bg-clip-text text-transparent`}
                      >
                        {s.highlight}
                      </span>
                    </h3>
                    <p className="mt-5 text-lg text-gray-400 leading-relaxed">
                      {s.description}
                    </p>
                    <ul className="mt-7 space-y-3">
                      {s.bullets.map((b, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div
                            className={`w-6 h-6 rounded-lg bg-gradient-to-br ${s.gradient} flex items-center justify-center flex-shrink-0 mt-0.5`}
                          >
                            <b.icon className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                          </div>
                          <span className="text-gray-300">{b.text}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={s.ctaHref}
                      className={`group mt-8 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${s.gradient} text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl`}
                      style={{ boxShadow: `0 10px 40px -10px ${s.glowColor}` }}
                    >
                      {s.ctaLabel}
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </ScrollReveal>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* ========== COMO FUNCIONA — agora dentro do container unificado, sem cortar a continuidade visual ========== */}
      <section id="how-it-works" className="relative py-28 scroll-mt-20">
        <div
          className="orb w-[400px] h-[400px] bg-accent-violet animate-pulse-glow"
          style={{ top: "-100px", right: 0 }}
        />
        <div className="orb w-[400px] h-[400px] bg-primary-500 bottom-0 left-0 animate-pulse-glow animation-delay-500" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" className="text-center max-w-3xl mx-auto mb-20">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium bg-accent-violet/10 border border-accent-violet/20 text-accent-violet mb-6">
              Simples e rápido
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold">
              Como <span className="gradient-text">funciona</span>
            </h2>
            <p className="mt-5 text-lg text-gray-400">
              Três passos simples para transformar sua carreira.
            </p>
          </ScrollReveal>

          <div className="relative">
            {/* Animated connector line — fora do grid pra nunca virar grid item */}
            <div className="hidden md:block absolute top-[60px] left-[16.66%] right-[16.66%] h-[2px] connector-line opacity-80 pointer-events-none" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              {steps.map((step, i) => (
                <ScrollReveal
                  key={step.step}
                  direction="up"
                  delay={i * 150}
                  duration={800}
                  className="relative text-center"
                >
                  <div className="relative inline-flex mb-6 animate-float-slow" style={{ animationDelay: `${i * 0.7}s` }}>
                    <div className="w-[120px] h-[120px] rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 flex items-center justify-center backdrop-blur-sm">
                      <step.icon className="w-12 h-12 text-primary-400" />
                    </div>
                    <div className="absolute -top-3 -right-3 w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-violet flex items-center justify-center text-sm font-heading font-bold text-white glow-blue">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-heading font-semibold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-400 max-w-xs mx-auto">{step.description}</p>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>
      </div>

      {/* ========== POR QUE ESCOLHER ========== */}
      <section id="diferenciais" className="relative py-28 bg-dark-800 overflow-hidden scroll-mt-20">
        <div className="absolute inset-0 bg-radial-violet opacity-50" />
        <Particles count={6} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium bg-accent-violet/10 border border-accent-violet/20 text-accent-violet mb-6">
              Diferenciais
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold leading-tight">
              Por que escolher o{" "}
              <span className="gradient-text">Karreify?</span>
            </h2>
            <p className="mt-5 text-lg text-gray-400">
              Quatro pilares que fazem a diferença quando o que está em jogo
              é a sua próxima oportunidade.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
            {whyChooseUs.map((item, i) => (
              <ScrollReveal
                key={item.id}
                direction={i % 2 === 0 ? "left" : "right"}
                delay={i * 120}
                duration={800}
              >
                <TiltCard intensity={6} glare>
                  <div
                    className="benefit-card glass-card p-7 lg:p-8 h-full border border-white/[0.06]"
                    style={{ boxShadow: `0 20px 60px -30px ${item.glowColor}` }}
                  >
                    <div className="scan-line" aria-hidden />
                    <div className="benefit-content space-y-6">
                      {/* Illustration + header */}
                      <div className="flex items-start gap-5">
                        <div
                          className="relative w-32 h-32 flex-shrink-0 rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden"
                          style={{ background: `radial-gradient(circle at center, ${item.glowColor.replace("0.4", "0.08")}, transparent)` }}
                        >
                          {renderIllustration(item.illustration)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium ${item.iconBg} mb-2`}>
                            <item.icon className="w-3.5 h-3.5" />
                            {item.statLabel}
                          </div>
                          <div className={`text-4xl lg:text-5xl font-heading font-bold leading-none bg-gradient-to-br ${item.gradient} bg-clip-text text-transparent`}>
                            {item.stat}
                          </div>
                        </div>
                      </div>

                      {/* Title + description */}
                      <div>
                        <h3 className="text-xl lg:text-2xl font-heading font-bold text-white mb-2">
                          {item.title}
                        </h3>
                        <p className="text-sm lg:text-base text-gray-400 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      {/* Bullets */}
                      <ul className="space-y-2.5 pt-1 border-t border-white/5">
                        {item.bullets.map((b, bi) => (
                          <li
                            key={bi}
                            className="flex items-center gap-3 text-sm text-gray-300 group/bullet transition-colors hover:text-white"
                          >
                            <div
                              className={`w-7 h-7 rounded-lg ${item.iconBg} flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover/bullet:scale-110`}
                            >
                              <b.icon className="w-3.5 h-3.5" strokeWidth={2.5} />
                            </div>
                            <span>{b.text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ========== AI SHOWCASE ========== */}
      <section id="tecnologia" className="relative py-24 bg-dark-900 overflow-hidden scroll-mt-20">
        <div className="absolute inset-0 bg-radial-blue opacity-50" />
        <Particles count={8} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal direction="left" className="relative">
              <div className="animate-float-slower">
                <svg
                  viewBox="0 0 500 400"
                  className="w-full h-auto"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8" />
                    </linearGradient>
                    <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.6" />
                    </linearGradient>
                    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                      <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.3" />
                    </linearGradient>
                    <filter id="glow1">
                      <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    <filter id="glow2">
                      <feGaussianBlur stdDeviation="8" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  <g opacity="0.4">
                    <line x1="80" y1="100" x2="200" y2="80" stroke="url(#lineGrad)" strokeWidth="1" />
                    <line x1="80" y1="100" x2="200" y2="160" stroke="url(#lineGrad)" strokeWidth="1" />
                    <line x1="80" y1="100" x2="200" y2="240" stroke="url(#lineGrad)" strokeWidth="1" />
                    <line x1="80" y1="200" x2="200" y2="80" stroke="url(#lineGrad)" strokeWidth="1" />
                    <line x1="80" y1="200" x2="200" y2="160" stroke="url(#lineGrad)" strokeWidth="1" />
                    <line x1="80" y1="200" x2="200" y2="240" stroke="url(#lineGrad)" strokeWidth="1" />
                    <line x1="80" y1="300" x2="200" y2="160" stroke="url(#lineGrad)" strokeWidth="1" />
                    <line x1="80" y1="300" x2="200" y2="240" stroke="url(#lineGrad)" strokeWidth="1" />
                    <line x1="80" y1="300" x2="200" y2="320" stroke="url(#lineGrad)" strokeWidth="1" />
                    <line x1="200" y1="80" x2="320" y2="120" stroke="url(#lineGrad)" strokeWidth="1.5" />
                    <line x1="200" y1="80" x2="320" y2="200" stroke="url(#lineGrad)" strokeWidth="1" />
                    <line x1="200" y1="160" x2="320" y2="120" stroke="url(#lineGrad)" strokeWidth="1.5" />
                    <line x1="200" y1="160" x2="320" y2="200" stroke="url(#lineGrad)" strokeWidth="1.5" />
                    <line x1="200" y1="160" x2="320" y2="280" stroke="url(#lineGrad)" strokeWidth="1" />
                    <line x1="200" y1="240" x2="320" y2="200" stroke="url(#lineGrad)" strokeWidth="1.5" />
                    <line x1="200" y1="240" x2="320" y2="280" stroke="url(#lineGrad)" strokeWidth="1.5" />
                    <line x1="200" y1="320" x2="320" y2="280" stroke="url(#lineGrad)" strokeWidth="1" />
                    <line x1="320" y1="120" x2="430" y2="200" stroke="url(#lineGrad)" strokeWidth="2" />
                    <line x1="320" y1="200" x2="430" y2="200" stroke="url(#lineGrad)" strokeWidth="2" />
                    <line x1="320" y1="280" x2="430" y2="200" stroke="url(#lineGrad)" strokeWidth="2" />
                  </g>
                  <g filter="url(#glow1)">
                    <circle cx="80" cy="100" r="12" fill="url(#grad2)" />
                    <circle cx="80" cy="200" r="12" fill="url(#grad2)" />
                    <circle cx="80" cy="300" r="12" fill="url(#grad2)" />
                  </g>
                  <g filter="url(#glow1)">
                    <circle cx="200" cy="80" r="10" fill="url(#grad1)" />
                    <circle cx="200" cy="160" r="14" fill="url(#grad1)" />
                    <circle cx="200" cy="240" r="10" fill="url(#grad1)" />
                    <circle cx="200" cy="320" r="8" fill="url(#grad1)" />
                  </g>
                  <g filter="url(#glow1)">
                    <circle cx="320" cy="120" r="11" fill="url(#grad1)" />
                    <circle cx="320" cy="200" r="16" fill="url(#grad1)" />
                    <circle cx="320" cy="280" r="11" fill="url(#grad1)" />
                  </g>
                  <g filter="url(#glow2)">
                    <circle cx="430" cy="200" r="22" fill="url(#grad1)" />
                    <text x="430" y="205" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="system-ui">
                      AI
                    </text>
                  </g>
                  <circle cx="140" cy="140" r="3" fill="#3b82f6" opacity="0.4">
                    <animate attributeName="cy" values="140;120;140" dur="3s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="260" cy="260" r="2" fill="#8b5cf6" opacity="0.5">
                    <animate attributeName="cy" values="260;240;260" dur="4s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="370" cy="160" r="2.5" fill="#06b6d4" opacity="0.4">
                    <animate attributeName="cy" values="160;145;160" dur="3.5s" repeatCount="indefinite" />
                  </circle>
                </svg>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={150}>
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium bg-primary-500/10 border border-primary-500/20 text-primary-400 mb-6">
                Tecnologia de ponta
              </span>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-6">
                IA que entende{" "}
                <span className="gradient-text">sua carreira</span>
              </h2>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Nosso sistema de inteligência artificial analisa mais de 50
                critérios do seu currículo para garantir a melhor performance
                em processos seletivos e otimização para ATS.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Award, color: "bg-green-500/20 text-green-400", title: "ATS Compatível", desc: "Otimização para sistemas de triagem automática" },
                  { icon: TrendingUp, color: "bg-primary-500/20 text-primary-400", title: "+45% Mais Entrevistas", desc: "Usuários reportam aumento significativo em callbacks" },
                  { icon: Lightbulb, color: "bg-accent-violet/20 text-accent-violet", title: "Score Inteligente", desc: "Pontuação detalhada com análise de 50+ critérios" },
                ].map((item, i) => (
                  <ScrollReveal key={item.title} direction="right" delay={250 + i * 100}>
                    <div className="flex items-center gap-4 glass-card p-4">
                      <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0`}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">{item.title}</div>
                        <div className="text-xs text-gray-500">{item.desc}</div>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ========== PRICING ========== */}
      <section id="pricing" className="relative py-28 bg-dark-800 noise-overlay scroll-mt-20">
        <div className="absolute inset-0 bg-radial-blue opacity-60" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan mb-6">
              Pacotes de Moedas
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold">
              Invista na sua <span className="gradient-text">carreira</span>
            </h2>
            <p className="mt-5 text-lg text-gray-400">
              Compra única, sem assinatura. Escolha o pacote ideal para suas necessidades.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 max-w-5xl mx-auto items-stretch">
            {CREDIT_PACKS.filter((pack) => !pack.isTest).map((pack) => {
              const popular = pack.id === "intermediary";
              const hasBonus = pack.bonusCredits > 0;
              return (
                <ScrollReveal
                  key={pack.id}
                  direction="up"
                  className={`relative rounded-2xl p-5 lg:p-7 transition-all duration-300 flex flex-col min-w-0 ${
                    popular
                      ? "gradient-border pricing-popular glass-card lg:scale-105 !overflow-visible"
                      : "glass-card"
                  }`}
                >
                  {popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                      <span className="px-5 py-1.5 bg-gradient-to-r from-primary-500 to-accent-violet text-white text-xs font-bold rounded-full glow-blue whitespace-nowrap">
                        MAIS POPULAR
                      </span>
                    </div>
                  )}

                  <h3 className="text-lg font-heading font-semibold text-white whitespace-nowrap">
                    {pack.name}
                  </h3>

                  <div className="mt-4 flex items-baseline gap-1 flex-wrap">
                    <span className="text-3xl lg:text-4xl font-heading font-bold gradient-text leading-none">
                      R${pack.price.toFixed(2).replace(".", ",")}
                    </span>
                    <span className="text-xs text-gray-500">único</span>
                  </div>

                  <div className="mt-3 flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <Coins className="w-4 h-4 text-primary-400 flex-shrink-0" />
                      <p className="text-sm text-primary-400 font-medium whitespace-nowrap">
                        {pack.totalCredits} moedas
                      </p>
                    </div>
                    {hasBonus && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-md px-1.5 py-0.5 whitespace-nowrap">
                        <Gift className="w-3 h-3" />
                        +{pack.bonusCredits} bônus
                      </span>
                    )}
                  </div>

                  <ul className="mt-6 space-y-3 flex-1">
                    {pack.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm">
                        <div className="w-5 h-5 rounded-full bg-primary-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-primary-400" />
                        </div>
                        <span className="text-gray-300 leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/auth/login"
                    className={`mt-6 block text-center py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 ${
                      popular
                        ? "bg-gradient-to-r from-primary-600 to-accent-violet text-white btn-glow"
                        : "bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20"
                    }`}
                  >
                    Começar agora
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>

          <p className="mt-10 text-center text-sm text-gray-500">
            Pagamento via PIX ou cartão (Abacate Pay). Suas moedas caem na conta
            imediatamente após a confirmação.
          </p>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/50 via-dark-900 to-accent-violet/20" />
        <div className="absolute inset-0 bg-grid-pattern opacity-40" />
        <div className="orb w-[500px] h-[500px] bg-primary-600 top-[-100px] left-[20%] animate-pulse-glow" />
        <div className="orb w-[400px] h-[400px] bg-accent-violet bottom-[-100px] right-[20%] animate-pulse-glow animation-delay-500" />
        <Particles count={10} />

        <ScrollReveal direction="scale" className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-8 bg-white/5 border border-white/10 backdrop-blur-sm">
            <Clock className="w-4 h-4 text-primary-400" />
            <span className="text-gray-300">Comece em menos de 2 minutos</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold leading-[1.1]">
            Pronto para transformar
            <br />
            <span className="gradient-text">sua carreira?</span>
          </h2>
          <p className="mt-6 text-lg text-gray-400 max-w-xl mx-auto">
            Junte-se a milhares de profissionais que já estão usando Karreify para
            alcançar seus objetivos.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/register"
              className="group inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-primary-600 to-accent-violet text-white font-bold rounded-xl transition-all duration-300 btn-glow text-lg"
            >
              Criar conta gratuita
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </ScrollReveal>
      </section>

      <Footer />
    </div>
  );
}
