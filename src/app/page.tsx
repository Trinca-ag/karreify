import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import {
  FileSearch,
  Linkedin,
  FilePlus,
  Target,
  Map,
  Sparkles,
  Upload,
  ArrowRight,
  Check,
  Zap,
  Shield,
  Globe,
  Brain,
  TrendingUp,
  Star,
} from "lucide-react";

const features = [
  {
    icon: FileSearch,
    title: "Análise de Currículo com IA",
    description:
      "Envie seu currículo e receba uma análise completa com pontuação, pontos fortes, fracos e sugestões de melhoria.",
    gradient: "from-primary-500 to-accent-cyan",
  },
  {
    icon: Linkedin,
    title: "Análise de Perfil LinkedIn",
    description:
      "Otimize seu perfil do LinkedIn com análise de SEO, sugestões de headline e seção sobre.",
    gradient: "from-accent-violet to-accent-pink",
  },
  {
    icon: FilePlus,
    title: "Criação de Currículo",
    description:
      "Crie um currículo profissional do zero ou a partir de um existente, otimizado para ATS.",
    gradient: "from-accent-cyan to-primary-500",
  },
  {
    icon: Target,
    title: "Adaptação para Vagas",
    description:
      "Adapte seu currículo para vagas específicas com análise de compatibilidade e palavras-chave.",
    gradient: "from-primary-500 to-accent-violet",
  },
  {
    icon: Map,
    title: "Roadmap de Carreira",
    description:
      "Receba um plano personalizado com cursos, certificações e metas para alcançar seu objetivo profissional.",
    gradient: "from-accent-pink to-primary-500",
  },
];

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Envie seu currículo",
    description:
      "Faça upload do seu currículo em PDF, DOC ou DOCX. Simples e rápido.",
  },
  {
    icon: Brain,
    step: "02",
    title: "IA analisa tudo",
    description:
      "Nossa IA processa e analisa cada detalhe do seu documento com precisão.",
  },
  {
    icon: TrendingUp,
    step: "03",
    title: "Receba resultados",
    description:
      "Veja pontuação, sugestões detalhadas e melhorias personalizadas.",
  },
];

const benefits = [
  {
    icon: Zap,
    title: "Ultra rápido",
    description: "Resultados em segundos, não em horas.",
    gradient: "from-yellow-400 to-orange-500",
  },
  {
    icon: Shield,
    title: "100% Seguro",
    description: "Seus dados protegidos com criptografia.",
    gradient: "from-green-400 to-emerald-500",
  },
  {
    icon: Globe,
    title: "Acessível",
    description: "Use de qualquer lugar, qualquer dispositivo.",
    gradient: "from-primary-400 to-accent-cyan",
  },
  {
    icon: Sparkles,
    title: "IA Avançada",
    description: "Powered by DeepSeek para melhores resultados.",
    gradient: "from-accent-violet to-accent-pink",
  },
];

const packs = [
  {
    name: "Pacote Inicial",
    price: "R$ 10",
    totalCredits: 5,
    bonusCredits: 0,
    features: [
      "5 moedas",
      "Acesso a todas as funcionalidades",
    ],
    popular: false,
  },
  {
    name: "Pacote Plus",
    price: "R$ 30",
    totalCredits: 20,
    bonusCredits: 5,
    features: [
      "15 moedas + 5 bônus",
      "Total de 20 moedas",
      "Acesso a todas as funcionalidades",
    ],
    popular: true,
  },
  {
    name: "Pacote Pro",
    price: "R$ 50",
    totalCredits: 40,
    bonusCredits: 15,
    features: [
      "25 moedas + 15 bônus",
      "Total de 40 moedas",
      "Acesso a todas as funcionalidades",
    ],
    popular: false,
  },
];

