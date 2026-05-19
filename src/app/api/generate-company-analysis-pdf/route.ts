import { NextRequest, NextResponse } from "next/server";
import type { CompanyAnalysisResult } from "@/services/ai-company-analysis";

export const maxDuration = 60;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function starsSvg(rating: number): string {
  const filled = Math.round(rating);
  const stars: string[] = [];
  for (let i = 1; i <= 5; i++) {
    const color = i <= filled ? "#f59e0b" : "#cbd5e1";
    stars.push(
      `<svg width="12" height="12" viewBox="0 0 24 24" fill="${color}" style="vertical-align: middle; margin-right: 2px;"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`
    );
  }
  return stars.join("");
}

function buildHtml(data: CompanyAnalysisResult, date: string): string {
  const rating = data.employeeReviews?.overallRating ?? 0;

  const list = (items: string[] | undefined, color: string) =>
    (items ?? []).length === 0
      ? '<p class="muted">Não informado.</p>'
      : `<ul class="list">${(items ?? [])
          .map(
            (i) =>
              `<li><span class="bullet" style="background:${color}"></span>${escapeHtml(i)}</li>`
          )
          .join("")}</ul>`;

  const para = (txt: string | undefined) =>
    txt ? `<p>${escapeHtml(txt).replace(/\n/g, "<br>")}</p>` : '<p class="muted">Não informado.</p>';

  const otherLocations = data.otherLocations?.filter(Boolean) ?? [];
  const hasContact = data.website || data.phone || data.email || data.linkedin;

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    background: #fff;
    color: #1e293b;
    font-size: 11px;
    line-height: 1.55;
  }
  .page { padding: 16mm 18mm; }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 24px;
    padding-bottom: 14px;
    border-bottom: 2px solid #4f46e5;
    margin-bottom: 20px;
  }
  .title { font-size: 22px; font-weight: 700; color: #0f172a; }
  .sub { font-size: 11px; color: #475569; margin-top: 4px; }
  .rating-badge {
    text-align: center;
    padding: 10px 16px;
    background: #fef3c7;
    border: 1px solid #fcd34d;
    border-radius: 10px;
    min-width: 96px;
  }
  .rating-value { font-size: 22px; font-weight: 700; color: #b45309; line-height: 1; }
  .rating-label { font-size: 9px; color: #92400e; margin-top: 4px; }
  .rating-stars { margin: 4px 0; }

  .tags { margin: 12px 0 18px; }
  .tag {
    display: inline-block;
    background: #eef2ff;
    color: #4338ca;
    border: 1px solid #c7d2fe;
    border-radius: 6px;
    padding: 3px 8px;
    font-size: 9.5px;
    margin-right: 6px;
    margin-bottom: 4px;
  }

  h2 {
    font-size: 12.5px;
    color: #4f46e5;
    margin-bottom: 8px;
    margin-top: 18px;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    font-weight: 700;
    border-left: 3px solid #4f46e5;
    padding-left: 8px;
  }
  h2:first-of-type { margin-top: 0; }

  .section { margin-bottom: 8px; }
  .section p { text-align: justify; color: #334155; margin-bottom: 6px; }
  .muted { color: #94a3b8; font-style: italic; }

  .two-col { display: flex; gap: 18px; margin-top: 4px; }
  .two-col > div { flex: 1; min-width: 0; }

  .list { list-style: none; padding: 0; }
  .list li {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    color: #334155;
    margin-bottom: 5px;
    padding-left: 2px;
  }
  .bullet {
    display: inline-block;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    margin-top: 6px;
    flex-shrink: 0;
  }

  .salary-box {
    background: #ecfdf5;
    border: 1px solid #a7f3d0;
    border-radius: 8px;
    padding: 10px 12px;
    margin-top: 4px;
  }
  .salary-avg { font-size: 16px; font-weight: 700; color: #047857; }
  .salary-range { font-size: 10px; color: #065f46; margin-top: 2px; }

  .interview-tips { counter-reset: tip; margin-top: 4px; }
  .interview-tips li {
    counter-increment: tip;
    margin-bottom: 7px;
    padding-left: 22px;
    position: relative;
    color: #334155;
  }
  .interview-tips li::before {
    content: counter(tip);
    position: absolute;
    left: 0; top: 0;
    width: 16px; height: 16px;
    background: #fef3c7;
    color: #b45309;
    font-size: 9px;
    font-weight: 700;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .contact-list { font-size: 10.5px; color: #334155; }
  .contact-list li { margin-bottom: 3px; }
  .contact-list .label { color: #64748b; font-weight: 600; margin-right: 6px; }

  .footer {
    margin-top: 22px;
    padding-top: 10px;
    border-top: 1px solid #e2e8f0;
    font-size: 9px;
    color: #94a3b8;
    text-align: center;
  }
</style>
</head>
<body>
<div class="page">

  <div class="header">
    <div>
      <div class="title">${escapeHtml(data.companyName || "Empresa")}</div>
      <div class="sub">Relatório gerado em ${escapeHtml(date)} · Karreify</div>
      <div class="tags">
        ${data.industry ? `<span class="tag">${escapeHtml(data.industry)}</span>` : ""}
        ${data.size ? `<span class="tag">${escapeHtml(data.size)}</span>` : ""}
        ${data.founded ? `<span class="tag">Fundada em ${escapeHtml(data.founded)}</span>` : ""}
        ${data.headquarters ? `<span class="tag">${escapeHtml(data.headquarters)}</span>` : ""}
      </div>
    </div>
    <div class="rating-badge">
      <div class="rating-value">${rating.toFixed(1)}</div>
      <div class="rating-stars">${starsSvg(rating)}</div>
      <div class="rating-label">funcionários</div>
    </div>
  </div>

  <h2>Visão Geral</h2>
  <div class="section">${para(data.overview)}</div>

  <div class="two-col">
    <div>
      <h2>História</h2>
      <div class="section">${para(data.history)}</div>
    </div>
    <div>
      <h2>Cultura Organizacional</h2>
      <div class="section">${para(data.culture)}</div>
    </div>
  </div>

  <h2>Avaliações de Funcionários</h2>
  <div class="two-col">
    <div>
      <p style="font-weight:600; color:#047857; margin-bottom:6px;">Pontos positivos</p>
      ${list(data.employeeReviews?.positive, "#10b981")}
    </div>
    <div>
      <p style="font-weight:600; color:#b45309; margin-bottom:6px;">Pontos de atenção</p>
      ${list(data.employeeReviews?.negative, "#f59e0b")}
    </div>
  </div>

  <h2>Remuneração — ${escapeHtml(data.salaryInfo?.position ?? "")}</h2>
  <div class="two-col">
    <div>
      <div class="salary-box">
        <div class="sub" style="margin-bottom:2px;">Salário médio estimado</div>
        <div class="salary-avg">${escapeHtml(data.salaryInfo?.average ?? "—")}</div>
        <div class="salary-range">Faixa: ${escapeHtml(data.salaryInfo?.range ?? "—")}</div>
      </div>
    </div>
    <div>
      <p style="font-weight:600; margin-bottom:6px; color:#0f172a;">Benefícios comuns</p>
      ${list(data.salaryInfo?.benefits, "#10b981")}
    </div>
  </div>

  <h2>Processo Seletivo</h2>
  <div class="section">${para(data.interviewProcess)}</div>

  <h2>Dicas para a Entrevista</h2>
  <ul class="interview-tips">
    ${(data.interviewTips ?? []).map((t) => `<li>${escapeHtml(t)}</li>`).join("")}
  </ul>

  ${
    hasContact || otherLocations.length > 0
      ? `<div class="two-col">
    ${
      hasContact
        ? `<div>
      <h2>Contato</h2>
      <ul class="contact-list">
        ${data.website ? `<li><span class="label">Site:</span> ${escapeHtml(data.website)}</li>` : ""}
        ${data.phone ? `<li><span class="label">Telefone:</span> ${escapeHtml(data.phone)}</li>` : ""}
        ${data.email ? `<li><span class="label">E-mail:</span> ${escapeHtml(data.email)}</li>` : ""}
        ${data.linkedin ? `<li><span class="label">LinkedIn:</span> ${escapeHtml(data.linkedin)}</li>` : ""}
      </ul>
    </div>`
        : ""
    }
    ${
      otherLocations.length > 0
        ? `<div>
      <h2>Outras Localidades</h2>
      ${list(otherLocations, "#4f46e5")}
    </div>`
        : ""
    }
  </div>`
      : ""
  }

  <div class="footer">
    Dados gerados por IA com base em fontes públicas. Verifique informações atuais em Glassdoor, LinkedIn e no site oficial.
  </div>

</div>
</body>
</html>`;
}

function findLocalChrome(): string {
  const paths = [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    process.env.LOCALAPPDATA + "\\Google\\Chrome\\Application\\chrome.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium-browser",
    "/usr/bin/chromium",
  ];
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const fs = require("fs");
  for (const p of paths) {
    if (p && fs.existsSync(p)) return p;
  }
  throw new Error("Chrome não encontrado localmente.");
}

async function renderPdf(html: string): Promise<Buffer> {
  let browser = null;
  try {
    const puppeteer = await import("puppeteer-core");
    let executablePath: string;
    let args: string[];
    if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
      const chromium = await import("@sparticuz/chromium");
      executablePath = await chromium.default.executablePath();
      args = chromium.default.args;
    } else {
      executablePath = findLocalChrome();
      args = ["--no-sandbox", "--disable-setuid-sandbox"];
    }
    browser = await puppeteer.default.launch({ args, executablePath, headless: "shell" as const });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdf = await page.pdf({ format: "A4", printBackground: true });
    await page.close();
    return Buffer.from(pdf);
  } finally {
    if (browser) await browser.close();
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data: CompanyAnalysisResult = body.data;
    if (!data?.companyName) {
      return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
    }
    const date = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
    const html = buildHtml(data, date);
    const pdf = await renderPdf(html);

    const safeName = (data.companyName || "empresa")
      .normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-zA-Z0-9\s]/g, "").trim().replace(/\s+/g, "-");

    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="analise-empresa-${safeName}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Erro desconhecido";
    console.error("Company analysis PDF error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
