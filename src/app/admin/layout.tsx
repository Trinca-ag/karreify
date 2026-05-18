"use client";

import { usePathname } from "next/navigation";
import { AdminAuthProvider, useAdminAuth } from "@/components/providers/AdminAuthProvider";
import AdminSidebar from "@/components/admin/AdminSidebar";


function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { loading, isAdminAuthenticated } = useAdminAuth();
  const isLoginPage = pathname?.startsWith("/admin/login");

  // Login page: always standalone, auth check handled by AdminAuthProvider
  if (isLoginPage) return <>{children}</>;

  // Show spinner while auth is resolving OR while we're waiting for the
  // AdminAuthProvider's redirect to /admin/login to complete. Without the
  // !isAdminAuthenticated guard, the admin sidebar + page content flashed for
  // an instant between `loading: false` and the router push landing.
  if (loading || !isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-primary-500/30 border-t-primary-400 animate-spin" />
      </div>
    );
  }

  // lg:flex → desktop side-by-side; mobile → stacked (AdminSidebar shows mobile header at top, then main below)
  return (
    <div className="min-h-screen bg-dark-900 lg:flex">
      <AdminSidebar />
      <main className="flex-1 min-w-0 overflow-auto">
        <div className="max-w-7xl mx-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminShell>{children}</AdminShell>
    </AdminAuthProvider>
  );
}
