import { NextRequest, NextResponse } from "next/server";
import { analyzeLinkedInProfile } from "@/services/gemini-linkedin";
import { cleanJsonResponse } from "@/utils/helpers";

export async function POST(request: NextRequest) {
  try {
    const { profileData, userId } = await request.json();

    if (!profileData) {
      return NextResponse.json({ error: "Dados do perfil são obrigatórios" }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: "Usuário não autenticado" }, { status: 401 });
    }

    const result = await analyzeLinkedInProfile(profileData);
    const cleanedResult = cleanJsonResponse(result);
    const parsed = JSON.parse(cleanedResult);

    return NextResponse.json({ success: true, data: parsed });
  } catch (error) {
    console.error("Error analyzing LinkedIn:", error);
    return NextResponse.json(
      { error: "Erro ao analisar perfil do LinkedIn. Tente novamente." },
      { status: 500 }
    );
  }
}
