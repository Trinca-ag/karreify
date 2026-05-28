"use client";

import { Cookie } from "lucide-react";

interface CookieFloatingButtonProps {
  onClick: () => void;
}

export default function CookieFloatingButton({
  onClick,
}: CookieFloatingButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Gerenciar preferências de cookies"
      title="Gerenciar cookies"
      className="group fixed bottom-5 right-5 z-40 w-12 h-12 rounded-full bg-dark-800/95 backdrop-blur-md border border-white/10 shadow-lg shadow-black/30 hidden sm:flex items-center justify-center hover:border-emerald-400/40 hover:shadow-emerald-500/20 transition-all duration-200"
    >
      <Cookie className="w-5 h-5 text-gray-400 group-hover:text-emerald-300 transition-colors" />
      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-dark-900 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}
