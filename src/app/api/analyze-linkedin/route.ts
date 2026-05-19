import { NextRequest, NextResponse } from "next/server";
import { analyzeLinkedInProfile } from "@/services/ai-linkedin";
import { cleanJsonResponse } from "@/utils/helpers";
import { requireUser, authErrorResponse } from "@/lib/auth-server";
import { deductCreditsServer, InsufficientCreditsError } from "@/lib/credits-server";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";

const MAX_PROFILE_LENGTH = 50_000;

export async function POST(request: NextRequest) {
  let ctx;
  try {
    ctx = await requireUser(request);
  } catch (e) {
    return authErrorResponse(e);
  }

  const rl = rateLimit(ctx.uid, { scope: "analyze-linkedin", limit: 20, windowMs: 60_000 });
  if (!rl.allowed) return rateLimitResponse(rl);

  try {
    const { profileData } = await request.json();

    if (!profileData) {
      return NextResponse.json({ error: "Dados do perfil são obrigatórios" }, { status: 400 });
    }
    const serialized = typeof profileData === "string" ? profileData : JSON.stringify(profileData);
    if (serialized.length > MAX_PROFILE_LENGTH) {
      return NextResponse.json({ error: "Perfil muito longo." }, { status: 413 });
    }

    let deduction;
    try {
      deduction = await deductCreditsServer(
        ctx.uid,
        "linkedin-analysis",
        "Análise de perfil LinkedIn"
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

    const result = await analyzeLinkedInProfile(profileData);
    const parsed = JSON.parse(cleanJsonResponse(result));

    return NextResponse.json({
      success: true,
      data: parsed,
      credits: deduction.newBalance,
    });
  } catch (error) {
    console.error("Error analyzing LinkedIn:", error);
    return NextResponse.json(
      { error: "Erro ao analisar perfil do LinkedIn." },
      { status: 500 }
    );
  }
}
