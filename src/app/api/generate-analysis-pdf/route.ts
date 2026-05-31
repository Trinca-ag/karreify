import { NextRequest, NextResponse } from "next/server";
import { requireUser, authErrorResponse } from "@/lib/auth-server";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";

export const maxDuration = 60;

interface AnalysisData {
  overallScore: number;
  structure: { score: number };
  content: { score: number };
  language: { score: number };
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

function scoreColor(score: number): string {
  if (score >= 80) return "#22c55e";
  if (score >= 60) return "#f59e0b";
  return "#ef4444";
}

function scoreMessage(score: number): string {
  if (score >= 80) return "Excelente currículo!";
  if (score >= 60) return "Bom currículo, mas pode melhorar.";
  return "Seu currículo precisa de melhorias.";
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function buildHtml(data: AnalysisData, date: string): string {
  const { overallScore, structure, content, language, strengths, weaknesses, suggestions } = data;
  const mainColor = scoreColor(overallScore);

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    background: #ffffff;
    color: #1e293b;
    font-size: 11px;
    line-height: 1.55;
  }

  /* ── Header ── */
  .header {
    background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
    padding: 30px 44px 28px;
    color: white;
    position: relative;
    overflow: hidden;
  }
  .header::after {
    content: '';
    position: absolute;
    right: -40px;
    top: -40px;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: rgba(255,255,255,0.06);
  }
  .header-brand {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    opacity: 0.7;
    margin-bottom: 10px;
  }
  .header-title {
    font-size: 26px;
    font-weight: 800;
    letter-spacing: -0.5px;
    margin-bottom: 5px;
  }
  .header-date {
    font-size: 11px;
    opacity: 0.65;
  }

  /* ── Scores ── */
  .scores-wrap {
    background: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
    padding: 26px 44px;
  }
  .scores-inner {
    display: flex;
    align-items: center;
    gap: 36px;
  }
  .main-score-box {
    text-align: center;
    min-width: 110px;
  }
  .main-score-number {
    font-size: 60px;
    font-weight: 900;
    line-height: 1;
    color: ${mainColor};
  }
  .main-score-denom {
    font-size: 20px;
    font-weight: 400;
    color: #94a3b8;
  }
  .main-score-label {
    font-size: 10px;
    font-weight: 700;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    margin-top: 5px;
  }
  .main-score-msg {
    font-size: 10px;
    color: ${mainColor};
    font-weight: 600;
    margin-top: 4px;
  }
  .scores-divider {
    width: 1px;
    height: 90px;
    background: #e2e8f0;
    flex-shrink: 0;
  }
  .sub-scores {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .sub-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .sub-label {
    width: 72px;
    font-size: 11px;
    font-weight: 600;
    color: #475569;
  }
  .bar-track {
    flex: 1;
    height: 9px;
    background: #e2e8f0;
    border-radius: 99px;
    overflow: hidden;
  }
  .bar-fill {
    height: 100%;
    border-radius: 99px;
  }
  .sub-value {
    width: 32px;
    text-align: right;
    font-size: 12px;
    font-weight: 800;
  }

  /* ── Content ── */
  .content {
    padding: 28px 44px;
    display: flex;
    flex-direction: column;
    gap: 22px;
  }

  /* ── Section ── */
  .section { page-break-inside: avoid; }
  .section-head {
    display: flex;
    align-items: center;
    gap: 10px;
    padding-bottom: 9px;
    margin-bottom: 12px;
    border-bottom: 2px solid;
  }
  .section-badge {
    width: 26px;
    height: 26px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 900;
    flex-shrink: 0;
  }
  .section-title {
    font-size: 13px;
    font-weight: 800;
    letter-spacing: -0.2px;
  }
  .section-count {
    margin-left: auto;
    font-size: 10px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 99px;
  }
  .items-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 7px;
  }
  .item {
    display: flex;
    gap: 9px;
    font-size: 11px;
    color: #374151;
    line-height: 1.5;
    padding: 7px 10px;
    border-radius: 7px;
  }
  .item-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    margin-top: 4px;
    flex-shrink: 0;
  }

