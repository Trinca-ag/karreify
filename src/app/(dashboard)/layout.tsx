"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/components/providers/AuthProvider";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading, deviceVerified, isAdmin } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    // Check isAdmin first — isAuthenticated now excludes admin sessions, so
    // an admin Firebase session has isAuthenticated=false. Without this
    // ordering, admins would be sent to /auth/login instead of /admin.
    if (isAdmin) {
      router.push("/admin");
    } else if (!isAuthenticated) {
      router.push("/auth/login");
    } else if (!deviceVerified) {
      router.push("/auth/verify");
    }
  }, [isAuthenticated, loading, deviceVerified, isAdmin, router]);

  if (loading || !isAuthenticated || isAdmin || !deviceVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <LoadingSpinner size="lg" text="Carregando..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 text-white overflow-x-hidden">
      <Navbar />
      <div className="flex pt-16">
        <Sidebar />
        {/* min-w-0 lets the flex item shrink to fit the viewport. Without it,
            `flex-1`'s default `min-width: auto` lets wide inner content push
            <main> beyond the container, causing body-level horizontal scroll. */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-auto">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
