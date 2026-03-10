"use client";

import { useAuthContext } from "@/components/providers/AuthProvider";
import Button from "@/components/ui/Button";
import { PLANS } from "@/types";
import { CreditCard, Check, Coins, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

export default function PlansPage() {
  const { userData } = useAuthContext();

  const handleSelectPlan = (_planId: string) => {
    // Abacate Pay integration will go here
    toast("Integracao de pagamento em breve!", { icon: "🔜" });
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
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-300 text-sm">Seu plano atual</p>
              <p className="text-white text-xl font-bold font-heading capitalize">{userData?.plan || "Free"}</p>
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
              { name: "Analise de curriculo", cost: 1 },
              { name: "Analise LinkedIn", cost: 1 },
              { name: "Criar curriculo", cost: 1 },
              { name: "Adaptar curriculo", cost: 1 },
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
          const isCurrentPlan = userData?.plan === plan.id;
          const isPopular = plan.id === "intermediate";

          return (
            <div
              key={plan.id}
              className={`relative rounded-xl ${
                isPopular
                  ? "gradient-border glass-card pricing-popular"
                  : isCurrentPlan
                  ? "bg-primary-500/10 border border-primary-500/20 rounded-xl"
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

                <Button
                  className="w-full"
                  variant={isCurrentPlan ? "secondary" : isPopular ? "primary" : "outline"}
                  disabled={isCurrentPlan}
                  onClick={() => handleSelectPlan(plan.id)}
                >
                  {isCurrentPlan ? "Plano atual" : "Assinar"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-center text-sm text-gray-500">
        Pagamentos processados com seguranca. Integracoes de pagamento em breve.
      </p>
    </div>
  );
}
