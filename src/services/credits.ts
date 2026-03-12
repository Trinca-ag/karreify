import { doc, getDoc, updateDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FEATURE_COSTS } from "@/types";
import { cache, CK, TTL } from "@/lib/cache";

export async function getUserCredits(userId: string): Promise<number> {
  const cached = cache.get<number>(CK.credits(userId));
  if (cached !== null) return cached;

  const userDoc = await getDoc(doc(db, "users", userId));
  if (!userDoc.exists()) throw new Error("Usuário não encontrado");

  const credits = userDoc.data().credits || 0;
  cache.set(CK.credits(userId), credits, TTL.credits);
  return credits;
}

export async function checkCredits(userId: string, feature: string): Promise<boolean> {
  const credits = await getUserCredits(userId);
  const cost = FEATURE_COSTS[feature] || 1;
  return credits >= cost;
}

export async function deductCredits(
  userId: string,
  feature: string,
  description: string
): Promise<void> {
  const cost = FEATURE_COSTS[feature] || 1;
  const credits = await getUserCredits(userId);

  if (credits < cost) {
    throw new Error("Créditos insuficientes");
  }

  const newCredits = credits - cost;

  await updateDoc(doc(db, "users", userId), {
    credits: newCredits,
  });

  await addDoc(collection(db, "users", userId, "transactions"), {
    amount: cost,
    type: "debit",
    feature,
    description,
    createdAt: serverTimestamp(),
  });

  // Update cache with new value instead of invalidating
  cache.set(CK.credits(userId), newCredits, TTL.credits);
  cache.invalidate(CK.userData(userId));
}

export async function addCredits(
  userId: string,
  amount: number,
  description: string
): Promise<void> {
  const credits = await getUserCredits(userId);
  const newCredits = credits + amount;

  await updateDoc(doc(db, "users", userId), {
    credits: newCredits,
  });

  await addDoc(collection(db, "users", userId, "transactions"), {
    amount,
    type: "credit",
    feature: "purchase",
    description,
    createdAt: serverTimestamp(),
  });

  cache.set(CK.credits(userId), newCredits, TTL.credits);
  cache.invalidate(CK.userData(userId));
}
