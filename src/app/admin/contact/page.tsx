"use client";

import { useEffect, useMemo, useState } from "react";
import { adminFetch, type AdminContactMessageRow } from "@/services/admin";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import {
  Mail,
  Search,
  Trash2,
  AlertTriangle,
  HelpCircle,
  ScrollText,
  Shield,
  CheckCircle2,
  Circle,
  Eye,
  Inbox,
  Reply,
  Copy,
  Check,
  Clock,
  Globe,
  ChevronDown,
  Filter,
} from "lucide-react";
import toast from "react-hot-toast";

type Topic = AdminContactMessageRow["topic"];
type Status = AdminContactMessageRow["status"];

const topicMeta: Record<
  Topic,
  { label: string; icon: typeof HelpCircle; chip: string; dot: string }
> = {
  help: {
    label: "Central de Ajuda",
    icon: HelpCircle,
    chip: "bg-primary-500/10 border-primary-500/20 text-primary-300",
    dot: "bg-primary-400",
  },
  terms: {
    label: "Termos de Uso",
    icon: ScrollText,
    chip: "bg-accent-violet/10 border-accent-violet/20 text-accent-violet",
    dot: "bg-accent-violet",
  },
  privacy: {
    label: "Privacidade",
    icon: Shield,
    chip: "bg-emerald-500/10 border-emerald-500/20 text-emerald-300",
    dot: "bg-emerald-400",
  },
};

const statusMeta: Record<
  Status,
  { label: string; icon: typeof Circle; chip: string }
> = {
  new: {
    label: "Nova",
    icon: Circle,
    chip: "bg-amber-500/10 border-amber-500/20 text-amber-300",
  },
  read: {
    label: "Lida",
    icon: Eye,
    chip: "bg-sky-500/10 border-sky-500/20 text-sky-300",
  },
  resolved: {
    label: "Resolvida",
    icon: CheckCircle2,
    chip: "bg-emerald-500/10 border-emerald-500/20 text-emerald-300",
  },
};

function initial(m: AdminContactMessageRow) {
  return m.name[0]?.toUpperCase() ?? m.email[0]?.toUpperCase() ?? "?";
}

