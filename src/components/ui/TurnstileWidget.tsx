"use client";

import Script from "next/script";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

/** Site key pública (inlined no build). Vazia = captcha desligado. */
export const TURNSTILE_SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";
export const turnstileEnabled = TURNSTILE_SITE_KEY.length > 0;

interface TurnstileApi {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id?: string) => void;
  remove: (id?: string) => void;
}
declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export interface TurnstileHandle {
  /** Reseta o widget pra gerar um novo token (tokens são single-use). */
  reset: () => void;
}

interface Props {
  /** Recebe o token quando resolvido; "" quando expira/erro/reset. */
  onToken: (token: string) => void;
  className?: string;
  theme?: "auto" | "light" | "dark";
}

/**
 * Widget "não sou um robô" do Cloudflare Turnstile (render explícito, sem libs).
 * Renderiza nada quando NEXT_PUBLIC_TURNSTILE_SITE_KEY não está setada — assim o
 * recurso fica desligado até as chaves serem configuradas.
 */
const TurnstileWidget = forwardRef<TurnstileHandle, Props>(
  function TurnstileWidget({ onToken, className, theme = "dark" }, ref) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const widgetIdRef = useRef<string | null>(null);
    const [ready, setReady] = useState(false);
    // Mantém a callback estável sem re-renderizar o widget.
    const onTokenRef = useRef(onToken);
    onTokenRef.current = onToken;

    // Se o script já foi injetado por outra instância, marca ready no mount.
    useEffect(() => {
      if (turnstileEnabled && typeof window !== "undefined" && window.turnstile) {
        setReady(true);
      }
    }, []);

    useImperativeHandle(ref, () => ({
      reset() {
        if (window.turnstile && widgetIdRef.current) {
          try {
            window.turnstile.reset(widgetIdRef.current);
          } catch {}
        }
        onTokenRef.current("");
      },
    }));

    useEffect(() => {
      if (!turnstileEnabled || !ready) return;
      if (!containerRef.current || !window.turnstile) return;
      if (widgetIdRef.current) return; // evita render duplo (React StrictMode)

      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        theme,
        callback: (token: string) => onTokenRef.current(token),
        "error-callback": () => onTokenRef.current(""),
        "expired-callback": () => onTokenRef.current(""),
        "timeout-callback": () => onTokenRef.current(""),
      });

      const id = widgetIdRef.current;
      return () => {
        if (window.turnstile && id) {
          try {
            window.turnstile.remove(id);
          } catch {}
        }
        widgetIdRef.current = null;
      };
    }, [ready, theme]);

    if (!turnstileEnabled) return null;

    return (
      <div className={className}>
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onLoad={() => setReady(true)}
        />
        <div ref={containerRef} />
      </div>
    );
  }
);

export default TurnstileWidget;

/**
 * Helper de cliente: valida o token chamando nosso endpoint server-side.
 * - Captcha desligado (sem site key) → retorna true (libera).
 * - Sem token → false (bloqueia).
 * - Erro de rede → true (fail-open, mesma filosofia do login-rate).
 */
export async function verifyCaptchaToken(token: string): Promise<boolean> {
  if (!turnstileEnabled) return true;
  if (!token) return false;
  try {
    const res = await fetch("/api/auth/verify-turnstile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    return res.ok;
  } catch {
    return true;
  }
}
