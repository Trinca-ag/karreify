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
  plan: string;
  credits: number;
  createdAt: string;
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

export async function adminFetch(url: string, options?: RequestInit): Promise<Response> {
  const token = await auth.currentUser?.getIdToken(true);
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
}
