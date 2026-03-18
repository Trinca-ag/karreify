"use client";

import { useState } from "react";
import { useAuthContext } from "@/components/providers/AuthProvider";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { PLANS, PLAN_RANK } from "@/types";
import type { PlanInfo, Plan } from "@/types";
import { activatePlan } from "@/services/payment";
import { CreditCard, Check, Coins, Sparkles, ArrowUp, Lock } from "lucide-react";
import toast from "react-hot-toast";

export default function PlansPage() {
  const { user, userData, refreshUserData } = useAuthContext();
  const [selectedPlan, setSelectedPlan] = useState<PlanInfo | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const currentPlan: Plan = userData?.plan || "free";
  const currentRank = PLAN_RANK[currentPlan];

  const handleSelectPlan = (planId: string) => {
    const plan = PLANS.find((p) => p.id === planId);
    if (!plan) return;
    setSelectedPlan(plan);
    setShowConfirm(true);
  };

  const handleConfirmPlan = async () => {
    if (!user || !selectedPlan) return;
    setLoading(true);
    try {
      await activatePlan(user.uid, selectedPlan.id);

      // Send upgrade email
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "plan-upgrade",
          email: user.email,
          userName: userData?.displayName || user.displayName || "Usuário",
          planName: selectedPlan.name,
          credits: selectedPlan.credits,
          price: selectedPlan.price,
        }),
      });

      await refreshUserData();
      toast.success(`Plano ${selectedPlan.name} ativado com sucesso!`);
      setShowConfirm(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao ativar plano");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white font-heading flex items-center gap-3">
          <CreditCard className="w-7 h-7 text-primary-400" />
          Planos e Creditos
        </h1>
        <p className="text-gray-400 mt-1">Escolha o melhor plano para suas necessidades.</p>
      </div>

      {/* Current plan */}
      <div className="bg-gradient-to-r from-primary-600 to-accent-violet rounded-xl border border-white/[0.06] glow-blue">
        <div className="p-6 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-300 text-sm">Seu plano atual</p>
              <p className="text-white text-xl font-bold font-heading capitalize">{currentPlan === "free" ? "Free" : currentPlan}</p>
              {userData?.planExpiresAt && (
                <p className="text-gray-300 text-xs mt-0.5">
                  Expira em {new Date(userData.planExpiresAt).toLocaleDateString("pt-BR")}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-yellow-300" />
            <span className="text-white font-bold font-heading text-xl">{userData?.credits ?? 0}</span>
            <span className="text-gray-300 text-sm">creditos</span>
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
              { name: "Análise LinkedIn", cost: 1 },
              { name: "Criar currículo", cost: 1 },
              { name: "Adaptar currículo", cost: 1 },
              { name: "Editor IA", cost: 1 },
              { name: "Chat", cost: 1 },
              { name: "Roadmap", cost: 20 },
            ].map((item) => (
              <div key={item.name} className="flex items-center justify-between p-3 bg-white/[0.03] rounded-lg border border-white/[0.06]">
                <span className="text-sm text-gray-300">{item.name}</span>
                <span className="text-sm font-bold text-primary-400">{item.cost}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map((plan) => {
          const isCurrentPlan = currentPlan === plan.id;
          const isUpgrade = PLAN_RANK[plan.id] > currentRank;
          const isDowngrade = PLAN_RANK[plan.id] < currentRank;
          const isPopular = plan.id === "intermediate";

          return (
            <div
              key={plan.id}
              className={`relative rounded-xl ${
                isPopular
                  ? "gradient-border glass-card pricing-popular"
                  : isCurrentPlan
                  ? "bg-primary-500/10 border border-primary-500/20 rounded-xl"
                  : isDowngrade
                  ? "bg-white/[0.02] backdrop-blur-xl border border-white/[0.04] rounded-xl opacity-60"
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
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white font-heading">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-3xl font-bold gradient-text font-heading">
                      R${plan.price}
                    </span>
                    <span className="text-gray-500">/mes</span>
                  </div>
                  <p className="text-sm text-primary-400 font-medium mt-1">
                    {plan.credits} creditos
                  </p>
                </div>

                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-gray-300">
                      <div className="bg-primary-500/10 rounded-full p-0.5 flex-shrink-0">
                        <Check className="w-3.5 h-3.5 text-primary-400" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>

                {isCurrentPlan ? (
                  <Button className="w-full" variant="secondary" disabled>
                    Plano atual
                  </Button>
                ) : isDowngrade ? (
                  <Button className="w-full" variant="outline" disabled>
                    <Lock className="w-4 h-4 mr-1.5" />
                    Plano inferior
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    variant={isPopular ? "primary" : "outline"}
                    onClick={() => handleSelectPlan(plan.id)}
                  >
                    <ArrowUp className="w-4 h-4 mr-1.5" />
                    {isUpgrade && currentRank > 0 ? "Fazer upgrade" : "Assinar"}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-center text-sm text-gray-500">
        Os créditos são adicionados imediatamente ao ativar o plano.
      </p>

      {/* Confirmation Modal */}
      <Modal isOpen={showConfirm} onClose={() => !loading && setShowConfirm(false)} title="Confirmar upgrade">
        {selectedPlan && (
          <div className="space-y-4">
            <div className="bg-white/[0.03] rounded-lg border border-white/[0.06] p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Plano</span>
                <span className="text-white font-semibold">{selectedPlan.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Valor</span>
                <span className="text-white font-semibold">R${selectedPlan.price}/mês</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Créditos</span>
                <span className="text-primary-400 font-semibold">+{selectedPlan.credits} créditos</span>
              </div>
            </div>

            <p className="text-sm text-gray-400">
              Ao confirmar, seu plano será atualizado e os créditos serão adicionados à sua conta imediatamente.
              O plano terá validade de 30 dias.
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
                onClick={handleConfirmPlan}
                disabled={loading}
              >
                {loading ? "Ativando..." : "Confirmar upgrade"}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
