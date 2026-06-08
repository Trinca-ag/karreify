"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, BellRing, X } from "lucide-react";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import { useAuthContext } from "@/components/providers/AuthProvider";
import {
  subscribeNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  saveNotification,
} from "@/services/notifications";
import { emitSavedFromNotification } from "@/lib/saver-events";
import type { Notification, SavedItem, SavedItemType } from "@/types";
import NotificationItem from "./NotificationItem";

// Modal only ever opens when the user clicks "Salvar" on a notification
// and hits the saved-items quota. Loading it lazily keeps it out of the
// navbar bundle that ships on every dashboard page.
const SaveLimitModal = dynamic(() => import("@/components/ui/SaveLimitModal"), {
  ssr: false,
});

interface ReplaceState {
  notificationId: string;
  oldest: { id: string; type: SavedItemType; title: string; createdAt: Date };
}

export default function NotificationBell() {
  const { user } = useAuthContext();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [replaceState, setReplaceState] = useState<ReplaceState | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }
    const uid = user.uid;
    const unsub = subscribeNotifications(uid, setNotifications);
    return () => unsub();
  }, [user]);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (panelRef.current?.contains(target)) return;
      if (buttonRef.current?.contains(target)) return;
      setOpen(false);
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open]);

  // Force a re-render every 30 s while the panel is visible so items that
  // cross their save window flip to the "Expirado" state without needing a
  // manual reload (Firestore won't emit on time-based transitions).
  const [, setTick] = useState(0);
  useEffect(() => {
    if (!open) return;
    const interval = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(interval);
  }, [open]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const runSave = useCallback(
    async (notificationId: string, replaceItemId?: string) => {
      setSavingId(notificationId);
      try {
        const result = await saveNotification(notificationId, replaceItemId);
        if (result.needsReplace && result.oldest) {
          setReplaceState({
            notificationId,
            oldest: {
              id: result.oldest.id,
              type: result.oldest.type,
              title: result.oldest.title,
              createdAt: new Date(result.oldest.createdAt),
            },
          });
          return;
        }
        if (!result.success) {
          toast.error(result.error || "Não foi possível salvar.");
          return;
        }
        if (result.savedItemId) {
          // Tell any on-page saver that's still mounted about the new
          // savedItem so its Save button flips to the gray "Salvo" state
          // without the user having to refresh.
          emitSavedFromNotification(notificationId, result.savedItemId);
        }
        toast.success("Salvo em Meus Arquivos.");
        setReplaceState(null);
      } finally {
        setSavingId(null);
      }
    },
    []
  );

  // Build a SavedItem-shaped object that satisfies SaveLimitModal's
  // expectations. The modal only reads `type`, `title` and `createdAt`,
  // so the other fields can be inert.
  const replaceOldestAsSavedItem = useMemo<SavedItem | null>(() => {
    if (!replaceState) return null;
    const base = {
      id: replaceState.oldest.id,
      title: replaceState.oldest.title,
      subtitle: undefined,
      createdAt: replaceState.oldest.createdAt,
      expiresAt: replaceState.oldest.createdAt,
    } as const;
    if (replaceState.oldest.type === "resume") {
      return {
        ...base,
        type: "resume",
        resumeData: null,
        template: "",
      } satisfies SavedItem;
    }
    return {
      ...base,
      type: replaceState.oldest.type,
      storagePath: "",
      downloadUrl: "",
      fileName: "",
    } satisfies SavedItem;
  }, [replaceState]);

  const handleOpen = useCallback(
    async (n: Notification) => {
      if (!user) return;
      if (!n.read) {
        markNotificationRead(user.uid, n.id).catch(() => {});
      }
      if (n.type === "document-generated") {
        setOpen(false);
        router.push("/my-files");
        return;
      }
      if (
        (n.type === "ticket-created" ||
          n.type === "ticket-reply" ||
          n.type === "ticket-closed") &&
        n.ticketId
      ) {
        setOpen(false);
        router.push(`/support/${n.ticketId}`);
        return;
      }
      // Eventos de indicação/carteira → deep-link para a área correspondente.
      if (n.type === "referral-signup" || n.type === "referral-bonus") {
        setOpen(false);
        router.push("/profile");
        return;
      }
      if (n.type === "commission" || n.type === "withdrawal-status") {
        setOpen(false);
        router.push("/carteira");
        return;
      }
      if (n.type === "refund-status") {
        setOpen(false);
        router.push("/compras");
        return;
      }
    },
    [router, user]
  );

  const handleDelete = useCallback(
    async (n: Notification) => {
      if (!user) return;
      try {
        await deleteNotification(user.uid, n.id);
      } catch {
        toast.error("Erro ao remover notificação.");
      }
    },
    [user]
  );

  // Mark every unread notification as read the moment the panel opens.
  // This is best-effort: we don't surface errors because the user-visible
  // outcome is just the unread badge sticking around for a refresh.
  useEffect(() => {
    if (!open || !user) return;
    if (notifications.every((n) => n.read)) return;
    markAllNotificationsRead(user.uid).catch(() => {});
  }, [open, user, notifications]);

  if (!user) return null;

  return (
    <>
      <div className="relative">
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="relative p-2 rounded-lg transition-colors hover:bg-white/10 text-gray-300"
          aria-label="Notificações"
        >
          {unreadCount > 0 ? (
            <BellRing className="w-5 h-5" />
          ) : (
            <Bell className="w-5 h-5" />
          )}
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-gradient-to-br from-primary-500 to-accent-violet text-white text-[10px] font-bold flex items-center justify-center">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>

        {open && (
          <div
            ref={panelRef}
            className="absolute -right-10 md:right-0 mt-2 w-[300px] md:w-[360px] max-w-[calc(100vw-1.5rem)] rounded-2xl bg-dark-800 border border-white/10 shadow-2xl shadow-black/40 overflow-hidden z-50"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
              <h3 className="text-sm font-heading font-semibold text-white">Notificações</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1 rounded-md text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
                aria-label="Fechar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-[480px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <Bell className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                  <p className="text-sm text-gray-400">Nenhuma notificação por aqui.</p>
                  <p className="text-xs text-gray-600 mt-1">
                    Avisamos você quando algo importante acontecer.
                  </p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div key={n.id} className="group">
                    <NotificationItem
                      notification={n}
                      saving={savingId === n.id}
                      onSave={() => runSave(n.id)}
                      onDelete={() => handleDelete(n)}
                      onOpen={() => handleOpen(n)}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <SaveLimitModal
        isOpen={!!replaceState}
        oldest={replaceOldestAsSavedItem}
        loading={savingId === replaceState?.notificationId}
        onConfirm={() => {
          if (!replaceState) return;
          runSave(replaceState.notificationId, replaceState.oldest.id);
        }}
        onCancel={() => setReplaceState(null)}
      />
    </>
  );
}
