"use client";

import { useEffect, useMemo, useState } from "react";
import { adminFetch, type AdminFeedbackRow } from "@/services/admin";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import {
  MessageSquareHeart,
  Star,
  Trash2,
  AlertTriangle,
  Search,
} from "lucide-react";
import toast from "react-hot-toast";

function Stars({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`w-3.5 h-3.5 ${
            n <= value ? "fill-amber-400 text-amber-400" : "text-gray-600"
          }`}
        />
      ))}
    </div>
  );
}

function initial(f: AdminFeedbackRow) {
  return (f.userName ?? f.userEmail)[0]?.toUpperCase() ?? "?";
}

export default function AdminFeedbacksPage() {
  const [feedbacks, setFeedbacks] = useState<AdminFeedbackRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminFeedbackRow | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  async function fetchFeedbacks() {
    setLoading(true);
    try {
      const res = await adminFetch("/api/admin/feedbacks");
      const data = await res.json();
      if (data.success) setFeedbacks(data.feedbacks);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return feedbacks.filter((f) => {
      if (ratingFilter && f.rating !== ratingFilter) return false;
      if (!q) return true;
      return (
        (f.userName ?? "").toLowerCase().includes(q) ||
        f.userEmail.toLowerCase().includes(q) ||
        f.comment.toLowerCase().includes(q)
      );
    });
  }, [feedbacks, search, ratingFilter]);

  const avgRating = useMemo(() => {
    if (feedbacks.length === 0) return 0;
    const sum = feedbacks.reduce((acc, f) => acc + f.rating, 0);
    return sum / feedbacks.length;
  }, [feedbacks]);

  const distribution = useMemo(() => {
    const d: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    feedbacks.forEach((f) => {
      if (f.rating >= 1 && f.rating <= 5) d[f.rating]++;
    });
    return d;
  }, [feedbacks]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      const res = await adminFetch("/api/admin/feedbacks", {
        method: "DELETE",
        body: JSON.stringify({ id: deleteTarget.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Erro ao excluir feedback.");
        return;
      }
      toast.success("Feedback excluído.");
      setDeleteTarget(null);
      fetchFeedbacks();
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-heading text-white flex items-center gap-3">
          <MessageSquareHeart className="w-7 h-7 text-pink-400" />
          Feedbacks
        </h1>
        <p className="text-gray-400 mt-1 text-sm">
          {feedbacks.length} feedback{feedbacks.length !== 1 ? "s" : ""} recebido
          {feedbacks.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Summary */}
      {!loading && feedbacks.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 flex items-center gap-5">
            <div className="flex flex-col items-center">
              <span className="text-4xl font-bold text-white font-heading leading-none">
                {avgRating.toFixed(1)}
              </span>
              <div className="mt-2">
                <Stars value={Math.round(avgRating)} />
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500">Nota média</p>
              <p className="text-sm text-gray-300 mt-1">
                Baseada em {feedbacks.length} avaliaç
                {feedbacks.length !== 1 ? "ões" : "ão"}
              </p>
            </div>
          </div>

          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 lg:col-span-2">
            <p className="text-xs text-gray-500 mb-3">Distribuição</p>
            <div className="space-y-1.5">
              {[5, 4, 3, 2, 1].map((n) => {
                const count = distribution[n];
                const pct =
                  feedbacks.length > 0
                    ? Math.round((count / feedbacks.length) * 100)
                    : 0;
                return (
                  <div key={n} className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setRatingFilter(ratingFilter === n ? null : n)
                      }
                      className={`flex items-center gap-1 w-10 text-xs tabular-nums transition-colors ${
                        ratingFilter === n ? "text-amber-400" : "text-gray-400"
                      }`}
                    >
                      {n}
                      <Star className="w-3 h-3 fill-current" />
                    </button>
                    <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 tabular-nums w-16 text-right">
                      {count} ({pct}%)
                    </span>
                  </div>
                );
              })}
            </div>
            {ratingFilter !== null && (
              <button
                type="button"
                onClick={() => setRatingFilter(null)}
                className="mt-3 text-xs text-primary-400 hover:text-primary-300"
              >
                Limpar filtro de nota
              </button>
            )}
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome, e-mail ou conteúdo..."
          className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500/30 text-sm transition-all"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <div className="w-10 h-10 rounded-full border-2 border-primary-500/30 border-t-primary-400 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl py-16 text-center">
          <MessageSquareHeart className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">
            {feedbacks.length === 0
              ? "Ainda não há feedbacks de usuários."
              : "Nenhum feedback corresponde aos filtros."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((f) => (
            <div
              key={f.id}
              className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 hover:bg-white/[0.04] transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/5 border border-white/[0.08] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-semibold text-gray-300">
                    {initial(f)}
                  </span>
                </div>
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {f.userName ?? (
                          <span className="text-gray-500">—</span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {f.userEmail}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <Stars value={f.rating} />
                      <span className="text-xs text-gray-600">
                        {new Date(f.createdAt).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      <button
                        onClick={() => setDeleteTarget(f)}
                        className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Excluir feedback"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {f.comment && (
                    <p className="text-sm text-gray-300 whitespace-pre-wrap break-words leading-relaxed">
                      {f.comment}
                    </p>
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
        title="Excluir Feedback"
        size="sm"
      >
        {deleteTarget && (
          <div className="space-y-5">
            <div className="flex items-start gap-3 p-4 bg-red-500/5 border border-red-500/15 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-300">
                Esta ação é{" "}
                <span className="text-red-400 font-medium">irreversível</span>.
                O feedback de{" "}
                <span className="font-semibold text-white">
                  {deleteTarget.userName ?? deleteTarget.userEmail}
                </span>{" "}
                será excluído permanentemente.
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
                {deleteLoading ? "Excluindo..." : "Excluir feedback"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
