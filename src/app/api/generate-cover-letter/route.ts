import { NextRequest, NextResponse } from "next/server";
import { generateCoverLetter } from "@/services/ai-cover-letter";
import { cleanJsonResponse } from "@/utils/helpers";

export async function POST(request: NextRequest) {
  try {
    const { resumeText, companyName, jobTitle, jobDescription, userId } = await request.json();

    if (!resumeText?.trim() || !companyName?.trim() || !jobDescription?.trim()) {
      return NextResponse.json({ error: "Preencha todos os campos obrigatórios." }, { status: 400 });
    }
    if (!userId) {
      return NextResponse.json({ error: "Usuário não autenticado." }, { status: 401 });
    }

    const raw = await generateCoverLetter(resumeText, companyName, jobDescription);
    const parsed = JSON.parse(cleanJsonResponse(raw));

    if (jobTitle?.trim()) parsed.jobTitle = jobTitle.trim();

    return NextResponse.json({ success: true, data: parsed });
  } catch (error) {
    console.error("Cover letter error:", error);
    return NextResponse.json({ error: "Erro ao gerar carta de apresentação." }, { status: 500 });
  }
}
