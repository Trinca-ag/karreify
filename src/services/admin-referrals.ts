import { adminFetch } from "@/services/admin";

async function adminJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await adminFetch(url, options);
  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) throw new Error((data.error as string) || `Erro ${res.status}`);
  return data as T;
}

export interface ReferralStats {
  referrals: { total: number; converted: number; creditsDistributed: number };
  commissions: { generatedCents: number; heldCents: number; releasedCents: number; reversedCents: number };
  pending: {
    withdrawalsRequested: number;
    withdrawalsApproved: number;
    withdrawalsPaid: number;
    refundsRequested: number;
  };
  topReferrers: Array<{ uid: string; name: string; count: number }>;
  topEarners: Array<{ uid: string; name: string; amountCents: number }>;
  capped: boolean;
}

export interface AdminReferralRow {
  id: string;
  referrerName: string;
  referredName: string;
  code: string;
  status: string;
  createdAt: string | null;
  convertedAt: string | null;
}

export interface AdminCommissionRow {
  id: string;
  referrerName: string;
  referredName: string;
  sourcePaymentId: string;
  packId: string;
  amountCents: number;
  status: string;
  holdUntil: number | null;
  createdAt: string | null;
}

export interface AdminWithdrawalRow {
  id: string;
  userName: string;
  userEmail: string | null;
  amountCents: number;
  pixKey: string;
  pixKeyType: string;
  status: string;
  requestedAt: string | null;
  paidAt: string | null;
  rejectReason: string | null;
  payoutRef: string | null;
}

export interface AdminRefundRow {
  id: string;
  paymentId: string;
  userName: string;
  packId: string;
  amountCents: number;
  creditsGranted: number;
  creditsUsedAtRequest: number;
  status: string;
  reason: string | null;
  commissionClawedBack: boolean;
  createdAt: string | null;
}

export interface AdminAuditRow {
  id: string;
  actorType: string;
  actorName: string;
  action: string;
  targetType: string;
  targetId: string;
  affectedName: string | null;
  amountCents: number | null;
  notes: string | null;
  createdAt: string | null;
}

export const fetchReferralStats = () =>
  adminJson<ReferralStats>("/api/admin/referrals/stats");

export const fetchAdminReferrals = () =>
  adminJson<{ referrals: AdminReferralRow[] }>("/api/admin/referrals").then((r) => r.referrals);

export const fetchAdminCommissions = (status?: string) =>
  adminJson<{ commissions: AdminCommissionRow[] }>(
    `/api/admin/commissions${status ? `?status=${status}` : ""}`
  ).then((r) => r.commissions);

export const fetchAdminWithdrawals = (status?: string) =>
  adminJson<{ withdrawals: AdminWithdrawalRow[] }>(
    `/api/admin/withdrawals${status ? `?status=${status}` : ""}`
  ).then((r) => r.withdrawals);

export const fetchAdminRefunds = (status?: string) =>
  adminJson<{ refunds: AdminRefundRow[] }>(
    `/api/admin/refunds${status ? `?status=${status}` : ""}`
  ).then((r) => r.refunds);

export const fetchAdminAuditLogs = (before?: string) =>
  adminJson<{ logs: AdminAuditRow[]; nextCursor: string | null }>(
    `/api/admin/audit-logs${before ? `?before=${encodeURIComponent(before)}` : ""}`
  );

export const commissionAction = (id: string, reason?: string) =>
  adminJson(`/api/admin/commissions/${id}`, {
    method: "POST",
    body: JSON.stringify({ action: "cancel", reason }),
  });

export const withdrawalAction = (
  id: string,
  action: "approve" | "pay" | "reject",
  opts?: { payoutRef?: string; reason?: string }
) =>
  adminJson(`/api/admin/withdrawals/${id}`, {
    method: "POST",
    body: JSON.stringify({ action, ...opts }),
  });

export const refundAction = (id: string, action: "approve" | "reject", reason?: string) =>
  adminJson(`/api/admin/refunds/${id}`, {
    method: "POST",
    body: JSON.stringify({ action, reason }),
  });
