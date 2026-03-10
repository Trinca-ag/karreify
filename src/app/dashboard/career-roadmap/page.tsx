"use client";

import { useState } from "react";
import { useAuthContext } from "@/components/providers/AuthProvider";
import Card, { CardBody, CardHeader } from "@/components/ui/Card";
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-heading flex items-center gap-3">
            <Map className="w-7 h-7 text-primary-400" />
            Roadmap de Carreira
          </h1>
          <p className="text-gray-400 mt-1">Planeje sua trajetoria profissional com IA.</p>
        </div>
        {result && (
          <Button variant="outline" onClick={() => setResult(null)} size="sm">
            <RefreshCw className="w-4 h-4 mr-2" /> Novo roadmap
          </Button>
        )}
      </div>

      {!result ? (
        <Card>
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Cargo atual" value={currentRole} onChange={(e) => setCurrentRole(e.target.value)} placeholder="Ex: Desenvolvedor Junior" required />
              <Input label="Area" value={currentArea} onChange={(e) => setCurrentArea(e.target.value)} placeholder="Ex: Tecnologia" />
              <Input label="Nivel de experiencia" value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)} placeholder="Ex: 2 anos" />
              <Input label="Cargo desejado" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} placeholder="Ex: Tech Lead" required />
              <Input label="Prazo" value={timeline} onChange={(e) => setTimeline(e.target.value)} placeholder="Ex: 3 anos" />
            </div>
            <div className="flex justify-between items-center pt-4">
              <span className="text-sm text-amber-400 font-medium">Custo: 20 creditos</span>
              <Button onClick={handleGenerate} disabled={!currentRole || !targetRole || loading} loading={loading}>
                Gerar roadmap
              </Button>
            </div>
            {loading && <div className="py-8"><LoadingSpinner size="lg" text="Gerando seu roadmap de carreira..." /></div>}
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Summary */}
          <div className="bg-gradient-to-r from-primary-600/20 to-accent-violet/20 border border-primary-500/20 rounded-xl p-6 backdrop-blur-xl shadow-lg shadow-primary-600/10">
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

          {/* Gamification badges */}
          {result.gamification?.badges?.length > 0 && (
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-white font-heading flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" /> Badges
                </h3>
              </CardHeader>
              <CardBody>
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
              </CardBody>
            </Card>
          )}

          {/* Phases */}
          {result.roadmap.map((phase, i) => (
            <div key={i} className="glass-card overflow-hidden">
              <button
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors duration-200"
                onClick={() => setExpandedPhase(expandedPhase === i ? null : i)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500/20 to-accent-violet/20 border border-primary-500/30 rounded-full flex items-center justify-center shadow-lg shadow-primary-500/10">
                    <span className="text-primary-400 font-heading font-bold">{phase.level}</span>
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
      )}
    </div>
  );
}