function formatDate(iso: string) {
  const date = new Date(iso);
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminContactPage() {
  const [messages, setMessages] = useState<AdminContactMessageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [topicFilter, setTopicFilter] = useState<Topic | "all">("all");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [selected, setSelected] = useState<AdminContactMessageRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminContactMessageRow | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  async function fetchMessages() {
    setLoading(true);
    try {
      const res = await adminFetch("/api/admin/contact");
      const data = await res.json();
      if (data.success) setMessages(data.messages);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMessages();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return messages.filter((m) => {
      if (topicFilter !== "all" && m.topic !== topicFilter) return false;
      if (statusFilter !== "all" && m.status !== statusFilter) return false;
      if (!q) return true;
      return (
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.subject.toLowerCase().includes(q) ||
        m.message.toLowerCase().includes(q)
      );
    });
  }, [messages, search, topicFilter, statusFilter]);

  const counts = useMemo(() => {
    const total = messages.length;
    const byStatus: Record<Status, number> = { new: 0, read: 0, resolved: 0 };
    const byTopic: Record<Topic, number> = { help: 0, terms: 0, privacy: 0 };
    for (const m of messages) {
      byStatus[m.status] = (byStatus[m.status] ?? 0) + 1;
      byTopic[m.topic] = (byTopic[m.topic] ?? 0) + 1;
    }
    return { total, byStatus, byTopic };
  }, [messages]);

  async function updateStatus(id: string, status: Status) {
    try {
      const res = await adminFetch("/api/admin/contact", {
        method: "PATCH",
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Erro ao atualizar mensagem.");
        return;
      }
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status } : m))
      );
      if (selected?.id === id) setSelected({ ...selected, status });
    } catch {
      toast.error("Erro ao atualizar mensagem.");
    }
  }

  const handleOpen = (m: AdminContactMessageRow) => {
    setSelected(m);
    setCopiedEmail(false);
    if (m.status === "new") {
      updateStatus(m.id, "read");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      const res = await adminFetch("/api/admin/contact", {
        method: "DELETE",
        body: JSON.stringify({ id: deleteTarget.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Erro ao excluir mensagem.");
        return;
      }
      toast.success("Mensagem excluída.");
      setDeleteTarget(null);
      if (selected?.id === deleteTarget.id) setSelected(null);
      setMessages((prev) => prev.filter((m) => m.id !== deleteTarget.id));
    } finally {
      setDeleteLoading(false);
    }
  };

  const copyEmail = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email);
      setCopiedEmail(true);
      toast.success("E-mail copiado.");
      setTimeout(() => setCopiedEmail(false), 1800);
    } catch {
      toast.error("Não foi possível copiar.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-heading text-white flex items-center gap-3">
          <Mail className="w-7 h-7 text-primary-400" />
          Mensagens de Contato
        </h1>
        <p className="text-gray-400 mt-1 text-sm">
          {counts.total} mensagem{counts.total !== 1 ? "s" : ""} recebida
          {counts.total !== 1 ? "s" : ""} pelos formulários de Ajuda, Termos e Privacidade
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label="Total"
          value={counts.total}
          icon={Inbox}
          tone="text-gray-300"
        />
        <StatCard
          label="Novas"
          value={counts.byStatus.new}
          icon={Circle}
          tone="text-amber-300"
        />
        <StatCard
          label="Lidas"
          value={counts.byStatus.read}
          icon={Eye}
          tone="text-sky-300"
        />
        <StatCard
          label="Resolvidas"
          value={counts.byStatus.resolved}
          icon={CheckCircle2}
          tone="text-emerald-300"
        />
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, e-mail, assunto ou mensagem..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500/30 text-sm transition-all"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FilterSelect
            label="Tópico"
            value={topicFilter}
            onChange={(v) => setTopicFilter(v as Topic | "all")}
            options={[
              { value: "all", label: `Todos os tópicos (${counts.total})` },
              ...(Object.keys(topicMeta) as Topic[]).map((t) => ({
                value: t,
                label: `${topicMeta[t].label} (${counts.byTopic[t]})`,
              })),
            ]}
          />
          <FilterSelect
            label="Status"
            value={statusFilter}
            onChange={(v) => setStatusFilter(v as Status | "all")}
            options={[
              { value: "all", label: "Todos os status" },
              ...(Object.keys(statusMeta) as Status[]).map((s) => ({
                value: s,
                label: `${statusMeta[s].label} (${counts.byStatus[s]})`,
              })),
            ]}
          />
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-32">
          <div className="w-10 h-10 rounded-full border-2 border-primary-500/30 border-t-primary-400 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl py-16 text-center">
          <Inbox className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">
            {messages.length === 0
              ? "Nenhuma mensagem recebida ainda."
              : "Nenhuma mensagem corresponde aos filtros."}
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((m) => {
            const t = topicMeta[m.topic];
            const s = statusMeta[m.status];
            const isNew = m.status === "new";
            return (
              <div
                key={m.id}
                role="button"
                tabIndex={0}
                onClick={() => handleOpen(m)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleOpen(m);
                  }
                }}
                className={`group w-full text-left bg-white/[0.03] border rounded-2xl p-4 hover:bg-white/[0.05] transition-all duration-200 relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500/30 ${
                  isNew
                    ? "border-amber-500/25 hover:border-amber-500/40"
                    : "border-white/[0.06] hover:border-white/[0.12]"
                }`}
              >
                {isNew && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 bg-amber-400 rounded-r-full" />
                )}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/5 border border-white/[0.08] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-gray-300">
                      {initial(m)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p
                            className={`text-sm truncate ${
                              isNew
                                ? "font-semibold text-white"
                                : "font-medium text-gray-200"
                            }`}
                          >
                            {m.name}
                          </p>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-semibold uppercase tracking-wider ${t.chip}`}
                          >
                            <t.icon className="w-3 h-3" />
                            {t.label}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-semibold uppercase tracking-wider ${s.chip}`}
                          >
                            <s.icon className="w-3 h-3" />
                            {s.label}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 truncate mt-0.5">
                          {m.email}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-gray-600 inline-flex items-center gap-1.5">
                          <Clock className="w-3 h-3" />
                          {formatDate(m.createdAt)}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteTarget(m);
                          }}
                          aria-label={`Excluir mensagem de ${m.name}`}
                          title="Excluir mensagem"
                          className="p-1.5 rounded-lg text-gray-500 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p
                      className={`text-sm font-medium truncate ${
                        isNew ? "text-white" : "text-gray-300"
                      }`}
                    >
                      {m.subject}
                    </p>
                    <p className="text-xs text-gray-500 line-clamp-1">
                      {m.message}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title="Mensagem"
        size="lg"
      >
        {selected && (
          <div className="space-y-5">
            <div className="flex items-start gap-3 flex-wrap">
              <div className="w-12 h-12 bg-white/5 border border-white/[0.08] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-base font-semibold text-gray-300">
                  {initial(selected)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold text-white">
                  {selected.name}
                </p>
                <button
                  type="button"
                  onClick={() => copyEmail(selected.email)}
                  className="inline-flex items-center gap-1.5 text-sm text-primary-400 hover:text-primary-300 transition-colors"
                >
                  {selected.email}
                  {copiedEmail ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md border text-[11px] font-semibold uppercase tracking-wider ${topicMeta[selected.topic].chip}`}
                >
                  {(() => {
                    const Icon = topicMeta[selected.topic].icon;
                    return <Icon className="w-3 h-3" />;
                  })()}
                  {topicMeta[selected.topic].label}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md border text-[11px] font-semibold uppercase tracking-wider ${statusMeta[selected.status].chip}`}
                >
                  {(() => {
                    const Icon = statusMeta[selected.status].icon;
                    return <Icon className="w-3 h-3" />;
                  })()}
                  {statusMeta[selected.status].label}
                </span>
              </div>
            </div>

            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 space-y-3">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-1">
                  Assunto
                </p>
                <p className="text-sm text-white font-medium">
                  {selected.subject}
                </p>
              </div>
              <div className="border-t border-white/[0.06] pt-3">
                <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-1">
                  Mensagem
                </p>
                <p className="text-sm text-gray-200 whitespace-pre-wrap break-words leading-relaxed">
                  {selected.message}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2">
                <span className="text-gray-500 inline-flex items-center gap-1.5">
                  <Clock className="w-3 h-3" /> Recebida
                </span>
                <p className="text-gray-300 mt-0.5">
                  {formatDate(selected.createdAt)}
                </p>
              </div>
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2">
                <span className="text-gray-500 inline-flex items-center gap-1.5">
                  <Globe className="w-3 h-3" /> IP
                </span>
                <p className="text-gray-300 mt-0.5 font-mono">
                  {selected.ip || "—"}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2 border-t border-white/[0.06]">
              <a
                href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-600 to-accent-violet text-white text-sm font-medium rounded-xl btn-glow transition-all duration-300"
              >
                <Reply className="w-4 h-4" />
                Responder por e-mail
              </a>

              {selected.status !== "resolved" ? (
                <button
                  onClick={() => updateStatus(selected.id, "resolved")}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded-xl hover:bg-emerald-500/20 transition-colors text-sm font-medium"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Marcar como resolvida
                </button>
              ) : (
                <button
                  onClick={() => updateStatus(selected.id, "read")}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white/[0.04] text-gray-300 border border-white/[0.1] rounded-xl hover:bg-white/[0.08] transition-colors text-sm font-medium"
                >
                  <Eye className="w-4 h-4" />
                  Reabrir
                </button>
              )}

              <button
                onClick={() => setDeleteTarget(selected)}
                className="sm:ml-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/10 text-red-300 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-colors text-sm font-medium"
              >
                <Trash2 className="w-4 h-4" />
                Excluir
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Excluir mensagem"
        size="sm"
      >
        {deleteTarget && (
          <div className="space-y-5">
            <div className="flex items-start gap-3 p-4 bg-red-500/5 border border-red-500/15 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-300">
                Esta ação é{" "}
                <span className="text-red-400 font-medium">irreversível</span>.
                A mensagem de{" "}
                <span className="font-semibold text-white">
                  {deleteTarget.name}
                </span>{" "}
                será excluída permanentemente.
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
                {deleteLoading ? "Excluindo..." : "Excluir mensagem"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  icon: typeof Inbox;
  tone: string;
}) {
  return (
    <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4">
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
        <Icon className={`w-3.5 h-3.5 ${tone}`} />
        {label}
      </div>
      <p className="text-2xl font-heading font-bold text-white tabular-nums">
        {value}
      </p>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
        {label}
      </label>
      <div className="relative">
        <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 pr-10 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500/30 appearance-none cursor-pointer transition-all"
        >
          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              style={{ backgroundColor: "#0a0a1a", color: "#fff" }}
            >
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
      </div>
    </div>
  );
}
