import { NextRequest, NextResponse } from "next/server";
import { analyzeCompany } from "@/services/ai-company-analysis";
import { cleanJsonResponse } from "@/utils/helpers";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const { companyName, position, userId } = await request.json();

    if (!companyName?.trim() || !position?.trim()) {
      return NextResponse.json({ error: "Preencha todos os campos." }, { status: 400 });
    }
    if (!userId) {
      return NextResponse.json({ error: "Usuário não autenticado." }, { status: 401 });
    }

    const raw = await analyzeCompany(companyName, position);
    const parsed = JSON.parse(cleanJsonResponse(raw));

    return NextResponse.json({ success: true, data: parsed });
  } catch (error) {
    console.error("Company analysis error:", error);
    return NextResponse.json({ error: "Erro ao analisar empresa." }, { status: 500 });
  }
}
