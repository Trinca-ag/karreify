import { NextRequest, NextResponse } from "next/server";
import { adaptResumeForJob } from "@/services/ai-resume";
import { cleanJsonResponse } from "@/utils/helpers";
import { extractTalentFromAdapted, saveTalent } from "@/lib/talent-bank";

export async function POST(request: NextRequest) {
  try {
    const { resumeText, jobDescription, userId } = await request.json();

    if (!resumeText || !jobDescription) {
      return NextResponse.json(
        { error: "Currículo e descrição da vaga são obrigatórios" },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json({ error: "Usuário não autenticado" }, { status: 401 });
    }

    const result = await adaptResumeForJob(resumeText, jobDescription);
    const cleanedResult = cleanJsonResponse(result);
    const parsed = JSON.parse(cleanedResult);

    try {
      await saveTalent(extractTalentFromAdapted(parsed, userId));
    } catch (e) {
      console.error("saveTalent (adapt) failed:", e);
    }

    return NextResponse.json({ success: true, data: parsed });
  } catch (error) {
    console.error("Error adapting resume:", error);
    return NextResponse.json(
      { error: "Erro ao adaptar currículo. Tente novamente." },
      { status: 500 }
    );
  }
}
