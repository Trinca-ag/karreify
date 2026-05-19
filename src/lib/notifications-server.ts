import { adminDb } from "@/lib/firebase-admin";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { NOTIFICATION_SAVE_WINDOW_MS, type NotificationPendingPayload, type NotificationType, type SavedItemType, type UserRole } from "@/types";

interface CreateNotificationBase {
  uid: string;
  type: NotificationType;
  title: string;
  message: string;
}

interface CreateDocumentNotificationInput extends Omit<CreateNotificationBase, "type"> {
  documentType: SavedItemType;
  documentTitle: string;
  pendingPayload: NotificationPendingPayload;
}

interface CreateRoleChangeInput extends Omit<CreateNotificationBase, "type"> {
  newRole: UserRole;
  creditsDelta: number;
}

interface CreateSimpleNotificationInput extends Omit<CreateNotificationBase, "type"> {
  type: Exclude<NotificationType, "document-generated" | "role-change" | "ticket-created" | "ticket-reply" | "ticket-closed">;
}

interface CreateTicketNotificationInput extends Omit<CreateNotificationBase, "type"> {
  type: "ticket-created" | "ticket-reply" | "ticket-closed";
  ticketId: string;
}

async function writeNotification(payload: Record<string, unknown>): Promise<string> {
  const docRef = adminDb
    .collection("users")
    .doc(payload.uid as string)
    .collection("notifications")
    .doc();

  const data = { ...payload };
  delete data.uid;
  data.read = false;
  data.createdAt = FieldValue.serverTimestamp();

  await docRef.set(data);
  return docRef.id;
}

/**
 * Document-generated notifications carry a `pendingPayload` so the user
 * can save the document later from the notification itself (manual-save
 * flow). The window is intentionally short (10 minutes) — long enough to
 * cover the typical "I'll come back to it" gap, short enough to keep
 * pending blobs bounded. After the window, the notification grays out
 * as "Expirado" and the save endpoint refuses to persist.
 */
export async function createDocumentNotification(
  input: CreateDocumentNotificationInput
): Promise<string> {
  const expiresAtMs = Date.now() + NOTIFICATION_SAVE_WINDOW_MS;
  return writeNotification({
    uid: input.uid,
    type: "document-generated" as NotificationType,
    title: input.title,
    message: input.message,
    documentType: input.documentType,
    documentTitle: input.documentTitle,
    expiresAt: Timestamp.fromMillis(expiresAtMs),
    savedItemId: null,
    savedItemRemoved: false,
    pendingPayload: input.pendingPayload,
  });
}

export async function createRoleChangeNotification(
  input: CreateRoleChangeInput
): Promise<string> {
  const credits = input.creditsDelta;
  const message =
    credits > 0
      ? `Você ganhou ${credits} moeda${credits === 1 ? "" : "s"} pelo upgrade.`
      : credits < 0
        ? `Você perdeu ${Math.abs(credits)} moeda${Math.abs(credits) === 1 ? "" : "s"} com a alteração.`
        : "Sua conta foi atualizada.";
  return writeNotification({
    uid: input.uid,
    type: "role-change" as NotificationType,
    title: input.title,
    message: input.message || message,
    newRole: input.newRole,
    creditsDelta: credits,
  });
}

export async function createSimpleNotification(
  input: CreateSimpleNotificationInput
): Promise<string> {
  return writeNotification({
    uid: input.uid,
    type: input.type,
    title: input.title,
    message: input.message,
  });
}

export async function createTicketNotification(
  input: CreateTicketNotificationInput
): Promise<string> {
  return writeNotification({
    uid: input.uid,
    type: input.type,
    title: input.title,
    message: input.message,
    ticketId: input.ticketId,
  });
}

/** Link a document notification to the savedItem that was created for it
 *  (called once the document is actually persisted, either via auto-save or
 *  the user clicking "Salvar" on the notification). */
export async function linkNotificationToSavedItem(
  uid: string,
  notificationId: string,
  savedItemId: string
): Promise<void> {
  await adminDb
    .collection("users")
    .doc(uid)
    .collection("notifications")
    .doc(notificationId)
    .update({
      savedItemId,
      pendingPayload: null,
    });
}

/** Best-effort mark the linked notification as "savedItem deleted" so the
 *  UI grays it out and disables the click target. */
export async function markNotificationSavedItemRemoved(
  uid: string,
  savedItemId: string
): Promise<void> {
  const snap = await adminDb
    .collection("users")
    .doc(uid)
    .collection("notifications")
    .where("savedItemId", "==", savedItemId)
    .limit(1)
    .get();
  if (snap.empty) return;
  await snap.docs[0].ref.update({ savedItemRemoved: true });
}
