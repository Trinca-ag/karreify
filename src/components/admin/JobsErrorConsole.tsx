"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { adminFetch } from "@/services/admin";
import { Terminal, Pause, Play, Trash2, AlertOctagon } from "lucide-react";

type JobProvider = "adzuna" | "jooble";

interface ErrorEntry {
  id: string;
  tsMs: number;
  ts: string | null;
  provider: JobProvider;
  keyword: string;
  uf: string;
  city: string;
  period: string;
  page: number;
  httpStatus: number | null;
  durationMs: number | null;
  userId: string;
}

interface ConsoleLine {
  id: string;
  tsMs: number;
  text: string;
  isNew: boolean;
}

const POLL_MS = 4000;
const MAX_LINES = 200;

function formatTime(tsMs: number): string {
  const d = new Date(tsMs);
  if (Number.isNaN(d.getTime())) return "??:??:??";
  return d.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function statusHint(provider: JobProvider, status: number | null): string {
  if (status === null) return "(sem status HTTP)";
  if (status === 401 || status === 403) {
    return provider === "jooble"
      ? "(403 — chave Jooble inválida ou cota vitalícia esgotada)"
      : "(credenciais Adzuna inválidas)";
  }
  if (status === 404) return "(endpoint não encontrado)";
  if (status === 429) return "(rate limit atingido)";
  if (status >= 500) return "(erro no servidor da API)";
  return "";
}

function formatLine(e: ErrorEntry): string {
  const local = [e.city, e.uf].filter(Boolean).join(", ");
  const time = formatTime(e.tsMs);
  const status = e.httpStatus !== null ? `HTTP ${e.httpStatus}` : "ERR";
  const hint = statusHint(e.provider, e.httpStatus);
  const where = local ? ` @ ${local}` : "";
  const dur = e.durationMs !== null ? ` (${e.durationMs}ms)` : "";
  const kw = e.keyword ? ` "${e.keyword}"` : "";
  return `[${time}] ${status}${dur} —${kw}${where} ${hint}`.trim();
}

export default function JobsErrorConsole({
  provider,
}: {
  provider: JobProvider;
}) {
  const [lines, setLines] = useState<ConsoleLine[]>([]);
  const [paused, setPaused] = useState(false);
  const [lastFetchAt, setLastFetchAt] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const sinceRef = useRef<number>(0);
  const pausedRef = useRef(paused);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  pausedRef.current = paused;

  const poll = useCallback(async () => {
    if (pausedRef.current) return;
    try {
      const params = new URLSearchParams({ provider, limit: "30" });
      if (sinceRef.current > 0) params.set("since", String(sinceRef.current));
      const res = await adminFetch(`/api/admin/jobs-errors?${params}`);
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Erro ao buscar erros.");
      }
      setError(null);
      setLastFetchAt(new Date());

      const incoming = (json.errors as ErrorEntry[]) || [];
      if (incoming.length > 0) {
        // API retorna desc; queremos asc no console (mais novo embaixo).
        const sorted = [...incoming].sort((a, b) => a.tsMs - b.tsMs);
        const isFirstLoad = sinceRef.current === 0;
        const newLines: ConsoleLine[] = sorted.map((e) => ({
          id: e.id,
          tsMs: e.tsMs,
          text: formatLine(e),
          isNew: !isFirstLoad,
        }));
        sinceRef.current = sorted[sorted.length - 1].tsMs;

        setLines((prev) => {
          const seen = new Set(prev.map((l) => l.id));
          const fresh = newLines.filter((l) => !seen.has(l.id));
          // No primeiro load mostramos histórico em ordem cronológica.
          const merged = isFirstLoad
            ? newLines
            : [...prev, ...fresh].slice(-MAX_LINES);
          return merged;
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido.");
    } finally {
      setInitialLoading(false);
    }
  }, [provider]);

  useEffect(() => {
    poll();
    const id = setInterval(poll, POLL_MS);
    return () => clearInterval(id);
  }, [poll]);

  useEffect(() => {
    // Auto-scroll para baixo quando chegam linhas novas.
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  // Tira o "isNew" depois de uns segundos pra parar o flash de destaque.
  useEffect(() => {
    if (lines.length === 0) return;
    const t = setTimeout(() => {
      setLines((prev) => prev.map((l) => ({ ...l, isNew: false })));
    }, 2200);
    return () => clearTimeout(t);
  }, [lines]);

  const clear = () => {
    setLines([]);
    sinceRef.current = Date.now();
  };

  const providerColor =
    provider === "jooble" ? "text-violet-300" : "text-blue-300";
  const providerLabel = provider === "jooble" ? "Jooble" : "Adzuna";

  return (
    <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
        <Terminal className="w-5 h-5 text-red-400" />
        <h2 className="font-semibold font-heading text-white">
          Console de erros <span className={providerColor}>{providerLabel}</span>
        </h2>
        <span className="ml-auto flex items-center gap-2">
          <span className="hidden sm:flex items-center gap-1.5 text-[10px] text-gray-500">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                paused
                  ? "bg-gray-500"
                  : error
                    ? "bg-red-500"
                    : "bg-emerald-500 animate-pulse"
              }`}
            />
            {paused ? "pausado" : error ? "erro de conexão" : "ao vivo"}
          </span>
          <button
            onClick={() => setPaused((p) => !p)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] text-gray-300 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:text-white transition-colors"
          >
            {paused ? (
              <>
                <Play className="w-3 h-3" /> Retomar
              </>
            ) : (
              <>
                <Pause className="w-3 h-3" /> Pausar
              </>
            )}
          </button>
          <button
            onClick={clear}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] text-gray-300 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:text-white transition-colors"
          >
            <Trash2 className="w-3 h-3" /> Limpar
          </button>
        </span>
      </div>

      <div
        ref={scrollRef}
        className="h-[280px] overflow-auto bg-black/40 font-mono text-[11px] leading-relaxed p-4"
      >
        {initialLoading ? (
          <p className="text-gray-600">conectando...</p>
        ) : lines.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-600">
            <AlertOctagon className="w-6 h-6 opacity-40" />
            <p className="text-xs">
              Nenhum erro registrado da {providerLabel}. Tudo certo por aqui.
            </p>
          </div>
        ) : (
          <>
            {lines.map((l) => (
              <div
                key={l.id}
                className={`whitespace-pre-wrap break-words transition-colors duration-700 ${
                  l.isNew
                    ? "text-red-300 bg-red-500/10 -mx-2 px-2 rounded"
                    : "text-red-400/90"
                }`}
              >
                {l.text}
              </div>
            ))}
            <div className="text-gray-700 mt-2">
              <span className="animate-pulse">▌</span>
            </div>
          </>
        )}
      </div>

      <div className="flex items-center justify-between px-5 py-2.5 border-t border-white/[0.06] text-[10px] text-gray-600">
        <span>
          poll a cada {POLL_MS / 1000}s · últimas {lines.length} entradas
        </span>
        <span>
          {error
            ? `falha no último poll: ${error}`
            : lastFetchAt
              ? `último poll ${formatTime(lastFetchAt.getTime())}`
              : "—"}
        </span>
      </div>
    </div>
  );
}
