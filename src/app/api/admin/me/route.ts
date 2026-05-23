import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequestWithData } from "@/utils/admin-verify";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdminRequestWithData(request);
    return NextResponse.json({ success: true, data: { uid: admin.uid, ...admin.data } });
  } catch {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }
}
