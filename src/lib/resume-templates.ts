import type { ResumeSchema } from "@/lib/resume-schema";

// ── Types ─────────────────────────────────────────────────

export type TemplateName = "profissional" | "moderno";

export interface TemplateOptions {
  candidateLevel?: string;
  fontSizeOffset?: number;     // steps of 1.5pt (body) / 2pt (name), range -5..+5
  spacingOffset?: number;      // steps of 3pt (sections) / 2pt (entries), range -5..+5
  hiddenSections?: SectionName[];
}

export type SectionName = "header" | "summary" | "skills" | "work" | "projects" | "education" | "certifications" | "languages";

// ── Helpers ──────────────────────────────────────────────

const MONTHS_SHORT = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const MONTHS_LONG = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

function parseMonthYear(date: string): { month: number; year: number } | null {
  // YYYY-MM
  const iso = date.match(/^(\d{4})-(\d{1,2})$/);
  if (iso) return { year: parseInt(iso[1]), month: parseInt(iso[2]) - 1 };

  // MM/YYYY
  const slash = date.match(/^(\d{1,2})\/(\d{4})$/);
  if (slash) return { year: parseInt(slash[2]), month: parseInt(slash[1]) - 1 };

  // "Janeiro 2024", "jan 2024", "Fev 2024"
  const named = date.match(/^([a-záàâãéèêíïóôõöúçñ]+)\s+(\d{4})$/i);
  if (named) {
    const name = named[1].toLowerCase();
    const year = parseInt(named[2]);
    let idx = MONTHS_LONG.findIndex(m => m.toLowerCase() === name);
    if (idx === -1) idx = MONTHS_SHORT.findIndex(m => m.toLowerCase() === name);
    if (idx !== -1) return { year, month: idx };
  }

  return null;
}

/** Short format: "Jan 2024", "Atual" */
function fmt(date: string): string {
  if (!date) return "";
  const lower = date.toLowerCase().trim();
  if (["atual", "present", "current"].includes(lower)) return "Atual";
  const parsed = parseMonthYear(date.trim());
  if (parsed) return `${MONTHS_SHORT[parsed.month]} ${parsed.year}`;
  return date;
}

/** Long format for Moderno template: "Janeiro 2024", "Atual" */
function fmtLong(date: string): string {
  if (!date) return "";
  const lower = date.toLowerCase().trim();
  if (["atual", "present", "current"].includes(lower)) return "Atual";
  const parsed = parseMonthYear(date.trim());
  if (parsed) return `${MONTHS_LONG[parsed.month]} ${parsed.year}`;
  return date;
}

/** Apply pt offset: "12pt" + offset 1 (step 0.5pt) → "12.5pt" */
function adjustPt(base: string, offsetSteps: number, stepSize: number, min: number = 6): string {
  const val = parseFloat(base);
  return `${Math.max(val + offsetSteps * stepSize, min)}pt`;
}

/** Filter resume data to hide sections, so estimateContentSize sees reduced content */
function applyHiddenSections(data: ResumeSchema, hidden?: SectionName[]): ResumeSchema {
  if (!hidden || hidden.length === 0) return data;
  const d = { ...data };
  if (hidden.includes("summary")) d.basics = { ...d.basics, summary: "" };
  if (hidden.includes("skills")) d.skills = [];
  if (hidden.includes("work")) d.work = [];
  if (hidden.includes("projects")) d.projects = [];
  if (hidden.includes("education")) d.education = [];
  if (hidden.includes("certifications")) d.certifications = [];
  if (hidden.includes("languages")) d.languages = [];
  return d;
}

