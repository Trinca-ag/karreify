"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthContext } from "@/components/providers/AuthProvider";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import ReferralCard from "@/components/referral/ReferralCard";
import {
  Wallet,
  Clock,
  TrendingUp,
  ArrowDownToLine,
  Repeat,
  Coins,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownLeft,
  Gift,
  RotateCcw,
  Banknote,
  Send,
  CheckCircle2,
  XCircle,
  Hourglass,
  PieChart,
  BarChart3,
} from "lucide-react";
import toast from "react-hot-toast";
import { formatCents, formatCurrency } from "@/utils/helpers";
import { CREDIT_PACKS, COMMISSION_BY_PACK_CENTS, COMMISSION_HOLD_DAYS } from "@/types";
import {
  fetchWalletData,
  convertWalletToCredits,
  fetchWithdrawals,
  requestWithdrawal,
  fetchMyCommissions,
  type WalletData,
  type WithdrawalRecord,
  type CommissionRecord,
} from "@/services/wallet";

type Tone = "in" | "out" | "neutral";

const MOVEMENT_META: Record<string, { label: string; tone: Tone }> = {
  "commission-pending": { label: "Comissão recebida", tone: "in" },
  "commission-released": { label: "Comissão liberada", tone: "neutral" },
  "commission-clawback": { label: "Estorno de comissão", tone: "out" },
  "withdrawal-reserve": { label: "Saque solicitado", tone: "out" },
  "withdrawal-refund": { label: "Saque devolvido", tone: "in" },
  "credit-conversion": { label: "Conversão em créditos", tone: "out" },
};

const WITHDRAWAL_STATUS_META: Record<string, { label: string; cls: string }> = {
  requested: { label: "Em análise", cls: "text-amber-300 bg-amber-500/10 border-amber-500/20" },
  approved: { label: "Aprovado", cls: "text-sky-300 bg-sky-500/10 border-sky-500/20" },
  paid: { label: "Pago", cls: "text-emerald-300 bg-emerald-500/10 border-emerald-500/20" },
  rejected: { label: "Recusado", cls: "text-red-300 bg-red-500/10 border-red-500/20" },
};

const PIX_TYPE_LABELS: Record<string, string> = {
  cpf: "CPF",
  cnpj: "CNPJ",
  email: "E-mail",
  phone: "Telefone",
  random: "Aleatória",
};

const COMMISSION_STATUS_META: Record<string, { label: string; cls: string }> = {
  held: { label: "Retida", cls: "text-amber-300 bg-amber-500/10 border-amber-500/20" },
  released: { label: "Disponível", cls: "text-emerald-300 bg-emerald-500/10 border-emerald-500/20" },
  reversed: { label: "Estornada", cls: "text-red-300 bg-red-500/10 border-red-500/20" },
  cancelled: { label: "Cancelada", cls: "text-gray-300 bg-gray-500/10 border-gray-500/20" },
};

