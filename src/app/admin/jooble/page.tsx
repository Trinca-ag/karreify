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
} from "lucide-react";
import JobsErrorConsole from "@/components/admin/JobsErrorConsole";

type JobProvider = "adzuna" | "jooble";

interface BucketStats {
  apiCalls: number;
  apiErrors: number;
  cacheHits: number;
  billable: number;
}

interface JoobleUsageData {
  totalLimit: number;
  warningThreshold: number;
  totalBillable: number;
  remaining: number;
  joobleDisabled: boolean;
  counts: {
    lastMinute: BucketStats;
    daily: BucketStats;
    weekly: BucketStats;
    monthly: BucketStats;
  };
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

const WINDOW_CARDS: {
  key: "lastMinute" | "daily" | "weekly" | "monthly";
  label: string;
  window: string;
}[] = [
  { key: "lastMinute", label: "Último minuto", window: "60s" },
  { key: "daily", label: "Hoje", window: "24h" },
  { key: "weekly", label: "Semana", window: "7 dias" },
  { key: "monthly", label: "Mês", window: "30 dias" },
];

function totalTone(pct: number) {
  if (pct >= 80) {
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
    bar: "from-violet-500 to-violet-400",
    text: "text-violet-300",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
  };
}

function statusPill(status: "cache_hit" | "api_call" | "api_error") {
  if (status === "cache_hit") {
    return {
      label: "Cache",
      className: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
    };
  }
  if (status === "api_call") {
    return {
      label: "Jooble",
      className: "bg-violet-500/10 text-violet-300 border-violet-500/20",
    };
  }
  return {
    label: "Erro Jooble",
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

export default function AdminJooblePage() {
  const [data, setData] = useState<JoobleUsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (silent = false) => {
    if (silent) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const res = await adminFetch("/api/admin/jooble-usage");
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

  const totalPct = useMemo(() => {
    if (!data || data.totalLimit === 0) return 0;
    return Math.min(100, (data.totalBillable / data.totalLimit) * 100);
  }, [data]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white flex items-center gap-3">
            <Activity className="w-7 h-7 text-violet-400" />
            Consumo Jooble
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
            Fonte principal de vagas. Cota total vitalícia de{" "}
            {data?.totalLimit?.toLocaleString("pt-BR") ?? "—"} requisições
            por chave (sem reset).
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
          {data.joobleDisabled && (
            <div className="flex items-start gap-3 px-4 py-3 bg-amber-500/10 border border-amber-500/30 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm leading-relaxed">
                <p className="text-amber-200 font-semibold">
                  Jooble desabilitada via JOOBLE_DISABLED=true
                </p>
                <p className="text-amber-200/80 text-xs mt-0.5">
                  Todas as buscas estão indo direto pra Adzuna. Remova a flag
                  do .env.local pra reativar a Jooble.
                </p>
              </div>
            </div>
          )}

          {/* Cota total (vitalícia) */}
          {(() => {
            const tone = totalTone(totalPct);
            return (
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">
                      Cota total vitalícia da chave
                    </p>
                    <p className="text-[10px] text-gray-600 mt-0.5">
                      Não reseta. Quando esgota, requisições deixam de ser
                      processadas (sem código de erro garantido).
                    </p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-md text-xs font-bold border ${tone.bg} ${tone.text} ${tone.border}`}
                  >
                    {Math.round(totalPct)}%
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5 mb-3">
                  <span className="text-4xl font-bold text-white font-heading tabular-nums leading-none">
                    {data.totalBillable.toLocaleString("pt-BR")}
                  </span>
                  <span className="text-lg text-gray-500 tabular-nums">
                    / {data.totalLimit.toLocaleString("pt-BR")}
                  </span>
                  <span className="ml-auto text-sm text-gray-400 tabular-nums">
                    {data.remaining.toLocaleString("pt-BR")} restantes
                  </span>
                </div>
                <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${tone.bar} rounded-full transition-all duration-500`}
                    style={{ width: `${totalPct}%` }}
                  />
                </div>
                {data.totalBillable >= data.warningThreshold && (
                  <p className="text-xs text-amber-300 mt-3 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Acima de {data.warningThreshold} chamadas. Acima do limite
                    de {data.totalLimit} o sistema roteia automaticamente para
                    Adzuna.
                  </p>
                )}
              </div>
            );
          })()}

          {/* Buckets por janela (não consomem limite Jooble extra — são só amostras) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {WINDOW_CARDS.map((card) => {
              const bucket = data.counts[card.key];
              return (
                <div
                  key={card.key}
                  className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5"
                >
                  <p className="text-xs text-gray-500">{card.label}</p>
                  <p className="text-[10px] text-gray-600 uppercase tracking-wider mt-0.5">
                    {card.window}
                  </p>
                  <p className="text-2xl font-bold text-white font-heading tabular-nums leading-none mt-3">
                    {bucket.billable.toLocaleString("pt-BR")}
                  </p>
                  <div className="grid grid-cols-3 gap-2 mt-3 text-[10px]">
                    <div>
                      <p className="text-gray-600 uppercase tracking-wider">
                        Cache
                      </p>
                      <p className="text-emerald-300 font-semibold tabular-nums mt-0.5">
                        {bucket.cacheHits}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 uppercase tracking-wider">
                        API
                      </p>
                      <p className="text-violet-300 font-semibold tabular-nums mt-0.5">
                        {bucket.apiCalls}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 uppercase tracking-wider">
                        Erros
                      </p>
                      <p className="text-red-300 font-semibold tabular-nums mt-0.5">
                        {bucket.apiErrors}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Console de erros em tempo real */}
          <JobsErrorConsole provider="jooble" />

          {/* Estatísticas secundárias */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <StatBlock
              icon={<Database className="w-5 h-5 text-emerald-400" />}
              label="Taxa de cache (30d)"
              value={`${cacheHitRatePct}%`}
              hint={`${data.counts.monthly.cacheHits.toLocaleString(
                "pt-BR"
              )} hits no mês`}
              tone="emerald"
            />
            <StatBlock
              icon={<Zap className="w-5 h-5 text-violet-400" />}
              label="Latência média"
              value={`${data.avgLatencyMs} ms`}
              hint="apenas chamadas reais à Jooble"
              tone="violet"
            />
            <StatBlock
              icon={<AlertTriangle className="w-5 h-5 text-red-400" />}
              label="Erros Jooble (30d)"
              value={data.counts.monthly.apiErrors.toLocaleString("pt-BR")}
              hint="HTTP 4xx/5xx da Jooble"
              tone="red"
            />
          </div>

          {/* Top queries + Recent calls */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
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
                              className="h-full bg-gradient-to-r from-violet-500 to-violet-400 rounded-full transition-all duration-500"
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
                    <thead className="bg-dark-800 sticky top-0 z-10">
                      <tr className="text-gray-500">
                        <th className="text-left font-medium px-4 py-2.5">
                          Hora
                        </th>
                        <th className="text-left font-medium px-2 py-2.5">
                          Tipo
                        </th>
                        <th className="text-left font-medium px-2 py-2.5">
                          Busca
                        </th>
                        <th className="text-left font-medium px-2 py-2.5">
                          Local
                        </th>
                        <th className="text-right font-medium px-4 py-2.5">
                          ms
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {data.recentCalls.map((call, idx) => {
                        const pill = statusPill(call.status);
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
              Cota Jooble: {data.totalLimit} requisições no total da vida útil
              da chave. Quando ultrapassa esse limite, o sistema cai
              automaticamente na Adzuna. A Jooble não fornece headers de
              rate-limit nem código padronizado quando a cota esgota — por
              isso qualquer falha cai pra Adzuna. Atualizado em{" "}
              {formatTime(data.generatedAt)}.
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
  tone: "emerald" | "violet" | "red";
}) {
  const borderClass =
    tone === "emerald"
      ? "border-emerald-500/10"
      : tone === "violet"
        ? "border-violet-500/10"
        : "border-red-500/10";

  return (
    <div className={`bg-white/[0.03] border ${borderClass} rounded-2xl p-5`}>
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
