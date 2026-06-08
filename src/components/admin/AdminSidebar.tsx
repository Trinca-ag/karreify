"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Shield, LogOut, Menu, X, MessageSquareHeart, LifeBuoy, Briefcase, Activity, Mail, CreditCard, Gift } from "lucide-react";
import { useAdminAuth } from "@/components/providers/AdminAuthProvider";

const menuItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Usuários", href: "/admin/users", icon: Users },
  { label: "Pagamentos", href: "/admin/payments", icon: CreditCard },
  { label: "Indicações", href: "/admin/referrals", icon: Gift },
  { label: "Passes /jobs", href: "/admin/jobs-passes", icon: Briefcase },
  { label: "Banco de Talentos", href: "/admin/talents", icon: Briefcase },
  { label: "Administradores", href: "/admin/admins", icon: Shield },
  { label: "Suporte", href: "/admin/support", icon: LifeBuoy },
  { label: "Mensagens", href: "/admin/contact", icon: Mail },
  { label: "Feedbacks", href: "/admin/feedbacks", icon: MessageSquareHeart },
  { label: "Jooble", href: "/admin/jooble", icon: Activity },
  { label: "Adzuna", href: "/admin/adzuna", icon: Activity },
];

function NavItem({ item, active, onClick }: { item: typeof menuItems[0]; active: boolean; onClick?: () => void }) {
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border
        ${active
          ? "bg-primary-500/10 text-primary-400 border-primary-500/10"
          : "text-gray-400 hover:bg-white/5 hover:text-gray-200 border-transparent"
        }`}
    >
      <item.icon className={`w-5 h-5 flex-shrink-0 ${active ? "text-primary-400" : "text-gray-500"}`} />
      {item.label}
    </Link>
  );
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const { adminData, logoutAdmin } = useAdminAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="hidden lg:flex flex-col w-64 bg-dark-800 border-r border-white/[0.06] min-h-screen sticky top-0">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/[0.06]">
          <Link href="/admin" className="flex items-center gap-3">
            <Image src="/images/logo-karreify.png" alt="Karreify" width={120} height={30} className="h-7 w-auto" />
            <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-400 text-[9px] font-bold rounded border border-amber-500/20 tracking-widest uppercase">
              Admin
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {menuItems.map(item => (
            <NavItem key={item.href} item={item} active={isActive(item.href)} />
          ))}
        </nav>

        {/* User footer */}
        <div className="px-3 py-4 border-t border-white/[0.06] space-y-1">
          {adminData && (
            <div className="flex items-center gap-3 px-3 py-2 mb-1">
              <div className="w-8 h-8 rounded-full bg-primary-500/10 border border-primary-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-primary-400">{adminData.name[0]?.toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{adminData.name}</p>
                <p className="text-[11px] text-gray-500 truncate">@{adminData.username}</p>
              </div>
            </div>
          )}
          <button
            onClick={logoutAdmin}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-gray-200 transition-all duration-200 border border-transparent"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </aside>

      {/* ── Mobile top bar ── */}
      <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-dark-800 border-b border-white/[0.06] sticky top-0 z-40">
        <Link href="/admin" className="flex items-center gap-2.5">
          <Image src="/images/logo-karreify.png" alt="Karreify" width={100} height={25} className="h-6 w-auto" />
          <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-400 text-[9px] font-bold rounded border border-amber-500/20 tracking-widest uppercase">
            Admin
          </span>
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
      </header>

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-dark-900 border-r border-white/[0.06] flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
              <Link href="/admin" className="flex items-center gap-2.5" onClick={() => setMobileOpen(false)}>
                <Image src="/images/logo-karreify.png" alt="Karreify" width={100} height={25} className="h-6 w-auto" />
                <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-400 text-[9px] font-bold rounded border border-amber-500/20 tracking-widest uppercase">
                  Admin
                </span>
              </Link>
              <button onClick={() => setMobileOpen(false)} className="p-1.5 text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1">
              {menuItems.map(item => (
                <NavItem key={item.href} item={item} active={isActive(item.href)} onClick={() => setMobileOpen(false)} />
              ))}
            </nav>
            <div className="px-3 py-4 border-t border-white/[0.06] space-y-1">
              {adminData && (
                <div className="flex items-center gap-3 px-3 py-2 mb-1">
                  <div className="w-8 h-8 rounded-full bg-primary-500/10 border border-primary-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-primary-400">{adminData.name[0]?.toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{adminData.name}</p>
                    <p className="text-[11px] text-gray-500 truncate">@{adminData.username}</p>
                  </div>
                </div>
              )}
              <button
                onClick={logoutAdmin}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-gray-200 transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
