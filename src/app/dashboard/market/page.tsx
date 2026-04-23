"use client";

import { useEffect, useState } from "react";
import { Timestamp } from "firebase/firestore";
import Card, { CardBody, CardHeader } from "@/components/ui/Card";
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
} from "lucide-react";
import {
  getStoredMarketData,
  isMarketDataStale,
  formatUpdatedAt,
} from "@/services/market-data";
import type { MarketData, MarketInsight } from "@/services/ai-market";

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
      const res = await fetch("/api/refresh-market-data", { method: "POST" });
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white flex items-center gap-3">
            <TrendingUp className="w-7 h-7 text-primary-400" />
            Mercado de Trabalho
          </h1>
          <p className="text-gray-400 mt-1">Tendências, salários e oportunidades do mercado brasileiro.</p>
          {updatedAt && (
            <p className="flex items-center gap-1.5 text-xs text-gray-500 mt-2">
              <Clock className="w-3.5 h-3.5" />
              Atualizado em {formatUpdatedAt(updatedAt)} · próxima atualização em 30 dias
            </p>
          )}
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 text-xs rounded-lg border border-emerald-500/20 flex-shrink-0">
          Gratuito
        </span>
      </div>

      {/* Loading / Refreshing */}
      {(status === "loading" || status === "refreshing") && (
        <Card>
          <CardBody className="py-16 flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-2 border-primary-500/30 border-t-primary-400 animate-spin" />
            <div className="text-center">
              <p className="text-white font-semibold">
                {status === "loading" ? "Carregando dados de mercado..." : "Atualizando dados de mercado..."}
              </p>
              <p className="text-gray-500 text-sm mt-1">
                {status === "refreshing" && "A IA está analisando as tendências atuais. Aguarde..."}
              </p>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Error */}
      {status === "error" && (
        <Card>
          <CardBody className="py-12 flex flex-col items-center gap-4">
            <AlertTriangle className="w-10 h-10 text-amber-400" />
            <p className="text-white font-semibold">Não foi possível carregar os dados.</p>
            <button
              onClick={refresh}
              className="flex items-center gap-2 px-4 py-2 bg-primary-500/10 text-primary-400 rounded-lg hover:bg-primary-500/20 transition-colors text-sm"
            >
              <RefreshCw className="w-4 h-4" /> Tentar novamente
            </button>
          </CardBody>
        </Card>
      )}

      {/* Content */}
      {status === "ready" && data && (
        <div className="space-y-6">

          {/* Carreiras em Alta */}
          <div>
            <h2 className="text-lg font-semibold font-heading text-white flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary-400" />
              Carreiras em Alta
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {data.trendingCareers.map((career, i) => (
                <Card key={i}>
                  <CardBody className="space-y-3">
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
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>

          {/* Maiores Salários + Habilidades */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Maiores Salários */}
            <div>
              <h2 className="text-lg font-semibold font-heading text-white flex items-center gap-2 mb-4">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                Maiores Salários
              </h2>
              <Card>
                <CardBody className="divide-y divide-white/[0.06] p-0">
                  {data.highestPaid.map((career, i) => (
                    <div key={i} className="flex items-center gap-4 px-5 py-4">
                      <span className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-gray-400 flex-shrink-0">
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
                </CardBody>
              </Card>
            </div>

            {/* Habilidades em Alta */}
            <div>
              <h2 className="text-lg font-semibold font-heading text-white flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-yellow-400" />
                Habilidades Mais Pedidas
              </h2>
              <Card>
                <CardBody>
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
                </CardBody>
              </Card>
            </div>
          </div>

          {/* Insights */}
          <div>
            <h2 className="text-lg font-semibold font-heading text-white flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-yellow-400" />
              Insights do Mercado
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {data.insights.map((insight, i) => {
                const style = insightStyle(insight.type);
                return (
                  <Card key={i}>
                    <CardBody className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs border ${style.bg} ${style.icon}`}>
                          {insightIcon(insight.type)}
                          {insightLabel(insight.type)}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-white leading-snug">{insight.title}</p>
                      <p className="text-xs text-gray-400 leading-relaxed">{insight.description}</p>
                      <div className={`h-0.5 w-8 rounded-full ${style.bar}`} />
                    </CardBody>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Áreas Emergentes */}
          <div>
            <h2 className="text-lg font-semibold font-heading text-white flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-violet-400" />
              Áreas Emergentes
            </h2>
            <div className="flex flex-wrap gap-3">
              {data.emergingAreas.map((area, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 px-4 py-2.5 bg-violet-500/10 border border-violet-500/20 rounded-xl"
                >
                  <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                  <span className="text-sm text-violet-300 font-medium">{area}</span>
                </div>
              ))}
            </div>
          </div>

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
