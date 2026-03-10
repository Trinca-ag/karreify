"use client";

import { useState } from "react";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { deductCredits, checkCredits } from "@/services/credits";
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
    { id: "3", type: "experience", title: "Experiencia Profissional", content: "" },
    { id: "4", type: "education", title: "Formacao Academica", content: "" },
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
      { id: Date.now().toString(), type: "custom", title: "Nova Secao", content: "" },
    ]);
  };

  const removeSection = (id: string) => {
    setSections(sections.filter((s) => s.id !== id));
  };

  const improveSection = async (section: EditorSection) => {
    if (!user || !section.content.trim()) {
      toast.error("Preencha a secao antes de melhorar.");
      return;
    }

    const hasCredits = await checkCredits(user.uid, "resume-editor");
    if (!hasCredits) { toast.error("Creditos insuficientes."); return; }

    setImprovingSection(section.id);
    try {
      const response = await fetch("/api/create-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formData: { mode: "improve-section", section: section.title, content: section.content },
          userId: user.uid,
        }),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error);

      await deductCredits(user.uid, "resume-editor", `Melhoria da secao: ${section.title}`);

      const improved = data.data?.formattedText || data.data?.resumeData?.objective || section.content;
      updateSection(section.id, improved);
      toast.success("Secao melhorada com IA!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao melhorar secao.");
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
    toast.success("Curriculo exportado!");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white flex items-center gap-3">
            <FileEdit className="w-7 h-7 text-primary-400" />
            Editor de Curriculo
          </h1>
          <p className="text-gray-400 mt-1">Edite e melhore cada secao do seu curriculo.</p>
          <span className="inline-block mt-2 bg-primary-500/10 text-primary-400 text-xs rounded-lg px-2.5 py-1">1 credito por melhoria com IA</span>
        </div>
        <div className="flex gap-2">
          <button onClick={addSection} className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-white/5 text-gray-400 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
            <Plus className="w-4 h-4" /> Secao
          </button>
          <button onClick={exportAsText} className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl hover:from-primary-500 hover:to-primary-400 transition-colors">
            <Download className="w-4 h-4" /> Exportar
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {sections.map((section) => (
          <div key={section.id} className="bg-white/[0.02] border border-white/[0.06] rounded-xl">
            <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
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
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-primary-500/10 text-primary-400 border border-primary-500/20 rounded-xl hover:bg-primary-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {improvingSection === section.id ? (
                    <span className="inline-block w-4 h-4 border-2 border-primary-400/30 border-t-primary-400 rounded-full animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  Melhorar com IA
                </button>
                {section.type === "custom" && (
                  <button onClick={() => removeSection(section.id)} className="p-1.5 rounded-lg hover:bg-white/5 text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            <div className="p-6">
              <textarea
                value={section.content}
                onChange={(e) => updateSection(section.id, e.target.value)}
                className="w-full min-h-[120px] px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 resize-y"
                placeholder={`Preencha ${section.title.toLowerCase()}...`}
              />
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-sm text-gray-500">1 credito por melhoria com IA</p>
    </div>
  );
}
