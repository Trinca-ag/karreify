"use client";

import { useState } from "react";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { checkCredits } from "@/services/credits";
import { authedFetch } from "@/lib/api-client";
import { FileEdit, Plus, Trash2, Sparkles, Download } from "lucide-react";
import toast from "react-hot-toast";

interface EditorSection {
  id: string;
  type: "personal" | "objective" | "experience" | "education" | "skills" | "languages" | "custom";
  title: string;
  content: string;
}

export default function ResumeEditorPage() {
  const { user } = useAuthContext();
  const [sections, setSections] = useState<EditorSection[]>([
    { id: "1", type: "personal", title: "Dados Pessoais", content: "" },
    { id: "2", type: "objective", title: "Objetivo", content: "" },
    { id: "3", type: "experience", title: "Experiência Profissional", content: "" },
    { id: "4", type: "education", title: "Formação Acadêmica", content: "" },
    { id: "5", type: "skills", title: "Habilidades", content: "" },
    { id: "6", type: "languages", title: "Idiomas", content: "" },
  ]);
  const [improvingSection, setImprovingSection] = useState<string | null>(null);

  const updateSection = (id: string, content: string) => {
    setSections(sections.map((s) => (s.id === id ? { ...s, content } : s)));
  };

  const addSection = () => {
    setSections([
      ...sections,
      { id: Date.now().toString(), type: "custom", title: "Nova Seção", content: "" },
    ]);
  };

  const removeSection = (id: string) => {
    setSections(sections.filter((s) => s.id !== id));
  };

  const improveSection = async (section: EditorSection) => {
    if (!user || !section.content.trim()) {
      toast.error("Preencha a seção antes de melhorar.");
      return;
    }

    const hasCredits = await checkCredits(user.uid, "resume-editor");
    if (!hasCredits) { toast.error("Creditos insuficientes."); return; }

    setImprovingSection(section.id);
    try {
      const response = await authedFetch("/api/create-resume", {
        method: "POST",
        body: JSON.stringify({
          formData: { mode: "improve-section", section: section.title, content: section.content },
          feature: "resume-editor",
        }),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error);

      const improved = data.data?.formattedText || data.data?.resumeData?.objective || section.content;
      updateSection(section.id, improved);
      toast.success("Seção melhorada com IA!");
    } catch (error) {
      console.error("[resume-editor] improveSection failed:", error);
      toast.error("Erro ao melhorar seção.");
    } finally { setImprovingSection(null); }
  };

  const exportAsText = () => {
    const text = sections.map((s) => `== ${s.title} ==\n${s.content}`).join("\n\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "curriculo.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Currículo exportado!");
  };

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
            <FileEdit className="w-3 h-3" />
            Editor
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white font-heading leading-[1.1] tracking-tight">
            Edite seu currículo com{" "}
            <span className="gradient-text">IA</span>
          </h1>
          <p className="text-gray-400 mt-4 text-base md:text-lg max-w-xl leading-relaxed">
            Edite e melhore cada seção do seu currículo com o poder da inteligência artificial.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <button
              onClick={addSection}
              disabled={!!improvingSection}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm bg-white/[0.05] text-gray-300 border border-white/[0.10] rounded-xl hover:bg-white/[0.10] hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white/[0.05] disabled:hover:text-gray-300"
            >
              <Plus className="w-4 h-4" /> Nova Seção
            </button>
            <button
              onClick={exportAsText}
              disabled={!!improvingSection}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl hover:from-primary-500 hover:to-primary-400 transition-all glow-blue disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" /> Exportar
            </button>
          </div>
        </div>
      </section>

      {/* Sections */}
      <fieldset disabled={!!improvingSection} className="space-y-4 animate-fade-in-up animation-delay-200 border-0 m-0 min-w-0 p-0 disabled:opacity-60 disabled:cursor-not-allowed">
        {sections.map((section, index) => (
          <div
            key={section.id}
            className="relative group bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] overflow-hidden hover:border-primary-500/30 transition-all duration-300"
            style={{ animationDelay: `${200 + index * 50}ms` }}
          >
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-500/10 group-hover:bg-primary-500/20 rounded-full blur-3xl transition-all duration-500 pointer-events-none" />
            <div className="relative px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
              <input
                value={section.title}
                onChange={(e) =>
                  setSections(sections.map((s) => (s.id === section.id ? { ...s, title: e.target.value } : s)))
                }
                className="font-semibold font-heading text-white bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500/50 rounded px-1"
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={() => improveSection(section)}
                  disabled={!!improvingSection}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-gradient-to-br from-primary-500 to-accent-violet text-white rounded-xl hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shadow-black/20"
                >
                  {improvingSection === section.id ? (
                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  Melhorar com IA
                </button>
                {section.type === "custom" && (
                  <button
                    onClick={() => removeSection(section.id)}
                    className="p-1.5 rounded-lg hover:bg-white/5 text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            <div className="relative p-6">
              <textarea
                value={section.content}
                onChange={(e) => updateSection(section.id, e.target.value)}
                className="w-full min-h-[120px] px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/30 resize-y transition-all"
                placeholder={`Preencha ${section.title.toLowerCase()}...`}
              />
            </div>
          </div>
        ))}
      </fieldset>

      <p className="text-center text-sm text-gray-500 animate-fade-in-up animation-delay-400">
        1 crédito por melhoria com IA
      </p>
    </div>
  );
}
