import { NextRequest, NextResponse } from "next/server";
import { analyzeResume } from "@/services/ai-resume";
import { cleanJsonResponse } from "@/utils/helpers";
import { extractTalentFromAnalysis, saveTalent } from "@/lib/talent-bank";
import { requireUser, authErrorResponse } from "@/lib/auth-server";
import {
  deductCreditsServer,
  refundCreditsServer,
  InsufficientCreditsError,
} from "@/lib/credits-server";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { createDocumentNotification } from "@/lib/notifications-server";

const MAX_RESUME_LENGTH = 100_000;
const MIN_RESUME_LENGTH = 50;

/**
 * Tenta extrair JSON da resposta da IA com tolerância a respostas mal
 * formadas. Primeiro tenta o parse direto (após limpar markdown). Se falhar,
 * tenta extrair o primeiro bloco {...} via regex — útil quando o modelo
 * adiciona texto explicativo fora do JSON.
 */
function safeParseAIJson(raw: string): unknown {
  const cleaned = cleanJsonResponse(raw);
  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new Error("IA retornou resposta em formato inválido");
    }
    return JSON.parse(match[0]);
  }
}

export async function POST(request: NextRequest) {
  let ctx;
  try {
    ctx = await requireUser(request);
  } catch (e) {
    return authErrorResponse(e);
  }

  const rl = rateLimit(ctx.uid, { scope: "analyze-resume", limit: 20, windowMs: 60_000 });
  if (!rl.allowed) return rateLimitResponse(rl);

  const { resumeText } = await request.json().catch(() => ({ resumeText: null }));

  if (!resumeText || typeof resumeText !== "string") {
    return NextResponse.json(
      { success: false, error: "Texto do currículo é obrigatório", code: "INVALID_INPUT" },
      { status: 400 }
    );
  }

  const trimmedLength = resumeText.trim().length;

  if (trimmedLength < MIN_RESUME_LENGTH) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Não conseguimos extrair texto suficiente do seu arquivo. Se enviou um PDF, ele pode estar escaneado ou conter apenas imagens. Tente exportar novamente como PDF de texto, use um arquivo .docx ou envie outro currículo.",
        code: "RESUME_TEXT_TOO_SHORT",
      },
      { status: 400 }
    );
  }

  if (resumeText.length > MAX_RESUME_LENGTH) {
    return NextResponse.json(
      {
        success: false,
        error: `Currículo muito longo (máx ${MAX_RESUME_LENGTH} caracteres)`,
        code: "RESUME_TEXT_TOO_LONG",
      },
      { status: 413 }
    );
  }

  let deduction;
  try {
    deduction = await deductCreditsServer(
      ctx.uid,
      "resume-analysis",
      "Análise de currículo",
      { firstUseFree: true }
    );
  } catch (e) {
    if (e instanceof InsufficientCreditsError) {
      return NextResponse.json(
        {
          success: false,
          error: "Créditos insuficientes. Compre um pacote para continuar.",
          code: "INSUFFICIENT_CREDITS",
        },
        { status: 402 }
      );
    }
    throw e;
  }

  // Daqui pra frente, qualquer falha precisa estornar os créditos cobrados
  // para o usuário não ser penalizado por erro nosso ou da IA.
  try {
    let result;
    try {
      result = await analyzeResume(resumeText);
    } catch (aiError) {
      const aiMsg = aiError instanceof Error ? aiError.message : String(aiError);
      console.error("[analyze-resume] AI call failed:", aiMsg);
      await refundCreditsServer(
        ctx.uid,
        "resume-analysis",
        deduction.cost,
        "Falha na IA durante análise"
      ).catch((re) => console.error("[analyze-resume] refund failed:", re));
      return NextResponse.json(
        {
          success: false,
          error:
            "Nossa IA está temporariamente indisponível. Seus créditos foram estornados — tente novamente em alguns segundos.",
          code: "AI_UNAVAILABLE",
        },
        { status: 503 }
      );
    }

    let parsed;
    try {
      parsed = safeParseAIJson(result.content) as Record<string, unknown>;
    } catch (parseError) {
      const parseMsg = parseError instanceof Error ? parseError.message : String(parseError);
      console.error("[analyze-resume] JSON parse failed:", parseMsg, "raw:", result.content?.slice(0, 500));
      await refundCreditsServer(
        ctx.uid,
        "resume-analysis",
        deduction.cost,
        "Resposta da IA em formato inválido"
      ).catch((re) => console.error("[analyze-resume] refund failed:", re));
      return NextResponse.json(
        {
          success: false,
          error:
            "Recebemos uma resposta inesperada da IA. Seus créditos foram estornados — tente novamente.",
          code: "AI_PARSE_ERROR",
        },
        { status: 502 }
      );
    }

    try {
      await saveTalent(extractTalentFromAnalysis(parsed, ctx.uid));
    } catch (e) {
      console.error("saveTalent (analyze) failed:", e);
    }

    const ts = Date.now();
    // The PDF endpoint for resume-analysis expects { analysis: <AnalysisData> }
    // — i.e. the analysis object itself, NOT the wrapper that has
    // `{ analysis: ... }`. The page also passes `data.data.analysis`, so we
    // match that shape here. Falling back to `parsed` keeps older callers
    // working if the AI ever returns the analysis at the top level.
    const parsedAnalysis = (parsed as { analysis?: unknown }).analysis;
    const analysisJson = (parsedAnalysis ?? parsed) as unknown;
    const notificationId = await createDocumentNotification({
      uid: ctx.uid,
      title: "Análise de currículo concluída",
      message:
        "Sua análise está pronta. Salve em Meus Arquivos nos próximos 10 minutos.",
      documentType: "resume-analysis",
      documentTitle: "Análise de Currículo",
      pendingPayload: {
        kind: "pdf",
        docType: "resume-analysis",
        sourceJson: analysisJson,
        title: "Análise de Currículo",
        fileName: `analise-curriculo-${ts}.pdf`,
      },
    }).catch((e) => {
      console.error("createDocumentNotification (analyze) failed:", e);
      return null;
    });

    return NextResponse.json({
      success: true,
      data: parsed,
      cache: result.cache,
      credits: deduction.newBalance,
      wasFree: deduction.wasFree,
      notificationId,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[analyze-resume] unexpected error:", message);
    await refundCreditsServer(
      ctx.uid,
      "resume-analysis",
      deduction.cost,
      "Erro inesperado na análise"
    ).catch((re) => console.error("[analyze-resume] refund failed:", re));
    return NextResponse.json(
      {
        success: false,
        error:
          "Algo deu errado ao analisar seu currículo. Seus créditos foram estornados — tente novamente.",
        code: "UNEXPECTED_ERROR",
      },
      { status: 500 }
    );
  }
}
