"use client";

import { useEffect, useMemo, useState } from "react";
import { adminFetch, type AdminTalentRow } from "@/services/admin";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import {
  Briefcase,
  Mail,
  Phone,
  Link as LinkIcon,
  Search,
  Trash2,
  AlertTriangle,
  ArrowUpAZ,
  Clock,
  Filter,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

type SortMode = "recent" | "alpha";

function initial(t: AdminTalentRow): string {
  const source = t.fullName || t.email;
  return source[0]?.toUpperCase() ?? "?";
}

function shortenUrl(url: string): string {
  try {
    const u = new URL(url);
    const path = u.pathname.length > 1 ? u.pathname : "";
    return `${u.hostname.replace(/^www\./, "")}${path}`.slice(0, 40);
  } catch {
    return url.slice(0, 40);
  }
}

export default function AdminTalentsPage() {
  const [talents, setTalents] = useState<AdminTalentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [professionFilter, setProfessionFilter] = useState<string>("");
  const [sortMode, setSortMode] = useState<SortMode>("recent");
  const [deleteTarget, setDeleteTarget] = useState<AdminTalentRow | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  async function fetchTalents() {
    setLoading(true);
    try {
      const res = await adminFetch("/api/admin/talents");
      const data = await res.json();
      if (data.success) setTalents(data.talents);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTalents();
  }, []);

  const professions = useMemo(() => {
    const set = new Set<string>();
    talents.forEach((t) => {
      if (t.profession) set.add(t.profession);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [talents]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const rows = talents.filter((t) => {
      if (professionFilter && t.profession !== professionFilter) return false;
      if (!q) return true;
      return (
        t.fullName.toLowerCase().includes(q) ||
        t.email.toLowerCase().includes(q)
      );
    });
    if (sortMode === "alpha") {
      return [...rows].sort((a, b) =>
        a.fullName.localeCompare(b.fullName, "pt-BR", { sensitivity: "base" })
      );
    }
    return rows;
  }, [talents, search, professionFilter, sortMode]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      const res = await adminFetch("/api/admin/talents", {
        method: "DELETE",
        body: JSON.stringify({ id: deleteTarget.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Erro ao excluir talento.");
        return;
      }
      toast.success("Talento removido.");
      setTalents(prev => prev.filter(t => t.id !== deleteTarget.id));
      setDeleteTarget(null);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-heading text-white flex items-center gap-3">
          <Briefcase className="w-7 h-7 text-primary-400" />
          Banco de Talentos
        </h1>
        <p className="text-gray-400 mt-1 text-sm">
          {talents.length} talento{talents.length !== 1 ? "s" : ""} cadastrado
          {talents.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome ou e-mail..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500/30 text-sm transition-all"
          />
        </div>

        <div className="relative lg:w-64">
          <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          <select
            value={professionFilter}
            onChange={(e) => setProfessionFilter(e.target.value)}
            className="w-full pl-10 pr-8 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500/30 appearance-none cursor-pointer"
          >
            <option value="" style={{ backgroundColor: "#0a0a1a", color: "#fff" }}>
              Todas as profissões
            </option>
            {professions.map((p) => (
              <option
                key={p}
                value={p}
                style={{ backgroundColor: "#0a0a1a", color: "#fff" }}
              >
                {p}
              </option>
            ))}
          </select>
          {professionFilter && (
            <button
              type="button"
              onClick={() => setProfessionFilter("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-300"
              title="Limpar filtro"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex bg-white/[0.04] border border-white/[0.08] rounded-xl p-1 gap-1">
          <button
            type="button"
            onClick={() => setSortMode("recent")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              sortMode === "recent"
                ? "bg-primary-500/15 text-primary-300 border border-primary-500/20"
                : "text-gray-400 hover:text-gray-200 border border-transparent"
            }`}
            title="Mais recentes primeiro"
          >
            <Clock className="w-3.5 h-3.5" />
            Recentes
          </button>
          <button
            type="button"
            onClick={() => setSortMode("alpha")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              sortMode === "alpha"
                ? "bg-primary-500/15 text-primary-300 border border-primary-500/20"
                : "text-gray-400 hover:text-gray-200 border border-transparent"
            }`}
            title="Ordem alfabética A-Z"
          >
            <ArrowUpAZ className="w-3.5 h-3.5" />
            A-Z
          </button>
        </div>
      </div>

      {/* Stats */}
      {!loading && talents.length > 0 && (
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="px-3 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-gray-400">
            <span className="text-gray-200 font-semibold">{filtered.length}</span>{" "}
            exibido{filtered.length !== 1 ? "s" : ""}
          </span>
          <span className="px-3 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-gray-400">
            <span className="text-gray-200 font-semibold">{professions.length}</span>{" "}
            profissões distintas
          </span>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-32">
          <div className="w-10 h-10 rounded-full border-2 border-primary-500/30 border-t-primary-400 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl py-16 text-center">
          <Briefcase className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">
            {talents.length === 0
              ? "Nenhum talento cadastrado ainda. Os dados aparecem aqui quando usuários enviam currículos."
              : "Nenhum talento corresponde aos filtros."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((t) => (
            <div
              key={t.id}
              className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 hover:bg-white/[0.04] transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 bg-gradient-to-br from-primary-500/20 to-accent-violet/20 border border-primary-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-base font-semibold text-primary-300">
                    {initial(t)}
                  </span>
                </div>

                <div className="flex-1 min-w-0 space-y-2.5">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="min-w-0">
                      <p className="text-base font-semibold text-white truncate">
                        {t.fullName || (
                          <span className="text-gray-500 italic">Sem nome</span>
                        )}
                      </p>
                      {t.profession && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-primary-500/10 text-primary-300 text-xs rounded-md border border-primary-500/15">
                          {t.profession}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-gray-600">
                        {new Date(t.createdAt).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      <button
                        onClick={() => setDeleteTarget(t)}
                        className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Excluir talento"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-gray-400">
                    {t.email && (
                      <a
                        href={`mailto:${t.email}`}
                        className="flex items-center gap-1.5 hover:text-primary-300 transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5 text-gray-500" />
                        {t.email}
                      </a>
                    )}
                    {t.phone && (
                      <span className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-gray-500" />
                        {t.phone}
                      </span>
                    )}
                  </div>

                  {t.links.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {t.links.map((url) => (
                        <a
                          key={url}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2 py-1 bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.08] rounded-lg text-xs text-gray-300 hover:text-primary-300 transition-colors max-w-full"
                          title={url}
                        >
                          <LinkIcon className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{shortenUrl(url)}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirm Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Excluir talento"
        size="sm"
      >
        {deleteTarget && (
          <div className="space-y-5">
            <div className="flex items-start gap-3 p-4 bg-red-500/5 border border-red-500/15 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-300">
                Esta ação é{" "}
                <span className="text-red-400 font-medium">irreversível</span>. O
                registro de{" "}
                <span className="font-semibold text-white">
                  {deleteTarget.fullName || deleteTarget.email}
                </span>{" "}
                será removido permanentemente do banco de talentos.
              </p>
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
                Cancelar
              </Button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-colors text-sm font-medium disabled:opacity-50"
              >
                {deleteLoading ? "Excluindo..." : "Excluir talento"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
