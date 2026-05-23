import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { FEATURE_COSTS } from "@/types";

export class InsufficientCreditsError extends Error {
  required: number;
  available: number;
  constructor(required: number, available: number) {
    super("Créditos insuficientes");
    this.required = required;
    this.available = available;
  }
}

export function featureCost(feature: string): number {
  return FEATURE_COSTS[feature] ?? 1;
}

async function userHasUsedFeature(uid: string, feature: string): Promise<boolean> {
  const snap = await adminDb
    .collection("users")
    .doc(uid)
    .collection("transactions")
    .where("feature", "==", feature)
    .where("type", "==", "debit")
    .limit(1)
    .get();
  return !snap.empty;
}

export interface DeductOptions {
  /** When true, the very first debit for this feature is recorded as a $0
   *  transaction (used for the "primeira análise grátis" UX). */
  firstUseFree?: boolean;
}

export interface DeductResult {
  newBalance: number;
  cost: number;
  wasFree: boolean;
}

/**
 * Atomically debit credits for a feature use. Throws InsufficientCreditsError
 * when the user can't afford the cost. Writes the user/transactions entry and
 * bumps the global stats counter in the same transaction so feature analytics
 * stay consistent with credits actually spent.
 */
export async function deductCreditsServer(
  uid: string,
  feature: string,
  description: string,
  options: DeductOptions = {}
): Promise<DeductResult> {
  const userRef = adminDb.collection("users").doc(uid);

  if (options.firstUseFree) {
    const used = await userHasUsedFeature(uid, feature);
    if (!used) {
      const txRef = userRef.collection("transactions").doc();
      await txRef.set({
        amount: 0,
        type: "debit",
        feature,
        description: `${description} (primeira grátis)`,
        createdAt: FieldValue.serverTimestamp(),
      });
      const balanceSnap = await userRef.get();
      const balance = (balanceSnap.data()?.credits as number | undefined) ?? 0;
      return { newBalance: balance, cost: 0, wasFree: true };
    }
  }

  const cost = featureCost(feature);
  const statsRef = adminDb.collection("stats").doc("global");
  const txRef = userRef.collection("transactions").doc();

  const newBalance = await adminDb.runTransaction(async (tx) => {
    const userSnap = await tx.get(userRef);
    if (!userSnap.exists) throw new Error("Usuário não encontrado");

    const currentCredits = (userSnap.data()?.credits as number | undefined) ?? 0;
    if (currentCredits < cost) {
      throw new InsufficientCreditsError(cost, currentCredits);
    }

    const next = currentCredits - cost;
    tx.update(userRef, { credits: next, updatedAt: new Date() });
    tx.set(txRef, {
      amount: cost,
      type: "debit",
      feature,
      description,
      createdAt: FieldValue.serverTimestamp(),
    });
    tx.set(
      statsRef,
      {
        totalCreditsUsed: FieldValue.increment(cost),
        [`featureUsage.${feature}`]: FieldValue.increment(1),
      },
      { merge: true }
    );
    return next;
  });

  return { newBalance, cost, wasFree: false };
}

export async function getCreditsServer(uid: string): Promise<number> {
  const snap = await adminDb.collection("users").doc(uid).get();
  if (!snap.exists) return 0;
  return (snap.data()?.credits as number | undefined) ?? 0;
}

/**
 * Estorna créditos cobrados por uma feature que acabou falhando depois da
 * dedução. Restaura o saldo e registra uma transação de tipo "refund" para
 * manter a auditoria. Sem-op quando `cost` é 0 (uso gratuito) — só registra
 * a tentativa fica clara no histórico.
 *
 * Não estorna o contador de stats global (totalCreditsUsed/featureUsage)
 * de propósito: a feature foi de fato consumida (mesmo que falhada) e o
 * desvio é minúsculo perto do ruído do contador.
 */
export async function refundCreditsServer(
  uid: string,
  feature: string,
  cost: number,
  reason: string
): Promise<void> {
  if (cost <= 0) return;

  const userRef = adminDb.collection("users").doc(uid);
  const txRef = userRef.collection("transactions").doc();

  await adminDb.runTransaction(async (tx) => {
    const userSnap = await tx.get(userRef);
    if (!userSnap.exists) return;

    const currentCredits = (userSnap.data()?.credits as number | undefined) ?? 0;
    tx.update(userRef, { credits: currentCredits + cost, updatedAt: new Date() });
    tx.set(txRef, {
      amount: cost,
      type: "refund",
      feature,
      description: `Estorno: ${reason}`,
      createdAt: FieldValue.serverTimestamp(),
    });
  });
}
