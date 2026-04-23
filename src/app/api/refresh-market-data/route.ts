import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { generateMarketData } from "@/services/ai-market";
import { cleanJsonResponse } from "@/utils/helpers";
import { adminDb } from "@/lib/firebase-admin";

export const maxDuration = 60;

export async function POST() {
  try {
    const raw = await generateMarketData();
    const parsed = JSON.parse(cleanJsonResponse(raw));
    await adminDb.collection("market").doc("global").set({
      ...parsed,
      updatedAt: FieldValue.serverTimestamp(),
    });
    return NextResponse.json({ success: true, data: parsed });
  } catch (error) {
    console.error("Market data refresh error:", error);
    return NextResponse.json({ success: false, error: "Erro ao gerar dados de mercado." }, { status: 500 });
  }
}
