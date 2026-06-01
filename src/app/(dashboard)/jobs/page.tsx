"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import {
  Briefcase,
  Search,
  MapPin,
  Calendar,
  Building2,
  ExternalLink,
  Target,
  FileText,
  Clock,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  Lock,
  Coins,
  CalendarClock,
  Check,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  searchJobs,
  buyJobsPass,
  formatRelativeDate,
  JobsSearchError,
  type Job,
  type DatePeriod,
} from "@/services/jobs";
import { BRAZILIAN_STATES, fetchCitiesByUF } from "@/lib/ibge";
import { useJobsCache } from "@/components/providers/JobsCacheProvider";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { JOBS_PASSES, type JobsPassId } from "@/types";

const PERIOD_OPTIONS: { value: DatePeriod; label: string }[] = [
  { value: "today", label: "Hoje" },
  { value: "week", label: "Semana" },
  { value: "month", label: "Mês" },
];

const PAGE_SIZE = 20;

/** Janela em que a extensão fica disponível — antes disso, o usuário não pode
 *  estender (evita acúmulo desnecessário de dias e UX confusa). */
const EXTENSION_THRESHOLD_DAYS = 5;

export default function JobsPage() {
  const {
    keyword,
    setKeyword,
    uf,
    setUf,
    city,
    setCity,
    period,
    setPeriod,
    exactMatch,
    setExactMatch,
    page,
    setPage,
    jobs,
    setJobs,
    totalCount,
    setTotalCount,
    searched,
    setSearched,
    error,
    setError,
    reset: resetCache,
    getCachedPage,
    cachePage,
  } = useJobsCache();

  const { userData, refreshUserData } = useAuthContext();
  const isTester = userData?.role === "tester";

  const passExpiresAt = userData?.jobsPassExpiresAt ?? 0;
  const hasActivePass = !isTester && passExpiresAt > Date.now();
  const passDaysLeft = hasActivePass
    ? Math.max(1, Math.ceil((passExpiresAt - Date.now()) / (24 * 60 * 60 * 1000)))
    : 0;
  // Extensão só liberada quando faltam EXTENSION_THRESHOLD_DAYS ou menos. Sem
  // passe ativo, sempre pode comprar (é compra, não extensão).
  const canExtend = hasActivePass && passDaysLeft <= EXTENSION_THRESHOLD_DAYS;
  const canBuy = !hasActivePass || canExtend;

  const [cities, setCities] = useState<string[]>([]);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [testerLimitOpen, setTesterLimitOpen] = useState(false);
  const [passModalOpen, setPassModalOpen] = useState(false);
  const [dailyLimitOpen, setDailyLimitOpen] = useState(false);
  const [buyingPass, setBuyingPass] = useState<JobsPassId | null>(null);

  useEffect(() => {
    if (!uf) {
      setCities([]);
      return;
    }
    setCitiesLoading(true);
    fetchCitiesByUF(uf)
      .then((c) => setCities(c))
      .finally(() => setCitiesLoading(false));
  }, [uf]);

  useEffect(() => {
    if (isTester) setTesterLimitOpen(true);
  }, [isTester]);

  // Abre o modal de passes ao entrar na página caso o user não tenha passe
  // ativo e não seja tester. Mostrar uma vez por sessão é UX agressivo demais
  // (toda navegação reabre); mas o usuário pediu explicitamente "toda vez que
  // o usuário acesse a /jobs" → reabrir a cada mount é o comportamento certo.
  useEffect(() => {
    if (userData === null) return; // aguarda userData carregar
    if (isTester) return;
    if (hasActivePass) return;
    setPassModalOpen(true);
  }, [userData, isTester, hasActivePass]);

  async function handleBuyPass(passId: JobsPassId) {
    if (hasActivePass && !canExtend) {
      toast.error(
        `Você só pode estender o passe quando faltar ${EXTENSION_THRESHOLD_DAYS} dias ou menos.`
      );
      return;
    }
    setBuyingPass(passId);
    try {
      await buyJobsPass(passId);
      await refreshUserData();
      const pass = JOBS_PASSES.find((p) => p.id === passId);
      toast.success(`${pass?.name ?? "Passe"} ativado!`);
      setPassModalOpen(false);
    } catch (err) {
      if (err instanceof JobsSearchError && err.code === "INSUFFICIENT_CREDITS") {
        toast.error("Moedas insuficientes para comprar este passe.");
      } else {
        toast.error(err instanceof Error ? err.message : "Erro ao comprar passe.");
      }
    } finally {
      setBuyingPass(null);
    }
  }

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalCount / PAGE_SIZE)),
    [totalCount]
  );

  function makeCacheKey(targetPage: number): string {
    return JSON.stringify({
      k: keyword.trim().toLowerCase(),
      uf,
      c: city,
      p: period,
      e: exactMatch ? 1 : 0,
      pg: targetPage,
    });
  }

  async function runSearch(forcedPage?: number) {
    if (!keyword.trim() || keyword.trim().length < 2) {
      toast.error("Digite ao menos 2 caracteres para buscar.");
      return;
    }
    const targetPage = forcedPage ?? 1;
    const cacheKey = makeCacheKey(targetPage);

    const cached = getCachedPage(cacheKey);
    if (cached) {
      setJobs(cached.jobs);
      setTotalCount(cached.totalCount);
      setPage(targetPage);
      setSearched(true);
      setError(null);
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    setPage(targetPage);
    setLoading(true);
    setError(null);
    try {
      const result = await searchJobs({
        keyword: keyword.trim(),
        uf: uf || undefined,
        city: city || undefined,
        period,
        exactMatch,
        page: targetPage,
      });
      setJobs(result.jobs);
      setTotalCount(result.totalCount);
      setSearched(true);
      cachePage(cacheKey, result.jobs, result.totalCount);
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err) {
      if (err instanceof JobsSearchError && err.code === "TESTER_LIMIT_REACHED") {
        setTesterLimitOpen(true);
        return;
      }
      if (err instanceof JobsSearchError && err.code === "NO_ACTIVE_PASS") {
        setPassModalOpen(true);
        setJobs([]);
        setTotalCount(0);
        return;
      }
      if (err instanceof JobsSearchError && err.code === "DAILY_LIMIT_REACHED") {
        // Não limpamos os resultados já exibidos — só avisamos do limite.
        setDailyLimitOpen(true);
        return;
      }
      const msg = err instanceof Error ? err.message : "Erro ao buscar vagas.";
      setError(msg);
      setJobs([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }

  function clearFilters() {
    resetCache();
  }

  function buildIntegrationLink(
    job: Job,
    target: "adapt" | "cover" | "company"
  ): string {
    const params = new URLSearchParams();
    if (job.company) params.set("company", job.company);
    if (job.title) params.set("title", job.title);
    if (job.snippet) params.set("description", job.snippet.slice(0, 3500));
    switch (target) {
      case "adapt":
        return `/adapt-resume?${params.toString()}`;
      case "cover":
        return `/cover-letter?${params.toString()}`;
      case "company":
        return `/company-analysis?${params.toString()}`;
    }
  }

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
              <div className="flex items-center gap-2 flex-wrap mb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-xs font-medium text-primary-300">
                  <Sparkles className="w-3 h-3" />
                  Vagas em tempo real
                </div>
                {hasActivePass && (
                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium ${
                      canExtend
                        ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                        : "bg-emerald-500/10 border-emerald-500/25 text-emerald-300"
                    }`}
                  >
                    <CalendarClock className="w-3 h-3" />
                    Passe ativo · {passDaysLeft} {passDaysLeft === 1 ? "dia restante" : "dias restantes"}
                  </div>
                )}
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white font-heading leading-[1.1] tracking-tight">
                Encontre sua próxima{" "}
                <span className="gradient-text">oportunidade</span>
              </h1>
              <p className="text-gray-400 mt-4 text-base md:text-lg max-w-xl leading-relaxed">
                Oportunidades reais publicadas na web, com no máximo 30 dias. Filtre por cargo, estado e cidade.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <div className="relative bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] overflow-hidden animate-fade-in-up animation-delay-200">
        <div className="px-6 py-4 border-b border-white/[0.06]">
          <h2 className="font-semibold font-heading text-white flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-accent-violet flex items-center justify-center">
              <Search className="w-3.5 h-3.5 text-white" />
            </div>
            Filtros
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3">
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">
                Palavra-chave
              </label>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && runSearch()}
                placeholder="Ex: desenvolvedor backend, analista de marketing..."
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">
                Publicado
              </label>
              <div className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
                {PERIOD_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setPeriod(opt.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      period === opt.value
                        ? "bg-primary-500/20 text-primary-300"
                        : "text-gray-400 hover:text-gray-200"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-400 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> Estado
              </label>
              <select
                value={uf}
                onChange={(e) => {
                  setUf(e.target.value);
                  setCity("");
                }}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm"
              >
                <option value="" className="bg-dark-800">
                  Todos os estados
                </option>
                {BRAZILIAN_STATES.map((s) => (
                  <option key={s.uf} value={s.uf} className="bg-dark-800">
                    {s.name} ({s.uf})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> Cidade
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                disabled={!uf || citiesLoading}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm disabled:opacity-50"
              >
                <option value="" className="bg-dark-800">
                  {uf
                    ? citiesLoading
                      ? "Carregando..."
                      : "Todas as cidades"
                    : "Selecione um estado primeiro"}
                </option>
                {city && !cities.includes(city) && (
                  <option value={city} className="bg-dark-800">
                    {city}
                  </option>
                )}
                {cities.map((c) => (
                  <option key={c} value={c} className="bg-dark-800">
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-between gap-3 pt-2">
            <label className="flex flex-col sm:flex-row sm:items-center sm:gap-2 gap-1 text-sm text-gray-300 cursor-pointer select-none">
              <span className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={exactMatch}
                  onChange={(e) => setExactMatch(e.target.checked)}
                  className="w-4 h-4 rounded bg-white/5 border-white/10 accent-primary-500"
                />
                Apenas correspondências exatas
              </span>
              <span className="text-xs text-gray-500 sm:inline pl-6 sm:pl-0">
                (desligado: inclui vagas semelhantes)
              </span>
            </label>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              {searched && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-white/5 border border-white/10 text-gray-300 rounded-lg hover:bg-white/10 text-sm flex items-center justify-center gap-1.5"
                >
                  <X className="w-3.5 h-3.5" /> Limpar
                </button>
              )}
              <Button
                onClick={() => runSearch()}
                disabled={loading}
                loading={loading}
                className="w-full sm:w-auto"
              >
                <Search className="w-4 h-4 mr-1.5" /> Buscar vagas
              </Button>
            </div>
          </div>
          {isTester ? (
            <div className="flex items-start gap-2 px-3 py-2 bg-violet-500/5 border border-violet-500/15 rounded-lg text-[11px] text-violet-200 leading-relaxed">
              <Lock className="w-3.5 h-3.5 text-violet-300 flex-shrink-0 mt-0.5" />
              <span>
                Conta no modo Tester: você tem direito a apenas{" "}
                <span className="font-semibold text-white">1 busca</span>, sem
                navegação entre páginas.
              </span>
            </div>
          ) : hasActivePass ? (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-2 px-3 py-2 bg-emerald-500/5 border border-emerald-500/15 rounded-lg text-[11px] text-emerald-200 leading-relaxed">
              <div className="flex items-start gap-2">
                <CalendarClock className="w-3.5 h-3.5 text-emerald-300 flex-shrink-0 mt-0.5" />
                <span>
                  Passe ativo · expira em{" "}
                  <span className="font-semibold text-white">
                    {passDaysLeft} {passDaysLeft === 1 ? "dia" : "dias"}
                  </span>{" "}
                  · até 10 buscas por dia
                </span>
              </div>
              {canExtend ? (
                <button
                  onClick={() => setPassModalOpen(true)}
                  className="text-[11px] font-medium text-emerald-300 hover:text-white transition-colors underline-offset-2 hover:underline"
                >
                  Estender
                </button>
              ) : (
                <span className="text-[10px] text-emerald-300/70 whitespace-nowrap">
                  Renovação disponível faltando {EXTENSION_THRESHOLD_DAYS} dias
                </span>
              )}
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-3 py-2 bg-yellow-500/5 border border-yellow-500/15 rounded-lg text-[11px] text-yellow-200 leading-relaxed">
              <div className="flex items-start gap-2">
                <Coins className="w-3.5 h-3.5 text-yellow-300 flex-shrink-0 mt-0.5" />
                <span>
                  Você precisa de um passe ativo para buscar vagas. Passes
                  semanal ({JOBS_PASSES.find(p => p.id === "weekly")?.cost} moedas) ou mensal ({JOBS_PASSES.find(p => p.id === "monthly")?.cost} moedas).
                </span>
              </div>
              <button
                onClick={() => setPassModalOpen(true)}
                className="text-[11px] font-semibold text-white bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 px-2 py-1.5 rounded-md transition-colors w-full sm:w-auto sm:py-0.5 sm:px-2"
              >
                Comprar passe
              </button>
            </div>
          )}
        </div>
      </div>

      {loading && (
        <div className="relative bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] py-12 flex flex-col items-center gap-3 animate-fade-in-up animation-delay-300">
          <div className="w-10 h-10 rounded-full border-2 border-primary-500/30 border-t-primary-400 animate-spin" />
          <p className="text-sm text-gray-400">Buscando vagas...</p>
        </div>
      )}

      {!loading && error && (
        <div className="relative bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] py-10 flex flex-col items-center gap-3 animate-fade-in-up animation-delay-300">
          <AlertTriangle className="w-8 h-8 text-amber-400" />
          <p className="text-white font-semibold">
            Não foi possível buscar vagas
          </p>
          <p className="text-sm text-gray-400 text-center max-w-md">{error}</p>
          <button
            onClick={() => runSearch(page)}
            className="px-4 py-2 bg-primary-500/10 text-primary-400 rounded-lg hover:bg-primary-500/20 text-sm glow-blue"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {!loading && !error && !searched && (
        <div className="relative bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] py-16 flex flex-col items-center gap-3 text-center animate-fade-in-up animation-delay-300">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-violet flex items-center justify-center shadow-lg shadow-primary-600/20">
            <Search className="w-7 h-7 text-white" />
          </div>
          <p className="text-white font-semibold">Comece buscando uma vaga</p>
          <p className="text-sm text-gray-400 max-w-md">
            Digite o cargo, área ou tecnologia que procura. Você pode refinar
            por estado, cidade e período de publicação.
          </p>
        </div>
      )}

      {!loading && !error && searched && jobs.length === 0 && (
        <div className="relative bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] py-12 flex flex-col items-center gap-3 text-center animate-fade-in-up animation-delay-300">
          <Briefcase className="w-10 h-10 text-gray-500" />
          <p className="text-white font-semibold">Nenhuma vaga encontrada</p>
          <p className="text-sm text-gray-400 max-w-md">
            Tente ampliar a busca: remova o filtro de cidade, troque o período
            para &quot;Mês&quot; ou desmarque &quot;correspondências exatas&quot;.
          </p>
        </div>
      )}

      {!loading && !error && jobs.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 px-1">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white font-heading">
                {totalCount.toLocaleString("pt-BR")}
              </span>
              <span className="text-sm text-gray-400">
                vagas encontradas
              </span>
            </div>
            {!isTester && totalCount > PAGE_SIZE && (
              <span className="text-xs text-gray-500 px-3 py-1 bg-white/5 border border-white/10 rounded-lg">
                página {page} de {totalPages.toLocaleString("pt-BR")}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                buildIntegrationLink={buildIntegrationLink}
              />
            ))}
          </div>

          {!isTester && totalCount > PAGE_SIZE && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => runSearch(page - 1)}
                disabled={page <= 1 || loading}
                className="flex items-center gap-1 px-3 py-2 bg-white/5 border border-white/10 text-gray-300 rounded-lg hover:bg-white/10 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" /> Anterior
              </button>
              <span className="px-3 py-2 text-sm text-gray-400">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => runSearch(page + 1)}
                disabled={page >= totalPages || loading}
                className="flex items-center gap-1 px-3 py-2 bg-white/5 border border-white/10 text-gray-300 rounded-lg hover:bg-white/10 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Próxima <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="flex items-start gap-2.5 px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl mt-6">
            <Clock className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-gray-500 leading-relaxed">
              Vagas agregadas via Adzuna e Jooble, com até 30 dias de publicação.
              Pode haver vagas já preenchidas — verifique o anúncio original
              antes de se candidatar.
            </p>
          </div>
        </div>
      )}

      <Modal
        isOpen={testerLimitOpen}
        onClose={() => setTesterLimitOpen(false)}
        size="sm"
      >
        <div className="text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-black/20">
            <Lock className="w-7 h-7 text-white" />
          </div>
          <h2 className="mt-5 text-lg font-bold text-white font-heading">
            Limite de buscas atingido
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Contas no modo Tester têm direito a apenas{" "}
            <span className="text-white font-semibold">1 busca</span> de vagas.
            Em caso de dúvidas, entre em contato com a equipe.
          </p>
          <Button
            onClick={() => setTesterLimitOpen(false)}
            className="mt-6 w-full"
          >
            Entendi
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={dailyLimitOpen}
        onClose={() => setDailyLimitOpen(false)}
        size="sm"
      >
        <div className="text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-black/20">
            <CalendarClock className="w-7 h-7 text-white" />
          </div>
          <h2 className="mt-5 text-lg font-bold text-white font-heading">
            Limite diário atingido
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Você já fez suas{" "}
            <span className="text-white font-semibold">10 buscas de hoje</span>.
            O limite zera à meia-noite (horário de Brasília) — volte amanhã para
            continuar pesquisando vagas.
          </p>
          <p className="mt-2 text-xs text-gray-500">
            Você ainda pode navegar pelas páginas das buscas que já fez.
          </p>
          <Button
            onClick={() => setDailyLimitOpen(false)}
            className="mt-6 w-full"
          >
            Entendi
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={passModalOpen}
        onClose={() => !buyingPass && setPassModalOpen(false)}
        size="lg"
      >
        <div className="-m-6">
          {/* Hero header com gradiente */}
          <div className="relative overflow-hidden rounded-t-2xl bg-gradient-to-br from-primary-600 via-primary-700 to-accent-violet p-6 md:p-8">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-accent-violet/40 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
            <button
              onClick={() => !buyingPass && setPassModalOpen(false)}
              disabled={!!buyingPass}
              aria-label="Fechar"
              className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="relative">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur border border-white/20 text-[10px] font-bold text-white uppercase tracking-wider mb-3">
                <Briefcase className="w-3 h-3" />
                Passes de vagas
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white font-heading leading-tight pr-12">
                {hasActivePass
                  ? canExtend
                    ? "Estenda seu acesso"
                    : "Você ainda tem acesso ativo"
                  : "Libere o acesso às vagas"}
              </h2>
              <p className="text-white/80 text-sm mt-2 max-w-md leading-relaxed">
                {hasActivePass
                  ? canExtend
                    ? `Seu passe atual expira em ${passDaysLeft} ${passDaysLeft === 1 ? "dia" : "dias"}. Comprar um novo passe estende a partir da data atual de expiração.`
                    : `Seu passe atual ainda tem ${passDaysLeft} ${passDaysLeft === 1 ? "dia" : "dias"}. A renovação fica liberada quando faltar ${EXTENSION_THRESHOLD_DAYS} dias ou menos.`
                  : "Escolha entre semanal ou mensal e tenha até 10 buscas por dia. Sem cobrança recorrente."}
              </p>
            </div>
          </div>

          {/* Saldo */}
          <div className="px-6 md:px-8 pt-5">
            <div className="flex items-center justify-between gap-3 px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/20 flex items-center justify-center">
                  <Coins className="w-4 h-4 text-yellow-300" />
                </div>
                <div>
                  <p className="text-[11px] text-gray-500 uppercase tracking-wider">Seu saldo</p>
                  <p className="text-sm font-bold text-white">
                    {userData?.credits ?? 0} <span className="text-gray-400 font-normal">moedas</span>
                  </p>
                </div>
              </div>
              <Link
                href="/plans"
                className="text-xs text-primary-400 hover:text-primary-300 transition-colors font-medium"
              >
                Recarregar →
              </Link>
            </div>
          </div>

          {/* Passes */}
          <div className="px-6 md:px-8 py-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {JOBS_PASSES.map((pass) => {
              const canAfford = (userData?.credits ?? 0) >= pass.cost;
              const isBuying = buyingPass === pass.id;
              const isPopular = pass.id === "monthly";
              const days = Math.round(pass.durationMs / (24 * 60 * 60 * 1000));
              const perDay = (pass.cost / days).toFixed(1);
              return (
                <div
                  key={pass.id}
                  className={`relative rounded-2xl p-5 transition-all duration-300 flex flex-col min-w-0 ${
                    isPopular
                      ? "bg-gradient-to-br from-primary-500/10 via-primary-500/5 to-accent-violet/10 border-2 border-primary-500/40 hover:border-primary-500/60"
                      : "bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.15]"
                  } ${!canAfford ? "opacity-60" : ""}`}
                >
                  {isPopular && (
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-10">
                      <span className="px-2.5 py-0.5 bg-gradient-to-r from-primary-500 to-accent-violet text-white text-[10px] font-bold rounded-full whitespace-nowrap shadow-lg shadow-primary-600/40">
                        MELHOR VALOR
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2.5 mb-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isPopular
                          ? "bg-gradient-to-br from-primary-500 to-accent-violet shadow-lg shadow-primary-600/30"
                          : "bg-white/[0.05] border border-white/[0.1]"
                      }`}
                    >
                      <CalendarClock className={`w-5 h-5 ${isPopular ? "text-white" : "text-gray-300"}`} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base font-bold text-white font-heading">{pass.name}</h3>
                      <p className="text-[11px] text-gray-500">{days} dias de acesso</p>
                    </div>
                  </div>

                  <div className="flex items-baseline gap-1.5 mb-1">
                    <span className="text-3xl font-bold gradient-text font-heading leading-none">
                      {pass.cost}
                    </span>
                    <span className="text-xs text-gray-400">moedas</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mb-4">
                    ≈ {perDay} moedas por dia
                  </p>

                  <ul className="space-y-1.5 mb-4 text-xs text-gray-300 flex-1">
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>Até 10 buscas por dia</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>Sem renovação automática</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>Paginação livre</span>
                    </li>
                  </ul>

                  <button
                    onClick={() => handleBuyPass(pass.id)}
                    disabled={!canAfford || !canBuy || !!buyingPass}
                    className={`w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                      isPopular
                        ? "bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-500 hover:to-primary-400 glow-blue"
                        : "bg-white/[0.06] text-white border border-white/[0.1] hover:bg-white/[0.12]"
                    }`}
                  >
                    {isBuying ? (
                      <>
                        <div className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        Ativando...
                      </>
                    ) : hasActivePass && !canExtend ? (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        Disponível faltando {EXTENSION_THRESHOLD_DAYS} dias
                      </>
                    ) : !canAfford ? (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        Sem saldo
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        {hasActivePass ? "Estender" : "Ativar passe"}
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-6 md:px-8 pb-6 flex items-start gap-2 text-[11px] text-gray-500 leading-relaxed border-t border-white/[0.06] pt-4">
            <Clock className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
            <span>
              Sem moedas suficientes?{" "}
              <Link
                href="/plans#pacotes"
                className="text-primary-400 hover:text-primary-300 underline-offset-2 hover:underline font-medium"
              >
                Recarregue em Pacotes
              </Link>
              . Você pode fechar este aviso a qualquer momento.
            </span>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function JobCard({
  job,
  buildIntegrationLink,
}: {
  job: Job;
  buildIntegrationLink: (
    job: Job,
    target: "adapt" | "cover" | "company"
  ) => string;
}) {
  const relative = job.updated ? formatRelativeDate(job.updated) : "";

  return (
    <div className="relative group bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] p-5 overflow-hidden hover:border-primary-500/30 hover:-translate-y-0.5 transition-all duration-300 h-full flex flex-col gap-3.5">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-500/10 group-hover:bg-primary-500/20 rounded-full blur-3xl transition-all duration-500 pointer-events-none" />

      {/* Top: date + salary */}
      {(relative || job.salary) && (
        <div className="relative flex items-start justify-between gap-2 min-h-[28px]">
          {relative ? (
            <span className="flex items-center gap-1 px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-[11px] text-gray-400 font-medium">
              <Calendar className="w-3 h-3" /> {relative}
            </span>
          ) : (
            <span />
          )}
          {job.salary && (
            <span className="px-2.5 py-1 bg-gradient-to-r from-emerald-500/15 to-emerald-500/5 border border-emerald-500/30 rounded-lg text-xs text-emerald-300 font-bold text-right leading-tight max-w-[60%]">
              {job.salary}
            </span>
          )}
        </div>
      )}

      {/* Title + company */}
      <div className="relative min-w-0">
        <h3 className="font-semibold text-white text-base leading-snug line-clamp-2 group-hover:text-primary-300 transition-colors">
          {job.title}
        </h3>
        {job.company && (
          <p className="text-sm text-gray-300 font-medium mt-1 truncate">
            {job.company}
          </p>
        )}
      </div>

      {/* Meta */}
      {job.location && (
        <div className="relative flex items-center gap-1 text-xs text-gray-400">
          <MapPin className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
          <span className="truncate">{job.location}</span>
        </div>
      )}

      {/* Tags */}
      {(job.type || job.source) && (
        <div className="relative flex flex-wrap gap-1.5">
          {job.type && (
            <span className="px-2 py-0.5 bg-white/[0.04] border border-white/10 rounded-md text-[11px] text-gray-300">
              {job.type}
            </span>
          )}
          {job.source && (
            <span className="px-2 py-0.5 bg-white/[0.04] border border-white/10 rounded-md text-[11px] text-gray-300">
              {job.source}
            </span>
          )}
        </div>
      )}

      {/* Snippet */}
      {job.snippet && (
        <p className="relative text-sm text-gray-300 leading-relaxed line-clamp-4 flex-1">
          {job.snippet}
        </p>
      )}

      {/* Actions */}
      <div className="relative pt-3 mt-auto border-t border-white/[0.06] space-y-2">
        {/* Primary CTA — link direto pra redirect_url da Adzuna pra preservar
            o tracking de clique (receita por clique). O proxy server-side em
            /api/jobs/redirect (route.ts) está mantido caso queira voltar pra
            uma UX sem interstitial — basta trocar o href de volta pra
            `/api/jobs/redirect?url=${encodeURIComponent(job.link)}`. */}
        {job.link && (
          <a
            href={job.link}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="flex items-center justify-center gap-2 w-full px-3 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-primary-600/20 hover:shadow-primary-500/30 glow-blue"
          >
            Ver vaga
            <ExternalLink className="w-4 h-4" />
          </a>
        )}

        {/* Secondary actions — open the corresponding tool with the job
            context pre-filled via URL params. Adzuna snippets are short
            (~150-500 chars) so URL params are reliable. */}
        <div className="grid grid-cols-3 gap-1.5">
          <Link
            href={buildIntegrationLink(job, "adapt")}
            title="Adaptar seu currículo para esta vaga"
            className="flex flex-col items-center gap-1 py-2 px-1 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 text-orange-300 rounded-lg text-[11px] font-medium transition-colors"
          >
            <Target className="w-4 h-4" />
            <span>Adaptar</span>
          </Link>
          <Link
            href={buildIntegrationLink(job, "cover")}
            title="Gerar carta de apresentação para esta vaga"
            className="flex flex-col items-center gap-1 py-2 px-1 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/20 text-teal-300 rounded-lg text-[11px] font-medium transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>Carta</span>
          </Link>
          <Link
            href={buildIntegrationLink(job, "company")}
            title={
              job.company
                ? "Analisar a empresa antes da entrevista"
                : "Analisar empresa — preencha o nome na próxima página"
            }
            className="flex flex-col items-center gap-1 py-2 px-1 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 text-sky-300 rounded-lg text-[11px] font-medium transition-colors"
          >
            <Building2 className="w-4 h-4" />
            <span>Empresa</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
