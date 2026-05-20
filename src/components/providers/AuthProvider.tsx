"use client";

import { createContext, useContext, useMemo, ReactNode } from "react";
import { User as FirebaseUser } from "firebase/auth";
import { useAuth } from "@/hooks/useAuth";
import type { User } from "@/types";

interface AuthContextType {
  user: FirebaseUser | null;
  userData: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  deviceVerified: boolean;
  isAdmin: boolean;
  logout: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  markDeviceVerified: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  isAuthenticated: false,
  deviceVerified: false,
  isAdmin: false,
  logout: async () => {},
  refreshUserData: async () => {},
  markDeviceVerified: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();

  // useAuth returns a fresh object on every render. Without memoization,
  // every consumer of AuthContext re-renders on any unrelated parent
  // re-render — and AuthProvider sits above the entire app. We depend on
  // each field individually (not `auth`) on purpose: depending on `auth`
  // would defeat the memo since the object identity changes every render.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const value = useMemo<AuthContextType>(() => auth, [
    auth.user,
    auth.userData,
    auth.loading,
    auth.isAuthenticated,
    auth.deviceVerified,
    auth.isAdmin,
    auth.logout,
    auth.refreshUserData,
    auth.markDeviceVerified,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
