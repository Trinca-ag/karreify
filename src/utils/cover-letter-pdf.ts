import type { CoverLetterResult } from "@/services/ai-cover-letter";

export interface CoverLetterAdjustments {
  candidateNameFontPx?: number;
  bodyFontPx?: number;
  subjectFontPx?: number;
  metaFontPx?: number;
  paragraphSpacingPx?: number;
  signOffSpacingPx?: number;
  hideSubject?: boolean;
  hideContactHeader?: boolean;
}

export const COVER_LETTER_DEFAULTS = {
  candidateNameFontPx: 20,
  bodyFontPx: 11.5,
  subjectFontPx: 11.5,
  metaFontPx: 10.5,
  paragraphSpacingPx: 13,
  signOffSpacingPx: 28,
} as const;

function sanitizeFilename(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function buildFilename(name: string): string {
  const clean = sanitizeFilename(name);
  return clean ? `carta-apresentacao-${clean}.pdf` : "carta-apresentacao.pdf";
}

export async function generateCoverLetterPDFBlob(
  data: CoverLetterResult,
  adjustments?: CoverLetterAdjustments
): Promise<Blob> {
  const response = await fetch("/api/generate-cover-letter-pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data, adjustments }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: "Erro ao gerar PDF" }));
    throw new Error(err.error || `Erro ${response.status}`);
  }

  return response.blob();
}

export async function downloadCoverLetterPDF(
  data: CoverLetterResult,
  adjustments?: CoverLetterAdjustments,
  filename?: string
): Promise<void> {
  const blob = await generateCoverLetterPDFBlob(data, adjustments);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || buildFilename(data.candidateName || "");
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
