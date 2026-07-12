import { NextRequest, NextResponse } from "next/server";
import { extractJobProfile } from "@/services/ai-resume";
import { cleanJsonResponse } from "@/utils/helpers";
import { requireUser, authErrorResponse } from "@/lib/auth-server";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";

const MAX_RESUME_LENGTH = 100_000;
const MIN_RESUME_LENGTH = 50;

/**
 * Parse tolerante do JSON da IA (mesmo padrão do analyze-resume): tenta o
 * parse direto após limpar markdown; se falhar, extrai o primeiro bloco
 * {...} via regex.
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

/**
 * Extrai profissão + cidade/UF do texto de um currículo para pré-preencher
 * a busca de vagas. GRATUITO (sem créditos) — chamada de IA muito leve,
 * protegida por rate-limit. O texto não é persistido em lugar nenhum.
 */
export async function POST(request: NextRequest) {
  let ctx;
  try {
    ctx = await requireUser(request);
  } catch (e) {
    return authErrorResponse(e);
  }

  const rl = rateLimit(ctx.uid, { scope: "jobs-extract", limit: 10, windowMs: 60_000 });
  if (!rl.allowed) return rateLimitResponse(rl);

  const { resumeText } = await request.json().catch(() => ({ resumeText: null }));

  if (!resumeText || typeof resumeText !== "string") {
    return NextResponse.json(
      { success: false, error: "Texto do currículo é obrigatório", code: "INVALID_INPUT" },
      { status: 400 }
    );
  }

  if (resumeText.trim().length < MIN_RESUME_LENGTH) {
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

  let raw: string;
  try {
    raw = await extractJobProfile(resumeText);
  } catch (aiError) {
    const aiMsg = aiError instanceof Error ? aiError.message : String(aiError);
    console.error("[jobs-extract] AI call failed:", aiMsg);
    return NextResponse.json(
      {
        success: false,
        error:
          "Nossa IA está temporariamente indisponível. Tente novamente em alguns segundos.",
        code: "AI_UNAVAILABLE",
      },
      { status: 503 }
    );
  }

  let parsed: Record<string, unknown>;
  try {
    parsed = safeParseAIJson(raw) as Record<string, unknown>;
  } catch (parseError) {
    const parseMsg = parseError instanceof Error ? parseError.message : String(parseError);
    console.error("[jobs-extract] JSON parse failed:", parseMsg, "raw:", raw?.slice(0, 300));
    return NextResponse.json(
      {
        success: false,
        error: "Recebemos uma resposta inesperada da IA. Tente novamente.",
        code: "AI_PARSE_ERROR",
      },
      { status: 502 }
    );
  }

  const profession = typeof parsed.profession === "string" ? parsed.profession.trim() : "";
  if (!profession) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Não conseguimos identificar sua profissão no currículo. Tente outro arquivo ou busque manualmente.",
        code: "PROFESSION_NOT_FOUND",
      },
      { status: 422 }
    );
  }

  const rawUf = typeof parsed.uf === "string" ? parsed.uf.trim().toUpperCase() : "";
  const uf = /^[A-Z]{2}$/.test(rawUf) ? rawUf : null;
  const city =
    typeof parsed.city === "string" && parsed.city.trim() ? parsed.city.trim() : null;

  return NextResponse.json({ success: true, profession, city, uf });
}
