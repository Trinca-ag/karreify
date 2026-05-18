"use client";

import { useEffect, useRef } from "react";
import { MessageSquare } from "lucide-react";
import MessageBubble from "./MessageBubble";
import type { TicketMessage } from "@/types";

export default function MessageThread({
  messages,
  loading,
}: {
  messages: TicketMessage[];
  loading?: boolean;
}) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Scroll into view whenever a new message arrives.
  useEffect(() => {
    if (!loading && messages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 rounded-full border-2 border-primary-500/30 border-t-primary-400 animate-spin" />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
        <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
          <MessageSquare className="w-5 h-5 text-gray-500" />
        </div>
        <div>
          <p className="text-sm text-gray-300 font-medium">Nenhuma resposta ainda</p>
          <p className="text-xs text-gray-500 mt-0.5">
            A primeira resposta aparecerá aqui em tempo real.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {messages.map((m) => (
        <MessageBubble key={m.id} message={m} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
