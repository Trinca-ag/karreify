import { NextRequest, NextResponse } from "next/server";
import { TEMPLATES, type TemplateName } from "@/lib/resume-templates";
import type { ResumeSchema } from "@/lib/resume-schema";

function sanitizeFilename(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export const maxDuration = 60;

async function generatePdfBuffer(html: string): Promise<Buffer> {
  let browser = null;
  try {
    // Dynamic imports — only loaded server-side
    const puppeteer = await import("puppeteer-core");

    let executablePath: string;
    let args: string[];

    if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
      // Production (Vercel / Lambda)
      const chromium = await import("@sparticuz/chromium");
      executablePath = await chromium.default.executablePath();
      args = chromium.default.args;
    } else {
      // Local development — use system Chrome
      executablePath = findLocalChrome();
      args = ["--no-sandbox", "--disable-setuid-sandbox"];
    }

    browser = await puppeteer.default.launch({
      args,
      executablePath,
      headless: "shell" as const,
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
    });

    await page.close();
    return Buffer.from(pdfBuffer);
  } finally {
    if (browser) await browser.close();
  }
}

function findLocalChrome(): string {
  const paths = [
    // Windows
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    process.env.LOCALAPPDATA + "\\Google\\Chrome\\Application\\chrome.exe",
    // macOS
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    // Linux
    "/usr/bin/google-chrome",
    "/usr/bin/chromium-browser",
    "/usr/bin/chromium",
  ];

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const fs = require("fs");
  for (const p of paths) {
    if (p && fs.existsSync(p)) return p;
  }

  throw new Error(
    "Chrome não encontrado localmente. Instale o Google Chrome ou defina CHROME_PATH no .env.local"
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const resumeData: ResumeSchema = body.resumeData;
    const template: TemplateName = body.template || "profissional";

    if (!resumeData || !resumeData.basics?.name) {
      return NextResponse.json({ error: "Dados do currículo inválidos" }, { status: 400 });
    }

    const templateFn = TEMPLATES[template];
    if (!templateFn) {
      return NextResponse.json({ error: "Template não encontrado" }, { status: 400 });
    }

    // 1. JSON → HTML
    const html = templateFn.render(resumeData);

    // 2. HTML → PDF (Puppeteer)
    const pdfBuffer = await generatePdfBuffer(html);

    // 3. Return PDF
    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${sanitizeFilename(resumeData.basics.name)}-Curriculo.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido";
    console.error("PDF generation error:", message);
    return NextResponse.json({ error: `Erro ao gerar PDF: ${message}` }, { status: 500 });
  }
}
