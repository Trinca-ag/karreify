"use client";

import { useCallback, useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { Receipt, Coins, ShoppingBag, RotateCcw } from "lucide-react";
import toast from "react-hot-toast";
import { formatCents } from "@/utils/helpers";
import { fetchPurchases, requestRefund, type PurchaseRecord } from "@/services/purchases";

const PAYMENT_STATUS_META: Record<string, { label: string; cls: string }> = {
  completed: { label: "Pago", cls: "text-emerald-300 bg-emerald-500/10 border-emerald-500/20" },
  pending: { label: "Pendente", cls: "text-amber-300 bg-amber-500/10 border-amber-500/20" },
  failed: { label: "Falhou", cls: "text-red-300 bg-red-500/10 border-red-500/20" },
  refunded: { label: "Reembolsado", cls: "text-gray-300 bg-gray-500/10 border-gray-500/20" },
  disputed: { label: "Em disputa", cls: "text-orange-300 bg-orange-500/10 border-orange-500/20" },
};

const REFUND_STATUS_META: Record<string, { label: string; cls: string }> = {
  requested: { label: "Reembolso em análise", cls: "text-amber-300 bg-amber-500/10 border-amber-500/20" },
  approved: { label: "Reembolso aprovado", cls: "text-sky-300 bg-sky-500/10 border-sky-500/20" },
  processed: { label: "Reembolsado", cls: "text-emerald-300 bg-emerald-500/10 border-emerald-500/20" },
  rejected: { label: "Reembolso recusado", cls: "text-red-300 bg-red-500/10 border-red-500/20" },
};

function formatDateTime(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ComprasPage() {
  const [purchases, setPurchases] = useState<PurchaseRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refundTarget, setRefundTarget] = useState<PurchaseRecord | null>(null);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    try {
      const list = await fetchPurchases();
      setPurchases(list);
    } catch {
      toast.error("Não foi possível carregar suas compras.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleRefund = async () => {
    if (!refundTarget) return;
    setSubmitting(true);
    try {
      await requestRefund(refundTarget.id, reason.trim() || undefined);
      toast.success("Solicitação de reembolso enviada!");
      setRefundTarget(null);
      setReason("");
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao solicitar reembolso.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-xl">
        <div className="absolute -top-24 -left-16 w-80 h-80 bg-primary-500/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative p-8 md:p-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-xs font-medium text-primary-300 mb-4">
            <ShoppingBag className="w-3 h-3" />
            Compras
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white font-heading leading-tight tracking-tight">
            Histórico de <span className="gradient-text">compras</span>
          </h1>
          <p className="text-gray-400 mt-3 text-base max-w-xl leading-relaxed">
            Acompanhe suas compras de moedas. O reembolso fica disponível por até 7 dias e
            enquanto menos de 30% dos créditos da compra tiverem sido usados.
          </p>
        </div>
      </section>

      <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06]">
        <div className="px-6 py-4 border-b border-white/[0.06]">
          <h2 className="font-semibold text-white font-heading flex items-center gap-2">
            <Receipt className="w-5 h-5 text-primary-400" />
            Suas compras
          </h2>
        </div>
        <div className="p-4 sm:p-6">
          {loading ? (
            <div className="py-8 text-center text-gray-500 text-sm">Carregando...</div>
          ) : purchases.length === 0 ? (
            <div className="py-10 text-center">
              <ShoppingBag className="w-10 h-10 text-gray-700 mx-auto mb-3" />
              <p className="text-sm text-gray-500">Você ainda não fez nenhuma compra.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {purchases.map((p) => {
                const pay = PAYMENT_STATUS_META[p.status] ?? {
                  label: p.status,
                  cls: "text-gray-300 bg-gray-500/10 border-gray-500/20",
                };
                const refund = p.refundStatus ? REFUND_STATUS_META[p.refundStatus] : null;
                return (
                  <div
                    key={p.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]"
                  >
                    <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                      <Coins className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-white">{p.packName}</p>
                        <span
                          className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${pay.cls}`}
                        >
                          {pay.label}
                        </span>
                        {refund && (
                          <span
                            className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${refund.cls}`}
                          >
                            {refund.label}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {formatCents(p.amountCents)} · {p.creditsGranted} moedas ·{" "}
                        {formatDateTime(p.createdAt)}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      {p.refundEligible ? (
                        <Button
                          variant="outline"
                          onClick={() => {
                            setReason("");
                            setRefundTarget(p);
                          }}
                          className="!py-2 text-sm"
                        >
                          <RotateCcw className="w-4 h-4 mr-1.5" />
                          Solicitar reembolso
                        </Button>
                      ) : !p.refundStatus && p.status === "completed" ? (
                        <span className="text-xs text-gray-600">Reembolso indisponível</span>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Confirmação de reembolso */}
      <Modal
        isOpen={!!refundTarget}
        onClose={() => !submitting && setRefundTarget(null)}
        title="Solicitar reembolso"
        size="sm"
      >
        {refundTarget && (
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/15">
              <RotateCcw className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-300">
                Você está solicitando o reembolso da compra do{" "}
                <strong className="text-white">{refundTarget.packName}</strong> (
                {formatCents(refundTarget.amountCents)}). A solicitação passará por análise
                administrativa. Os créditos restantes desta compra serão removidos se aprovada.
              </p>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Motivo (opcional)</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                maxLength={500}
                placeholder="Conte brevemente o motivo do reembolso"
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white placeholder-gray-600 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all resize-none"
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setRefundTarget(null)}
                disabled={submitting}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={handleRefund}
                loading={submitting}
              >
                Confirmar
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
