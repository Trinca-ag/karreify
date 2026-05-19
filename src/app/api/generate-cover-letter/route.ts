import { NextRequest, NextResponse } from "next/server";
import { generateCoverLetter } from "@/services/ai-cover-letter";
import { cleanJsonResponse } from "@/utils/helpers";
import { extractTalentFromCoverLetter, saveTalent } from "@/lib/talent-bank";
import { requireUser, authErrorResponse } from "@/lib/auth-server";
import { deductCreditsServer, InsufficientCreditsError } from "@/lib/credits-server";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { createDocumentNotification } from "@/lib/notifications-server";

const MAX_RESUME_LENGTH = 100_000;
const MAX_DESCRIPTION_LENGTH = 20_000;
const MAX_FIELD_LENGTH = 200;

export async function POST(request: NextRequest) {
  let ctx;
  try {
    ctx = await requireUser(request);
  } catch (e) {
    return authErrorResponse(e);
  }

  const rl = rateLimit(ctx.uid, { scope: "cover-letter", limit: 20, windowMs: 60_000 });
  if (!rl.allowed) return rateLimitResponse(rl);

  try {
    const { resumeText, companyName, jobTitle, jobDescription } = await request.json();

    if (!resumeText?.trim() || !companyName?.trim() || !jobDescription?.trim()) {
      return NextResponse.json({ error: "Preencha todos os campos obrigatórios." }, { status: 400 });
    }
    if (resumeText.length > MAX_RESUME_LENGTH || jobDescription.length > MAX_DESCRIPTION_LENGTH) {
      return NextResponse.json({ error: "Conteúdo muito longo." }, { status: 413 });
    }
    if (companyName.length > MAX_FIELD_LENGTH || (jobTitle && jobTitle.length > MAX_FIELD_LENGTH)) {
      return NextResponse.json({ error: "Campos muito longos." }, { status: 413 });
    }

    let deduction;
    try {
      deduction = await deductCreditsServer(
        ctx.uid,
        "cover-letter",
        `Carta de apresentação — ${companyName}`
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

    const raw = await generateCoverLetter(resumeText, companyName, jobDescription);
    const parsed = JSON.parse(cleanJsonResponse(raw));

    if (jobTitle?.trim()) parsed.jobTitle = jobTitle.trim();

    try {
      await saveTalent(extractTalentFromCoverLetter(parsed, resumeText, ctx.uid));
    } catch (e) {
      console.error("saveTalent (cover-letter) failed:", e);
    }

    const ts = Date.now();
    const notificationId = await createDocumentNotification({
      uid: ctx.uid,
      title: "Carta de apresentação concluída",
      message: `Sua carta para ${companyName} está pronta. Salve em Meus Arquivos nos próximos 10 minutos.`,
      documentType: "cover-letter",
      documentTitle: `Carta — ${companyName}`,
      pendingPayload: {
        kind: "pdf",
        docType: "cover-letter",
        sourceJson: parsed,
        title: `Carta — ${companyName}`,
        subtitle: jobTitle?.trim() || undefined,
        fileName: `carta-${ts}.pdf`,
      },
    }).catch((e) => {
      console.error("createDocumentNotification (cover-letter) failed:", e);
      return null;
    });

    return NextResponse.json({
      success: true,
      data: parsed,
      credits: deduction.newBalance,
      notificationId,
    });
  } catch (error) {
    console.error("Cover letter error:", error);
    return NextResponse.json({ error: "Erro ao gerar carta de apresentação." }, { status: 500 });
  }
}
