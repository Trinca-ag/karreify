"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthContext } from "@/components/providers/AuthProvider";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import AIProgressModal from "@/components/ui/AIProgressModal";
import SaveLimitModal from "@/components/ui/SaveLimitModal";
import { useSavedItemSaver } from "@/hooks/useSavedItemSaver";
import { useAIProgress } from "@/hooks/useAIProgress";
import { deductCredits, checkCredits } from "@/services/credits";
import type { CompanyAnalysisResult } from "@/services/ai-company-analysis";
import {
  Building2,
  Briefcase,
  RefreshCw,
  MapPin,
  Globe,
  Phone,
  Mail,
  Star,
  ThumbsUp,
  ThumbsDown,
  DollarSign,
  ClipboardList,
  Lightbulb,
  BookOpen,
  Users,
  Info,
  AlertTriangle,
  Download,
  Search,
} from "lucide-react";
import toast from "react-hot-toast";

const PROGRESS_MESSAGES = [
  "Pesquisando sobre a empresa...",
  "Analisando cultura organizacional...",
  "Verificando salários e benefícios...",
  "Buscando avaliações de funcionários...",
  "Preparando dicas de entrevista...",
  "Finalizando análise...",
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i <= Math.round(rating)
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-600"
          }`}
        />
      ))}
    </div>
  );
}

function ResultView({ result }: { result: CompanyAnalysisResult }) {
  const hasContact = result.website || result.phone || result.email || result.linkedin;

  return (
    <div className="space-y-4">
      {/* Company header */}
      <div className="relative group bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] p-6 overflow-hidden transition-all duration-300 hover:border-primary-500/30 hover:-translate-y-0.5">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-500/10 group-hover:bg-primary-500/20 rounded-full blur-3xl transition-all duration-500 pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white font-heading">{result.companyName}</h2>
            <div className="flex flex-wrap gap-2 mt-3">
              {result.industry && (
                <span className="px-3 py-1 bg-primary-500/10 border border-primary-500/20 rounded-lg text-xs text-primary-300">
                  {result.industry}
                </span>
              )}
              {result.size && (
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-300 flex items-center gap-1.5">
                  <Users className="w-3 h-3" /> {result.size}
                </span>
              )}
              {result.founded && (
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-300">
                  Fundada em {result.founded}
                </span>
              )}
              {result.headquarters && (
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-300 flex items-center gap-1.5">
                  <MapPin className="w-3 h-3" /> {result.headquarters}
                </span>
              )}
            </div>
          </div>

          {/* Rating badge */}
          <div className="flex flex-col items-center bg-white/5 border border-white/10 rounded-xl px-5 py-3 min-w-[100px]">
            <p className="text-2xl font-bold text-yellow-400 font-heading">
              {result.employeeReviews.overallRating.toFixed(1)}
            </p>
            <StarRating rating={result.employeeReviews.overallRating} />
            <p className="text-xs text-gray-500 mt-1">funcionários</p>
          </div>
        </div>
      </div>

      {/* Overview */}
      <div className="relative group bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] p-6 overflow-hidden transition-all duration-300 hover:border-primary-500/30 hover:-translate-y-0.5">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-500/10 group-hover:bg-primary-500/20 rounded-full blur-3xl transition-all duration-500 pointer-events-none" />
        <div className="relative">
          <h3 className="font-semibold font-heading text-white flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-violet rounded-xl flex items-center justify-center flex-shrink-0">
              <Info className="w-4 h-4 text-white" />
            </div>
            Visão Geral
          </h3>
          <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">{result.overview}</p>
        </div>
      </div>

      {/* History + Culture */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="relative group bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] p-6 overflow-hidden transition-all duration-300 hover:border-primary-500/30 hover:-translate-y-0.5">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-violet-500/10 group-hover:bg-violet-500/20 rounded-full blur-3xl transition-all duration-500 pointer-events-none" />
          <div className="relative">
            <h3 className="font-semibold font-heading text-white flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              História
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">{result.history}</p>
          </div>
        </div>

        <div className="relative group bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] p-6 overflow-hidden transition-all duration-300 hover:border-primary-500/30 hover:-translate-y-0.5">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-teal-500/10 group-hover:bg-teal-500/20 rounded-full blur-3xl transition-all duration-500 pointer-events-none" />
          <div className="relative">
            <h3 className="font-semibold font-heading text-white flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Users className="w-4 h-4 text-white" />
              </div>
              Cultura Organizacional
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">{result.culture}</p>
          </div>
        </div>
      </div>

      {/* Employee reviews */}
      <div className="relative group bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] p-6 overflow-hidden transition-all duration-300 hover:border-primary-500/30 hover:-translate-y-0.5">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-500/10 group-hover:bg-yellow-500/20 rounded-full blur-3xl transition-all duration-500 pointer-events-none" />
        <div className="relative">
          <h3 className="font-semibold font-heading text-white flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Star className="w-4 h-4 text-white" />
            </div>
            Avaliações de Funcionários
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Positive */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                  <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <p className="text-sm font-semibold text-emerald-400">Pontos positivos</p>
              </div>
              <ul className="space-y-2">
                {result.employeeReviews.positive.map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            {/* Negative */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-orange-500/10 rounded-lg flex items-center justify-center">
                  <ThumbsDown className="w-3.5 h-3.5 text-orange-400" />
                </div>
                <p className="text-sm font-semibold text-orange-400">Pontos de atenção</p>
              </div>
              <ul className="space-y-2">
                {result.employeeReviews.negative.map((n, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
                    {n}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Salary */}
      <div className="relative group bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] p-6 overflow-hidden transition-all duration-300 hover:border-primary-500/30 hover:-translate-y-0.5">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 group-hover:bg-emerald-500/20 rounded-full blur-3xl transition-all duration-500 pointer-events-none" />
        <div className="relative">
          <h3 className="font-semibold font-heading text-white flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-4 h-4 text-white" />
            </div>
            Remuneração — {result.salaryInfo.position}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-gray-500 mb-1">Salário médio estimado</p>
              <p className="text-2xl font-bold text-emerald-400 font-heading">{result.salaryInfo.average}</p>
              <p className="text-sm text-gray-400 mt-1">Faixa: {result.salaryInfo.range}</p>
            </div>
            {result.salaryInfo.benefits.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 mb-2">Benefícios comuns</p>
                <ul className="space-y-1.5">
                  {result.salaryInfo.benefits.map((b, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Interview process + Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="relative group bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] p-6 overflow-hidden transition-all duration-300 hover:border-primary-500/30 hover:-translate-y-0.5">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-sky-500/10 group-hover:bg-sky-500/20 rounded-full blur-3xl transition-all duration-500 pointer-events-none" />
          <div className="relative">
            <h3 className="font-semibold font-heading text-white flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <ClipboardList className="w-4 h-4 text-white" />
              </div>
              Processo Seletivo
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">{result.interviewProcess}</p>
          </div>
        </div>

        <div className="relative group bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] p-6 overflow-hidden transition-all duration-300 hover:border-primary-500/30 hover:-translate-y-0.5">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 group-hover:bg-amber-500/20 rounded-full blur-3xl transition-all duration-500 pointer-events-none" />
          <div className="relative">
            <h3 className="font-semibold font-heading text-white flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-4 h-4 text-white" />
              </div>
              Dicas para a Entrevista
            </h3>
            <ul className="space-y-3">
              {result.interviewTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                  <span className="mt-0.5 w-5 h-5 rounded-lg bg-yellow-500/10 text-yellow-400 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {i + 1}
                  </span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Contact + Other locations */}
      {(hasContact || result.otherLocations?.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {hasContact && (
            <div className="relative group bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] p-6 overflow-hidden transition-all duration-300 hover:border-primary-500/30 hover:-translate-y-0.5">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-500/10 group-hover:bg-primary-500/20 rounded-full blur-3xl transition-all duration-500 pointer-events-none" />
              <div className="relative">
                <h3 className="font-semibold font-heading text-white flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-violet rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  Contato
                </h3>
                <ul className="space-y-2.5">
                  {result.website && (
                    <li className="flex items-center gap-2.5 text-sm text-gray-300">
                      <Globe className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <span className="break-all">{result.website}</span>
                    </li>
                  )}
                  {result.phone && (
                    <li className="flex items-center gap-2.5 text-sm text-gray-300">
                      <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      {result.phone}
                    </li>
                  )}
                  {result.email && (
                    <li className="flex items-center gap-2.5 text-sm text-gray-300">
                      <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      {result.email}
                    </li>
                  )}
                  {result.linkedin && (
                    <li className="flex items-center gap-2.5 text-sm text-gray-300">
                      <Globe className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <span className="break-all">{result.linkedin}</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          )}

          {result.otherLocations?.length > 0 && (
            <div className="relative group bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] p-6 overflow-hidden transition-all duration-300 hover:border-primary-500/30 hover:-translate-y-0.5">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-500/10 group-hover:bg-primary-500/20 rounded-full blur-3xl transition-all duration-500 pointer-events-none" />
              <div className="relative">
                <h3 className="font-semibold font-heading text-white flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-violet rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  Outras Localidades
                </h3>
                <ul className="space-y-2">
                  {result.otherLocations.map((loc, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0" />
                      {loc}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Disclaimer */}
      <div className="flex items-start gap-2.5 px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl">
        <AlertTriangle className="w-4 h-4 text-yellow-500/70 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-gray-500 leading-relaxed">
          As informações são geradas por IA com base em dados públicos e podem não refletir a situação atual da empresa. Consulte fontes como Glassdoor, LinkedIn e o site oficial para confirmar dados antes da entrevista.
        </p>
      </div>
    </div>
  );
}

export default function CompanyAnalysisPage() {
  const { user } = useAuthContext();
  const saver = useSavedItemSaver();
  const [companyName, setCompanyName] = useState("");
  const [position, setPosition] = useState("");
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [result, setResult] = useState<CompanyAnalysisResult | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const {
    progress,
    message: progressMsg,
    start: startProgress,
    stop: stopProgress,
    reset: resetProgress,
  } = useAIProgress({
    messages: PROGRESS_MESSAGES,
    finalMessage: "Análise concluída!",
    expectedDuration: 12,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const company = params.get("company");
    const title = params.get("title");
    if (company) setCompanyName(company);
    if (title) setPosition(title);
  }, []);

  const saveAnalysisInBackground = useCallback(
    async (data: CompanyAnalysisResult) => {
      if (!user) return;
      try {
        const res = await fetch("/api/generate-company-analysis-pdf", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data }),
        });
        if (!res.ok) return;
        const blob = await res.blob();
        const ts = Date.now();
        await saver.saveWithPrompt({
          uid: user.uid,
          type: "company-analysis",
          payload: {
            kind: "pdf",
            data: {
              type: "company-analysis",
              title: `${data.companyName}`,
              subtitle: data.salaryInfo?.position || undefined,
              fileName: `analise-empresa-${ts}.pdf`,
              pdf: blob,
            },
          },
        });
      } catch {
        /* silent */
      }
    },
    [user, saver]
  );

  const handleDownloadPDF = useCallback(async () => {
    if (!result) return;
    setPdfLoading(true);
    try {
      const res = await fetch("/api/generate-company-analysis-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: result }),
      });
      if (!res.ok) throw new Error("Erro ao gerar PDF");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `analise-empresa-${result.companyName.replace(/\s+/g, "-")}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Erro ao baixar PDF.");
    } finally {
      setPdfLoading(false);
    }
  }, [result]);

  const handleAnalyze = async () => {
    if (!user) return;

    const hasCredits = await checkCredits(user.uid, "company-analysis");
    if (!hasCredits) { toast.error("Créditos insuficientes."); return; }

    setLoading(true);
    startProgress();
    try {
      const res = await fetch("/api/analyze-company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName, position, userId: user.uid }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      await deductCredits(user.uid, "company-analysis", `Análise de empresa — ${companyName}`);
      stopProgress();
      setResult(data.data);
      toast.success("Análise concluída!");
      void saveAnalysisInBackground(data.data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao analisar empresa.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setCompanyName("");
    setPosition("");
    resetProgress();
  };

  const canAnalyze = companyName.trim().length > 1 && position.trim().length > 1;

  return (
    <div className="relative space-y-8 pb-8">
      {/* Hero Header */}
      <section className="relative overflow-hidden rounded-3xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-xl">
        <div className="absolute -top-24 -left-16 w-80 h-80 bg-primary-500/20 rounded-full blur-[120px] animate-pulse-glow pointer-events-none" />
        <div
          className="absolute -bottom-32 -right-10 w-96 h-96 bg-accent-violet/20 rounded-full blur-[140px] animate-pulse-glow pointer-events-none"
          style={{ animationDelay: "1.5s" }}
        />
        <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
        <div className="relative p-8 md:p-12 animate-fade-in-up">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-xs font-medium text-primary-300 mb-4">
                <Building2 className="w-3 h-3" />
                Empresa
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white font-heading leading-[1.1] tracking-tight">
                Pesquise antes da{" "}
                <span className="gradient-text">entrevista</span>
              </h1>
              <p className="text-gray-400 mt-4 text-base md:text-lg max-w-xl leading-relaxed">
                Descubra cultura, salários, processo seletivo e dicas personalizadas sobre qualquer empresa com IA.
              </p>
              <span className="inline-block mt-4 bg-primary-500/10 text-primary-400 text-xs rounded-lg px-2.5 py-1 border border-primary-500/20">
                1 crédito por análise
              </span>
            </div>
            {result && (
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-gray-300 rounded-xl hover:bg-white/10 transition-colors text-sm flex-shrink-0"
              >
                <RefreshCw className="w-4 h-4" /> Nova análise
              </button>
            )}
          </div>
        </div>
      </section>

      {!result ? (
        <fieldset disabled={loading} className="space-y-4 animate-fade-in-up animation-delay-200 border-0 m-0 min-w-0 p-0 disabled:opacity-60 disabled:cursor-not-allowed">
          <div className="grid grid-cols-1 gap-4">
            {/* Company name */}
            <div className="relative group bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] p-6 overflow-hidden transition-all duration-300 hover:border-primary-500/30">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-500/10 group-hover:bg-primary-500/20 rounded-full blur-3xl transition-all duration-500 pointer-events-none" />
              <div className="relative">
                <h2 className="font-semibold font-heading text-white flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-violet rounded-xl flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-4 h-4 text-white" />
                  </div>
                  Nome da empresa
                </h2>
                <input
                  type="text"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  disabled={loading}
                  placeholder="Ex: Nubank, Magazine Luiza, Google..."
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm disabled:opacity-50"
                />
              </div>
            </div>

            {/* Position */}
            <div className="relative group bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] p-6 overflow-hidden transition-all duration-300 hover:border-primary-500/30">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-sky-500/10 group-hover:bg-sky-500/20 rounded-full blur-3xl transition-all duration-500 pointer-events-none" />
              <div className="relative">
                <h2 className="font-semibold font-heading text-white flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-4 h-4 text-white" />
                  </div>
                  Vaga pretendida
                </h2>
                <input
                  type="text"
                  value={position}
                  onChange={e => setPosition(e.target.value)}
                  disabled={loading}
                  placeholder="Ex: Desenvolvedor Backend, Analista de Marketing..."
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm disabled:opacity-50"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={() => setShowConfirm(true)}
              disabled={!canAnalyze || loading}
              loading={loading}
              className="glow-blue"
            >
              <Search className="w-4 h-4 mr-2" />
              {loading ? "Analisando..." : "Analisar empresa"}
            </Button>
          </div>
        </fieldset>
      ) : (
        <div className="space-y-4 animate-fade-in-up animation-delay-200">
          <ResultView result={result} />
          <div className="flex justify-center">
            <Button onClick={handleDownloadPDF} disabled={pdfLoading} loading={pdfLoading} className="px-8 glow-blue">
              <Download className="w-4 h-4 mr-2" />
              Baixar PDF
            </Button>
          </div>
        </div>
      )}

      <AIProgressModal
        isOpen={loading}
        title="Analisando a empresa"
        message={progressMsg}
        progress={progress}
        steps={PROGRESS_MESSAGES}
        icon={Building2}
        accent="sky"
      />

      <SaveLimitModal
        isOpen={!!saver.confirmState}
        oldest={saver.confirmState?.oldest ?? null}
        loading={saver.saving}
        onConfirm={() => user && saver.confirmReplace(user.uid)}
        onCancel={saver.cancelReplace}
      />

      <Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)} title="Analisar empresa" size="sm">
        <div className="space-y-4">
          <p className="text-gray-300 text-sm">
            A análise de <span className="text-white font-semibold">{companyName}</span> custa{" "}
            <span className="text-primary-400 font-semibold">1 crédito</span>. Deseja continuar?
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setShowConfirm(false)}>Cancelar</Button>
            <Button onClick={() => { setShowConfirm(false); handleAnalyze(); }}>Confirmar</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
