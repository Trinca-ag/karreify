import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { Timestamp } from "firebase-admin/firestore";

/** Mapeia erros do verifyAdminRequest para 403, demais para 500. */
export function adminGuardError(error: unknown, ctx: string): NextResponse {
  const msg = error instanceof Error ? error.message : "Erro";
  if (msg === "Não autorizado" || msg === "Acesso negado") {
    return NextResponse.json({ error: msg }, { status: 403 });
  }
  console.error(ctx, error);
  return NextResponse.json({ error: "Erro interno" }, { status: 500 });
}

export function toIso(v: unknown): string | null {
  return v instanceof Timestamp ? v.toDate().toISOString() : null;
}

export interface UserBrief {
  name: string;
  email: string | null;
}

/** Resolve nome/email de uma lista de uids (lote único via getAll). */
export async function resolveUsers(uids: string[]): Promise<Map<string, UserBrief>> {
  const unique = Array.from(new Set(uids.filter(Boolean)));
  const map = new Map<string, UserBrief>();
  if (!unique.length) return map;
  const snaps = await adminDb.getAll(
    ...unique.map((u) => adminDb.collection("users").doc(u))
  );
  snaps.forEach((s) => {
    const d = s.data() ?? {};
    map.set(s.id, {
      name: (d.displayName as string | undefined) || (d.email as string | undefined) || s.id,
      email: (d.email as string | undefined) ?? null,
    });
  });
  return map;
}

/** Mascara um nome para exibições com privacidade: "Matheus" → "Mat*****". */
export function maskName(name: string): string {
  const trimmed = (name || "").trim();
  if (!trimmed) return "—";
  const visible = trimmed.slice(0, 3);
  return `${visible}${"*".repeat(Math.max(3, trimmed.length - visible.length))}`;
}
