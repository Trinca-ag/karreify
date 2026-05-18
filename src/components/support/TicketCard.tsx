"use client";

import Link from "next/link";
import { MessageSquare, ImageIcon, ArrowUpRight, User as UserIcon } from "lucide-react";
import TicketStatusBadge from "./TicketStatusBadge";
import type { Ticket } from "@/types";

function formatRelative(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "Agora";
  if (min < 60) return `Há ${min} min`;
  const hours = Math.floor(min / 60);
  if (hours < 24) return `Há ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `Há ${days}d`;
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

export default function TicketCard({
  ticket,
  href,
  showRequester = false,
}: {
  ticket: Ticket;
  href: string;
  showRequester?: boolean;
}) {
  return (
    <Link
      href={href}
      className="group relative block bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-5 hover:border-primary-500/30 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
    >
      {/* Gradient hover effect */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-primary-500/0 group-hover:bg-primary-500/10 rounded-full blur-3xl transition-all duration-500 pointer-events-none" />

      <div className="relative flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center px-2 py-0.5 bg-primary-500/10 border border-primary-500/20 rounded-md text-[11px] font-mono font-semibold text-primary-300">
            #{ticket.id}
          </span>
          <TicketStatusBadge status={ticket.status} />
        </div>
        <ArrowUpRight className="w-4 h-4 text-gray-600 group-hover:text-primary-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0" />
      </div>

      <h3 className="relative text-base font-semibold text-white leading-snug line-clamp-2 group-hover:text-primary-300 transition-colors mb-2">
        {ticket.title}
      </h3>
      <p className="relative text-sm text-gray-400 line-clamp-2 leading-relaxed mb-4">
        {ticket.description}
      </p>

      <div className="relative flex items-center justify-between gap-3 text-xs text-gray-500">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="inline-flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5" />
            {ticket.messageCount}
          </span>
          {ticket.images.length > 0 && (
            <span className="inline-flex items-center gap-1">
              <ImageIcon className="w-3.5 h-3.5" />
              {ticket.images.length}
            </span>
          )}
          {showRequester && ticket.userName && (
            <span className="inline-flex items-center gap-1 truncate max-w-[160px]">
              <UserIcon className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{ticket.userName}</span>
            </span>
          )}
        </div>
        <span className="flex-shrink-0">{formatRelative(ticket.lastMessageAt)}</span>
      </div>
    </Link>
  );
}
