"use client";

import { Shield, User as UserIcon } from "lucide-react";
import type { TicketMessage } from "@/types";

function formatTime(date: Date): string {
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MessageBubble({ message }: { message: TicketMessage }) {
  // Layout fixo por papel: o solicitante (user) sempre à ESQUERDA, o suporte
  // (admin) sempre à DIREITA. Isso é mais previsível que alinhar pelo "self"
  // do viewer (que confundia o próprio usuário ao ver suas próprias respostas
  // do lado oposto à descrição original do chamado).
  const isAdmin = message.senderRole === "admin";
  return (
    <div
      className={`flex gap-3 animate-fade-in-up ${
        isAdmin ? "flex-row-reverse" : ""
      }`}
    >
      <div
        className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center border ${
          isAdmin
            ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
            : "bg-primary-500/10 border-primary-500/30 text-primary-300"
        }`}
      >
        {isAdmin ? <Shield className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
      </div>
      <div className="flex-1 min-w-0">
        <div
          className={`flex items-baseline gap-2 mb-1 ${
            isAdmin ? "flex-row-reverse" : ""
          }`}
        >
          <span
            className={`text-xs font-semibold ${
              isAdmin ? "text-amber-300" : "text-white"
            }`}
          >
            {message.senderName}
            {isAdmin && (
              <span className="ml-1.5 px-1.5 py-0.5 bg-amber-500/10 text-amber-400 text-[9px] rounded border border-amber-500/20 tracking-widest uppercase font-bold">
                Suporte
              </span>
            )}
          </span>
          <span className="text-[10px] text-gray-600">
            {formatTime(message.createdAt)}
          </span>
        </div>
        {/* Outer flex pushes the bubble to the right when admin. The bubble
            itself keeps text-left so the content reads normally. */}
        <div className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}>
          <div
            className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed break-words whitespace-pre-wrap text-left ${
              isAdmin
                ? "bg-amber-500/[0.08] border border-amber-500/20 text-gray-100"
                : "bg-primary-500/[0.08] border border-primary-500/20 text-gray-100"
            }`}
          >
            {message.content}
          </div>
        </div>
      </div>
    </div>
  );
}
