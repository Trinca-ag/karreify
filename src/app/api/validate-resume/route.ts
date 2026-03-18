import { NextRequest, NextResponse } from "next/server";
import { generateCompletion } from "@/lib/deepseek";

const VALIDATION_PROMPT = `Você irá analisar o texto extraído de um currículo enviado pelo usuário.
Sua tarefa é identificar quais informações estão presentes e quais estão ausentes.

Responda APENAS com um JSON no seguinte formato, sem texto adicional:

{
  "pode_gerar": true | false,
  "campos_obrigatorios_ausentes": ["campo1", "campo2"],
  "campos_importantes_ausentes": ["campo1", "campo2"],
  "dados_extraidos": {
    "nome": "string ou null",
    "cargo": "string ou null",
    "contato": "string ou null",
    "tem_experiencia_ou_projeto": true | false,
    "tem_formacao": true | false,
    "tem_habilidades": true | false,
    "tem_datas": true | false,
    "tem_linkedin_ou_github": true | false
  }
}

Campos OBRIGATÓRIOS (sem eles pode_gerar deve ser false):
- "nome" — Nome completo do candidato
- "cargo" — Pelo menos um cargo ou título profissional
- "contato" — Email ou telefone
- "experiencia_ou_projeto" — Pelo menos uma experiência profissional OU um projeto

Campos IMPORTANTES (geram aviso mas não bloqueiam):
- "formacao" — Formação acadêmica
- "habilidades" — Habilidades técnicas (skills)
- "datas" — Datas das experiências (início e fim ou "Atual")
- "descricao_experiencia" — Descrição/bullets das experiências (não apenas cargo+empresa)
- "linkedin_ou_github" — LinkedIn ou GitHub

"pode_gerar" deve ser true somente se nome, cargo, contato E (experiência ou projeto) estiverem TODOS presentes.

Responda APENAS com o JSON, sem markdown, sem backticks.`;

export async function POST(request: NextRequest) {
  try {
    const { resumeText } = await request.json();

    if (!resumeText || typeof resumeText !== "string" || resumeText.trim().length < 20) {
      return NextResponse.json({
        success: true,
        validation: {
          pode_gerar: false,
          campos_obrigatorios_ausentes: ["nome", "cargo", "contato", "experiencia_ou_projeto"],
          campos_importantes_ausentes: [],
        },
      });
    }

    const result = await generateCompletion(
      `${VALIDATION_PROMPT}\n\nTexto do currículo:\n${resumeText}`,
      { temperature: 0.1, maxTokens: 1024 }
    );

    // Parse AI response
    const cleaned = result.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      const match = cleaned.match(/\{[\s\S]*\}/);
      if (!match) {
        // If parsing fails, allow generation (don't block on validation failure)
        return NextResponse.json({
          success: true,
          validation: { pode_gerar: true, campos_obrigatorios_ausentes: [], campos_importantes_ausentes: [] },
        });
      }
      parsed = JSON.parse(match[0]);
    }

    return NextResponse.json({
      success: true,
      validation: {
        pode_gerar: Boolean(parsed.pode_gerar),
        campos_obrigatorios_ausentes: Array.isArray(parsed.campos_obrigatorios_ausentes)
          ? parsed.campos_obrigatorios_ausentes
          : [],
        campos_importantes_ausentes: Array.isArray(parsed.campos_importantes_ausentes)
          ? parsed.campos_importantes_ausentes
          : [],
      },
    });
  } catch (error) {
    console.error("Validation error:", error);
    // On error, allow generation — don't block the user
    return NextResponse.json({
      success: true,
      validation: { pode_gerar: true, campos_obrigatorios_ausentes: [], campos_importantes_ausentes: [] },
    });
  }
}
