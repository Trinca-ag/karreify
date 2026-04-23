"use client";

import { useCallback, useState, useRef } from "react";
import { useAuthContext } from "@/components/providers/AuthProvider";
import Card, { CardBody, CardHeader } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import SaveLimitModal from "@/components/ui/SaveLimitModal";
import { useSavedItemSaver } from "@/hooks/useSavedItemSaver";
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
      <Card>
        <CardBody>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
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
        </CardBody>
      </Card>

      {/* Overview */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold font-heading text-white flex items-center gap-2">
            <Info className="w-5 h-5 text-primary-400" />
            Visão Geral
          </h3>
        </CardHeader>
        <CardBody>
          <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">{result.overview}</p>
        </CardBody>
      </Card>

      {/* History + Culture */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <h3 className="font-semibold font-heading text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-violet-400" />
              História
            </h3>
          </CardHeader>
          <CardBody>
            <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">{result.history}</p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="font-semibold font-heading text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-teal-400" />
              Cultura Organizacional
            </h3>
          </CardHeader>
          <CardBody>
            <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">{result.culture}</p>
          </CardBody>
        </Card>
      </div>

      {/* Employee reviews */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold font-heading text-white flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" />
            Avaliações de Funcionários
          </h3>
        </CardHeader>
        <CardBody>
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
        </CardBody>
      </Card>

      {/* Salary */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold font-heading text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            Remuneração — {result.salaryInfo.position}
          </h3>
        </CardHeader>
        <CardBody>
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
        </CardBody>
      </Card>

      {/* Interview process + Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <h3 className="font-semibold font-heading text-white flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-blue-400" />
              Processo Seletivo
            </h3>
          </CardHeader>
          <CardBody>
            <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">{result.interviewProcess}</p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="font-semibold font-heading text-white flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-400" />
              Dicas para a Entrevista
            </h3>
          </CardHeader>
          <CardBody>
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
          </CardBody>
        </Card>
      </div>

      {/* Contact + Other locations */}
      {(hasContact || result.otherLocations?.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {hasContact && (
            <Card>
              <CardHeader>
                <h3 className="font-semibold font-heading text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary-400" />
                  Contato
                </h3>
              </CardHeader>
              <CardBody>
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
              </CardBody>
            </Card>
          )}

          {result.otherLocations?.length > 0 && (
            <Card>
              <CardHeader>
                <h3 className="font-semibold font-heading text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary-400" />
                  Outras Localidades
                </h3>
              </CardHeader>
              <CardBody>
                <ul className="space-y-2">
                  {result.otherLocations.map((loc, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0" />
                      {loc}
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
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
  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState("");
  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null);

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

  const startProgress = () => {
    setProgress(0);
    setProgressMsg(PROGRESS_MESSAGES[0]);
    let i = 0;
    progressInterval.current = setInterval(() => {
      i += 1;
      const pct = Math.min(i * 14, 90);
      setProgress(pct);
      setProgressMsg(PROGRESS_MESSAGES[Math.min(Math.floor(pct / 15), PROGRESS_MESSAGES.length - 1)]);
    }, 900);
  };

  const stopProgress = () => {
    if (progressInterval.current) { clearInterval(progressInterval.current); progressInterval.current = null; }
    setProgress(100);
    setProgressMsg("Análise concluída!");
  };

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
      if (progressInterval.current) { clearInterval(progressInterval.current); progressInterval.current = null; }
    }
  };

  const handleReset = () => {
    setResult(null);
    setCompanyName("");
    setPosition("");
    setProgress(0);
    setProgressMsg("");
  };

  const canAnalyze = companyName.trim().length > 1 && position.trim().length > 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white flex items-center gap-3">
            <Building2 className="w-7 h-7 text-primary-400" />
            Análise de Empresa
          </h1>
          <p className="text-gray-400 mt-1">Pesquise tudo sobre a empresa antes da sua entrevista.</p>
          <span className="inline-block mt-2 bg-primary-500/10 text-primary-400 text-xs rounded-lg px-2.5 py-1">1 crédito por análise</span>
        </div>
        {result && (
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-gray-300 rounded-lg hover:bg-white/10 transition-colors text-sm"
          >
            <RefreshCw className="w-4 h-4" /> Nova análise
          </button>
        )}
      </div>

      {!result ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <Card>
              <CardHeader>
                <h2 className="font-semibold font-heading text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary-400" />
                  Nome da empresa
                </h2>
              </CardHeader>
              <CardBody>
                <input
                  type="text"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  disabled={loading}
                  placeholder="Ex: Nubank, Magazine Luiza, Google..."
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm disabled:opacity-50"
                />
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="font-semibold font-heading text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary-400" />
                  Vaga pretendida
                </h2>
              </CardHeader>
              <CardBody>
                <input
                  type="text"
                  value={position}
                  onChange={e => setPosition(e.target.value)}
                  disabled={loading}
                  placeholder="Ex: Desenvolvedor Backend, Analista de Marketing..."
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm disabled:opacity-50"
                />
              </CardBody>
            </Card>
          </div>

          {/* Progress */}
          {loading && (
            <Card>
              <CardBody className="space-y-3 py-6">
                <div className="relative w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-600 to-primary-400 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-gray-400 animate-pulse">{progressMsg}</p>
                  <span className="text-xs text-gray-500 font-mono">{progress}%</span>
                </div>
              </CardBody>
            </Card>
          )}

          <div className="flex justify-end">
            <Button onClick={() => setShowConfirm(true)} disabled={!canAnalyze || loading} loading={loading}>
              {loading ? "Analisando..." : "Analisar empresa"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <ResultView result={result} />
          <div className="flex justify-center">
            <Button onClick={handleDownloadPDF} disabled={pdfLoading} loading={pdfLoading} className="px-8">
              <Download className="w-4 h-4 mr-2" />
              Baixar PDF
            </Button>
          </div>
        </div>
      )}

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
