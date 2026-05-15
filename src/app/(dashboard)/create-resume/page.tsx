"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useAuthContext } from "@/components/providers/AuthProvider";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import FileUpload from "@/components/ui/FileUpload";
import { extractTextFromFile } from "@/utils/file-parser";
import { deductCredits, checkCredits } from "@/services/credits";
import { generateResumePDFBlob, downloadResumePDF, type PdfAdjustments } from "@/utils/resume-pdf";
import { Upload, PenLine, Plus, Trash2, Download, RefreshCw, FileText, AlertTriangle, XCircle, Type, AlignJustify, Eye, EyeOff, RotateCcw, Sparkles, User, Target, Briefcase, GraduationCap, FolderKanban, ChevronLeft, ChevronRight, Check } from "lucide-react";
import toast from "react-hot-toast";
import type { ResumeSchema, GenerationNotes, QualityReport } from "@/lib/resume-schema";
import type { TemplateName, SectionName } from "@/lib/resume-templates";
import { getDefaultSizesPx } from "@/lib/resume-templates";
import ResumeFeedback from "@/components/ui/ResumeFeedback";
import Modal from "@/components/ui/Modal";
import AIProgressModal from "@/components/ui/AIProgressModal";
import SaveLimitModal from "@/components/ui/SaveLimitModal";
import SaveSuccessModal from "@/components/ui/SaveSuccessModal";
import SaveButton from "@/components/ui/SaveButton";
import PxControl from "@/components/ui/PxControl";
import { useSavedItemSaver } from "@/hooks/useSavedItemSaver";
import { useAIProgress } from "@/hooks/useAIProgress";
import { listSavedItems, updateResumeItem } from "@/services/saved-items";

type Mode = "upload" | "scratch" | null;

interface FormExperience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
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
  customType: string;
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
  const { user, userData } = useAuthContext();
  const searchParams = useSearchParams();
  const editItemId = searchParams?.get("itemId") ?? null;
  const saver = useSavedItemSaver();
  const autoSaveEnabled = userData?.autoSaveDocuments ?? false;
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const editDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [mode, setMode] = useState<Mode>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [showGenerateConfirm, setShowGenerateConfirm] = useState(false);
  const pendingFormData = useRef<Record<string, unknown> | null>(null);
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
    finalMessage: "Currículo pronto!",
    expectedDuration: 18,
  });
  const [validationBlock, setValidationBlock] = useState<string[] | null>(null);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);
  const [candidateLevel, setCandidateLevel] = useState<string | undefined>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
