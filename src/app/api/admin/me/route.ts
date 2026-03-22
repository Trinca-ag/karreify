import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/utils/admin-verify";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdminRequest(request);
    const doc = await import("@/lib/firebase-admin").then(m =>
      m.adminDb.collection("admins").doc(admin.uid).get()
    );
    return NextResponse.json({ success: true, data: { uid: admin.uid, ...doc.data() } });
  } catch {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }
}
