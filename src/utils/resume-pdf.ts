import type { ResumeSchema } from "@/lib/resume-schema";
import type { TemplateName, SectionName } from "@/lib/resume-templates";

export interface PdfAdjustments {
  fontSizeOffset?: number;
  spacingOffset?: number;
  hiddenSections?: SectionName[];
  // Granular per-category px overrides (preferred). Undefined falls back to the template default.
  sectionTitleFontPx?: number;
  entryTitleFontPx?: number;
  bodyFontPx?: number;
  metaFontPx?: number;
  sectionSpacingPx?: number;
}

/** Remove accents and special characters for safe filenames */
function sanitizeFilename(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/** Generate filename: Nome-Sobrenome-Curriculo.pdf */
function buildFilename(name: string): string {
  const clean = sanitizeFilename(name);
  return clean ? `${clean}-Curriculo.pdf` : "Curriculo.pdf";
}

/**
 * Call the server-side Puppeteer API to generate a PDF from resume data.
 * Returns a Blob that can be used for download or preview.
 */
export async function generateResumePDFBlob(
  data: ResumeSchema,
  template: TemplateName = "profissional",
  candidateLevel?: string,
  adjustments?: PdfAdjustments
): Promise<Blob> {
  const response = await fetch("/api/generate-pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      resumeData: data,
      template,
      candidateLevel,
      fontSizeOffset: adjustments?.fontSizeOffset,
      spacingOffset: adjustments?.spacingOffset,
      hiddenSections: adjustments?.hiddenSections,
      sectionTitleFontPx: adjustments?.sectionTitleFontPx,
      entryTitleFontPx: adjustments?.entryTitleFontPx,
      bodyFontPx: adjustments?.bodyFontPx,
      metaFontPx: adjustments?.metaFontPx,
      sectionSpacingPx: adjustments?.sectionSpacingPx,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: "Erro ao gerar PDF" }));
    throw new Error(err.error || `Erro ${response.status}`);
  }

  return response.blob();
}

/**
 * Generate and trigger download of the resume PDF.
 */
export async function downloadResumePDF(
  data: ResumeSchema,
  template: TemplateName = "profissional",
  filename?: string,
  candidateLevel?: string,
  adjustments?: PdfAdjustments
): Promise<void> {
  const blob = await generateResumePDFBlob(data, template, candidateLevel, adjustments);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || buildFilename(data.basics.name);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
