"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAuthContext } from "@/components/providers/AuthProvider";
import Button from "@/components/ui/Button";
import dynamic from "next/dynamic";
import Modal from "@/components/ui/Modal";
import SaveButton from "@/components/ui/SaveButton";

const AIProgressModal = dynamic(() => import("@/components/ui/AIProgressModal"), { ssr: false });
const SaveLimitModal = dynamic(() => import("@/components/ui/SaveLimitModal"), { ssr: false });
const SaveSuccessModal = dynamic(() => import("@/components/ui/SaveSuccessModal"), { ssr: false });
const PdfPreview = dynamic(() => import("@/components/ui/PdfPreview"), { ssr: false });
import PxControl from "@/components/ui/PxControl";
import { useSavedItemSaver } from "@/hooks/useSavedItemSaver";
import { useAIProgress } from "@/hooks/useAIProgress";
import { featureCostLabel } from "@/types";
import { checkCredits } from "@/services/credits";
import { authedFetch } from "@/lib/api-client";
import type { CoverLetterResult } from "@/services/ai-cover-letter";
import FileUpload from "@/components/ui/FileUpload";
import { extractTextFromFile } from "@/utils/file-parser";
import {
  generateCoverLetterPDFBlob,
  downloadCoverLetterPDF,
  COVER_LETTER_DEFAULTS,
  type CoverLetterAdjustments,
} from "@/utils/cover-letter-pdf";
import {
  FileText,
  Download,
  RefreshCw,
  Building2,
  Briefcase,
  ClipboardList,
  ScrollText,
  Sparkles,
  Type,
  AlignJustify,
  Eye,
  EyeOff,
  RotateCcw,
  PenLine,
  Menu,
  X,
  SlidersHorizontal,
} from "lucide-react";
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
  const { user, userData } = useAuthContext();
  const saver = useSavedItemSaver();
  const autoSaveEnabled = userData?.autoSaveDocuments ?? false;
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [result, setResult] = useState<CoverLetterResult | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  // Editor state — px overrides per category; `null` means "use default".
  const [candidateNameFontPx, setCandidateNameFontPx] = useState<number | null>(null);
  const [bodyFontPx, setBodyFontPx] = useState<number | null>(null);
  const [subjectFontPx, setSubjectFontPx] = useState<number | null>(null);
  const [metaFontPx, setMetaFontPx] = useState<number | null>(null);
  const [paragraphSpacingPx, setParagraphSpacingPx] = useState<number | null>(null);
  const [signOffSpacingPx, setSignOffSpacingPx] = useState<number | null>(null);
  const [hideSubject, setHideSubject] = useState(false);
  const [hideContactHeader, setHideContactHeader] = useState(false);
  const [editingField, setEditingField] = useState<"identidade" | "destinatario" | "assunto" | "corpo" | null>(null);
  // Mobile/tablet drawer for the editor — desktop (lg+) keeps the panel
  // inline; mobile gets a slide-in panel toggled by a hamburger.
  const [editorOpen, setEditorOpen] = useState(false);

  useEffect(() => {
    if (!editorOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setEditorOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [editorOpen]);

  const editorDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingTextEdit = useRef(false);
  const firstResultRef = useRef(true);
  const pendingNotificationIdRef = useRef<string | null>(null);

  const {
    progress,
    message: progressMsg,
    start: startProgress,
    stop: stopProgress,
    reset: resetProgress,
  } = useAIProgress({
    messages: PROGRESS_MESSAGES,
    finalMessage: "Carta gerada!",
    expectedDuration: 10,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const company = params.get("company");
    const title = params.get("title");
    const description = params.get("description");
    if (company) setCompanyName(company);
    if (title) setJobTitle(title);
    if (description) setJobDescription(description.slice(0, 4000));
  }, []);

  // Cleanup pdfUrl on unmount
  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentAdjustments = useCallback((): CoverLetterAdjustments => ({
    candidateNameFontPx: candidateNameFontPx ?? undefined,
    bodyFontPx: bodyFontPx ?? undefined,
    subjectFontPx: subjectFontPx ?? undefined,
    metaFontPx: metaFontPx ?? undefined,
    paragraphSpacingPx: paragraphSpacingPx ?? undefined,
    signOffSpacingPx: signOffSpacingPx ?? undefined,
    hideSubject: hideSubject || undefined,
    hideContactHeader: hideContactHeader || undefined,
  }), [candidateNameFontPx, bodyFontPx, subjectFontPx, metaFontPx, paragraphSpacingPx, signOffSpacingPx, hideSubject, hideContactHeader]);

  const buildSavePayload = useCallback(
    (data: CoverLetterResult, blob: Blob, ts: number) => ({
      kind: "pdf" as const,
      data: {
        type: "cover-letter" as const,
        title: `Carta — ${data.companyName}`,
        subtitle: data.jobTitle || undefined,
        fileName: `carta-${ts}.pdf`,
        pdf: blob,
      },
    }),
    []
  );

  // Generates the preview PDF AND keeps the saver in sync with the latest
  // blob — so clicking "Salvar" is instant (no regeneration), exactly like
  // /create-resume where the resume payload is kept up to date via
  // updatePayload + markDirty.
  const generatePdfPreview = useCallback(
    async (data: CoverLetterResult, adj: CoverLetterAdjustments) => {
      if (!user) return;
      setPdfLoading(true);
      try {
        const blob = await generateCoverLetterPDFBlob(data, adj);
        setPdfUrl(prev => {
          if (prev) URL.revokeObjectURL(prev);
          return URL.createObjectURL(blob);
        });
        const payload = buildSavePayload(data, blob, Date.now());
        if (saver.status === "idle") {
          // First preview after a fresh generation → kick off the initial
          // save prepare (respects the autoSave preference).
          await saver.prepare({
            uid: user.uid,
            type: "cover-letter",
            payload,
            autoSave: autoSaveEnabled,
            notificationId: pendingNotificationIdRef.current ?? undefined,
          });
          pendingNotificationIdRef.current = null;
        } else {
          // Subsequent edits → keep the saver payload aligned with what the
          // user sees so the next manual save uploads the latest blob.
          saver.updatePayload(payload);
          saver.markDirty();
        }
      } catch (err) {
        console.error("PDF preview error:", err);
        toast.error("Erro ao gerar preview do PDF.");
      } finally {
        setPdfLoading(false);
      }
    },
    [user, autoSaveEnabled, saver, buildSavePayload]
  );

  // Regenerate the PDF preview whenever the result or any adjustment changes.
  // The first time `result` is set we kick off immediately; subsequent edits
  // are debounced so typing in textareas isn't choppy.
  useEffect(() => {
    if (!result) return;
    if (editorDebounce.current) clearTimeout(editorDebounce.current);
    const delay = firstResultRef.current ? 0 : (pendingTextEdit.current ? 700 : 400);
    pendingTextEdit.current = false;
    firstResultRef.current = false;
    editorDebounce.current = setTimeout(() => {
      generatePdfPreview(result, currentAdjustments());
    }, delay);
    return () => {
      if (editorDebounce.current) clearTimeout(editorDebounce.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result, candidateNameFontPx, bodyFontPx, subjectFontPx, metaFontPx, paragraphSpacingPx, signOffSpacingPx, hideSubject, hideContactHeader]);

  const updateResult = useCallback(<K extends keyof CoverLetterResult>(field: K, value: CoverLetterResult[K]) => {
    pendingTextEdit.current = true;
    setResult(prev => prev ? { ...prev, [field]: value } : prev);
  }, []);

  const handleGenerate = async () => {
    if (!user) return;

    const hasCredits = await checkCredits(user.uid, "cover-letter");
    if (!hasCredits) { toast.error("Créditos insuficientes."); return; }

    setLoading(true);
    startProgress();
    try {
      const resumeText = await extractTextFromFile(resumeFile!);
      const res = await authedFetch("/api/generate-cover-letter", {
        method: "POST",
        body: JSON.stringify({ resumeText, companyName, jobTitle, jobDescription }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      pendingNotificationIdRef.current = (data.notificationId as string | undefined) ?? null;

      stopProgress();
      firstResultRef.current = true;
      setResult(data.data);
      toast.success("Carta gerada com sucesso!");
      // The save prepare happens inside generatePdfPreview when it sees
      // saver.status === "idle" — that way the SAME blob feeds both preview
      // and saver, and we only generate one PDF per state change.
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao gerar carta.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!result) return;
    setDownloadLoading(true);
    try {
      await downloadCoverLetterPDF(result, currentAdjustments());
    } catch {
      toast.error("Erro ao baixar PDF.");
    } finally {
      setDownloadLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setResumeFile(null);
    setCompanyName("");
    setJobTitle("");
    setJobDescription("");
    setCandidateNameFontPx(null);
    setBodyFontPx(null);
    setSubjectFontPx(null);
    setMetaFontPx(null);
    setParagraphSpacingPx(null);
    setSignOffSpacingPx(null);
    setHideSubject(false);
    setHideContactHeader(false);
    setEditingField(null);
    firstResultRef.current = true;
    resetProgress();
    saver.reset();
    setPdfUrl(prev => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  };

  const handleManualSave = () => {
    if (!user) return;
    saver.saveManually(user.uid);
  };

  const resetAdjustments = () => {
    setCandidateNameFontPx(null);
    setBodyFontPx(null);
    setSubjectFontPx(null);
    setMetaFontPx(null);
    setParagraphSpacingPx(null);
    setSignOffSpacingPx(null);
    setHideSubject(false);
    setHideContactHeader(false);
  };

  const hasOverrides =
    candidateNameFontPx != null ||
    bodyFontPx != null ||
    subjectFontPx != null ||
    metaFontPx != null ||
    paragraphSpacingPx != null ||
    signOffSpacingPx != null ||
    hideSubject ||
    hideContactHeader;

  const canGenerate = !!resumeFile && companyName.trim().length > 0 && jobDescription.trim().length > 20;

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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-xs font-medium text-primary-300 mb-4">
            <ScrollText className="w-3 h-3" />
            Carta de Apresentação
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white font-heading leading-[1.1] tracking-tight">
            Crie cartas{" "}
            <span className="gradient-text">personalizadas</span>{" "}
            com IA
          </h1>
          <p className="text-gray-400 mt-4 text-base md:text-lg max-w-xl leading-relaxed">
            Envie seu currículo e a descrição da vaga — a IA redige uma carta sob medida para impressionar o recrutador.
          </p>
          <span className="inline-block mt-4 bg-primary-500/10 text-primary-400 text-xs rounded-lg px-2.5 py-1 border border-primary-500/20">
            {featureCostLabel("cover-letter")} por carta
          </span>
        </div>
      </section>

      {!result ? (
        <fieldset disabled={loading} className="space-y-4 animate-fade-in-up animation-delay-200 border-0 m-0 min-w-0 p-0 disabled:opacity-60 disabled:cursor-not-allowed">
          {/* Resume upload */}
          <div className="relative group bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] p-6 overflow-hidden transition-all duration-300 hover:border-primary-500/30">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-500/10 group-hover:bg-primary-500/20 rounded-full blur-3xl transition-all duration-500 pointer-events-none" />
            <div className="relative">
              <h2 className="font-semibold font-heading text-white flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-violet rounded-xl flex items-center justify-center flex-shrink-0">
                  <ClipboardList className="w-4 h-4 text-white" />
                </div>
                Seu currículo
              </h2>
              <FileUpload onFileSelect={setResumeFile} selectedFile={resumeFile} onClear={() => setResumeFile(null)} disabled={loading} />
            </div>
          </div>

          {/* Company + Job fields */}
          <div className="grid grid-cols-1 gap-4">
            {/* Company */}
            <div className="relative group bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] p-6 overflow-hidden transition-all duration-300 hover:border-primary-500/30">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-sky-500/10 group-hover:bg-sky-500/20 rounded-full blur-3xl transition-all duration-500 pointer-events-none" />
              <div className="relative">
                <h2 className="font-semibold font-heading text-white flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-4 h-4 text-white" />
                  </div>
                  Empresa
                </h2>
                <input
                  type="text"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  disabled={loading}
                  placeholder="Ex: Google, Nubank, Magazine Luiza..."
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm disabled:opacity-50"
                />
              </div>
            </div>

            {/* Job title */}
            <div className="relative group bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] p-6 overflow-hidden transition-all duration-300 hover:border-primary-500/30">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-teal-500/10 group-hover:bg-teal-500/20 rounded-full blur-3xl transition-all duration-500 pointer-events-none" />
              <div className="relative">
                <h2 className="font-semibold font-heading text-white flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-4 h-4 text-white" />
                  </div>
                  Título da vaga
                </h2>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={e => setJobTitle(e.target.value)}
                  disabled={loading}
                  placeholder="Ex: Desenvolvedor Backend, Analista de Marketing..."
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm disabled:opacity-50"
                />
              </div>
            </div>

            {/* Job description */}
            <div className="relative group bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] p-6 overflow-hidden transition-all duration-300 hover:border-primary-500/30">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-violet-500/10 group-hover:bg-violet-500/20 rounded-full blur-3xl transition-all duration-500 pointer-events-none" />
              <div className="relative">
                <h2 className="font-semibold font-heading text-white flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  Descrição da vaga
                </h2>
                <textarea
                  value={jobDescription}
                  onChange={e => setJobDescription(e.target.value)}
                  disabled={loading}
                  placeholder="Cole aqui a descrição completa da vaga (requisitos, responsabilidades, benefícios...)"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm min-h-[160px] resize-y disabled:opacity-50"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={() => setShowConfirm(true)}
              disabled={!canGenerate || loading}
              loading={loading}
              className="glow-blue"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {loading ? "Gerando..." : "Gerar carta"}
            </Button>
          </div>
        </fieldset>
      ) : (
        <div className="space-y-4 animate-fade-in-up animation-delay-200">
          {/* Actions — above the PDF on desktop only. On mobile/tablet the
              same set of buttons is rendered below the PDF (see further down). */}
          <div className="hidden lg:flex flex-wrap items-center justify-start gap-3">
            <Button
              onClick={handleDownloadPDF}
              disabled={downloadLoading || pdfLoading}
              loading={downloadLoading}
              className="px-6 glow-blue"
            >
              <Download className="w-4 h-4 mr-2" />
              Baixar PDF
            </Button>
            <SaveButton
              status={saver.status}
              saving={saver.saving}
              disabled={pdfLoading}
              onClick={handleManualSave}
              className="px-6"
            />
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-white/[0.05] border border-white/[0.10] text-gray-300 rounded-xl hover:bg-white/[0.10] hover:border-white/20 transition-all duration-200 text-sm flex-shrink-0"
            >
              <RefreshCw className="w-4 h-4" /> Nova carta
            </button>
          </div>

          {/* PDF Preview + Editor sidebar */}
          <div className="flex flex-col lg:flex-row gap-6 lg:items-stretch">
            {/* PDF Preview */}
            <div className="flex-1 min-w-0">
              {/* Mobile/tablet trigger for the editor drawer */}
              <div className="lg:hidden flex justify-end mb-3">
                <button
                  type="button"
                  onClick={() => setEditorOpen(true)}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-white/[0.05] border border-white/[0.10] text-gray-200 rounded-xl hover:bg-white/[0.10] hover:border-white/20 transition-all text-sm"
                  aria-label="Abrir ajustes da carta"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Ajustes
                  <Menu className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden lg:h-full">
                {pdfLoading && !pdfUrl ? (
                  <div className="flex items-center justify-center h-[75vh] lg:h-full">
                    <div className="text-center">
                      <div className="w-8 h-8 border-2 border-primary-400 border-t-transparent rounded-full animate-spin mx-auto" />
                      <p className="text-sm text-gray-400 mt-3">Gerando PDF...</p>
                    </div>
                  </div>
                ) : pdfUrl ? (
                  <div className="relative lg:h-full">
                    <PdfPreview
                      pdfUrl={pdfUrl}
                      className="w-full h-[75vh] lg:h-full rounded-xl"
                      title="Preview da carta"
                    />
                    {pdfLoading && (
                      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-1.5 flex items-center gap-2">
                        <div className="w-3 h-3 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
                        <span className="text-xs text-gray-300">Atualizando...</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[75vh] lg:h-full">
                    <p className="text-sm text-gray-500">Erro ao carregar preview.</p>
                  </div>
                )}
              </div>

              {/* Actions — mobile/tablet only, rendered below the PDF.
                  Desktop renders the same set above the preview. */}
              <div className="lg:hidden flex flex-col gap-3 mt-4">
                <div className="flex gap-3">
                  <Button
                    onClick={handleDownloadPDF}
                    disabled={downloadLoading || pdfLoading}
                    loading={downloadLoading}
                    className="flex-1 glow-blue"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Baixar PDF
                  </Button>
                  <SaveButton
                    status={saver.status}
                    saving={saver.saving}
                    disabled={pdfLoading}
                    onClick={handleManualSave}
                    className="flex-1"
                  />
                </div>
                <button
                  onClick={handleReset}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white/[0.05] border border-white/[0.10] text-gray-300 rounded-xl hover:bg-white/[0.10] hover:border-white/20 transition-all duration-200 text-sm"
                >
                  <RefreshCw className="w-4 h-4" /> Nova carta
                </button>
              </div>
            </div>

            {/* Editor sidebar — inline on lg+, slide-in drawer from the right on
                mobile/tablet. */}
            {editorOpen && (
              <div
                className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                onClick={() => setEditorOpen(false)}
                aria-hidden
              />
            )}
            <div
              className={`space-y-4 z-50 transform transition-transform duration-300
                fixed inset-y-0 right-0 w-[88vw] max-w-sm bg-dark-900 border-l border-white/[0.06] p-5 overflow-y-auto
                lg:static lg:w-80 lg:max-w-none lg:flex-shrink-0 lg:bg-transparent lg:border-0 lg:p-0 lg:overflow-visible lg:transform-none lg:transition-none
                ${editorOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}`}
              role="dialog"
              aria-modal={editorOpen ? true : undefined}
              aria-label="Ajustes da carta"
            >
              {/* Mobile-only drawer close button */}
              <div className="lg:hidden flex justify-end">
                <button
                  type="button"
                  onClick={() => setEditorOpen(false)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                  aria-label="Fechar ajustes"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">Ajustes</h3>
                  {hasOverrides && (
                    <button
                      onClick={resetAdjustments}
                      className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" /> Resetar
                    </button>
                  )}
                </div>

                <PxControl
                  icon={Type}
                  label="Nome do candidato"
                  value={candidateNameFontPx}
                  defaultPx={COVER_LETTER_DEFAULTS.candidateNameFontPx}
                  onChange={setCandidateNameFontPx}
                  min={10}
                  max={36}
                  disabled={pdfLoading}
                />
                <PxControl
                  icon={Type}
                  label="Corpo da carta"
                  value={bodyFontPx}
                  defaultPx={COVER_LETTER_DEFAULTS.bodyFontPx}
                  onChange={setBodyFontPx}
                  min={8}
                  max={18}
                  disabled={pdfLoading}
                />
                <PxControl
                  icon={Type}
                  label="Assunto"
                  value={subjectFontPx}
                  defaultPx={COVER_LETTER_DEFAULTS.subjectFontPx}
                  onChange={setSubjectFontPx}
                  min={8}
                  max={18}
                  disabled={pdfLoading}
                />
                <PxControl
                  icon={Type}
                  label="Informações de contato"
                  value={metaFontPx}
                  defaultPx={COVER_LETTER_DEFAULTS.metaFontPx}
                  onChange={setMetaFontPx}
                  min={7}
                  max={14}
                  disabled={pdfLoading}
                />
                <PxControl
                  icon={AlignJustify}
                  label="Espaçamento entre parágrafos"
                  value={paragraphSpacingPx}
                  defaultPx={COVER_LETTER_DEFAULTS.paragraphSpacingPx}
                  onChange={setParagraphSpacingPx}
                  min={0}
                  max={40}
                  disabled={pdfLoading}
                />
                <PxControl
                  icon={AlignJustify}
                  label="Espaçamento da assinatura"
                  value={signOffSpacingPx}
                  defaultPx={COVER_LETTER_DEFAULTS.signOffSpacingPx}
                  onChange={setSignOffSpacingPx}
                  min={0}
                  max={80}
                  disabled={pdfLoading}
                />

                {/* Visibility toggles */}
                <div>
                  <label className="text-xs text-gray-400 mb-2 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" /> Seções
                  </label>
                  <div className="space-y-1.5">
                    <button
                      onClick={() => setHideSubject(v => !v)}
                      disabled={pdfLoading}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all ${
                        hideSubject
                          ? "bg-red-500/10 text-red-400/70 border border-red-500/20"
                          : "bg-white/[0.02] text-gray-300 border border-white/[0.06] hover:bg-white/[0.05]"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {hideSubject ? <EyeOff className="w-3.5 h-3.5 flex-shrink-0" /> : <Eye className="w-3.5 h-3.5 flex-shrink-0" />}
                      <span className={hideSubject ? "line-through" : ""}>Assunto</span>
                    </button>
                    <button
                      onClick={() => setHideContactHeader(v => !v)}
                      disabled={pdfLoading}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all ${
                        hideContactHeader
                          ? "bg-red-500/10 text-red-400/70 border border-red-500/20"
                          : "bg-white/[0.02] text-gray-300 border border-white/[0.06] hover:bg-white/[0.05]"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {hideContactHeader ? <EyeOff className="w-3.5 h-3.5 flex-shrink-0" /> : <Eye className="w-3.5 h-3.5 flex-shrink-0" />}
                      <span className={hideContactHeader ? "line-through" : ""}>Contato no cabeçalho</span>
                    </button>
                  </div>
                </div>

                {/* Content editor */}
                <div>
                  <label className="text-xs text-gray-400 mb-2 flex items-center gap-1.5">
                    <PenLine className="w-3.5 h-3.5" /> Conteúdo
                  </label>
                  <div className="space-y-1.5">
                    {(["identidade", "destinatario", "assunto", "corpo"] as const).map(field => {
                      const labels: Record<typeof field, string> = {
                        identidade: "Identidade & contato",
                        destinatario: "Destinatário",
                        assunto: "Assunto",
                        corpo: "Corpo da carta",
                      };
                      const isEditing = editingField === field;
                      return (
                        <div key={field}>
                          <button
                            onClick={() => setEditingField(prev => prev === field ? null : field)}
                            disabled={pdfLoading}
                            className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all ${
                              isEditing
                                ? "bg-primary-500/15 border border-primary-500/30 text-primary-300"
                                : "bg-white/[0.02] text-gray-300 border border-white/[0.06] hover:bg-white/[0.05]"
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            <PenLine className="w-3 h-3 flex-shrink-0" />
                            <span className="flex-1 text-left">{labels[field]}</span>
                          </button>
                          {isEditing && (
                            <div className="mt-2 p-3 bg-white/[0.02] border border-white/[0.06] rounded-lg space-y-2">
                              {field === "identidade" && (
                                <>
                                  <FieldInput
                                    label="Nome"
                                    value={result.candidateName}
                                    onChange={v => updateResult("candidateName", v)}
                                    disabled={pdfLoading}
                                  />
                                  <FieldInput
                                    label="Email"
                                    value={result.candidateEmail}
                                    onChange={v => updateResult("candidateEmail", v)}
                                    disabled={pdfLoading}
                                  />
                                  <FieldInput
                                    label="Telefone"
                                    value={result.candidatePhone}
                                    onChange={v => updateResult("candidatePhone", v)}
                                    disabled={pdfLoading}
                                  />
                                </>
                              )}
                              {field === "destinatario" && (
                                <>
                                  <FieldInput
                                    label="Empresa"
                                    value={result.companyName}
                                    onChange={v => updateResult("companyName", v)}
                                    disabled={pdfLoading}
                                  />
                                  <FieldInput
                                    label="Cargo / referência"
                                    value={result.jobTitle}
                                    onChange={v => updateResult("jobTitle", v)}
                                    disabled={pdfLoading}
                                  />
                                </>
                              )}
                              {field === "assunto" && (
                                <FieldInput
                                  label="Assunto sugerido"
                                  value={result.subject}
                                  onChange={v => updateResult("subject", v)}
                                  disabled={pdfLoading || hideSubject}
                                />
                              )}
                              {field === "corpo" && (
                                <FieldTextarea
                                  label="Texto da carta"
                                  value={result.coverLetter}
                                  onChange={v => updateResult("coverLetter", v)}
                                  disabled={pdfLoading}
                                  rows={14}
                                  helper="Separe parágrafos com uma linha em branco."
                                />
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      <AIProgressModal
        isOpen={loading}
        title="Gerando sua carta de apresentação"
        message={progressMsg}
        progress={progress}
        steps={PROGRESS_MESSAGES}
        icon={ScrollText}
        accent="teal"
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

      {/* Confirm modal */}
      <Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)} title="Gerar carta de apresentação" size="sm">
        <div className="space-y-4">
          <p className="text-gray-300 text-sm">
            A geração da carta custa <span className="text-primary-400 font-semibold">{featureCostLabel("cover-letter")}</span>. Deseja continuar?
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

// ── Inline field components for the editor sidebar ─────────────────────────

function FieldInput({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-wide text-gray-500 mb-1">{label}</label>
      <input
        type="text"
        value={value || ""}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        className="w-full px-2.5 py-1.5 text-xs bg-white/[0.04] border border-white/10 rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-primary-400 disabled:opacity-50"
      />
    </div>
  );
}

function FieldTextarea({
  label,
  value,
  onChange,
  disabled,
  rows,
  helper,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  rows?: number;
  helper?: string;
}) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-wide text-gray-500 mb-1">{label}</label>
      <textarea
        value={value || ""}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        rows={rows ?? 8}
        className="w-full px-2.5 py-1.5 text-xs bg-white/[0.04] border border-white/10 rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-primary-400 disabled:opacity-50 resize-y leading-relaxed"
      />
      {helper && <p className="text-[10px] text-gray-500 mt-1">{helper}</p>}
    </div>
  );
}
