"use client";

import {
  collection,
  doc,
  addDoc,
  query,
  orderBy,
  where,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  type Unsubscribe,
  type DocumentData,
} from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { auth } from "@/lib/firebase";
import type { Ticket, TicketMessage, TicketStatus, TicketSenderRole } from "@/types";

function tsToDate(v: unknown): Date {
  if (v instanceof Timestamp) return v.toDate();
  if (v instanceof Date) return v;
  return new Date();
}

function tsToDateOrNull(v: unknown): Date | null {
  if (v == null) return null;
  if (v instanceof Timestamp) return v.toDate();
  if (v instanceof Date) return v;
  return null;
}

function mapTicketDoc(id: string, data: DocumentData): Ticket {
  return {
    id,
    userId: (data.userId as string) || "",
    userName: (data.userName as string) || "",
    userEmail: (data.userEmail as string) || "",
    title: (data.title as string) || "",
    description: (data.description as string) || "",
    images: Array.isArray(data.images) ? (data.images as string[]) : [],
    status: ((data.status as TicketStatus) || "open"),
    messageCount: (data.messageCount as number) ?? 0,
    lastMessageAt: tsToDate(data.lastMessageAt),
    lastMessageBy: (data.lastMessageBy as TicketSenderRole | null) ?? null,
    createdAt: tsToDate(data.createdAt),
    updatedAt: tsToDate(data.updatedAt),
    closedAt: tsToDateOrNull(data.closedAt),
    closedBy: (data.closedBy as string | null) ?? null,
    imagesDeleted: Boolean(data.imagesDeleted),
  };
}

function mapMessageDoc(id: string, data: DocumentData): TicketMessage {
  return {
    id,
    senderId: (data.senderId as string) || "",
    senderRole: ((data.senderRole as TicketSenderRole) || "user"),
    senderName: (data.senderName as string) || "",
    content: (data.content as string) || "",
    createdAt: tsToDate(data.createdAt),
  };
}

// ── Realtime subscriptions ──────────────────────────────────────────────

export function subscribeUserTickets(
  userId: string,
  onChange: (tickets: Ticket[]) => void,
  onError?: (err: unknown) => void
): Unsubscribe {
  const q = query(
    collection(db, "tickets"),
    where("userId", "==", userId),
    orderBy("lastMessageAt", "desc")
  );
  return onSnapshot(
    q,
    (snap) => {
      const tickets = snap.docs.map((d) => mapTicketDoc(d.id, d.data()));
      onChange(tickets);
    },
    (err) => onError?.(err)
  );
}

export function subscribeAllTickets(
  onChange: (tickets: Ticket[]) => void,
  onError?: (err: unknown) => void
): Unsubscribe {
  const q = query(collection(db, "tickets"), orderBy("lastMessageAt", "desc"));
  return onSnapshot(
    q,
    (snap) => {
      const tickets = snap.docs.map((d) => mapTicketDoc(d.id, d.data()));
      onChange(tickets);
    },
    (err) => onError?.(err)
  );
}

export function subscribeTicket(
  ticketId: string,
  onChange: (ticket: Ticket | null) => void,
  onError?: (err: unknown) => void
): Unsubscribe {
  return onSnapshot(
    doc(db, "tickets", ticketId),
    (snap) => {
      if (!snap.exists()) return onChange(null);
      onChange(mapTicketDoc(snap.id, snap.data()));
    },
    (err) => onError?.(err)
  );
}

export function subscribeTicketMessages(
  ticketId: string,
  onChange: (messages: TicketMessage[]) => void,
  onError?: (err: unknown) => void
): Unsubscribe {
  const q = query(
    collection(db, "tickets", ticketId, "messages"),
    orderBy("createdAt", "asc")
  );
  return onSnapshot(
    q,
    (snap) => {
      const msgs = snap.docs.map((d) => mapMessageDoc(d.id, d.data()));
      onChange(msgs);
    },
    (err) => onError?.(err)
  );
}

// ── Writes ──────────────────────────────────────────────────────────────

export async function sendTicketMessage(
  ticketId: string,
  sender: { uid: string; role: TicketSenderRole; name: string },
  content: string
): Promise<void> {
  const trimmed = content.trim();
  if (!trimmed) throw new Error("Mensagem vazia");
  await addDoc(collection(db, "tickets", ticketId, "messages"), {
    senderId: sender.uid,
    senderRole: sender.role,
    senderName: sender.name,
    content: trimmed,
    createdAt: serverTimestamp(),
  });
  // The ticket doc's lastMessageAt / messageCount are kept in sync server-side
  // by the close API (admin) and the create API. For per-message activity the
  // client also writes — this is allowed by rules only for the owner + admin
  // and only on the activity fields.
  const { updateDoc, doc: refDoc, increment } = await import("firebase/firestore");
  await updateDoc(refDoc(db, "tickets", ticketId), {
    lastMessageAt: serverTimestamp(),
    lastMessageBy: sender.role,
    messageCount: increment(1),
    updatedAt: serverTimestamp(),
  });
}

// ── Storage helpers ─────────────────────────────────────────────────────

/** Upload up to TICKET_MAX_IMAGES files. Path encodes ownership so the Storage
 *  rule can authorize without a cross-service query into Firestore. */
export async function uploadTicketImages(
  ticketId: string,
  userId: string,
  files: File[]
): Promise<string[]> {
  if (files.length === 0) return [];
  const urls: string[] = [];
  for (const file of files) {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `tickets/${userId}/${ticketId}/${Date.now()}_${safeName}`;
    const r = storageRef(storage, path);
    await uploadBytes(r, file, { contentType: file.type });
    urls.push(await getDownloadURL(r));
  }
  return urls;
}

// ── HTTP wrappers around server routes ──────────────────────────────────

export async function createTicket(input: {
  title: string;
  description: string;
  images?: File[];
}): Promise<Ticket> {
  const user = auth.currentUser;
  if (!user) throw new Error("Não autenticado");
  const token = await user.getIdToken();

  const res = await fetch("/api/support/tickets", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ title: input.title, description: input.description }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erro ao abrir chamado");
  const ticket = data.ticket as Ticket;

  // Uploads happen client-side after the doc exists. Path includes the user
  // uid so the Storage rule (path-based) can authorize ownership.
  if (input.images && input.images.length > 0) {
    const urls = await uploadTicketImages(ticket.id, user.uid, input.images);
    const { updateDoc, doc: refDoc } = await import("firebase/firestore");
    await updateDoc(refDoc(db, "tickets", ticket.id), { images: urls });
    ticket.images = urls;
  }
  return ticket;
}

export async function closeTicket(ticketId: string): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error("Não autenticado");
  const token = await user.getIdToken();
  const res = await fetch(`/api/admin/tickets/${ticketId}/close`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Erro ao fechar chamado");
}
