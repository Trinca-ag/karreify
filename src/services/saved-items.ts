import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
  limit as fbLimit,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { auth, db, storage } from "@/lib/firebase";
import type {
  SavedItem,
  SavedItemType,
  SavedPdfItem,
  SavedResumeItem,
} from "@/types";
import { SAVED_ITEM_MAX_PER_TYPE, SAVED_ITEM_TTL_MS } from "@/types";

function col(uid: string) {
  return collection(db, "users", uid, "savedItems");
}

function toDate(value: unknown): Date {
  if (value instanceof Timestamp) return value.toDate();
  if (value instanceof Date) return value;
  return new Date();
}

function rowToSavedItem(id: string, raw: Record<string, unknown>): SavedItem {
  const base = {
    id,
    title: (raw.title as string) ?? "",
    subtitle: (raw.subtitle as string) || undefined,
    createdAt: toDate(raw.createdAt),
    expiresAt: toDate(raw.expiresAt),
  };
  const type = raw.type as SavedItemType;
  if (type === "resume") {
    return {
      ...base,
      type,
      resumeData: raw.resumeData,
      template: (raw.template as string) ?? "profissional",
      candidateLevel: (raw.candidateLevel as string) || undefined,
      adjustments: (raw.adjustments as SavedResumeItem["adjustments"]) || undefined,
    };
  }
  return {
    ...base,
    type,
    storagePath: (raw.storagePath as string) ?? "",
    downloadUrl: (raw.downloadUrl as string) ?? "",
    fileName: (raw.fileName as string) ?? "documento.pdf",
  };
}

async function deleteStorageSafe(path: string | undefined): Promise<void> {
  if (!path) return;
  try {
    await deleteObject(ref(storage, path));
  } catch {
    /* file may have been removed already */
  }
}

async function hardDeleteItem(uid: string, item: SavedItem): Promise<void> {
  if (item.type !== "resume") {
    await deleteStorageSafe((item as SavedPdfItem).storagePath);
  }
  await deleteDoc(doc(col(uid), item.id));
}

/** Lists all saved items for a user. Expired items are deleted on read. */
export async function listSavedItems(uid: string): Promise<SavedItem[]> {
  const snap = await getDocs(query(col(uid), orderBy("createdAt", "desc")));
  const items = snap.docs.map((d) => rowToSavedItem(d.id, d.data()));
  const now = Date.now();
  const live: SavedItem[] = [];
  const expired: SavedItem[] = [];
  for (const item of items) {
    if (item.expiresAt.getTime() <= now) expired.push(item);
    else live.push(item);
  }
  // Fire-and-forget cleanup
  if (expired.length > 0) {
    Promise.all(expired.map((e) => hardDeleteItem(uid, e))).catch(() => {});
  }
  return live;
}

export async function listSavedItemsByType(
  uid: string,
  type: SavedItemType
): Promise<SavedItem[]> {
  const all = await listSavedItems(uid);
  return all.filter((i) => i.type === type);
}

export async function countByType(
  uid: string,
  type: SavedItemType
): Promise<number> {
  const items = await listSavedItemsByType(uid, type);
  return items.length;
}

/** Returns the oldest live item of a given type (for the "replace oldest" prompt). */
export async function getOldestByType(
  uid: string,
  type: SavedItemType
): Promise<SavedItem | null> {
  const items = await listSavedItemsByType(uid, type);
  if (items.length === 0) return null;
  return items.reduce((oldest, cur) =>
    cur.createdAt < oldest.createdAt ? cur : oldest
  );
}

export async function deleteSavedItem(
  uid: string,
  itemId: string
): Promise<void> {
  // Read the doc first to know if there's Storage to clean up
  const snap = await getDocs(query(col(uid), where("__name__", "==", itemId), fbLimit(1)));
  if (snap.empty) {
    await deleteDoc(doc(col(uid), itemId));
    return;
  }
  const item = rowToSavedItem(snap.docs[0].id, snap.docs[0].data());
  await hardDeleteItem(uid, item);
}

export interface SaveResumePayload {
  resumeData: unknown;
  template: string;
  candidateLevel?: string;
  title: string;
  subtitle?: string;
  adjustments?: SavedResumeItem["adjustments"];
}

export async function createResumeItem(
  uid: string,
  payload: SaveResumePayload
): Promise<string> {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SAVED_ITEM_TTL_MS);
  const ref = await addDoc(col(uid), {
    type: "resume",
    title: payload.title,
    subtitle: payload.subtitle ?? null,
    resumeData: payload.resumeData,
    template: payload.template,
    candidateLevel: payload.candidateLevel ?? null,
    adjustments: payload.adjustments ?? null,
    createdAt: serverTimestamp(),
    expiresAt: Timestamp.fromDate(expiresAt),
  });
  return ref.id;
}

/** Updates editable fields of a resume item. `createdAt`/`expiresAt` are untouched. */
export async function updateResumeItem(
  uid: string,
  itemId: string,
  patch: Partial<Pick<SaveResumePayload, "resumeData" | "template" | "candidateLevel" | "adjustments" | "title" | "subtitle">>
): Promise<void> {
  const ref = doc(col(uid), itemId);
  const update: Record<string, unknown> = {};
  if ("resumeData" in patch) update.resumeData = patch.resumeData;
  if ("template" in patch) update.template = patch.template;
  if ("candidateLevel" in patch) update.candidateLevel = patch.candidateLevel ?? null;
  if ("adjustments" in patch) update.adjustments = patch.adjustments ?? null;
  if ("title" in patch && patch.title !== undefined) update.title = patch.title;
  if ("subtitle" in patch) update.subtitle = patch.subtitle ?? null;
  await updateDoc(ref, update);
}

export interface SavePdfPayload {
  type: SavedPdfItem["type"];
  title: string;
  subtitle?: string;
  fileName: string;
  pdf: Blob;
}

export async function createPdfItem(
  uid: string,
  payload: SavePdfPayload
): Promise<string> {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SAVED_ITEM_TTL_MS);

  // Ensure Storage uses a fresh token. After password changes or token expiry
  // the client may still hold a stale one; uploadBytes does NOT auto-refresh.
  if (auth.currentUser) {
    await auth.currentUser.getIdToken(true);
  }

  // Upload PDF to Storage
  const fileKey = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}.pdf`;
  const storagePath = `users/${uid}/files/${fileKey}`;
  const storageRef = ref(storage, storagePath);

  await uploadBytes(storageRef, payload.pdf, {
    contentType: "application/pdf",
    contentDisposition: `attachment; filename="${payload.fileName}"`,
  });
  const downloadUrl = await getDownloadURL(storageRef);

  const refDoc = await addDoc(col(uid), {
    type: payload.type,
    title: payload.title,
    subtitle: payload.subtitle ?? null,
    fileName: payload.fileName,
    storagePath,
    downloadUrl,
    createdAt: serverTimestamp(),
    expiresAt: Timestamp.fromDate(expiresAt),
  });
  return refDoc.id;
}

/**
 * Check if saving a new item of `type` would exceed the per-type limit.
 * If so, returns the oldest item so the caller can prompt the user.
 */
export async function checkSaveLimit(
  uid: string,
  type: SavedItemType
): Promise<{ needsReplace: boolean; oldest: SavedItem | null; count: number }> {
  const items = await listSavedItemsByType(uid, type);
  if (items.length < SAVED_ITEM_MAX_PER_TYPE) {
    return { needsReplace: false, oldest: null, count: items.length };
  }
  const oldest = items.reduce((o, c) => (c.createdAt < o.createdAt ? c : o));
  return { needsReplace: true, oldest, count: items.length };
}
