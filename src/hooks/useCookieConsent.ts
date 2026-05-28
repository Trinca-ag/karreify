"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CONSENT_CHANGE_EVENT,
  type ConsentCategories,
  type CookieCategory,
  type CookieConsentState,
  acceptAll as acceptAllState,
  customizeConsent as customizeState,
  dispatchConsentChange,
  loadConsent,
  makeInitialState,
  rejectAll as rejectAllState,
  revokeConsent as revokeState,
  saveConsent,
} from "@/lib/cookie-consent";

export interface UseCookieConsent {
  /** Estado atual do consentimento. */
  consent: CookieConsentState;
  /** `true` enquanto não terminamos de hidratar o estado do storage. */
  hydrated: boolean;
  /** Aceita todas as categorias. */
  acceptAll: () => void;
  /** Mantém apenas a categoria essencial. */
  rejectAll: () => void;
  /** Aplica uma seleção parcial sem necessariamente marcar tudo. */
  customize: (picks: Partial<Omit<ConsentCategories, "necessary">>) => void;
  /** Revoga a decisão atual e reabre o banner. */
  revoke: () => void;
  /** Verifica se uma categoria está ativa. */
  isAllowed: (category: CookieCategory) => boolean;
}

export function useCookieConsent(): UseCookieConsent {
  const [consent, setConsent] = useState<CookieConsentState>(makeInitialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setConsent(loadConsent());
    setHydrated(true);
  }, []);

  useEffect(() => {
    const onChange = (event: Event) => {
      const detail = (event as CustomEvent<CookieConsentState>).detail;
      if (detail) setConsent(detail);
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key && event.key.startsWith("karreify_cookie_consent")) {
        setConsent(loadConsent());
      }
    };
    window.addEventListener(CONSENT_CHANGE_EVENT, onChange);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(CONSENT_CHANGE_EVENT, onChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const commit = useCallback((next: CookieConsentState) => {
    saveConsent(next);
    setConsent(next);
    dispatchConsentChange(next);
  }, []);

  const acceptAll = useCallback(() => {
    commit(acceptAllState(loadConsent()));
  }, [commit]);

  const rejectAll = useCallback(() => {
    commit(rejectAllState(loadConsent()));
  }, [commit]);

  const customize = useCallback(
    (picks: Partial<Omit<ConsentCategories, "necessary">>) => {
      commit(customizeState(loadConsent(), picks));
    },
    [commit]
  );

  const revoke = useCallback(() => {
    commit(revokeState(loadConsent()));
  }, [commit]);

  const isAllowed = useCallback(
    (category: CookieCategory) => {
      if (category === "necessary") return true;
      if (!consent.decided) return false;
      return Boolean(consent.categories[category]);
    },
    [consent]
  );

  return { consent, hydrated, acceptAll, rejectAll, customize, revoke, isAllowed };
}
