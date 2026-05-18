"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthContext } from "@/components/providers/AuthProvider";

// Only block access to these pages when already authenticated as a regular
// USER. Admin sessions deliberately don't count as authenticated on the user
// side, so an admin can visit /auth/login and sign in as a user account
// (Firebase Auth will replace the admin session on successful sign-in).
const BLOCKED_WHEN_AUTHED = ["/auth/login", "/auth/register"];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();

  const isBlocked = BLOCKED_WHEN_AUTHED.some(p => pathname?.startsWith(p));

  useEffect(() => {
    if (!loading && isAuthenticated && isBlocked) {
      router.replace("/dashboard");
    }
  }, [loading, isAuthenticated, isBlocked, router]);

  // Show nothing while redirecting to avoid flash
  if (!loading && isAuthenticated && isBlocked) return null;

  return <>{children}</>;
}
