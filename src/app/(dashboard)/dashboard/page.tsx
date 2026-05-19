"use client";

import { useEffect, useState } from "react";
import { useAuthContext } from "@/components/providers/AuthProvider";
import Link from "next/link";
import { listSavedItems } from "@/services/saved-items";
import {
  Coins,
  FileSearch,
  FilePlus,
  Target,
  ArrowRight,
  TrendingUp,
  ScrollText,
  Building2,
  BarChart2,
  FolderOpen,
  MessageSquareHeart,
  Briefcase,
  Sparkles,
  Zap,
  type LucideIcon,
} from "lucide-react";

type Action = {
  label: string;
  href: string;
  icon: LucideIcon;
  iconBg: string;
  gradient: string;
  description: string;
};

const featuredActions: Action[] = [
  {
    label: "Analisar Currículo",
    href: "/resume-analysis",
    icon: FileSearch,
    iconBg: "bg-primary-500/10 text-primary-400",
    gradient: "from-primary-500 to-accent-violet",
    description: "Receba feedback detalhado da IA",
  },
  {
    label: "Criar Currículo",
    href: "/create-resume",
    icon: FilePlus,
    iconBg: "bg-emerald-500/10 text-emerald-400",
    gradient: "from-emerald-500 to-teal-500",
    description: "Comece do zero ou parta de um modelo",
  },
  {
    label: "Adaptar para Vaga",
    href: "/adapt-resume",
    icon: Target,
    iconBg: "bg-orange-500/10 text-orange-400",
    gradient: "from-orange-500 to-amber-500",
    description: "Customize para uma vaga específica",
  },
];

