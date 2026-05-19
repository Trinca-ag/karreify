import { NextRequest, NextResponse } from "next/server";
import { analyzeResume } from "@/services/ai-resume";
import { cleanJsonResponse } from "@/utils/helpers";
import { extractTalentFromAnalysis, saveTalent } from "@/lib/talent-bank";
import { requireUser, authErrorResponse } from "@/lib/auth-server";
import { deductCreditsServer, InsufficientCreditsError } from "@/lib/credits-server";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { createDocumentNotification } from "@/lib/notifications-server";

const MAX_RESUME_LENGTH = 100_000;

export async function POST(request: NextRequest) {
  let ctx;
  try {
    ctx = await requireUser(request);
  } catch (e) {
    return authErrorResponse(e);
  }

  const rl = rateLimit(ctx.uid, { scope: "analyze-resume", limit: 20, windowMs: 60_000 });
  if (!rl.allowed) return rateLimitResponse(rl);

  try {
    const { resumeText } = await request.json();

    if (!resumeText || typeof resumeText !== "string") {
      return NextResponse.json({ error: "Texto do currículo é obrigatório" }, { status: 400 });
    }
    if (resumeText.length > MAX_RESUME_LENGTH) {
      return NextResponse.json(
        { error: `Currículo muito longo (máx ${MAX_RESUME_LENGTH} caracteres)` },
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
          { error: e.message, code: "INSUFFICIENT_CREDITS" },
          { status: 402 }
        );
      }
      throw e;
    }

    const result = await analyzeResume(resumeText);
    const parsed = JSON.parse(cleanJsonResponse(result.content));

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
    const analysisJson = (parsed?.analysis ?? parsed) as unknown;
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
    console.error("Error analyzing resume:", message);
    return NextResponse.json(
      { success: false, error: "Erro ao analisar currículo" },
      { status: 500 }
    );
  }
}
