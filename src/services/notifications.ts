import {
  collection,
  doc,
  deleteDoc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  Timestamp,
  limit as fbLimit,
  writeBatch,
  getDocs,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { authedFetch } from "@/lib/api-client";
import type {
  Notification,
  NotificationPendingPayload,
  NotificationType,
  SavedItemType,
  UserRole,
} from "@/types";

const PAGE_SIZE = 50;

function col(uid: string) {
  return collection(db, "users", uid, "notifications");
}

function toDate(v: unknown): Date {
  if (v instanceof Timestamp) return v.toDate();
  if (v instanceof Date) return v;
  if (v && typeof v === "object" && "toDate" in v && typeof (v as { toDate: () => Date }).toDate === "function") {
    return (v as { toDate: () => Date }).toDate();
  }
  return new Date();
}

function rowToNotification(id: string, raw: Record<string, unknown>): Notification {
  const base: Notification = {
    id,
    type: raw.type as NotificationType,
    title: (raw.title as string) ?? "",
    message: (raw.message as string) ?? "",
    read: Boolean(raw.read),
    createdAt: toDate(raw.createdAt),
  };
  if (raw.documentType) base.documentType = raw.documentType as SavedItemType;
  if (raw.documentTitle) base.documentTitle = raw.documentTitle as string;
  if (raw.expiresAt) base.expiresAt = toDate(raw.expiresAt);
  if (raw.savedItemId !== undefined) base.savedItemId = (raw.savedItemId as string | null) ?? null;
  if (raw.savedItemRemoved) base.savedItemRemoved = true;
  if (raw.pendingPayload) base.pendingPayload = raw.pendingPayload as NotificationPendingPayload;
  if (raw.newRole) base.newRole = raw.newRole as UserRole;
  if (typeof raw.creditsDelta === "number") base.creditsDelta = raw.creditsDelta;
  if (raw.ticketId) base.ticketId = raw.ticketId as string;
  return base;
}

export function subscribeNotifications(
  uid: string,
  callback: (notifications: Notification[]) => void
): () => void {
  const q = query(col(uid), orderBy("createdAt", "desc"), fbLimit(PAGE_SIZE));
  return onSnapshot(q, (snap) => {
    const items = snap.docs.map((d) => rowToNotification(d.id, d.data()));
    callback(items);
  });
}

export async function markNotificationRead(uid: string, id: string): Promise<void> {
  await updateDoc(doc(col(uid), id), { read: true });
}

export async function markAllNotificationsRead(uid: string): Promise<void> {
  const unread = await getDocs(query(col(uid), where("read", "==", false), fbLimit(100)));
  if (unread.empty) return;
  const batch = writeBatch(db);
  unread.docs.forEach((d) => batch.update(d.ref, { read: true }));
  await batch.commit();
}

export async function deleteNotification(uid: string, id: string): Promise<void> {
  await deleteDoc(doc(col(uid), id));
}

export interface SaveNotificationResponse {
  success: boolean;
  savedItemId?: string;
  needsReplace?: boolean;
  oldest?: { id: string; type: SavedItemType; title: string; createdAt: string };
  error?: string;
}

/** Triggers the server-side save for a document notification. Returns
 *  needsReplace=true with the oldest item when the per-type limit was
 *  reached so callers can prompt the user before retrying. */
export async function saveNotification(
  notificationId: string,
  replaceItemId?: string
): Promise<SaveNotificationResponse> {
  const res = await authedFetch(`/api/notifications/${notificationId}/save`, {
    method: "POST",
    body: JSON.stringify(replaceItemId ? { replaceItemId } : {}),
  });
  const data = await res.json().catch(() => ({}));
  if (res.status === 409 && data?.error === "max-reached") {
    return { success: false, needsReplace: true, oldest: data.oldest };
  }
  if (!res.ok) {
    return { success: false, error: data?.error || `Erro ${res.status}` };
  }
  return { success: true, savedItemId: data.savedItemId };
}

export async function linkNotificationToSavedItem(
  notificationId: string,
  savedItemId: string
): Promise<void> {
  await authedFetch(`/api/notifications/${notificationId}/link`, {
    method: "POST",
    body: JSON.stringify({ savedItemId }),
  });
}

export function isNotificationExpired(n: Notification): boolean {
  if (n.savedItemRemoved) return true;
  if (n.savedItemId) return false; // saved → still valid even if expiresAt passed (the savedItem governs)
  if (!n.expiresAt) return false;
  return n.expiresAt.getTime() <= Date.now();
}

export function isDocumentSaved(n: Notification): boolean {
  return Boolean(n.savedItemId) && !n.savedItemRemoved;
}

export function canSaveFromNotification(n: Notification): boolean {
  if (n.type !== "document-generated") return false;
  if (n.savedItemId) return false;
  if (n.savedItemRemoved) return false;
  if (!n.pendingPayload) return false;
  if (!n.expiresAt) return false;
  return n.expiresAt.getTime() > Date.now();
}
