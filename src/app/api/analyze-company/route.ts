import { NextRequest, NextResponse } from "next/server";
import { analyzeCompany } from "@/services/ai-company-analysis";
import { cleanJsonResponse } from "@/utils/helpers";
import { requireUser, authErrorResponse } from "@/lib/auth-server";
import { deductCreditsServer, InsufficientCreditsError } from "@/lib/credits-server";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { createDocumentNotification } from "@/lib/notifications-server";

export const maxDuration = 60;

const MAX_FIELD_LENGTH = 200;

export async function POST(request: NextRequest) {
  let ctx;
  try {
    ctx = await requireUser(request);
  } catch (e) {
    return authErrorResponse(e);
  }

  const rl = rateLimit(ctx.uid, { scope: "analyze-company", limit: 20, windowMs: 60_000 });
  if (!rl.allowed) return rateLimitResponse(rl);

  try {
    const { companyName, position } = await request.json();

    if (!companyName?.trim() || !position?.trim()) {
      return NextResponse.json({ error: "Preencha todos os campos." }, { status: 400 });
    }
    if (companyName.length > MAX_FIELD_LENGTH || position.length > MAX_FIELD_LENGTH) {
      return NextResponse.json({ error: "Campos muito longos." }, { status: 413 });
    }

    let deduction;
    try {
      deduction = await deductCreditsServer(
        ctx.uid,
        "company-analysis",
        `Análise de empresa — ${companyName}`
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

    const raw = await analyzeCompany(companyName, position);
    const parsed = JSON.parse(cleanJsonResponse(raw));

    const ts = Date.now();
    const notificationId = await createDocumentNotification({
      uid: ctx.uid,
      title: "Análise de empresa concluída",
      message: `${companyName} foi analisada. Salve em Meus Arquivos nos próximos 10 minutos.`,
      documentType: "company-analysis",
      documentTitle: `Análise — ${companyName}`,
      pendingPayload: {
        kind: "pdf",
        docType: "company-analysis",
        sourceJson: parsed,
        title: `Análise — ${companyName}`,
        subtitle: position,
        fileName: `analise-empresa-${ts}.pdf`,
      },
    }).catch((e) => {
      console.error("createDocumentNotification (company) failed:", e);
      return null;
    });

    return NextResponse.json({
      success: true,
      data: parsed,
      credits: deduction.newBalance,
      notificationId,
    });
  } catch (error) {
    console.error("Company analysis error:", error);
    return NextResponse.json({ error: "Erro ao analisar empresa." }, { status: 500 });
  }
}
