"use client";

import { useState } from "react";
import { useAuthContext } from "@/components/providers/AuthProvider";
import Card, { CardBody, CardHeader } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import FileUpload from "@/components/ui/FileUpload";
import ScoreCircle from "@/components/ui/ScoreCircle";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { extractTextFromFile } from "@/utils/file-parser";
import { deductCredits, checkCredits } from "@/services/credits";
import { Target, RefreshCw, CheckCircle, Lightbulb } from "lucide-react";
import toast from "react-hot-toast";

interface AdaptResult {
  compatibilityScore: number;
  keywords: string[];
  adaptedResume: Record<string, unknown>;
  suggestions: string[];
  changes: { section: string; original: string; adapted: string; reason: string }[];
}

export default function AdaptResumePage() {
  const { user } = useAuthContext();
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AdaptResult | null>(null);

  const handleAdapt = async () => {
    if (!file || !user || !jobDescription.trim()) return;

    const hasCredits = await checkCredits(user.uid, "resume-adaptation");
    if (!hasCredits) { toast.error("Creditos insuficientes."); return; }

    setLoading(true);
    try {
      const resumeText = await extractTextFromFile(file);
      const response = await fetch("/api/adapt-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jobDescription, userId: user.uid }),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error);

      await deductCredits(user.uid, "resume-adaptation", "Adaptacao de curriculo para vaga");
      setResult(data.data);
      toast.success("Adaptacao concluida!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao adaptar curriculo.");
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white flex items-center gap-3">
            <Target className="w-7 h-7 text-primary-400" />
            Adaptar para Vaga
          </h1>
          <p className="text-gray-400 mt-1">Adapte seu curriculo para uma vaga especifica.</p>
        </div>
        {result && (
          <button
            onClick={() => setResult(null)}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-gray-300 rounded-lg hover:bg-white/10 transition-colors text-sm"
          >
            <RefreshCw className="w-4 h-4" /> Nova adaptacao
          </button>
        )}
      </div>

      {!result ? (
        <Card>
          <CardBody className="space-y-4">
            <FileUpload onFileSelect={setFile} selectedFile={file} onClear={() => setFile(null)} />
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Descricao da vaga</label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent min-h-[200px]"
                placeholder="Cole aqui a descricao completa da vaga..."
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="inline-flex items-center px-3 py-1 bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs rounded-lg">Custo: 1 credito</span>
              <Button onClick={handleAdapt} disabled={!file || !jobDescription.trim() || loading} loading={loading}>
                Adaptar curriculo
              </Button>
            </div>
            {loading && <div className="py-8"><LoadingSpinner size="lg" text="Adaptando curriculo com IA..." /></div>}
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardBody className="flex flex-col items-center py-8">
              <ScoreCircle score={result.compatibilityScore} size="lg" />
              <h2 className="text-xl font-heading font-bold text-white mt-4">Compatibilidade</h2>
              <p className="text-gray-400 mt-1">
                {result.compatibilityScore >= 80 ? "Excelente compatibilidade!" : result.compatibilityScore >= 60 ? "Boa compatibilidade." : "Compatibilidade pode melhorar."}
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="font-heading font-semibold text-white">Palavras-chave Identificadas</h3>
            </CardHeader>
            <CardBody>
              <div className="flex flex-wrap gap-2">
                {result.keywords.map((kw, i) => (
                  <span key={i} className="px-3 py-1 bg-primary-500/10 border border-primary-500/20 text-primary-300 rounded-lg text-sm">{kw}</span>
                ))}
              </div>
            </CardBody>
          </Card>

          {result.changes?.length > 0 && (
            <Card>
              <CardHeader><h3 className="font-heading font-semibold text-white">Mudancas Realizadas</h3></CardHeader>
              <CardBody className="space-y-4">
                {result.changes.map((change, i) => (
                  <div key={i} className="p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl space-y-3">
                    <span className="text-xs font-medium text-primary-400 uppercase">{change.section}</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <span className="text-xs text-red-400 font-medium">Original</span>
                        <p className="text-sm text-gray-400 mt-1">{change.original}</p>
                      </div>
                      <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <span className="text-xs text-green-400 font-medium">Adaptado</span>
                        <p className="text-sm text-white mt-1 font-medium">{change.adapted}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">{change.reason}</p>
                  </div>
                ))}
              </CardBody>
            </Card>
          )}

          <Card>
            <CardHeader>
              <h3 className="font-heading font-semibold text-white flex items-center gap-2">
                <span className="p-1 bg-primary-500/10 rounded-md">
                  <Lightbulb className="w-5 h-5 text-primary-400" />
                </span>
                Sugestoes Adicionais
              </h3>
            </CardHeader>
            <CardBody>
              <ul className="space-y-2">
                {result.suggestions.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <CheckCircle className="w-4 h-4 text-primary-400 mt-0.5 flex-shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}
