"use client";

import { useCallback, useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import toast from "react-hot-toast";
import {
  Users,
  Coins,
  Wallet,
  Banknote,
  RotateCcw,
  ScrollText,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import { formatCents } from "@/utils/helpers";
import {
  fetchReferralStats,
  fetchAdminReferrals,
  fetchAdminCommissions,
  fetchAdminWithdrawals,
  fetchAdminRefunds,
  fetchAdminAuditLogs,
  commissionAction,
  withdrawalAction,
  refundAction,
  type ReferralStats,
  type AdminReferralRow,
  type AdminCommissionRow,
  type AdminWithdrawalRow,
  type AdminRefundRow,
  type AdminAuditRow,
} from "@/services/admin-referrals";

type TabKey = "resumo" | "indicacoes" | "comissoes" | "saques" | "reembolsos" | "auditoria";

const TABS: Array<{ key: TabKey; label: string }> = [
  { key: "resumo", label: "Resumo" },
  { key: "indicacoes", label: "Indicações" },
  { key: "comissoes", label: "Comissões" },
  { key: "saques", label: "Saques" },
  { key: "reembolsos", label: "Reembolsos" },
  { key: "auditoria", label: "Auditoria" },
];

const PIX_LABEL: Record<string, string> = {
  cpf: "CPF",
  cnpj: "CNPJ",
  email: "E-mail",
  phone: "Telefone",
  random: "Aleatória",
};

const STATUS_CLS: Record<string, string> = {
  held: "text-amber-300 bg-amber-500/10 border-amber-500/20",
  released: "text-emerald-300 bg-emerald-500/10 border-emerald-500/20",
  reversed: "text-red-300 bg-red-500/10 border-red-500/20",
  cancelled: "text-gray-300 bg-gray-500/10 border-gray-500/20",
  requested: "text-amber-300 bg-amber-500/10 border-amber-500/20",
  approved: "text-sky-300 bg-sky-500/10 border-sky-500/20",
  paid: "text-emerald-300 bg-emerald-500/10 border-emerald-500/20",
  rejected: "text-red-300 bg-red-500/10 border-red-500/20",
  processed: "text-emerald-300 bg-emerald-500/10 border-emerald-500/20",
  attributed: "text-gray-300 bg-gray-500/10 border-gray-500/20",
  converted: "text-emerald-300 bg-emerald-500/10 border-emerald-500/20",
};

const STATUS_LABEL: Record<string, string> = {
  held: "Retida",
  released: "Liberada",
  reversed: "Estornada",
  cancelled: "Cancelada",
  requested: "Em análise",
  approved: "Aprovado",
  paid: "Pago",
  rejected: "Recusado",
  processed: "Processado",
  attributed: "Cadastrada",
  converted: "Convertida",
};

function Badge({ status }: { status: string }) {
  return (
    <span
      className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${
        STATUS_CLS[status] ?? "text-gray-300 bg-gray-500/10 border-gray-500/20"
      }`}
    >
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface PendingAction {
  title: string;
  description: string;
  confirmLabel: string;
  needsReason?: boolean;
  reasonRequired?: boolean;
  needsPayoutRef?: boolean;
  run: (inputs: { reason: string; payoutRef: string }) => Promise<void>;
}

export default function AdminReferralsPage() {
  const [tab, setTab] = useState<TabKey>("resumo");

  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [referrals, setReferrals] = useState<AdminReferralRow[]>([]);
  const [commissions, setCommissions] = useState<AdminCommissionRow[]>([]);
  const [withdrawals, setWithdrawals] = useState<AdminWithdrawalRow[]>([]);
  const [refunds, setRefunds] = useState<AdminRefundRow[]>([]);
  const [audit, setAudit] = useState<AdminAuditRow[]>([]);
  const [auditCursor, setAuditCursor] = useState<string | null>(null);

  const [commStatus, setCommStatus] = useState("");
  const [wStatus, setWStatus] = useState("");
  const [rStatus, setRStatus] = useState("");

  const [loading, setLoading] = useState(false);

  const [pending, setPending] = useState<PendingAction | null>(null);
  const [reason, setReason] = useState("");
  const [payoutRef, setPayoutRef] = useState("");
  const [running, setRunning] = useState(false);

  const reload = useCallback(
    async (which: TabKey) => {
      setLoading(true);
      try {
        if (which === "resumo") setStats(await fetchReferralStats());
        else if (which === "indicacoes") setReferrals(await fetchAdminReferrals());
        else if (which === "comissoes") setCommissions(await fetchAdminCommissions(commStatus || undefined));
        else if (which === "saques") setWithdrawals(await fetchAdminWithdrawals(wStatus || undefined));
        else if (which === "reembolsos") setRefunds(await fetchAdminRefunds(rStatus || undefined));
        else if (which === "auditoria") {
          const res = await fetchAdminAuditLogs();
          setAudit(res.logs);
          setAuditCursor(res.nextCursor);
        }
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Erro ao carregar.");
      } finally {
        setLoading(false);
      }
    },
    [commStatus, wStatus, rStatus]
  );

  useEffect(() => {
    void reload(tab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, commStatus, wStatus, rStatus]);

  const loadMoreAudit = async () => {
    if (!auditCursor) return;
    try {
      const res = await fetchAdminAuditLogs(auditCursor);
      setAudit((prev) => [...prev, ...res.logs]);
      setAuditCursor(res.nextCursor);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao carregar mais.");
    }
  };

  const openAction = (a: PendingAction) => {
    setReason("");
    setPayoutRef("");
    setPending(a);
  };

  const runPending = async () => {
    if (!pending) return;
    if (pending.reasonRequired && !reason.trim()) {
      toast.error("Informe o motivo.");
      return;
    }
    setRunning(true);
    try {
      await pending.run({ reason: reason.trim(), payoutRef: payoutRef.trim() });
      toast.success("Ação concluída.");
      setPending(null);
      await reload(tab);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro na ação.");
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white font-heading">Indicações & Carteira</h1>
          <p className="text-sm text-gray-400 mt-1">
            Gestão de indicações, comissões, saques, reembolsos e auditoria.
          </p>
        </div>
        <button
          onClick={() => reload(tab)}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-white/10 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Atualizar
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto border-b border-white/[0.06] pb-px">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              tab === t.key
                ? "border-primary-500 text-primary-400"
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Resumo */}
      {tab === "resumo" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={Users} tint="text-indigo-400 bg-indigo-500/10" label="Indicações" value={String(stats?.referrals.total ?? "—")} sub={`${stats?.referrals.converted ?? 0} converteram`} />
            <StatCard icon={Coins} tint="text-amber-400 bg-amber-500/10" label="Créditos distribuídos" value={String(stats?.referrals.creditsDistributed ?? "—")} sub="por indicação" />
            <StatCard icon={TrendingUp} tint="text-primary-400 bg-primary-500/10" label="Comissões geradas" value={stats ? formatCents(stats.commissions.generatedCents) : "—"} sub={`${stats ? formatCents(stats.commissions.releasedCents) : "—"} liberadas`} />
            <StatCard icon={Wallet} tint="text-emerald-400 bg-emerald-500/10" label="Retido (pendente)" value={stats ? formatCents(stats.commissions.heldCents) : "—"} sub={`${stats ? formatCents(stats.commissions.reversedCents) : "—"} estornadas`} />
            <StatCard icon={Banknote} tint="text-sky-400 bg-sky-500/10" label="Saques pendentes" value={String((stats?.pending.withdrawalsRequested ?? 0) + (stats?.pending.withdrawalsApproved ?? 0))} sub={`${stats?.pending.withdrawalsPaid ?? 0} pagos`} />
            <StatCard icon={RotateCcw} tint="text-red-400 bg-red-500/10" label="Reembolsos pendentes" value={String(stats?.pending.refundsRequested ?? 0)} sub="aguardando análise" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <TopList title="Mais indicações" rows={(stats?.topReferrers ?? []).map((t) => ({ name: t.name, value: String(t.count) }))} />
            <TopList title="Maior volume de comissão" rows={(stats?.topEarners ?? []).map((t) => ({ name: t.name, value: formatCents(t.amountCents) }))} />
          </div>
          {stats?.capped && (
            <p className="text-xs text-gray-600">
              * Métricas calculadas sobre uma amostra (volume alto). Os totais reais podem ser maiores.
            </p>
          )}
        </div>
      )}

      {/* Indicações */}
      {tab === "indicacoes" && (
        <Panel empty={!loading && referrals.length === 0} loading={loading}>
          {referrals.map((r) => (
            <Row key={r.id}>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium truncate">
                  {r.referrerName} <span className="text-gray-600">→</span> {r.referredName}
                </p>
                <p className="text-xs text-gray-500">Código {r.code || "—"} · {fmtDate(r.createdAt)}</p>
              </div>
              <Badge status={r.status} />
            </Row>
          ))}
        </Panel>
      )}

      {/* Comissões */}
      {tab === "comissoes" && (
        <>
          <Filters value={commStatus} onChange={setCommStatus} options={["held", "released", "reversed", "cancelled"]} />
          <Panel empty={!loading && commissions.length === 0} loading={loading}>
            {commissions.map((c) => (
              <Row key={c.id}>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium truncate">
                    {formatCents(c.amountCents)} · {c.referrerName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    Compra de {c.referredName} · {c.packId} · {fmtDate(c.createdAt)}
                  </p>
                </div>
                <Badge status={c.status} />
                {(c.status === "held" || c.status === "released") && (
                  <Button
                    variant="outline"
                    className="!py-1.5 !px-3 text-xs"
                    onClick={() =>
                      openAction({
                        title: "Cancelar comissão",
                        description: `Cancelar a comissão de ${formatCents(c.amountCents)} de ${c.referrerName}? O valor será debitado da carteira (pode ficar negativo).`,
                        confirmLabel: "Cancelar comissão",
                        needsReason: true,
                        run: ({ reason }) => commissionAction(c.id, reason || undefined).then(() => undefined),
                      })
                    }
                  >
                    Cancelar
                  </Button>
                )}
              </Row>
            ))}
          </Panel>
        </>
      )}

      {/* Saques */}
      {tab === "saques" && (
        <>
          <Filters value={wStatus} onChange={setWStatus} options={["requested", "approved", "paid", "rejected"]} />
          <Panel empty={!loading && withdrawals.length === 0} loading={loading}>
            {withdrawals.map((w) => (
              <Row key={w.id}>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium truncate">
                    {formatCents(w.amountCents)} · {w.userName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    PIX {PIX_LABEL[w.pixKeyType] ?? w.pixKeyType}: {w.pixKey} · {fmtDate(w.requestedAt)}
                  </p>
                </div>
                <Badge status={w.status} />
                <div className="flex gap-1.5 flex-wrap">
                  {w.status === "requested" && (
                    <Button variant="outline" className="!py-1.5 !px-3 text-xs" onClick={() => openAction({
                      title: "Aprovar saque",
                      description: `Aprovar o saque de ${formatCents(w.amountCents)} de ${w.userName}?`,
                      confirmLabel: "Aprovar",
                      run: () => withdrawalAction(w.id, "approve").then(() => undefined),
                    })}>Aprovar</Button>
                  )}
                  {(w.status === "requested" || w.status === "approved") && (
                    <>
                      <Button variant="primary" className="!py-1.5 !px-3 text-xs" onClick={() => openAction({
                        title: "Marcar saque como pago",
                        description: `Confirmar que o PIX de ${formatCents(w.amountCents)} para ${w.userName} (${w.pixKey}) foi efetuado?`,
                        confirmLabel: "Marcar como pago",
                        needsPayoutRef: true,
                        run: ({ payoutRef }) => withdrawalAction(w.id, "pay", { payoutRef }).then(() => undefined),
                      })}>Pagar</Button>
                      <Button variant="outline" className="!py-1.5 !px-3 text-xs !text-red-300 !border-red-500/30" onClick={() => openAction({
                        title: "Recusar saque",
                        description: `Recusar o saque de ${formatCents(w.amountCents)}? O valor volta ao saldo do usuário.`,
                        confirmLabel: "Recusar",
                        needsReason: true,
                        reasonRequired: true,
                        run: ({ reason }) => withdrawalAction(w.id, "reject", { reason }).then(() => undefined),
                      })}>Recusar</Button>
                    </>
                  )}
                </div>
              </Row>
            ))}
          </Panel>
        </>
      )}

      {/* Reembolsos */}
      {tab === "reembolsos" && (
        <>
          <Filters value={rStatus} onChange={setRStatus} options={["requested", "processed", "rejected"]} />
          <Panel empty={!loading && refunds.length === 0} loading={loading}>
            {refunds.map((r) => (
              <Row key={r.id}>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium truncate">
                    {formatCents(r.amountCents)} · {r.userName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {r.packId} · {r.creditsUsedAtRequest}/{r.creditsGranted} créditos usados · {fmtDate(r.createdAt)}
                    {r.reason ? ` · "${r.reason}"` : ""}
                  </p>
                </div>
                <Badge status={r.status} />
                {r.status === "requested" && (
                  <div className="flex gap-1.5">
                    <Button variant="primary" className="!py-1.5 !px-3 text-xs" onClick={() => openAction({
                      title: "Aprovar reembolso",
                      description: `Aprovar o reembolso de ${formatCents(r.amountCents)} (${r.packId})? Os créditos restantes serão removidos e a comissão do indicador estornada.`,
                      confirmLabel: "Aprovar e processar",
                      run: () => refundAction(r.id, "approve").then(() => undefined),
                    })}>Aprovar</Button>
                    <Button variant="outline" className="!py-1.5 !px-3 text-xs !text-red-300 !border-red-500/30" onClick={() => openAction({
                      title: "Recusar reembolso",
                      description: `Recusar a solicitação de reembolso de ${r.userName}?`,
                      confirmLabel: "Recusar",
                      needsReason: true,
                      reasonRequired: true,
                      run: ({ reason }) => refundAction(r.id, "reject", reason).then(() => undefined),
                    })}>Recusar</Button>
                  </div>
                )}
              </Row>
            ))}
          </Panel>
        </>
      )}

      {/* Auditoria */}
      {tab === "auditoria" && (
        <Panel empty={!loading && audit.length === 0} loading={loading}>
          {audit.map((a) => (
            <Row key={a.id}>
              <div className="w-9 h-9 rounded-lg bg-white/[0.05] flex items-center justify-center flex-shrink-0">
                <ScrollText className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium truncate">
                  {a.action}
                  {a.amountCents != null ? ` · ${formatCents(a.amountCents)}` : ""}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {a.actorType} ({a.actorName}){a.affectedName ? ` → ${a.affectedName}` : ""} · {fmtDate(a.createdAt)}
                  {a.notes ? ` · ${a.notes}` : ""}
                </p>
              </div>
            </Row>
          ))}
          {auditCursor && (
            <button onClick={loadMoreAudit} className="w-full py-2.5 text-sm text-primary-400 hover:text-primary-300 transition-colors">
              Carregar mais
            </button>
          )}
        </Panel>
      )}

      {/* Modal de ação */}
      <Modal isOpen={!!pending} onClose={() => !running && setPending(null)} title={pending?.title ?? ""} size="sm">
        {pending && (
          <div className="space-y-4">
            <p className="text-sm text-gray-300">{pending.description}</p>
            {pending.needsPayoutRef && (
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Comprovante / ID do PIX (opcional)</label>
                <input
                  value={payoutRef}
                  onChange={(e) => setPayoutRef(e.target.value)}
                  placeholder="ex.: E2E ou observação"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white placeholder-gray-600 focus:border-primary-500 outline-none"
                />
              </div>
            )}
            {pending.needsReason && (
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">
                  Motivo {pending.reasonRequired ? "" : "(opcional)"}
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  maxLength={500}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white placeholder-gray-600 focus:border-primary-500 outline-none resize-none"
                />
              </div>
            )}
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setPending(null)} disabled={running}>
                Cancelar
              </Button>
              <Button variant="primary" className="flex-1" onClick={runPending} loading={running}>
                {pending.confirmLabel}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function StatCard({
  icon: Icon,
  tint,
  label,
  value,
  sub,
}: {
  icon: typeof Users;
  tint: string;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${tint}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-lg font-bold text-white mt-0.5">{value}</p>
      <p className="text-[11px] text-gray-600 mt-0.5">{sub}</p>
    </div>
  );
}

function TopList({ title, rows }: { title: string; rows: Array<{ name: string; value: string }> }) {
  return (
    <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
      <p className="text-sm font-semibold text-white mb-3">{title}</p>
      {rows.length === 0 ? (
        <p className="text-xs text-gray-600">Sem dados ainda.</p>
      ) : (
        <div className="space-y-2">
          {rows.map((r, i) => (
            <div key={i} className="flex items-center justify-between gap-3">
              <span className="text-sm text-gray-300 truncate">
                {i + 1}. {r.name}
              </span>
              <span className="text-sm font-semibold text-white flex-shrink-0">{r.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Filters({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      <FilterPill active={value === ""} onClick={() => onChange("")} label="Todos" />
      {options.map((o) => (
        <FilterPill key={o} active={value === o} onClick={() => onChange(o)} label={STATUS_LABEL[o] ?? o} />
      ))}
    </div>
  );
}

function FilterPill({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
        active
          ? "bg-primary-500/15 text-primary-300 border-primary-500/30"
          : "bg-white/[0.02] text-gray-400 border-white/[0.06] hover:text-gray-200"
      }`}
    >
      {label}
    </button>
  );
}

function Panel({
  children,
  empty,
  loading,
}: {
  children: React.ReactNode;
  empty: boolean;
  loading: boolean;
}) {
  return (
    <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-3 sm:p-4">
      {loading ? (
        <div className="py-8 text-center text-gray-500 text-sm">Carregando...</div>
      ) : empty ? (
        <div className="py-10 text-center text-gray-500 text-sm">Nada por aqui.</div>
      ) : (
        <div className="space-y-2">{children}</div>
      )}
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] flex-wrap sm:flex-nowrap">
      {children}
    </div>
  );
}
