"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useAuthContext } from "@/components/providers/AuthProvider";
import Button from "@/components/ui/Button";
import FileUpload from "@/components/ui/FileUpload";
import { extractTextFromFile } from "@/utils/file-parser";
import { checkCredits } from "@/services/credits";
import { authedFetch } from "@/lib/api-client";
import { generateResumePDFBlob, downloadResumePDF, type PdfAdjustments } from "@/utils/resume-pdf";
import { Target, Download, RefreshCw, FileText, Plus, Type, AlignJustify, Eye, EyeOff, PenLine, Trash2, RotateCcw, Briefcase, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import type { ResumeSchema, GenerationNotes, QualityReport } from "@/lib/resume-schema";
import type { TemplateName, SectionName } from "@/lib/resume-templates";
import { getDefaultSizesPx } from "@/lib/resume-templates";
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

const PROGRESS_MESSAGES = [
  "Enviando seus dados...",
  "Analisando currículo e vaga...",
  "Identificando palavras-chave...",
  "Adaptando experiências para a vaga...",
  "Otimizando bullet points com IA...",
  "Alinhando habilidades...",
  "Gerando currículo adaptado...",
  "Preparando PDF...",
];

const TEMPLATE_OPTIONS: { id: TemplateName; label: string; desc: string }[] = [
  { id: "profissional", label: "Profissional (ATS)", desc: "Minimalista, preto e branco, máximo ATS" },
  { id: "moderno", label: "Moderno", desc: "ATS-safe com accent azul marinho" },
];

const SECTION_LABELS: Record<SectionName, string> = {
  header: "Dados Pessoais",
  summary: "Resumo Profissional",
  skills: "Habilidades",
  work: "Experiência Profissional",
  projects: "Projetos",
  education: "Formação Acadêmica",
  certifications: "Certificações",
  languages: "Idiomas",
};

export default function AdaptResumePage() {
  const { user, userData } = useAuthContext();
  const saver = useSavedItemSaver();
  const autoSaveEnabled = userData?.autoSaveDocuments ?? false;
  const [file, setFile] = useState<File | null>(null);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [showGenerateConfirm, setShowGenerateConfirm] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeSchema | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateName>("profissional");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const {
    progress,
    message: progressMsg,
    start: startProgress,
    stop: stopProgress,
    reset: resetProgress,
  } = useAIProgress({
    messages: PROGRESS_MESSAGES,
    finalMessage: "Currículo adaptado!",
    expectedDuration: 16,
  });
  const [candidateLevel, setCandidateLevel] = useState<string | undefined>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [generationNotes, setGenerationNotes] = useState<GenerationNotes | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_qualityReport, setQualityReport] = useState<QualityReport | null>(null);

  // Editor state — granular px overrides per category. `null` means "use template default".
  const [sectionTitleFontPx, setSectionTitleFontPx] = useState<number | null>(null);
  const [entryTitleFontPx, setEntryTitleFontPx] = useState<number | null>(null);
  const [bodyFontPx, setBodyFontPx] = useState<number | null>(null);
  const [metaFontPx, setMetaFontPx] = useState<number | null>(null);
  const [sectionSpacingPx, setSectionSpacingPx] = useState<number | null>(null);
  const [hiddenSections, setHiddenSections] = useState<SectionName[]>([]);
  const [editingSection, setEditingSection] = useState<SectionName | null>(null);
  const [availableSections, setAvailableSections] = useState<SectionName[]>([]);
  const editorDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingTextEdit = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const title = params.get("title");
    const description = params.get("description");
    const company = params.get("company");
    if (title) setJobTitle(title.slice(0, 120));
    if (description || company) {
      const composed = company && description
        ? `Empresa: ${company}\n\n${description}`
        : description || `Empresa: ${company}`;
      setJobDescription(composed.slice(0, 4000));
    }
  }, []);

  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Extract ResumeSchema from API response
  function extractResumeSchema(data: Record<string, unknown>): ResumeSchema {
    const raw = (data.resume ?? data.resumeData ?? data) as Record<string, unknown>;
    if (raw.personalInfo && !raw.basics) {
      const pi = raw.personalInfo as Record<string, string>;
      return {
        basics: {
          name: pi.name || "", label: (raw.objective as string) || "", email: pi.email || "",
          phone: pi.phone || "", location: pi.location || "", summary: (raw.objective as string) || "",
          linkedin: pi.linkedin || "", github: pi.github || "", website: pi.portfolio || pi.website || "",
        },
        work: ((raw.experience as Record<string, unknown>[]) || []).map((e) => ({
          company: (e.company as string) || "", position: (e.position as string) || "",
          startDate: (e.startDate as string) || "", endDate: (e.endDate as string) || "",
          location: (e.location as string) || "",
          highlights: (e.achievements as string[]) || (e.description ? [(e.description as string)] : []),
        })),
        education: ((raw.education as Record<string, unknown>[]) || []).map((e) => ({
          institution: (e.institution as string) || "", area: (e.field as string) || "",
          studyType: (e.degree as string) || "", startDate: (e.startDate as string) || "",
          endDate: (e.endDate as string) || "", status: (e.status as string) || "",
        })),
        skills: ((raw.skills as string[] | Record<string, string>[]) || []).map((s) =>
          typeof s === "string" ? { category: "", name: s, level: "" } : { category: s.category || "", name: s.name || "", level: s.level || "" }
        ),
        projects: ((raw.projects as Record<string, unknown>[]) || []).map((p) => ({
          name: (p.name as string) || "", description: (p.description as string) || "",
          startDate: (p.startDate as string) || "", endDate: (p.endDate as string) || "",
          highlights: (p.highlights as string[]) || [], technologies: (p.technologies as string[]) || [],
          url: (p.url as string) || "", repository: (p.repository as string) || "",
        })),
        languages: ((raw.languages as Record<string, string>[]) || []).map((l) => ({
          language: l.language || l.name || "", fluency: l.fluency || l.level || "",
        })),
        certifications: ((raw.certifications as Record<string, string>[]) || []).map((c) => ({
          name: c.name || "", issuer: c.issuer || "", date: c.date || "", url: c.url || "",
        })),
        volunteer: [],
      };
    }
    const basics = raw.basics as Record<string, unknown> | undefined;
    if (basics) {
      if (!basics.linkedin) basics.linkedin = "";
      if (!basics.github) basics.github = "";
      if (!basics.website) basics.website = "";
    }
    const work = raw.work as Record<string, unknown>[] | undefined;
    if (work) { for (const w of work) { if (typeof w.location !== "string") w.location = ""; } }
    const education = raw.education as Record<string, unknown>[] | undefined;
    if (education) { for (const e of education) { if (typeof e.status !== "string") e.status = ""; } }
    const skills = raw.skills as Record<string, unknown>[] | undefined;
    if (skills) { for (const s of skills) { if (typeof s.category !== "string") s.category = ""; } }
    const projects = raw.projects as Record<string, unknown>[] | undefined;
    if (projects) { for (const p of projects) { if (!p.url) p.url = ""; if (!p.repository) p.repository = ""; if (!Array.isArray(p.highlights)) p.highlights = []; } }
    if (!Array.isArray(raw.certifications)) raw.certifications = [];
    if (!Array.isArray(raw.volunteer)) raw.volunteer = [];
    return raw as unknown as ResumeSchema;
  }

  // Generate PDF preview via server API
  const generatePdf = useCallback(async (data: ResumeSchema, template: TemplateName, level?: string, adj?: PdfAdjustments) => {
    setPdfLoading(true);
    try {
      const blob = await generateResumePDFBlob(data, template, level, adj);
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (err) {
      console.error("PDF generation error:", err);
      toast.error("Erro ao gerar preview do PDF.");
    } finally {
      setPdfLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdfUrl]);

  const defaultSizes = useMemo(() => {
    if (!resumeData) return null;
    return getDefaultSizesPx(resumeData, selectedTemplate, { hiddenSections });
  }, [resumeData, selectedTemplate, hiddenSections]);

  const currentAdjustments = useCallback((): PdfAdjustments => ({
    hiddenSections: hiddenSections.length > 0 ? hiddenSections : undefined,
    sectionTitleFontPx: sectionTitleFontPx ?? undefined,
    entryTitleFontPx: entryTitleFontPx ?? undefined,
    bodyFontPx: bodyFontPx ?? undefined,
    metaFontPx: metaFontPx ?? undefined,
    sectionSpacingPx: sectionSpacingPx ?? undefined,
  }), [hiddenSections, sectionTitleFontPx, entryTitleFontPx, bodyFontPx, metaFontPx, sectionSpacingPx]);

  useEffect(() => {
    if (resumeData) generatePdf(resumeData, selectedTemplate, candidateLevel, currentAdjustments());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTemplate]);

  useEffect(() => {
    if (!resumeData) return;
    if (editorDebounce.current) clearTimeout(editorDebounce.current);
    editorDebounce.current = setTimeout(() => {
      generatePdf(resumeData, selectedTemplate, candidateLevel, currentAdjustments());
    }, 400);
    return () => { if (editorDebounce.current) clearTimeout(editorDebounce.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionTitleFontPx, entryTitleFontPx, bodyFontPx, metaFontPx, sectionSpacingPx, hiddenSections]);

  useEffect(() => {
    if (!resumeData || !pendingTextEdit.current) return;
    pendingTextEdit.current = false;
    if (editorDebounce.current) clearTimeout(editorDebounce.current);
    editorDebounce.current = setTimeout(() => {
      generatePdf(resumeData, selectedTemplate, candidateLevel, currentAdjustments());
    }, 700);
    return () => { if (editorDebounce.current) clearTimeout(editorDebounce.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeData]);

  const updateResume = useCallback((updater: (d: ResumeSchema) => ResumeSchema) => {
    pendingTextEdit.current = true;
    setResumeData(prev => prev ? updater(prev) : prev);
  }, []);

  function getPopulatedSections(data: ResumeSchema): SectionName[] {
    const s: SectionName[] = ["header"];
    if (data.basics.summary) s.push("summary");
    if (data.skills.length > 0) s.push("skills");
    if (data.work.length > 0) s.push("work");
    if (data.projects.length > 0) s.push("projects");
    if (data.education.length > 0) s.push("education");
    if (data.certifications.length > 0) s.push("certifications");
    if (data.languages.length > 0) s.push("languages");
    return s;
  }

  // Main adapt handler — uses create-resume API with targetJob
  const handleAdapt = async () => {
    if (!file || !user || !jobDescription.trim()) return;

    const hasCredits = await checkCredits(user.uid, "resume-adaptation");
    if (!hasCredits) { toast.error("Créditos insuficientes."); return; }

    setLoading(true);
    startProgress();
    try {
      const resumeText = await extractTextFromFile(file);
      const composedTargetJob = jobTitle.trim()
        ? `Título da vaga: ${jobTitle.trim()}\n\nDescrição:\n${jobDescription}`
        : jobDescription;
      const response = await authedFetch("/api/create-resume", {
        method: "POST",
        body: JSON.stringify({
          formData: { existingResume: resumeText, mode: "improve", targetJob: composedTargetJob },
          feature: "resume-adaptation",
        }),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error);

      const schema = extractResumeSchema(data.data);
      const level = data.data?.generationNotes?.candidateLevel as string | undefined;
      const notificationId = data.notificationId as string | undefined;
      setCandidateLevel(level);
      setGenerationNotes((data.data?.generationNotes as GenerationNotes) || null);
      setQualityReport((data.data?.qualityReport as QualityReport) || null);
      setResumeData(schema);
      setAvailableSections(getPopulatedSections(schema));
      stopProgress();

      await generatePdf(schema, selectedTemplate, level);
      toast.success("Currículo adaptado!");
      void saveAdaptedResumeItem(schema, selectedTemplate, level, notificationId);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error("Adapt error:", msg);
      toast.error(msg || "Erro ao adaptar currículo.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!resumeData) return;
    try {
      await downloadResumePDF(resumeData, selectedTemplate, undefined, candidateLevel, currentAdjustments());
    } catch { toast.error("Erro ao baixar PDF."); }
  };

  const buildResumePayload = useCallback(
    (schema: ResumeSchema, template: TemplateName, level?: string) => {
      const name = schema.basics?.name?.trim() || "Sem nome";
      const role = schema.basics?.label?.trim();
      const targetTitle = jobTitle.trim();
      const title = targetTitle
        ? `${name} — ${targetTitle}`
        : `${name} (adaptado)`;
      const adj = currentAdjustments();
      const cleanAdj: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(adj)) {
        if (v !== undefined) cleanAdj[k] = v;
      }
      return {
        kind: "resume" as const,
        data: {
          resumeData: schema,
          template,
          candidateLevel: level,
          title,
          subtitle: role || (targetTitle ? "Adaptado" : undefined),
          adjustments: Object.keys(cleanAdj).length > 0 ? cleanAdj : undefined,
        },
      };
    },
    [jobTitle, currentAdjustments]
  );

  const saveAdaptedResumeItem = useCallback(
    async (schema: ResumeSchema, template: TemplateName, level?: string, notificationId?: string) => {
      if (!user) return;
      await saver.prepare({
        uid: user.uid,
        type: "resume",
        payload: buildResumePayload(schema, template, level),
        autoSave: autoSaveEnabled,
        notificationId,
      });
    },
    [user, saver, buildResumePayload, autoSaveEnabled]
  );

  // Keep the saver payload in sync with edits so manual save uses latest content.
  useEffect(() => {
    if (!resumeData || saver.status === "idle") return;
    saver.updatePayload(
      buildResumePayload(resumeData, selectedTemplate, candidateLevel)
    );
    saver.markDirty();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeData, selectedTemplate, sectionTitleFontPx, entryTitleFontPx, bodyFontPx, metaFontPx, sectionSpacingPx, hiddenSections]);

  const handleReset = () => {
    setResumeData(null);
    setFile(null);
    setJobTitle("");
    setJobDescription("");
    resetProgress();
    setCandidateLevel(undefined);
    setGenerationNotes(null);
    setQualityReport(null);
    setSectionTitleFontPx(null);
    setEntryTitleFontPx(null);
    setBodyFontPx(null);
    setMetaFontPx(null);
    setSectionSpacingPx(null);
    setHiddenSections([]);
    setEditingSection(null);
    setAvailableSections([]);
    saver.reset();
    if (pdfUrl) { URL.revokeObjectURL(pdfUrl); setPdfUrl(null); }
  };

  const handleManualSave = () => {
    if (!user) return;
    saver.saveManually(user.uid);
  };

  // ════════════════════════════════════════════════════
  // RESULT VIEW
  // ════════════════════════════════════════════════════

  if (resumeData) {
    return (
      <div className="space-y-6">
        {/* Result Hero Header */}
        <section className="relative overflow-hidden rounded-3xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-xl">
          <div className="absolute -top-24 -left-16 w-80 h-80 bg-orange-500/20 rounded-full blur-[120px] animate-pulse-glow pointer-events-none" />
          <div className="absolute -bottom-32 -right-10 w-96 h-96 bg-primary-500/20 rounded-full blur-[140px] animate-pulse-glow pointer-events-none" style={{ animationDelay: "1.5s" }} />
          <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
          <div className="relative p-8 md:p-10 animate-fade-in-up">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-xs font-medium text-orange-300 mb-4">
              <Target className="w-3 h-3" />
              Currículo pronto
            </div>
            <h1 className="text-2xl md:text-4xl font-bold text-white font-heading leading-[1.1] tracking-tight">
              Currículo <span className="gradient-text">Adaptado</span>
            </h1>
          </div>
        </section>

        {/* Template selector */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl hover:border-primary-500/30 transition-all duration-300 animate-fade-in-up animation-delay-200 p-4">
          <label className="text-sm font-medium text-gray-300 mb-3 block">Escolha o template:</label>
          <div className="flex gap-3">
            {TEMPLATE_OPTIONS.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTemplate(t.id)}
                className={`flex-1 p-3 rounded-xl border text-left transition-all ${
                  selectedTemplate === t.id
                    ? "border-primary-500 bg-primary-500/10"
                    : "border-white/10 bg-white/[0.02] hover:border-white/20"
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileText className={`w-4 h-4 ${selectedTemplate === t.id ? "text-primary-400" : "text-gray-500"}`} />
                  <span className={`text-sm font-medium ${selectedTemplate === t.id ? "text-primary-400" : "text-gray-300"}`}>{t.label}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{t.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Actions — above the PDF. On mobile/tablet, Baixar PDF + Salvar
            share a row (50/50) and Nova adaptação gets its own full-width
            row. `lg:contents` flattens the inner wrapper on desktop. */}
        <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center animate-fade-in-up animation-delay-200">
          <div className="flex gap-3 lg:contents">
            <Button onClick={handleDownloadPDF} disabled={pdfLoading} className="flex-1 lg:flex-initial lg:px-6 glow-blue">
              <Download className="w-4 h-4 mr-2" /> Baixar PDF
            </Button>
            <SaveButton
              status={saver.status}
              saving={saver.saving}
              disabled={pdfLoading}
              onClick={handleManualSave}
              className="flex-1 lg:flex-initial lg:px-6"
            />
          </div>
          <button
            onClick={handleReset}
            className="w-full lg:w-auto flex items-center justify-center lg:justify-start gap-2 px-4 py-2 bg-white/5 border border-white/10 text-gray-300 rounded-xl hover:bg-white/10 transition-colors text-sm lg:flex-shrink-0"
          >
            <RefreshCw className="w-4 h-4" /> Nova adaptação
          </button>
        </div>

        {/* PDF Preview + Sidebar */}
        <div className="flex flex-col lg:flex-row gap-6 lg:items-stretch animate-fade-in-up animation-delay-300">
          <div className="flex-1 min-w-0">
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl overflow-hidden lg:h-full">
              {pdfLoading ? (
                <div className="flex items-center justify-center h-[75vh] lg:h-full">
                  <div className="text-center">
                    <div className="w-8 h-8 border-2 border-primary-400 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-sm text-gray-400 mt-3">Gerando PDF...</p>
                  </div>
                </div>
              ) : pdfUrl ? (
                <PdfPreview pdfUrl={pdfUrl} className="w-full rounded-xl h-[75vh] lg:h-full" title="Preview do currículo" />
              ) : (
                <div className="flex items-center justify-center h-[75vh] lg:h-full">
                  <p className="text-sm text-gray-500">Erro ao carregar preview.</p>
                </div>
              )}
            </div>
          </div>

          {/* Editor + Feedback sidebar */}
          <div className="w-full lg:w-80 lg:flex-shrink-0 space-y-4">
            {/* Editor Controls */}
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl hover:border-primary-500/30 transition-all duration-300 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Ajustes</h3>
                {(sectionTitleFontPx != null || entryTitleFontPx != null || bodyFontPx != null || metaFontPx != null || sectionSpacingPx != null || hiddenSections.length > 0) && (
                  <button
                    onClick={() => {
                      setSectionTitleFontPx(null);
                      setEntryTitleFontPx(null);
                      setBodyFontPx(null);
                      setMetaFontPx(null);
                      setSectionSpacingPx(null);
                      setHiddenSections([]);
                    }}
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" /> Resetar
                  </button>
                )}
              </div>

              {/* ── Granular px controls ── */}
              <PxControl icon={Type} label="Título da seção" value={sectionTitleFontPx} defaultPx={defaultSizes?.sectionTitleFontPx} onChange={setSectionTitleFontPx} min={8} max={32} disabled={pdfLoading} />
              <PxControl icon={Type} label="Título da subseção" value={entryTitleFontPx} defaultPx={defaultSizes?.entryTitleFontPx} onChange={setEntryTitleFontPx} min={7} max={24} disabled={pdfLoading} />
              <PxControl icon={Type} label="Conteúdo / descrições" value={bodyFontPx} defaultPx={defaultSizes?.bodyFontPx} onChange={setBodyFontPx} min={7} max={20} disabled={pdfLoading} />
              <PxControl icon={Type} label="Informações complementares" value={metaFontPx} defaultPx={defaultSizes?.metaFontPx} onChange={setMetaFontPx} min={6} max={18} disabled={pdfLoading} />
              <PxControl icon={AlignJustify} label="Espaçamento entre seções" value={sectionSpacingPx} defaultPx={defaultSizes?.sectionSpacingPx} onChange={setSectionSpacingPx} min={0} max={80} disabled={pdfLoading} />

              {/* Section visibility + editing */}
              <div>
                <label className="text-xs text-gray-400 mb-2 flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> Seções</label>
                <div className="space-y-1.5">
                  {availableSections.map(key => {
                    const label = SECTION_LABELS[key];
                    const isHeader = key === "header";
                    const isHidden = !isHeader && hiddenSections.includes(key);
                    const isEditing = editingSection === key && !isHidden;
                    return (
                      <div key={key}>
                        <div className="flex items-center gap-1">
                          {isHeader ? (
                            <span className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-white/[0.02] text-gray-300 border border-white/[0.06]">
                              <PenLine className="w-3.5 h-3.5 flex-shrink-0" />
                              {label}
                            </span>
                          ) : (
                            <button
                              onClick={() => {
                                setHiddenSections(prev => isHidden ? prev.filter(s => s !== key) : [...prev, key]);
                                if (!isHidden) setEditingSection(prev => prev === key ? null : prev);
                              }}
                              disabled={pdfLoading}
                              className={`flex-1 flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all ${
                                isHidden ? "bg-red-500/10 text-red-400/70 border border-red-500/20" : "bg-white/[0.02] text-gray-300 border border-white/[0.06] hover:bg-white/[0.05]"
                              }`}
                            >
                              {isHidden ? <EyeOff className="w-3.5 h-3.5 flex-shrink-0" /> : <Eye className="w-3.5 h-3.5 flex-shrink-0" />}
                              <span className={isHidden ? "line-through" : ""}>{label}</span>
                            </button>
                          )}
                          <button
                            onClick={() => setEditingSection(prev => prev === key ? null : key)}
                            disabled={isHidden || pdfLoading}
                            className={`w-7 h-7 flex items-center justify-center rounded-lg border transition-all ${
                              isEditing ? "bg-primary-500/20 border-primary-500/40 text-primary-400" : "bg-white/[0.02] border-white/[0.06] text-gray-500 hover:text-gray-300 hover:bg-white/[0.05]"
                            } disabled:opacity-30 disabled:cursor-not-allowed`}
                          >
                            <PenLine className="w-3 h-3" />
                          </button>
                        </div>
                        {isEditing && resumeData && (
                          <SectionEditor section={key} data={resumeData} onUpdate={updateResume} pdfLoading={pdfLoading} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        </div>

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

      </div>
    );
  }

  // ════════════════════════════════════════════════════
  // FORM VIEW
  // ════════════════════════════════════════════════════

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <section className="relative overflow-hidden rounded-3xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-xl">
        <div className="absolute -top-24 -left-16 w-80 h-80 bg-primary-500/20 rounded-full blur-[120px] animate-pulse-glow pointer-events-none" />
        <div className="absolute -bottom-32 -right-10 w-96 h-96 bg-accent-violet/20 rounded-full blur-[140px] animate-pulse-glow pointer-events-none" style={{ animationDelay: "1.5s" }} />
        <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
        <div className="relative p-8 md:p-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-xs font-medium text-primary-300 mb-4">
            <Target className="w-3 h-3" />
            Adaptação
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white font-heading leading-[1.1] tracking-tight">
            Adapte seu currículo para a{" "}
            <span className="gradient-text">vaga</span>
          </h1>
          <p className="text-gray-400 mt-4 text-base md:text-lg max-w-xl leading-relaxed">
            Envie seu currículo e a descrição da vaga. A IA vai adaptar o conteúdo para maximizar compatibilidade.
          </p>
          <span className="inline-flex items-center gap-1.5 mt-4 bg-orange-500/10 border border-orange-500/20 text-orange-300 text-xs rounded-full px-3 py-1">
            <Sparkles className="w-3 h-3" />
            1 crédito por adaptação
          </span>
        </div>
      </section>

      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl hover:border-primary-500/30 transition-all duration-300 animate-fade-in-up animation-delay-200">
        <div className="px-6 py-4 border-b border-white/[0.06]">
          <h2 className="font-semibold font-heading text-white">Envie seu currículo e a vaga</h2>
        </div>
        <fieldset disabled={loading} className="p-6 space-y-4 border-0 m-0 min-w-0 disabled:opacity-60 disabled:cursor-not-allowed">
          <FileUpload onFileSelect={setFile} selectedFile={file} onClear={() => setFile(null)} disabled={loading} />

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-primary-400" />
              Título da vaga
            </label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value.slice(0, 120))}
              maxLength={120}
              disabled={loading}
              placeholder="Ex: Desenvolvedor Backend Sênior, Analista de Marketing..."
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Descrição da vaga</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value.slice(0, 4000))}
              maxLength={4000}
              disabled={loading}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 min-h-[160px] disabled:opacity-50"
              placeholder="Cole aqui a descrição completa da vaga..."
            />
            {jobDescription.length > 0 && (
              <span className="text-xs text-gray-500 mt-1 block text-right">{jobDescription.length}/4000</span>
            )}
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Custo: 1 crédito</span>
            <Button onClick={() => setShowGenerateConfirm(true)} disabled={!file || !jobDescription.trim() || loading} loading={loading} className="glow-blue">
              Adaptar currículo
            </Button>
          </div>

        </fieldset>
      </div>

      <AIProgressModal
        isOpen={loading}
        title="Adaptando seu currículo"
        message={progressMsg}
        progress={progress}
        steps={PROGRESS_MESSAGES}
        icon={Target}
        accent="amber"
      />

      {/* Confirm generate modal */}
      <Modal isOpen={showGenerateConfirm} onClose={() => setShowGenerateConfirm(false)} title="Adaptar currículo" size="sm">
        <div className="space-y-4">
          <p className="text-gray-300 text-sm">A adaptação do currículo custa <span className="text-primary-400 font-semibold">1 crédito</span>. Deseja continuar?</p>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setShowGenerateConfirm(false)}>Cancelar</Button>
            <Button onClick={() => { setShowGenerateConfirm(false); handleAdapt(); }}>Confirmar</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ════════════════════════════════════════════════════
// Section Editor (same as create-resume)
// ════════════════════════════════════════════════════

const editCls = "w-full px-2 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary-500/50 resize-none";
const editLabel = "text-[10px] text-gray-500 mb-0.5 block";

function SectionEditor({ section, data, onUpdate, pdfLoading }: {
  section: SectionName; data: ResumeSchema;
  onUpdate: (updater: (d: ResumeSchema) => ResumeSchema) => void; pdfLoading: boolean;
}) {
  switch (section) {
    case "header":
      return (<div className="mt-2 pl-2 border-l border-primary-500/30 space-y-1.5">
        <label className={editLabel}>Nome</label>
        <input value={data.basics.name} onChange={e => onUpdate(d => ({ ...d, basics: { ...d.basics, name: e.target.value } }))} className={editCls} placeholder="Nome completo" />
        <label className={editLabel}>Cargo / Título</label>
        <input value={data.basics.label} onChange={e => onUpdate(d => ({ ...d, basics: { ...d.basics, label: e.target.value } }))} className={editCls} placeholder="Ex: Desenvolvedor Full Stack" />
        <div className="grid grid-cols-2 gap-1">
          <div><label className={editLabel}>Email</label><input value={data.basics.email} onChange={e => onUpdate(d => ({ ...d, basics: { ...d.basics, email: e.target.value } }))} className={editCls} placeholder="Email" /></div>
          <div><label className={editLabel}>Telefone</label><input value={data.basics.phone} onChange={e => onUpdate(d => ({ ...d, basics: { ...d.basics, phone: e.target.value } }))} className={editCls} placeholder="Telefone" /></div>
        </div>
        <label className={editLabel}>Localização</label>
        <input value={data.basics.location} onChange={e => onUpdate(d => ({ ...d, basics: { ...d.basics, location: e.target.value } }))} className={editCls} placeholder="Cidade - Estado" />
        <label className={editLabel}>LinkedIn</label>
        <input value={data.basics.linkedin || ""} onChange={e => onUpdate(d => ({ ...d, basics: { ...d.basics, linkedin: e.target.value } }))} className={editCls} placeholder="linkedin.com/in/seu-perfil" />
        <label className={editLabel}>GitHub / Link</label>
        <input value={data.basics.github || ""} onChange={e => onUpdate(d => ({ ...d, basics: { ...d.basics, github: e.target.value } }))} className={editCls} placeholder="github.com/usuario" />
        <label className={editLabel}>Portfolio / Site</label>
        <input value={data.basics.website || ""} onChange={e => onUpdate(d => ({ ...d, basics: { ...d.basics, website: e.target.value } }))} className={editCls} placeholder="meusite.com.br" />
      </div>);
    case "summary":
      return (<div className="mt-2 pl-2 border-l border-primary-500/30 space-y-1"><textarea rows={4} value={data.basics.summary} onChange={e => onUpdate(d => ({ ...d, basics: { ...d.basics, summary: e.target.value } }))} className={editCls} placeholder="Resumo profissional" /></div>);
    case "skills": {
      const groups = new Map<string, number[]>();
      data.skills.forEach((s, i) => { const cat = s.category || ""; if (!groups.has(cat)) groups.set(cat, []); groups.get(cat)!.push(i); });
      return (<div className="mt-2 pl-2 border-l border-primary-500/30 space-y-2">
        {Array.from(groups.entries()).map(([cat, indices]) => (<div key={cat || "__no_cat"} className="space-y-1">
          <div className="flex items-center gap-1"><input value={cat} onChange={e => { const nc = e.target.value; onUpdate(d => { const skills = [...d.skills]; for (const idx of indices) skills[idx] = { ...skills[idx], category: nc }; return { ...d, skills }; }); }} className={`${editCls} flex-1`} placeholder="Categoria" /><button onClick={() => onUpdate(d => ({ ...d, skills: d.skills.filter((_, i) => !indices.includes(i)) }))} className="text-red-400/60 hover:text-red-400 p-0.5"><Trash2 className="w-3 h-3" /></button></div>
          <textarea rows={2} value={indices.map(i => data.skills[i].name).join(", ")} onChange={e => { const names = e.target.value.split(",").map(n => n.trim()); onUpdate(d => { let skills = d.skills.filter((_, i) => !indices.includes(i)); const newSkills = names.filter(Boolean).map(name => ({ category: cat, name, level: "" })); skills = [...skills, ...newSkills]; return { ...d, skills }; }); }} className={editCls} placeholder="Skill1, Skill2, Skill3" />
        </div>))}
        <button onClick={() => onUpdate(d => ({ ...d, skills: [...d.skills, { category: "", name: "Nova skill", level: "" }] }))} disabled={pdfLoading} className="flex items-center gap-1 text-[10px] text-primary-400 hover:text-primary-300"><Plus className="w-3 h-3" /> Grupo</button>
      </div>);
    }
    case "work":
      return (<div className="mt-2 pl-2 border-l border-primary-500/30 space-y-3">
        {data.work.map((w, i) => (<div key={i} className="space-y-1 bg-white/[0.02] rounded-lg p-2">
          <div className="flex items-center justify-between"><span className={editLabel}>{w.position || "Experiência"} — {w.company || "Empresa"}</span><button onClick={() => onUpdate(d => ({ ...d, work: d.work.filter((_, idx) => idx !== i) }))} className="text-red-400/60 hover:text-red-400 p-0.5"><Trash2 className="w-3 h-3" /></button></div>
          <div className="grid grid-cols-2 gap-1">
            <input value={w.position} onChange={e => onUpdate(d => { const work = [...d.work]; work[i] = { ...work[i], position: e.target.value }; return { ...d, work }; })} className={editCls} placeholder="Cargo" />
            <input value={w.company} onChange={e => onUpdate(d => { const work = [...d.work]; work[i] = { ...work[i], company: e.target.value }; return { ...d, work }; })} className={editCls} placeholder="Empresa" />
            <input value={w.startDate} onChange={e => onUpdate(d => { const work = [...d.work]; work[i] = { ...work[i], startDate: e.target.value }; return { ...d, work }; })} className={editCls} placeholder="Início" />
            <input value={w.endDate} onChange={e => onUpdate(d => { const work = [...d.work]; work[i] = { ...work[i], endDate: e.target.value }; return { ...d, work }; })} className={editCls} placeholder="Fim" />
          </div>
          <span className={editLabel}>Bullets:</span>
          {w.highlights.map((h, j) => (<div key={j} className="flex items-start gap-1"><textarea rows={2} value={h} onChange={e => onUpdate(d => { const work = [...d.work]; const highlights = [...work[i].highlights]; highlights[j] = e.target.value; work[i] = { ...work[i], highlights }; return { ...d, work }; })} className={`${editCls} flex-1`} /><button onClick={() => onUpdate(d => { const work = [...d.work]; work[i] = { ...work[i], highlights: work[i].highlights.filter((_, idx) => idx !== j) }; return { ...d, work }; })} className="text-red-400/60 hover:text-red-400 p-1 mt-1"><Trash2 className="w-3 h-3" /></button></div>))}
          <button onClick={() => onUpdate(d => { const work = [...d.work]; work[i] = { ...work[i], highlights: [...work[i].highlights, ""] }; return { ...d, work }; })} className="flex items-center gap-1 text-[10px] text-primary-400 hover:text-primary-300"><Plus className="w-3 h-3" /> Bullet</button>
        </div>))}
      </div>);
    case "education":
      return (<div className="mt-2 pl-2 border-l border-primary-500/30 space-y-2">
        {data.education.map((e, i) => (<div key={i} className="space-y-1 bg-white/[0.02] rounded-lg p-2">
          <div className="flex items-center justify-between"><span className={editLabel}>{e.studyType || "Formação"} {e.area ? `em ${e.area}` : ""}</span><button onClick={() => onUpdate(d => ({ ...d, education: d.education.filter((_, idx) => idx !== i) }))} className="text-red-400/60 hover:text-red-400 p-0.5"><Trash2 className="w-3 h-3" /></button></div>
          <input value={e.institution} onChange={ev => onUpdate(d => { const education = [...d.education]; education[i] = { ...education[i], institution: ev.target.value }; return { ...d, education }; })} className={editCls} placeholder="Instituição" />
          <div className="grid grid-cols-2 gap-1">
            <input value={e.studyType} onChange={ev => onUpdate(d => { const education = [...d.education]; education[i] = { ...education[i], studyType: ev.target.value }; return { ...d, education }; })} className={editCls} placeholder="Grau" />
            <input value={e.area} onChange={ev => onUpdate(d => { const education = [...d.education]; education[i] = { ...education[i], area: ev.target.value }; return { ...d, education }; })} className={editCls} placeholder="Área" />
            <input value={e.startDate} onChange={ev => onUpdate(d => { const education = [...d.education]; education[i] = { ...education[i], startDate: ev.target.value }; return { ...d, education }; })} className={editCls} placeholder="Início" />
            <input value={e.endDate} onChange={ev => onUpdate(d => { const education = [...d.education]; education[i] = { ...education[i], endDate: ev.target.value }; return { ...d, education }; })} className={editCls} placeholder="Fim" />
          </div>
        </div>))}
      </div>);
    case "projects":
      return (<div className="mt-2 pl-2 border-l border-primary-500/30 space-y-2">
        {data.projects.map((p, i) => (<div key={i} className="space-y-1 bg-white/[0.02] rounded-lg p-2">
          <div className="flex items-center justify-between"><span className={editLabel}>{p.name || "Projeto"}</span><button onClick={() => onUpdate(d => ({ ...d, projects: d.projects.filter((_, idx) => idx !== i) }))} className="text-red-400/60 hover:text-red-400 p-0.5"><Trash2 className="w-3 h-3" /></button></div>
          <input value={p.name} onChange={e => onUpdate(d => { const projects = [...d.projects]; projects[i] = { ...projects[i], name: e.target.value }; return { ...d, projects }; })} className={editCls} placeholder="Nome" />
          <textarea rows={2} value={p.description} onChange={e => onUpdate(d => { const projects = [...d.projects]; projects[i] = { ...projects[i], description: e.target.value }; return { ...d, projects }; })} className={editCls} placeholder="Descrição" />
          <input value={p.technologies.join(", ")} onChange={e => onUpdate(d => { const projects = [...d.projects]; projects[i] = { ...projects[i], technologies: e.target.value.split(",").map(t => t.trim()).filter(Boolean) }; return { ...d, projects }; })} className={editCls} placeholder="Tecnologias (separadas por vírgula)" />
        </div>))}
      </div>);
    case "certifications":
      return (<div className="mt-2 pl-2 border-l border-primary-500/30 space-y-2">
        {data.certifications.map((c, i) => (<div key={i} className="space-y-1 bg-white/[0.02] rounded-lg p-2">
          <div className="flex items-center justify-between"><span className={editLabel}>{c.name || "Certificação"}</span><button onClick={() => onUpdate(d => ({ ...d, certifications: d.certifications.filter((_, idx) => idx !== i) }))} className="text-red-400/60 hover:text-red-400 p-0.5"><Trash2 className="w-3 h-3" /></button></div>
          <input value={c.name} onChange={e => onUpdate(d => { const certifications = [...d.certifications]; certifications[i] = { ...certifications[i], name: e.target.value }; return { ...d, certifications }; })} className={editCls} placeholder="Nome" />
          <div className="grid grid-cols-2 gap-1">
            <input value={c.issuer} onChange={e => onUpdate(d => { const certifications = [...d.certifications]; certifications[i] = { ...certifications[i], issuer: e.target.value }; return { ...d, certifications }; })} className={editCls} placeholder="Emissor" />
            <input value={c.date} onChange={e => onUpdate(d => { const certifications = [...d.certifications]; certifications[i] = { ...certifications[i], date: e.target.value }; return { ...d, certifications }; })} className={editCls} placeholder="Data" />
          </div>
        </div>))}
      </div>);
    case "languages":
      return (<div className="mt-2 pl-2 border-l border-primary-500/30 space-y-1.5">
        {data.languages.map((l, i) => (<div key={i} className="flex items-center gap-1">
          <input value={l.language} onChange={e => onUpdate(d => { const languages = [...d.languages]; languages[i] = { ...languages[i], language: e.target.value }; return { ...d, languages }; })} className={`${editCls} flex-1`} placeholder="Idioma" />
          <input value={l.fluency} onChange={e => onUpdate(d => { const languages = [...d.languages]; languages[i] = { ...languages[i], fluency: e.target.value }; return { ...d, languages }; })} className={`${editCls} flex-1`} placeholder="Nível" />
          <button onClick={() => onUpdate(d => ({ ...d, languages: d.languages.filter((_, idx) => idx !== i) }))} className="text-red-400/60 hover:text-red-400 p-0.5"><Trash2 className="w-3 h-3" /></button>
        </div>))}
        <button onClick={() => onUpdate(d => ({ ...d, languages: [...d.languages, { language: "", fluency: "" }] }))} disabled={pdfLoading} className="flex items-center gap-1 text-[10px] text-primary-400 hover:text-primary-300"><Plus className="w-3 h-3" /> Idioma</button>
      </div>);
    default: return null;
  }
}

