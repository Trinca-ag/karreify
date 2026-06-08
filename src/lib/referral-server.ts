import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { randomInt } from "crypto";

/**
 * Helpers server-only do sistema de indicação. Geração/resolução do código de
 * indicação. Todas as escritas usam o Admin SDK (ignoram as regras): tanto
 * `users/{uid}.referralCode` quanto o doc de lookup `referralCodes/{code}` são
 * server-only.
 */

// Alfabeto sem caracteres confusáveis (0/O, 1/I/L) — códigos fáceis de ditar.
const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const CODE_LENGTH = 7;
const MAX_GEN_ATTEMPTS = 8;

function generateCandidate(): string {
  let s = "";
  for (let i = 0; i < CODE_LENGTH; i++) {
    s += CODE_ALPHABET[randomInt(CODE_ALPHABET.length)];
  }
  return s;
}

/** Monta o link compartilhável a partir do código. O domínio é controlado por
 *  NEXT_PUBLIC_APP_URL (mesma fonte da verdade do resto do app). */
export function referralLinkFor(code: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return `${base}/auth/register?ref=${encodeURIComponent(code)}`;
}

/** Resolve um código → uid do indicador. Retorna null se o código não existe. */
export async function resolveReferralCode(code: string): Promise<string | null> {
  const clean = code.trim().toUpperCase();
  if (!clean) return null;
  const snap = await adminDb.collection("referralCodes").doc(clean).get();
  if (!snap.exists) return null;
  return (snap.data()?.uid as string | undefined) ?? null;
}

/**
 * Retorna o código de indicação do usuário, gerando-o (e persistindo o lookup)
 * na primeira vez. Geração resistente a colisão: cada tentativa cria
 * `referralCodes/{candidate}` dentro de uma transação que falha o candidato se
 * o doc já existir; também é idempotente sob concorrência (se outra chamada já
 * gerou, reaproveita o código existente).
 */
export async function ensureReferralCode(uid: string): Promise<string> {
  const userRef = adminDb.collection("users").doc(uid);
  const snap = await userRef.get();
  if (!snap.exists) throw new Error("user-not-found");
  const current = snap.data()?.referralCode as string | undefined;
  if (current) return current;

  for (let attempt = 0; attempt < MAX_GEN_ATTEMPTS; attempt++) {
    const candidate = generateCandidate();
    const codeRef = adminDb.collection("referralCodes").doc(candidate);
    const assigned = await adminDb.runTransaction(async (tx) => {
      const uSnap = await tx.get(userRef);
      const existing = uSnap.data()?.referralCode as string | undefined;
      if (existing) return existing; // corrida: outra chamada já gerou
      const cSnap = await tx.get(codeRef);
      if (cSnap.exists) return null; // colisão → tenta outro candidato
      tx.set(codeRef, { uid, createdAt: FieldValue.serverTimestamp() });
      tx.update(userRef, { referralCode: candidate, updatedAt: new Date() });
      return candidate;
    });
    if (assigned) return assigned;
  }
  throw new Error("referral-code-generation-failed");
}
