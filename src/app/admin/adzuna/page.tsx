"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { adminFetch } from "@/services/admin";
import {
  Activity,
  AlertTriangle,
  Database,
  Gauge,
  RefreshCw,
  Search,
  TrendingUp,
  Zap,
  Shuffle,
} from "lucide-react";

type JobProvider = "adzuna" | "jooble";

interface BucketStats {
  apiCalls: number;
  apiErrors: number;
  cacheHits: number;
  billable: number;
}

interface ProviderStats {
  apiCalls: number;
  apiErrors: number;
  billable: number;
}

interface AdzunaUsageData {
  limits: {
    perMinute: number;
    perDay: number;
    perWeek: number;
    perMonth: number;
  };
  threshold: number;
  adzunaDisabled: boolean;
  counts: {
    lastMinute: BucketStats;
    daily: BucketStats;
    weekly: BucketStats;
    monthly: BucketStats;
  };
  jooble: ProviderStats;
  topQueries: { keyword: string; count: number }[];
  recentCalls: {
    ts: string;
    status: "cache_hit" | "api_call" | "api_error";
    provider: JobProvider;
    keyword: string;
    uf: string;
    city: string;
    period: string;
    page: number;
    httpStatus: number | null;
    durationMs: number | null;
  }[];
  cacheHitRate: number;
  avgLatencyMs: number;
  generatedAt: string;
}

const QUOTA_CARDS: {
  key: "lastMinute" | "daily" | "weekly" | "monthly";
  limitKey: "perMinute" | "perDay" | "perWeek" | "perMonth";
  label: string;
  window: string;
}[] = [
  { key: "lastMinute", limitKey: "perMinute", label: "Último minuto", window: "60s" },
  { key: "daily",      limitKey: "perDay",    label: "Hoje",          window: "24h" },
  { key: "weekly",     limitKey: "perWeek",   label: "Semana",        window: "7 dias" },
  { key: "monthly",    limitKey: "perMonth",  label: "Mês",           window: "30 dias" },
];

function pctTone(pct: number): {
  bar: string;
  text: string;
  bg: string;
  border: string;
} {
  if (pct >= 85) {
    return {
      bar: "from-red-500 to-red-400",
      text: "text-red-300",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
    };
  }
  if (pct >= 60) {
    return {
      bar: "from-amber-500 to-amber-400",
      text: "text-amber-300",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    };
  }
  return {
    bar: "from-emerald-500 to-emerald-400",
    text: "text-emerald-300",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  };
}

