"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthContext } from "@/components/providers/AuthProvider";

// Only block access to these pages when already authenticated
const BLOCKED_WHEN_AUTHED = ["/auth/login", "/auth/register"];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();

  const isBlocked = BLOCKED_WHEN_AUTHED.some(p => pathname?.startsWith(p));

  useEffect(() => {
    if (!loading && user && isBlocked) {
      router.replace("/dashboard");
    }
  }, [loading, user, isBlocked, router]);

  // Show nothing while redirecting to avoid flash
  if (!loading && user && isBlocked) return null;

  return <>{children}</>;
}