const stats = [
  { value: "10k+", label: "Currículos analisados" },
  { value: "95%", label: "Satisfação dos usuários" },
  { value: "3x", label: "Mais entrevistas" },
  { value: "50+", label: "Empresas parceiras" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-dark-900 text-white overflow-hidden">
      <Navbar />

      {/* ========== HERO SECTION ========== */}
      <section className="relative min-h-[90vh] flex items-center noise-overlay">
        {/* Background effects */}
        <div className="absolute inset-0 bg-grid-pattern opacity-60" />
        <div className="orb w-[700px] h-[700px] bg-primary-600 -top-[200px] -left-[200px] animate-pulse-glow" />
        <div className="orb w-[500px] h-[500px] bg-accent-violet -bottom-[150px] -right-[150px] animate-pulse-glow animation-delay-500" />
        <div className="orb w-[300px] h-[300px] bg-accent-cyan top-[40%] left-[60%] animate-pulse-glow animation-delay-300" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-32 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Content */}
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-8 bg-white/5 border border-white/10 backdrop-blur-sm animate-fade-in-up">
                <Sparkles className="w-4 h-4 text-primary-400" />
                <span className="text-gray-300">Powered by DeepSeek AI</span>
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-heading font-bold tracking-tight leading-[1.1] animate-fade-in-up animation-delay-100">
                Transforme sua carreira com o poder da{" "}
                <span className="gradient-text">Inteligência Artificial</span>
              </h1>

              <p className="mt-6 text-lg sm:text-xl text-gray-400 leading-relaxed max-w-xl animate-fade-in-up animation-delay-200">
                Crie currículos profissionais, otimize seu LinkedIn e planeje sua
                carreira com IA de última geração.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row items-start gap-4 animate-fade-in-up animation-delay-300">
                <Link
                  href="/auth/register"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-violet text-white font-semibold rounded-xl transition-all duration-300 btn-glow"
                >
                  Começar agora — é grátis
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 px-8 py-4 text-gray-300 font-semibold rounded-xl border border-white/10 hover:bg-white/5 hover:border-white/20 transition-all duration-300"
                >
                  Como funciona
                </a>
              </div>
            </div>

            {/* Right: Dashboard Preview Mockup */}
            <div className="hidden lg:block animate-fade-in-up animation-delay-400">
              <div className="dashboard-preview">
                <div className="glass-card p-0 overflow-hidden">
                  {/* Window chrome */}
                  <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/5">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/70" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                      <div className="w-3 h-3 rounded-full bg-green-500/70" />
                    </div>
                    <div className="flex-1 flex justify-center">
                      <div className="px-4 py-1 rounded-lg bg-white/5 text-xs text-gray-500">
                        nextcv.app/dashboard
                      </div>
                    </div>
                  </div>

                  {/* Fake dashboard content */}
                  <div className="p-6 space-y-5">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-500">
                          Análise de Currículo
                        </div>
                        <div className="text-lg font-heading font-semibold text-white mt-0.5">
                          Resultado da análise
                        </div>
                      </div>
                      {/* Score Circle */}
                      <div className="relative w-20 h-20">
                        <svg
                          className="w-20 h-20 -rotate-90"
                          viewBox="0 0 80 80"
                        >
                          <circle
                            cx="40"
                            cy="40"
                            r="34"
                            fill="none"
                            stroke="rgba(255,255,255,0.06)"
                            strokeWidth="6"
                          />
                          <circle
                            cx="40"
                            cy="40"
                            r="34"
                            fill="none"
                            stroke="url(#scoreGradient)"
                            strokeWidth="6"
                            strokeLinecap="round"
                            strokeDasharray={`${(92 / 100) * 213.6} 213.6`}
                          />
                          <defs>
                            <linearGradient
                              id="scoreGradient"
                              x1="0%"
                              y1="0%"
                              x2="100%"
                              y2="0%"
                            >
                              <stop offset="0%" stopColor="#3b82f6" />
                              <stop offset="100%" stopColor="#8b5cf6" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xl font-heading font-bold text-white">
                            92
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Analysis bars */}
                    <div className="space-y-3">
                      {[
                        {
                          label: "Estrutura",
                          value: 95,
                          color: "from-primary-500 to-accent-cyan",
                        },
                        {
                          label: "Conteúdo",
                          value: 88,
                          color: "from-accent-violet to-accent-pink",
                        },
                        {
                          label: "Linguagem",
                          value: 90,
                          color: "from-accent-cyan to-primary-500",
                        },
                      ].map((bar) => (
                        <div key={bar.label}>
                          <div className="flex justify-between text-xs mb-1.5">
                            <span className="text-gray-400">{bar.label}</span>
                            <span className="text-gray-300 font-medium">
                              {bar.value}%
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                            <div
                              className={`h-full rounded-full bg-gradient-to-r ${bar.color}`}
                              style={{ width: `${bar.value}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {[
                        "ATS Otimizado",
                        "5 melhorias",
                        "Score A+",
                      ].map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 rounded-lg bg-primary-500/10 border border-primary-500/20 text-xs text-primary-300 font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="absolute bottom-0 left-0 right-0 z-10 glass border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/5">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="py-5 px-4 text-center"
                >
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

      {/* ========== FEATURES SECTION ========== */}
      <section
        id="features"
        className="relative py-28 bg-dark-800 noise-overlay"
      >
        <div className="absolute inset-0 bg-radial-blue" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium bg-primary-500/10 border border-primary-500/20 text-primary-400 mb-6">
              Funcionalidades
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold">
              Tudo que você precisa para{" "}
              <span className="gradient-text">sua carreira</span>
            </h2>
            <p className="mt-5 text-lg text-gray-400">
              Ferramentas poderosas alimentadas por IA para cada etapa da sua
              jornada profissional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className={`glass-card p-7 group cursor-default animate-fade-in-up animation-delay-${(i + 1) * 100}`}
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 icon-glow`}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-heading font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== HOW IT WORKS ========== */}
      <section id="how-it-works" className="relative py-28 bg-dark-900">
        <div className="orb w-[400px] h-[400px] bg-accent-violet top-0 right-0 animate-pulse-glow" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium bg-accent-violet/10 border border-accent-violet/20 text-accent-violet mb-6">
              Simples e rápido
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold">
              Como <span className="gradient-text">funciona</span>
            </h2>
            <p className="mt-5 text-lg text-gray-400">
              Três passos simples para transformar sua carreira.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-[60px] left-[16.66%] right-[16.66%] h-[2px]">
              <div className="w-full h-full bg-gradient-to-r from-primary-500/50 via-accent-violet/50 to-accent-cyan/50" />
            </div>

            {steps.map((step) => (
              <div key={step.step} className="relative text-center">
                {/* Step number */}
                <div className="relative inline-flex mb-6">
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
                <p className="text-gray-400 max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== AI SHOWCASE SECTION ========== */}
      <section className="relative py-24 bg-dark-800 overflow-hidden">
        <div className="absolute inset-0 bg-radial-violet" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: SVG Neural Network Illustration */}
            <div className="relative">
              <svg
                viewBox="0 0 500 400"
                className="w-full h-auto"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient
                    id="grad1"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8" />
                  </linearGradient>
                  <linearGradient
                    id="grad2"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
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

                {/* Connection lines */}
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

                {/* Input layer nodes */}
                <g filter="url(#glow1)">
                  <circle cx="80" cy="100" r="12" fill="url(#grad2)" />
                  <circle cx="80" cy="200" r="12" fill="url(#grad2)" />
                  <circle cx="80" cy="300" r="12" fill="url(#grad2)" />
                </g>

                {/* Hidden layer 1 */}
                <g filter="url(#glow1)">
                  <circle cx="200" cy="80" r="10" fill="url(#grad1)" />
                  <circle cx="200" cy="160" r="14" fill="url(#grad1)" />
                  <circle cx="200" cy="240" r="10" fill="url(#grad1)" />
                  <circle cx="200" cy="320" r="8" fill="url(#grad1)" />
                </g>

                {/* Hidden layer 2 */}
                <g filter="url(#glow1)">
                  <circle cx="320" cy="120" r="11" fill="url(#grad1)" />
                  <circle cx="320" cy="200" r="16" fill="url(#grad1)" />
                  <circle cx="320" cy="280" r="11" fill="url(#grad1)" />
                </g>

                {/* Output node */}
                <g filter="url(#glow2)">
                  <circle cx="430" cy="200" r="22" fill="url(#grad1)" />
                  <text
                    x="430"
                    y="205"
                    textAnchor="middle"
                    fill="white"
                    fontSize="14"
                    fontWeight="bold"
                    fontFamily="system-ui"
                  >
                    AI
                  </text>
                </g>

                {/* Decorative labels */}
                <text x="80" y="65" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="system-ui">Dados</text>
                <text x="200" y="45" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="system-ui">Análise</text>
                <text x="320" y="85" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="system-ui">Padrões</text>
                <text x="430" y="165" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="system-ui">Resultado</text>

                {/* Floating particles */}
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

            {/* Right: Content */}
            <div>
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

              {/* Feature cards */}
              <div className="space-y-4">
                {[
                  {
                    icon: Check,
                    color: "bg-green-500/20 text-green-400",
                    title: "ATS Compatível",
                    desc: "Otimização para sistemas de triagem automática",
                  },
                  {
                    icon: TrendingUp,
                    color: "bg-primary-500/20 text-primary-400",
                    title: "+45% Mais Entrevistas",
                    desc: "Usuários reportam aumento significativo em callbacks",
                  },
                  {
                    icon: Star,
                    color: "bg-accent-violet/20 text-accent-violet",
                    title: "Score Inteligente",
                    desc: "Pontuação detalhada com análise de 50+ critérios",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex items-center gap-4 glass-card p-4"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0`}
                    >
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">
                        {item.title}
                      </div>
                      <div className="text-xs text-gray-500">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== BENEFITS SECTION ========== */}
      <section className="relative py-28 bg-dark-900">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold">
              Por que escolher o{" "}
              <span className="gradient-text">NextCV?</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="gradient-border glass-card text-center p-7 group"
              >
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${benefit.gradient} flex items-center justify-center mx-auto mb-5`}
                >
                  <benefit.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-heading font-semibold text-white mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-gray-400">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== PRICING SECTION ========== */}
      <section id="pricing" className="relative py-28 bg-dark-800 noise-overlay">
        <div className="absolute inset-0 bg-radial-blue" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan mb-6">
              Pacotes de Moedas
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold">
              Invista na sua <span className="gradient-text">carreira</span>
            </h2>
            <p className="mt-5 text-lg text-gray-400">
              Compra única, sem assinatura. Escolha o pacote ideal para suas necessidades.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
            {packs.map((pack) => (
              <div
                key={pack.name}
                className={`relative rounded-2xl p-8 transition-all duration-300 flex flex-col ${
                  pack.popular
                    ? "gradient-border pricing-popular glass-card md:scale-105"
                    : "glass-card"
                }`}
              >
                {pack.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <span className="px-5 py-1.5 bg-gradient-to-r from-primary-500 to-accent-violet text-white text-xs font-bold rounded-full glow-blue">
                      MAIS POPULAR
                    </span>
                  </div>
                )}

                <h3 className="text-lg font-heading font-semibold text-white">
                  {pack.name}
                </h3>

                <div className="mt-5 flex items-baseline gap-1">
                  <span className="text-5xl font-heading font-bold gradient-text">
                    {pack.price}
                  </span>
                  <span className="text-sm text-gray-500">único</span>
                </div>

                <p className="mt-2 text-sm text-gray-500">
                  {pack.totalCredits} moedas{pack.bonusCredits > 0 ? ` (inclui +${pack.bonusCredits} bônus)` : ""}
                </p>

                <ul className="mt-8 space-y-3.5 flex-1">
                  {pack.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-3 text-sm"
                    >
                      <div className="w-5 h-5 rounded-full bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-primary-400" />
                      </div>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/auth/register"
                  className={`mt-8 block text-center py-3.5 px-6 rounded-xl font-semibold transition-all duration-300 ${
                    pack.popular
                      ? "bg-gradient-to-r from-primary-600 to-accent-violet text-white btn-glow"
                      : "bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20"
                  }`}
                >
                  Começar agora
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA SECTION ========== */}
      <section className="relative py-28 overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/50 via-dark-900 to-accent-violet/20" />
        <div className="absolute inset-0 bg-grid-pattern opacity-40" />
        <div className="orb w-[500px] h-[500px] bg-primary-600 top-[-100px] left-[20%] animate-pulse-glow" />
        <div className="orb w-[400px] h-[400px] bg-accent-violet bottom-[-100px] right-[20%] animate-pulse-glow animation-delay-500" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold">
            Pronto para transformar
            <br />
            <span className="gradient-text">sua carreira?</span>
          </h2>
          <p className="mt-6 text-lg text-gray-400 max-w-xl mx-auto">
            Junte-se a milhares de profissionais que já estão usando NextCV para
            alcançar seus objetivos.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-primary-600 to-accent-violet text-white font-bold rounded-xl transition-all duration-300 btn-glow text-lg"
            >
              Criar conta gratuita
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <p className="mt-5 text-sm text-gray-500">
            5 créditos grátis para começar. Sem cartão de crédito.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
