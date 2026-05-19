"use client";

import { FileText, Shield, Sparkles, Mail, Lock, Save, Trash2, ChevronRight, LifeBuoy, MessageCircle, CheckCircle2, Heart } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  canSaveFromNotification,
  isDocumentSaved,
  isNotificationExpired,
} from "@/services/notifications";
import type { Notification } from "@/types";

interface NotificationItemProps {
  notification: Notification;
  saving: boolean;
  onSave: () => void;
  onDelete: () => void;
  onOpen: () => void;
}

function iconFor(type: Notification["type"]): { Icon: LucideIcon; tint: string } {
  switch (type) {
    case "document-generated":
      return { Icon: FileText, tint: "text-primary-400 bg-primary-500/10 border-primary-500/20" };
    case "role-change":
      return { Icon: Shield, tint: "text-amber-400 bg-amber-500/10 border-amber-500/20" };
    case "welcome":
      return { Icon: Sparkles, tint: "text-accent-violet bg-accent-violet/10 border-accent-violet/20" };
    case "email-changed":
      return { Icon: Mail, tint: "text-sky-400 bg-sky-500/10 border-sky-500/20" };
    case "password-changed":
      return { Icon: Lock, tint: "text-orange-400 bg-orange-500/10 border-orange-500/20" };
    case "ticket-created":
      return { Icon: LifeBuoy, tint: "text-primary-400 bg-primary-500/10 border-primary-500/20" };
    case "ticket-reply":
      return { Icon: MessageCircle, tint: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" };
    case "ticket-closed":
      return { Icon: CheckCircle2, tint: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" };
    case "feedback-thanks":
      return { Icon: Heart, tint: "text-pink-400 bg-pink-500/10 border-pink-500/20" };
  }
}

function formatRelative(date: Date): string {
  const diff = Date.now() - date.getTime();
  const min = Math.floor(diff / 60_000);
  if (min < 1) return "agora";
  if (min < 60) return `${min} min`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} h`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day} d`;
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

export default function NotificationItem({
  notification,
  saving,
  onSave,
  onDelete,
  onOpen,
}: NotificationItemProps) {
  const expired = isNotificationExpired(notification);
  const saved = isDocumentSaved(notification);
  const canSave = canSaveFromNotification(notification) && !saving;
  const isDoc = notification.type === "document-generated";
  const isTicket =
    notification.type === "ticket-created" ||
    notification.type === "ticket-reply" ||
    notification.type === "ticket-closed";
  const { Icon, tint } = iconFor(notification.type);
  const clickable = (isDoc && !expired) || (isTicket && !!notification.ticketId);

  return (
    <div
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onClick={() => clickable && onOpen()}
      onKeyDown={(e) => {
        if (clickable && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onOpen();
        }
      }}
      className={`relative flex items-start gap-3 px-4 py-3 border-b border-white/[0.04] transition-colors ${
        expired ? "opacity-50 cursor-default" : clickable ? "cursor-pointer hover:bg-white/[0.03]" : "cursor-default"
      } ${notification.read ? "" : "bg-primary-500/[0.04]"}`}
    >
      <div className={`w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0 ${tint}`}>
        <Icon className="w-4 h-4" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-sm leading-snug ${notification.read ? "text-gray-300" : "text-white font-semibold"}`}>
            {notification.title}
          </p>
          {!notification.read && !expired && (
            <span className="w-2 h-2 rounded-full bg-primary-400 mt-1.5 flex-shrink-0" />
          )}
        </div>
        <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
          {notification.message}
          {saved && isDoc && (
            <span className="ml-1 text-emerald-400">Salvo.</span>
          )}
          {expired && isDoc && (
            <span className="ml-1 text-gray-500">Expirado.</span>
          )}
        </p>

        <div className="flex items-center gap-2 mt-2">
          <span className="text-[10px] uppercase tracking-wider text-gray-500">
            {formatRelative(notification.createdAt)}
          </span>

          {canSave && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSave();
              }}
              disabled={saving}
              className="ml-auto inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-primary-500/15 text-primary-300 border border-primary-500/30 hover:bg-primary-500/25 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <span className="w-3 h-3 border-2 border-primary-300/30 border-t-primary-300 rounded-full animate-spin" />
              ) : (
                <Save className="w-3 h-3" />
              )}
              Salvar
            </button>
          )}

          {clickable && !canSave && (
            <span className="ml-auto inline-flex items-center gap-1 text-[11px] text-gray-500">
              Abrir <ChevronRight className="w-3 h-3" />
            </span>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="absolute top-2 right-2 p-1 rounded-md text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
        aria-label="Remover notificação"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
