import { NextRequest, NextResponse } from "next/server";
import { adaptResumeForJob } from "@/services/ai-resume";
import { cleanJsonResponse } from "@/utils/helpers";
import { extractTalentFromAdapted, saveTalent } from "@/lib/talent-bank";
import { requireUser, authErrorResponse } from "@/lib/auth-server";
import { deductCreditsServer, InsufficientCreditsError } from "@/lib/credits-server";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";

const MAX_RESUME_LENGTH = 100_000;
const MAX_JOB_LENGTH = 20_000;

export async function POST(request: NextRequest) {
  let ctx;
  try {
    ctx = await requireUser(request);
  } catch (e) {
    return authErrorResponse(e);
  }

  const rl = rateLimit(ctx.uid, { scope: "adapt-resume", limit: 20, windowMs: 60_000 });
  if (!rl.allowed) return rateLimitResponse(rl);

  try {
    const { resumeText, jobDescription } = await request.json();

    if (!resumeText || !jobDescription) {
      return NextResponse.json(
        { error: "Currículo e descrição da vaga são obrigatórios" },
        { status: 400 }
      );
    }
    if (resumeText.length > MAX_RESUME_LENGTH || jobDescription.length > MAX_JOB_LENGTH) {
      return NextResponse.json({ error: "Conteúdo muito longo." }, { status: 413 });
    }

    let deduction;
    try {
      deduction = await deductCreditsServer(
        ctx.uid,
        "resume-adaptation",
        "Adaptação de currículo para vaga"
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

    const result = await adaptResumeForJob(resumeText, jobDescription);
    const parsed = JSON.parse(cleanJsonResponse(result));

    try {
      await saveTalent(extractTalentFromAdapted(parsed, ctx.uid));
    } catch (e) {
      console.error("saveTalent (adapt) failed:", e);
    }

    return NextResponse.json({
      success: true,
      data: parsed,
      credits: deduction.newBalance,
    });
  } catch (error) {
    console.error("Error adapting resume:", error);
    return NextResponse.json(
      { error: "Erro ao adaptar currículo." },
      { status: 500 }
    );
  }
}
