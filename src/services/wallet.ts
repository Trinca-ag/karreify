import { authedFetchJson } from "@/lib/api-client";

/** Serviço client da carteira: leitura do resumo/histórico e conversão em créditos. */

export interface WalletSummary {
  balanceCents: number;
  pendingCents: number;
  totalEarnedCents: number;
  totalWithdrawnCents: number;
  totalConvertedCents: number;
}

export interface WalletMovement {
  id: string;
  amountCents: number;
  type: string;
  description: string;
  createdAt: string | null;
}

export interface WalletData {
  wallet: WalletSummary;
  transactions: WalletMovement[];
  config: {
    centsPerCredit: number;
    withdrawMinCents: number;
    withdrawMaxCents: number;
  };
}

export async function fetchWalletData(): Promise<WalletData> {
  return authedFetchJson<WalletData>("/api/wallet", { method: "GET" });
}

export async function convertWalletToCredits(
  credits: number
): Promise<{ ok: boolean; creditsAdded: number }> {
  return authedFetchJson("/api/credits/convert-wallet", {
    method: "POST",
    body: JSON.stringify({ credits }),
  });
}

export interface WithdrawalRecord {
  id: string;
  amountCents: number;
  pixKey: string;
  pixKeyType: string;
  status: "requested" | "approved" | "paid" | "rejected";
  requestedAt: string | null;
  decidedAt: string | null;
  paidAt: string | null;
  rejectReason: string | null;
}

export async function fetchWithdrawals(): Promise<WithdrawalRecord[]> {
  const res = await authedFetchJson<{ withdrawals: WithdrawalRecord[] }>(
    "/api/withdrawals",
    { method: "GET" }
  );
  return res.withdrawals;
}

export interface WithdrawalInput {
  amountCents: number;
  pixKey: string;
  pixKeyType: string;
}

export async function requestWithdrawal(
  input: WithdrawalInput
): Promise<{ ok: boolean; withdrawalId: string }> {
  return authedFetchJson("/api/withdrawals", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export interface CommissionRecord {
  id: string;
  amountCents: number;
  packId: string;
  status: string;
  maskedBuyer: string;
  holdUntil: number | null;
  createdAt: string | null;
  releasedAt: string | null;
}

export async function fetchMyCommissions(): Promise<CommissionRecord[]> {
  const res = await authedFetchJson<{ commissions: CommissionRecord[] }>("/api/commissions", {
    method: "GET",
  });
  return res.commissions;
}
