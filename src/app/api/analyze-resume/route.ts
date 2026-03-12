import { NextRequest, NextResponse } from "next/server";
import { analyzeResume } from "@/services/gemini-resume";
import { cleanJsonResponse } from "@/utils/helpers";

export async function POST(request: NextRequest) {
  try {
    const { resumeText, userId } = await request.json();

    if (!resumeText) {
      return NextResponse.json({ error: "Texto do currículo é obrigatório" }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: "Usuário não autenticado" }, { status: 401 });
    }

    const result = await analyzeResume(resumeText);
    const cleanedResult = cleanJsonResponse(result);
    const parsed = JSON.parse(cleanedResult);

    return NextResponse.json({ success: true, data: parsed });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error analyzing resume:", message, error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
