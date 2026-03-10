"use client";

import { useState } from "react";
import { useAuthContext } from "@/components/providers/AuthProvider";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import FileUpload from "@/components/ui/FileUpload";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { extractTextFromFile } from "@/utils/file-parser";
import { deductCredits, checkCredits } from "@/services/credits";
import { FilePlus, Upload, PenLine, Plus, Trash2, Copy } from "lucide-react";
import toast from "react-hot-toast";

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

export default function CreateResumePage() {
  const { user } = useAuthContext();
  const [mode, setMode] = useState<Mode>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ resumeData: Record<string, unknown>; formattedText: string } | null>(null);

  // Form state for "from scratch"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [objective, setObjective] = useState("");
  const [skills, setSkills] = useState("");
  const [languages, setLanguages] = useState("");
  const [experiences, setExperiences] = useState<FormExperience[]>([{ company: "", position: "", startDate: "", endDate: "", description: "" }]);
  const [educations, setEducations] = useState<FormEducation[]>([{ institution: "", degree: "", field: "", startDate: "", endDate: "" }]);

  const handleUploadCreate = async () => {
    if (!file || !user) return;

    const hasCredits = await checkCredits(user.uid, "resume-creation");
    if (!hasCredits) { toast.error("Creditos insuficientes."); return; }

    setLoading(true);
    try {
      const text = await extractTextFromFile(file);
      const response = await fetch("/api/create-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData: { existingResume: text, mode: "improve" }, userId: user.uid }),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      await deductCredits(user.uid, "resume-creation", "Criacao de curriculo a partir de existente");
      setResult(data.data);
      toast.success("Curriculo criado!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar curriculo.");
    } finally { setLoading(false); }
  };

  const handleScratchCreate = async () => {
    if (!user) return;

    const hasCredits = await checkCredits(user.uid, "resume-creation");
    if (!hasCredits) { toast.error("Creditos insuficientes."); return; }

    setLoading(true);
    try {
      const formData = {
        mode: "scratch",
        personalInfo: { name, email, phone, location },
        objective,
        experience: experiences,
        education: educations,
        skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
        languages: languages.split(",").map((s) => s.trim()).filter(Boolean),
      };

      const response = await fetch("/api/create-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData, userId: user.uid }),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      await deductCredits(user.uid, "resume-creation", "Criacao de curriculo do zero");
      setResult(data.data);
      toast.success("Curriculo criado!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar curriculo.");
    } finally { setLoading(false); }
  };

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

  if (result) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold font-heading text-white">Curriculo Criado</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => { setResult(null); setMode(null); }} size="sm">Novo curriculo</Button>
            <button
              onClick={() => { navigator.clipboard.writeText(result.formattedText); toast.success("Copiado!"); }}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-white/5 text-gray-400 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
            >
              <Copy className="w-4 h-4" /> Copiar
            </button>
          </div>
        </div>
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6">
          <pre className="whitespace-pre-wrap text-sm text-gray-300 font-sans leading-relaxed">
            {result.formattedText}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading text-white flex items-center gap-3">
          <FilePlus className="w-7 h-7 text-primary-400" />
          Criar Curriculo
        </h1>
        <p className="text-gray-400 mt-1">Crie um curriculo profissional com ajuda da IA.</p>
        <span className="inline-block mt-2 bg-primary-500/10 text-primary-400 text-xs rounded-lg px-2.5 py-1">1 credito por criacao</span>
      </div>

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
              <h3 className="text-lg font-semibold font-heading text-white">A partir de curriculo existente</h3>
              <p className="text-sm text-gray-500 mt-2">Envie seu curriculo e a IA vai reorganizar e melhorar.</p>
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
              <h2 className="font-semibold font-heading text-white">Envie seu curriculo</h2>
              <button onClick={() => setMode(null)} className="text-sm text-gray-400 hover:text-white transition-colors">Voltar</button>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <FileUpload onFileSelect={setFile} selectedFile={file} onClear={() => setFile(null)} />
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Custo: 1 credito</span>
              <Button onClick={handleUploadCreate} disabled={!file || loading} loading={loading}>
                Criar curriculo
              </Button>
            </div>
            {loading && <div className="py-8"><LoadingSpinner size="lg" text="Criando curriculo com IA..." /></div>}
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
                <Input label="Localizacao" value={location} onChange={(e) => setLocation(e.target.value)} />
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
                <h3 className="font-medium text-white">Experiencias</h3>
                <button onClick={addExperience} className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-white/5 text-gray-400 hover:bg-white/10 rounded-xl transition-colors">
                  <Plus className="w-4 h-4" /> Adicionar
                </button>
              </div>
              {experiences.map((exp, i) => (
                <div key={i} className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl mb-3 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-400">Experiencia {i + 1}</span>
                    {experiences.length > 1 && (
                      <button onClick={() => removeExperience(i)} className="text-red-400 hover:text-red-300 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input label="Empresa" value={exp.company} onChange={(e) => updateExperience(i, "company", e.target.value)} />
                    <Input label="Cargo" value={exp.position} onChange={(e) => updateExperience(i, "position", e.target.value)} />
                    <Input label="Inicio" type="month" value={exp.startDate} onChange={(e) => updateExperience(i, "startDate", e.target.value)} />
                    <Input label="Fim" type="month" value={exp.endDate} onChange={(e) => updateExperience(i, "endDate", e.target.value)} />
                  </div>
                  <textarea value={exp.description} onChange={(e) => updateExperience(i, "description", e.target.value)} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50" placeholder="Descreva suas atividades e conquistas" />
                </div>
              ))}
            </div>

            {/* Education */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-white">Formacao</h3>
                <button onClick={addEducation} className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-white/5 text-gray-400 hover:bg-white/10 rounded-xl transition-colors">
                  <Plus className="w-4 h-4" /> Adicionar
                </button>
              </div>
              {educations.map((edu, i) => (
                <div key={i} className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl mb-3 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-400">Formacao {i + 1}</span>
                    {educations.length > 1 && (
                      <button onClick={() => removeEducation(i)} className="text-red-400 hover:text-red-300 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input label="Instituicao" value={edu.institution} onChange={(e) => updateEducation(i, "institution", e.target.value)} />
                    <Input label="Grau" value={edu.degree} onChange={(e) => updateEducation(i, "degree", e.target.value)} />
                    <Input label="Area" value={edu.field} onChange={(e) => updateEducation(i, "field", e.target.value)} />
                    <Input label="Inicio" type="month" value={edu.startDate} onChange={(e) => updateEducation(i, "startDate", e.target.value)} />
                  </div>
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
                <label className="block text-sm font-medium text-gray-300 mb-1">Idiomas (separados por virgula)</label>
                <textarea value={languages} onChange={(e) => setLanguages(e.target.value)} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 min-h-[80px]" placeholder="Portugues (nativo), Ingles (avancado)..." />
              </div>
            </div>

            <div className="flex justify-between items-center pt-4">
              <span className="text-sm text-gray-500">Custo: 1 credito</span>
              <Button onClick={handleScratchCreate} loading={loading} disabled={!name || loading}>
                Criar curriculo
              </Button>
            </div>
            {loading && <div className="py-8"><LoadingSpinner size="lg" text="Criando curriculo com IA..." /></div>}
          </div>
        </div>
      )}
    </div>
  );
}
