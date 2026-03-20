"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAuthContext } from "@/components/providers/AuthProvider";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import FileUpload from "@/components/ui/FileUpload";
import { extractTextFromFile } from "@/utils/file-parser";
import { deductCredits, checkCredits } from "@/services/credits";
import { generateResumePDFBlob, downloadResumePDF, type PdfAdjustments } from "@/utils/resume-pdf";
import { FilePlus, Upload, PenLine, Plus, Trash2, Download, RefreshCw, FileText, AlertTriangle, XCircle, Minus, Type, AlignJustify, Eye, EyeOff, RotateCcw } from "lucide-react";
import toast from "react-hot-toast";
import type { ResumeSchema, GenerationNotes, QualityReport } from "@/lib/resume-schema";
import type { TemplateName, SectionName } from "@/lib/resume-templates";
import ResumeFeedback from "@/components/ui/ResumeFeedback";

type Mode = "upload" | "scratch" | null;

interface FormExperience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface FormEducation {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
}

interface FormProject {
  type: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  link: string;
}

interface ValidationResult {
  pode_gerar: boolean;
  campos_obrigatorios_ausentes: string[];
  campos_importantes_ausentes: string[];
}

const PROGRESS_MESSAGES = [
  "Enviando seus dados...",
  "Processando informações...",
  "Analisando experiencias profissionais...",
  "Otimizando bullet points com IA...",
  "Estruturando currículo profissional...",
  "Aplicando padroes ATS...",
  "Gerando documento final...",
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

const CAMPO_LABELS: Record<string, string> = {
  nome: "Nome completo",
  cargo: "Cargo ou título profissional",
  contato: "Email ou telefone de contato",
  experiencia_ou_projeto: "Ao menos uma experiência profissional ou projeto",
  formacao: "Formação acadêmica",
  habilidades: "Habilidades técnicas",
  datas: "Datas das experiências (início e fim)",
  descricao_experiencia: "Descrição/bullets das experiências",
  linkedin_ou_github: "LinkedIn ou GitHub",
};

export default function CreateResumePage() {
  const { user } = useAuthContext();
  const [mode, setMode] = useState<Mode>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeSchema | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateName>("profissional");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState("");
  const [validationBlock, setValidationBlock] = useState<string[] | null>(null);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);
  const [candidateLevel, setCandidateLevel] = useState<string | undefined>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
const [generationNotes, setGenerationNotes] = useState<GenerationNotes | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_qualityReport, setQualityReport] = useState<QualityReport | null>(null);
  const [postCorrections, setPostCorrections] = useState<string[]>([]);
  const [qualityFlags, setQualityFlags] = useState<string[]>([]);
  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // Editor state
  const [fontSizeOffset, setFontSizeOffset] = useState(0);
  const [spacingOffset, setSpacingOffset] = useState(0);
  const [hiddenSections, setHiddenSections] = useState<SectionName[]>([]);
  const [editingSection, setEditingSection] = useState<SectionName | null>(null);
  const [availableSections, setAvailableSections] = useState<SectionName[]>([]);
  const editorDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingTextEdit = useRef(false);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [website, setWebsite] = useState("");
  const [objective, setObjective] = useState("");
  const [skills, setSkills] = useState("");
  const [languages, setLanguages] = useState("");
  const [experiences, setExperiences] = useState<FormExperience[]>([{ company: "", position: "", startDate: "", endDate: "", description: "" }]);
  const [educations, setEducations] = useState<FormEducation[]>([{ institution: "", degree: "", field: "", startDate: "", endDate: "" }]);
  const [projects, setProjects] = useState<FormProject[]>([]);

  useEffect(() => {
    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startProgress = useCallback(() => {
    setProgress(0);
    setProgressMsg(PROGRESS_MESSAGES[0]);
    let current = 0;
    progressInterval.current = setInterval(() => {
      current += 1;
      const target = Math.min(current, 90);
      setProgress(target);
      const msgIndex = Math.min(Math.floor(target / 12), PROGRESS_MESSAGES.length - 1);
      setProgressMsg(PROGRESS_MESSAGES[msgIndex]);
    }, 500);
  }, []);

  const stopProgress = useCallback(() => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
    setProgress(100);
    setProgressMsg("Curriculo pronto!");
  }, []);

  // Extract ResumeSchema from API response (handles both new and legacy formats)
  function extractResumeSchema(data: Record<string, unknown>): ResumeSchema {
    const raw = (data.resume ?? data.resumeData ?? data) as Record<string, unknown>;

    if (raw.personalInfo && !raw.basics) {
      const pi = raw.personalInfo as Record<string, string>;
      return {
        basics: {
          name: pi.name || "",
          label: (raw.objective as string) || "",
          email: pi.email || "",
          phone: pi.phone || "",
          location: pi.location || "",
          summary: (raw.objective as string) || "",
          linkedin: pi.linkedin || "",
          github: pi.github || "",
          website: pi.portfolio || pi.website || "",
        },
        work: ((raw.experience as Record<string, unknown>[]) || []).map((e) => ({
          company: (e.company as string) || "",
          position: (e.position as string) || "",
          startDate: (e.startDate as string) || "",
          endDate: (e.endDate as string) || "",
          location: (e.location as string) || "",
          highlights: (e.achievements as string[]) || (e.description ? [(e.description as string)] : []),
        })),
        education: ((raw.education as Record<string, unknown>[]) || []).map((e) => ({
          institution: (e.institution as string) || "",
          area: (e.field as string) || "",
          studyType: (e.degree as string) || "",
          startDate: (e.startDate as string) || "",
          endDate: (e.endDate as string) || "",
          status: (e.status as string) || "",
        })),
        skills: ((raw.skills as string[] | Record<string, string>[]) || []).map((s) =>
          typeof s === "string" ? { category: "", name: s, level: "" } : { category: s.category || "", name: s.name || "", level: s.level || "" }
        ),
        projects: ((raw.projects as Record<string, unknown>[]) || []).map((p) => ({
          name: (p.name as string) || "",
          description: (p.description as string) || "",
          highlights: (p.highlights as string[]) || [],
          technologies: (p.technologies as string[]) || [],
          url: (p.url as string) || "",
          repository: (p.repository as string) || "",
        })),
        languages: ((raw.languages as Record<string, string>[]) || []).map((l) => ({
          language: l.language || l.name || "",
          fluency: l.fluency || l.level || "",
        })),
        certifications: ((raw.certifications as Record<string, string>[]) || []).map((c) => ({
          name: c.name || "",
          issuer: c.issuer || "",
          date: c.date || "",
          url: c.url || "",
        })),
        volunteer: ((raw.volunteer as Record<string, string>[]) || []).map((v) => ({
          organization: v.organization || "",
          role: v.role || "",
          startDate: v.startDate || "",
          endDate: v.endDate || "",
          summary: v.summary || "",
        })),
      };
    }

    // Ensure new fields have defaults when coming from AI
    const basics = raw.basics as Record<string, unknown> | undefined;
    if (basics) {
      if (!basics.linkedin) basics.linkedin = "";
      if (!basics.github) basics.github = "";
      if (!basics.website) basics.website = "";
    }
    const work = raw.work as Record<string, unknown>[] | undefined;
    if (work) {
      for (const w of work) {
        if (typeof w.location !== "string") w.location = "";
      }
    }
    const education = raw.education as Record<string, unknown>[] | undefined;
    if (education) {
      for (const e of education) {
        if (typeof e.status !== "string") e.status = "";
      }
    }
    const skills = raw.skills as Record<string, unknown>[] | undefined;
    if (skills) {
      for (const s of skills) {
        if (typeof s.category !== "string") s.category = "";
      }
    }
    const projects = raw.projects as Record<string, unknown>[] | undefined;
    if (projects) {
      for (const p of projects) {
        if (!p.url) p.url = "";
        if (!p.repository) p.repository = "";
        if (!Array.isArray(p.highlights)) p.highlights = [];
      }
    }
    if (!Array.isArray(raw.certifications)) raw.certifications = [];
    if (!Array.isArray(raw.volunteer)) raw.volunteer = [];

    return raw as unknown as ResumeSchema;
  }

  // Generate PDF via server API
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

  // Build current adjustments object
  const currentAdjustments = useCallback((): PdfAdjustments => ({
    fontSizeOffset: fontSizeOffset || undefined,
    spacingOffset: spacingOffset || undefined,
    hiddenSections: hiddenSections.length > 0 ? hiddenSections : undefined,
  }), [fontSizeOffset, spacingOffset, hiddenSections]);

  // When template changes and we already have resume data, regenerate PDF
  useEffect(() => {
    if (resumeData) {
      generatePdf(resumeData, selectedTemplate, candidateLevel, currentAdjustments());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTemplate]);

  // When editor adjustments change, regenerate PDF with debounce
  useEffect(() => {
    if (!resumeData) return;
    if (editorDebounce.current) clearTimeout(editorDebounce.current);
    editorDebounce.current = setTimeout(() => {
      generatePdf(resumeData, selectedTemplate, candidateLevel, currentAdjustments());
    }, 400);
    return () => { if (editorDebounce.current) clearTimeout(editorDebounce.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fontSizeOffset, spacingOffset, hiddenSections]);

  // When text is edited, regenerate PDF with longer debounce
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

  // Helper to update resumeData from text edits
  const updateResume = useCallback((updater: (data: ResumeSchema) => ResumeSchema) => {
    pendingTextEdit.current = true;
    setResumeData(prev => prev ? updater(prev) : prev);
  }, []);

  // Pre-validate uploaded resume
  async function validateUploadedResume(text: string): Promise<ValidationResult | null> {
    try {
      const response = await fetch("/api/validate-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText: text }),
      });
      const data = await response.json();
      if (!data.success) return null;
      return data.validation as ValidationResult;
    } catch {
      return null;
    }
  }

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

  // Main create handler
  async function handleCreate(formData: Record<string, unknown>) {
    if (!user) return;

    const hasCredits = await checkCredits(user.uid, "resume-creation");
    if (!hasCredits) { toast.error("Creditos insuficientes."); return; }

    setLoading(true);
    setValidationBlock(null);
    setValidationWarnings([]);
    startProgress();
    try {
      const response = await fetch("/api/create-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData, userId: user.uid }),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error);

      await deductCredits(user.uid, "resume-creation", "Criação de currículo com IA");

      const schema = extractResumeSchema(data.data);
      const level = data.data?.generationNotes?.candidateLevel as string | undefined;
      setCandidateLevel(level);
      setGenerationNotes((data.data?.generationNotes as GenerationNotes) || null);
      setQualityReport((data.data?.qualityReport as QualityReport) || null);
      setPostCorrections((data.data?.postCorrections as string[]) || []);
      setQualityFlags((data.data?.qualityFlags as string[]) || []);
      setResumeData(schema);
      setAvailableSections(getPopulatedSections(schema));
      stopProgress();

      // Generate PDF preview
      await generatePdf(schema, selectedTemplate, level);

      toast.success("Curriculo criado!");
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error("Resume creation error:", msg);
      toast.error(msg || "Erro ao criar curriculo.");
    } finally {
      setLoading(false);
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
        progressInterval.current = null;
      }
    }
  }

  const handleUploadCreate = async () => {
    if (!file) return;
    const text = await extractTextFromFile(file);

    // Pre-validate
    setValidating(true);
    setValidationBlock(null);
    setValidationWarnings([]);
    const validation = await validateUploadedResume(text);
    setValidating(false);

    if (validation && !validation.pode_gerar) {
      setValidationBlock(validation.campos_obrigatorios_ausentes);
      return;
    }

    if (validation && validation.campos_importantes_ausentes.length > 0) {
      setValidationWarnings(validation.campos_importantes_ausentes);
    }

    handleCreate({ existingResume: text, mode: "improve" });
  };

  const handleScratchCreate = () => {
    handleCreate({
      mode: "scratch",
      personalInfo: { name, email, phone, location, linkedin, github, website },
      objective,
      experience: experiences,
      education: educations,
      projects: projects.filter((p) => p.name.trim()),
      skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
      languages: languages.split(",").map((s) => s.trim()).filter(Boolean),
    });
  };

  const handleDownloadPDF = async () => {
    if (!resumeData) return;
    try {
      await downloadResumePDF(resumeData, selectedTemplate, undefined, candidateLevel, currentAdjustments());
    } catch {
      toast.error("Erro ao baixar PDF.");
    }
  };

  const handleReset = () => {
    setResumeData(null);
    setMode(null);
    setFile(null);
    setProgress(0);
    setProgressMsg("");
    setValidationBlock(null);
    setValidationWarnings([]);
    setCandidateLevel(undefined);
    setGenerationNotes(null);
    setQualityReport(null);
    setPostCorrections([]);
    setQualityFlags([]);
    setFontSizeOffset(0);
    setSpacingOffset(0);
    setHiddenSections([]);
    setEditingSection(null);
    setAvailableSections([]);
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
  };

  // Form helpers
  const addExperience = () => setExperiences([...experiences, { company: "", position: "", startDate: "", endDate: "", description: "" }]);
  const removeExperience = (i: number) => setExperiences(experiences.filter((_, idx) => idx !== i));
  const updateExperience = (i: number, field: keyof FormExperience, value: string) => {
    const updated = [...experiences];
    updated[i] = { ...updated[i], [field]: value };
    setExperiences(updated);
  };
  const addEducation = () => setEducations([...educations, { institution: "", degree: "", field: "", startDate: "", endDate: "" }]);
  const removeEducation = (i: number) => setEducations(educations.filter((_, idx) => idx !== i));
  const updateEducation = (i: number, field: keyof FormEducation, value: string) => {
    const updated = [...educations];
    updated[i] = { ...updated[i], [field]: value };
    setEducations(updated);
  };
  const addProject = () => setProjects([...projects, { type: "", name: "", description: "", startDate: "", endDate: "", link: "" }]);
  const removeProject = (i: number) => setProjects(projects.filter((_, idx) => idx !== i));
  const updateProject = (i: number, field: keyof FormProject, value: string) => {
    const updated = [...projects];
    updated[i] = { ...updated[i], [field]: value };
    setProjects(updated);
  };

  // ════════════════════════════════════════════════════
  // RESULT VIEW
  // ════════════════════════════════════════════════════

  if (resumeData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold font-heading text-white flex items-center gap-3">
            <FilePlus className="w-7 h-7 text-primary-400" />
            Curriculo Criado
          </h1>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-gray-300 rounded-lg hover:bg-white/10 transition-colors text-sm"
          >
            <RefreshCw className="w-4 h-4" /> Novo curriculo
          </button>
        </div>

        {/* Warning banner for missing important fields */}
        {validationWarnings.length > 0 && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-yellow-300">Currículo gerado com informações limitadas</h3>
                <p className="text-xs text-yellow-400/80 mt-1">As seguintes informações não foram encontradas no currículo enviado:</p>
                <ul className="mt-2 space-y-1">
                  {validationWarnings.map((campo, i) => (
                    <li key={i} className="text-xs text-yellow-400/70">- {CAMPO_LABELS[campo] || campo}</li>
                  ))}
                </ul>
                <p className="text-xs text-yellow-400/60 mt-2">Quanto mais completo o currículo enviado, melhor será o resultado.</p>
              </div>
            </div>
          </div>
        )}

        {/* Template selector */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
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
                  <span className={`text-sm font-medium ${selectedTemplate === t.id ? "text-primary-400" : "text-gray-300"}`}>
                    {t.label}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{t.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* PDF Preview + Feedback sidebar */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* PDF Preview */}
          <div className="flex-1 min-w-0">
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden">
              {pdfLoading ? (
                <div className="flex items-center justify-center py-32">
                  <div className="text-center">
                    <div className="w-8 h-8 border-2 border-primary-400 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-sm text-gray-400 mt-3">Gerando PDF...</p>
                  </div>
                </div>
              ) : pdfUrl ? (
                <iframe
                  src={pdfUrl}
                  className="w-full rounded-xl"
                  style={{ height: "75vh", minHeight: "500px" }}
                  title="Preview do currículo"
                />
              ) : (
                <div className="flex items-center justify-center py-32">
                  <p className="text-sm text-gray-500">Erro ao carregar preview.</p>
                </div>
              )}
            </div>
          </div>

          {/* Editor + Feedback sidebar */}
          <div className="w-full lg:w-80 lg:flex-shrink-0 space-y-4">
            {/* Editor Controls */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Ajustes</h3>
                {(fontSizeOffset !== 0 || spacingOffset !== 0 || hiddenSections.length > 0) && (
                  <button
                    onClick={() => { setFontSizeOffset(0); setSpacingOffset(0); setHiddenSections([]); }}
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" /> Resetar
                  </button>
                )}
              </div>

              {/* Font size */}
              <div>
                <label className="text-xs text-gray-400 mb-2 flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5" /> Tamanho da fonte
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setFontSizeOffset(Math.max(fontSizeOffset - 1, -5))}
                    disabled={fontSizeOffset <= -5 || pdfLoading}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <div className="flex-1 h-1.5 bg-white/5 rounded-full relative">
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary-400 border-2 border-dark-800 transition-all"
                      style={{ left: `${((fontSizeOffset + 5) / 10) * 100}%`, transform: "translate(-50%, -50%)" }}
                    />
                  </div>
                  <button
                    onClick={() => setFontSizeOffset(Math.min(fontSizeOffset + 1, 5))}
                    disabled={fontSizeOffset >= 5 || pdfLoading}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs text-gray-500 w-8 text-right font-mono">
                    {fontSizeOffset > 0 ? `+${fontSizeOffset}` : fontSizeOffset}
                  </span>
                </div>
              </div>

              {/* Spacing */}
              <div>
                <label className="text-xs text-gray-400 mb-2 flex items-center gap-1.5">
                  <AlignJustify className="w-3.5 h-3.5" /> Espaçamento
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSpacingOffset(Math.max(spacingOffset - 1, -5))}
                    disabled={spacingOffset <= -5 || pdfLoading}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <div className="flex-1 h-1.5 bg-white/5 rounded-full relative">
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary-400 border-2 border-dark-800 transition-all"
                      style={{ left: `${((spacingOffset + 5) / 10) * 100}%`, transform: "translate(-50%, -50%)" }}
                    />
                  </div>
                  <button
                    onClick={() => setSpacingOffset(Math.min(spacingOffset + 1, 5))}
                    disabled={spacingOffset >= 5 || pdfLoading}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs text-gray-500 w-8 text-right font-mono">
                    {spacingOffset > 0 ? `+${spacingOffset}` : spacingOffset}
                  </span>
                </div>
              </div>

              {/* Section visibility + editing */}
              <div>
                <label className="text-xs text-gray-400 mb-2 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" /> Seções
                </label>
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
                                setHiddenSections(prev =>
                                  isHidden ? prev.filter(s => s !== key) : [...prev, key]
                                );
                                if (!isHidden) setEditingSection(prev => prev === key ? null : prev);
                              }}
                              disabled={pdfLoading}
                              className={`flex-1 flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all ${
                                isHidden
                                  ? "bg-red-500/10 text-red-400/70 border border-red-500/20"
                                  : "bg-white/[0.02] text-gray-300 border border-white/[0.06] hover:bg-white/[0.05]"
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
                              isEditing
                                ? "bg-primary-500/20 border-primary-500/40 text-primary-400"
                                : "bg-white/[0.02] border-white/[0.06] text-gray-500 hover:text-gray-300 hover:bg-white/[0.05]"
                            } disabled:opacity-30 disabled:cursor-not-allowed`}
                          >
                            <PenLine className="w-3 h-3" />
                          </button>
                        </div>
                        {isEditing && resumeData && (
                          <SectionEditor
                            section={key}
                            data={resumeData}
                            onUpdate={updateResume}
                            pdfLoading={pdfLoading}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <ResumeFeedback
              postCorrections={postCorrections}
              qualityFlags={qualityFlags}
            />
          </div>
        </div>

        {/* Download */}
        <div className="flex justify-center">
          <Button onClick={handleDownloadPDF} disabled={pdfLoading} className="px-8">
            <Download className="w-4 h-4 mr-2" />
            Baixar PDF
          </Button>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════
  // FORM VIEW
  // ════════════════════════════════════════════════════

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading text-white flex items-center gap-3">
          <FilePlus className="w-7 h-7 text-primary-400" />
          Criar Curriculo
        </h1>
        <p className="text-gray-400 mt-1">Crie um currículo profissional com IA. Resultado em PDF otimizado para ATS.</p>
        <span className="inline-block mt-2 bg-primary-500/10 text-primary-400 text-xs rounded-lg px-2.5 py-1">1 crédito por criação</span>
      </div>

      {/* Validation block message */}
      {validationBlock && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <XCircle className="w-6 h-6 text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-base font-semibold text-red-300">Não foi possível gerar o currículo</h3>
              <p className="text-sm text-red-400/80 mt-1">O currículo enviado não contém informações suficientes para gerar um novo currículo de qualidade.</p>
              <p className="text-sm text-red-400/70 mt-3">Informações não encontradas:</p>
              <ul className="mt-1 space-y-1">
                {validationBlock.map((campo, i) => (
                  <li key={i} className="text-sm text-red-400/70">- {CAMPO_LABELS[campo] || campo}</li>
                ))}
              </ul>
              <div className="mt-4">
                <Button onClick={() => { setValidationBlock(null); setFile(null); }} variant="outline" size="sm">
                  Enviar outro curriculo
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {!mode ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-1 cursor-pointer hover:border-primary-500/30 transition-colors"
            onClick={() => setMode("upload")}
          >
            <div className="flex flex-col items-center py-12 text-center px-4">
              <div className="w-16 h-16 bg-primary-500/10 rounded-2xl flex items-center justify-center mb-4">
                <Upload className="w-8 h-8 text-primary-400" />
              </div>
              <h3 className="text-lg font-semibold font-heading text-white">A partir de currículo existente</h3>
              <p className="text-sm text-gray-500 mt-2">Envie seu currículo e a IA vai reorganizar e melhorar.</p>
            </div>
          </div>
          <div
            className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-1 cursor-pointer hover:border-primary-500/30 transition-colors"
            onClick={() => setMode("scratch")}
          >
            <div className="flex flex-col items-center py-12 text-center px-4">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-4">
                <PenLine className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold font-heading text-white">Criar do zero</h3>
              <p className="text-sm text-gray-500 mt-2">Preencha um formulario e a IA cria seu curriculo.</p>
            </div>
          </div>
        </div>
      ) : mode === "upload" ? (
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl">
          <div className="px-6 py-4 border-b border-white/[0.06]">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold font-heading text-white">Envie seu currículo</h2>
              <button onClick={() => setMode(null)} className="text-sm text-gray-400 hover:text-white transition-colors">Voltar</button>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <FileUpload onFileSelect={setFile} selectedFile={file} onClear={() => setFile(null)} />
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Custo: 1 crédito</span>
              <Button onClick={handleUploadCreate} disabled={!file || loading || validating} loading={loading || validating}>
                {validating ? "Validando..." : "Criar currículo"}
              </Button>
            </div>
            {loading && <ProgressBar progress={progress} message={progressMsg} />}
          </div>
        </div>
      ) : (
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl">
          <div className="px-6 py-4 border-b border-white/[0.06]">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold font-heading text-white">Preencha seus dados</h2>
              <button onClick={() => setMode(null)} className="text-sm text-gray-400 hover:text-white transition-colors">Voltar</button>
            </div>
          </div>
          <div className="p-6 space-y-6">
            {/* Personal info */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6">
              <h3 className="font-medium text-white mb-3">Dados Pessoais</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Nome completo" value={name} onChange={(e) => setName(e.target.value)} />
                <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <Input label="Telefone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                <Input label="Localização" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Cidade - Estado" />
                <Input label="LinkedIn" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="linkedin.com/in/seu-perfil" />
                <Input label="Link opcional" value={github} onChange={(e) => setGithub(e.target.value)} placeholder="github.com, behance.net, etc." />
                <Input label="Portfolio / Site" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="meusite.com.br (opcional)" />
              </div>
            </div>

            {/* Objective */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6">
              <label className="block text-sm font-medium text-gray-300 mb-1">Objetivo profissional</label>
              <textarea value={objective} onChange={(e) => setObjective(e.target.value)} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 min-h-[80px]" />
            </div>

            {/* Experiences */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-white">Experiências</h3>
                <button onClick={addExperience} className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-white/5 text-gray-400 hover:bg-white/10 rounded-xl transition-colors">
                  <Plus className="w-4 h-4" /> Adicionar
                </button>
              </div>
              {experiences.map((exp, i) => (
                <div key={i} className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl mb-3 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-400">Experiência {i + 1}</span>
                    {experiences.length > 1 && (
                      <button onClick={() => removeExperience(i)} className="text-red-400 hover:text-red-300 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input label="Empresa" value={exp.company} onChange={(e) => updateExperience(i, "company", e.target.value)} />
                    <Input label="Cargo" value={exp.position} onChange={(e) => updateExperience(i, "position", e.target.value)} />
                    <Input label="Início" type="month" value={exp.startDate} onChange={(e) => updateExperience(i, "startDate", e.target.value)} placeholder="Ex: Janeiro 2024" />
                    <Input label="Fim" type="month" value={exp.endDate} onChange={(e) => updateExperience(i, "endDate", e.target.value)} placeholder="Ex: Dezembro 2024 (vazio = atual)" />
                  </div>
                  <textarea value={exp.description} onChange={(e) => updateExperience(i, "description", e.target.value)} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50" placeholder="Descreva suas atividades e conquistas" />
                </div>
              ))}
            </div>

            {/* Education */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-white">Formação</h3>
                <button onClick={addEducation} className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-white/5 text-gray-400 hover:bg-white/10 rounded-xl transition-colors">
                  <Plus className="w-4 h-4" /> Adicionar
                </button>
              </div>
              {educations.map((edu, i) => (
                <div key={i} className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl mb-3 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-400">Formação {i + 1}</span>
                    {educations.length > 1 && (
                      <button onClick={() => removeEducation(i)} className="text-red-400 hover:text-red-300 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="w-full">
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">Grau</label>
                      <select
                        value={edu.degree}
                        onChange={(e) => updateEducation(i, "degree", e.target.value)}
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 hover:border-white/20 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-200 cursor-pointer"
                      >
                        <option value="" className="bg-[#1a1a2e] text-gray-400">Selecione o grau</option>
                        <option value="Ensino Médio" className="bg-[#1a1a2e]">Ensino Medio</option>
                        <option value="Técnico" className="bg-[#1a1a2e]">Tecnico</option>
                        <option value="Tecnólogo" className="bg-[#1a1a2e]">Tecnologo</option>
                        <option value="Graduação" className="bg-[#1a1a2e]">Graduação</option>
                        <option value="Pós-graduação" className="bg-[#1a1a2e]">Pos-graduação</option>
                        <option value="MBA" className="bg-[#1a1a2e]">MBA</option>
                        <option value="Mestrado" className="bg-[#1a1a2e]">Mestrado</option>
                        <option value="Doutorado" className="bg-[#1a1a2e]">Doutorado</option>
                        <option value="Curso Livre" className="bg-[#1a1a2e]">Curso Livre</option>
                        <option value="Bootcamp" className="bg-[#1a1a2e]">Bootcamp</option>
                      </select>
                    </div>
                    <Input label="Instituição" value={edu.institution} onChange={(e) => updateEducation(i, "institution", e.target.value)} />
                    {edu.degree !== "Ensino Médio" && (
                      <Input label="Área" value={edu.field} onChange={(e) => updateEducation(i, "field", e.target.value)} />
                    )}
                    <Input label="Início" type="month" value={edu.startDate} onChange={(e) => updateEducation(i, "startDate", e.target.value)} placeholder="Ex: Fevereiro 2020" />
                    <Input label="Fim" type="month" value={edu.endDate} onChange={(e) => updateEducation(i, "endDate", e.target.value)} placeholder="Ex: Dezembro 2024 (vazio = cursando)" />
                  </div>
                </div>
              ))}
            </div>

            {/* Projects */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-white">Projetos e atividades extracurriculares <span className="text-gray-500 font-normal text-sm">(opcional)</span></h3>
                <button onClick={addProject} className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-white/5 text-gray-400 hover:bg-white/10 rounded-xl transition-colors">
                  <Plus className="w-4 h-4" /> Adicionar
                </button>
              </div>
              {projects.length === 0 && (
                <p className="text-sm text-gray-500">Nenhum projeto adicionado. Clique em &quot;Adicionar&quot; para incluir projetos pessoais, trabalhos voluntarios, freelances, etc.</p>
              )}
              {projects.map((proj, i) => (
                <div key={i} className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl mb-3 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-400">Projeto {i + 1}</span>
                    <button onClick={() => removeProject(i)} className="text-red-400 hover:text-red-300 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="w-full">
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">Tipo</label>
                      <select
                        value={proj.type}
                        onChange={(e) => updateProject(i, "type", e.target.value)}
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 hover:border-white/20 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-200 cursor-pointer"
                      >
                        <option value="" className="bg-[#1a1a2e] text-gray-400">Selecione o tipo</option>
                        <option value="Projeto Pessoal" className="bg-[#1a1a2e]">Projeto Pessoal</option>
                        <option value="Trabalho Voluntário" className="bg-[#1a1a2e]">Trabalho Voluntario</option>
                        <option value="Freelance" className="bg-[#1a1a2e]">Freelance</option>
                        <option value="Open Source" className="bg-[#1a1a2e]">Open Source</option>
                        <option value="Trabalho Acadêmico" className="bg-[#1a1a2e]">Trabalho Academico</option>
                        <option value="Hackathon" className="bg-[#1a1a2e]">Hackathon</option>
                        <option value="Outro" className="bg-[#1a1a2e]">Outro</option>
                      </select>
                    </div>
                    <Input label="Nome" value={proj.name} onChange={(e) => updateProject(i, "name", e.target.value)} placeholder="Nome do projeto" />
                    <Input label="Início" type="month" value={proj.startDate} onChange={(e) => updateProject(i, "startDate", e.target.value)} placeholder="Ex: Março 2024" />
                    <Input label="Fim" type="month" value={proj.endDate} onChange={(e) => updateProject(i, "endDate", e.target.value)} placeholder="Ex: Junho 2024 (opcional)" />
                  </div>
                  <textarea
                    value={proj.description}
                    onChange={(e) => updateProject(i, "description", e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                    placeholder="Descreva o projeto, tecnologias usadas e seu papel"
                  />
                  <Input label="Link (opcional)" value={proj.link} onChange={(e) => updateProject(i, "link", e.target.value)} placeholder="https://github.com/... ou URL do projeto" />
                </div>
              ))}
            </div>

            {/* Skills & Languages */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6">
                <label className="block text-sm font-medium text-gray-300 mb-1">Habilidades (separadas por virgula)</label>
                <textarea value={skills} onChange={(e) => setSkills(e.target.value)} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 min-h-[80px]" placeholder="React, TypeScript, Node.js..." />
              </div>
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6">
                <label className="block text-sm font-medium text-gray-300 mb-1">Idiomas (separados por vírgula)</label>
                <textarea value={languages} onChange={(e) => setLanguages(e.target.value)} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 min-h-[80px]" placeholder="Português (nativo), Inglês (avançado)..." />
              </div>
            </div>

            <div className="flex justify-between items-center pt-4">
              <span className="text-sm text-gray-500">Custo: 1 crédito</span>
              <Button onClick={handleScratchCreate} loading={loading} disabled={!name || loading}>
                Criar curriculo
              </Button>
            </div>

            {loading && <ProgressBar progress={progress} message={progressMsg} />}
          </div>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════
// Section Editor — inline editing of resume content
// ════════════════════════════════════════════════════

const editCls = "w-full px-2 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary-500/50 resize-none";
const editLabel = "text-[10px] text-gray-500 mb-0.5 block";

function SectionEditor({
  section,
  data,
  onUpdate,
  pdfLoading,
}: {
  section: SectionName;
  data: ResumeSchema;
  onUpdate: (updater: (d: ResumeSchema) => ResumeSchema) => void;
  pdfLoading: boolean;
}) {
  switch (section) {
    // ── Header (personal info) ──
    case "header":
      return (
        <div className="mt-2 pl-2 border-l border-primary-500/30 space-y-1.5">
          <label className={editLabel}>Nome</label>
          <input
            value={data.basics.name}
            onChange={e => onUpdate(d => ({ ...d, basics: { ...d.basics, name: e.target.value } }))}
            className={editCls}
            placeholder="Nome completo"
          />
          <label className={editLabel}>Cargo / Título</label>
          <input
            value={data.basics.label}
            onChange={e => onUpdate(d => ({ ...d, basics: { ...d.basics, label: e.target.value } }))}
            className={editCls}
            placeholder="Ex: Desenvolvedor Full Stack"
          />
          <div className="grid grid-cols-2 gap-1">
            <div>
              <label className={editLabel}>Email</label>
              <input
                value={data.basics.email}
                onChange={e => onUpdate(d => ({ ...d, basics: { ...d.basics, email: e.target.value } }))}
                className={editCls}
                placeholder="Email"
              />
            </div>
            <div>
              <label className={editLabel}>Telefone</label>
              <input
                value={data.basics.phone}
                onChange={e => onUpdate(d => ({ ...d, basics: { ...d.basics, phone: e.target.value } }))}
                className={editCls}
                placeholder="Telefone"
              />
            </div>
          </div>
          <label className={editLabel}>Localização</label>
          <input
            value={data.basics.location}
            onChange={e => onUpdate(d => ({ ...d, basics: { ...d.basics, location: e.target.value } }))}
            className={editCls}
            placeholder="Cidade - Estado"
          />
          <label className={editLabel}>LinkedIn</label>
          <input
            value={data.basics.linkedin || ""}
            onChange={e => onUpdate(d => ({ ...d, basics: { ...d.basics, linkedin: e.target.value } }))}
            className={editCls}
            placeholder="linkedin.com/in/seu-perfil"
          />
          <label className={editLabel}>GitHub / Link</label>
          <input
            value={data.basics.github || ""}
            onChange={e => onUpdate(d => ({ ...d, basics: { ...d.basics, github: e.target.value } }))}
            className={editCls}
            placeholder="github.com/usuario"
          />
          <label className={editLabel}>Portfolio / Site</label>
          <input
            value={data.basics.website || ""}
            onChange={e => onUpdate(d => ({ ...d, basics: { ...d.basics, website: e.target.value } }))}
            className={editCls}
            placeholder="meusite.com.br"
          />
        </div>
      );

    // ── Summary ──
    case "summary":
      return (
        <div className="mt-2 pl-2 border-l border-primary-500/30 space-y-1">
          <textarea
            rows={4}
            value={data.basics.summary}
            onChange={e => onUpdate(d => ({ ...d, basics: { ...d.basics, summary: e.target.value } }))}
            className={editCls}
            placeholder="Resumo profissional"
          />
        </div>
      );

    // ── Skills ──
    case "skills": {
      // Group by category for display
      const groups = new Map<string, number[]>();
      data.skills.forEach((s, i) => {
        const cat = s.category || "";
        if (!groups.has(cat)) groups.set(cat, []);
        groups.get(cat)!.push(i);
      });
      return (
        <div className="mt-2 pl-2 border-l border-primary-500/30 space-y-2">
          {Array.from(groups.entries()).map(([cat, indices]) => (
            <div key={cat || "__no_cat"} className="space-y-1">
              <div className="flex items-center gap-1">
                <input
                  value={cat}
                  onChange={e => {
                    const newCat = e.target.value;
                    onUpdate(d => {
                      const skills = [...d.skills];
                      for (const idx of indices) skills[idx] = { ...skills[idx], category: newCat };
                      return { ...d, skills };
                    });
                  }}
                  className={`${editCls} flex-1`}
                  placeholder="Categoria"
                />
                <button
                  onClick={() => onUpdate(d => ({
                    ...d,
                    skills: d.skills.filter((_, i) => !indices.includes(i)),
                  }))}
                  className="text-red-400/60 hover:text-red-400 p-0.5"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
              <textarea
                rows={2}
                value={indices.map(i => data.skills[i].name).join(", ")}
                onChange={e => {
                  const names = e.target.value.split(",").map(n => n.trim());
                  onUpdate(d => {
                    let skills = d.skills.filter((_, i) => !indices.includes(i));
                    const catVal = cat;
                    const newSkills = names.filter(Boolean).map(name => ({ category: catVal, name, level: "" }));
                    skills = [...skills, ...newSkills];
                    return { ...d, skills };
                  });
                }}
                className={editCls}
                placeholder="Skill1, Skill2, Skill3"
              />
            </div>
          ))}
          <button
            onClick={() => onUpdate(d => ({
              ...d,
              skills: [...d.skills, { category: "", name: "Nova skill", level: "" }],
            }))}
            disabled={pdfLoading}
            className="flex items-center gap-1 text-[10px] text-primary-400 hover:text-primary-300"
          >
            <Plus className="w-3 h-3" /> Grupo
          </button>
        </div>
      );
    }

    // ── Work ──
    case "work":
      return (
        <div className="mt-2 pl-2 border-l border-primary-500/30 space-y-3">
          {data.work.map((w, i) => (
            <div key={i} className="space-y-1 bg-white/[0.02] rounded-lg p-2">
              <div className="flex items-center justify-between">
                <span className={editLabel}>{w.position || "Experiência"} — {w.company || "Empresa"}</span>
                <button
                  onClick={() => onUpdate(d => ({ ...d, work: d.work.filter((_, idx) => idx !== i) }))}
                  className="text-red-400/60 hover:text-red-400 p-0.5"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <input
                  value={w.position}
                  onChange={e => onUpdate(d => {
                    const work = [...d.work]; work[i] = { ...work[i], position: e.target.value }; return { ...d, work };
                  })}
                  className={editCls}
                  placeholder="Cargo"
                />
                <input
                  value={w.company}
                  onChange={e => onUpdate(d => {
                    const work = [...d.work]; work[i] = { ...work[i], company: e.target.value }; return { ...d, work };
                  })}
                  className={editCls}
                  placeholder="Empresa"
                />
                <input
                  value={w.startDate}
                  onChange={e => onUpdate(d => {
                    const work = [...d.work]; work[i] = { ...work[i], startDate: e.target.value }; return { ...d, work };
                  })}
                  className={editCls}
                  placeholder="Início"
                />
                <input
                  value={w.endDate}
                  onChange={e => onUpdate(d => {
                    const work = [...d.work]; work[i] = { ...work[i], endDate: e.target.value }; return { ...d, work };
                  })}
                  className={editCls}
                  placeholder="Fim"
                />
              </div>
              <span className={editLabel}>Bullets:</span>
              {w.highlights.map((h, j) => (
                <div key={j} className="flex items-start gap-1">
                  <textarea
                    rows={2}
                    value={h}
                    onChange={e => onUpdate(d => {
                      const work = [...d.work];
                      const highlights = [...work[i].highlights];
                      highlights[j] = e.target.value;
                      work[i] = { ...work[i], highlights };
                      return { ...d, work };
                    })}
                    className={`${editCls} flex-1`}
                  />
                  <button
                    onClick={() => onUpdate(d => {
                      const work = [...d.work];
                      work[i] = { ...work[i], highlights: work[i].highlights.filter((_, idx) => idx !== j) };
                      return { ...d, work };
                    })}
                    className="text-red-400/60 hover:text-red-400 p-1 mt-1"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => onUpdate(d => {
                  const work = [...d.work];
                  work[i] = { ...work[i], highlights: [...work[i].highlights, ""] };
                  return { ...d, work };
                })}
                className="flex items-center gap-1 text-[10px] text-primary-400 hover:text-primary-300"
              >
                <Plus className="w-3 h-3" /> Bullet
              </button>
            </div>
          ))}
        </div>
      );

    // ── Education ──
    case "education":
      return (
        <div className="mt-2 pl-2 border-l border-primary-500/30 space-y-2">
          {data.education.map((e, i) => (
            <div key={i} className="space-y-1 bg-white/[0.02] rounded-lg p-2">
              <div className="flex items-center justify-between">
                <span className={editLabel}>{e.studyType || "Formação"} {e.area ? `em ${e.area}` : ""}</span>
                <button
                  onClick={() => onUpdate(d => ({ ...d, education: d.education.filter((_, idx) => idx !== i) }))}
                  className="text-red-400/60 hover:text-red-400 p-0.5"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
              <input
                value={e.institution}
                onChange={ev => onUpdate(d => {
                  const education = [...d.education]; education[i] = { ...education[i], institution: ev.target.value }; return { ...d, education };
                })}
                className={editCls}
                placeholder="Instituição"
              />
              <div className="grid grid-cols-2 gap-1">
                <input
                  value={e.studyType}
                  onChange={ev => onUpdate(d => {
                    const education = [...d.education]; education[i] = { ...education[i], studyType: ev.target.value }; return { ...d, education };
                  })}
                  className={editCls}
                  placeholder="Grau"
                />
                <input
                  value={e.area}
                  onChange={ev => onUpdate(d => {
                    const education = [...d.education]; education[i] = { ...education[i], area: ev.target.value }; return { ...d, education };
                  })}
                  className={editCls}
                  placeholder="Área"
                />
                <input
                  value={e.startDate}
                  onChange={ev => onUpdate(d => {
                    const education = [...d.education]; education[i] = { ...education[i], startDate: ev.target.value }; return { ...d, education };
                  })}
                  className={editCls}
                  placeholder="Início"
                />
                <input
                  value={e.endDate}
                  onChange={ev => onUpdate(d => {
                    const education = [...d.education]; education[i] = { ...education[i], endDate: ev.target.value }; return { ...d, education };
                  })}
                  className={editCls}
                  placeholder="Fim"
                />
              </div>
            </div>
          ))}
        </div>
      );

    // ── Projects ──
    case "projects":
      return (
        <div className="mt-2 pl-2 border-l border-primary-500/30 space-y-2">
          {data.projects.map((p, i) => (
            <div key={i} className="space-y-1 bg-white/[0.02] rounded-lg p-2">
              <div className="flex items-center justify-between">
                <span className={editLabel}>{p.name || "Projeto"}</span>
                <button
                  onClick={() => onUpdate(d => ({ ...d, projects: d.projects.filter((_, idx) => idx !== i) }))}
                  className="text-red-400/60 hover:text-red-400 p-0.5"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
              <input
                value={p.name}
                onChange={e => onUpdate(d => {
                  const projects = [...d.projects]; projects[i] = { ...projects[i], name: e.target.value }; return { ...d, projects };
                })}
                className={editCls}
                placeholder="Nome"
              />
              <textarea
                rows={2}
                value={p.description}
                onChange={e => onUpdate(d => {
                  const projects = [...d.projects]; projects[i] = { ...projects[i], description: e.target.value }; return { ...d, projects };
                })}
                className={editCls}
                placeholder="Descrição"
              />
              <input
                value={p.technologies.join(", ")}
                onChange={e => onUpdate(d => {
                  const projects = [...d.projects];
                  projects[i] = { ...projects[i], technologies: e.target.value.split(",").map(t => t.trim()).filter(Boolean) };
                  return { ...d, projects };
                })}
                className={editCls}
                placeholder="Tecnologias (separadas por vírgula)"
              />
              {p.highlights.length > 0 && (
                <>
                  <span className={editLabel}>Bullets:</span>
                  {p.highlights.map((h, j) => (
                    <div key={j} className="flex items-start gap-1">
                      <textarea
                        rows={2}
                        value={h}
                        onChange={e => onUpdate(d => {
                          const projects = [...d.projects];
                          const highlights = [...projects[i].highlights];
                          highlights[j] = e.target.value;
                          projects[i] = { ...projects[i], highlights };
                          return { ...d, projects };
                        })}
                        className={`${editCls} flex-1`}
                      />
                      <button
                        onClick={() => onUpdate(d => {
                          const projects = [...d.projects];
                          projects[i] = { ...projects[i], highlights: projects[i].highlights.filter((_, idx) => idx !== j) };
                          return { ...d, projects };
                        })}
                        className="text-red-400/60 hover:text-red-400 p-1 mt-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </>
              )}
            </div>
          ))}
        </div>
      );

    // ── Certifications ──
    case "certifications":
      return (
        <div className="mt-2 pl-2 border-l border-primary-500/30 space-y-2">
          {data.certifications.map((c, i) => (
            <div key={i} className="space-y-1 bg-white/[0.02] rounded-lg p-2">
              <div className="flex items-center justify-between">
                <span className={editLabel}>{c.name || "Certificação"}</span>
                <button
                  onClick={() => onUpdate(d => ({ ...d, certifications: d.certifications.filter((_, idx) => idx !== i) }))}
                  className="text-red-400/60 hover:text-red-400 p-0.5"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
              <input
                value={c.name}
                onChange={e => onUpdate(d => {
                  const certifications = [...d.certifications]; certifications[i] = { ...certifications[i], name: e.target.value }; return { ...d, certifications };
                })}
                className={editCls}
                placeholder="Nome"
              />
              <div className="grid grid-cols-2 gap-1">
                <input
                  value={c.issuer}
                  onChange={e => onUpdate(d => {
                    const certifications = [...d.certifications]; certifications[i] = { ...certifications[i], issuer: e.target.value }; return { ...d, certifications };
                  })}
                  className={editCls}
                  placeholder="Emissor"
                />
                <input
                  value={c.date}
                  onChange={e => onUpdate(d => {
                    const certifications = [...d.certifications]; certifications[i] = { ...certifications[i], date: e.target.value }; return { ...d, certifications };
                  })}
                  className={editCls}
                  placeholder="Data"
                />
              </div>
            </div>
          ))}
        </div>
      );

    // ── Languages ──
    case "languages":
      return (
        <div className="mt-2 pl-2 border-l border-primary-500/30 space-y-1.5">
          {data.languages.map((l, i) => (
            <div key={i} className="flex items-center gap-1">
              <input
                value={l.language}
                onChange={e => onUpdate(d => {
                  const languages = [...d.languages]; languages[i] = { ...languages[i], language: e.target.value }; return { ...d, languages };
                })}
                className={`${editCls} flex-1`}
                placeholder="Idioma"
              />
              <input
                value={l.fluency}
                onChange={e => onUpdate(d => {
                  const languages = [...d.languages]; languages[i] = { ...languages[i], fluency: e.target.value }; return { ...d, languages };
                })}
                className={`${editCls} flex-1`}
                placeholder="Nível"
              />
              <button
                onClick={() => onUpdate(d => ({ ...d, languages: d.languages.filter((_, idx) => idx !== i) }))}
                className="text-red-400/60 hover:text-red-400 p-0.5"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
          <button
            onClick={() => onUpdate(d => ({
              ...d,
              languages: [...d.languages, { language: "", fluency: "" }],
            }))}
            disabled={pdfLoading}
            className="flex items-center gap-1 text-[10px] text-primary-400 hover:text-primary-300"
          >
            <Plus className="w-3 h-3" /> Idioma
          </button>
        </div>
      );

    default:
      return null;
  }
}

function ProgressBar({ progress, message }: { progress: number; message: string }) {
  return (
    <div className="space-y-4 py-4">
      <div className="relative w-full h-3 bg-white/5 rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse rounded-full" />
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400 animate-pulse">{message}</p>
        <span className="text-xs text-gray-500 font-mono">{progress}%</span>
      </div>
    </div>
  );
}
