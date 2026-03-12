"use client";

import { useState } from "react";
import { useAuthContext } from "@/components/providers/AuthProvider";
import Card, { CardBody, CardHeader } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import FileUpload from "@/components/ui/FileUpload";
import ScoreCircle from "@/components/ui/ScoreCircle";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { extractTextFromFile } from "@/utils/file-parser";
import { uploadFile } from "@/services/firebase-storage";
import { deductCredits, checkCredits } from "@/services/credits";
import { FileSearch, AlertTriangle, CheckCircle, Lightbulb, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

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
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!file || !user) return;

    const hasCredits = await checkCredits(user.uid, "resume-analysis");
    if (!hasCredits) {
      toast.error("Creditos insuficientes. Faca upgrade do seu plano.");
      return;
    }

    setLoading(true);
    try {
      const resumeText = await extractTextFromFile(file);
      await uploadFile(user.uid, file, "resumes");

      const response = await fetch("/api/analyze-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, userId: user.uid }),
      });

      const data = await response.json();

      if (!data.success) throw new Error(data.error || "Erro desconhecido na API");

      await deductCredits(user.uid, "resume-analysis", "Analise de curriculo");

      setResult(data.data);
      toast.success("Analise concluida!");
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error("Resume analysis error:", msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white flex items-center gap-3">
            <FileSearch className="w-7 h-7 text-primary-400" />
            Analise de Curriculo
          </h1>
          <p className="text-gray-400 mt-1">Envie seu curriculo e receba uma analise completa com IA.</p>
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
              <span className="inline-flex items-center px-3 py-1 bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs rounded-lg">Custo: 1 credito</span>
              <Button onClick={handleAnalyze} disabled={!file || loading} loading={loading}>
                {loading ? "Analisando..." : "Analisar curriculo"}
              </Button>
            </div>
            {loading && (
              <div className="py-8">
                <LoadingSpinner size="lg" text="Analisando seu curriculo com IA..." />
              </div>
            )}
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Overall Score */}
          <Card>
            <CardBody className="flex flex-col items-center py-8">
              <ScoreCircle score={result.analysis.overallScore} size="lg" />
              <h2 className="text-xl font-heading font-bold text-white mt-4">Pontuacao Geral</h2>
              <p className="text-gray-400 mt-1">
                {result.analysis.overallScore >= 80
                  ? "Excelente curriculo!"
                  : result.analysis.overallScore >= 60
                  ? "Bom curriculo, mas pode melhorar."
                  : "Seu curriculo precisa de melhorias."}
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
                <ScoreCircle score={result.analysis.content.score} size="sm" label="Conteudo" />
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

          {/* Rewrite suggestions */}
          {result.analysis.rewriteSuggestions?.length > 0 && (
            <Card>
              <CardHeader>
                <h3 className="font-heading font-semibold text-white">Reescritas Sugeridas</h3>
              </CardHeader>
              <CardBody className="space-y-4">
                {result.analysis.rewriteSuggestions.map((item, i) => (
                  <div key={i} className="p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl space-y-3">
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <span className="text-xs font-medium text-red-400 uppercase">Original</span>
                      <p className="text-sm text-gray-400 mt-1 line-through">{item.original}</p>
                    </div>
                    <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <span className="text-xs font-medium text-green-400 uppercase">Sugerido</span>
                      <p className="text-sm text-white mt-1 font-medium">{item.suggested}</p>
                    </div>
                    <p className="text-xs text-gray-500">{item.reason}</p>
                  </div>
                ))}
              </CardBody>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
