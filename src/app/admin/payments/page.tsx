"use client";

import { useEffect, useMemo, useState } from "react";
import { adminFetch, type AdminPaymentRow } from "@/services/admin";
import {
  CreditCard,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  RefreshCw,
  ShieldAlert,
  XCircle,
  ChevronDown,
  ChevronRight,
  Copy,
  Coins,
  RotateCcw,
} from "lucide-react";

type StatusFilter = "all" | AdminPaymentRow["status"];

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "completed", label: "Pagos" },
  { value: "pending", label: "Pendentes" },
  { value: "failed", label: "Falhas" },
  { value: "refunded", label: "Estornados" },
  { value: "disputed", label: "Disputados" },
];

function StatusBadge({ status, hasErrors }: { status: AdminPaymentRow["status"]; hasErrors: boolean }) {
  if (status === "completed") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
        <CheckCircle2 className="w-3 h-3" />
        200 OK
      </span>
    );
  }
  if (status === "pending") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
        <Clock className="w-3 h-3" />
        AGUARDANDO
      </span>
    );
  }
  if (status === "failed") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-bold bg-red-500/10 text-red-300 border border-red-500/20">
        <XCircle className="w-3 h-3" />
        FALHOU
      </span>
    );
  }
  if (status === "refunded") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-bold bg-orange-500/10 text-orange-300 border border-orange-500/20">
        <RotateCcw className="w-3 h-3" />
        ESTORNADO
      </span>
    );
  }
  if (status === "disputed") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-bold bg-rose-500/10 text-rose-300 border border-rose-500/20">
        <ShieldAlert className="w-3 h-3" />
        DISPUTADO
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-bold bg-gray-500/10 text-gray-300 border border-gray-500/20">
      {status}
      {hasErrors && <AlertTriangle className="w-3 h-3 text-amber-400" />}
    </span>
  );
}

