import { NextRequest, NextResponse } from "next/server";
import { generateCareerRoadmap } from "@/services/ai-career";
import { cleanJsonResponse } from "@/utils/helpers";
import { requireUser, authErrorResponse } from "@/lib/auth-server";
import { deductCreditsServer, InsufficientCreditsError } from "@/lib/credits-server";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";

const MAX_FIELD_LENGTH = 200;

export async function POST(request: NextRequest) {
  let ctx;
  try {
    ctx = await requireUser(request);
  } catch (e) {
    return authErrorResponse(e);
  }

  const rl = rateLimit(ctx.uid, { scope: "career-roadmap", limit: 10, windowMs: 60_000 });
  if (!rl.allowed) return rateLimitResponse(rl);

  try {
    const { currentRole, currentArea, experienceLevel, targetRole, timeline } =
      await request.json();

    if (!currentRole || !targetRole) {
      return NextResponse.json(
        { error: "Cargo atual e cargo desejado são obrigatórios" },
        { status: 400 }
      );
    }

    const fields = [currentRole, currentArea, experienceLevel, targetRole, timeline];
    if (fields.some((f) => typeof f === "string" && f.length > MAX_FIELD_LENGTH)) {
      return NextResponse.json({ error: "Campos muito longos." }, { status: 413 });
    }

    let deduction;
    try {
      deduction = await deductCreditsServer(
        ctx.uid,
        "career-roadmap",
        "Geração de roadmap de carreira"
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

    const result = await generateCareerRoadmap({
      currentRole,
      currentArea,
      experienceLevel,
      targetRole,
      timeline,
    });
    const parsed = JSON.parse(cleanJsonResponse(result));

    return NextResponse.json({
      success: true,
      data: parsed,
      credits: deduction.newBalance,
    });
  } catch (error) {
    console.error("Error generating roadmap:", error);
    return NextResponse.json(
      { error: "Erro ao gerar roadmap. Tente novamente." },
      { status: 500 }
    );
  }
}
