"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Clock,
  Download,
  FileCheck,
  FileSearch,
  FileText,
  FolderOpen,
  PenLine,
  Trash2,
  Building2,
  FilePlus,
  AlertTriangle,
  Filter,
  ChevronDown,
} from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { useAuthContext } from "@/components/providers/AuthProvider";
import {
  deleteSavedItem,
  listSavedItems,
} from "@/services/saved-items";
import type { SavedItem, SavedItemType } from "@/types";
import { SAVED_ITEM_LABELS, SAVED_ITEM_MAX_PER_TYPE } from "@/types";
import { downloadResumePDF } from "@/utils/resume-pdf";
import type { ResumeSchema } from "@/lib/resume-schema";
import type { TemplateName, SectionName } from "@/lib/resume-templates";

const TYPE_ORDER: SavedItemType[] = [
  "resume",
  "resume-analysis",
  "company-analysis",
  "cover-letter",
];

const TYPE_ICON: Record<SavedItemType, React.ComponentType<{ className?: string }>> = {
  "resume": FilePlus,
  "resume-analysis": FileSearch,
  "company-analysis": Building2,
  "cover-letter": FileText,
};

const TYPE_ACCENT: Record<SavedItemType, string> = {
  "resume": "text-primary-400 bg-primary-500/10 border-primary-500/20",
  "resume-analysis": "text-blue-400 bg-blue-500/10 border-blue-500/20",
  "company-analysis": "text-violet-400 bg-violet-500/10 border-violet-500/20",
  "cover-letter": "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
};

