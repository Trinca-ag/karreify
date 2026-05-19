import { NextRequest, NextResponse } from "next/server";
import { createResumeFromData } from "@/services/ai-resume";
import { cleanJsonResponse } from "@/utils/helpers";
import { extractTalentFromSchema, saveTalent } from "@/lib/talent-bank";

export async function POST(request: NextRequest) {
  try {
    const { formData, userId } = await request.json();

    if (!formData) {
      return NextResponse.json({ error: "Dados são obrigatórios" }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: "Usuário não autenticado" }, { status: 401 });
    }

    const result = await createResumeFromData(JSON.stringify(formData));
    const cleanedResult = cleanJsonResponse(result);
    const parsed = JSON.parse(cleanedResult);

    try {
      await saveTalent(extractTalentFromSchema(parsed, userId));
    } catch (e) {
      console.error("saveTalent (create) failed:", e);
    }

    return NextResponse.json({ success: true, data: parsed });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido";
    console.error("Error creating resume:", message);
    return NextResponse.json(
      { error: `Erro ao criar currículo: ${message}` },
      { status: 500 }
    );
  }
}
