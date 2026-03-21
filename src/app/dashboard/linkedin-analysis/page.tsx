"use client";

import { useState } from "react";
import { useAuthContext } from "@/components/providers/AuthProvider";
import Card, { CardBody, CardHeader } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import ScoreCircle from "@/components/ui/ScoreCircle";
import Modal from "@/components/ui/Modal";
import { deductCredits, checkCredits } from "@/services/credits";
import {
  Linkedin, CheckCircle, Lightbulb, RefreshCw, Copy,
  Search, Brain, AlertTriangle, ExternalLink,
} from "lucide-react";
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

type Step = "idle" | "fetching" | "analyzing" | "done";

const STEPS = [
  { key: "fetching", icon: Search, label: "Buscando perfil no LinkedIn..." },
  { key: "analyzing", icon: Brain, label: "Analisando com IA..." },
];

function StepIndicator({ current }: { current: Step }) {
  return (
    <div className="flex flex-col gap-3 py-6">
      {STEPS.map(({ key, icon: Icon, label }) => {
        const isActive = current === key;
        const isDone = current === "analyzing" && key === "fetching" || current === "done";
        return (
          <div key={key} className={`flex items-center gap-3 transition-opacity ${isActive ? "opacity-100" : isDone ? "opacity-50" : "opacity-25"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isActive ? "bg-primary-500/20 border border-primary-500/40" : "bg-white/5"}`}>
              {isActive ? (
                <div className="w-3 h-3 rounded-full bg-primary-400 animate-pulse" />
              ) : (
                <Icon className="w-4 h-4 text-gray-500" />
              )}
            </div>
            <span className={`text-sm ${isActive ? "text-white font-medium" : "text-gray-500"}`}>{label}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function LinkedInAnalysisPage() {
  const { user } = useAuthContext();
  const [url, setUrl] = useState("");
  const [step, setStep] = useState<Step>("idle");
  const [result, setResult] = useState<LinkedInResult | null>(null);
  const [hasRichData, setHasRichData] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  const loading = step === "fetching" || step === "analyzing";

  const validateUrl = (val: string) => {
    const clean = val.trim().replace(/\/$/, "");
    return /^https?:\/\/(www\.)?linkedin\.com\/in\/[\w%-]+$/i.test(clean);
  };

  const handleAnalyze = async () => {
    if (!user || !url.trim()) return;

    if (!validateUrl(url)) {
      toast.error("URL inválida. Use o formato: linkedin.com/in/seu-usuario");
      return;
    }

    const hasCredits = await checkCredits(user.uid, "linkedin-analysis");
    if (!hasCredits) { toast.error("Créditos insuficientes."); return; }

    setStep("fetching");
    try {
      // Step 1: fetch profile data from LinkedIn
      const fetchRes = await fetch("/api/fetch-linkedin-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const fetchData = await fetchRes.json();
      if (!fetchRes.ok) throw new Error(fetchData.error || "Erro ao buscar perfil");

      setHasRichData(fetchData.hasRichData);

      // Step 2: AI analysis
      setStep("analyzing");
      const analyzeRes = await fetch("/api/analyze-linkedin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileData: fetchData.profileText, userId: user.uid }),
      });
      const analyzeData = await analyzeRes.json();
      if (!analyzeData.success) throw new Error(analyzeData.error);

      await deductCredits(user.uid, "linkedin-analysis", "Análise de perfil LinkedIn");
      setResult(analyzeData.data);
      setStep("done");
      toast.success("Análise concluída!");
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Erro ao analisar perfil.";
      toast.error(msg);
      setStep("idle");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copiado!");
  };

  const openLinkedIn = () => {
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white flex items-center gap-3">
            <Linkedin className="w-7 h-7 text-primary-400" />
            Análise de Perfil LinkedIn
          </h1>
          <p className="text-gray-400 mt-1">Cole o link do seu perfil e receba uma análise completa com IA.</p>
        </div>
        {result && (
          <button
            onClick={() => { setResult(null); setStep("idle"); setUrl(""); }}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-gray-300 rounded-lg hover:bg-white/10 transition-colors text-sm"
          >
            <RefreshCw className="w-4 h-4" /> Nova análise
          </button>
        )}
      </div>

      {!result ? (
        <Card>
          <CardBody className="space-y-5">
            {/* URL input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                URL do seu perfil LinkedIn
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0A66C2]" />
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !loading && url && setShowConfirm(true)}
                    placeholder="https://linkedin.com/in/seu-usuario"
                    disabled={loading}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm disabled:opacity-50"
                  />
                </div>
                {url && validateUrl(url) && (
                  <button
                    onClick={openLinkedIn}
                    className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                    title="Abrir perfil"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1.5">
                Certifique-se de que o seu perfil está configurado como <strong className="text-gray-400">público</strong> no LinkedIn para melhores resultados.
              </p>
            </div>

            <div className="flex items-center justify-between">
              <span className="inline-flex items-center px-3 py-1 bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs rounded-lg">
                Custo: 1 crédito
              </span>
              <Button
                onClick={() => setShowConfirm(true)}
                disabled={!url.trim() || loading}
                loading={loading}
              >
                {loading ? "Analisando..." : "Analisar perfil"}
              </Button>
            </div>

            {/* Step indicator */}
            {loading && <StepIndicator current={step} />}
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Limited data warning */}
          {!hasRichData && (
            <div className="flex items-start gap-3 px-4 py-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
              <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-yellow-300">
                Seu perfil está privado ou o LinkedIn limitou o acesso. A análise foi feita com os dados públicos disponíveis — configure seu perfil como público para análises mais precisas.
              </p>
            </div>
          )}

          {/* Scores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardBody className="flex flex-col items-center py-8">
                <ScoreCircle score={result.overallScore} size="lg" />
                <h2 className="text-xl font-heading font-bold text-white mt-4">Pontuação Geral</h2>
                <p className="text-gray-400 text-sm mt-1">
                  {result.overallScore >= 80 ? "Perfil excelente!" : result.overallScore >= 60 ? "Perfil bom, mas pode melhorar." : "Perfil precisa de atenção."}
                </p>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="flex flex-col items-center py-8">
                <ScoreCircle score={result.seo.score} size="lg" />
                <h2 className="text-xl font-heading font-bold text-white mt-4">SEO do Perfil</h2>
                <p className="text-gray-400 text-sm mt-1">Visibilidade nas buscas do LinkedIn</p>
              </CardBody>
            </Card>
          </div>

          {/* Suggested Headline */}
          <Card>
            <CardHeader>
              <h3 className="font-heading font-semibold text-white">Headline Otimizado</h3>
            </CardHeader>
            <CardBody className="space-y-2">
              <div className="flex items-start gap-3 p-4 bg-primary-500/10 border border-primary-500/20 rounded-xl">
                <p className="text-sm text-gray-200 flex-1 leading-relaxed">{result.suggestedHeadline}</p>
                <button onClick={() => copyToClipboard(result.suggestedHeadline)} className="p-1.5 bg-white/5 hover:bg-white/10 text-gray-400 rounded-lg transition-colors flex-shrink-0">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-gray-500 px-1">{result.seo.headlineOptimization}</p>
            </CardBody>
          </Card>

          {/* Suggested About */}
          <Card>
            <CardHeader>
              <h3 className="font-heading font-semibold text-white">Seção &quot;Sobre&quot; Otimizada</h3>
            </CardHeader>
            <CardBody className="space-y-2">
              <div className="flex items-start gap-3 p-4 bg-primary-500/10 border border-primary-500/20 rounded-xl">
                <p className="text-sm text-gray-200 flex-1 whitespace-pre-line leading-relaxed">{result.suggestedAbout}</p>
                <button onClick={() => copyToClipboard(result.suggestedAbout)} className="p-1.5 bg-white/5 hover:bg-white/10 text-gray-400 rounded-lg transition-colors flex-shrink-0">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-gray-500 px-1">{result.seo.aboutOptimization}</p>
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
                  <button
                    key={i}
                    onClick={() => copyToClipboard(kw)}
                    className="px-3 py-1 bg-primary-500/10 border border-primary-500/20 text-primary-300 rounded-lg text-sm hover:bg-primary-500/20 transition-colors"
                    title="Clique para copiar"
                  >
                    {kw}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-3">Clique em uma palavra-chave para copiar. Inclua-as no seu perfil para melhorar o SEO.</p>
            </CardBody>
          </Card>

          {/* Sections analysis */}
          {Object.keys(result.sections).length > 0 && (
            <Card>
              <CardHeader>
                <h3 className="font-heading font-semibold text-white">Análise por Seção</h3>
              </CardHeader>
              <CardBody>
                <div className="divide-y divide-white/[0.06]">
                  {Object.entries(result.sections).map(([key, value]) => (
                    <div key={key} className="py-3 first:pt-0 last:pb-0">
                      <span className="text-xs font-semibold text-primary-400 uppercase tracking-wider capitalize">
                        {key === "photo" ? "Foto" : key === "headline" ? "Headline" : key === "about" ? "Sobre" : key === "experience" ? "Experiência" : key === "education" ? "Formação" : key === "skills" ? "Habilidades" : key === "certifications" ? "Certificações" : key}
                      </span>
                      <p className="text-sm text-gray-300 mt-1">{value}</p>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}

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

      {/* Confirm modal */}
      <Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)} title="Analisar perfil LinkedIn" size="sm">
        <div className="space-y-4">
          <p className="text-gray-300 text-sm">
            A análise do perfil custa <span className="text-primary-400 font-semibold">1 crédito</span>. Deseja continuar?
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
