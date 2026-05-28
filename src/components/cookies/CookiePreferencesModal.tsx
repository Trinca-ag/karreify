"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  Cookie,
  X,
  Lock,
  ChevronDown,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import {
  CATEGORY_INFO,
  type ConsentCategories,
  type CookieConsentState,
} from "@/lib/cookie-consent";

interface CookiePreferencesModalProps {
  isOpen: boolean;
  consent: CookieConsentState;
  onClose: () => void;
  onAcceptAll: () => void;
  onRejectAll: () => void;
  onSave: (picks: Partial<Omit<ConsentCategories, "necessary">>) => void;
}

type CategoryToggleId = Exclude<keyof ConsentCategories, "necessary">;

export default function CookiePreferencesModal({
  isOpen,
  consent,
  onClose,
  onAcceptAll,
  onRejectAll,
  onSave,
}: CookiePreferencesModalProps) {
  const [draft, setDraft] = useState<Record<CategoryToggleId, boolean>>(() => ({
    functional: consent.categories.functional,
    analytics: consent.categories.analytics,
    marketing: consent.categories.marketing,
  }));

  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setDraft({
        functional: consent.categories.functional,
        analytics: consent.categories.analytics,
        marketing: consent.categories.marketing,
      });
      setExpanded(null);
    }
  }, [isOpen, consent]);

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  const lastUpdated = useMemo(() => {
    if (!consent.decided || !consent.timestamp) return null;
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(consent.timestamp));
  }, [consent]);

  if (!isOpen) return null;
  if (typeof document === "undefined") return null;

  const handleToggle = (id: CategoryToggleId) =>
    setDraft((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleSave = () => onSave(draft);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-preferences-title"
      className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center"
    >
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className="relative bg-dark-800 border border-white/10 rounded-t-3xl sm:rounded-3xl shadow-2xl shadow-black/40 w-full sm:max-w-3xl mx-0 sm:mx-4 max-h-[92vh] sm:max-h-[88vh] flex flex-col overflow-hidden"
        style={{ animation: "fadeInUp 0.3s ease-out" }}
      >
        {/* Header */}
        <div className="relative px-5 sm:px-7 py-5 border-b border-white/5 flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500/20 to-primary-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
            <Cookie className="w-5 h-5 text-emerald-300" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-bold tracking-widest text-emerald-300 uppercase">
              Preferências de Cookies
            </div>
            <h2
              id="cookie-preferences-title"
              className="mt-0.5 text-xl sm:text-2xl font-heading font-bold text-white leading-tight"
            >
              Personalize sua privacidade
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/5 transition-colors flex-shrink-0"
            aria-label="Fechar"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-7 py-5 space-y-5">
          <p className="text-sm text-gray-300 leading-relaxed border-l-2 border-emerald-500/40 pl-3.5">
            Você está no controle. Ative ou desative cada categoria de acordo
            com sua preferência. Os cookies estritamente necessários não podem
            ser desligados — são eles que mantêm o Karreify funcionando com
            segurança.
          </p>

          <div className="space-y-3">
            {CATEGORY_INFO.map((cat) => {
              const isRequired = cat.required;
              const draftId = cat.id as CategoryToggleId;
              const checked = isRequired ? true : draft[draftId];
              const isExpanded = expanded === cat.id;

              return (
                <div
                  key={cat.id}
                  className={`rounded-2xl border transition-colors ${
                    checked
                      ? "bg-emerald-500/[0.04] border-emerald-500/25"
                      : "bg-white/[0.02] border-white/8"
                  }`}
                >
                  <div className="p-4 sm:p-5">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm sm:text-base font-heading font-semibold text-white">
                            {cat.title}
                          </h3>
                          {isRequired && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 border border-white/10 text-[10px] font-bold tracking-wide text-gray-300 uppercase">
                              <Lock className="w-2.5 h-2.5" />
                              Sempre ativo
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-xs sm:text-sm text-gray-400 leading-relaxed">
                          {cat.summary}
                        </p>
                      </div>

                      {/* Toggle */}
                      <ToggleSwitch
                        checked={checked}
                        disabled={isRequired}
                        onChange={() => !isRequired && handleToggle(draftId)}
                        label={`Ativar cookies da categoria ${cat.shortTitle}`}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => setExpanded(isExpanded ? null : cat.id)}
                      className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-emerald-300 hover:text-emerald-200 transition-colors"
                      aria-expanded={isExpanded}
                    >
                      {isExpanded ? "Ocultar detalhes" : "Saiba mais"}
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-white/5 space-y-3 animate-fade-in">
                        <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                          {cat.description}
                        </p>
                        <div>
                          <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                            Exemplos de uso
                          </div>
                          <ul className="space-y-1">
                            {cat.examples.map((ex) => (
                              <li
                                key={ex}
                                className="flex items-start gap-2 text-xs text-gray-400"
                              >
                                <CheckCircle2 className="w-3 h-3 text-emerald-400/70 mt-0.5 flex-shrink-0" />
                                <span className="leading-relaxed">{ex}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-4 sm:p-5 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300 uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              Transparência LGPD
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Você pode revisar suas escolhas a qualquer momento clicando no
              botão flutuante de cookies ou no rodapé do site. A íntegra das
              tecnologias utilizadas está disponível na{" "}
              <Link
                href="/cookies"
                className="text-emerald-300 hover:text-emerald-200 underline-offset-2 hover:underline transition-colors"
              >
                Política de Cookies
              </Link>
              .
            </p>
            {lastUpdated && (
              <p className="text-[11px] text-gray-500">
                Sua decisão atual foi registrada em <strong className="text-gray-300">{lastUpdated}</strong>.
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-7 py-4 border-t border-white/5 bg-dark-900/50 flex flex-col-reverse sm:flex-row gap-2.5 sm:gap-3 sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={onRejectAll}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-semibold hover:bg-white/10 hover:border-white/20 transition-all duration-200"
          >
            Rejeitar todos
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white text-sm font-semibold hover:bg-white/15 transition-all duration-200"
          >
            Salvar preferências
          </button>
          <button
            type="button"
            onClick={onAcceptAll}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-white text-sm font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-200"
          >
            Aceitar todos
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

interface ToggleSwitchProps {
  checked: boolean;
  disabled?: boolean;
  onChange: () => void;
  label: string;
}

function ToggleSwitch({ checked, disabled, onChange, label }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={onChange}
      className={`relative inline-flex h-7 w-12 flex-shrink-0 rounded-full border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 ${
        checked
          ? "bg-emerald-500/90 border-emerald-400/60"
          : "bg-white/5 border-white/15"
      } ${disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-200 ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}
