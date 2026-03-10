import { NextRequest, NextResponse } from "next/server";
import { generateCareerRoadmap } from "@/services/gemini-career";
import { cleanJsonResponse } from "@/utils/helpers";

export async function POST(request: NextRequest) {
  try {
    const { currentRole, currentArea, experienceLevel, targetRole, timeline, userId } =
      await request.json();

    if (!currentRole || !targetRole) {
      return NextResponse.json(
        { error: "Cargo atual e cargo desejado são obrigatórios" },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json({ error: "Usuário não autenticado" }, { status: 401 });
    }

    const result = await generateCareerRoadmap({
      currentRole,
      currentArea,
      experienceLevel,
      targetRole,
      timeline,
    });
    const cleanedResult = cleanJsonResponse(result);
    const parsed = JSON.parse(cleanedResult);

    return NextResponse.json({ success: true, data: parsed });
  } catch (error) {
    console.error("Error generating roadmap:", error);
    return NextResponse.json(
      { error: "Erro ao gerar roadmap. Tente novamente." },
      { status: 500 }
    );
  }
}
