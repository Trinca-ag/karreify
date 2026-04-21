"use client";

import { useState } from "react";
import { useAuthContext } from "@/components/providers/AuthProvider";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { CREDIT_PACKS } from "@/types";
import type { CreditPack } from "@/types";
import { purchasePack } from "@/services/payment";
import { CreditCard, Check, Coins, Sparkles, ShoppingCart, Gift, Lock } from "lucide-react";
import toast from "react-hot-toast";

export default function PacksPage() {
  const { user, userData, refreshUserData } = useAuthContext();
  const [selectedPack, setSelectedPack] = useState<CreditPack | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const isTester = userData?.role === "tester";

  if (isTester) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white font-heading flex items-center gap-3">
            <CreditCard className="w-7 h-7 text-primary-400" />
            Pacotes de Moedas
          </h1>
        </div>

        <div className="glass-card rounded-xl p-10 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
            <Lock className="w-7 h-7 text-violet-300" />
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white font-heading flex items-center gap-3">
          <CreditCard className="w-7 h-7 text-primary-400" />
          Pacotes de Moedas
        </h1>
        <p className="text-gray-400 mt-1">Compre moedas para usar todas as funcionalidades. Compra única, sem assinatura.</p>
      </div>

      {/* Current balance */}
      <div className="bg-gradient-to-r from-primary-600 to-accent-violet rounded-xl border border-white/[0.06] glow-blue">
        <div className="p-6 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-300 text-sm">Seu saldo atual</p>
              <p className="text-white text-xl font-bold font-heading">Moedas disponíveis</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-yellow-300" />
            <span className="text-white font-bold font-heading text-xl">{userData?.credits ?? 0}</span>
            <span className="text-gray-300 text-sm">moedas</span>
          </div>
        </div>
      </div>

      {/* Credit costs */}
      <div className="glass-card rounded-xl">
        <div className="p-6">
          <h3 className="font-semibold text-white font-heading mb-4">Custo por funcionalidade</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { name: "Análise de currículo", cost: 1 },
              { name: "Criar currículo", cost: 1 },
              { name: "Adaptar currículo", cost: 1 },
              { name: "Carta de apresentação", cost: 1 },
              { name: "Análise de empresa", cost: 1 },
            ].map((item) => (
              <div key={item.name} className="flex items-center justify-between p-3 bg-white/[0.03] rounded-lg border border-white/[0.06]">
                <span className="text-sm text-gray-300">{item.name}</span>
                <span className="text-sm font-bold text-primary-400">{item.cost}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Packs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {CREDIT_PACKS.map((pack) => {
          const isPopular = pack.id === "plus";
          const hasBonus = pack.bonusCredits > 0;

          return (
            <div
              key={pack.id}
              className={`relative rounded-xl flex ${
                isPopular
                  ? "gradient-border glass-card pricing-popular"
                  : "bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-xl"
              }`}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <span className="px-3 py-1 bg-gradient-to-r from-primary-500 to-accent-violet text-white text-xs font-bold rounded-full glow-blue">
                    MAIS POPULAR
                  </span>
                </div>
              )}
              <div className="p-6 flex flex-col w-full">
                <div>
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
                      <div className="bg-primary-500/10 rounded-full p-0.5 flex-shrink-0">
                        <Check className="w-3.5 h-3.5 text-primary-400" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full mt-4"
                  variant={isPopular ? "primary" : "outline"}
                  onClick={() => handleSelectPack(pack.id)}
                >
                  <ShoppingCart className="w-4 h-4 mr-1.5" />
                  Comprar
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-center text-sm text-gray-500">
        As moedas são adicionadas imediatamente após a compra e não expiram.
      </p>

      {/* Confirmation Modal */}
      <Modal isOpen={showConfirm} onClose={() => !loading && setShowConfirm(false)} title="Confirmar compra">
        {selectedPack && (
          <div className="space-y-4">
            <div className="bg-white/[0.03] rounded-lg border border-white/[0.06] p-4 space-y-2">
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
