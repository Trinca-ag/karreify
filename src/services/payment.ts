import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { addCredits } from "@/services/credits";
import { invalidateUser } from "@/lib/cache";
import { PLANS, type Plan } from "@/types";

export async function activatePlan(
  userId: string,
  planId: Plan
): Promise<void> {
  const plan = PLANS.find((p) => p.id === planId);
  if (!plan) throw new Error("Plano não encontrado");

  const now = new Date();
  const expiresAt = new Date(now);
  expiresAt.setMonth(expiresAt.getMonth() + 1);

  await updateDoc(doc(db, "users", userId), {
    plan: planId,
    planActivatedAt: now,
    planExpiresAt: expiresAt,
    updatedAt: serverTimestamp(),
  });

  await addCredits(
    userId,
    plan.credits,
    `Assinatura do plano ${plan.name} — ${plan.credits} créditos`
  );

  invalidateUser(userId);
}

export async function cancelSubscription(userId: string): Promise<void> {
  await updateDoc(doc(db, "users", userId), {
    plan: "free",
    planActivatedAt: null,
    planExpiresAt: null,
    updatedAt: serverTimestamp(),
  });

  invalidateUser(userId);
}
