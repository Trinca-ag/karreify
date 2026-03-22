"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
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

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [adminUser, setAdminUser] = useState<FirebaseUser | null>(null);
  const [adminData, setAdminData] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const isPublicPage = PUBLIC_PATHS.some(p => pathname?.startsWith(p));
  const isLoginPage = LOGIN_ONLY_PATHS.some(p => pathname?.startsWith(p));

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setAdminUser(null);
        setAdminData(null);
        setLoading(false);
        if (!isPublicPage) router.push("/admin/login");
        return;
      }

      try {
        const token = await user.getIdToken(true);
        const res = await fetch("/api/admin/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          // Authenticated but not an admin
          setAdminUser(null);
          setAdminData(null);
          setLoading(false);
          if (!isPublicPage) router.push("/admin/login");
          return;
        }

        const json = await res.json();
        setAdminUser(user);
        setAdminData(json.data as AdminProfile);
        setLoading(false);
        // Only auto-redirect away from the login page, not register
        if (isLoginPage) router.push("/admin");
      } catch {
        setAdminUser(null);
        setAdminData(null);
        setLoading(false);
        if (!isPublicPage) router.push("/admin/login");
      }
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const logoutAdmin = async () => {
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
