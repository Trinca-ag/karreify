"use client";

import { Check, Save } from "lucide-react";
import type { SaveStatus } from "@/hooks/useSavedItemSaver";

interface SaveButtonProps {
  status: SaveStatus;
  saving?: boolean;
  disabled?: boolean;
  onClick: () => void;
  size?: "sm" | "md";
  className?: string;
}

export default function SaveButton({
  status,
  saving,
  disabled,
  onClick,
  size = "md",
  className = "",
}: SaveButtonProps) {
  const isSaved = status === "saved";
  const isLoading = !!saving;

  const sizes = {
    sm: "px-3 py-1.5 text-sm gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
  };
  const iconSize = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";

  const base =
    "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900";

  const variant = isSaved
    ? "bg-white/[0.04] text-gray-400 border border-white/[0.08] cursor-not-allowed"
    : "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:from-emerald-500 hover:to-emerald-400 focus:ring-emerald-500 shadow-lg shadow-emerald-600/20";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isSaved || disabled || isLoading}
      className={`${base} ${sizes[size]} ${variant} ${
        isLoading ? "opacity-70 cursor-wait" : ""
      } disabled:opacity-60 disabled:hover:from-emerald-600 disabled:hover:to-emerald-500 ${className}`}
      title={
        isSaved
          ? "Documento já salvo em Meus Arquivos"
          : "Salvar em Meus Arquivos"
      }
    >
      {isLoading ? (
        <svg
          className={`animate-spin ${iconSize}`}
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : isSaved ? (
        <Check className={iconSize} />
      ) : (
        <Save className={iconSize} />
      )}
      {isSaved ? "Salvo" : "Salvar"}
    </button>
  );
}
