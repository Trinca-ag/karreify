"use client";

import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";
import dynamic from "next/dynamic";
import { useCookieConsent } from "@/hooks/useCookieConsent";
import type { ConsentCategories, CookieCategory } from "@/lib/cookie-consent";

const CookieBanner = dynamic(() => import("@/components/cookies/CookieBanner"), { ssr: false });
const CookiePreferencesModal = dynamic(
  () => import("@/components/cookies/CookiePreferencesModal"),
  { ssr: false }
);
const CookieFloatingButton = dynamic(
  () => import("@/components/cookies/CookieFloatingButton"),
  { ssr: false }
);

export const OPEN_COOKIE_PREFERENCES_EVENT = "karreify:open-cookie-preferences";

interface CookieConsentContextType {
  isAllowed: (category: CookieCategory) => boolean;
  openPreferences: () => void;
  revoke: () => void;
}

const CookieConsentContext = createContext<CookieConsentContextType>({
  isAllowed: (category) => category === "necessary",
  openPreferences: () => {},
  revoke: () => {},
});

export function useCookieConsentContext(): CookieConsentContextType {
  return useContext(CookieConsentContext);
}

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const {
    consent,
    hydrated,
    acceptAll,
    rejectAll,
    customize,
    revoke,
    isAllowed,
  } = useCookieConsent();

  const [modalOpen, setModalOpen] = useState(false);

  const openPreferences = useCallback(() => setModalOpen(true), []);
  const closePreferences = useCallback(() => setModalOpen(false), []);

  useEffect(() => {
    const handler = () => setModalOpen(true);
    window.addEventListener(OPEN_COOKIE_PREFERENCES_EVENT, handler);
    return () => window.removeEventListener(OPEN_COOKIE_PREFERENCES_EVENT, handler);
  }, []);

  const handleAcceptAll = useCallback(() => {
    acceptAll();
    closePreferences();
  }, [acceptAll, closePreferences]);

  const handleRejectAll = useCallback(() => {
    rejectAll();
    closePreferences();
  }, [rejectAll, closePreferences]);

  const handleSave = useCallback(
    (picks: Partial<Omit<ConsentCategories, "necessary">>) => {
      customize(picks);
      closePreferences();
    },
    [customize, closePreferences]
  );

  const showBanner = hydrated && !consent.decided && !modalOpen;
  const showFloating = hydrated && consent.decided && !modalOpen;

  return (
    <CookieConsentContext.Provider value={{ isAllowed, openPreferences, revoke }}>
      {children}

      {showBanner && (
        <CookieBanner
          onAcceptAll={acceptAll}
          onRejectAll={rejectAll}
          onCustomize={openPreferences}
        />
      )}

      {showFloating && <CookieFloatingButton onClick={openPreferences} />}

      <CookiePreferencesModal
        isOpen={modalOpen}
        consent={consent}
        onClose={closePreferences}
        onAcceptAll={handleAcceptAll}
        onRejectAll={handleRejectAll}
        onSave={handleSave}
      />
    </CookieConsentContext.Provider>
  );
}
