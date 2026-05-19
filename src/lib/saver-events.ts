/**
 * Tiny in-memory pub/sub so the notification bell can tell the on-page
 * saver "hey, the doc just got saved server-side via your notification —
 * flip your button to the gray Salvo state."
 *
 * Lives in-memory only: the saver listens while it's mounted, the bell
 * emits after a successful POST to /api/notifications/[id]/save. There's
 * no cross-tab story here because saver state itself is per-tab.
 */

export type SavedFromNotificationListener = (
  notificationId: string,
  savedItemId: string
) => void;

const listeners = new Set<SavedFromNotificationListener>();

export function onSavedFromNotification(
  fn: SavedFromNotificationListener
): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function emitSavedFromNotification(
  notificationId: string,
  savedItemId: string
): void {
  Array.from(listeners).forEach((fn) => {
    try {
      fn(notificationId, savedItemId);
    } catch {
      /* listeners are best-effort */
    }
  });
}
