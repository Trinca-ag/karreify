import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { NextRequest } from "next/server";

export interface AdminClaims {
  uid: string;
  username: string;
  role: string;
}

export async function verifyAdminRequest(request: NextRequest): Promise<AdminClaims> {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    throw new Error("Não autorizado");
  }

  const token = authHeader.slice(7);
  const decoded = await adminAuth.verifyIdToken(token);

  const adminDoc = await adminDb.collection("admins").doc(decoded.uid).get();
  if (!adminDoc.exists) {
    throw new Error("Acesso negado");
  }

  const data = adminDoc.data()!;
  return { uid: decoded.uid, username: data.username, role: data.role };
}