function fmtBRL(v: number): string {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
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

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<AdminPaymentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const load = async () => {
    setRefreshing(true);
    try {
      const res = await adminFetch("/api/admin/payments");
      const data = await res.json();
      if (data.success) setPayments(data.payments as AdminPaymentRow[]);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const stats = useMemo(() => {
    const completed = payments.filter((p) => p.status === "completed").length;
    const failed = payments.filter((p) => p.status === "failed").length;
    const pending = payments.filter((p) => p.status === "pending").length;
    const refunded = payments.filter((p) => p.status === "refunded").length;
    const disputed = payments.filter((p) => p.status === "disputed").length;
    const revenue = payments
      .filter((p) => p.status === "completed")
      .reduce((acc, p) => acc + (p.amount ?? 0), 0);
    return { completed, failed, pending, refunded, disputed, revenue, total: payments.length };
  }, [payments]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return payments.filter((p) => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (!q) return true;
      const fields = [
        p.id,
        p.userId,
        p.user?.displayName ?? "",
        p.user?.email ?? "",
        p.packId,
        p.abacateCheckoutId ?? "",
      ];
      return fields.some((f) => f.toLowerCase().includes(q));
    });
  }, [payments, search, statusFilter]);

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
            <CreditCard className="w-7 h-7 text-primary-400" />
            Controle de Pagamentos
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
            {stats.total} pagamentos · pacotes Abacate Pay
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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatBox label="Pagos" value={stats.completed} tone="emerald" />
        <StatBox label="Pendentes" value={stats.pending} tone="amber" />
        <StatBox label="Falhas" value={stats.failed} tone="red" />
        <StatBox label="Estornados" value={stats.refunded} tone="orange" />
        <StatBox label="Disputados" value={stats.disputed} tone="rose" />
        <StatBox label="Receita" value={fmtBRL(stats.revenue)} tone="primary" />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, email, paymentId, checkoutId..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40 text-sm"
          />
        </div>
        <div className="flex gap-1 bg-white/[0.04] border border-white/[0.08] rounded-xl p-1 flex-wrap">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                statusFilter === f.value
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
          <CreditCard className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">
            {payments.length === 0
              ? "Nenhum pagamento registrado ainda."
              : "Nenhum pagamento corresponde à busca."}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((p) => {
            const isOpen = expanded.has(p.id);
            const hasErrors = p.errors.length > 0;
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
                      <span className="text-white font-semibold tabular-nums">
                        {fmtBRL(p.amount)}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-primary-300 tabular-nums">
                        <Coins className="w-3 h-3" />
                        {p.creditsToAdd}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <StatusBadge status={p.status} hasErrors={hasErrors} />
                      {hasErrors && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-red-500/10 text-red-300 border border-red-500/20">
                          <AlertTriangle className="w-3 h-3" />
                          {p.errors.length}
                        </span>
                      )}
                    </div>
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-white/[0.06] bg-dark-900/30 p-4 space-y-4">
                    {/* Meta grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                      <MetaField label="Payment ID">
                        <span className="font-mono text-gray-300">{p.id}</span>
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
                      <MetaField label="Pacote">
                        <span className="text-gray-300">{p.packId}</span>
                      </MetaField>
                      <MetaField label="Abacate Checkout">
                        <span className="font-mono text-gray-300 truncate">
                          {p.abacateCheckoutId ?? "—"}
                        </span>
                        {p.abacateCheckoutId && (
                          <button
                            onClick={() => copyToClipboard(p.abacateCheckoutId!)}
                            className="text-gray-500 hover:text-white"
                            title="Copiar"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        )}
                      </MetaField>
                      <MetaField label="Criado em">
                        <span className="text-gray-300">{fmtDateTime(p.createdAt)}</span>
                      </MetaField>
                      <MetaField label="Última atualização">
                        <span className="text-gray-300">{fmtDateTime(p.updatedAt)}</span>
                      </MetaField>
                      {p.completedAt && (
                        <MetaField label="Pago em">
                          <span className="text-emerald-300">{fmtDateTime(p.completedAt)}</span>
                        </MetaField>
                      )}
                      {p.refundedAt && (
                        <MetaField label="Estornado em">
                          <span className="text-orange-300">{fmtDateTime(p.refundedAt)}</span>
                        </MetaField>
                      )}
                    </div>

                    {/* Console de erros */}
                    {hasErrors ? (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="w-4 h-4 text-red-400" />
                          <h4 className="text-sm font-semibold text-red-300">
                            Console de erros ({p.errors.length})
                          </h4>
                        </div>
                        <div className="space-y-2">
                          {p.errors
                            .slice()
                            .reverse()
                            .map((err, idx) => (
                              <div
                                key={`${err.timestamp}-${idx}`}
                                className="bg-red-500/[0.06] border border-red-500/20 rounded-lg p-3 font-mono text-xs"
                              >
                                <div className="flex items-center justify-between gap-3 mb-2">
                                  <div className="flex items-center gap-2">
                                    <span className="px-1.5 py-0.5 bg-red-500/20 text-red-300 rounded text-[10px] font-bold">
                                      {err.code}
                                    </span>
                                    <span className="text-gray-400 text-[11px]">
                                      {err.source}
                                      {err.event ? ` · ${err.event}` : ""}
                                      {err.httpStatus ? ` · HTTP ${err.httpStatus}` : ""}
                                    </span>
                                  </div>
                                  <span className="text-[10px] text-gray-500">
                                    {fmtDateTime(err.timestamp)}
                                  </span>
                                </div>
                                <p className="text-red-200 leading-relaxed mb-2 break-words">
                                  {err.message}
                                </p>
                                {err.body && (
                                  <details className="text-gray-400">
                                    <summary className="cursor-pointer hover:text-gray-200 text-[11px]">
                                      Response body
                                    </summary>
                                    <pre className="mt-2 p-2 bg-black/40 rounded overflow-x-auto whitespace-pre-wrap break-words">
                                      {err.body}
                                    </pre>
                                  </details>
                                )}
                                {err.stack && (
                                  <details className="text-gray-400 mt-1">
                                    <summary className="cursor-pointer hover:text-gray-200 text-[11px]">
                                      Stack trace
                                    </summary>
                                    <pre className="mt-2 p-2 bg-black/40 rounded overflow-x-auto whitespace-pre-wrap break-words">
                                      {err.stack}
                                    </pre>
                                  </details>
                                )}
                              </div>
                            ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/[0.05] border border-emerald-500/15 rounded-lg text-xs text-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Nenhum erro registrado nesse pagamento.
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
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
  tone: "emerald" | "amber" | "red" | "orange" | "rose" | "primary";
}) {
  const toneClass = {
    emerald: "border-emerald-500/15 text-emerald-300",
    amber: "border-amber-500/15 text-amber-300",
    red: "border-red-500/15 text-red-300",
    orange: "border-orange-500/15 text-orange-300",
    rose: "border-rose-500/15 text-rose-300",
    primary: "border-primary-500/15 text-primary-300",
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
