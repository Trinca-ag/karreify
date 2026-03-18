import type { ResumeSchema } from "@/lib/resume-schema";

// ── Helpers ──────────────────────────────────────────────

function fmt(date: string): string {
  if (!date) return "";
  const lower = date.toLowerCase();
  if (["atual", "present", "current"].includes(lower)) return "Atual";
  const m = date.match(/^(\d{4})-(\d{2})$/);
  if (m) {
    const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    return `${months[parseInt(m[2]) - 1]} ${m[1]}`;
  }
  return date;
}

function esc(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function limitHighlights(work: ResumeSchema["work"], maxPerJob: number): ResumeSchema["work"] {
  return work.map(w => ({
    ...w,
    highlights: w.highlights.slice(0, maxPerJob),
  }));
}

function estimateContentSize(data: ResumeSchema): "small" | "medium" | "large" {
  const totalHighlights = data.work.reduce((sum, w) => sum + w.highlights.length, 0);

  // Projects with descriptions add significant vertical space
  const totalProjectLines = data.projects.reduce((sum, p) => {
    let lines = 1; // title
    if (p.description) lines += Math.ceil(p.description.length / 85);
    if (p.technologies.length > 0) lines += 1;
    if (p.url || p.repository) lines += 1;
    return sum + lines;
  }, 0);

  const totalEducation = data.education.length;
  const summaryLines = data.basics.summary ? Math.ceil(data.basics.summary.length / 85) : 0;

  // Weighted content score — estimates total "lines" of content
  const contentScore = totalHighlights + totalProjectLines + totalEducation + summaryLines;

  if (contentScore > 14 || data.work.length > 4) return "large";
  if (contentScore > 7 || data.work.length > 2) return "medium";
  return "small";
}

/** Format a URL for display — strip protocol prefix */
function displayUrl(url: string): string {
  return sanitizeUrl(url).replace(/^https?:\/\/(www\.)?/, "");
}

/** Sanitize a URL: remove spaces, add protocol, remove double slashes */
function sanitizeUrl(url: string): string {
  if (!url) return "";
  let cleaned = url.trim().replace(/\s+/g, "");
  // remove duplicate slashes (except after protocol)
  cleaned = cleaned.replace(/([^:])\/\//g, "$1/");
  return cleaned;
}

/** Build an <a> tag for a URL. If the URL is too broken, show as plain text instead of a link */
function linkTag(url: string, color: string): string {
  if (!url) return "";
  const clean = sanitizeUrl(url);
  const display = esc(displayUrl(url));
  // Must have at least one dot to be a plausible URL
  if (clean.includes(".")) {
    const href = clean.startsWith("http") ? esc(clean) : `https://${esc(clean)}`;
    return `<a href="${href}" style="color:${color};text-decoration:none">${display}</a>`;
  }
  // Too malformed to link — show as plain text
  return `<span style="color:${color}">${display}</span>`;
}

/** Build header contact line with pipe separators (ASCII-safe) */
function buildContactLine(data: ResumeSchema["basics"]): string {
  const items = [
    data.email,
    data.phone,
    data.location,
  ].filter(Boolean).map(esc);
  return items.join("&nbsp; | &nbsp;");
}

/** Build links line (LinkedIn, GitHub, Website) */
function buildLinksLine(data: ResumeSchema["basics"], color: string): string {
  const items = [
    data.linkedin ? linkTag(data.linkedin, color) : "",
    data.github ? linkTag(data.github, color) : "",
    data.website ? linkTag(data.website, color) : "",
  ].filter(Boolean);
  return items.join("&nbsp; | &nbsp;");
}

/** Build project links HTML */
function buildProjectLinks(p: ResumeSchema["projects"][0], color: string): string {
  const items = [
    p.url ? linkTag(p.url, color) : "",
    p.repository ? linkTag(p.repository, color) : "",
  ].filter(Boolean);
  if (items.length === 0) return "";
  return `<div class="entry-links">${items.join("&nbsp; | &nbsp;")}</div>`;
}

// ══════════════════════════════════════════════════════════
// TEMPLATE: PROFISSIONAL (ATS)
// Single-column, clean, fully ATS-compatible.
// Header: LEFT-ALIGNED. Black/grey only. Bullets: •
// Order: Name+Contact → Summary → Skills → Experience → Projects → Education → Languages
// ══════════════════════════════════════════════════════════

const ATS_BULLET = "\\2022"; // •
const ATS_LINK_COLOR = "#1a4d8f";

export function templateProfissional(data: ResumeSchema): string {
  const size = estimateContentSize(data);
  const maxHL = size === "large" ? 2 : size === "medium" ? 3 : 4;
  const work = limitHighlights(data.work, maxHL);

  // Dynamic sizing — larger fonts for small content to fill page
  const bodyFs = size === "small" ? "10.5pt" : size === "medium" ? "9.5pt" : "9pt";
  const hlFs = size === "small" ? "10pt" : size === "medium" ? "9pt" : "8.5pt";
  const nameFs = size === "small" ? "22pt" : size === "medium" ? "20pt" : "18pt";
  const sectionTitleFs = size === "small" ? "12pt" : size === "medium" ? "11pt" : "10.5pt";
  const sectionGap = size === "small" ? "16pt" : size === "medium" ? "12pt" : "9pt";
  const entryGap = size === "small" ? "10pt" : size === "medium" ? "8pt" : "6pt";
  const bulletGap = size === "small" ? "3pt" : size === "medium" ? "2pt" : "1.5pt";
  const margins = size === "small" ? "18mm 20mm 16mm" : size === "medium" ? "16mm 18mm 14mm" : "14mm 16mm 12mm";

  const contactLine = buildContactLine(data.basics);
  const linksLine = buildLinksLine(data.basics, ATS_LINK_COLOR);

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
      return `
      <div class="entry">
        <div class="entry-row">
          <span class="entry-role">${esc(degree || e.institution)}${degree ? ` — ${esc(e.institution)}` : ""}</span>
          ${dates ? `<span class="entry-date">${dates}</span>` : ""}
        </div>
      </div>`;
    }).join("");

  const skillsLine = data.skills.map(s => esc(s.name)).join(" &bull; ");

  const langsLine = data.languages
    .map(l => `${esc(l.language)}${l.fluency ? ` (${esc(l.fluency)})` : ""}`)
    .join(" &bull; ");

  const projectsHtml = data.projects
    .map(p => `
      <div class="entry">
        <div class="entry-role">${esc(p.name)}</div>
        ${p.description ? `<div class="entry-desc">${esc(p.description)}</div>` : ""}
        ${p.technologies.length > 0 ? `<div class="entry-tech">${p.technologies.map(esc).join(" &bull; ")}</div>` : ""}
        ${buildProjectLinks(p, ATS_LINK_COLOR)}
      </div>`).join("");

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8">
<style>
  @page { size: A4; margin: 0; }
  * { margin: 0; padding: 0; box-sizing: border-box; }

  html, body {
    width: 210mm;
    height: 297mm;
    font-family: Calibri, 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: ${bodyFs};
    line-height: 1.45;
    color: #333;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .page {
    width: 210mm;
    height: 297mm;
    padding: ${margins};
    overflow: hidden;
  }

  /* ── Header — LEFT ALIGNED ─────────── */
  .header {
    padding-bottom: 8pt;
    margin-bottom: ${sectionGap};
  }
  .name {
    font-size: ${nameFs};
    font-weight: 700;
    color: #000;
    line-height: 1.15;
  }
  .label {
    font-size: 11pt;
    color: #555;
    font-weight: 400;
    margin-top: 2pt;
  }
  .contact {
    font-size: 9pt;
    color: #555;
    margin-top: 5pt;
    line-height: 1.6;
  }
  .links {
    font-size: 9pt;
    color: #555;
    margin-top: 2pt;
    line-height: 1.6;
  }
  .header-divider {
    border: none;
    border-top: 0.75pt solid #ccc;
    margin-top: 8pt;
  }

  /* ── Sections ───────────────────────── */
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
    line-height: 1.55;
  }

  /* ── Entries ─────────────────────────── */
  .entry { margin-bottom: ${entryGap}; }
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
    font-size: 9pt;
    color: #666;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .entry-desc {
    font-size: ${hlFs};
    color: #444;
    margin-top: 2pt;
    line-height: 1.5;
  }
  .entry-tech {
    font-size: 8.5pt;
    color: #666;
    margin-top: 2pt;
  }
  .entry-links {
    font-size: 8.5pt;
    margin-top: 2pt;
  }

  /* ── Bullets ─────────────────────────── */
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
    line-height: 1.5;
  }
  .bullets li::before {
    content: "${ATS_BULLET}";
    position: absolute;
    left: -11pt;
    color: #333;
  }

  /* ── Inline lists ───────────────────── */
  .inline-list {
    font-size: ${bodyFs};
    color: #333;
    line-height: 1.7;
  }
