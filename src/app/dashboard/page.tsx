"use client";

import { useAuthContext } from "@/components/providers/AuthProvider";
import Card, { CardBody } from "@/components/ui/Card";
import Link from "next/link";
import {
  Coins,
  FileSearch,
  FilePlus,
  Target,
  ArrowRight,
  TrendingUp,
  Clock,
  ScrollText,
  Building2,
  BarChart2,
} from "lucide-react";

const quickActions = [
  {
    label: "Analisar Curriculo",
    href: "/dashboard/resume-analysis",
    icon: FileSearch,
    color: "bg-primary-500/10 text-primary-400",
    description: "Envie e analise seu currículo",
  },
  {
    label: "Criar Curriculo",
    href: "/dashboard/create-resume",
    icon: FilePlus,
    color: "bg-emerald-500/10 text-emerald-400",
    description: "Crie do zero ou melhore",
  },
  {
    label: "Adaptar para Vaga",
    href: "/dashboard/adapt-resume",
    icon: Target,
    color: "bg-orange-500/10 text-orange-400",
    description: "Adapte para uma vaga especifica",
  },
  {
    label: "Carta de Apresentação",
    href: "/dashboard/cover-letter",
    icon: ScrollText,
    color: "bg-teal-500/10 text-teal-400",
    description: "Gere uma carta personalizada",
  },
  {
    label: "Análise de Empresa",
    href: "/dashboard/company-analysis",
    icon: Building2,
    color: "bg-sky-500/10 text-sky-400",
    description: "Pesquise antes da entrevista",
  },
  {
    label: "Mercado",
    href: "/dashboard/market",
    icon: BarChart2,
    color: "bg-primary-500/10 text-primary-400",
    description: "Carreiras e salários em alta",
  },
];

export default function DashboardPage() {
  const { user, userData } = useAuthContext();

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div>
        <h1 className="text-2xl font-bold text-white font-heading">
          Ola, {user?.displayName || "Usuario"}!
        </h1>
        <p className="text-gray-400 mt-1">O que voce gostaria de fazer hoje?</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center">
              <Coins className="w-6 h-6 text-primary-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Moedas</p>
              <p className="text-2xl font-bold text-white font-heading">{userData?.credits ?? 0}</p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="w-12 h-12 bg-violet-500/10 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-violet-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Analises</p>
              <p className="text-2xl font-bold text-white font-heading">0</p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Curriculos</p>
              <p className="text-2xl font-bold text-white font-heading">0</p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-lg font-semibold text-white font-heading mb-4">Acoes rapidas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <Card hover className="h-full">
                <CardBody className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${action.color}`}>
                    <action.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-white">{action.label}</h3>
                      <ArrowRight className="w-4 h-4 text-gray-500" />
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{action.description}</p>
                  </div>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Credits CTA */}
      {(userData?.credits ?? 0) <= 5 && (
        <div className="bg-gradient-to-r from-primary-600 to-accent-violet rounded-xl border border-white/[0.06] glow-blue">
          <div className="p-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white font-heading">Poucas moedas restantes</h3>
              <p className="text-gray-300 text-sm mt-1">
                Compre um pacote de moedas para continuar usando todas as funcionalidades.
              </p>
            </div>
            <Link
              href="/dashboard/plans"
              className="px-6 py-2.5 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/20 transition-colors flex-shrink-0 border border-white/20"
            >
              Ver pacotes
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