function formatDateTime(d: Date): string {
  return d.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatRemaining(expiresAt: Date): { label: string; urgent: boolean } {
  const ms = expiresAt.getTime() - Date.now();
  if (ms <= 0) return { label: "expirado", urgent: true };
  const totalMin = Math.floor(ms / 60000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  const urgent = totalMin < 60;
  if (h >= 1) return { label: `${h}h ${m}min restantes`, urgent };
  return { label: `${m}min restantes`, urgent };
}

export default function MyFilesPage() {
  const { user } = useAuthContext();
  const [items, setItems] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"all" | SavedItemType>("all");
  const [deleteTarget, setDeleteTarget] = useState<SavedItem | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [, setTick] = useState(0);

  // Re-render every minute so the countdown updates
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const list = await listSavedItems(user.uid);
      setItems(list);
    } catch {
      toast.error("Não foi possível carregar seus arquivos.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const counts = useMemo(() => {
    const result: Record<SavedItemType, number> = {
      "resume": 0,
      "resume-analysis": 0,
      "company-analysis": 0,
      "cover-letter": 0,
    };
    items.forEach((i) => {
      result[i.type]++;
    });
    return result;
  }, [items]);

  const filtered = useMemo(() => {
    if (tab === "all") return items;
    return items.filter((i) => i.type === tab);
  }, [items, tab]);

  const handleDownload = async (item: SavedItem) => {
    try {
      if (item.type === "resume") {
        await downloadResumePDF(
          item.resumeData as ResumeSchema,
          (item.template as TemplateName) || "profissional",
          undefined,
          item.candidateLevel,
          {
            fontSizeOffset: item.adjustments?.fontSizeOffset,
            spacingOffset: item.adjustments?.spacingOffset,
            hiddenSections: item.adjustments?.hiddenSections as SectionName[] | undefined,
          }
        );
        return;
      }
      // PDF item — use the Storage URL directly with Content-Disposition override.
      // Fetching it from the client would trigger CORS (bucket has no CORS policy by default).
      const disposition = `attachment; filename="${item.fileName}"`;
      const sep = item.downloadUrl.includes("?") ? "&" : "?";
      const urlWithDisposition = `${item.downloadUrl}${sep}response-content-disposition=${encodeURIComponent(disposition)}`;
      const a = document.createElement("a");
      a.href = urlWithDisposition;
      a.rel = "noopener noreferrer";
      // download attribute is ignored for cross-origin URLs, but
      // response-content-disposition forces the server to send attachment headers
      a.download = item.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch {
      toast.error("Não foi possível baixar o arquivo.");
    }
  };

  const confirmDelete = async () => {
    if (!user || !deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteSavedItem(user.uid, deleteTarget.id);
      toast.success("Arquivo excluído.");
      setDeleteTarget(null);
      load();
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-8">
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
            <FolderOpen className="w-3 h-3" />
            Documentos
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white font-heading leading-[1.1] tracking-tight">
            Seus <span className="gradient-text">arquivos</span> gerados
          </h1>
          <p className="text-gray-400 mt-4 text-base md:text-lg max-w-xl leading-relaxed">
            Currículos e documentos são mantidos por{" "}
            <span className="text-white font-medium">10 horas</span> e depois excluídos automaticamente.
            Você pode salvar até{" "}
            <span className="text-white font-medium">{SAVED_ITEM_MAX_PER_TYPE}</span> de cada tipo.
          </p>
        </div>
      </section>

      {/* Filters — select em mobile/tablet, chips em desktop */}
      <div className="animate-fade-in-up animation-delay-200">
        {/* Mobile + tablet (< lg): select */}
        <div className="lg:hidden relative">
          <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          <select
            value={tab}
            onChange={(e) => setTab(e.target.value as "all" | SavedItemType)}
            className="w-full pl-10 pr-10 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500/30 appearance-none cursor-pointer transition-all"
          >
            <option value="all" style={{ backgroundColor: "#0a0a1a", color: "#fff" }}>
              Todos ({items.length})
            </option>
            {TYPE_ORDER.map((t) => (
              <option
                key={t}
                value={t}
                style={{ backgroundColor: "#0a0a1a", color: "#fff" }}
              >
                {SAVED_ITEM_LABELS[t]} ({counts[t]}/{SAVED_ITEM_MAX_PER_TYPE})
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>

        {/* Desktop (lg+): chips */}
        <div className="hidden lg:flex flex-wrap gap-2">
          <button
            onClick={() => setTab("all")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
              tab === "all"
                ? "bg-white/10 text-white border-white/15"
                : "bg-white/[0.03] text-gray-400 border-white/[0.06] hover:text-gray-200"
            }`}
          >
            Todos ({items.length})
          </button>
          {TYPE_ORDER.map((t) => {
            const Icon = TYPE_ICON[t];
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                  tab === t
                    ? "bg-white/10 text-white border-white/15"
                    : "bg-white/[0.03] text-gray-400 border-white/[0.06] hover:text-gray-200"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {SAVED_ITEM_LABELS[t]} ({counts[t]}/{SAVED_ITEM_MAX_PER_TYPE})
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-10 h-10 rounded-full border-2 border-primary-500/30 border-t-primary-400 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="relative bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] py-16 flex flex-col items-center gap-3 text-center animate-fade-in-up animation-delay-300">
          <FileCheck className="w-10 h-10 text-gray-600" />
          <p className="text-gray-400 text-sm max-w-sm">
            {tab === "all"
              ? "Você ainda não tem arquivos salvos. Gere um currículo ou análise e ele aparecerá aqui automaticamente."
              : "Nenhum arquivo deste tipo no momento."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 animate-fade-in-up animation-delay-300">
          {filtered.map((item) => {
            const Icon = TYPE_ICON[item.type];
            const remaining = formatRemaining(item.expiresAt);
            const accent = TYPE_ACCENT[item.type];
            return (
              <div key={item.id} className="relative group bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] p-5 overflow-hidden hover:border-primary-500/30 hover:-translate-y-0.5 transition-all duration-300 flex flex-col gap-3">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-500/10 group-hover:bg-primary-500/20 rounded-full blur-3xl transition-all duration-500 pointer-events-none" />
                <div className="relative flex items-start justify-between gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border flex-shrink-0 ${accent}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] border ${
                      remaining.urgent
                        ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
                        : "text-gray-400 bg-white/5 border-white/10"
                    }`}
                  >
                    <Clock className="w-3 h-3" />
                    {remaining.label}
                  </span>
                </div>

                <div className="relative">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    {SAVED_ITEM_LABELS[item.type]}
                  </p>
                  <p className="text-sm font-semibold text-white truncate mt-0.5" title={item.title}>
                    {item.title}
                  </p>
                  {item.subtitle && (
                    <p className="text-xs text-gray-500 truncate mt-0.5" title={item.subtitle}>
                      {item.subtitle}
                    </p>
                  )}
                </div>

                <p className="relative text-[11px] text-gray-500 border-t border-white/[0.06] pt-2">
                  Gerado em {formatDateTime(item.createdAt)}
                </p>

                <div className="relative flex items-center gap-2 pt-1">
                  <Button size="sm" onClick={() => handleDownload(item)} className="flex-1 glow-blue">
                    <Download className="w-3.5 h-3.5 mr-1.5" />
                    Baixar
                  </Button>
                  {item.type === "resume" && (
                    <Link
                      href={`/create-resume?itemId=${item.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-300 hover:bg-white/10 transition-colors"
                    >
                      <PenLine className="w-3.5 h-3.5" />
                      Editar
                    </Link>
                  )}
                  <button
                    onClick={() => setDeleteTarget(item)}
                    className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={!!deleteTarget}
        onClose={() => !deleteLoading && setDeleteTarget(null)}
        title="Excluir arquivo"
        size="sm"
      >
        {deleteTarget && (
          <div className="space-y-5">
            <div className="flex items-start gap-3 p-4 bg-red-500/5 border border-red-500/15 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-300">
                Esta ação é <span className="text-red-400 font-medium">irreversível</span>.{" "}
                <span className="text-white font-semibold">{deleteTarget.title}</span> será excluído permanentemente.
              </p>
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setDeleteTarget(null)} disabled={deleteLoading}>
                Cancelar
              </Button>
              <button
                onClick={confirmDelete}
                disabled={deleteLoading}
                className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-colors text-sm font-medium disabled:opacity-50"
              >
                {deleteLoading ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
