import { NextResponse } from "next/server";
import { generateMarketData } from "@/services/ai-market";
import { cleanJsonResponse } from "@/utils/helpers";

export const maxDuration = 60;

export async function POST() {
  try {
    const raw = await generateMarketData();
    const parsed = JSON.parse(cleanJsonResponse(raw));
    return NextResponse.json({ success: true, data: parsed });
  } catch (error) {
    console.error("Market data refresh error:", error);
    return NextResponse.json({ error: "Erro ao gerar dados de mercado." }, { status: 500 });
  }
}