function statusPill(
  status: "cache_hit" | "api_call" | "api_error",
  provider: JobProvider
) {
  if (status === "cache_hit") {
    return {
      label: "Cache",
      className: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
    };
  }
  if (status === "api_call") {
    return provider === "jooble"
      ? {
          label: "Jooble",
          className: "bg-violet-500/10 text-violet-300 border-violet-500/20",
        }
      : {
          label: "Adzuna",
          className: "bg-blue-500/10 text-blue-300 border-blue-500/20",
        };
  }
  return provider === "jooble"
    ? {
        label: "Erro Jooble",
        className: "bg-red-500/10 text-red-300 border-red-500/20",
      }
    : {
        label: "Erro Adzuna",
        className: "bg-red-500/10 text-red-300 border-red-500/20",
      };
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function AdminAdzunaPage() {
  const [data, setData] = useState<AdzunaUsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (silent = false) => {
    if (silent) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const res = await adminFetch("/api/admin/adzuna-usage");
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Erro ao buscar dados.");
      }
      setData(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const cacheHitRatePct = useMemo(() => {
    if (!data) return 0;
    return Math.round(data.cacheHitRate * 100);
  }, [data]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white flex items-center gap-3">
            <Activity className="w-7 h-7 text-blue-400" />
            Consumo de vagas
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
            Adzuna (primário) + Jooble (fallback acima de{" "}
            {data?.threshold?.toLocaleString("pt-BR") ?? "—"} chamadas/mês).
          </p>
        </div>
        <button
          onClick={() => fetchData(true)}
          disabled={loading || refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-gray-300 hover:bg-white/[0.08] hover:text-white transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          Atualizar
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <div className="w-10 h-10 rounded-full border-2 border-primary-500/30 border-t-primary-400 animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-500/[0.05] border border-red-500/20 rounded-2xl p-6 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-white">Erro ao carregar dados</p>
            <p className="text-sm text-gray-400 mt-1">{error}</p>
          </div>
        </div>
      ) : !data ? (
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 text-center">
          <p className="text-gray-400">Sem dados disponíveis.</p>
        </div>
      ) : (
        <>
          {data.adzunaDisabled && (
            <div className="flex items-start gap-3 px-4 py-3 bg-amber-500/10 border border-amber-500/30 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm leading-relaxed">
                <p className="text-amber-200 font-semibold">
                  Adzuna desabilitado via ADZUNA_DISABLED=true
                </p>
                <p className="text-amber-200/80 text-xs mt-0.5">
                  Todas as buscas estão indo direto pra Jooble. Remova a flag
                  do .env.local pra reativar a Adzuna.
                </p>
              </div>
            </div>
          )}

          {/* Quota cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {QUOTA_CARDS.map((card) => {
              const bucket = data.counts[card.key];
              const limit = data.limits[card.limitKey];
              const used = bucket.billable;
              const pct = limit > 0 ? Math.min(100, (used / limit) * 100) : 0;
              const tone = pctTone(pct);
              return (
                <div
                  key={card.key}
                  className={`bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 backdrop-blur-sm`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="text-xs text-gray-500">{card.label}</p>
                      <p className="text-[10px] text-gray-600 uppercase tracking-wider mt-0.5">
                        {card.window}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${tone.bg} ${tone.text} ${tone.border}`}
                    >
                      {Math.round(pct)}%
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1.5 mb-2">
                    <span className="text-2xl font-bold text-white font-heading tabular-nums leading-none">
                      {used.toLocaleString("pt-BR")}
                    </span>
                    <span className="text-sm text-gray-500 tabular-nums">
                      / {limit.toLocaleString("pt-BR")}
                    </span>
                  </div>
                  <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${tone.bar} rounded-full transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-3 text-[10px]">
                    <div>
                      <p className="text-gray-600 uppercase tracking-wider">Cache</p>
                      <p className="text-emerald-300 font-semibold tabular-nums mt-0.5">
                        {bucket.cacheHits}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 uppercase tracking-wider">API</p>
                      <p className="text-blue-300 font-semibold tabular-nums mt-0.5">
                        {bucket.apiCalls}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 uppercase tracking-wider">Erros</p>
                      <p className="text-red-300 font-semibold tabular-nums mt-0.5">
                        {bucket.apiErrors}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Secondary stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatBlock
              icon={<Shuffle className="w-5 h-5 text-violet-400" />}
              label="Jooble no mês"
              value={data.jooble.billable.toLocaleString("pt-BR")}
              hint={`${data.jooble.apiCalls} chamadas · ${data.jooble.apiErrors} erros`}
              tone="violet"
            />
            <StatBlock
              icon={<Database className="w-5 h-5 text-emerald-400" />}
              label="Taxa de cache"
              value={`${cacheHitRatePct}%`}
              hint={`${data.counts.monthly.cacheHits.toLocaleString(
                "pt-BR"
              )} hits no mês`}
              tone="emerald"
            />
            <StatBlock
              icon={<Zap className="w-5 h-5 text-blue-400" />}
              label="Latência média"
              value={`${data.avgLatencyMs} ms`}
              hint="apenas chamadas reais à Adzuna"
              tone="blue"
            />
            <StatBlock
              icon={<AlertTriangle className="w-5 h-5 text-red-400" />}
              label="Erros Adzuna (30d)"
              value={data.counts.monthly.apiErrors.toLocaleString("pt-BR")}
              hint="HTTP 4xx/5xx da Adzuna"
              tone="red"
            />
          </div>

          {/* Top queries + Recent calls */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Top queries */}
            <div className="lg:col-span-2 bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
                <TrendingUp className="w-5 h-5 text-primary-400" />
                <h2 className="font-semibold font-heading text-white">
                  Buscas mais frequentes
                </h2>
              </div>
              <div className="p-5">
                {data.topQueries.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-6">
                    Nenhuma busca registrada nos últimos 30 dias.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {data.topQueries.map((q, idx) => {
                      const max = data.topQueries[0].count;
                      const pct = max > 0 ? (q.count / max) * 100 : 0;
                      return (
                        <div key={q.keyword}>
                          <div className="flex items-center justify-between text-sm mb-1.5 gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-[10px] font-bold text-gray-600 tabular-nums w-5">
                                {(idx + 1).toString().padStart(2, "0")}
                              </span>
                              <span className="text-gray-300 truncate">
                                {q.keyword}
                              </span>
                            </div>
                            <span className="text-gray-500 tabular-nums flex-shrink-0">
                              {q.count}
                            </span>
                          </div>
                          <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden ml-7">
                            <div
                              className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Recent calls */}
            <div className="lg:col-span-3 bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
                <Gauge className="w-5 h-5 text-primary-400" />
                <h2 className="font-semibold font-heading text-white">
                  Chamadas recentes
                </h2>
                <span className="text-xs text-gray-500 ml-auto">
                  últimas {data.recentCalls.length}
                </span>
              </div>
              {data.recentCalls.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-12">
                  Nenhuma chamada registrada ainda.
                </p>
              ) : (
                <div className="max-h-[480px] overflow-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-white/[0.02] sticky top-0 backdrop-blur-xl">
                      <tr className="text-gray-500">
                        <th className="text-left font-medium px-4 py-2.5">Hora</th>
                        <th className="text-left font-medium px-2 py-2.5">Tipo</th>
                        <th className="text-left font-medium px-2 py-2.5">Busca</th>
                        <th className="text-left font-medium px-2 py-2.5">Local</th>
                        <th className="text-right font-medium px-4 py-2.5">ms</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {data.recentCalls.map((call, idx) => {
                        const pill = statusPill(call.status, call.provider);
                        const local = [call.city, call.uf]
                          .filter(Boolean)
                          .join(", ");
                        return (
                          <tr key={idx} className="hover:bg-white/[0.02]">
                            <td className="px-4 py-2.5 text-gray-400 tabular-nums whitespace-nowrap">
                              {formatTime(call.ts)}
                            </td>
                            <td className="px-2 py-2.5">
                              <span
                                className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium border ${pill.className}`}
                              >
                                {pill.label}
                              </span>
                            </td>
                            <td className="px-2 py-2.5 text-gray-300 max-w-[180px] truncate">
                              {call.keyword || (
                                <span className="text-gray-600">—</span>
                              )}
                            </td>
                            <td className="px-2 py-2.5 text-gray-500 max-w-[140px] truncate">
                              {local || (
                                <span className="text-gray-600">—</span>
                              )}
                            </td>
                            <td className="px-4 py-2.5 text-right text-gray-500 tabular-nums">
                              {call.durationMs ?? "—"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-start gap-2.5 px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl">
            <Search className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-gray-500 leading-relaxed">
              Limites do free tier Adzuna: 25/min, 250/dia, 1.000/sem,
              2.500/mês. Acima de{" "}
              {data.threshold?.toLocaleString("pt-BR") ?? "—"} chamadas no mês
              o sistema usa Jooble como fonte alternativa; também há fallback
              automático em caso de HTTP 429 da Adzuna. Cache hits não consomem
              quota. Atualizado em {formatTime(data.generatedAt)}.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

function StatBlock({
  icon,
  label,
  value,
  hint,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint: string;
  tone: "emerald" | "blue" | "red" | "violet";
}) {
  const borderClass =
    tone === "emerald"
      ? "border-emerald-500/10"
      : tone === "blue"
      ? "border-blue-500/10"
      : tone === "violet"
      ? "border-violet-500/10"
      : "border-red-500/10";

  return (
    <div
      className={`bg-white/[0.03] border ${borderClass} rounded-2xl p-5 backdrop-blur-sm`}
    >
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <p className="text-xs text-gray-500">{label}</p>
      </div>
      <p className="text-2xl font-bold text-white font-heading leading-none">
        {value}
      </p>
      <p className="text-xs text-gray-500 mt-2">{hint}</p>
    </div>
  );
}
