"use client";

import Link from "next/link";
import { Cookie, ShieldCheck, Settings2, X, Check } from "lucide-react";

interface CookieBannerProps {
  onAcceptAll: () => void;
  onRejectAll: () => void;
  onCustomize: () => void;
}

export default function CookieBanner({
  onAcceptAll,
  onRejectAll,
  onCustomize,
}: CookieBannerProps) {
  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-description"
      className="fixed inset-x-0 bottom-0 z-[60] px-3 pb-3 sm:px-5 sm:pb-5 pointer-events-none"
    >
      <div
        className="pointer-events-auto mx-auto max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-dark-900/95 backdrop-blur-xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
        style={{ animation: "fadeInUp 0.4s ease-out" }}
      >
        <div className="relative">
          {/* Decorative accent line */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />

          <div className="p-5 sm:p-6 lg:p-7">
            <div className="flex flex-col lg:flex-row lg:items-start gap-5 lg:gap-8">
              {/* Texto */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/20 to-primary-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                    <Cookie className="w-4 h-4 text-emerald-300" />
                  </div>
                  <div className="flex flex-col">
                    <h2
                      id="cookie-banner-title"
                      className="text-base sm:text-lg font-heading font-bold text-white leading-tight"
                    >
                      Sua privacidade importa
                    </h2>
                    <span className="text-[11px] font-semibold tracking-wide text-emerald-300/90 uppercase">
                      Em conformidade com a LGPD
                    </span>
                  </div>
                </div>

                <p
                  id="cookie-banner-description"
                  className="text-sm text-gray-300 leading-relaxed"
                >
                  Usamos cookies essenciais para que o Karreify funcione e,
                  com a sua autorização, cookies funcionais, analíticos e de
                  marketing para melhorar sua experiência. Você decide o que
                  permitir — e pode mudar a qualquer momento.
                </p>

                <p className="mt-2.5 text-xs text-gray-500 leading-relaxed">
                  Saiba mais na{" "}
                  <Link
                    href="/cookies"
                    className="text-emerald-300 hover:text-emerald-200 underline-offset-2 hover:underline transition-colors"
                  >
                    Política de Cookies
                  </Link>{" "}
                  e na{" "}
                  <Link
                    href="/privacy"
                    className="text-emerald-300 hover:text-emerald-200 underline-offset-2 hover:underline transition-colors"
                  >
                    Política de Privacidade
                  </Link>
                  .
                </p>
              </div>

              {/* Ações */}
              <div className="flex flex-col gap-2 lg:w-[280px] lg:flex-shrink-0">
                <button
                  type="button"
                  onClick={onAcceptAll}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-white text-sm font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:-translate-y-0.5 transition-all duration-200"
                >
                  <Check className="w-4 h-4" />
                  Aceitar todos
                </button>
                <button
                  type="button"
                  onClick={onRejectAll}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-semibold hover:bg-white/10 hover:border-white/20 transition-all duration-200"
                >
                  <X className="w-4 h-4" />
                  Rejeitar não essenciais
                </button>
                <button
                  type="button"
                  onClick={onCustomize}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-emerald-300 text-sm font-medium hover:text-emerald-200 hover:bg-emerald-500/5 transition-all duration-200"
                >
                  <Settings2 className="w-4 h-4" />
                  Personalizar preferências
                </button>
              </div>
            </div>

            {/* Selo de transparência */}
            <div className="mt-5 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400/70" />
                Sem cookies pré-marcados. Decisão registrada de forma auditável.
              </div>
              <span className="text-[10px] text-gray-600 tracking-wider">
                LGPD · Lei nº 13.709/2018
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
