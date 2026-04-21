"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAuthContext } from "@/components/providers/AuthProvider";
import Card, { CardBody, CardHeader } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import FileUpload from "@/components/ui/FileUpload";
import ScoreCircle from "@/components/ui/ScoreCircle";
import { extractTextFromFile } from "@/utils/file-parser";
import { deductCredits, checkCredits, hasUsedFeature } from "@/services/credits";
import { FileSearch, AlertTriangle, CheckCircle, Lightbulb, RefreshCw, Zap, Sparkles, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Modal from "@/components/ui/Modal";

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

interface CacheMetrics {
  promptTokens: number;
  completionTokens: number;
  cacheHitTokens: number;
  cacheMissTokens: number;
  cacheHitRate: number;
}

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
  const { user } = useAuthContext();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [cacheMetrics, setCacheMetrics] = useState<CacheMetrics | null>(null);
  const [isFirstUse, setIsFirstUse] = useState<boolean | null>(null);
  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState("");
  const [showAnalyzeConfirm, setShowAnalyzeConfirm] = useState(false);
  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!user) return;
    hasUsedFeature(user.uid, "resume-analysis").then((used) => setIsFirstUse(!used));
  }, [user]);

  const startProgress = useCallback(() => {
    setProgress(0);
    setProgressMsg(PROGRESS_MESSAGES[0]);
    let current = 0;
    progressInterval.current = setInterval(() => {
      current += 1;
      const target = Math.min(current, 90);
      setProgress(target);
      const msgIndex = Math.min(Math.floor(target / 10), PROGRESS_MESSAGES.length - 1);
      setProgressMsg(PROGRESS_MESSAGES[msgIndex]);
    }, 600);
  }, []);

  const stopProgress = useCallback(() => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
    setProgress(100);
    setProgressMsg("Analise concluida!");
  }, []);

  useEffect(() => {
    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, []);

  const handleDownloadPDF = useCallback(async () => {
    if (!result) return;
    try {
      const response = await fetch("/api/generate-analysis-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysis: result.analysis }),
      });
      if (!response.ok) throw new Error("Erro ao gerar PDF");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "analise-curriculo-nextcv.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Erro ao gerar PDF.");
    }
  }, [result]);

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

      const response = await fetch("/api/analyze-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, userId: user.uid }),
      });

      const data = await response.json();

      if (!data.success) throw new Error(data.error || "Erro desconhecido na API");

      if (usedBefore) {
        await deductCredits(user.uid, "resume-analysis", "Análise de currículo");
      } else {
        const { addDoc, collection, serverTimestamp } = await import("firebase/firestore");
        const { db } = await import("@/lib/firebase");
        await addDoc(collection(db, "users", user.uid, "transactions"), {
          amount: 0,
          type: "debit",
          feature: "resume-analysis",
          description: "Análise de currículo (primeira grátis)",
          createdAt: serverTimestamp(),
        });
      }

      stopProgress();
      setResult(data.data);
      if (data.cache) setCacheMetrics(data.cache);
      toast.success(usedBefore ? "Analise concluida!" : "Analise concluida! (primeira analise gratuita)");
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error("Resume analysis error:", msg);
      toast.error(msg);
    } finally {
      setLoading(false);
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
        progressInterval.current = null;
      }
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setCacheMetrics(null);
    setProgress(0);
    setProgressMsg("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white flex items-center gap-3">
            <FileSearch className="w-7 h-7 text-primary-400" />
            Analise de Curriculo
          </h1>
          <p className="text-gray-400 mt-1">Envie seu currículo e receba uma análise completa com IA.</p>
        </div>
        {result && (
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-gray-300 rounded-lg hover:bg-white/10 transition-colors text-sm"
          >
            <RefreshCw className="w-4 h-4" /> Nova analise
          </button>
        )}
      </div>

      {!result ? (
        <Card>
          <CardBody className="space-y-6">
            <FileUpload
              onFileSelect={setFile}
              selectedFile={file}
              onClear={() => setFile(null)}
            />
            <div className="flex items-center justify-between">
              <span className={`inline-flex items-center px-3 py-1 text-xs rounded-lg ${
                isFirstUse
                  ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                  : "bg-primary-500/10 border border-primary-500/20 text-primary-400"
              }`}>
                {isFirstUse ? "Primeira analise gratuita!" : "Custo: 1 credito"}
              </span>
              <Button onClick={() => setShowAnalyzeConfirm(true)} disabled={!file || loading} loading={loading}>
                {loading ? "Analisando..." : "Analisar currículo"}
              </Button>
            </div>

            {/* Progress bar */}
            {loading && (
              <div className="space-y-4 py-4">
                <div className="relative w-full h-3 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse rounded-full" />
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-400 animate-pulse">{progressMsg}</p>
                  <span className="text-xs text-gray-500 font-mono">{progress}%</span>
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Cache metrics badge */}
          {cacheMetrics && (
            <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl w-fit">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-emerald-300 font-medium">
                {cacheMetrics.cacheHitRate > 0
                  ? `Cache hit: ${cacheMetrics.cacheHitRate}% — ${cacheMetrics.cacheHitTokens} tokens cacheados de ${cacheMetrics.promptTokens}`
                  : `Primeiro uso — cache ativado para proximas analises (${cacheMetrics.promptTokens} tokens armazenados)`}
              </span>
            </div>
          )}

          {/* Overall Score */}
          <Card>
            <CardBody className="flex flex-col items-center py-8">
              <ScoreCircle score={result.analysis.overallScore} size="lg" />
              <h2 className="text-xl font-heading font-bold text-white mt-4">Pontuacao Geral</h2>
              <p className="text-gray-400 mt-1">
                {result.analysis.overallScore >= 80
                  ? "Excelente currículo!"
                  : result.analysis.overallScore >= 60
                  ? "Bom currículo, mas pode melhorar."
                  : "Seu currículo precisa de melhorias."}
              </p>
            </CardBody>
          </Card>

          {/* Scores breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardBody className="text-center">
                <ScoreCircle score={result.analysis.structure.score} size="sm" label="Estrutura" />
              </CardBody>
            </Card>
            <Card>
              <CardBody className="text-center">
                <ScoreCircle score={result.analysis.content.score} size="sm" label="Conteúdo" />
              </CardBody>
            </Card>
            <Card>
              <CardBody className="text-center">
                <ScoreCircle score={result.analysis.language.score} size="sm" label="Linguagem" />
              </CardBody>
            </Card>
          </div>

          {/* Strengths */}
          <Card>
            <CardHeader>
              <h3 className="font-heading font-semibold text-white flex items-center gap-2">
                <span className="p-1 bg-green-500/10 rounded-md">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </span>
                Pontos Fortes
              </h3>
            </CardHeader>
            <CardBody>
              <ul className="space-y-2">
                {result.analysis.strengths.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>

          {/* Weaknesses */}
          <Card>
            <CardHeader>
              <h3 className="font-heading font-semibold text-white flex items-center gap-2">
                <span className="p-1 bg-orange-500/10 rounded-md">
                  <AlertTriangle className="w-5 h-5 text-orange-400" />
                </span>
                Pontos Fracos
              </h3>
            </CardHeader>
            <CardBody>
              <ul className="space-y-2">
                {result.analysis.weaknesses.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <AlertTriangle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>

          {/* Suggestions */}
          <Card>
            <CardHeader>
              <h3 className="font-heading font-semibold text-white flex items-center gap-2">
                <span className="p-1 bg-primary-500/10 rounded-md">
                  <Lightbulb className="w-5 h-5 text-primary-400" />
                </span>
                Sugestoes de Melhoria
              </h3>
            </CardHeader>
            <CardBody>
              <ul className="space-y-2">
                {result.analysis.suggestions.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <Lightbulb className="w-4 h-4 text-primary-400 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>

          {/* Download PDF + CTA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardBody className="flex flex-col items-center text-center py-8 space-y-3">
                <div className="p-3 bg-blue-500/10 rounded-full">
                  <Download className="w-7 h-7 text-blue-400" />
                </div>
                <h3 className="text-lg font-heading font-bold text-white">Baixar Analise</h3>
                <p className="text-gray-400 text-sm">Salve a analise completa em PDF para consultar depois.</p>
                <Button onClick={handleDownloadPDF} className="mt-2">
                  <Download className="w-4 h-4 mr-2" />
                  Baixar PDF
                </Button>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="flex flex-col items-center text-center py-8 space-y-3">
                <div className="p-3 bg-primary-500/10 rounded-full">
                  <Sparkles className="w-7 h-7 text-primary-400" />
                </div>
                <h3 className="text-lg font-heading font-bold text-white">Corrigir Erros com IA</h3>
                <p className="text-gray-400 text-sm">Gere um novo currículo otimizado com as correções aplicadas.</p>
                <Button onClick={() => router.push("/dashboard/create-resume")} className="mt-2">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Gerar currículo otimizado
                </Button>
              </CardBody>
            </Card>
          </div>
        </div>
      )}

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
