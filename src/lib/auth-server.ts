import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

export interface AuthContext {
  uid: string;
  email: string | null;
}

export class AuthError extends Error {
  status: number;
  constructor(message: string, status = 401) {
    super(message);
    this.status = status;
  }
}

function extractBearer(request: NextRequest): string | null {
  const header = request.headers.get("authorization") || request.headers.get("Authorization");
  if (!header) return null;
  const [scheme, token] = header.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) return null;
  return token.trim();
}

export async function requireUser(request: NextRequest): Promise<AuthContext> {
  const token = extractBearer(request);
  if (!token) throw new AuthError("Não autenticado");

  try {
    const decoded = await adminAuth.verifyIdToken(token);
    return { uid: decoded.uid, email: decoded.email ?? null };
  } catch {
    throw new AuthError("Token inválido ou expirado");
  }
}

export async function requireAdmin(request: NextRequest): Promise<AuthContext> {
  const ctx = await requireUser(request);
  const adminDoc = await adminDb.collection("admins").doc(ctx.uid).get();
  if (!adminDoc.exists) throw new AuthError("Não autorizado", 403);
  return ctx;
}

export function authErrorResponse(err: unknown): NextResponse {
  if (err instanceof AuthError) {
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
  return NextResponse.json({ error: "Erro de autenticação" }, { status: 401 });
}
