"use client";

import { useState } from "react";
import { useAuthContext } from "@/components/providers/AuthProvider";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { deductCredits, checkCredits } from "@/services/credits";
import { Map, CheckCircle, BookOpen, Award, Code, Users, ChevronDown, ChevronUp, Trophy, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

interface RoadmapResult {
  roadmap: {
    level: number;
    title: string;
    description: string;
    duration: string;
    tasks: { id: string; title: string; description: string; completed: boolean; points: number }[];
    courses: string[];
    certifications: string[];
    skills: string[];
    projects: string[];
    networking: string[];
  }[];
  totalPoints: number;
  gamification: {
    badges: { name: string; description: string; pointsRequired: number }[];
    levels: { name: string; pointsRequired: number }[];
  };
  summary: string;
}

export default function CareerRoadmapPage() {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RoadmapResult | null>(null);
  const [expandedPhase, setExpandedPhase] = useState<number | null>(0);

  const [currentRole, setCurrentRole] = useState("");
  const [currentArea, setCurrentArea] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [timeline, setTimeline] = useState("");

  const handleGenerate = async () => {
    if (!user || !currentRole || !targetRole) return;

    const hasCredits = await checkCredits(user.uid, "career-roadmap");
    if (!hasCredits) { toast.error("Creditos insuficientes. Roadmap custa 20 creditos."); return; }

    setLoading(true);
    try {
      const response = await fetch("/api/career-roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentRole, currentArea, experienceLevel, targetRole, timeline, userId: user.uid }),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error);

      await deductCredits(user.uid, "career-roadmap", "Geracao de roadmap de carreira");
      setResult(data.data);
      toast.success("Roadmap gerado!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao gerar roadmap.");
    } finally { setLoading(false); }
  };

  return (
    <div className="relative space-y-6 pb-8">
      {/* Hero Header */}
      <section className="relative overflow-hidden rounded-3xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-xl">
        <div className="absolute -top-24 -left-16 w-80 h-80 bg-primary-500/20 rounded-full blur-[120px] animate-pulse-glow pointer-events-none" />
        <div
          className="absolute -bottom-32 -right-10 w-96 h-96 bg-accent-violet/20 rounded-full blur-[140px] animate-pulse-glow pointer-events-none"
          style={{ animationDelay: "1.5s" }}
        />
        <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
        <div className="relative p-8 md:p-12 animate-fade-in-up">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-xs font-medium text-primary-300 mb-4">
                <Map className="w-3 h-3" />
                Carreira
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white font-heading leading-[1.1] tracking-tight">
                Planeje sua <span className="gradient-text">jornada</span> profissional
              </h1>
              <p className="text-gray-400 mt-4 text-base md:text-lg max-w-xl leading-relaxed">
                Informe seu cargo atual e o cargo desejado. A IA gera um roadmap completo com fases, tarefas, cursos e badges de gamificação.
              </p>
            </div>
            {result && (
              <Button variant="outline" onClick={() => setResult(null)} size="sm" className="flex-shrink-0 mt-2">
                <RefreshCw className="w-4 h-4 mr-2" /> Novo roadmap
              </Button>
            )}
          </div>
        </div>
      </section>

      {!result ? (
        <div className="relative group bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] hover:border-primary-500/30 transition-all duration-300 animate-fade-in-up animation-delay-200">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-500/10 group-hover:bg-primary-500/20 rounded-full blur-3xl transition-all duration-500 pointer-events-none" />
          <fieldset disabled={loading} className="relative p-6 md:p-8 space-y-4 border-0 m-0 min-w-0 disabled:opacity-60 disabled:cursor-not-allowed">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Cargo atual" value={currentRole} onChange={(e) => setCurrentRole(e.target.value)} placeholder="Ex: Desenvolvedor Junior" required />
              <Input label="Area" value={currentArea} onChange={(e) => setCurrentArea(e.target.value)} placeholder="Ex: Tecnologia" />
              <Input label="Nivel de experiencia" value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)} placeholder="Ex: 2 anos" />
              <Input label="Cargo desejado" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} placeholder="Ex: Tech Lead" required />
              <Input label="Prazo" value={timeline} onChange={(e) => setTimeline(e.target.value)} placeholder="Ex: 3 anos" />
            </div>
            <div className="flex justify-between items-center pt-4">
              <span className="text-sm text-amber-400 font-medium">Custo: 20 creditos</span>
              <Button onClick={handleGenerate} disabled={!currentRole || !targetRole || loading} loading={loading} className="glow-blue">
                Gerar roadmap
              </Button>
            </div>
            {loading && <div className="py-8"><LoadingSpinner size="lg" text="Gerando seu roadmap de carreira..." /></div>}
          </fieldset>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary */}
          <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600/20 to-accent-violet/20 border border-primary-500/20 backdrop-blur-xl animate-fade-in-up animation-delay-200">
            <div className="absolute inset-0 bg-grid-pattern opacity-15 pointer-events-none" />
            <div className="absolute -top-20 -right-10 w-72 h-72 bg-primary-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="relative p-6 md:p-8">
              <h2 className="text-lg font-bold text-white font-heading mb-2">Resumo do Roadmap</h2>
              <p className="text-gray-300 text-sm">{result.summary}</p>
              <div className="mt-4 flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  <span className="text-primary-400 font-heading font-bold">{result.totalPoints} pontos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Map className="w-5 h-5 text-primary-400" />
                  <span className="text-gray-300">{result.roadmap.length} fases</span>
                </div>
              </div>
              {/* Progress bar */}
              <div className="mt-4 h-2 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-violet" style={{ width: "0%" }} />
              </div>
            </div>
          </section>

          {/* Gamification badges */}
          {result.gamification?.badges?.length > 0 && (
            <div className="relative group bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] hover:border-primary-500/30 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden animate-fade-in-up animation-delay-300">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 group-hover:bg-amber-500/20 rounded-full blur-3xl transition-all duration-500 pointer-events-none" />
              <div className="relative p-6">
                <h3 className="font-semibold text-white font-heading flex items-center gap-2 mb-4">
                  <span className="p-1.5 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl">
                    <Award className="w-4 h-4 text-white" />
                  </span>
                  Badges
                </h3>
                <div className="flex flex-wrap gap-3">
                  {result.gamification.badges.map((badge, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-500/20 to-accent-violet/20 border border-primary-500/20 rounded-xl shadow-lg shadow-primary-500/5 hover:shadow-primary-500/10 transition-all duration-300"
                    >
                      <Award className="w-4 h-4 text-amber-400" />
                      <div>
                        <span className="text-sm font-medium text-white">{badge.name}</span>
                        <p className="text-xs text-primary-400 font-heading font-bold">{badge.pointsRequired} pts</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Phases */}
          <div className="space-y-3 animate-fade-in-up animation-delay-400">
            {result.roadmap.map((phase, i) => (
              <div key={i} className="relative bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] hover:border-primary-500/30 transition-all duration-300 overflow-hidden">
                <button
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors duration-200"
                  onClick={() => setExpandedPhase(expandedPhase === i ? null : i)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-violet rounded-xl flex items-center justify-center shadow-lg shadow-black/20 flex-shrink-0">
                      <span className="text-white font-heading font-bold text-sm">{phase.level}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white font-heading">{phase.title}</h3>
                      <p className="text-sm text-gray-500">{phase.duration}</p>
                    </div>
                  </div>
                  {expandedPhase === i ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                </button>

                {expandedPhase === i && (
                  <div className="px-6 py-4 border-t border-white/[0.06] space-y-4 bg-white/[0.02]">
                    <p className="text-sm text-gray-300">{phase.description}</p>

                    {/* Tasks */}
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary-400" /> Tarefas
                      </h4>
                      <div className="space-y-2">
                        {phase.tasks.map((task) => (
                          <div key={task.id} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/[0.06] hover:bg-white/[0.06] transition-colors duration-200">
                            <div className="w-5 h-5 border-2 border-gray-600 rounded flex-shrink-0 mt-0.5 bg-white/5" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-300">{task.title}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{task.description}</p>
                            </div>
                            <span className="text-xs font-bold text-primary-400 font-heading">{task.points} pts</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {phase.courses?.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-emerald-400" /> Cursos
                          </h4>
                          <ul className="space-y-1.5">
                            {phase.courses.map((c, j) => (
                              <li key={j} className="text-sm text-gray-300 flex items-center gap-2 px-3 py-1.5 bg-white/[0.02] border border-white/[0.06] rounded-lg">
                                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full flex-shrink-0" /> {c}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {phase.skills?.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                            <Code className="w-4 h-4 text-primary-400" /> Habilidades
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {phase.skills.map((s, j) => (
                              <span key={j} className="px-2.5 py-1 bg-primary-500/10 text-primary-300 rounded-lg text-xs font-medium">{s}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {phase.certifications?.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                            <Award className="w-4 h-4 text-violet-400" /> Certificacoes
                          </h4>
                          <ul className="space-y-1.5">
                            {phase.certifications.map((c, j) => (
                              <li key={j} className="text-sm text-gray-300 flex items-center gap-2 px-3 py-1.5 bg-white/[0.02] border border-white/[0.06] rounded-lg">
                                <span className="w-1.5 h-1.5 bg-violet-400 rounded-full flex-shrink-0" /> {c}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {phase.networking?.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                            <Users className="w-4 h-4 text-amber-400" /> Networking
                          </h4>
                          <ul className="space-y-1.5">
                            {phase.networking.map((n, j) => (
                              <li key={j} className="text-sm text-gray-300 flex items-center gap-2 px-3 py-1.5 bg-white/[0.02] border border-white/[0.06] rounded-lg">
                                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full flex-shrink-0" /> {n}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
