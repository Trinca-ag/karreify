import { NextRequest, NextResponse } from "next/server";
import { createResumeFromData } from "@/services/ai-resume";
import { cleanJsonResponse } from "@/utils/helpers";
import { extractTalentFromSchema, saveTalent } from "@/lib/talent-bank";
import { requireUser, authErrorResponse } from "@/lib/auth-server";
import { deductCreditsServer, InsufficientCreditsError } from "@/lib/credits-server";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";

const ALLOWED_FEATURES = new Set(["resume-creation", "resume-editor", "resume-adaptation"]);
const MAX_PAYLOAD_LENGTH = 200_000;

export async function POST(request: NextRequest) {
  let ctx;
  try {
    ctx = await requireUser(request);
  } catch (e) {
    return authErrorResponse(e);
  }

  const rl = rateLimit(ctx.uid, { scope: "create-resume", limit: 30, windowMs: 60_000 });
  if (!rl.allowed) return rateLimitResponse(rl);

  try {
    const body = await request.json();
    const { formData } = body;
    const feature: string =
      ALLOWED_FEATURES.has(body.feature) ? body.feature : "resume-creation";

    if (!formData) {
      return NextResponse.json({ error: "Dados são obrigatórios" }, { status: 400 });
    }
    const serialized = JSON.stringify(formData);
    if (serialized.length > MAX_PAYLOAD_LENGTH) {
      return NextResponse.json({ error: "Payload muito longo." }, { status: 413 });
    }

    const description =
      feature === "resume-editor"
        ? "Melhoria de seção do currículo"
        : feature === "resume-adaptation"
          ? "Adaptação de currículo"
          : "Criação de currículo com IA";

    let deduction;
    try {
      deduction = await deductCreditsServer(ctx.uid, feature, description);
    } catch (e) {
      if (e instanceof InsufficientCreditsError) {
        return NextResponse.json(
          { error: e.message, code: "INSUFFICIENT_CREDITS" },
          { status: 402 }
        );
      }
      throw e;
    }

    const result = await createResumeFromData(serialized);
    const parsed = JSON.parse(cleanJsonResponse(result));

    if (feature === "resume-creation") {
      try {
        await saveTalent(extractTalentFromSchema(parsed, ctx.uid));
      } catch (e) {
        console.error("saveTalent (create) failed:", e);
      }
    }

    return NextResponse.json({
      success: true,
      data: parsed,
      credits: deduction.newBalance,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido";
    console.error("Error creating resume:", message);
    return NextResponse.json(
      { error: "Erro ao criar currículo." },
      { status: 500 }
    );
  }
}