const otherActions: Action[] = [
  {
    label: "Carta de Apresentação",
    href: "/cover-letter",
    icon: ScrollText,
    iconBg: "bg-teal-500/10 text-teal-400",
    gradient: "from-teal-500 to-cyan-500",
    description: "Gere cartas personalizadas",
  },
  {
    label: "Vagas",
    href: "/jobs",
    icon: Briefcase,
    iconBg: "bg-amber-500/10 text-amber-400",
    gradient: "from-amber-500 to-yellow-500",
    description: "Vagas reais da web em até 30 dias",
  },
  {
    label: "Análise de Empresa",
    href: "/company-analysis",
    icon: Building2,
    iconBg: "bg-sky-500/10 text-sky-400",
    gradient: "from-sky-500 to-blue-500",
    description: "Pesquise antes da entrevista",
  },
  {
    label: "Mercado",
    href: "/market",
    icon: BarChart2,
    iconBg: "bg-violet-500/10 text-violet-400",
    gradient: "from-violet-500 to-purple-500",
    description: "Carreiras e salários em alta",
  },
  {
    label: "Meus Arquivos",
    href: "/my-files",
    icon: FolderOpen,
    iconBg: "bg-pink-500/10 text-pink-400",
    gradient: "from-pink-500 to-rose-500",
    description: "Documentos gerados em até 10h",
  },
  {
    label: "Nos ajude a melhorar",
    href: "/feedback",
    icon: MessageSquareHeart,
    iconBg: "bg-rose-500/10 text-rose-400",
    gradient: "from-rose-500 to-pink-500",
    description: "Envie sua avaliação e sugestões",
  },
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

export default function DashboardPage() {
  const { user, userData } = useAuthContext();
  const [savedCounts, setSavedCounts] = useState({ analyses: 0, resumes: 0 });
  const [greeting, setGreeting] = useState("Olá");

  useEffect(() => {
    setGreeting(getGreeting());
  }, []);

  useEffect(() => {
    if (!user) return;
    listSavedItems(user.uid)
      .then((items) => {
        setSavedCounts({
          analyses: items.filter(
            (i) => i.type === "resume-analysis" || i.type === "company-analysis"
          ).length,
          resumes: items.filter((i) => i.type === "resume").length,
        });
      })
      .catch(() => {});
  }, [user]);

  const firstName = (user?.displayName || "Profissional").split(" ")[0];
  const credits = userData?.credits ?? 0;

  return (
    <div className="relative space-y-10 pb-8">
      {/* Hero Header */}
      <section className="relative overflow-hidden rounded-3xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-xl">
        <div className="absolute -top-24 -left-16 w-80 h-80 bg-primary-500/20 rounded-full blur-[120px] animate-pulse-glow pointer-events-none" />
        <div
          className="absolute -bottom-32 -right-10 w-96 h-96 bg-accent-violet/20 rounded-full blur-[140px] animate-pulse-glow pointer-events-none"
          style={{ animationDelay: "1.5s" }}
        />
        <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

        <div className="relative p-8 md:p-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-xs font-medium text-primary-300 mb-4">
            <Sparkles className="w-3 h-3" />
            {greeting}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white font-heading leading-[1.1] tracking-tight">
            Pronto pra acelerar,{" "}
            <span className="gradient-text">{firstName}</span>?
          </h1>
          <p className="text-gray-400 mt-4 text-base md:text-lg max-w-xl leading-relaxed">
            Escolha uma ferramenta abaixo e dê o próximo passo na sua carreira com inteligência artificial.
          </p>
        </div>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in-up animation-delay-200">
        <StatCard
          label="Moedas disponíveis"
          value={credits}
          icon={Coins}
          gradient="from-primary-500 to-accent-violet"
          accent="primary"
        />
        <StatCard
          label="Análises salvas"
          value={savedCounts.analyses}
          icon={TrendingUp}
          gradient="from-violet-500 to-pink-500"
          accent="violet"
          href="/my-files"
        />
        <StatCard
          label="Currículos salvos"
          value={savedCounts.resumes}
          icon={FilePlus}
          gradient="from-orange-500 to-amber-500"
          accent="orange"
          href="/my-files"
        />
      </div>

      {/* Featured Actions */}
      <section className="animate-fade-in-up animation-delay-300">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-white font-heading flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary-400" />
            Suas ferramentas principais
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            As funções mais usadas pelos profissionais Karreify
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featuredActions.map((action) => (
            <FeaturedActionCard key={action.href} action={action} />
          ))}
        </div>
      </section>

      {/* Other Actions */}
      <section className="animate-fade-in-up animation-delay-400">
        <h2 className="text-xl font-bold text-white font-heading mb-5">
          Explore mais
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {otherActions.map((action) => (
            <ActionCard key={action.href} action={action} />
          ))}
        </div>
      </section>

    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  gradient,
  accent,
  href,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  gradient: string;
  accent: "primary" | "violet" | "orange";
  href?: string;
}) {
  const borderClass = {
    primary: "hover:border-primary-500/30",
    violet: "hover:border-violet-500/30",
    orange: "hover:border-orange-500/30",
  }[accent];

  const orbClass = {
    primary: "bg-primary-500/10 group-hover:bg-primary-500/20",
    violet: "bg-violet-500/10 group-hover:bg-violet-500/20",
    orange: "bg-orange-500/10 group-hover:bg-orange-500/20",
  }[accent];

  const content = (
    <div
      className={`relative group bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] p-5 overflow-hidden transition-all duration-300 hover:-translate-y-0.5 ${borderClass} ${
        href ? "cursor-pointer" : ""
      }`}
    >
      <div
        className={`absolute -top-10 -right-10 w-32 h-32 ${orbClass} rounded-full blur-3xl transition-all duration-500 pointer-events-none`}
      />
      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
            {label}
          </p>
          <p className="text-3xl font-bold text-white font-heading">{value}</p>
        </div>
        <div
          className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-lg shadow-black/20 group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}

function FeaturedActionCard({ action }: { action: Action }) {
  return (
    <Link href={action.href} className="group block h-full">
      <div className="relative h-full bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] p-6 overflow-hidden transition-all duration-300 hover:border-white/[0.15] hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/30">
        <div
          className={`absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-[0.18] transition-opacity duration-500 rounded-full blur-3xl pointer-events-none`}
        />

        <div className="relative flex flex-col h-full">
          <div
            className={`inline-flex w-14 h-14 rounded-2xl items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 bg-gradient-to-br ${action.gradient} shadow-lg shadow-black/20`}
          >
            <action.icon className="w-7 h-7 text-white" />
          </div>

          <h3 className="font-bold text-white text-lg font-heading mb-1.5">
            {action.label}
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed flex-1">
            {action.description}
          </p>

          <div className="flex items-center gap-2 mt-5 text-sm font-medium text-primary-400 group-hover:text-primary-300 transition-colors">
            Começar agora
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </div>
      </div>
    </Link>
  );
}

function ActionCard({ action }: { action: Action }) {
  return (
    <Link href={action.href} className="group block h-full">
      <div className="relative h-full bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] p-5 overflow-hidden transition-all duration-300 hover:border-white/[0.15] hover:-translate-y-0.5 hover:bg-white/[0.05]">
        <div
          className={`absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-full blur-3xl pointer-events-none`}
        />

        <div className="relative flex items-start gap-4">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 ${action.iconBg}`}
          >
            <action.icon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-semibold text-white text-sm">
                {action.label}
              </h3>
              <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-primary-400 group-hover:translate-x-0.5 transition-all duration-300 flex-shrink-0" />
            </div>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              {action.description}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