</style>
</head>
<body>
<div class="page">

  <div class="header">
    <div class="name">${esc(data.basics.name)}</div>
    ${data.basics.label ? `<div class="label">${esc(data.basics.label)}</div>` : ""}
    ${contactLine ? `<div class="contact">${contactLine}</div>` : ""}
    ${linksLine ? `<div class="links">${linksLine}</div>` : ""}
    <hr class="header-divider" />
  </div>

  ${data.basics.summary ? `<div class="section"><div class="section-title">Resumo Profissional</div><p class="summary">${esc(data.basics.summary)}</p></div>` : ""}

  ${data.skills.length > 0 ? `<div class="section"><div class="section-title">Habilidades</div><p class="inline-list">${skillsLine}</p></div>` : ""}

  ${work.length > 0 ? `<div class="section"><div class="section-title">Experiência Profissional</div>${workHtml}</div>` : ""}

  ${data.projects.length > 0 ? `<div class="section"><div class="section-title">Projetos</div>${projectsHtml}</div>` : ""}

  ${data.education.length > 0 ? `<div class="section"><div class="section-title">Formação Acadêmica</div>${eduHtml}</div>` : ""}

  ${data.languages.length > 0 ? `<div class="section"><div class="section-title">Idiomas</div><p class="inline-list">${langsLine}</p></div>` : ""}

