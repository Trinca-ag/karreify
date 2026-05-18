"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Send, Lock, ImageOff } from "lucide-react";
import TicketStatusBadge from "@/components/support/TicketStatusBadge";
import TicketImages from "@/components/support/TicketImages";
import MessageThread from "@/components/support/MessageThread";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useAuthContext } from "@/components/providers/AuthProvider";
import {
  sendTicketMessage,
  subscribeTicket,
  subscribeTicketMessages,
} from "@/services/tickets";
import type { Ticket, TicketMessage } from "@/types";
import { TICKET_MAX_MESSAGE } from "@/types";
import toast from "react-hot-toast";

export default function UserTicketDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user, userData, loading: authLoading } = useAuthContext();
  const ticketId = params?.id;

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [loadingTicket, setLoadingTicket] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const replyRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (!ticketId) return;
    setLoadingTicket(true);
    const unsub = subscribeTicket(
      ticketId,
      (t) => {
        setTicket(t);
        setLoadingTicket(false);
      },
      () => setLoadingTicket(false)
    );
    return () => unsub();
  }, [ticketId]);

  useEffect(() => {
    if (!ticketId) return;
    setLoadingMessages(true);
    const unsub = subscribeTicketMessages(
      ticketId,
      (m) => {
        setMessages(m);
        setLoadingMessages(false);
      },
      () => setLoadingMessages(false)
    );
    return () => unsub();
  }, [ticketId]);

  const handleSend = async () => {
    if (!ticketId || !user || !userData || sending) return;
    const trimmed = reply.trim();
    if (!trimmed) return;
    setSending(true);
    try {
      await sendTicketMessage(
        ticketId,
        { uid: user.uid, role: "user", name: userData.displayName || user.email || "Usuário" },
        trimmed
      );
      setReply("");
      replyRef.current?.focus();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao enviar.");
    } finally {
      setSending(false);
    }
  };

  if (authLoading || loadingTicket) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Carregando chamado..." />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="space-y-6">
        <BackLink />
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-12 text-center">
          <p className="text-white font-semibold mb-1">Chamado não encontrado</p>
          <p className="text-sm text-gray-400">
            O chamado pode ter sido removido ou você não tem permissão para acessá-lo.
          </p>
        </div>
      </div>
    );
  }

  // Defensive: shouldn't reach here for tickets that aren't the user's, but the
  // rules would block message access anyway.
  if (ticket.userId !== user?.uid) {
    router.replace("/support");
    return null;
  }

  const closed = ticket.status === "closed";

  return (
    <div className="space-y-6 animate-fade-in-up">
      <BackLink />

      {/* Header */}
      <section className="relative overflow-hidden bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-6 md:p-8">
        <div className="absolute -top-16 -right-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* ID + Status row */}
        <div className="relative flex items-start justify-between gap-4 flex-wrap mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-xl">
              <span className="text-xs uppercase tracking-wider text-primary-400/80 font-semibold">ID:</span>
              <span className="font-mono font-bold text-primary-300 text-lg leading-none">
                #{ticket.id}
              </span>
            </div>
            <div className="inline-flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                Status:
              </span>
              <TicketStatusBadge status={ticket.status} size="md" />
            </div>
          </div>
          <span className="text-xs text-gray-500 mt-2">
            Aberto em {ticket.createdAt.toLocaleString("pt-BR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>

        {/* Title */}
        <div className="relative mb-5">
          <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1.5">
            Título
          </p>
          <h1 className="text-2xl md:text-3xl font-bold font-heading text-white leading-tight">
            {ticket.title}
          </h1>
        </div>

        {/* Description */}
        <div className="relative">
          <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1.5">
            Descrição
          </p>
          <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
            {ticket.description}
          </p>
        </div>

        {ticket.images.length > 0 && (
          <div className="relative mt-5">
            <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">
              Anexos
            </p>
            <TicketImages urls={ticket.images} />
          </div>
        )}

        {ticket.images.length === 0 && ticket.imagesDeleted && (
          <div className="relative mt-5">
            <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">
              Anexos
            </p>
            <div className="flex items-start gap-2.5 p-3 bg-white/[0.03] border border-white/[0.06] rounded-xl">
              <ImageOff className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-gray-400 leading-relaxed">
                Os anexos deste chamado foram removidos quando ele foi finalizado.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Closed banner */}
      {closed && (
        <div className="flex items-start gap-3 p-4 bg-amber-500/[0.07] border border-amber-500/20 rounded-2xl animate-fade-in-up">
          <Lock className="w-5 h-5 text-amber-300 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-200">Chamado finalizado</p>
            <p className="text-xs text-amber-200/70 mt-0.5 leading-relaxed">
              {ticket.closedAt
                ? `Encerrado em ${ticket.closedAt.toLocaleString("pt-BR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}.`
                : "Encerrado por um administrador."}
              {" "}Não é mais possível enviar novas mensagens neste chamado.
              {ticket.imagesDeleted && " Os anexos enviados também foram removidos."}
            </p>
          </div>
        </div>
      )}

      {/* Thread */}
      <section className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-6 md:p-8">
        <MessageThread messages={messages} loading={loadingMessages} />
      </section>

      {/* Reply box */}
      {!closed && (
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-4 md:p-5 sticky bottom-4 animate-fade-in-up">
          <textarea
            ref={replyRef}
            value={reply}
            onChange={(e) => setReply(e.target.value.slice(0, TICKET_MAX_MESSAGE))}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                handleSend();
              }
            }}
            rows={3}
            placeholder="Escreva uma resposta... (Ctrl/⌘ + Enter para enviar)"
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all text-sm resize-none leading-relaxed"
            disabled={sending}
          />
          <div className="flex items-center justify-between gap-3 mt-2">
            <span className="text-[11px] text-gray-500 tabular-nums">
              {reply.length}/{TICKET_MAX_MESSAGE}
            </span>
            <button
              onClick={handleSend}
              disabled={sending || !reply.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-500 text-white text-sm font-semibold rounded-xl hover:from-primary-500 hover:to-primary-400 shadow-lg shadow-primary-600/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <Send className="w-4 h-4" />
              {sending ? "Enviando..." : "Enviar"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function BackLink() {
  return (
    <Link
      href="/support"
      className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-primary-400 transition-colors"
    >
      <ArrowLeft className="w-4 h-4" />
      Voltar para Suporte
    </Link>
  );
}
