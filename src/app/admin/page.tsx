"use client";

import { useEffect, useMemo, useState } from "react";
import { useAdminAuth } from "@/components/providers/AdminAuthProvider";
import { adminFetch, type AdminStats } from "@/services/admin";
import { Users, Shield, Coins, Zap, TrendingUp, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

const FEATURE_LABELS: Record<string, string> = {
  "resume-analysis": "Análise de Currículo",
  "resume-creation": "Criação de Currículo",
  "resume-adaptation": "Adaptação para Vaga",
  "cover-letter": "Carta de Apresentação",
  "company-analysis": "Análise de Empresa",
  "jobs-pass": "Passe de Vagas",
};

const STAT_CONFIG = [
  { key: "totalUsers",       label: "Usuários",       icon: Users,  gradient: "from-blue-500/20 to-blue-600/10",  iconColor: "text-blue-400",    border: "border-blue-500/10" },
  { key: "totalAdmins",      label: "Administradores",icon: Shield, gradient: "from-violet-500/20 to-violet-600/10", iconColor: "text-violet-400", border: "border-violet-500/10" },
  { key: "totalCreditsUsed", label: "Créditos Usados",icon: Coins,  gradient: "from-emerald-500/20 to-emerald-600/10",iconColor: "text-emerald-400",border: "border-emerald-500/10" },
  { key: "topFeature",       label: "Funcionalidade Mais Usada", icon: Zap, gradient: "from-orange-500/20 to-orange-600/10", iconColor: "text-orange-400", border: "border-orange-500/10" },
] as const;

export default function AdminDashboardPage() {
  const { adminData } = useAdminAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    adminFetch("/api/admin/stats")
      .then(r => r.json())
      .then(d => { if (!cancelled && d.success) setStats(d.data); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  // Sort + total + percentage all derive from featureUsage — compute once per
  // stats change instead of recalculating inside the render loop.
  const featureEntries = useMemo(() => {
    if (!stats) return { sorted: [] as [string, number][], total: 0, top: null as [string, number] | null };
    const sorted = Object.entries(stats.featureUsage).sort(([, a], [, b]) => b - a);
    const total = sorted.reduce((acc, [, count]) => acc + count, 0);
    return { sorted, total, top: sorted[0] ?? null };
  }, [stats]);

  const statValues: Record<string, number | string> = {
    totalUsers: stats?.totalUsers ?? 0,
    totalAdmins: stats?.totalAdmins ?? 0,
    totalCreditsUsed: stats?.totalCreditsUsed ?? 0,
    topFeature: featureEntries.top ? (FEATURE_LABELS[featureEntries.top[0]] ?? featureEntries.top[0]) : "—",
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-heading text-white">Painel Administrativo</h1>
        {adminData && (
          <p className="text-gray-400 mt-1">
            Bem-vindo, <span className="text-white font-medium">{adminData.name}</span>
          </p>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <div className="w-10 h-10 rounded-full border-2 border-primary-500/30 border-t-primary-400 animate-spin" />
        </div>
      ) : stats ? (
        <div className="space-y-8">
          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {STAT_CONFIG.map(({ key, label, icon: Icon, gradient, iconColor, border }) => (
              <div key={key} className={`bg-white/[0.03] border ${border} rounded-2xl p-5`}>
                <div className="flex items-start gap-4">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 mb-1">{label}</p>
                    <p className="text-2xl font-bold text-white font-heading leading-none truncate">
                      {statValues[key]}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Feature usage */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-white/[0.06]">
                <TrendingUp className="w-5 h-5 text-primary-400" />
                <h2 className="font-semibold font-heading text-white">Uso por Funcionalidade</h2>
              </div>
              <div className="p-6 space-y-4">
                {featureEntries.sorted.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">Nenhum uso registrado ainda.</p>
                ) : (
                  featureEntries.sorted.map(([key, count]) => {
                    const pct = featureEntries.total > 0 ? Math.round((count / featureEntries.total) * 100) : 0;
                    return (
                      <div key={key}>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="text-gray-300">{FEATURE_LABELS[key] ?? key}</span>
                          <span className="text-gray-500 tabular-nums">{count} <span className="text-gray-600">({pct}%)</span></span>
                        </div>
                        <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Recent users */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary-400" />
                  <h2 className="font-semibold font-heading text-white">Usuários Recentes</h2>
                </div>
                <Link
                  href="/admin/users"
                  className="flex items-center gap-1 text-xs text-primary-400 hover:text-primary-300 transition-colors"
                >
                  Ver todos <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="divide-y divide-white/[0.04]">
                {stats.recentUsers.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-8">Nenhum usuário ainda.</p>
                ) : (
                  stats.recentUsers.map(u => (
                    <div key={u.uid} className="flex items-center gap-3 px-6 py-3.5">
                      <div className="w-9 h-9 bg-white/5 border border-white/[0.08] rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xs text-gray-300 font-semibold">
                          {(u.displayName ?? u.email)[0]?.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{u.displayName ?? "—"}</p>
                        <p className="text-xs text-gray-500 truncate">{u.email}</p>
                      </div>
                      <span className="text-xs font-medium text-emerald-400 flex-shrink-0 tabular-nums">
                        {u.credits} moedas
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 text-center">
          <p className="text-gray-400">Erro ao carregar estatísticas.</p>
        </div>
      )}
    </div>
  );
}
