"use client";

import { useState } from "react";
import { useAuthContext } from "@/components/providers/AuthProvider";
import Card, { CardBody, CardHeader } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ScoreCircle from "@/components/ui/ScoreCircle";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { deductCredits, checkCredits } from "@/services/credits";
import { Linkedin, CheckCircle, Lightbulb, RefreshCw, Copy } from "lucide-react";
import toast from "react-hot-toast";

interface LinkedInResult {
  overallScore: number;
  profileStructure: { clarity: string; organization: string; professionalConsistency: string };
  seo: { score: number; relevantKeywords: string[]; headlineOptimization: string; aboutOptimization: string };
  sections: Record<string, string>;
  suggestedHeadline: string;
  suggestedAbout: string;
  recommendedKeywords: string[];
  improvements: string[];
  strengths: string[];
}

export default function LinkedInAnalysisPage() {
  const { user } = useAuthContext();
  const [profileUrl, setProfileUrl] = useState("");
  const [profileDescription, setProfileDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LinkedInResult | null>(null);

  const handleAnalyze = async () => {
    if (!user || !profileDescription.trim()) return;

    const hasCredits = await checkCredits(user.uid, "linkedin-analysis");
    if (!hasCredits) {
      toast.error("Creditos insuficientes.");
      return;
    }

    setLoading(true);
    try {
      const profileData = `URL: ${profileUrl}\n\nInformacoes do perfil:\n${profileDescription}`;

      const response = await fetch("/api/analyze-linkedin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileData, userId: user.uid }),
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.error);

      await deductCredits(user.uid, "linkedin-analysis", "Analise de perfil LinkedIn");
      setResult(data.data);
      toast.success("Analise concluida!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao analisar perfil. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copiado!");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white flex items-center gap-3">
            <Linkedin className="w-7 h-7 text-primary-400" />
            Analise de Perfil LinkedIn
          </h1>
          <p className="text-gray-400 mt-1">Otimize seu perfil do LinkedIn com IA.</p>
        </div>
        {result && (
          <button
            onClick={() => setResult(null)}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-gray-300 rounded-lg hover:bg-white/10 transition-colors text-sm"
          >
            <RefreshCw className="w-4 h-4" /> Nova analise
          </button>
        )}
      </div>

      {!result ? (
        <Card>
          <CardBody className="space-y-4">
            <Input
              label="Link do perfil (opcional)"
              value={profileUrl}
              onChange={(e) => setProfileUrl(e.target.value)}
              placeholder="https://linkedin.com/in/seu-usuario"
            />
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Informacoes do perfil
              </label>
              <textarea
                value={profileDescription}
                onChange={(e) => setProfileDescription(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent min-h-[200px]"
                placeholder={`Cole aqui as informações do seu perfil do LinkedIn:\n\n- Headline\n- Seção Sobre\n- Experiências\n- Formação\n- Habilidades\n- Certificações`}
              />
              <p className="text-xs text-gray-500 mt-1">
                Copie e cole as informações do seu perfil do LinkedIn para análise.
              </p>
            </div>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center px-3 py-1 bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs rounded-lg">Custo: 1 credito</span>
              <Button onClick={handleAnalyze} disabled={!profileDescription.trim() || loading} loading={loading}>
                {loading ? "Analisando..." : "Analisar perfil"}
              </Button>
            </div>
            {loading && (
              <div className="py-8">
                <LoadingSpinner size="lg" text="Analisando seu perfil com IA..." />
              </div>
            )}
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Score */}
          <Card>
            <CardBody className="flex flex-col items-center py-8">
              <ScoreCircle score={result.overallScore} size="lg" />
              <h2 className="text-xl font-heading font-bold text-white mt-4">Pontuacao do Perfil</h2>
            </CardBody>
          </Card>

          {/* SEO Score */}
          <Card>
            <CardBody className="text-center">
              <ScoreCircle score={result.seo.score} size="md" label="SEO do Perfil" />
            </CardBody>
          </Card>

          {/* Suggested Headline */}
          <Card>
            <CardHeader>
              <h3 className="font-heading font-semibold text-white">Headline Sugerido</h3>
            </CardHeader>
            <CardBody>
              <div className="flex items-start gap-3 p-4 bg-primary-500/10 border border-primary-500/20 rounded-xl">
                <p className="text-sm text-gray-300 flex-1">{result.suggestedHeadline}</p>
                <button onClick={() => copyToClipboard(result.suggestedHeadline)} className="p-1.5 bg-white/5 hover:bg-white/10 text-gray-400 rounded-lg transition-colors">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </CardBody>
          </Card>

          {/* Suggested About */}
          <Card>
            <CardHeader>
              <h3 className="font-heading font-semibold text-white">Seção Sobre Sugerida</h3>
            </CardHeader>
            <CardBody>
              <div className="flex items-start gap-3 p-4 bg-primary-500/10 border border-primary-500/20 rounded-xl">
                <p className="text-sm text-gray-300 flex-1 whitespace-pre-line">{result.suggestedAbout}</p>
                <button onClick={() => copyToClipboard(result.suggestedAbout)} className="p-1.5 bg-white/5 hover:bg-white/10 text-gray-400 rounded-lg transition-colors flex-shrink-0">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </CardBody>
          </Card>

          {/* Keywords */}
          <Card>
            <CardHeader>
              <h3 className="font-heading font-semibold text-white">Palavras-chave Recomendadas</h3>
            </CardHeader>
            <CardBody>
              <div className="flex flex-wrap gap-2">
                {result.recommendedKeywords.map((kw, i) => (
                  <span key={i} className="px-3 py-1 bg-primary-500/10 border border-primary-500/20 text-primary-300 rounded-lg text-sm">
                    {kw}
                  </span>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Strengths & Improvements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  {result.strengths.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="font-heading font-semibold text-white flex items-center gap-2">
                  <span className="p-1 bg-primary-500/10 rounded-md">
                    <Lightbulb className="w-5 h-5 text-primary-400" />
                  </span>
                  Melhorias
                </h3>
              </CardHeader>
              <CardBody>
                <ul className="space-y-2">
                  {result.improvements.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <Lightbulb className="w-4 h-4 text-primary-400 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