  /* strengths */
  .sec-str .section-head { border-color: #22c55e; }
  .sec-str .section-badge { background: #f0fdf4; color: #16a34a; }
  .sec-str .section-title { color: #166534; }
  .sec-str .section-count { background: #f0fdf4; color: #16a34a; }
  .sec-str .item { background: #f0fdf4; }
  .sec-str .item-dot { background: #22c55e; }

  /* weaknesses */
  .sec-wk .section-head { border-color: #f97316; }
  .sec-wk .section-badge { background: #fff7ed; color: #ea580c; }
  .sec-wk .section-title { color: #9a3412; }
  .sec-wk .section-count { background: #fff7ed; color: #ea580c; }
  .sec-wk .item { background: #fff7ed; }
  .sec-wk .item-dot { background: #f97316; }

  /* suggestions */
  .sec-sg .section-head { border-color: #6366f1; }
  .sec-sg .section-badge { background: #eef2ff; color: #4f46e5; }
  .sec-sg .section-title { color: #3730a3; }
  .sec-sg .section-count { background: #eef2ff; color: #4f46e5; }
  .sec-sg .item { background: #eef2ff; }
  .sec-sg .item-dot { background: #6366f1; }

  /* ── Footer ── */
  .footer {
    background: #f8fafc;
    border-top: 1px solid #e2e8f0;
    padding: 14px 44px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .footer-brand { font-size: 11px; font-weight: 800; color: #6366f1; letter-spacing: 1px; }
  .footer-note { font-size: 10px; color: #94a3b8; }
</style>
</head>
<body>

<div class="header">
  <div class="header-brand">Karreify</div>
  <div class="header-title">Análise de Currículo</div>
  <div class="header-date">Gerado em ${escapeHtml(date)}</div>
</div>

<div class="scores-wrap">
  <div class="scores-inner">
    <div class="main-score-box">
      <div class="main-score-number">${overallScore}<span class="main-score-denom">/100</span></div>
      <div class="main-score-label">Pontuação Geral</div>
      <div class="main-score-msg">${scoreMessage(overallScore)}</div>
    </div>
    <div class="scores-divider"></div>
    <div class="sub-scores">
      <div class="sub-row">
        <span class="sub-label">Estrutura</span>
        <div class="bar-track"><div class="bar-fill" style="width:${structure.score}%;background:${scoreColor(structure.score)}"></div></div>
        <span class="sub-value" style="color:${scoreColor(structure.score)}">${structure.score}</span>
      </div>
      <div class="sub-row">
        <span class="sub-label">Conteúdo</span>
        <div class="bar-track"><div class="bar-fill" style="width:${content.score}%;background:${scoreColor(content.score)}"></div></div>
        <span class="sub-value" style="color:${scoreColor(content.score)}">${content.score}</span>
      </div>
      <div class="sub-row">
        <span class="sub-label">Linguagem</span>
        <div class="bar-track"><div class="bar-fill" style="width:${language.score}%;background:${scoreColor(language.score)}"></div></div>
        <span class="sub-value" style="color:${scoreColor(language.score)}">${language.score}</span>
      </div>
    </div>
  </div>
</div>

<div class="content">

  <div class="section sec-str">
    <div class="section-head">
      <div class="section-badge">✓</div>
      <span class="section-title">Pontos Fortes</span>
      <span class="section-count">${strengths.length} itens</span>
    </div>
    <ul class="items-list">
      ${strengths.map(s => `<li class="item"><div class="item-dot"></div><span>${escapeHtml(s)}</span></li>`).join("\n      ")}
    </ul>
  </div>

  <div class="section sec-wk">
    <div class="section-head">
      <div class="section-badge">!</div>
      <span class="section-title">Pontos Fracos</span>
      <span class="section-count">${weaknesses.length} itens</span>
    </div>
    <ul class="items-list">
      ${weaknesses.map(s => `<li class="item"><div class="item-dot"></div><span>${escapeHtml(s)}</span></li>`).join("\n      ")}
    </ul>
  </div>

  <div class="section sec-sg">
    <div class="section-head">
      <div class="section-badge">→</div>
      <span class="section-title">Sugestões de Melhoria</span>
      <span class="section-count">${suggestions.length} itens</span>
    </div>
    <ul class="items-list">
      ${suggestions.map(s => `<li class="item"><div class="item-dot"></div><span>${escapeHtml(s)}</span></li>`).join("\n      ")}
    </ul>
  </div>

</div>

<div class="footer">
  <span class="footer-brand">KARREIFY</span>
  <span class="footer-note">Análise gerada por Inteligência Artificial · karreify.com</span>
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
  let ctx;
  try {
    ctx = await requireUser(request);
  } catch (e) {
    return authErrorResponse(e);
  }

  // Sem preview ao vivo — só dispara no download/save. 10/min cobre múltiplas
  // tentativas e o background save sem abrir DoS.
  const rl = rateLimit(ctx.uid, { scope: "pdf-analysis", limit: 10, windowMs: 60_000 });
  if (!rl.allowed) return rateLimitResponse(rl);

  try {
    const body = await request.json();
    const analysis: AnalysisData = body.analysis;
    if (!analysis) return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });

    const date = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
    const html = buildHtml(analysis, date);
    const pdf = await renderPdf(html);

    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="analise-curriculo-karreify.pdf"',
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido";
    console.error("Analysis PDF error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
