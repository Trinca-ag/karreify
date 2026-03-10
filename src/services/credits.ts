import { doc, getDoc, updateDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FEATURE_COSTS } from "@/types";

export async function getUserCredits(userId: string): Promise<number> {
  const userDoc = await getDoc(doc(db, "users", userId));
  if (!userDoc.exists()) throw new Error("Usuário não encontrado");
  return userDoc.data().credits || 0;
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

  await updateDoc(doc(db, "users", userId), {
    credits: credits - cost,
  });

  await addDoc(collection(db, "users", userId, "transactions"), {
    amount: cost,
    type: "debit",
    feature,
    description,
    createdAt: serverTimestamp(),
  });
}

export async function addCredits(
  userId: string,
  amount: number,
  description: string
): Promise<void> {
  const credits = await getUserCredits(userId);

  await updateDoc(doc(db, "users", userId), {
    credits: credits + amount,
  });

  await addDoc(collection(db, "users", userId, "transactions"), {
    amount,
    type: "credit",
    feature: "purchase",
    description,
    createdAt: serverTimestamp(),
  });
}
