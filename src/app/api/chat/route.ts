import { NextRequest, NextResponse } from "next/server";
import { generateChatResponse } from "@/services/gemini-career";

export async function POST(request: NextRequest) {
  try {
    const { message, context, userId } = await request.json();

    if (!message) {
      return NextResponse.json({ error: "Mensagem é obrigatória" }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: "Usuário não autenticado" }, { status: 401 });
    }

    const response = await generateChatResponse(message, context || "");

    return NextResponse.json({ success: true, data: { response } });
  } catch (error) {
    console.error("Error in chat:", error);
    return NextResponse.json(
      { error: "Erro ao processar mensagem. Tente novamente." },
      { status: 500 }
    );
  }
}
