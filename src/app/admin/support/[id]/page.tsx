"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Send, Lock, ShieldCheck, AlertTriangle, ImageOff } from "lucide-react";
import TicketStatusBadge from "@/components/support/TicketStatusBadge";
import TicketImages from "@/components/support/TicketImages";
import MessageThread from "@/components/support/MessageThread";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { useAdminAuth } from "@/components/providers/AdminAuthProvider";
import {
  closeTicket as closeTicketApi,
  sendTicketMessage,
  subscribeTicket,
  subscribeTicketMessages,
} from "@/services/tickets";
import type { Ticket, TicketMessage } from "@/types";
import { TICKET_MAX_MESSAGE } from "@/types";
import toast from "react-hot-toast";

export default function AdminTicketDetailPage() {
  const params = useParams<{ id: string }>();
  const { adminUser, adminData } = useAdminAuth();
  const ticketId = params?.id;

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [loadingTicket, setLoadingTicket] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [closing, setClosing] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);
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
    if (!ticketId || !adminUser || !adminData || sending) return;
    const trimmed = reply.trim();
    if (!trimmed) return;
    setSending(true);
    try {
      await sendTicketMessage(
        ticketId,
        { uid: adminUser.uid, role: "admin", name: adminData.name || "Suporte" },
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

  const handleClose = async () => {
    if (!ticketId || closing) return;
    setClosing(true);
    try {
      await closeTicketApi(ticketId);
      toast.success("Chamado finalizado");
      setConfirmClose(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao fechar chamado.");
    } finally {
      setClosing(false);
    }
  };

  if (loadingTicket) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-primary-500/30 border-t-primary-400 animate-spin" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="space-y-6">
        <BackLink />
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-12 text-center">
          <p className="text-white font-semibold mb-1">Chamado não encontrado</p>
        </div>
      </div>
    );
  }

  const closed = ticket.status === "closed";

  return (
    <div className="space-y-6 animate-fade-in-up">
      <BackLink />

      {/* Header */}
      <section className="relative overflow-hidden bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 md:p-8">
        <div className="absolute -top-16 -right-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* ID + Status row + close action */}
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
          {!closed && (
            <button
              onClick={() => setConfirmClose(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-300 text-sm font-medium rounded-xl transition-all"
            >
              <Lock className="w-4 h-4" /> Finalizar chamado
            </button>
          )}
        </div>

        {/* Requester */}
        <div className="relative mb-5">
          <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1.5">
            Solicitante
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-300 flex-wrap">
            <span className="text-white font-medium">{ticket.userName}</span>
            <span className="text-gray-500">·</span>
            <span>{ticket.userEmail}</span>
            <span className="text-gray-500">·</span>
            <span className="text-gray-400">
              Aberto em {ticket.createdAt.toLocaleString("pt-BR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
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
                Os anexos deste chamado foram removidos automaticamente quando o chamado foi finalizado.
              </p>
            </div>
          </div>
        )}
      </section>

      {closed && (
        <div className="flex items-start gap-3 p-4 bg-amber-500/[0.07] border border-amber-500/20 rounded-2xl">
          <ShieldCheck className="w-5 h-5 text-amber-300 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-200">Chamado finalizado</p>
            <p className="text-xs text-amber-200/70 mt-0.5 leading-relaxed">
              {ticket.closedAt
                ? `Encerrado em ${ticket.closedAt.toLocaleString("pt-BR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}.`
                : "Encerrado."}
              {" "}Nenhuma das partes pode enviar novas mensagens.
              {ticket.imagesDeleted && " Os anexos foram apagados do storage."}
            </p>
          </div>
        </div>
      )}

      {/* Thread */}
      <section className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 md:p-8">
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
            placeholder="Responder como Suporte... (Ctrl/⌘ + Enter para enviar)"
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

      {/* Close confirmation */}
      <Modal isOpen={confirmClose} onClose={() => !closing && setConfirmClose(false)} title="Finalizar chamado" size="sm">
        <div className="space-y-5">
          <div className="flex items-start gap-3 p-4 bg-red-500/5 border border-red-500/15 rounded-xl">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-300 leading-relaxed">
              Após finalizar, <span className="text-white font-semibold">nem você nem o usuário</span> poderão mais enviar mensagens neste chamado.
              {ticket.images.length > 0 && (
                <> Todos os {ticket.images.length} anexo{ticket.images.length === 1 ? "" : "s"} também serão <span className="text-white font-semibold">removidos do armazenamento</span>.</>
              )}
              {" "}Esta ação não pode ser desfeita.
            </p>
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setConfirmClose(false)} disabled={closing}>
              Cancelar
            </Button>
            <button
              onClick={handleClose}
              disabled={closing}
              className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-colors text-sm font-medium disabled:opacity-50"
            >
              {closing ? "Finalizando..." : "Finalizar chamado"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function BackLink() {
  return (
    <Link
      href="/admin/support"
      className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-primary-400 transition-colors"
    >
      <ArrowLeft className="w-4 h-4" />
      Voltar para Suporte
    </Link>
  );
}
