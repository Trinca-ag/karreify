"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuthContext } from "@/components/providers/AuthProvider";
import Button from "@/components/ui/Button";
import {
  Menu,
  X,
  FileText,
  User,
  LogOut,
  Coins,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  FileSearch,
  FilePlus,
  Target,
  Building2,
  TrendingUp,
  FolderOpen,
  Briefcase,
  MessageSquareHeart,
  Settings,
  LifeBuoy,
} from "lucide-react";
import NotificationBell from "@/components/notifications/NotificationBell";

// Mirror of the dashboard sidebar — kept inline so the drawer can render
// the full feature list without coupling Navbar to Sidebar's module shape.
const DRAWER_FEATURES = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Análise de Currículo", href: "/resume-analysis", icon: FileSearch },
  { label: "Criar Currículo", href: "/create-resume", icon: FilePlus },
  { label: "Adaptar para Vaga", href: "/adapt-resume", icon: Target },
  { label: "Carta de Apresentação", href: "/cover-letter", icon: FileText },
  { label: "Análise de Empresa", href: "/company-analysis", icon: Building2 },
  { label: "Vagas", href: "/jobs", icon: Briefcase },
  { label: "Mercado", href: "/market", icon: TrendingUp },
  { label: "Meus Arquivos", href: "/my-files", icon: FolderOpen },
  { label: "Nos ajude a melhorar", href: "/feedback", icon: MessageSquareHeart },
];

const DRAWER_BOTTOM = [
  { label: "Pacotes", href: "/plans#pacotes", icon: Coins },
  { label: "Configurações", href: "/profile", icon: Settings },
  { label: "Suporte", href: "/support", icon: LifeBuoy },
];