</div>
</body>
</html>`;
}

// ══════════════════════════════════════════════════════════
// TEMPLATE: MODERNO
// Single-column, ATS-safe, visually distinct from ATS template.
// Accent color #1B3A6B (navy). Accent bar at top. Blue name/headers/bullets.
// Header: left-aligned. Bullets: – (en dash) in accent color.
// Order: Name+Contact → Summary → Skills → Experience → Projects → Education → Languages
// ══════════════════════════════════════════════════════════

const MODERNO_ACCENT = "#1B3A6B";
const MODERNO_ACCENT_40 = "rgba(27,58,107,0.4)";

export function templateModerno(data: ResumeSchema): string {
  const size = estimateContentSize(data);
  const maxHL = size === "large" ? 2 : size === "medium" ? 3 : 4;
  const work = limitHighlights(data.work, maxHL);

  const bodyFs = size === "small" ? "10.5pt" : size === "medium" ? "9.5pt" : "9pt";
  const hlFs = size === "small" ? "10pt" : size === "medium" ? "9pt" : "8.5pt";
  const nameFs = size === "small" ? "24pt" : size === "medium" ? "22pt" : "20pt";
  const sectionTitleFs = size === "small" ? "11pt" : size === "medium" ? "10.5pt" : "10pt";
  const sectionGap = size === "small" ? "16pt" : size === "medium" ? "12pt" : "9pt";
  const entryGap = size === "small" ? "10pt" : size === "medium" ? "8pt" : "6pt";
  const bulletGap = size === "small" ? "3pt" : size === "medium" ? "2pt" : "1.5pt";
  const margins = size === "small" ? "18mm 20mm 16mm" : size === "medium" ? "16mm 18mm 14mm" : "14mm 16mm 12mm";

  const contactLine = buildContactLine(data.basics);
  const linksLine = buildLinksLine(data.basics, MODERNO_ACCENT);

  const workHtml = work
    .map(w => {
      const dates = [fmt(w.startDate), fmt(w.endDate)].filter(Boolean).join(" - ");
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
      const dates = [fmt(e.startDate), fmt(e.endDate)].filter(Boolean).join(" - ");
      return `
      <div class="entry">
        <div class="entry-row">
          <span class="entry-role">${esc(degree || e.institution)}${degree ? ` <span class="entry-sep">—</span> <span class="entry-company">${esc(e.institution)}</span>` : ""}</span>
          ${dates ? `<span class="entry-date">${dates}</span>` : ""}
        </div>
      </div>`;
    }).join("");

  const skillsLine = data.skills.map(s => `<strong>${esc(s.name)}</strong>`).join(" &bull; ");

  const langsLine = data.languages
    .map(l => `${esc(l.language)}${l.fluency ? ` (${esc(l.fluency)})` : ""}`)
    .join(" &bull; ");

  const projectsHtml = data.projects
    .map(p => `
      <div class="entry">
        <div class="entry-role">${esc(p.name)}</div>
        ${p.description ? `<div class="entry-desc">${esc(p.description)}</div>` : ""}
        ${p.technologies.length > 0 ? `<div class="entry-tech">${p.technologies.map(esc).join(" &bull; ")}</div>` : ""}
        ${buildProjectLinks(p, MODERNO_ACCENT)}
      </div>`).join("");

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8">
<style>
  @page { size: A4; margin: 0; }
  * { margin: 0; padding: 0; box-sizing: border-box; }

  html, body {
    width: 210mm;
    height: 297mm;
    font-family: Calibri, 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: ${bodyFs};
    line-height: 1.45;
    color: #333;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .page {
    width: 210mm;
    height: 297mm;
    padding: ${margins};
    padding-top: calc(${margins.split(" ")[0]} + 4pt);
    overflow: hidden;
    position: relative;
  }

  /* ── 4px accent bar at very top ─────── */
  .accent-bar {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4pt;
    background: ${MODERNO_ACCENT};
  }

  /* ── Header — LEFT ALIGNED ─────────── */
  .header {
    padding-bottom: 8pt;
    margin-bottom: ${sectionGap};
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
    font-size: 9pt;
    color: #555;
    margin-top: 6pt;
    line-height: 1.6;
  }
  .links {
    font-size: 9pt;
    color: #555;
    margin-top: 2pt;
    line-height: 1.6;
  }
  .header-divider {
    border: none;
    border-top: 1.5pt solid ${MODERNO_ACCENT};
    margin-top: 8pt;
  }

  /* ── Sections ───────────────────────── */
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
    line-height: 1.55;
  }

  /* ── Entries ─────────────────────────── */
  .entry { margin-bottom: ${entryGap}; }
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
    font-size: 9pt;
    color: #888;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .entry-desc {
    font-size: ${hlFs};
    color: #555;
    margin-top: 2pt;
    line-height: 1.5;
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

  /* ── Bullets — en dash in accent ────── */
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
    line-height: 1.5;
  }
  .bullets li::before {
    content: "\\2013";
    position: absolute;
    left: -11pt;
    color: ${MODERNO_ACCENT};
    font-weight: 700;
  }

  /* ── Inline lists ───────────────────── */
  .inline-list {
    font-size: ${bodyFs};
    color: #444;
    line-height: 1.7;
  }
</style>
</head>
<body>
<div class="page">

  <div class="accent-bar"></div>

  <div class="header">
    <div class="name">${esc(data.basics.name)}</div>
    ${data.basics.label ? `<div class="label">${esc(data.basics.label)}</div>` : ""}
    ${contactLine ? `<div class="contact">${contactLine}</div>` : ""}
    ${linksLine ? `<div class="links">${linksLine}</div>` : ""}
    <hr class="header-divider" />
  </div>

  ${data.basics.summary ? `<div class="section"><div class="section-title">Resumo Profissional</div><p class="summary">${esc(data.basics.summary)}</p></div>` : ""}

  ${data.skills.length > 0 ? `<div class="section"><div class="section-title">Habilidades</div><p class="inline-list">${skillsLine}</p></div>` : ""}

  ${work.length > 0 ? `<div class="section"><div class="section-title">Experiência Profissional</div>${workHtml}</div>` : ""}

  ${data.projects.length > 0 ? `<div class="section"><div class="section-title">Projetos</div>${projectsHtml}</div>` : ""}

  ${data.education.length > 0 ? `<div class="section"><div class="section-title">Formação Acadêmica</div>${eduHtml}</div>` : ""}

  ${data.languages.length > 0 ? `<div class="section"><div class="section-title">Idiomas</div><p class="inline-list">${langsLine}</p></div>` : ""}

</div>
</body>
</html>`;
}

// ══════════════════════════════════════════════════════════
// Template registry
// ══════════════════════════════════════════════════════════

export type TemplateName = "profissional" | "moderno";

export const TEMPLATES: Record<TemplateName, { label: string; render: (data: ResumeSchema) => string }> = {
  profissional: { label: "Profissional (ATS)", render: templateProfissional },
  moderno: { label: "Moderno", render: templateModerno },
};
