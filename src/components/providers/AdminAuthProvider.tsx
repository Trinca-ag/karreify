"use client";

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { User as FirebaseUser, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter, usePathname } from "next/navigation";
import type { AdminProfile } from "@/services/admin";

interface AdminAuthContextType {
  adminUser: FirebaseUser | null;
  adminData: AdminProfile | null;
  loading: boolean;
  isAdminAuthenticated: boolean;
  logoutAdmin: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  adminUser: null,
  adminData: null,
  loading: true,
  isAdminAuthenticated: false,
  logoutAdmin: async () => {},
});

// Only the login page is public (no auth required)
const PUBLIC_PATHS = ["/admin/login"];
// Redirect already-authenticated admins away from login
const LOGIN_ONLY_PATHS = ["/admin/login"];

const isPublic = (p: string | null) => !!p && PUBLIC_PATHS.some(x => p.startsWith(x));
const isLogin = (p: string | null) => !!p && LOGIN_ONLY_PATHS.some(x => p.startsWith(x));

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [adminUser, setAdminUser] = useState<FirebaseUser | null>(null);
  const [adminData, setAdminData] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Track the uid we last fetched /api/admin/me for. If the same user fires
  // onAuthStateChanged again (token refresh, tab focus, etc.) we skip the
  // network roundtrip — saves a /me + Firestore read on every navigation that
  // would previously bounce through this effect.
  const verifiedUidRef = useRef<string | null>(null);

  // Auth subscription runs ONCE for the lifetime of the provider. Path-based
  // redirect lives in a separate effect below so route changes don't tear down
  // and recreate the Firebase listener (which forced a token refresh + /me
  // fetch on every admin navigation).
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        verifiedUidRef.current = null;
        setAdminUser(null);
        setAdminData(null);
        setLoading(false);
        return;
      }

      // Same user re-firing — keep existing state, no network roundtrip.
      if (verifiedUidRef.current === user.uid) {
        setAdminUser(user);
        setLoading(false);
        return;
      }

      try {
        const token = await user.getIdToken();
        const res = await fetch("/api/admin/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          verifiedUidRef.current = null;
          setAdminUser(null);
          setAdminData(null);
          setLoading(false);
          return;
        }

        const json = await res.json();
        verifiedUidRef.current = user.uid;
        setAdminUser(user);
        setAdminData(json.data as AdminProfile);
        setLoading(false);
      } catch {
        verifiedUidRef.current = null;
        setAdminUser(null);
        setAdminData(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Path-based redirects react to auth state + pathname without resubscribing
  // to Firebase. Only kicks in after loading resolves so we don't bounce users
  // to /login before the initial check finishes.
  useEffect(() => {
    if (loading) return;
    if (!adminUser && !isPublic(pathname)) {
      router.push("/admin/login");
      return;
    }
    if (adminUser && isLogin(pathname)) {
      router.push("/admin");
    }
  }, [loading, adminUser, pathname, router]);

  const logoutAdmin = async () => {
    verifiedUidRef.current = null;
    await signOut(auth);
    router.push("/admin/login");
  };

  return (
    <AdminAuthContext.Provider value={{ adminUser, adminData, loading, isAdminAuthenticated: !!adminUser, logoutAdmin }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}
