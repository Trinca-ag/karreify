import { doc, getDoc, collection, query, where, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FEATURE_COSTS } from "@/types";
import { cache, CK, TTL } from "@/lib/cache";

/**
 * Client-side read helpers. All mutations (deduct, add) live server-side
 * inside the relevant API routes (analyze-*, credits/purchase, admin/add-credits)
 * so credit balances and stats can't be tampered with from the browser.
 */

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

export async function hasUsedFeature(userId: string, feature: string): Promise<boolean> {
  const q = query(
    collection(db, "users", userId, "transactions"),
    where("feature", "==", feature),
    where("type", "==", "debit"),
    limit(1)
  );
  const snapshot = await getDocs(q);
  return !snapshot.empty;
}