const [generationNotes, setGenerationNotes] = useState<GenerationNotes | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_qualityReport, setQualityReport] = useState<QualityReport | null>(null);
  const [postCorrections, setPostCorrections] = useState<string[]>([]);
  const [qualityFlags, setQualityFlags] = useState<string[]>([]);

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
  const [experiences, setExperiences] = useState<FormExperience[]>([{ company: "", position: "", startDate: "", endDate: "", current: false, description: "" }]);
  const [educations, setEducations] = useState<FormEducation[]>([{ institution: "", degree: "", field: "", startDate: "", endDate: "" }]);
  const [projects, setProjects] = useState<FormProject[]>([]);

  // Multi-step form state (scratch mode only)
  const [step, setStep] = useState<number>(1);
  const [stepDirection, setStepDirection] = useState<"forward" | "backward">("forward");
  const SCRATCH_STEPS = [
    { num: 1, label: "Dados Pessoais", icon: User },
    { num: 2, label: "Objetivo", icon: Target },
    { num: 3, label: "Experiências", icon: Briefcase },
    { num: 4, label: "Formação", icon: GraduationCap },
    { num: 5, label: "Projetos", icon: FolderKanban },
    { num: 6, label: "Habilidades", icon: Sparkles },
  ];
  const TOTAL_STEPS = SCRATCH_STEPS.length;

  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
          startDate: (p.startDate as string) || "",
          endDate: (p.endDate as string) || "",
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

  // Per-category default sizes (px) — recomputed when content or template changes.
  const defaultSizes = useMemo(() => {
    if (!resumeData) return null;
    return getDefaultSizesPx(resumeData, selectedTemplate, { hiddenSections });
  }, [resumeData, selectedTemplate, hiddenSections]);

  // Build current adjustments object
  const currentAdjustments = useCallback((): PdfAdjustments => ({
    hiddenSections: hiddenSections.length > 0 ? hiddenSections : undefined,
    sectionTitleFontPx: sectionTitleFontPx ?? undefined,
    entryTitleFontPx: entryTitleFontPx ?? undefined,
    bodyFontPx: bodyFontPx ?? undefined,
    metaFontPx: metaFontPx ?? undefined,
    sectionSpacingPx: sectionSpacingPx ?? undefined,
  }), [hiddenSections, sectionTitleFontPx, entryTitleFontPx, bodyFontPx, metaFontPx, sectionSpacingPx]);

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
  }, [sectionTitleFontPx, entryTitleFontPx, bodyFontPx, metaFontPx, sectionSpacingPx, hiddenSections]);

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

  const buildResumePayload = useCallback(
    (schema: ResumeSchema, template: TemplateName, level?: string) => {
      const personalName = schema.basics?.name?.trim() || "Sem nome";
      const subtitle = schema.basics?.label?.trim() || undefined;
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
          title: personalName,
          subtitle,
          adjustments: Object.keys(cleanAdj).length > 0 ? cleanAdj : undefined,
        },
      };
    },
    [currentAdjustments]
  );

  // Prepare save flow for newly created resume — respects autoSave preference.
  const prepareNewResumeItem = useCallback(
    async (schema: ResumeSchema, template: TemplateName, level?: string) => {
      if (!user) return;
      await saver.prepare({
        uid: user.uid,
        type: "resume",
        payload: buildResumePayload(schema, template, level),
        autoSave: autoSaveEnabled,
      });
    },
    [user, saver, buildResumePayload, autoSaveEnabled]
  );

  // Load a saved resume for editing when ?itemId= is present
  useEffect(() => {
    if (!user || !editItemId) return;
    (async () => {
      try {
        const items = await listSavedItems(user.uid);
        const item = items.find((i) => i.id === editItemId && i.type === "resume");
        if (!item || item.type !== "resume") {
          toast.error("Currículo não encontrado ou expirado.");
          return;
        }
        setEditingItemId(item.id);
        const schema = item.resumeData as ResumeSchema;
        setResumeData(schema);
        setAvailableSections(getPopulatedSections(schema));
        setSelectedTemplate((item.template as TemplateName) || "profissional");
        setCandidateLevel(item.candidateLevel);
        if (item.adjustments) {
          const adj = item.adjustments as Record<string, unknown>;
          if (Array.isArray(adj.hiddenSections))
            setHiddenSections(adj.hiddenSections as SectionName[]);
          if (typeof adj.sectionTitleFontPx === "number") setSectionTitleFontPx(adj.sectionTitleFontPx);
          if (typeof adj.entryTitleFontPx === "number") setEntryTitleFontPx(adj.entryTitleFontPx);
          if (typeof adj.bodyFontPx === "number") setBodyFontPx(adj.bodyFontPx);
          if (typeof adj.metaFontPx === "number") setMetaFontPx(adj.metaFontPx);
          if (typeof adj.sectionSpacingPx === "number") setSectionSpacingPx(adj.sectionSpacingPx);
        }
        await generatePdf(
          schema,
          (item.template as TemplateName) || "profissional",
          item.candidateLevel,
          {
            hiddenSections: item.adjustments?.hiddenSections as SectionName[] | undefined,
            sectionTitleFontPx: (item.adjustments as Record<string, unknown> | undefined)?.sectionTitleFontPx as number | undefined,
            entryTitleFontPx: (item.adjustments as Record<string, unknown> | undefined)?.entryTitleFontPx as number | undefined,
            bodyFontPx: (item.adjustments as Record<string, unknown> | undefined)?.bodyFontPx as number | undefined,
            metaFontPx: (item.adjustments as Record<string, unknown> | undefined)?.metaFontPx as number | undefined,
            sectionSpacingPx: (item.adjustments as Record<string, unknown> | undefined)?.sectionSpacingPx as number | undefined,
          }
        );
      } catch {
        toast.error("Não foi possível carregar o currículo salvo.");
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, editItemId]);

  // Persist edits back to Firestore (expiresAt is NOT reset). Debounced.
  useEffect(() => {
    if (!user || !editingItemId || !resumeData) return;
    if (editDebounce.current) clearTimeout(editDebounce.current);
    editDebounce.current = setTimeout(() => {
      updateResumeItem(user.uid, editingItemId, {
        resumeData,
        template: selectedTemplate,
        candidateLevel,
        adjustments: {
          hiddenSections: hiddenSections.length > 0 ? hiddenSections : undefined,
          sectionTitleFontPx: sectionTitleFontPx ?? undefined,
          entryTitleFontPx: entryTitleFontPx ?? undefined,
          bodyFontPx: bodyFontPx ?? undefined,
          metaFontPx: metaFontPx ?? undefined,
          sectionSpacingPx: sectionSpacingPx ?? undefined,
        },
      }).catch(() => {});
    }, 800);
    return () => {
      if (editDebounce.current) clearTimeout(editDebounce.current);
    };
  }, [user, editingItemId, resumeData, selectedTemplate, candidateLevel, hiddenSections, sectionTitleFontPx, entryTitleFontPx, bodyFontPx, metaFontPx, sectionSpacingPx]);

  // Main create handler
  async function handleCreate(formData: Record<string, unknown>) {
    if (!user) return;

    const hasCredits = await checkCredits(user.uid, "resume-creation");
    if (!hasCredits) { toast.error("Créditos insuficientes."); return; }

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
      void prepareNewResumeItem(schema, selectedTemplate, level);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error("Resume creation error:", msg);
      toast.error(msg || "Erro ao criar curriculo.");
    } finally {
      setLoading(false);
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

    pendingFormData.current = { existingResume: text, mode: "improve" };
    setShowGenerateConfirm(true);
  };

  const handleScratchCreate = () => {
    const mappedExperiences = experiences
      .filter(isExperienceTouched)
      .map((exp) => ({
        company: exp.company,
        position: exp.position,
        startDate: exp.startDate,
        endDate: exp.current ? "atual" : exp.endDate,
        current: exp.current,
        description: exp.description,
      }));

    const mappedEducations = educations.filter(isEducationTouched);

    const mappedProjects = projects
      .filter(isProjectTouched)
      .map((p) => ({
        type: p.type === "Outro" ? p.customType.trim() || "Outro" : p.type,
        name: p.name,
        description: p.description,
        startDate: p.startDate,
        endDate: p.endDate,
        link: p.link,
      }));

    pendingFormData.current = {
      mode: "scratch",
      personalInfo: { name, email, phone, location, linkedin, github, website },
      objective,
      experience: mappedExperiences,
      education: mappedEducations,
      projects: mappedProjects,
      skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
      languages: languages.split(",").map((s) => s.trim()).filter(Boolean),
    };
    setShowGenerateConfirm(true);
  };

  const confirmGenerate = () => {
    setShowGenerateConfirm(false);
    if (pendingFormData.current) handleCreate(pendingFormData.current);
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
    setEditingItemId(null);
    setFile(null);
    setStep(1);
    setStepDirection("forward");
    resetProgress();
    setValidationBlock(null);
    setValidationWarnings([]);
    setCandidateLevel(undefined);
    setGenerationNotes(null);
    setQualityReport(null);
    setPostCorrections([]);
    setQualityFlags([]);
    setSectionTitleFontPx(null);
    setEntryTitleFontPx(null);
    setBodyFontPx(null);
    setMetaFontPx(null);
    setSectionSpacingPx(null);
    setHiddenSections([]);
    setEditingSection(null);
    setAvailableSections([]);
    saver.reset();
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
  };

  const handleManualSave = () => {
    if (!user) return;
    saver.saveManually(user.uid);
  };

  // Keep saver payload synced with edits to a freshly generated (not edit-mode) resume.
  useEffect(() => {
    if (editingItemId || !resumeData || saver.status === "idle") return;
    saver.updatePayload(
      buildResumePayload(resumeData, selectedTemplate, candidateLevel)
    );
    saver.markDirty();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeData, selectedTemplate, sectionTitleFontPx, entryTitleFontPx, bodyFontPx, metaFontPx, sectionSpacingPx, hiddenSections]);

  // For edit-mode (loaded from /my-files), the item is already saved; reflect that in the button.
  // The existing debounced updateResumeItem effect keeps the doc in sync as the user edits.
  const saveStatus = editingItemId ? "saved" : saver.status;

  // Helpers: a row is "touched" if the user has filled at least one substantive field.
  // Only touched rows are validated (required) and sent to the AI.
  const isExperienceTouched = (e: FormExperience) =>
    !!(e.company.trim() || e.position.trim() || e.startDate || e.endDate || e.description.trim());
  const isEducationTouched = (e: FormEducation) =>
    !!(e.degree || e.institution.trim() || e.field.trim() || e.startDate || e.endDate);
  const isProjectTouched = (p: FormProject) =>
    !!(p.type || p.customType.trim() || p.name.trim() || p.startDate || p.endDate || p.description.trim() || p.link.trim());

  // Form helpers
  const addExperience = () => setExperiences([...experiences, { company: "", position: "", startDate: "", endDate: "", current: false, description: "" }]);
  const removeExperience = (i: number) => setExperiences(experiences.filter((_, idx) => idx !== i));
  const updateExperience = <K extends keyof FormExperience>(i: number, field: K, value: FormExperience[K]) => {
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
  const addProject = () => setProjects([...projects, { type: "", customType: "", name: "", description: "", startDate: "", endDate: "", link: "" }]);
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
        {/* Result Hero Header */}
        <section className="relative overflow-hidden rounded-3xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-xl animate-fade-in-up">
          <div className="absolute -top-24 -left-16 w-80 h-80 bg-primary-500/20 rounded-full blur-[120px] animate-pulse-glow pointer-events-none" />
          <div
            className="absolute -bottom-32 -right-10 w-96 h-96 bg-accent-violet/20 rounded-full blur-[140px] animate-pulse-glow pointer-events-none"
            style={{ animationDelay: "1.5s" }}
          />
          <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
          <div className="relative p-8 md:p-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-300 mb-3">
                <Sparkles className="w-3 h-3" />
                Currículo gerado com sucesso
              </div>
              <h1 className="text-2xl md:text-4xl font-bold text-white font-heading leading-[1.1] tracking-tight">
                Seu currículo está <span className="gradient-text">pronto!</span>
              </h1>
            </div>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-white/[0.05] border border-white/[0.10] text-gray-300 rounded-xl hover:bg-white/[0.10] hover:border-white/20 transition-all duration-200 text-sm flex-shrink-0"
            >
              <RefreshCw className="w-4 h-4" /> Novo currículo
            </button>
          </div>
        </section>

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
                  src={`${pdfUrl}#pagemode=none&navpanes=0&toolbar=1`}
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

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button onClick={handleDownloadPDF} disabled={pdfLoading} className="px-8 glow-blue">
            <Download className="w-4 h-4 mr-2" />
            Baixar PDF
          </Button>
          {!editingItemId && (
            <SaveButton
              status={saveStatus}
              saving={saver.saving}
              disabled={pdfLoading}
              onClick={handleManualSave}
              className="px-6"
            />
          )}
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
      <section className="relative overflow-hidden rounded-3xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-xl animate-fade-in-up">
        <div className="absolute -top-24 -left-16 w-80 h-80 bg-primary-500/20 rounded-full blur-[120px] animate-pulse-glow pointer-events-none" />
        <div
          className="absolute -bottom-32 -right-10 w-96 h-96 bg-accent-violet/20 rounded-full blur-[140px] animate-pulse-glow pointer-events-none"
          style={{ animationDelay: "1.5s" }}
        />
        <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
        <div className="relative p-8 md:p-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-xs font-medium text-primary-300 mb-4">
            <Sparkles className="w-3 h-3" />
            Criar Currículo
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white font-heading leading-[1.1] tracking-tight">
            Construa seu currículo{" "}
            <span className="gradient-text">profissional</span>
          </h1>
          <p className="text-gray-400 mt-4 text-base md:text-lg max-w-xl leading-relaxed">
            Crie um currículo otimizado para ATS com inteligência artificial. Resultado em PDF pronto para enviar.
          </p>
          <span className="inline-block mt-4 bg-primary-500/10 border border-primary-500/20 text-primary-300 text-xs rounded-full px-3 py-1">
            1 crédito por criação
          </span>
        </div>
      </section>

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up animation-delay-200">
          <div
            className="group bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl cursor-pointer hover:border-primary-500/30 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
            onClick={() => setMode("upload")}
          >
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-primary-500 to-accent-violet opacity-0 group-hover:opacity-[0.08] transition-opacity duration-500 rounded-full blur-3xl pointer-events-none" />
            <div className="flex flex-col items-center py-12 text-center px-4 relative">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-violet rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-black/20 group-hover:scale-110 transition-transform duration-300">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold font-heading text-white">A partir de currículo existente</h3>
              <p className="text-sm text-gray-500 mt-2">Envie seu currículo e a IA vai reorganizar e melhorar.</p>
            </div>
          </div>
          <div
            className="group bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl cursor-pointer hover:border-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
            onClick={() => { setStep(1); setStepDirection("forward"); setMode("scratch"); }}
          >
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-[0.08] transition-opacity duration-500 rounded-full blur-3xl pointer-events-none" />
            <div className="flex flex-col items-center py-12 text-center px-4 relative">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-black/20 group-hover:scale-110 transition-transform duration-300">
                <PenLine className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold font-heading text-white">Criar do zero</h3>
              <p className="text-sm text-gray-500 mt-2">Preencha um formulário e a IA cria seu currículo.</p>
            </div>
          </div>
        </div>
      ) : mode === "upload" ? (
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl animate-fade-in-up animation-delay-200">
          <div className="px-6 py-4 border-b border-white/[0.06]">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold font-heading text-white">Envie seu currículo</h2>
              <button
                onClick={() => setMode(null)}
                disabled={loading || validating}
                className="text-sm text-gray-400 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-gray-400"
              >
                Voltar
              </button>
            </div>
          </div>
          <fieldset disabled={loading || validating} className="p-6 space-y-4 border-0 m-0 min-w-0 disabled:opacity-60 disabled:cursor-not-allowed">
            <FileUpload onFileSelect={setFile} selectedFile={file} onClear={() => setFile(null)} disabled={loading || validating} />
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Custo: 1 crédito</span>
              <Button onClick={handleUploadCreate} disabled={!file || loading || validating} loading={loading || validating} className="glow-blue">
                {validating ? "Validando..." : "Criar currículo"}
              </Button>
            </div>
          </fieldset>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (step < TOTAL_STEPS) {
              setStepDirection("forward");
              setStep(step + 1);
              window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
              handleScratchCreate();
            }
          }}
          className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl animate-fade-in-up animation-delay-200 overflow-hidden"
        >
          {/* Stepper header */}
          <div className="relative px-6 py-5 border-b border-white/[0.06] bg-gradient-to-r from-primary-500/[0.04] via-transparent to-accent-violet/[0.04]">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <p className="text-[11px] uppercase tracking-[0.15em] text-primary-400/70 font-semibold">Etapa {step} de {TOTAL_STEPS}</p>
                <h2 className="font-semibold font-heading text-white text-lg mt-1">{SCRATCH_STEPS[step - 1].label}</h2>
              </div>
              <button
                type="button"
                onClick={() => { setStep(1); setStepDirection("forward"); setMode(null); }}
                disabled={loading}
                className="text-sm text-gray-400 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-gray-400 flex-shrink-0"
              >
                Sair
              </button>
            </div>
            <div className="flex items-center">
              {SCRATCH_STEPS.map((s, idx) => {
                const isActive = step === s.num;
                const isCompleted = step > s.num;
                const Icon = s.icon;
                return (
                  <div key={s.num} className="flex items-center flex-1 last:flex-initial min-w-0">
                    <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 border ${
                          isActive
                            ? "bg-gradient-to-br from-primary-500 to-accent-violet border-primary-400/60 shadow-lg shadow-primary-500/30 scale-110"
                            : isCompleted
                            ? "bg-primary-500/15 border-primary-500/40"
                            : "bg-white/[0.04] border-white/10"
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="w-4 h-4 text-primary-300" />
                        ) : (
                          <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-gray-500"}`} />
                        )}
                      </div>
                      <span className={`text-[10px] md:text-[11px] font-medium hidden sm:block transition-colors text-center max-w-[80px] leading-tight ${
                        isActive ? "text-white" : isCompleted ? "text-primary-300/80" : "text-gray-500"
                      }`}>
                        {s.label}
                      </span>
                    </div>
                    {idx < SCRATCH_STEPS.length - 1 && (
                      <div className="flex-1 mx-1.5 md:mx-2 -mt-5 h-[2px] rounded-full overflow-hidden bg-white/[0.06]">
                        <div className={`h-full bg-gradient-to-r from-primary-500/80 to-accent-violet/80 transition-all duration-500 ease-out ${isCompleted ? "w-full" : "w-0"}`} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <fieldset disabled={loading} className="p-6 border-0 m-0 min-w-0 disabled:opacity-60 disabled:cursor-not-allowed">
            <div key={step} className={stepDirection === "forward" ? "animate-slide-in-right" : "animate-slide-in-left"}>
            {/* Step 1: Personal info */}
            {step === 1 && (
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6">
              <h3 className="font-medium text-white mb-3">Dados Pessoais</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Nome completo" value={name} onChange={(e) => setName(e.target.value)} required />
                <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <Input label="Telefone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                <Input label="Localização" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Cidade - Estado" required />
                <Input label="LinkedIn" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="linkedin.com/in/seu-perfil (opcional)" />
                <Input label="Link opcional" value={github} onChange={(e) => setGithub(e.target.value)} placeholder="github.com, behance.net, etc." />
                <Input label="Portfolio / Site" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="meusite.com.br (opcional)" />
              </div>
            </div>
            )}

            {/* Step 2: Objective */}
            {step === 2 && (
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">Objetivo profissional</label>
              <p className="text-xs text-gray-500 mb-3">Descreva em poucas linhas o cargo que busca, suas principais habilidades e o que você quer alcançar.</p>
              <textarea value={objective} onChange={(e) => setObjective(e.target.value)} required className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 min-h-[160px]" placeholder="Ex: Desenvolvedor Full-Stack com foco em React e Node.js, buscando atuar em..." />
            </div>
            )}

            {/* Step 3: Experiences */}
            {step === 3 && (
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-white">Experiências</h3>
                <button type="button" onClick={addExperience} className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-white/5 text-gray-400 hover:bg-white/10 rounded-xl transition-colors">
                  <Plus className="w-4 h-4" /> Adicionar
                </button>
              </div>
              {experiences.map((exp, i) => {
                const touched = isExperienceTouched(exp);
                return (
                <div key={i} className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl mb-3 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-400">Experiência {i + 1}</span>
                    {experiences.length > 1 && (
                      <button type="button" onClick={() => removeExperience(i)} className="text-red-400 hover:text-red-300 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input label="Empresa" value={exp.company} onChange={(e) => updateExperience(i, "company", e.target.value)} required={touched} />
                    <Input label="Cargo" value={exp.position} onChange={(e) => updateExperience(i, "position", e.target.value)} required={touched} />
                    <Input label="Início" type="month" value={exp.startDate} onChange={(e) => updateExperience(i, "startDate", e.target.value)} placeholder="Ex: Janeiro 2024" required={touched} />
                    <div className={exp.current ? "" : "space-y-2"}>
                      {!exp.current ? (
                        <Input label="Fim" type="month" value={exp.endDate} onChange={(e) => updateExperience(i, "endDate", e.target.value)} placeholder="Ex: Dezembro 2024" required={touched} />
                      ) : (
                        <div className="block text-sm font-medium text-gray-300 mb-1.5 invisible select-none" aria-hidden="true">Fim</div>
                      )}
                      <label className="flex items-center gap-2 cursor-pointer select-none w-fit">
                        <input
                          type="checkbox"
                          checked={exp.current}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setExperiences((prev) => {
                              const updated = [...prev];
                              updated[i] = {
                                ...updated[i],
                                current: checked,
                                ...(checked ? { endDate: "" } : {}),
                              };
                              return updated;
                            });
                          }}
                          className="w-4 h-4 rounded border-white/20 bg-white/5 text-primary-500 focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-0 cursor-pointer accent-primary-500"
                        />
                        <span className="text-sm text-gray-300">Trabalho atualmente aqui</span>
                      </label>
                    </div>
                  </div>
                  <textarea value={exp.description} onChange={(e) => updateExperience(i, "description", e.target.value)} required={touched} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50" placeholder="Descreva suas atividades e conquistas" />
                </div>
                );
              })}
            </div>
            )}

            {/* Step 4: Education */}
            {step === 4 && (
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-white">Formação</h3>
                <button type="button" onClick={addEducation} className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-white/5 text-gray-400 hover:bg-white/10 rounded-xl transition-colors">
                  <Plus className="w-4 h-4" /> Adicionar
                </button>
              </div>
              {educations.map((edu, i) => {
                const touched = isEducationTouched(edu);
                return (
                <div key={i} className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl mb-3 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-400">Formação {i + 1}</span>
                    {educations.length > 1 && (
                      <button type="button" onClick={() => removeEducation(i)} className="text-red-400 hover:text-red-300 transition-colors">
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
                        required={touched}
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
                    <Input label="Instituição" value={edu.institution} onChange={(e) => updateEducation(i, "institution", e.target.value)} required={touched} />
                    {edu.degree !== "Ensino Médio" && (
                      <Input label="Área" value={edu.field} onChange={(e) => updateEducation(i, "field", e.target.value)} required={touched} />
                    )}
                    <Input label="Início" type="month" value={edu.startDate} onChange={(e) => updateEducation(i, "startDate", e.target.value)} placeholder="Ex: Fevereiro 2020" required={touched} />
                    <Input label="Fim ou previsão" type="month" value={edu.endDate} onChange={(e) => updateEducation(i, "endDate", e.target.value)} placeholder="Ex: Dezembro 2024" required={touched} />
                  </div>
                </div>
                );
              })}
            </div>
            )}

            {/* Step 5: Projects */}
            {step === 5 && (
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-white">Projetos e atividades extracurriculares <span className="text-gray-500 font-normal text-sm">(opcional)</span></h3>
                <button type="button" onClick={addProject} className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-white/5 text-gray-400 hover:bg-white/10 rounded-xl transition-colors">
                  <Plus className="w-4 h-4" /> Adicionar
                </button>
              </div>
              {projects.length === 0 && (
                <p className="text-sm text-gray-500">Nenhum projeto adicionado. Clique em &quot;Adicionar&quot; para incluir projetos pessoais, trabalhos voluntarios, freelances, etc.</p>
              )}
              {projects.map((proj, i) => {
                const touched = isProjectTouched(proj);
                return (
                <div key={i} className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl mb-3 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-400">Projeto {i + 1}</span>
                    <button type="button" onClick={() => removeProject(i)} className="text-red-400 hover:text-red-300 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="w-full">
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">Tipo</label>
                      <select
                        value={proj.type}
                        onChange={(e) => {
                          const newType = e.target.value;
                          setProjects((prev) => {
                            const updated = [...prev];
                            updated[i] = {
                              ...updated[i],
                              type: newType,
                              ...(newType !== "Outro" ? { customType: "" } : {}),
                            };
                            return updated;
                          });
                        }}
                        required={touched}
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
                    <Input label="Nome" value={proj.name} onChange={(e) => updateProject(i, "name", e.target.value)} placeholder="Nome do projeto" required={touched} />
                    {proj.type === "Outro" && (
                      <div className="md:col-span-2">
                        <Input
                          label="Especifique o tipo"
                          value={proj.customType}
                          onChange={(e) => updateProject(i, "customType", e.target.value)}
                          placeholder="Ex: Mentoria, Pesquisa científica, Iniciação cientifica..."
                          required={touched}
                        />
                      </div>
                    )}
                    <Input label="Início" type="month" value={proj.startDate} onChange={(e) => updateProject(i, "startDate", e.target.value)} placeholder="Ex: Março 2024" required={touched} />
                    <Input label="Fim" type="month" value={proj.endDate} onChange={(e) => updateProject(i, "endDate", e.target.value)} placeholder="Ex: Junho 2024" required={touched} />
                  </div>
                  <textarea
                    value={proj.description}
                    onChange={(e) => updateProject(i, "description", e.target.value)}
                    required={touched}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                    placeholder="Descreva o projeto, tecnologias usadas e seu papel"
                  />
                  <Input label="Link (opcional)" value={proj.link} onChange={(e) => updateProject(i, "link", e.target.value)} placeholder="https://github.com/... ou URL do projeto" />
                </div>
                );
              })}
            </div>
            )}

            {/* Step 6: Skills & Languages */}
            {step === TOTAL_STEPS && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6">
                <label className="block text-sm font-medium text-gray-300 mb-1">Habilidades (separadas por virgula)</label>
                <textarea value={skills} onChange={(e) => setSkills(e.target.value)} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 min-h-[120px]" placeholder="React, TypeScript, Node.js..." />
              </div>
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6">
                <label className="block text-sm font-medium text-gray-300 mb-1">Idiomas (separados por vírgula)</label>
                <textarea value={languages} onChange={(e) => setLanguages(e.target.value)} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 min-h-[120px]" placeholder="Português (nativo), Inglês (avançado)..." />
              </div>
            </div>
            )}
            </div>

            {/* Step navigation */}
            <div className="flex items-center justify-between gap-3 pt-6 mt-6 border-t border-white/[0.06]">
              <button
                type="button"
                onClick={() => {
                  setStepDirection("backward");
                  setStep((s) => Math.max(1, s - 1));
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                disabled={step === 1 || loading}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-300"
              >
                <ChevronLeft className="w-4 h-4" /> Voltar
              </button>
              <div className="flex items-center gap-3">
                {step === TOTAL_STEPS && <span className="text-sm text-gray-500 hidden sm:inline">Custo: 1 crédito</span>}
                <Button type="submit" loading={loading} disabled={loading || (step === TOTAL_STEPS && !name)} className="glow-blue">
                  {step < TOTAL_STEPS ? (
                    <span className="inline-flex items-center">Avançar <ChevronRight className="w-4 h-4 ml-1" /></span>
                  ) : (
                    <span>Criar currículo</span>
                  )}
                </Button>
              </div>
            </div>

          </fieldset>
        </form>
      )}

      <AIProgressModal
        isOpen={loading}
        title="Criando seu currículo"
        message={progressMsg}
        progress={progress}
        steps={PROGRESS_MESSAGES}
        icon={Sparkles}
        accent="emerald"
      />

      {/* Confirm generate modal */}
      <Modal isOpen={showGenerateConfirm} onClose={() => setShowGenerateConfirm(false)} title="Criar currículo" size="sm">
        <div className="space-y-4">
          <p className="text-gray-300 text-sm">A criação do currículo custa <span className="text-primary-400 font-semibold">1 crédito</span>. Deseja continuar?</p>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setShowGenerateConfirm(false)}>Cancelar</Button>
            <Button onClick={confirmGenerate}>Confirmar</Button>
          </div>
        </div>
      </Modal>
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

