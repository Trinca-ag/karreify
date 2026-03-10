"use client";

import { useState } from "react";
import Link from "next/link";
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
} from "lucide-react";

export default function Navbar() {
  const { user, userData, isAuthenticated, logout } = useAuthContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();

  const isLanding = pathname === "/";
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <nav
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isLanding
          ? "bg-dark-900/60 backdrop-blur-xl border-b border-white/5"
          : "bg-dark-800/80 backdrop-blur-xl border-b border-white/[0.06]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href={isAuthenticated ? "/dashboard" : "/"}
            className="flex items-center gap-2.5 group"
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
                isLanding
                  ? "bg-gradient-to-br from-primary-500 to-accent-violet glow-blue"
                  : "bg-primary-600"
              }`}
            >
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span
              className={`text-xl font-heading font-bold ${
                isLanding ? "text-white" : "text-gray-900"
              }`}
            >
              Next
              <span
                className={
                  isLanding ? "gradient-text" : "text-primary-600"
                }
              >
                CV
              </span>
            </span>
          </Link>

          {/* Desktop navigation */}
          {isLanding && !isAuthenticated && (
            <div className="hidden md:flex items-center gap-8">
              {[
                { href: "#features", label: "Funcionalidades" },
                { href: "#how-it-works", label: "Como funciona" },
                { href: "#pricing", label: "Planos" },
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
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors hover:bg-white/10 text-gray-300"
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 border border-white/20">
                      <User className="w-4 h-4 text-white" />
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
                        href="/dashboard/profile"
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

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg transition-colors hover:bg-white/10 text-gray-300"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div
          className="md:hidden border-t border-white/5 bg-dark-900/95 backdrop-blur-xl"
        >
          <div className="px-4 py-4 space-y-3">
            {isLanding && !isAuthenticated && (
              <>
                {[
                  { href: "#features", label: "Funcionalidades" },
                  { href: "#how-it-works", label: "Como funciona" },
                  { href: "#pricing", label: "Planos" },
                ].map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="block text-sm py-2 text-gray-400 hover:text-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
              </>
            )}
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className={`block text-sm py-2 ${
                    isLanding ? "text-gray-300" : "text-gray-700"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/profile"
                  className={`block text-sm py-2 ${
                    isLanding ? "text-gray-300" : "text-gray-700"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Perfil
                </Link>
                <button
                  onClick={logout}
                  className="block text-sm text-red-400 py-2"
                >
                  Sair
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <button className="w-full py-2.5 text-sm font-medium rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition-colors">
                    Entrar
                  </button>
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <button className="w-full py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-primary-600 to-accent-violet text-white hover:opacity-90 transition-all">
                    Criar conta
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
