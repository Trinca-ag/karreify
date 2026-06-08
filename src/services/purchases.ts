import { authedFetchJson } from "@/lib/api-client";

export interface PurchaseRecord {
  id: string;
  packId: string;
  packName: string;
  amountCents: number;
  creditsGranted: number;
  creditsUsed: number | null;
  status: string;
  refundStatus: string | null;
  refundEligible: boolean;
  createdAt: string | null;
  completedAt: string | null;
  refundedAt: string | null;
}

export async function fetchPurchases(): Promise<PurchaseRecord[]> {
  const res = await authedFetchJson<{ purchases: PurchaseRecord[] }>("/api/purchases", {
    method: "GET",
  });
  return res.purchases;
}

export async function requestRefund(
  paymentId: string,
  reason?: string
): Promise<{ ok: boolean; refundId: string }> {
  return authedFetchJson("/api/refunds", {
    method: "POST",
    body: JSON.stringify({ paymentId, reason }),
  });
}
