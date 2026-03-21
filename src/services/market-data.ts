import { doc, getDoc, setDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { MarketData } from "@/services/ai-market";

const MARKET_DOC = () => doc(db, "market", "global");
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export async function getStoredMarketData(): Promise<(MarketData & { updatedAt: Timestamp }) | null> {
  const snap = await getDoc(MARKET_DOC());
  if (!snap.exists()) return null;
  return snap.data() as MarketData & { updatedAt: Timestamp };
}

export function isMarketDataStale(updatedAt: Timestamp): boolean {
  return Date.now() - updatedAt.toDate().getTime() > THIRTY_DAYS_MS;
}

export function formatUpdatedAt(updatedAt: Timestamp): string {
  return updatedAt.toDate().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export async function saveMarketData(data: MarketData): Promise<void> {
  await setDoc(MARKET_DOC(), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}
