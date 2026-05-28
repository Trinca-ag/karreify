"use client";

import { useEffect, useMemo, useState } from "react";
import { adminFetch, type AdminJobsPassRow } from "@/services/admin";
import {
  Briefcase,
  Search,
  Calendar,
  CalendarDays,
  Coins,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Copy,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";

type PassFilter = "all" | "weekly" | "monthly";

const PASS_FILTERS: { value: PassFilter; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "weekly", label: "Semanal" },
  { value: "monthly", label: "Mensal" },
];

function PassBadge({ passId }: { passId: string | null }) {
  if (passId === "weekly") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-bold bg-sky-500/10 text-sky-300 border border-sky-500/20">
        <Calendar className="w-3 h-3" />
        SEMANAL
      </span>
    );
  }
  if (passId === "monthly") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-bold bg-violet-500/10 text-violet-300 border border-violet-500/20">
        <CalendarDays className="w-3 h-3" />
        MENSAL
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-bold bg-gray-500/10 text-gray-300 border border-gray-500/20">
      DESCONHECIDO
    </span>
  );
}

function fmtDateTime(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function AdminJobsPassesPage() {
  const [passes, setPasses] = useState<AdminJobsPassRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [passFilter, setPassFilter] = useState<PassFilter>("all");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [deleteTarget, setDeleteTarget] = useState<AdminJobsPassRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setRefreshing(true);
    try {
      const res = await adminFetch("/api/admin/jobs-passes");
      const data = await res.json();
      if (data.success) setPasses(data.passes as AdminJobsPassRow[]);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await adminFetch(
        `/api/admin/jobs-passes/${deleteTarget.id}?uid=${encodeURIComponent(deleteTarget.userId)}`,
        { method: "DELETE" }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data?.error || "Erro ao excluir registro.");
        return;
      }
      toast.success("Registro removido do painel.");
      setPasses((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  const stats = useMemo(() => {
    const weekly = passes.filter((p) => p.passId === "weekly").length;
    const monthly = passes.filter((p) => p.passId === "monthly").length;
    const totalCoins = passes.reduce((acc, p) => acc + (p.amount ?? 0), 0);
    const uniqueUsers = new Set(passes.map((p) => p.userId)).size;
    return { total: passes.length, weekly, monthly, totalCoins, uniqueUsers };
  }, [passes]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return passes.filter((p) => {
      if (passFilter !== "all" && p.passId !== passFilter) return false;
      if (!q) return true;
      const fields = [
        p.id,
        p.userId,
        p.user?.displayName ?? "",
        p.user?.email ?? "",
        p.passId ?? "",
        p.description,
      ];
      return fields.some((f) => f.toLowerCase().includes(q));
    });
  }, [passes, search, passFilter]);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard?.writeText(text).catch(() => {});
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white flex items-center gap-3">
            <Briefcase className="w-7 h-7 text-primary-400" />
            Passes /jobs
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
            {stats.total} compras · pagas em moedas (não R$)
          </p>
        </div>
        <button
          onClick={load}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-3 py-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-lg text-sm text-gray-300 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          Atualizar
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatBox label="Total" value={stats.total} tone="primary" />
        <StatBox label="Semanais" value={stats.weekly} tone="sky" />
        <StatBox label="Mensais" value={stats.monthly} tone="violet" />
        <StatBox label="Compradores" value={stats.uniqueUsers} tone="emerald" />
        <StatBox label="Moedas gastas" value={stats.totalCoins} tone="amber" />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, email, transactionId..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40 text-sm"
          />
        </div>
        <div className="flex gap-1 bg-white/[0.04] border border-white/[0.08] rounded-xl p-1 flex-wrap">
          {PASS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setPassFilter(f.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                passFilter === f.value
                  ? "bg-primary-500/20 text-primary-300"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-32">
          <div className="w-10 h-10 rounded-full border-2 border-primary-500/30 border-t-primary-400 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl py-16 text-center">
          <Briefcase className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">
            {passes.length === 0
              ? "Nenhum passe vendido ainda."
              : "Nenhum registro corresponde à busca."}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((p) => {
            const isOpen = expanded.has(p.id);
            return (
              <div
                key={p.id}
                className="bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => toggleExpand(p.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors text-left"
                >
                  {isOpen ? (
                    <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  )}

                  <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-2 sm:gap-4 items-center">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {p.user?.displayName ?? p.user?.email ?? p.userId}
                      </p>
                      <p className="text-[11px] text-gray-500 truncate">
                        {p.user?.email ?? "—"} · {fmtDateTime(p.createdAt)}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                      <span className="inline-flex items-center gap-1 text-amber-300 tabular-nums font-semibold">
                        <Coins className="w-3.5 h-3.5" />
                        {p.amount}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <PassBadge passId={p.passId} />
                    </div>
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-white/[0.06] bg-dark-900/30 p-4 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                      <MetaField label="Transaction ID">
                        <span className="font-mono text-gray-300 truncate">{p.id}</span>
                        <button
                          onClick={() => copyToClipboard(p.id)}
                          className="text-gray-500 hover:text-white"
                          title="Copiar"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </MetaField>
                      <MetaField label="User ID">
                        <span className="font-mono text-gray-300 truncate">{p.userId}</span>
                        <button
                          onClick={() => copyToClipboard(p.userId)}
                          className="text-gray-500 hover:text-white"
                          title="Copiar"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </MetaField>
                      <MetaField label="Passe">
                        <span className="text-gray-300">{p.passId ?? "—"}</span>
                      </MetaField>
                      <MetaField label="Moedas debitadas">
                        <span className="text-amber-300 font-semibold tabular-nums">
                          {p.amount}
                        </span>
                      </MetaField>
                      <MetaField label="Comprado em">
                        <span className="text-gray-300">{fmtDateTime(p.createdAt)}</span>
                      </MetaField>
                    </div>

                    {p.description && (
                      <div className="px-3 py-2 bg-white/[0.02] border border-white/[0.05] rounded-lg text-xs text-gray-400">
                        {p.description}
                      </div>
                    )}

                    {/* Danger zone */}
                    <div className="pt-3 border-t border-white/[0.06] flex justify-end">
                      <button
                        onClick={() => setDeleteTarget(p)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Excluir registro
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={!!deleteTarget}
        onClose={() => !deleting && setDeleteTarget(null)}
        title="Excluir registro de passe"
        size="sm"
      >
        {deleteTarget && (
          <div className="space-y-5">
            <div className="flex items-start gap-3 p-4 bg-red-500/5 border border-red-500/15 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-300 leading-relaxed">
                Esta ação é <span className="text-red-400 font-medium">irreversível</span>. O registro será removido do histórico,
                mas <span className="text-white font-medium">não estorna moedas</span> nem cancela o passe ativo. Para essas ações, use o painel de Usuários.
              </div>
            </div>
            <div className="text-xs text-gray-400 space-y-1">
              <div>
                <span className="text-gray-500">Cliente:</span>{" "}
                <span className="text-white">
                  {deleteTarget.user?.displayName ?? deleteTarget.user?.email ?? deleteTarget.userId}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Passe:</span>{" "}
                <span className="text-white">{deleteTarget.passId ?? "—"}</span>
              </div>
              <div>
                <span className="text-gray-500">Moedas:</span>{" "}
                <span className="text-white">{deleteTarget.amount}</span>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setDeleteTarget(null)} disabled={deleting}>
                Cancelar
              </Button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-colors text-sm font-medium disabled:opacity-50"
              >
                {deleting ? "Excluindo..." : "Excluir registro"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function StatBox({
  label,
  value,
  tone,
}: {
  label: string;
  value: string | number;
  tone: "primary" | "sky" | "violet" | "emerald" | "amber";
}) {
  const toneClass = {
    primary: "border-primary-500/15 text-primary-300",
    sky: "border-sky-500/15 text-sky-300",
    violet: "border-violet-500/15 text-violet-300",
    emerald: "border-emerald-500/15 text-emerald-300",
    amber: "border-amber-500/15 text-amber-300",
  }[tone];
  return (
    <div className={`bg-white/[0.03] border ${toneClass} rounded-xl p-3`}>
      <p className="text-[11px] text-gray-500 uppercase tracking-wider">{label}</p>
      <p className="text-xl font-bold font-heading text-white mt-0.5 truncate">{value}</p>
    </div>
  );
}

function MetaField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 min-w-0">
      <span className="text-gray-500 text-[10px] uppercase tracking-wider flex-shrink-0">
        {label}
      </span>
      <div className="flex items-center gap-1.5 min-w-0">{children}</div>
    </div>
  );
}