function formatHoldDate(ms: number | null): string {
  if (!ms) return "";
  return new Date(ms).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function withdrawalStatusIcon(status: string) {
  switch (status) {
    case "paid":
      return Banknote;
    case "approved":
      return CheckCircle2;
    case "rejected":
      return XCircle;
    default:
      return Hourglass;
  }
}

function movementIcon(type: string) {
  switch (type) {
    case "commission-pending":
      return Gift;
    case "commission-released":
      return TrendingUp;
    case "commission-clawback":
      return RotateCcw;
    case "withdrawal-reserve":
      return ArrowUpRight;
    case "withdrawal-refund":
      return ArrowDownLeft;
    case "credit-conversion":
      return Coins;
    default:
      return Wallet;
  }
}

function formatDateTime(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateShort(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

function packName(packId: string): string {
  return CREDIT_PACKS.find((p) => p.id === packId)?.name ?? packId;
}

const scrollTo = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

// ── Gráfico donut (SVG puro) ───────────────────────────
function Donut({
  segments,
  centerLabel,
  centerValue,
}: {
  segments: Array<{ label: string; value: number; color: string }>;
  centerLabel: string;
  centerValue: string;
}) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  const radius = 62;
  const stroke = 18;
  const circ = 2 * Math.PI * radius;
  let offset = 0;
  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative w-40 h-40 flex-shrink-0">
        <svg viewBox="0 0 160 160" className="w-40 h-40 -rotate-90">
          <circle cx="80" cy="80" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
          {total > 0 &&
            segments.map((s, i) => {
              const len = (s.value / total) * circ;
              const node = (
                <circle
                  key={i}
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={stroke}
                  strokeDasharray={`${len} ${circ - len}`}
                  strokeDashoffset={-offset}
                  strokeLinecap={len < circ ? "round" : "butt"}
                />
              );
              offset += len;
              return node;
            })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-[11px] text-gray-500">{centerLabel}</span>
          <span className="text-base font-bold text-white">{centerValue}</span>
        </div>
      </div>
      <div className="space-y-2.5 w-full">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-sm text-gray-300">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
              {s.label}
            </span>
            <span className="text-sm font-semibold text-white">{formatCents(s.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Gráfico de barras mensais (SVG/CSS puro) ───────────
function MonthlyBars({ commissions }: { commissions: CommissionRecord[] }) {
  const now = new Date();
  const buckets: Array<{ label: string; cents: number }> = [];
  const idx = new Map<string, number>();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    idx.set(key, buckets.length);
    buckets.push({ label: d.toLocaleDateString("pt-BR", { month: "short" }), cents: 0 });
  }
  for (const c of commissions) {
    if (!c.createdAt || c.status === "reversed" || c.status === "cancelled") continue;
    const d = new Date(c.createdAt);
    const pos = idx.get(`${d.getFullYear()}-${d.getMonth()}`);
    if (pos != null) buckets[pos].cents += c.amountCents;
  }
  const max = Math.max(...buckets.map((b) => b.cents), 1);
  const hasData = buckets.some((b) => b.cents > 0);

  return (
    <div>
      <div className="flex items-end justify-between gap-2 h-40">
        {buckets.map((b, i) => (
          <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1.5 h-full">
            <span className="text-[10px] text-gray-400 h-3">
              {b.cents > 0 ? formatCents(b.cents) : ""}
            </span>
            <div
              className="w-full rounded-t-lg bg-gradient-to-t from-primary-600 to-accent-violet transition-all duration-500"
              style={{ height: `${b.cents > 0 ? Math.max(4, (b.cents / max) * 100) : 1.5}%` }}
            />
            <span className="text-[10px] text-gray-500 uppercase tracking-wide">{b.label}</span>
          </div>
        ))}
      </div>
      {!hasData && (
        <p className="text-xs text-gray-600 text-center mt-3">
          Sem comissões nos últimos meses ainda.
        </p>
      )}
    </div>
  );
}

export default function CarteiraPage() {
  const { refreshUserData } = useAuthContext();
  const [data, setData] = useState<WalletData | null>(null);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRecord[]>([]);
  const [commissions, setCommissions] = useState<CommissionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [convertInput, setConvertInput] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [converting, setConverting] = useState(false);
  const [wAmount, setWAmount] = useState("");
  const [wPixKey, setWPixKey] = useState("");
  const [wPixType, setWPixType] = useState("cpf");
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    try {
      const [d, w, c] = await Promise.all([
        fetchWalletData(),
        fetchWithdrawals(),
        fetchMyCommissions(),
      ]);
      setData(d);
      setWithdrawals(w);
      setCommissions(c);
    } catch {
      toast.error("Não foi possível carregar sua carteira.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const wallet = data?.wallet;
  const centsPerCredit = data?.config.centsPerCredit ?? 300;
  const balanceCents = wallet?.balanceCents ?? 0;
  const pendingCents = wallet?.pendingCents ?? 0;
  const isNegative = balanceCents < 0;
  const maxConvertible = Math.max(0, Math.floor(balanceCents / centsPerCredit));

  const requestedCredits = (() => {
    const n = parseInt(convertInput, 10);
    return Number.isFinite(n) && n > 0 ? n : 0;
  })();
  const costCents = requestedCredits * centsPerCredit;
  const canConvert = requestedCredits >= 1 && requestedCredits <= maxConvertible && !converting;

  const handleConvert = async () => {
    if (!canConvert) return;
    setConverting(true);
    try {
      await convertWalletToCredits(requestedCredits);
      toast.success(
        `${requestedCredits} crédito${requestedCredits === 1 ? "" : "s"} adicionado${requestedCredits === 1 ? "" : "s"}!`
      );
      setConvertInput("");
      setShowConfirm(false);
      await Promise.all([load(), refreshUserData()]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao converter saldo.");
    } finally {
      setConverting(false);
    }
  };

  const withdrawMin = data?.config.withdrawMinCents ?? 3000;
  const withdrawMax = data?.config.withdrawMaxCents ?? 100000;
  const missingForMin = Math.max(0, withdrawMin - balanceCents);
  const maxWithdrawCents = Math.min(balanceCents, withdrawMax);
  const parsedAmountCents = (() => {
    const v = parseFloat(wAmount);
    return Number.isFinite(v) ? Math.round(v * 100) : 0;
  })();
  const withdrawValid =
    parsedAmountCents >= withdrawMin &&
    parsedAmountCents <= maxWithdrawCents &&
    wPixKey.trim().length > 0 &&
    !submitting;

  const handleWithdraw = async () => {
    if (!withdrawValid) return;
    setSubmitting(true);
    try {
      await requestWithdrawal({
        amountCents: parsedAmountCents,
        pixKey: wPixKey.trim(),
        pixKeyType: wPixType,
      });
      toast.success("Saque solicitado! Acompanhe o status abaixo.");
      setWAmount("");
      setWPixKey("");
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao solicitar saque.");
    } finally {
      setSubmitting(false);
    }
  };

  const miniStats = [
    { label: "Pendente", value: pendingCents, icon: Clock, tint: "text-amber-400 bg-amber-500/10" },
    { label: "Total em comissões", value: wallet?.totalEarnedCents ?? 0, icon: TrendingUp, tint: "text-primary-400 bg-primary-500/10" },
    { label: "Já sacado", value: wallet?.totalWithdrawnCents ?? 0, icon: ArrowDownToLine, tint: "text-sky-400 bg-sky-500/10" },
    { label: "Convertido", value: wallet?.totalConvertedCents ?? 0, icon: Repeat, tint: "text-violet-400 bg-violet-500/10" },
  ];

  return (
    <div className="space-y-6">
      {/* ── Hero: saldo disponível em destaque ── */}
      <section className="relative overflow-hidden rounded-3xl border border-emerald-500/15 bg-gradient-to-br from-emerald-500/[0.10] via-white/[0.02] to-primary-500/[0.08] backdrop-blur-xl">
        <div className="absolute -top-24 -left-16 w-80 h-80 bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none animate-pulse-glow" />
        <div className="absolute -bottom-32 -right-10 w-96 h-96 bg-primary-500/20 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
        <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
        <div className="relative p-7 md:p-10 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 items-center">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-xs font-medium text-emerald-300 mb-4">
              <Wallet className="w-3 h-3" />
              Carteira
            </div>
            <p className="text-sm text-emerald-200/70 font-medium">Saldo disponível para saque</p>
            <p className={`mt-1 text-4xl md:text-5xl font-bold tracking-tight ${isNegative ? "text-red-400" : "text-white"}`}>
              {loading ? "—" : formatCents(balanceCents)}
            </p>
            <div className="flex items-center gap-4 mt-3 text-sm">
              <span className="text-gray-400">
                <Clock className="w-3.5 h-3.5 inline mr-1 text-amber-400" />
                {formatCents(pendingCents)} em liberação
              </span>
              <span className="text-gray-400">
                <TrendingUp className="w-3.5 h-3.5 inline mr-1 text-primary-400" />
                {formatCents(wallet?.totalEarnedCents ?? 0)} no total
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-3 w-full lg:w-auto">
            <Button
              onClick={() => scrollTo("saque")}
              disabled={balanceCents < withdrawMin}
              className="glow-blue"
            >
              <Banknote className="w-4 h-4 mr-1.5" />
              Sacar via PIX
            </Button>
            <Button
              variant="outline"
              onClick={() => scrollTo("converter")}
              disabled={maxConvertible < 1}
            >
              <Coins className="w-4 h-4 mr-1.5" />
              Converter em créditos
            </Button>
          </div>
        </div>
      </section>

      {isNegative && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/25">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-200">Saldo negativo</p>
            <p className="text-xs text-red-200/80 mt-0.5">
              Seu saldo está negativo (provavelmente por um estorno de reembolso). Saques e
              conversões ficam bloqueados até o saldo voltar a ser positivo.
            </p>
          </div>
        </div>
      )}

      {/* ── Mini-stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {miniStats.map((s) => (
          <div
            key={s.label}
            className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] p-5 hover:border-primary-500/30 transition-all duration-300"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.tint}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <p className="text-xs text-gray-500 leading-snug">{s.label}</p>
            <p className="mt-1 text-lg font-bold text-white">{loading ? "—" : formatCents(s.value)}</p>
          </div>
        ))}
      </div>

      {/* ── Gráficos ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06]">
          <div className="px-6 py-4 border-b border-white/[0.06]">
            <h2 className="font-semibold text-white font-heading flex items-center gap-2">
              <PieChart className="w-5 h-5 text-primary-400" />
              Composição da carteira
            </h2>
          </div>
          <div className="p-6">
            <Donut
              segments={[
                { label: "Disponível", value: Math.max(0, balanceCents), color: "#34d399" },
                { label: "Pendente (8 dias)", value: pendingCents, color: "#fbbf24" },
              ]}
              centerLabel="Em carteira"
              centerValue={formatCents(Math.max(0, balanceCents) + pendingCents)}
            />
          </div>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06]">
          <div className="px-6 py-4 border-b border-white/[0.06]">
            <h2 className="font-semibold text-white font-heading flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary-400" />
              Comissões por mês
            </h2>
          </div>
          <div className="p-6">
            <MonthlyBars commissions={commissions} />
          </div>
        </div>
      </div>

      {/* ── Link de indicação (compartilhamento) ── */}
      <ReferralCard />

      {/* ── Tabela informativa: comissão por pacote ── */}
      <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06]">
        <div className="px-6 py-4 border-b border-white/[0.06]">
          <h2 className="font-semibold text-white font-heading flex items-center gap-2">
            <Gift className="w-5 h-5 text-emerald-400" />
            Quanto você ganha por indicação
          </h2>
        </div>
        <div className="p-2 sm:p-4 overflow-x-auto">
          <table className="w-full text-sm min-w-[420px]">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-gray-500 border-b border-white/[0.06]">
                <th className="py-3 px-3 font-semibold">Pacote comprado pelo indicado</th>
                <th className="py-3 px-3 font-semibold text-right">Valor da compra</th>
                <th className="py-3 px-3 font-semibold text-right">Você recebe</th>
              </tr>
            </thead>
            <tbody>
              {CREDIT_PACKS.filter((p) => (COMMISSION_BY_PACK_CENTS[p.id] ?? 0) > 0).map((p) => (
                <tr key={p.id} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-3 text-gray-200 font-medium">{p.name}</td>
                  <td className="py-3 px-3 text-right text-gray-400 whitespace-nowrap">
                    {formatCurrency(p.price)}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-emerald-400 whitespace-nowrap">
                    {formatCents(COMMISSION_BY_PACK_CENTS[p.id])}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="px-6 pb-5 pt-1 text-xs text-gray-500 leading-relaxed">
          Você ganha essa comissão <strong className="text-gray-300">em dinheiro</strong> toda vez que
          alguém que se cadastrou pelo seu link compra um pacote. O valor fica retido por{" "}
          {COMMISSION_HOLD_DAYS} dias e depois é liberado para saque via PIX.
        </p>
      </div>

      {/* ── Conversão em créditos ── */}
      <div id="converter" className="scroll-mt-20 bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06]">
        <div className="px-6 py-4 border-b border-white/[0.06]">
          <h2 className="font-semibold text-white font-heading flex items-center gap-2">
            <Coins className="w-5 h-5 text-primary-400" />
            Converter saldo em créditos
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-400">
            Cada crédito custa <strong className="text-white">{formatCents(centsPerCredit)}</strong>.
            Você pode converter até <strong className="text-white">{maxConvertible}</strong> crédito
            {maxConvertible === 1 ? "" : "s"} com o saldo disponível. Conversões são{" "}
            <strong className="text-white">irreversíveis</strong>.
          </p>

          <div className="flex flex-col sm:flex-row sm:items-end gap-3">
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1.5">Quantidade de créditos</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={1}
                  max={maxConvertible}
                  value={convertInput}
                  onChange={(e) => setConvertInput(e.target.value)}
                  placeholder="0"
                  disabled={maxConvertible < 1}
                  className="flex-1 min-w-0 px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white placeholder-gray-600 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setConvertInput(String(maxConvertible))}
                  disabled={maxConvertible < 1}
                  className="px-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-gray-300 hover:bg-white/[0.08] transition-colors disabled:opacity-50"
                >
                  Tudo
                </button>
              </div>
            </div>
            <Button onClick={() => setShowConfirm(true)} disabled={!canConvert} className="glow-blue sm:w-auto">
              Converter
            </Button>
          </div>

          {requestedCredits > 0 && (
            <p className="text-sm text-gray-400">
              Você vai converter <strong className="text-white">{formatCents(costCents)}</strong> em{" "}
              <strong className="text-white">{requestedCredits}</strong> crédito
              {requestedCredits === 1 ? "" : "s"}.
              {requestedCredits > maxConvertible && <span className="text-red-400"> Saldo insuficiente.</span>}
            </p>
          )}
          {maxConvertible < 1 && !loading && (
            <p className="text-xs text-gray-500">
              Saldo insuficiente para conversão (mínimo {formatCents(centsPerCredit)}).
            </p>
          )}
        </div>
      </div>

      {/* ── Saque via PIX ── */}
      <div id="saque" className="scroll-mt-20 bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06]">
        <div className="px-6 py-4 border-b border-white/[0.06]">
          <h2 className="font-semibold text-white font-heading flex items-center gap-2">
            <Banknote className="w-5 h-5 text-emerald-400" />
            Saque via PIX
          </h2>
        </div>
        <div className="p-6 space-y-5">
          <p className="text-sm text-gray-400">
            Saque mínimo {formatCents(withdrawMin)} · máximo {formatCents(withdrawMax)} · 1 solicitação
            por dia. O valor é reservado do saldo na solicitação e pago manualmente após aprovação.
          </p>

          {balanceCents < withdrawMin ? (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <Hourglass className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-300">
                Você precisa de pelo menos {formatCents(withdrawMin)} disponíveis para sacar.
                {missingForMin > 0 && (
                  <>
                    {" "}
                    Faltam <strong className="text-white">{formatCents(missingForMin)}</strong>.
                  </>
                )}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">Valor (R$)</label>
                  <input
                    type="number"
                    min={withdrawMin / 100}
                    max={maxWithdrawCents / 100}
                    step="0.01"
                    value={wAmount}
                    onChange={(e) => setWAmount(e.target.value)}
                    placeholder="30,00"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white placeholder-gray-600 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">Tipo de chave</label>
                  <select
                    value={wPixType}
                    onChange={(e) => setWPixType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all"
                  >
                    {Object.entries(PIX_TYPE_LABELS).map(([v, l]) => (
                      <option key={v} value={v} className="bg-dark-800">
                        {l}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">Chave PIX</label>
                  <input
                    type="text"
                    value={wPixKey}
                    onChange={(e) => setWPixKey(e.target.value)}
                    placeholder="Sua chave PIX"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white placeholder-gray-600 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={() => setWAmount((maxWithdrawCents / 100).toFixed(2))}
                  className="text-xs text-primary-400 hover:text-primary-300 transition-colors"
                >
                  Sacar tudo ({formatCents(maxWithdrawCents)})
                </button>
                <Button onClick={handleWithdraw} disabled={!withdrawValid} loading={submitting} className="glow-blue">
                  <Send className="w-4 h-4 mr-1.5" />
                  Solicitar saque
                </Button>
              </div>
            </div>
          )}

          {withdrawals.length > 0 && (
            <div className="pt-2 space-y-2">
              <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Histórico de saques</p>
              {withdrawals.map((w) => {
                const meta = WITHDRAWAL_STATUS_META[w.status] ?? WITHDRAWAL_STATUS_META.requested;
                const Icon = withdrawalStatusIcon(w.status);
                return (
                  <div
                    key={w.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]"
                  >
                    <div className="w-9 h-9 rounded-lg bg-white/[0.05] flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium">{formatCents(w.amountCents)}</p>
                      <p className="text-xs text-gray-500 truncate">
                        {PIX_TYPE_LABELS[w.pixKeyType] ?? w.pixKeyType} · {formatDateTime(w.requestedAt)}
                        {w.status === "rejected" && w.rejectReason ? ` · ${w.rejectReason}` : ""}
                      </p>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border flex-shrink-0 ${meta.cls}`}>
                      {meta.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Histórico de comissões ── */}
      {commissions.length > 0 && (
        <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06]">
          <div className="px-6 py-4 border-b border-white/[0.06]">
            <h2 className="font-semibold text-white font-heading flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary-400" />
              Histórico de comissões
            </h2>
          </div>
          <div className="p-2 sm:p-4 overflow-x-auto">
            <table className="w-full text-sm min-w-[580px]">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-gray-500 border-b border-white/[0.06]">
                  <th className="py-3 px-3 font-semibold">Data</th>
                  <th className="py-3 px-3 font-semibold">Comprador</th>
                  <th className="py-3 px-3 font-semibold">Pacote</th>
                  <th className="py-3 px-3 font-semibold text-right">Valor</th>
                  <th className="py-3 px-3 font-semibold">Status</th>
                  <th className="py-3 px-3 font-semibold">Liberação</th>
                </tr>
              </thead>
              <tbody>
                {commissions.map((c) => {
                  const meta = COMMISSION_STATUS_META[c.status] ?? {
                    label: c.status,
                    cls: "text-gray-300 bg-gray-500/10 border-gray-500/20",
                  };
                  const release =
                    c.status === "held" && c.holdUntil
                      ? formatHoldDate(c.holdUntil)
                      : c.status === "released" && c.releasedAt
                        ? formatDateShort(c.releasedAt)
                        : "—";
                  return (
                    <tr
                      key={c.id}
                      className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="py-3 px-3 text-gray-400 whitespace-nowrap">
                        {formatDateShort(c.createdAt)}
                      </td>
                      <td className="py-3 px-3 text-gray-200 font-medium">{c.maskedBuyer}</td>
                      <td className="py-3 px-3 text-gray-400">{packName(c.packId)}</td>
                      <td className="py-3 px-3 text-right font-semibold text-white whitespace-nowrap">
                        {formatCents(c.amountCents)}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`text-[11px] font-medium px-2 py-0.5 rounded-full border whitespace-nowrap ${meta.cls}`}
                        >
                          {meta.label}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-gray-400 whitespace-nowrap">{release}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Movimentações ── */}
      <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06]">
        <div className="px-6 py-4 border-b border-white/[0.06]">
          <h2 className="font-semibold text-white font-heading flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary-400" />
            Movimentações
          </h2>
        </div>
        <div className="p-4 sm:p-6">
          {loading ? (
            <div className="py-8 text-center text-gray-500 text-sm">Carregando...</div>
          ) : !data || data.transactions.length === 0 ? (
            <div className="py-10 text-center">
              <Wallet className="w-10 h-10 text-gray-700 mx-auto mb-3" />
              <p className="text-sm text-gray-500">Nenhuma movimentação ainda.</p>
              <p className="text-xs text-gray-600 mt-1">
                Indique amigos e ganhe comissões quando eles comprarem pacotes.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {data.transactions.map((m) => {
                const meta = MOVEMENT_META[m.type] ?? { label: m.description || m.type, tone: "neutral" as Tone };
                const Icon = movementIcon(m.type);
                const abs = Math.abs(m.amountCents);
                const sign = meta.tone === "out" ? "−" : meta.tone === "in" ? "+" : "";
                const valueColor =
                  meta.tone === "out"
                    ? "text-red-400"
                    : meta.tone === "in"
                      ? "text-emerald-400"
                      : "text-gray-300";
                return (
                  <div
                    key={m.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]"
                  >
                    <div className="w-9 h-9 rounded-lg bg-white/[0.05] flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium truncate">{meta.label}</p>
                      <p className="text-xs text-gray-500">{formatDateTime(m.createdAt)}</p>
                    </div>
                    <span className={`text-sm font-semibold flex-shrink-0 ${valueColor}`}>
                      {sign} {formatCents(abs)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Confirmação de conversão */}
      <Modal
        isOpen={showConfirm}
        onClose={() => !converting && setShowConfirm(false)}
        title="Confirmar conversão"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-primary-500/5 border border-primary-500/15">
            <Coins className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-300">
              Você vai converter <strong className="text-white">{formatCents(costCents)}</strong> do seu
              saldo em <strong className="text-white">{requestedCredits}</strong> crédito
              {requestedCredits === 1 ? "" : "s"}. Esta ação é{" "}
              <strong className="text-white">irreversível</strong> — créditos não voltam a virar dinheiro.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setShowConfirm(false)} disabled={converting}>
              Cancelar
            </Button>
            <Button variant="primary" className="flex-1" onClick={handleConvert} loading={converting}>
              Confirmar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