export default function Navbar() {
  const { user, userData, isAuthenticated, logout } = useAuthContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();

  // Lock body scroll + ESC-to-close while the mobile drawer is open.
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [mobileMenuOpen]);

  const isLanding = pathname === "/";
  const isDashboard = !isLanding && !pathname.startsWith("/auth") && !pathname.startsWith("/admin");

  return (
    <>
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isLanding
          ? "bg-dark-900/95 md:bg-dark-900/75 backdrop-blur-xl border-b border-white/5"
          : "bg-dark-800/95 md:bg-dark-800/85 backdrop-blur-xl border-b border-white/[0.06]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href={isAuthenticated ? "/dashboard" : "/"}
            className="flex items-center gap-2.5 group"
          >
            <Image
              src="/images/logo-karreify.png"
              alt="Karreify"
              width={200}
              height={100}
              className="object-contain h-7 sm:h-8 lg:h-10 w-auto"
            />
          </Link>

          {/* Desktop navigation */}
          {isLanding && (
            <div className="hidden md:flex items-center gap-7 lg:gap-8">
              {[
                { href: "#features", label: "Funcionalidades" },
                { href: "#how-it-works", label: "Como funciona" },
                { href: "#diferenciais", label: "Diferenciais" },
                { href: "#tecnologia", label: "Tecnologia" },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-gray-400 hover:text-white transition-colors duration-200 relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-primary-500 to-accent-violet transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </div>
          )}

          {/* Right section */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                {isDashboard && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-500/10 border border-primary-500/10 rounded-lg">
                    <Coins className="w-4 h-4 text-primary-400" />
                    <span className="text-sm font-semibold text-primary-300">
                      {userData?.credits ?? 0}
                    </span>
                  </div>
                )}
                {isDashboard && <NotificationBell />}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors hover:bg-white/10 text-gray-300"
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 border border-white/20 overflow-hidden">
                      {userData?.photoURL ? (
                        <Image src={userData.photoURL} alt="" width={32} height={32} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-300">
                      {user?.displayName || "Usuário"}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-2xl py-1 bg-dark-800 border border-white/10">
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm transition-colors text-gray-300 hover:bg-white/5"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <FileText className="w-4 h-4" /> Dashboard
                      </Link>
                      <Link
                        href="/profile"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm transition-colors text-gray-300 hover:bg-white/5"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User className="w-4 h-4" /> Perfil
                      </Link>
                      <hr className="border-white/10 my-1" />
                      <button
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                        }}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 w-full"
                      >
                        <LogOut className="w-4 h-4" /> Sair
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/auth/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="!text-gray-300 hover:!text-white hover:!bg-white/10"
                  >
                    Entrar
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <button className="px-5 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-primary-600 to-accent-violet text-white hover:opacity-90 transition-all duration-200 glow-blue">
                    Criar conta
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile right cluster — notifications + hamburger */}
          <div className="md:hidden flex items-center gap-1">
            {isAuthenticated && isDashboard && <NotificationBell />}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-lg transition-colors hover:bg-white/10 text-gray-300"
              aria-label="Abrir menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>

    {/* Drawer + backdrop are siblings of the <nav>, not children. The nav has
        `backdrop-blur-xl` which becomes the containing block for `fixed`
        descendants and breaks them — same trap documented in Modal.tsx. */}

    {/* Mobile drawer backdrop */}
    {mobileMenuOpen && (
      <div
        className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden
      />
    )}

    {/* Mobile drawer — slides in from the right */}
    <div
      className={`md:hidden fixed inset-y-0 right-0 w-[82vw] max-w-xs z-[70] bg-dark-900 border-l border-white/[0.06] shadow-2xl shadow-black/40 transform transition-transform duration-300 flex flex-col ${
        mobileMenuOpen ? "translate-x-0" : "translate-x-full"
      }`}
      role="dialog"
      aria-modal={mobileMenuOpen ? true : undefined}
      aria-label="Menu de navegação"
    >
        <div className="flex items-center justify-end px-4 h-16 border-b border-white/[0.06]">
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Fechar menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {isAuthenticated ? (
          <>
            {/* Profile card — tap goes to /profile */}
            <Link
              href="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06] hover:bg-white/5 transition-colors"
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white/10 border border-white/20 overflow-hidden flex-shrink-0">
                {userData?.photoURL ? (
                  <Image src={userData.photoURL} alt="" width={48} height={48} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-5 h-5 text-white" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-base font-semibold text-white truncate">
                  {user?.displayName || "Usuário"}
                </div>
                <div className="text-xs text-gray-400 truncate">Ver perfil</div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-500 flex-shrink-0" />
            </Link>

            {/* Scrollable feature list + bottom items */}
            <div className="flex-1 overflow-y-auto py-3">
              <div className="px-2 space-y-0.5">
                {DRAWER_FEATURES.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    <item.icon className="w-5 h-5 text-gray-500" />
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="mx-3 my-3 border-t border-white/[0.06]" />

              <div className="px-2 space-y-0.5">
                {DRAWER_BOTTOM.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    <item.icon className="w-5 h-5 text-gray-500" />
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Logout pinned at the bottom */}
            <div className="px-4 py-4 border-t border-white/[0.06]">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="flex items-center justify-center gap-2 w-full py-3 text-base font-medium rounded-xl border border-red-500/20 bg-red-500/5 text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Sair
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="px-5 py-5 space-y-1 overflow-y-auto flex-1">
              {isLanding &&
                [
                  { href: "#features", label: "Funcionalidades" },
                  { href: "#how-it-works", label: "Como funciona" },
                  { href: "#diferenciais", label: "Diferenciais" },
                  { href: "#tecnologia", label: "Tecnologia" },
                ].map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="block text-lg font-medium py-3 text-gray-300 hover:text-white transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
            </div>

            {/* Auth CTAs pinned to the bottom */}
            <div className="px-5 py-5 border-t border-white/[0.06] flex flex-col gap-3">
              <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                <button className="w-full py-3 text-base font-medium rounded-xl border border-white/10 text-gray-200 hover:bg-white/5 transition-colors">
                  Entrar
                </button>
              </Link>
              <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}>
                <button className="w-full py-3 text-base font-semibold rounded-xl bg-gradient-to-r from-primary-600 to-accent-violet text-white hover:opacity-90 transition-all">
                  Criar conta
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}
