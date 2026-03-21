import { NextRequest, NextResponse } from "next/server";
import type { CoverLetterResult } from "@/services/ai-cover-letter";

export const maxDuration = 60;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildHtml(data: CoverLetterResult, date: string): string {
  const paragraphs = data.coverLetter
    .split(/\n{2,}/)
    .map(p => p.trim())
    .filter(Boolean)
    .map(p => `<p>${escapeHtml(p).replace(/\n/g, "<br>")}</p>`)
    .join("\n");

  const hasContact = data.candidateEmail || data.candidatePhone;

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Georgia', 'Times New Roman', serif;
    background: #fff;
    color: #1a1a1a;
    font-size: 11.5px;
    line-height: 1.7;
  }

  .page {
    width: 210mm;
    min-height: 297mm;
    padding: 18mm 20mm 16mm;
    position: relative;
  }

  /* Header */
  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding-bottom: 14px;
    border-bottom: 2px solid #4f46e5;
    margin-bottom: 20px;
  }
  .candidate-name {
    font-size: 20px;
    font-weight: 700;
    font-family: 'Helvetica Neue', Arial, sans-serif;
    color: #1e1b4b;
    letter-spacing: -0.3px;
  }
  .contact-info {
    text-align: right;
    font-size: 10px;
    color: #475569;
    font-family: 'Helvetica Neue', Arial, sans-serif;
    line-height: 1.6;
  }
  .contact-info a { color: #4f46e5; text-decoration: none; }

  /* Meta */
  .meta {
    margin-bottom: 22px;
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 10.5px;
    color: #475569;
  }
  .meta-date { margin-bottom: 14px; }
  .meta-to { line-height: 1.5; }
  .meta-to strong { color: #1e293b; font-size: 11px; }

  /* Subject */
  .subject {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 11.5px;
    font-weight: 700;
    color: #1e1b4b;
    margin-bottom: 20px;
    padding: 8px 12px;
    background: #eef2ff;
    border-left: 3px solid #4f46e5;
    border-radius: 0 4px 4px 0;
  }

  /* Salutation */
  .salutation {
    font-size: 11.5px;
    margin-bottom: 14px;
    color: #1a1a1a;
  }

  /* Body */
  .body p {
    margin-bottom: 13px;
    text-align: justify;
    hyphens: auto;
  }
  .body p:last-child { margin-bottom: 0; }

  /* Sign-off */
  .signoff {
    margin-top: 28px;
    font-size: 11.5px;
    line-height: 1.8;
  }
  .signoff-phrase { margin-bottom: 32px; }
  .signoff-name {
    font-weight: 700;
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 12px;
    color: #1e1b4b;
  }

</style>
</head>
<body>
<div class="page">

  <div class="header">
    <div class="candidate-name">${escapeHtml(data.candidateName || "Candidato")}</div>
    ${hasContact ? `
    <div class="contact-info">
      ${data.candidateEmail ? `${escapeHtml(data.candidateEmail)}<br>` : ""}
      ${data.candidatePhone ? escapeHtml(data.candidatePhone) : ""}
    </div>` : ""}
  </div>

  <div class="meta">
    <div class="meta-date">${escapeHtml(date)}</div>
    <div class="meta-to">
      <strong>${escapeHtml(data.companyName)}</strong><br>
      ${data.jobTitle ? `Ref.: ${escapeHtml(data.jobTitle)}` : ""}
    </div>
  </div>

  ${data.subject ? `<div class="subject">Assunto: ${escapeHtml(data.subject)}</div>` : ""}

  <div class="salutation">Prezados(as),</div>

  <div class="body">
    ${paragraphs}
  </div>

  <div class="signoff">
    <div class="signoff-phrase">Atenciosamente,</div>
    <div class="signoff-name">${escapeHtml(data.candidateName || "")}</div>
    ${data.candidateEmail ? `<div style="font-size:10px;color:#475569;font-family:sans-serif">${escapeHtml(data.candidateEmail)}</div>` : ""}
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
    const data: CoverLetterResult = body.data;
    if (!data?.coverLetter) {
      return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
    }
    const date = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
    const html = buildHtml(data, date);
    const pdf = await renderPdf(html);

    const safeName = (data.candidateName || "carta")
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9\s]/g, "").trim().replace(/\s+/g, "-");

    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="carta-apresentacao-${safeName}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Erro desconhecido";
    console.error("Cover letter PDF error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
