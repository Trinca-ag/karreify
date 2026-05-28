"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuthContext } from "@/components/providers/AuthProvider";
import Button from "@/components/ui/Button";
import FileUpload from "@/components/ui/FileUpload";
import ScoreCircle from "@/components/ui/ScoreCircle";
import { extractTextFromFile } from "@/utils/file-parser";
import { checkCredits, hasUsedFeature } from "@/services/credits";
import { authedFetch } from "@/lib/api-client";
import { FileSearch, AlertTriangle, CheckCircle, Lightbulb, RefreshCw, Sparkles, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import Modal from "@/components/ui/Modal";
import SaveButton from "@/components/ui/SaveButton";

const AIProgressModal = dynamic(() => import("@/components/ui/AIProgressModal"), { ssr: false });
const SaveLimitModal = dynamic(() => import("@/components/ui/SaveLimitModal"), { ssr: false });
const SaveSuccessModal = dynamic(() => import("@/components/ui/SaveSuccessModal"), { ssr: false });
import { useSavedItemSaver } from "@/hooks/useSavedItemSaver";
import { useAIProgress } from "@/hooks/useAIProgress";

const PROGRESS_MESSAGES = [
  "Enviando seu currículo...",
  "Extraindo informações do documento...",
  "Analisando estrutura e formatação...",
  "Avaliando conteúdo e experiências...",
  "Verificando linguagem e gramática...",
  "Identificando pontos fortes...",
  "Mapeando áreas de melhoria...",
  "Gerando sugestões personalizadas...",
  "Calculando pontuação final...",
  "Finalizando análise...",
];

interface AnalysisResult {
  extractedData: Record<string, unknown>;
  analysis: {
    overallScore: number;
    structure: { score: number; organization: string; clarity: string; hierarchy: string; size: string; scanability: string };
    content: { score: number; missingInfo: string[]; vagueDescriptions: string[]; missingMetrics: string[]; poorExplanations: string[]; repeatedSkills: string[] };
    language: { score: number; spellingErrors: string[]; grammarErrors: string[]; poorStructure: string[]; unprofessionalLanguage: string[] };
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    rewriteSuggestions: { original: string; suggested: string; reason: string }[];
  };
}

export default function ResumeAnalysisPage() {
  const { user, userData } = useAuthContext();
  const router = useRouter();
  const saver = useSavedItemSaver();
  const autoSaveEnabled = userData?.autoSaveDocuments ?? false;
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isFirstUse, setIsFirstUse] = useState<boolean | null>(null);
  const [showAnalyzeConfirm, setShowAnalyzeConfirm] = useState(false);
  const {
    progress,
    message: progressMsg,
    start: startProgress,
    stop: stopProgress,
    reset: resetProgress,
  } = useAIProgress({
    messages: PROGRESS_MESSAGES,
    finalMessage: "Análise concluída!",
    expectedDuration: 14,
  });

  useEffect(() => {
    if (!user) return;
    hasUsedFeature(user.uid, "resume-analysis").then((used) => setIsFirstUse(!used));
  }, [user]);

  const handleDownloadPDF = useCallback(async () => {
    if (!result) return;
    try {
      const response = await authedFetch("/api/generate-analysis-pdf", {
        method: "POST",
        body: JSON.stringify({ analysis: result.analysis }),
      });
      if (!response.ok) throw new Error("Erro ao gerar PDF");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "analise-curriculo-karreify.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Erro ao gerar PDF.");
    }
  }, [result]);

  const prepareAnalysisSave = useCallback(
    async (analysis: AnalysisResult["analysis"], originalName: string, notificationId?: string) => {
      if (!user) return;
      try {
        const response = await authedFetch("/api/generate-analysis-pdf", {
          method: "POST",
          body: JSON.stringify({ analysis }),
        });
        if (!response.ok) return;
        const blob = await response.blob();
        const ts = Date.now();
        const cleanName = originalName.replace(/\.(pdf|docx?|txt)$/i, "");
        await saver.prepare({
          uid: user.uid,
          type: "resume-analysis",
          payload: {
            kind: "pdf",
            data: {
              type: "resume-analysis",
              title: `Análise — ${cleanName || "currículo"}`,
              subtitle: `Pontuação ${analysis.overallScore}/100`,
              fileName: `analise-curriculo-${ts}.pdf`,
              pdf: blob,
            },
          },
          autoSave: autoSaveEnabled,
          notificationId,
        });
      } catch {
        /* silent — user still has the result on screen */
      }
    },
    [user, saver, autoSaveEnabled]
  );

  const handleAnalyze = async () => {
    if (!file || !user) return;

    const usedBefore = await hasUsedFeature(user.uid, "resume-analysis");
    setIsFirstUse(!usedBefore);

    if (usedBefore) {
      const hasCredits = await checkCredits(user.uid, "resume-analysis");
      if (!hasCredits) {
        toast.error("Moedas insuficientes. Compre um pacote para continuar.");
        return;
      }
    }

    setLoading(true);
    startProgress();
    try {
      const resumeText = await extractTextFromFile(file);

      // PDFs escaneados/somente imagens devolvem string vazia ou muito curta.
      // Bloqueia aqui para o usuário não chegar ao backend (e perder crédito)
      // por um arquivo do qual não conseguimos ler texto.
      if (resumeText.trim().length < 50) {
        throw new Error(
          "Não conseguimos ler o texto do seu arquivo. Se é um PDF escaneado ou só com imagens, tente exportá-lo novamente como PDF de texto ou envie um arquivo .docx."
        );
      }

      const response = await authedFetch("/api/analyze-resume", {
        method: "POST",
        body: JSON.stringify({ resumeText }),
      });

      const data = await response.json();

      if (!data.success) throw new Error(data.error || "Erro ao analisar currículo. Tente novamente.");

      stopProgress();
      setResult(data.data);
      toast.success(data.wasFree ? "Analise concluida! (primeira analise gratuita)" : "Analise concluida!");
      void prepareAnalysisSave(data.data.analysis, file.name, data.notificationId);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error("Resume analysis error:", msg);
      toast.error(msg, { duration: 6000 });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    resetProgress();
    saver.reset();
  };

  const handleManualSave = () => {
    if (!user) return;
    saver.saveManually(user.uid);
  };

  return (
    <div className="relative space-y-6 pb-8">
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
            <FileSearch className="w-3 h-3" />
            Análise de Currículo
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white font-heading leading-[1.1] tracking-tight">
            Receba feedback inteligente da{" "}
            <span className="gradient-text">IA</span>
          </h1>
          <p className="text-gray-400 mt-4 text-base md:text-lg max-w-xl leading-relaxed">
            Envie seu currículo e receba uma análise completa com pontuação, pontos fortes, fraquezas e sugestões personalizadas.
          </p>
        </div>
      </section>

      {!result ? (
        <div className="relative group bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] hover:border-primary-500/30 transition-all duration-300 overflow-hidden animate-fade-in-up animation-delay-200">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-500/10 group-hover:bg-primary-500/20 rounded-full blur-3xl transition-all duration-500 pointer-events-none" />
          <fieldset disabled={loading} className="relative p-6 md:p-8 space-y-6 border-0 m-0 min-w-0 disabled:opacity-60 disabled:cursor-not-allowed">
            <FileUpload
              onFileSelect={setFile}
              selectedFile={file}
              onClear={() => setFile(null)}
              disabled={loading}
            />
            <div className="flex items-center justify-between">
              <span className={`inline-flex items-center px-3 py-1 text-xs rounded-lg ${
                isFirstUse
                  ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                  : "bg-primary-500/10 border border-primary-500/20 text-primary-400"
              }`}>
                {isFirstUse ? "Primeira analise gratuita!" : "Custo: 1 credito"}
              </span>
              <Button onClick={() => setShowAnalyzeConfirm(true)} disabled={!file || loading} loading={loading} className="glow-blue">
                {loading ? "Analisando..." : "Analisar currículo"}
              </Button>
            </div>

          </fieldset>
        </div>
      ) : (
        <div className="space-y-6">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-gray-300 rounded-xl hover:bg-white/10 transition-colors text-sm"
          >
            <RefreshCw className="w-4 h-4" /> Nova análise
          </button>

          {/* Overall Score */}
          <div className="relative group bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] hover:border-primary-500/30 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden animate-fade-in-up animation-delay-200">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-500/10 group-hover:bg-primary-500/20 rounded-full blur-3xl transition-all duration-500 pointer-events-none" />
            <div className="relative p-8 flex flex-col items-center">
              <ScoreCircle score={result.analysis.overallScore} size="lg" />
              <h2 className="text-xl font-heading font-bold text-white mt-4">Pontuacao Geral</h2>
              <p className="text-gray-400 mt-1">
                {result.analysis.overallScore >= 80
                  ? "Excelente currículo!"
                  : result.analysis.overallScore >= 60
                  ? "Bom currículo, mas pode melhorar."
                  : "Seu currículo precisa de melhorias."}
              </p>
            </div>
          </div>

          {/* Scores breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in-up animation-delay-300">
            {[
              { score: result.analysis.structure.score, label: "Estrutura" },
              { score: result.analysis.content.score, label: "Conteúdo" },
              { score: result.analysis.language.score, label: "Linguagem" },
            ].map(({ score, label }) => (
              <div key={label} className="relative group bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] hover:border-primary-500/30 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-500/10 group-hover:bg-primary-500/20 rounded-full blur-3xl transition-all duration-500 pointer-events-none" />
                <div className="relative p-6 text-center">
                  <ScoreCircle score={score} size="sm" label={label} />
                </div>
              </div>
            ))}
          </div>

          {/* Strengths */}
          <div className="relative group bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] hover:border-primary-500/30 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden animate-fade-in-up animation-delay-400">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 group-hover:bg-emerald-500/20 rounded-full blur-3xl transition-all duration-500 pointer-events-none" />
            <div className="relative p-6">
              <h3 className="font-heading font-semibold text-white flex items-center gap-2 mb-4">
                <span className="p-1.5 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl">
                  <CheckCircle className="w-4 h-4 text-white" />
                </span>
                Pontos Fortes
              </h3>
              <ul className="space-y-2">
                {result.analysis.strengths.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Weaknesses */}
          <div className="relative group bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] hover:border-primary-500/30 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden animate-fade-in-up animation-delay-400">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500/10 group-hover:bg-orange-500/20 rounded-full blur-3xl transition-all duration-500 pointer-events-none" />
            <div className="relative p-6">
              <h3 className="font-heading font-semibold text-white flex items-center gap-2 mb-4">
                <span className="p-1.5 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl">
                  <AlertTriangle className="w-4 h-4 text-white" />
                </span>
                Pontos Fracos
              </h3>
              <ul className="space-y-2">
                {result.analysis.weaknesses.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <AlertTriangle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Suggestions */}
          <div className="relative group bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] hover:border-primary-500/30 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden animate-fade-in-up animation-delay-500">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-500/10 group-hover:bg-primary-500/20 rounded-full blur-3xl transition-all duration-500 pointer-events-none" />
            <div className="relative p-6">
              <h3 className="font-heading font-semibold text-white flex items-center gap-2 mb-4">
                <span className="p-1.5 bg-gradient-to-br from-primary-500 to-accent-violet rounded-xl">
                  <Lightbulb className="w-4 h-4 text-white" />
                </span>
                Sugestoes de Melhoria
              </h3>
              <ul className="space-y-2">
                {result.analysis.suggestions.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <Lightbulb className="w-4 h-4 text-primary-400 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Download PDF + CTA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in-up animation-delay-500">
            <div className="relative group bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] hover:border-primary-500/30 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 group-hover:bg-blue-500/20 rounded-full blur-3xl transition-all duration-500 pointer-events-none" />
              <div className="relative p-8 flex flex-col items-center text-center space-y-3">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-black/20">
                  <Download className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-heading font-bold text-white">Baixar Analise</h3>
                <p className="text-gray-400 text-sm">Salve a analise completa em PDF para consultar depois.</p>
                <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
                  <Button onClick={handleDownloadPDF} className="glow-blue">
                    <Download className="w-4 h-4 mr-2" />
                    Baixar PDF
                  </Button>
                  <SaveButton
                    status={saver.status}
                    saving={saver.saving}
                    onClick={handleManualSave}
                  />
                </div>
              </div>
            </div>

            <div className="relative group bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] hover:border-primary-500/30 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-500/10 group-hover:bg-primary-500/20 rounded-full blur-3xl transition-all duration-500 pointer-events-none" />
              <div className="relative p-8 flex flex-col items-center text-center space-y-3">
                <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-accent-violet rounded-2xl flex items-center justify-center shadow-lg shadow-black/20">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-heading font-bold text-white">Corrigir Erros com IA</h3>
                <p className="text-gray-400 text-sm">Gere um novo currículo otimizado com as correções aplicadas.</p>
                <Button onClick={() => router.push("/create-resume")} className="mt-2 glow-blue">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Gerar currículo otimizado
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <AIProgressModal
        isOpen={loading}
        title="Analisando seu currículo"
        message={progressMsg}
        progress={progress}
        steps={PROGRESS_MESSAGES}
        icon={FileSearch}
        accent="primary"
      />

      <SaveLimitModal
        isOpen={!!saver.confirmState}
        oldest={saver.confirmState?.oldest ?? null}
        loading={saver.saving}
        onConfirm={() => user && saver.confirmReplace(user.uid)}
        onCancel={saver.cancelReplace}
      />
      <SaveSuccessModal
        isOpen={saver.successOpen}
        onClose={saver.closeSuccess}
      />

      <Modal isOpen={showAnalyzeConfirm} onClose={() => setShowAnalyzeConfirm(false)} title="Analisar currículo" size="sm">
        <div className="space-y-4">
          <p className="text-gray-300 text-sm">
            {isFirstUse
              ? "Sua primeira análise é gratuita! Deseja continuar?"
              : <>A análise de currículo custa <span className="text-primary-400 font-semibold">1 crédito</span>. Deseja continuar?</>}
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setShowAnalyzeConfirm(false)}>Cancelar</Button>
            <Button onClick={() => { setShowAnalyzeConfirm(false); handleAnalyze(); }}>Confirmar</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
