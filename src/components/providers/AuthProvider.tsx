"use client";

import { createContext, useContext, ReactNode } from "react";
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

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
