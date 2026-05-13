"use client";

import { useState } from "react";
import { useAuthContext } from "@/components/providers/AuthProvider";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { CREDIT_PACKS } from "@/types";
import type { CreditPack } from "@/types";
import { purchasePack } from "@/services/payment";
import { CreditCard, Check, Coins, Sparkles, ShoppingCart, Gift, Lock, Zap } from "lucide-react";
import toast from "react-hot-toast";

export default function PacksPage() {
  const { user, userData, refreshUserData } = useAuthContext();
  const [selectedPack, setSelectedPack] = useState<CreditPack | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const isTester = userData?.role === "tester";

  if (isTester) {
    return (
      <div className="relative space-y-8 pb-8">
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
              <Coins className="w-3 h-3" />
              Pacotes
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white font-heading leading-[1.1] tracking-tight">
              Recarregue suas{" "}
              <span className="gradient-text">moedas</span>
            </h1>
          </div>
        </section>

        <div className="animate-fade-in-up animation-delay-200">
          <div className="relative group bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="p-10 text-center relative">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-black/20">
                <Lock className="w-7 h-7 text-white" />
              </div>
              <h2 className="mt-5 text-xl font-bold text-white font-heading">Área indisponível no modo Tester</h2>
              <p className="mt-2 text-sm text-gray-400 max-w-md mx-auto">
                Sua conta está no modo Tester e não pode adquirir pacotes de moedas. Em caso de dúvidas, entre em contato com a equipe.
              </p>
              <div className="mt-6 inline-flex items-center gap-2 text-sm text-gray-300 bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-2">
                <Coins className="w-4 h-4 text-yellow-300" />
                <span>Saldo atual: <span className="font-semibold text-white">{userData?.credits ?? 0}</span> moedas</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleSelectPack = (packId: string) => {
    const pack = CREDIT_PACKS.find((p) => p.id === packId);
    if (!pack) return;
    setSelectedPack(pack);
    setShowConfirm(true);
  };

  const handleConfirmPurchase = async () => {
    if (!user || !selectedPack) return;
    setLoading(true);
    try {
      await purchasePack(user.uid, selectedPack.id);

      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "pack-purchase",
          email: user.email,
          userName: userData?.displayName || user.displayName || "Usuário",
          packName: selectedPack.name,
          baseCredits: selectedPack.baseCredits,
          bonusCredits: selectedPack.bonusCredits,
          totalCredits: selectedPack.totalCredits,
          price: selectedPack.price,
        }),
      });

      await refreshUserData();
      toast.success(`${selectedPack.name} adquirido! +${selectedPack.totalCredits} moedas`);
      setShowConfirm(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao processar compra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative space-y-8 pb-8">
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
            <Coins className="w-3 h-3" />
            Pacotes
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white font-heading leading-[1.1] tracking-tight">
            Recarregue suas{" "}
            <span className="gradient-text">moedas</span>
          </h1>
          <p className="text-gray-400 mt-4 text-base md:text-lg max-w-xl leading-relaxed">
            Compre moedas para usar todas as funcionalidades. Compra única, sem assinatura.
          </p>
        </div>
      </section>

      {/* Current balance */}
      <div className="animate-fade-in-up animation-delay-200">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-700 to-accent-violet glow-blue">
          <div className="absolute inset-0 bg-grid-pattern opacity-15 pointer-events-none" />
          <div className="absolute -top-20 -right-10 w-72 h-72 bg-white/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="relative p-6 md:p-8 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/15 backdrop-blur rounded-2xl flex items-center justify-center border border-white/20">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white/70 text-sm">Seu saldo atual</p>
                <p className="text-white text-xl font-bold font-heading">Moedas disponíveis</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-yellow-300" />
              <span className="text-white font-bold font-heading text-2xl">{userData?.credits ?? 0}</span>
              <span className="text-white/70 text-sm">moedas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Credit costs */}
      <div className="animate-fade-in-up animation-delay-300">
        <div className="relative group bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative p-6 md:p-8">
            <h3 className="font-semibold text-white font-heading mb-5 flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary-400" />
              Custo por funcionalidade
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { name: "Análise de currículo", cost: 1 },
                { name: "Criar currículo", cost: 1 },
                { name: "Adaptar currículo", cost: 1 },
                { name: "Carta de apresentação", cost: 1 },
                { name: "Análise de empresa", cost: 1 },
              ].map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between p-3 bg-white/[0.03] rounded-xl border border-white/[0.06] hover:border-primary-500/20 transition-colors"
                >
                  <span className="text-sm text-gray-300">{item.name}</span>
                  <div className="flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5 text-primary-400" />
                    <span className="text-sm font-bold text-primary-400">{item.cost}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Packs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch animate-fade-in-up animation-delay-400">
        {CREDIT_PACKS.map((pack) => {
          const isPopular = pack.id === "plus";
          const hasBonus = pack.bonusCredits > 0;

          return (
            <div
              key={pack.id}
              className={`relative rounded-2xl flex ${
                isPopular
                  ? "gradient-border bg-white/[0.03] backdrop-blur-xl pricing-popular"
                  : "bg-white/[0.03] backdrop-blur-xl border border-white/[0.06]"
              } hover:border-primary-500/30 hover:-translate-y-0.5 transition-all duration-300 group overflow-hidden`}
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-500/10 group-hover:bg-primary-500/20 rounded-full blur-3xl transition-all duration-500 pointer-events-none" />
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <span className="px-3 py-1 bg-gradient-to-r from-primary-500 to-accent-violet text-white text-xs font-bold rounded-full glow-blue">
                    MAIS POPULAR
                  </span>
                </div>
              )}
              <div className="relative p-6 md:p-8 flex flex-col w-full">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-violet flex items-center justify-center mb-4 shadow-lg shadow-black/20 group-hover:scale-110 transition-transform duration-300">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white font-heading">{pack.name}</h3>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-3xl font-bold gradient-text font-heading">
                      R${pack.price}
                    </span>
                    <span className="text-gray-500 text-sm">único</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <Coins className="w-4 h-4 text-primary-400" />
                    <p className="text-sm text-primary-400 font-medium">
                      {pack.totalCredits} moedas
                    </p>
                    {hasBonus && (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-md px-1.5 py-0.5">
                        <Gift className="w-3 h-3" />
                        +{pack.bonusCredits} bônus
                      </span>
                    )}
                  </div>
                </div>

                <ul className="space-y-2 mt-4 flex-1">
                  {pack.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-gray-300">
                      <div className="bg-gradient-to-br from-primary-500 to-accent-violet rounded-full p-0.5 flex-shrink-0">
                        <Check className="w-3.5 h-3.5 text-white" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSelectPack(pack.id)}
                  className={`w-full mt-4 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                    isPopular
                      ? "bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-500 hover:to-primary-400 glow-blue"
                      : "bg-white/[0.05] text-gray-300 border border-white/[0.10] hover:bg-white/[0.10] hover:text-white"
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  Comprar
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-center text-sm text-gray-500 animate-fade-in-up animation-delay-500">
        As moedas são adicionadas imediatamente após a compra e não expiram.
      </p>

      {/* Confirmation Modal */}
      <Modal isOpen={showConfirm} onClose={() => !loading && setShowConfirm(false)} title="Confirmar compra">
        {selectedPack && (
          <div className="space-y-4">
            <div className="bg-white/[0.03] rounded-xl border border-white/[0.06] p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Pacote</span>
                <span className="text-white font-semibold">{selectedPack.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Valor</span>
                <span className="text-white font-semibold">R${selectedPack.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Moedas base</span>
                <span className="text-white font-semibold">{selectedPack.baseCredits}</span>
              </div>
              {selectedPack.bonusCredits > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Moedas bônus</span>
                  <span className="text-emerald-400 font-semibold">+{selectedPack.bonusCredits}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-white/[0.06]">
                <span className="text-gray-400">Total</span>
                <span className="text-primary-400 font-semibold">+{selectedPack.totalCredits} moedas</span>
              </div>
            </div>

            <p className="text-sm text-gray-400">
              Ao confirmar, as moedas serão adicionadas imediatamente à sua conta. É uma compra única, sem assinatura recorrente.
            </p>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowConfirm(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={handleConfirmPurchase}
                disabled={loading}
              >
                {loading ? "Processando..." : "Confirmar compra"}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
