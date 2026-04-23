"use client";

import { useCallback, useState, useRef } from "react";
import { useAuthContext } from "@/components/providers/AuthProvider";
import Card, { CardBody, CardHeader } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import SaveLimitModal from "@/components/ui/SaveLimitModal";
import { useSavedItemSaver } from "@/hooks/useSavedItemSaver";
import { deductCredits, checkCredits } from "@/services/credits";
import type { CoverLetterResult } from "@/services/ai-cover-letter";
import FileUpload from "@/components/ui/FileUpload";
import { extractTextFromFile } from "@/utils/file-parser";
import { FileText, Download, Copy, RefreshCw, Building2, Briefcase, ClipboardList } from "lucide-react";
import toast from "react-hot-toast";

const PROGRESS_MESSAGES = [
  "Lendo seu currículo...",
  "Analisando a vaga...",
  "Identificando pontos em comum...",
  "Redigindo a carta...",
  "Ajustando tom e personalização...",
  "Finalizando...",
];

export default function CoverLetterPage() {
  const { user } = useAuthContext();
  const saver = useSavedItemSaver();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [result, setResult] = useState<CoverLetterResult | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState("");
  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null);

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
    setProgressMsg("Carta gerada!");
  };

  const handleGenerate = async () => {
    if (!user) return;

    const hasCredits = await checkCredits(user.uid, "cover-letter");
    if (!hasCredits) { toast.error("Créditos insuficientes."); return; }

    setLoading(true);
    startProgress();
    try {
      const resumeText = await extractTextFromFile(resumeFile!);
      const res = await fetch("/api/generate-cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, companyName, jobTitle, jobDescription, userId: user.uid }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      await deductCredits(user.uid, "cover-letter", `Carta de apresentação — ${companyName}`);
      stopProgress();
      setResult(data.data);
      toast.success("Carta gerada com sucesso!");
      void saveCoverLetterInBackground(data.data, companyName, jobTitle);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao gerar carta.";
      toast.error(msg);
    } finally {
      setLoading(false);
      if (progressInterval.current) { clearInterval(progressInterval.current); progressInterval.current = null; }
    }
  };

  const saveCoverLetterInBackground = useCallback(
    async (data: CoverLetterResult, company: string, role: string) => {
      if (!user) return;
      try {
        const res = await fetch("/api/generate-cover-letter-pdf", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data }),
        });
        if (!res.ok) return;
        const blob = await res.blob();
        const ts = Date.now();
        await saver.saveWithPrompt({
          uid: user.uid,
          type: "cover-letter",
          payload: {
            kind: "pdf",
            data: {
              type: "cover-letter",
              title: `Carta — ${company}`,
              subtitle: role || undefined,
              fileName: `carta-${ts}.pdf`,
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

  const handleDownloadPDF = async () => {
    if (!result) return;
    setPdfLoading(true);
    try {
      const res = await fetch("/api/generate-cover-letter-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: result }),
      });
      if (!res.ok) throw new Error("Erro ao gerar PDF.");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `carta-apresentacao-${result.candidateName.replace(/\s+/g, "-")}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Erro ao baixar PDF.");
    } finally {
      setPdfLoading(false);
    }
  };

  const copyLetter = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.coverLetter);
    toast.success("Carta copiada!");
  };

  const handleReset = () => {
    setResult(null);
    setResumeFile(null);
    setJobTitle("");
    setProgress(0);
    setProgressMsg("");
  };

  const canGenerate = !!resumeFile && companyName.trim().length > 0 && jobDescription.trim().length > 20;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white flex items-center gap-3">
            <FileText className="w-7 h-7 text-primary-400" />
            Carta de Apresentação
          </h1>
          <p className="text-gray-400 mt-1">Gere uma carta personalizada para a vaga com IA.</p>
          <span className="inline-block mt-2 bg-primary-500/10 text-primary-400 text-xs rounded-lg px-2.5 py-1">1 crédito por carta</span>
        </div>
        {result && (
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-gray-300 rounded-lg hover:bg-white/10 transition-colors text-sm"
          >
            <RefreshCw className="w-4 h-4" /> Nova carta
          </button>
        )}
      </div>

      {!result ? (
        <div className="space-y-4">
          {/* Resume */}
          <Card>
            <CardHeader>
              <h2 className="font-semibold font-heading text-white flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-primary-400" />
                Seu currículo
              </h2>
            </CardHeader>
            <CardBody>
              <FileUpload onFileSelect={setResumeFile} selectedFile={resumeFile} onClear={() => setResumeFile(null)} />
            </CardBody>
          </Card>

          {/* Company + Job */}
          <div className="grid grid-cols-1 gap-4">
            <Card>
              <CardHeader>
                <h2 className="font-semibold font-heading text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary-400" />
                  Empresa
                </h2>
              </CardHeader>
              <CardBody>
                <input
                  type="text"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  disabled={loading}
                  placeholder="Ex: Google, Nubank, Magazine Luiza..."
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm disabled:opacity-50"
                />
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="font-semibold font-heading text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary-400" />
                  Título da vaga
                </h2>
              </CardHeader>
              <CardBody>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={e => setJobTitle(e.target.value)}
                  disabled={loading}
                  placeholder="Ex: Desenvolvedor Backend, Analista de Marketing..."
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm disabled:opacity-50"
                />
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="font-semibold font-heading text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary-400" />
                  Descrição da vaga
                </h2>
              </CardHeader>
              <CardBody>
                <textarea
                  value={jobDescription}
                  onChange={e => setJobDescription(e.target.value)}
                  disabled={loading}
                  placeholder="Cole aqui a descrição completa da vaga (requisitos, responsabilidades, benefícios...)"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm min-h-[160px] resize-y disabled:opacity-50"
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
            <Button
              onClick={() => setShowConfirm(true)}
              disabled={!canGenerate || loading}
              loading={loading}
            >
              {loading ? "Gerando..." : "Gerar carta"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Info row */}
          <div className="flex flex-wrap gap-3">
            {result.candidateName && (
              <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300">
                {result.candidateName}
              </span>
            )}
            {result.jobTitle && (
              <span className="px-3 py-1 bg-primary-500/10 border border-primary-500/20 rounded-lg text-sm text-primary-300">
                {result.jobTitle}
              </span>
            )}
            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300">
              {result.companyName}
            </span>
          </div>

          {/* Subject */}
          {result.subject && (
            <Card>
              <CardBody className="flex items-center justify-between gap-3 py-3">
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Assunto sugerido para o e-mail</p>
                  <p className="text-sm text-white">{result.subject}</p>
                </div>
                <button
                  onClick={() => { navigator.clipboard.writeText(result.subject); toast.success("Copiado!"); }}
                  className="p-1.5 bg-white/5 hover:bg-white/10 text-gray-400 rounded-lg transition-colors flex-shrink-0"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </CardBody>
            </Card>
          )}

          {/* Letter */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="font-semibold font-heading text-white">Carta de Apresentação</h2>
                <button
                  onClick={copyLetter}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition-colors text-xs"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Copiar texto
                </button>
              </div>
            </CardHeader>
            <CardBody>
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 space-y-4">
                {/* Header */}
                <div className="border-b border-white/10 pb-4">
                  <p className="text-base font-bold text-white">{result.candidateName}</p>
                  {(result.candidateEmail || result.candidatePhone) && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      {[result.candidateEmail, result.candidatePhone].filter(Boolean).join(" · ")}
                    </p>
                  )}
                </div>
                {/* Body */}
                <div className="text-sm text-gray-300 leading-relaxed space-y-3 whitespace-pre-line">
                  {result.coverLetter}
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Actions */}
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

      {/* Confirm modal */}
      <Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)} title="Gerar carta de apresentação" size="sm">
        <div className="space-y-4">
          <p className="text-gray-300 text-sm">
            A geração da carta custa <span className="text-primary-400 font-semibold">1 crédito</span>. Deseja continuar?
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setShowConfirm(false)}>Cancelar</Button>
            <Button onClick={() => { setShowConfirm(false); handleGenerate(); }}>Confirmar</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
