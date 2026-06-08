import { authedFetchJson } from "@/lib/api-client";

/**
 * Serviço client do sistema de indicação.
 *
 * Fluxo de captura: o link aponta para /auth/register?ref=CODE. Como o código
 * se perde no popup do Google OAuth e no redirect de /auth/verify, persistimos
 * num cookie de 30 dias e disparamos a atribuição (idempotente) após o login.
 */

const REF_COOKIE = "karreify_ref";
const REF_MAX_LEN = 16;

export function readRefCookie(): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(/(?:^|;\s*)karreify_ref=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}

export function clearRefCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${REF_COOKIE}=; Max-Age=0; path=/; SameSite=Lax`;
}

/** Lê ?ref=CODE da URL atual e persiste no cookie. Chamado no mount das telas
 *  de auth, antes de qualquer redirect/popup. Sanitiza para [A-Z0-9]. */
export function captureRefFromUrl(): void {
  if (typeof window === "undefined") return;
  const raw = new URLSearchParams(window.location.search).get("ref");
  if (!raw) return;
  const clean = raw.trim().toUpperCase().slice(0, REF_MAX_LEN);
  if (!/^[A-Z0-9]+$/.test(clean)) return;
  document.cookie = `${REF_COOKIE}=${encodeURIComponent(clean)}; Max-Age=${60 * 60 * 24 * 30}; path=/; SameSite=Lax`;
}

export interface ReferralInfo {
  code: string;
  link: string;
  referralCount: number;
  creditsPerReferral: number;
}

export async function fetchReferralInfo(): Promise<ReferralInfo> {
  return authedFetchJson<ReferralInfo>("/api/referral/code", { method: "GET" });
}

/**
 * Dispara a atribuição quando há um cookie de indicação pendente. O servidor é
 * idempotente (guarda `referredBy`), então é seguro chamar em todo login. Limpa
 * o cookie em qualquer resposta definitiva; mantém só no caso de corrida
 * (`no-user-doc`, doc do cadastro ainda não visível) ou erro de rede, para uma
 * nova tentativa numa emissão posterior do onSnapshot.
 */
export async function attributeReferralIfPending(): Promise<{ done: boolean }> {
  const code = readRefCookie();
  if (!code) return { done: true };
  try {
    const res = await authedFetchJson<{ attributed?: boolean; reason?: string }>(
      "/api/referral/attribute",
      { method: "POST", body: JSON.stringify({ code }) }
    );
    if (res?.reason === "no-user-doc") return { done: false };
    clearRefCookie();
    return { done: true };
  } catch {
    return { done: false };
  }
}
