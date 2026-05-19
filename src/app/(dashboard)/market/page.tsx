"use client";

import { useEffect, useState } from "react";
import { Timestamp } from "firebase/firestore";
import {
  TrendingUp,
  DollarSign,
  Zap,
  Lightbulb,
  RefreshCw,
  Clock,
  Sparkles,
  ArrowUpRight,
  AlertTriangle,
  Globe,
  BarChart2,
} from "lucide-react";
import {
  getStoredMarketData,
  isMarketDataStale,
  formatUpdatedAt,
} from "@/services/market-data";
import type { MarketData, MarketInsight } from "@/services/ai-market";
import { authedFetch } from "@/lib/api-client";

type Status = "loading" | "refreshing" | "ready" | "error";

function demandColor(level: string) {
  if (level === "Explosiva") return "bg-pink-500/10 text-pink-400 border border-pink-500/20";
  if (level === "Muito Alta") return "bg-orange-500/10 text-orange-400 border border-orange-500/20";
  return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
}

function insightStyle(type: MarketInsight["type"]) {
  if (type === "oportunidade") return { bar: "bg-emerald-500", icon: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" };
  if (type === "alerta") return { bar: "bg-amber-500", icon: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" };
  return { bar: "bg-primary-500", icon: "text-primary-400", bg: "bg-primary-500/10 border-primary-500/20" };
}

function insightIcon(type: MarketInsight["type"]) {
  if (type === "oportunidade") return <Sparkles className="w-4 h-4" />;
  if (type === "alerta") return <AlertTriangle className="w-4 h-4" />;
  return <Globe className="w-4 h-4" />;
}

function insightLabel(type: MarketInsight["type"]) {
  if (type === "oportunidade") return "Oportunidade";
  if (type === "alerta") return "Atenção";
  return "Tendência";
}

export default function MarketPage() {
  const [status, setStatus] = useState<Status>("loading");
  const [data, setData] = useState<MarketData | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Timestamp | null>(null);

  const refresh = async () => {
    setStatus("refreshing");
    try {
      const res = await authedFetch("/api/refresh-market-data", { method: "POST" });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      const stored = await getStoredMarketData();
      if (stored) {
        const { updatedAt: ts, ...rest } = stored;
        setData(rest as MarketData);
        setUpdatedAt(ts);
      } else {
        setData(json.data);
      }
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  };

  useEffect(() => {
    async function load() {
      try {
        const stored = await getStoredMarketData();
        if (!stored || isMarketDataStale(stored.updatedAt)) {
          await refresh();
          return;
        }
        const { updatedAt: ts, ...rest } = stored;
        setData(rest as MarketData);
        setUpdatedAt(ts);
        setStatus("ready");
      } catch {
        await refresh();
      }
    }
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <section className="relative overflow-hidden rounded-3xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-xl">
        <div className="absolute -top-24 -left-16 w-80 h-80 bg-primary-500/20 rounded-full blur-[120px] animate-pulse-glow pointer-events-none" />
        <div
          className="absolute -bottom-32 -right-10 w-96 h-96 bg-accent-violet/20 rounded-full blur-[140px] animate-pulse-glow pointer-events-none"
          style={{ animationDelay: "1.5s" }}
        />
        <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
        <div className="relative p-8 md:p-12 animate-fade-in-up">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-xs font-medium text-primary-300 mb-4">
                <BarChart2 className="w-3 h-3" />
                Mercado de Trabalho
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white font-heading leading-[1.1] tracking-tight">
                Carreiras e salários em{" "}
                <span className="gradient-text">alta</span>
              </h1>
              <p className="text-gray-400 mt-4 text-base md:text-lg max-w-xl leading-relaxed">
                Tendências, salários e oportunidades do mercado brasileiro, atualizadas automaticamente pela IA.
              </p>
              {updatedAt && (
                <p className="flex items-center gap-1.5 text-xs text-gray-500 mt-3">
                  <Clock className="w-3.5 h-3.5" />
                  Atualizado em {formatUpdatedAt(updatedAt)} · próxima atualização em 30 dias
                </p>
              )}
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 text-xs rounded-lg border border-emerald-500/20 flex-shrink-0 self-start mt-1">
              Gratuito
            </span>
          </div>
        </div>
      </section>

      {/* Loading / Refreshing */}
      {(status === "loading" || status === "refreshing") && (
        <div className="relative bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] py-16 flex flex-col items-center gap-4 animate-fade-in-up animation-delay-200">
          <div className="w-12 h-12 rounded-full border-2 border-primary-500/30 border-t-primary-400 animate-spin" />
          <div className="text-center">
            <p className="text-white font-semibold">
              {status === "loading" ? "Carregando dados de mercado..." : "Atualizando dados de mercado..."}
            </p>
            <p className="text-gray-500 text-sm mt-1">
              {status === "refreshing" && "A IA está analisando as tendências atuais. Aguarde..."}
            </p>
          </div>
        </div>
      )}

      {/* Error */}
      {status === "error" && (
        <div className="relative bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] py-12 flex flex-col items-center gap-4 animate-fade-in-up animation-delay-200">
          <AlertTriangle className="w-10 h-10 text-amber-400" />
          <p className="text-white font-semibold">Não foi possível carregar os dados.</p>
          <button
            onClick={refresh}
            className="flex items-center gap-2 px-4 py-2 bg-primary-500/10 text-primary-400 rounded-lg hover:bg-primary-500/20 transition-colors text-sm glow-blue"
          >
            <RefreshCw className="w-4 h-4" /> Tentar novamente
          </button>
        </div>
      )}

      {/* Content */}
      {status === "ready" && data && (
        <div className="space-y-8">

          {/* Carreiras em Alta */}
          <section className="animate-fade-in-up animation-delay-200">
            <h2 className="text-lg font-semibold font-heading text-white flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-accent-violet flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              Carreiras em Alta
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.trendingCareers.map((career, i) => (
                <div key={i} className="relative group bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] p-5 overflow-hidden hover:border-primary-500/30 hover:-translate-y-0.5 transition-all duration-300">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-500/10 group-hover:bg-primary-500/20 rounded-full blur-3xl transition-all duration-500 pointer-events-none" />
                  <div className="relative space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-white text-sm leading-snug">{career.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{career.area}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-md flex-shrink-0 ${demandColor(career.demandLevel)}`}>
                        {career.demandLevel}
                      </span>
                    </div>

                    <p className="text-xs text-gray-400 leading-relaxed">{career.description}</p>

                    <div className="flex items-center justify-between pt-1 border-t border-white/[0.06]">
                      <div>
                        <p className="text-xs text-gray-500">Salário médio</p>
                        <p className="text-sm font-bold text-emerald-400">{career.avgSalary}</p>
                      </div>
                      <div className="flex items-center gap-1 text-emerald-400 text-sm font-semibold">
                        <ArrowUpRight className="w-4 h-4" />
                        {career.growth}
                      </div>
                    </div>

                    {career.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {career.skills.map((s, j) => (
                          <span key={j} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-md text-xs text-gray-400">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Maiores Salários + Habilidades */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up animation-delay-300">

            {/* Maiores Salários */}
            <div>
              <h2 className="text-lg font-semibold font-heading text-white flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-white" />
                </div>
                Maiores Salários
              </h2>
              <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] divide-y divide-white/[0.06] overflow-hidden">
                {data.highestPaid.map((career, i) => (
                  <div key={i} className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors">
                    <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500/20 to-accent-violet/20 border border-primary-500/20 flex items-center justify-center text-xs font-bold text-primary-300 flex-shrink-0">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{career.title}</p>
                      <p className="text-xs text-gray-500">{career.area}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-emerald-400">{career.seniorSalary}</p>
                      <p className="text-xs text-gray-500">média {career.avgSalary}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Habilidades em Alta */}
            <div>
              <h2 className="text-lg font-semibold font-heading text-white flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                Habilidades Mais Pedidas
              </h2>
              <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] p-5">
                <div className="flex flex-wrap gap-2">
                  {data.hotSkills.map((skill, i) => {
                    const highlight = i < 4;
                    return (
                      <span
                        key={i}
                        className={`px-3 py-1.5 rounded-lg text-sm border ${
                          highlight
                            ? "bg-primary-500/10 text-primary-300 border-primary-500/20 font-semibold"
                            : "bg-white/5 text-gray-300 border-white/10"
                        }`}
                      >
                        {highlight && <span className="mr-1.5 text-primary-400">🔥</span>}
                        {skill}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Insights */}
          <section className="animate-fade-in-up animation-delay-400">
            <h2 className="text-lg font-semibold font-heading text-white flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center">
                <Lightbulb className="w-4 h-4 text-white" />
              </div>
              Insights do Mercado
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.insights.map((insight, i) => {
                const style = insightStyle(insight.type);
                return (
                  <div key={i} className="relative group bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] p-5 overflow-hidden hover:border-white/[0.12] hover:-translate-y-0.5 transition-all duration-300">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 group-hover:bg-white/[0.07] rounded-full blur-3xl transition-all duration-500 pointer-events-none" />
                    <div className="relative space-y-2">
                      <div className="flex items-center gap-2">
                        <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs border ${style.bg} ${style.icon}`}>
                          {insightIcon(insight.type)}
                          {insightLabel(insight.type)}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-white leading-snug">{insight.title}</p>
                      <p className="text-xs text-gray-400 leading-relaxed">{insight.description}</p>
                      <div className={`h-0.5 w-8 rounded-full ${style.bar}`} />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Áreas Emergentes */}
          <section className="animate-fade-in-up animation-delay-500">
            <h2 className="text-lg font-semibold font-heading text-white flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              Áreas Emergentes
            </h2>
            <div className="flex flex-wrap gap-3">
              {data.emergingAreas.map((area, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 px-4 py-2.5 bg-violet-500/10 border border-violet-500/20 rounded-xl hover:bg-violet-500/15 hover:border-violet-500/30 transition-all duration-200"
                >
                  <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                  <span className="text-sm text-violet-300 font-medium">{area}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Footer disclaimer */}
          <div className="flex items-start gap-2.5 px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl">
            <Clock className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-gray-500 leading-relaxed">
              Dados gerados por IA com base em tendências públicas do mercado brasileiro. Atualizados automaticamente a cada 30 dias. Consulte fontes como CAGED, Glassdoor e LinkedIn para dados em tempo real.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
