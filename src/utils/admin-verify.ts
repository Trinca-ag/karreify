import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { NextRequest } from "next/server";

export interface AdminClaims {
  uid: string;
  username: string;
  role: string;
}

export interface AdminClaimsWithData extends AdminClaims {
  data: FirebaseFirestore.DocumentData;
}

// Internal — does the actual verification work and returns the full doc data
// so callers that need it (e.g. /api/admin/me) don't have to re-read the
// admin document.
async function verifyAndLoad(request: NextRequest): Promise<AdminClaimsWithData> {
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
  return { uid: decoded.uid, username: data.username, role: data.role, data };
}

export async function verifyAdminRequest(request: NextRequest): Promise<AdminClaims> {
  const { uid, username, role } = await verifyAndLoad(request);
  return { uid, username, role };
}

export async function verifyAdminRequestWithData(
  request: NextRequest
): Promise<AdminClaimsWithData> {
  return verifyAndLoad(request);
}