function esc(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function estimateContentSize(data: ResumeSchema): "xsmall" | "small" | "medium" | "large" {
  const totalHighlights = data.work.reduce((sum, w) => sum + w.highlights.length, 0);
  const totalProjectLines = data.projects.reduce((sum, p) => {
    let lines = 1;
    if (p.description) lines += Math.ceil(p.description.length / 85);
    if (p.technologies.length > 0) lines += 1;
    if (p.url || p.repository) lines += 1;
    return sum + lines;
  }, 0);
  const totalEducation = data.education.length;
  const summaryLines = data.basics.summary ? Math.ceil(data.basics.summary.length / 85) : 0;
  // Standalone languages section (3+) adds section title + margin overhead
  const langsScore = data.languages.length >= 3 ? 2 : 0;
  const contentScore = totalHighlights + totalProjectLines + totalEducation + summaryLines + langsScore;

  if (contentScore > 14 || data.work.length > 4) return "large";
  if (contentScore > 7 || data.work.length > 2) return "medium";
  if (contentScore <= 5 && data.work.length <= 1) return "xsmall";
  return "small";
}

function sanitizeUrl(url: string): string {
  if (!url) return "";
  let cleaned = url.trim().replace(/\s+/g, "");
  cleaned = cleaned.replace(/([^:])\/\//g, "$1/");
  cleaned = cleaned.replace(/\/+$/, "");
  if (cleaned && !cleaned.startsWith("http://") && !cleaned.startsWith("https://")) {
    cleaned = "https://" + cleaned;
  }
  return cleaned;
}

function displayUrl(url: string): string {
  return sanitizeUrl(url).replace(/^https?:\/\/(www\.)?/, "");
}

function linkTag(url: string, color: string): string {
  if (!url) return "";
  const clean = sanitizeUrl(url);
  const display = esc(displayUrl(url));
  if (clean.includes(".")) {
    return `<a href="${esc(clean)}" style="color:${color};text-decoration:underline" target="_blank">${display}</a>`;
  }
  return `<span style="color:${color}">${display}</span>`;
}

function buildContactLine(data: ResumeSchema["basics"], linkColor: string): string {
  const items: string[] = [];
  if (data.email) items.push(`<a href="mailto:${esc(data.email)}" style="color:${linkColor};text-decoration:underline">${esc(data.email)}</a>`);
  if (data.phone) items.push(esc(data.phone));
  if (data.location) items.push(esc(data.location));
  if (data.linkedin) items.push(linkTag(data.linkedin, linkColor));
  if (data.github) items.push(linkTag(data.github, linkColor));
  if (data.website) items.push(linkTag(data.website, linkColor));
  return items.join("&nbsp; | &nbsp;");
}

function buildProjectLinks(p: ResumeSchema["projects"][0], color: string): string {
  const items = [
    p.url ? linkTag(p.url, color) : "",
    p.repository ? linkTag(p.repository, color) : "",
  ].filter(Boolean);
  if (items.length === 0) return "";
  return `<div class="entry-links">${items.join("&nbsp; | &nbsp;")}</div>`;
}

// ── Section ordering by candidate level ──────────────────

function getSectionOrder(level?: string): SectionName[] {
  const l = (level || "").toLowerCase();
  if (["estagiário", "júnior", "junior"].includes(l)) {
    return ["summary", "skills", "projects", "work", "education", "languages"];
  }
  if (["sênior", "senior", "especialista"].includes(l)) {
    return ["summary", "work", "skills", "education", "certifications", "languages"];
  }
  // Default: pleno or unknown
  return ["summary", "skills", "work", "projects", "education", "languages"];
}


// ── Skills rendering with categories ─────────────────────

function renderSkillsGrouped(skills: ResumeSchema["skills"], boldCategory: boolean): string {
  const grouped = new Map<string, string[]>();
  for (const s of skills) {
    const cat = s.category || "";
    if (!grouped.has(cat)) grouped.set(cat, []);
    grouped.get(cat)!.push(s.name);
  }

  // If no meaningful categories, render flat
  const hasCats = Array.from(grouped.keys()).some(k => k.trim().length > 0);
  if (!hasCats || grouped.size <= 1) {
    return skills.map(s => esc(s.name)).join(" &bull; ");
  }

  return Array.from(grouped.entries())
    .map(([cat, names]) => {
      const nameStr = names.map(esc).join(", ");
      if (!cat.trim()) return nameStr;
      if (boldCategory) {
        return `<strong>${esc(cat)}:</strong> ${nameStr}`;
      }
      return `<span class="skill-cat">${esc(cat)}:</span> ${nameStr}`;
    })
    .join(" &nbsp;|&nbsp; ");
}

// ══════════════════════════════════════════════════════════
// TEMPLATE: PROFISSIONAL (ATS)
// Single-column, clean, fully ATS-compatible.
// Header: LEFT-ALIGNED. Black/grey only. Bullets: •
// Font: Calibri, "Helvetica Neue", Arial, sans-serif
// ══════════════════════════════════════════════════════════

const ATS_BULLET = "\\2022"; // •
const ATS_LINK_COLOR = "#1a4d8f";

export function templateProfissional(rawData: ResumeSchema, options?: TemplateOptions): string {
  const data = applyHiddenSections(rawData, options?.hiddenSections);
  const fsOff = options?.fontSizeOffset ?? 0;
  const spOff = options?.spacingOffset ?? 0;
  const size = estimateContentSize(data);
  const work = data.work;

  const bodyFs = adjustPt(size === "xsmall" ? "12pt" : size === "small" ? "11.5pt" : size === "medium" ? "9.5pt" : "9pt", fsOff, 1.5);
  const hlFs = adjustPt(size === "xsmall" ? "11.5pt" : size === "small" ? "11pt" : size === "medium" ? "9pt" : "9pt", fsOff, 1.5);
  const nameFs = adjustPt(size === "xsmall" ? "26pt" : size === "small" ? "24pt" : size === "medium" ? "20pt" : "18pt", fsOff, 2);
  const sectionTitleFs = adjustPt(size === "xsmall" ? "14pt" : size === "small" ? "13pt" : size === "medium" ? "11pt" : "10.5pt", fsOff, 1.5);
  const contactFs = adjustPt("9pt", fsOff, 0.75);
  const entryDateFs = adjustPt("9pt", fsOff, 0.75);
  const sectionGap = adjustPt(size === "xsmall" ? "20pt" : size === "small" ? "18pt" : size === "medium" ? "12pt" : "9pt", spOff, 3, 2);
  const entryGap = adjustPt(size === "xsmall" ? "14pt" : size === "small" ? "12pt" : size === "medium" ? "8pt" : "6pt", spOff, 2, 0);
  const bulletGap = adjustPt(size === "xsmall" ? "5pt" : size === "small" ? "4pt" : size === "medium" ? "2pt" : "1.5pt", spOff, 1, 0);
  const lineHeight = size === "xsmall" ? "1.7" : size === "small" ? "1.6" : "1.45";
  const summaryLh = size === "xsmall" ? "1.8" : size === "small" ? "1.7" : "1.55";
  const bulletLh = size === "xsmall" ? "1.7" : size === "small" ? "1.6" : "1.5";
  const margins = size === "xsmall" ? "22mm 24mm 20mm" : size === "small" ? "20mm 22mm 18mm" : size === "medium" ? "16mm 18mm 14mm" : "14mm 16mm 12mm";

  // When user has manual adjustments, use @page margin for top/bottom so multi-page PDFs
  // get consistent margins on every page. Otherwise keep padding on .page (single-page mode).
  const hasAdjustments = !!(fsOff || spOff || options?.hiddenSections?.length);
  const [mTop, mLR, mBottom] = margins.split(" ");
  const pageAtRule = hasAdjustments
    ? `@page { size: A4; margin: ${mTop} 0 ${mBottom || mTop} 0; }`
    : `@page { size: A4; margin: 0; }`;
  const pageCss = hasAdjustments
    ? `width: 210mm; padding: 0 ${mLR};`
    : `width: 210mm; min-height: 297mm; padding: ${margins};`;

  const contactLine = buildContactLine(data.basics, ATS_LINK_COLOR);

  // ── Build section HTML blocks ──
  const workHtml = work
    .map(w => {
      const dates = [fmt(w.startDate), fmt(w.endDate)].filter(Boolean).join(" - ");
      return `
      <div class="entry">
        <div class="entry-row">
          <span class="entry-role">${esc(w.position)} — ${esc(w.company)}</span>
          <span class="entry-date">${dates}</span>
        </div>
        ${w.highlights.length > 0 ? `<ul class="bullets">${w.highlights.map(h => `<li>${esc(h)}</li>`).join("")}</ul>` : ""}
      </div>`;
    }).join("");

  const eduHtml = data.education
    .map(e => {
      const degree = [e.studyType, e.area].filter(Boolean).join(" em ");
      const dates = [fmt(e.startDate), fmt(e.endDate)].filter(Boolean).join(" - ");
      const status = e.status ? ` (${esc(e.status)})` : "";
      return `
      <div class="entry">
        <div class="entry-row">
          <span class="entry-role">${esc(degree || e.institution)}${degree ? ` — ${esc(e.institution)}` : ""}${status}</span>
          ${dates ? `<span class="entry-date">${dates}</span>` : ""}
        </div>
      </div>`;
    }).join("");

  const skillsHtml = renderSkillsGrouped(data.skills, false);

  const langsLine = data.languages
    .map(l => `${esc(l.language)}${l.fluency ? ` (${esc(l.fluency)})` : ""}`)
    .join(" &bull; ");

  // Inline languages into education when 1-2 items and education exists
  const inlineLangs = data.languages.length > 0 && data.languages.length <= 2 && data.education.length > 0;
  const langsInlineHtml = inlineLangs
    ? `<p style="margin-top: 8pt; font-size: ${bodyFs}; color: #333; line-height: 1.7;"><span style="font-weight: 700; color: #000;">Idiomas:</span> ${langsLine}</p>`
    : "";

  const projectsHtml = data.projects
    .map(p => `
      <div class="entry">
        <div class="entry-role">${esc(p.name)}</div>
        ${p.description ? `<div class="entry-desc">${esc(p.description)}</div>` : ""}
        ${p.technologies.length > 0 ? `<div class="entry-tech">${p.technologies.map(esc).join(" &bull; ")}</div>` : ""}
        ${buildProjectLinks(p, ATS_LINK_COLOR)}
      </div>`).join("");

  const certsHtml = data.certifications
    .map(c => {
      const date = c.date ? fmt(c.date) : "";
      return `
      <div class="entry">
        <div class="entry-row">
          <span class="entry-role">${esc(c.name)}${c.issuer ? ` — ${esc(c.issuer)}` : ""}</span>
          ${date ? `<span class="entry-date">${date}</span>` : ""}
        </div>
        ${c.url ? `<div class="entry-links">${linkTag(c.url, ATS_LINK_COLOR)}</div>` : ""}
      </div>`;
    }).join("");

  // ── Build sections map ──
  const sections: Record<SectionName, string> = {
    header: "", // rendered separately
    summary: data.basics.summary
      ? `<div class="section"><div class="section-title">Resumo Profissional</div><p class="summary">${esc(data.basics.summary)}</p></div>`
      : "",
    skills: data.skills.length > 0
      ? `<div class="section"><div class="section-title">Habilidades</div><p class="inline-list">${skillsHtml}</p></div>`
      : "",
    work: work.length > 0
      ? `<div class="section"><div class="section-title">Experiência Profissional</div>${workHtml}</div>`
      : "",
    projects: data.projects.length > 0
      ? `<div class="section"><div class="section-title">Projetos</div>${projectsHtml}</div>`
      : "",
    education: data.education.length > 0
      ? `<div class="section"><div class="section-title">Formação Acadêmica</div>${eduHtml}${langsInlineHtml}</div>`
      : "",
    certifications: data.certifications.length > 0
      ? `<div class="section"><div class="section-title">Certificações</div>${certsHtml}</div>`
      : "",
    languages: data.languages.length > 0 && !inlineLangs
      ? `<div class="section"><div class="section-title">Idiomas</div><p class="inline-list">${langsLine}</p></div>`
      : "",
  };

  const order = getSectionOrder(options?.candidateLevel);
  const sectionsHtml = order.map(name => sections[name]).filter(Boolean).join("\n");

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8">
<style>
  ${pageAtRule}
  * { margin: 0; padding: 0; box-sizing: border-box; }

  html, body {
    width: 210mm;
    font-family: Calibri, 'Helvetica Neue', Arial, sans-serif;
    font-size: ${bodyFs};
    line-height: ${lineHeight};
    color: #333;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .page {
    ${pageCss}
  }

  /* ── Header ─────────────────────── */
  .header {
    padding-bottom: 4pt;
    margin-bottom: ${size === "xsmall" ? "10pt" : size === "small" ? "8pt" : size === "medium" ? "6pt" : "4pt"};
  }
  .name {
    font-size: ${nameFs};
    font-weight: 700;
    color: #000;
    line-height: 1.15;
  }
  .label {
    font-size: 11pt;
    color: #333;
    font-weight: 400;
    margin-top: 2pt;
  }
  .contact {
    font-size: ${contactFs};
    color: #333;
    margin-top: 4pt;
    line-height: 1.6;
  }
  .header-divider {
    border: none;
    border-top: 0.75pt solid #ccc;
    margin-top: 4pt;
  }

  /* ── Sections ───────────────────── */
  .section { margin-bottom: ${sectionGap}; }
  .section:last-child { margin-bottom: 0; }
  .section-title {
    font-size: ${sectionTitleFs};
    font-weight: 700;
    color: #333;
    text-transform: uppercase;
    border-bottom: 0.5pt solid #ccc;
    padding-bottom: 2pt;
    margin-bottom: 6pt;
  }

  .summary {
    font-size: ${bodyFs};
    color: #333;
    line-height: ${summaryLh};
  }

  /* ── Entries ─────────────────────── */
  .entry {
    margin-bottom: ${entryGap};
    page-break-inside: avoid;
    break-inside: avoid;
  }
  .entry:last-child { margin-bottom: 0; }
  .entry-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 8pt;
  }
  .entry-role {
    font-weight: 700;
    color: #000;
    font-size: ${bodyFs};
  }
  .entry-date {
    font-size: ${entryDateFs};
    color: #333;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .entry-desc {
    font-size: ${hlFs};
    color: #333;
    margin-top: 2pt;
    line-height: ${bulletLh};
  }
  .entry-tech {
    font-size: 8.5pt;
    color: #333;
    margin-top: 2pt;
  }
  .entry-links {
    font-size: 8.5pt;
    margin-top: 2pt;
  }

  /* ── Bullets ─────────────────────── */
  .bullets {
    list-style: none;
    margin-top: 3pt;
    padding-left: 14pt;
  }
  .bullets li {
    position: relative;
    margin-bottom: ${bulletGap};
    font-size: ${hlFs};
    color: #333;
    line-height: ${bulletLh};
  }
  .bullets li::before {
    content: "${ATS_BULLET}";
    position: absolute;
    left: -11pt;
    color: #333;
  }

  /* ── Skills ──────────────────────── */
  .inline-list {
    font-size: ${bodyFs};
    color: #333;
    line-height: 1.7;
  }
  .skill-cat {
    font-weight: 700;
    color: #000;
  }
</style>
</head>
<body>
<div class="page">

  <div class="header">
    <div class="name">${esc(data.basics.name)}</div>
    ${data.basics.label ? `<div class="label">${esc(data.basics.label)}</div>` : ""}
    ${contactLine ? `<div class="contact">${contactLine}</div>` : ""}
    <hr class="header-divider" />
  </div>

  ${sectionsHtml}

</div>
</body>
</html>`;
}

// ══════════════════════════════════════════════════════════
// TEMPLATE: MODERNO
// Single-column, ATS-safe, visually distinct.
// Accent: #1B3A6B (navy). Accent bar at top. Blue name/headers.
// Bullets: – (en dash) in accent color, normal weight.
// Font: Calibri, "Segoe UI", Arial, sans-serif
// ══════════════════════════════════════════════════════════

export const MODERNO_ACCENT = "#1B3A6B";
const MODERNO_ACCENT_40 = "rgba(27,58,107,0.4)";

// Computes per-page top/bottom margins for the Moderno template, used by the
// PDF route when content spans multiple pages (puppeteer's margin override).
// Left/right are 0 here because `.page` provides side padding internally.
export function getModernoPdfMargins(
  rawData: ResumeSchema,
  options?: TemplateOptions
): { top: string; right: string; bottom: string; left: string } {
  const data = applyHiddenSections(rawData, options?.hiddenSections);
  const size = estimateContentSize(data);
  const margins =
    size === "xsmall" ? "22mm 24mm 20mm" :
    size === "small" ? "20mm 22mm 18mm" :
    size === "medium" ? "16mm 18mm 14mm" : "14mm 16mm 12mm";
  const [mTop, , mBottom] = margins.split(" ");
  return { top: mTop, right: "0", bottom: mBottom || mTop, left: "0" };
}

export function templateModerno(rawData: ResumeSchema, options?: TemplateOptions): string {
  const data = applyHiddenSections(rawData, options?.hiddenSections);
  const fsOff = options?.fontSizeOffset ?? 0;
  const spOff = options?.spacingOffset ?? 0;
  const size = estimateContentSize(data);
  const work = data.work;

  const bodyFs = adjustPt(size === "xsmall" ? "12pt" : size === "small" ? "11.5pt" : size === "medium" ? "9.5pt" : "9pt", fsOff, 1.5);
  const hlFs = adjustPt(size === "xsmall" ? "11.5pt" : size === "small" ? "11pt" : size === "medium" ? "9pt" : "9pt", fsOff, 1.5);
  const nameFs = adjustPt(size === "xsmall" ? "28pt" : size === "small" ? "26pt" : size === "medium" ? "22pt" : "20pt", fsOff, 2);
  const sectionTitleFs = adjustPt(size === "xsmall" ? "13pt" : size === "small" ? "12pt" : size === "medium" ? "10.5pt" : "10pt", fsOff, 1.5);
  const contactFs = adjustPt("9pt", fsOff, 0.75);
  const entryDateFs = adjustPt("9pt", fsOff, 0.75);
  const sectionGap = adjustPt(size === "xsmall" ? "20pt" : size === "small" ? "18pt" : size === "medium" ? "12pt" : "9pt", spOff, 3, 2);
  const entryGap = adjustPt(size === "xsmall" ? "14pt" : size === "small" ? "12pt" : size === "medium" ? "8pt" : "6pt", spOff, 2, 0);
  const bulletGap = adjustPt(size === "xsmall" ? "5pt" : size === "small" ? "4pt" : size === "medium" ? "2pt" : "1.5pt", spOff, 1, 0);
  const lineHeight = size === "xsmall" ? "1.7" : size === "small" ? "1.6" : "1.45";
  const summaryLh = size === "xsmall" ? "1.8" : size === "small" ? "1.7" : "1.55";
  const bulletLh = size === "xsmall" ? "1.7" : size === "small" ? "1.6" : "1.5";
  const margins = size === "xsmall" ? "22mm 24mm 20mm" : size === "small" ? "20mm 22mm 18mm" : size === "medium" ? "16mm 18mm 14mm" : "14mm 16mm 12mm";

  const hasAdjustments = !!(fsOff || spOff || options?.hiddenSections?.length);
  const [mTop, mLR, mBottom] = margins.split(" ");
  const mBot = mBottom || mTop;
  // Single-page mode: @page margin 0 + .page padding — auto-layout fits 1 page; accent bar
  // (in CSS, position:fixed top:0) touches the paper top edge.
  // Multi-page mode: @page reserves real top/bottom margin space on every page so content
  // never bleeds into the header area. Route.ts mirrors these margins to puppeteer's pdf
  // options AND injects the accent bar via `headerTemplate` (which natively repeats on each
  // page). The `.accent-bar` element is omitted from the body in this mode.
  const pageAtRule = hasAdjustments
    ? `@page { size: A4; margin: ${mTop} 0 ${mBot} 0; }`
    : `@page { size: A4; margin: 0; }`;
  const pageCss = hasAdjustments
    ? `width: 210mm; padding: 0 ${mLR}; position: relative;`
    : `width: 210mm; min-height: 297mm; padding: ${margins}; padding-top: calc(${mTop} + 4pt); position: relative;`;

  const contactLine = buildContactLine(data.basics, MODERNO_ACCENT);

  // ── Build section HTML blocks ──
  const workHtml = work
    .map(w => {
      const dates = [fmtLong(w.startDate), fmtLong(w.endDate)].filter(Boolean).join(" – ");
      return `
      <div class="entry">
        <div class="entry-row">
          <span class="entry-role">${esc(w.position)} <span class="entry-sep">—</span> <span class="entry-company">${esc(w.company)}</span></span>
          <span class="entry-date">${dates}</span>
        </div>
        ${w.highlights.length > 0 ? `<ul class="bullets">${w.highlights.map(h => `<li>${esc(h)}</li>`).join("")}</ul>` : ""}
      </div>`;
    }).join("");

  const eduHtml = data.education
    .map(e => {
      const degree = [e.studyType, e.area].filter(Boolean).join(" em ");
      const dates = [fmtLong(e.startDate), fmtLong(e.endDate)].filter(Boolean).join(" – ");
      const status = e.status ? ` (${esc(e.status)})` : "";
      return `
      <div class="entry">
        <div class="entry-row">
          <span class="entry-role">${esc(degree || e.institution)}${degree ? ` <span class="entry-sep">—</span> <span class="entry-company">${esc(e.institution)}</span>` : ""}${status}</span>
          ${dates ? `<span class="entry-date">${dates}</span>` : ""}
        </div>
      </div>`;
    }).join("");

  const skillsHtml = renderSkillsGrouped(data.skills, true);

  const langsLine = data.languages
    .map(l => `${esc(l.language)}${l.fluency ? ` (${esc(l.fluency)})` : ""}`)
    .join(" &bull; ");

  // Inline languages into education when 1-2 items and education exists
  const inlineLangs = data.languages.length > 0 && data.languages.length <= 2 && data.education.length > 0;
  const langsInlineHtml = inlineLangs
    ? `<p style="margin-top: 8pt; font-size: ${bodyFs}; color: #444; line-height: 1.7;"><span style="font-weight: 700; color: ${MODERNO_ACCENT};">Idiomas:</span> ${langsLine}</p>`
    : "";

  const projectsHtml = data.projects
    .map(p => `
      <div class="entry">
        <div class="entry-role">${esc(p.name)}</div>
        ${p.description ? `<div class="entry-desc">${esc(p.description)}</div>` : ""}
        ${p.technologies.length > 0 ? `<div class="entry-tech">${p.technologies.map(esc).join(" &bull; ")}</div>` : ""}
        ${buildProjectLinks(p, MODERNO_ACCENT)}
      </div>`).join("");

  const certsHtml = data.certifications
    .map(c => {
      const date = c.date ? fmtLong(c.date) : "";
      return `
      <div class="entry">
        <div class="entry-row">
          <span class="entry-role">${esc(c.name)}${c.issuer ? ` <span class="entry-sep">—</span> <span class="entry-company">${esc(c.issuer)}</span>` : ""}</span>
          ${date ? `<span class="entry-date">${date}</span>` : ""}
        </div>
        ${c.url ? `<div class="entry-links">${linkTag(c.url, MODERNO_ACCENT)}</div>` : ""}
      </div>`;
    }).join("");

  // ── Build sections map ──
  const sections: Record<SectionName, string> = {
    header: "", // rendered separately
    summary: data.basics.summary
      ? `<div class="section"><div class="section-title">Resumo Profissional</div><p class="summary">${esc(data.basics.summary)}</p></div>`
      : "",
    skills: data.skills.length > 0
      ? `<div class="section"><div class="section-title">Habilidades</div><p class="inline-list">${skillsHtml}</p></div>`
      : "",
    work: work.length > 0
      ? `<div class="section"><div class="section-title">Experiência Profissional</div>${workHtml}</div>`
      : "",
    projects: data.projects.length > 0
      ? `<div class="section"><div class="section-title">Projetos</div>${projectsHtml}</div>`
      : "",
    education: data.education.length > 0
      ? `<div class="section"><div class="section-title">Formação Acadêmica</div>${eduHtml}${langsInlineHtml}</div>`
      : "",
    certifications: data.certifications.length > 0
      ? `<div class="section"><div class="section-title">Certificações</div>${certsHtml}</div>`
      : "",
    languages: data.languages.length > 0 && !inlineLangs
      ? `<div class="section"><div class="section-title">Idiomas</div><p class="inline-list">${langsLine}</p></div>`
      : "",
  };

  const order = getSectionOrder(options?.candidateLevel);
  const sectionsHtml = order.map(name => sections[name]).filter(Boolean).join("\n");

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8">
<style>
  ${pageAtRule}
  * { margin: 0; padding: 0; box-sizing: border-box; }

  html, body {
    width: 210mm;
    font-family: Calibri, 'Segoe UI', Arial, sans-serif;
    font-size: ${bodyFs};
    line-height: ${lineHeight};
    color: #333;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .page {
    ${pageCss}
  }

  /* ── 4px accent bar at top of page (single-page mode only) ── */
  /* In multi-page mode the bar is rendered by puppeteer's headerTemplate instead. */
  .accent-bar {
    width: 210mm;
    height: 4pt;
    background: ${MODERNO_ACCENT};
    position: fixed;
    top: 0;
    left: 0;
  }

  /* ── Header ─────────────────────── */
  .header {
    padding-bottom: 4pt;
    margin-bottom: ${size === "xsmall" ? "10pt" : size === "small" ? "8pt" : size === "medium" ? "6pt" : "4pt"};
  }
  .name {
    font-size: ${nameFs};
    font-weight: 700;
    color: ${MODERNO_ACCENT};
    letter-spacing: 0.5pt;
    line-height: 1.15;
  }
  .label {
    font-size: 12pt;
    color: #555;
    font-weight: 400;
    margin-top: 3pt;
  }
  .contact {
    font-size: ${contactFs};
    color: #555;
    margin-top: 4pt;
    line-height: 1.6;
  }
  .header-divider {
    border: none;
    border-top: 1.5pt solid ${MODERNO_ACCENT};
    margin-top: 4pt;
  }

  /* ── Sections ───────────────────── */
  .section { margin-bottom: ${sectionGap}; }
  .section:last-child { margin-bottom: 0; }
  .section-title {
    font-size: ${sectionTitleFs};
    font-weight: 700;
    color: ${MODERNO_ACCENT};
    text-transform: uppercase;
    border-bottom: 1pt solid ${MODERNO_ACCENT_40};
    padding-bottom: 3pt;
    margin-bottom: 6pt;
  }

  .summary {
    font-size: ${bodyFs};
    color: #444;
    line-height: ${summaryLh};
  }

  /* ── Entries ─────────────────────── */
  .entry {
    margin-bottom: ${entryGap};
    page-break-inside: avoid;
    break-inside: avoid;
  }
  .entry:last-child { margin-bottom: 0; }
  .entry-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 8pt;
  }
  .entry-role {
    font-weight: 700;
    color: ${MODERNO_ACCENT};
    font-size: ${bodyFs};
  }
  .entry-sep {
    font-weight: 400;
    color: #999;
  }
  .entry-company {
    font-weight: 400;
    color: #333;
  }
  .entry-date {
    font-size: ${entryDateFs};
    color: #888;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .entry-desc {
    font-size: ${hlFs};
    color: #555;
    margin-top: 2pt;
    line-height: ${bulletLh};
  }
  .entry-tech {
    font-size: 8.5pt;
    color: #777;
    margin-top: 2pt;
  }
  .entry-links {
    font-size: 8.5pt;
    margin-top: 2pt;
  }

  /* ── Bullets — en dash in accent, normal weight ── */
  .bullets {
    list-style: none;
    margin-top: 3pt;
    padding-left: 14pt;
  }
  .bullets li {
    position: relative;
    margin-bottom: ${bulletGap};
    font-size: ${hlFs};
    color: #444;
    line-height: ${bulletLh};
  }
  .bullets li::before {
    content: "\\2013";
    position: absolute;
    left: -11pt;
    color: ${MODERNO_ACCENT};
    font-weight: 400;
  }

  /* ── Inline lists ───────────────── */
  .inline-list {
    font-size: ${bodyFs};
    color: #444;
    line-height: 1.7;
  }
</style>
</head>
<body>
<div class="page">

  ${hasAdjustments ? "" : `<div class="accent-bar"></div>`}

  <div class="header">
    <div class="name">${esc(data.basics.name)}</div>
    ${data.basics.label ? `<div class="label">${esc(data.basics.label)}</div>` : ""}
    ${contactLine ? `<div class="contact">${contactLine}</div>` : ""}
    <hr class="header-divider" />
  </div>

  ${sectionsHtml}

</div>
</body>
</html>`;
}

// ══════════════════════════════════════════════════════════
// Template registry
// ══════════════════════════════════════════════════════════

export const TEMPLATES: Record<TemplateName, { label: string; render: (data: ResumeSchema, options?: TemplateOptions) => string }> = {
  profissional: { label: "Profissional (ATS)", render: templateProfissional },
  moderno: { label: "Moderno", render: templateModerno },
};
