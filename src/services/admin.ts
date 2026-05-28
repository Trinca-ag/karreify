import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export interface AdminProfile {
  uid: string;
  name: string;
  username: string;
  email: string;
  role: "admin" | "superadmin";
  createdAt: unknown;
}

export interface AdminUserRow {
  uid: string;
  displayName: string | null;
  email: string;
  credits: number;
  role: "user" | "tester";
  createdAt: string;
}

export interface AdminFeedbackRow {
  id: string;
  uid: string;
  userName: string | null;
  userEmail: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface AdminContactMessageRow {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  topic: "help" | "terms" | "privacy";
  status: "new" | "read" | "resolved";
  ip: string;
  userAgent: string;
  createdAt: string;
}

export interface AdminTalentRow {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  profession: string;
  links: string[];
  source: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminPaymentErrorEntry {
  source: string;
  code: string;
  message: string;
  timestamp: string;
  event?: string;
  httpStatus?: number;
  body?: string;
  stack?: string | null;
}

export interface AdminPaymentRow {
  id: string;
  userId: string;
  user: { uid: string; displayName: string | null; email: string | null } | null;
  packId: string;
  amount: number;
  creditsToAdd: number;
  status: "pending" | "completed" | "refunded" | "disputed" | "failed";
  abacateCheckoutId: string | null;
  abacateProductId: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  completedAt: string | null;
  refundedAt: string | null;
  errors: AdminPaymentErrorEntry[];
  lastError: AdminPaymentErrorEntry | null;
}

export interface AdminJobsPassRow {
  id: string;
  userId: string;
  user: { uid: string; displayName: string | null; email: string | null } | null;
  passId: string | null;
  amount: number;
  description: string;
  createdAt: string | null;
}

export interface AdminStats {
  totalUsers: number;
  totalAdmins: number;
  totalCreditsUsed: number;
  featureUsage: Record<string, number>;
  recentUsers: AdminUserRow[];
}

export async function getMyAdminProfile(uid: string): Promise<AdminProfile | null> {
  const snap = await getDoc(doc(db, "admins", uid));
  if (!snap.exists()) return null;
  return { uid, ...snap.data() } as AdminProfile;
}

// `getIdToken()` (sem o forceRefresh=true) usa o token em cache e só faz
// roundtrip ao Firebase quando o token está perto de expirar (auto-refresh).
// Passar `true` aqui paga ~100-500ms a cada chamada admin — fazia o painel
// inteiro parecer travado em navegações sequenciais.
export async function adminFetch(url: string, options?: RequestInit): Promise<Response> {
  const token = await auth.currentUser?.getIdToken();
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
}
