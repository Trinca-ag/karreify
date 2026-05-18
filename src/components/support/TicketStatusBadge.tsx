"use client";

import { CheckCircle2, Clock } from "lucide-react";
import type { TicketStatus } from "@/types";

export default function TicketStatusBadge({
  status,
  size = "sm",
}: {
  status: TicketStatus;
  size?: "sm" | "md";
}) {
  const isOpen = status === "open";
  const Icon = isOpen ? Clock : CheckCircle2;
  const label = isOpen ? "Aberto" : "Finalizado";
  const padding = size === "md" ? "px-4 py-2" : "px-2.5 py-1";
  const text = size === "md" ? "text-sm font-semibold" : "text-[11px] font-medium";
  const iconSize = size === "md" ? "w-4 h-4" : "w-3 h-3";
  const color = isOpen
    ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
    : "bg-white/[0.04] text-gray-400 border-white/10";
  return (
    <span
      className={`inline-flex items-center gap-1.5 ${padding} rounded-full border ${text} ${color}`}
    >
      <Icon className={iconSize} />
      {label}
    </span>
  );
}
