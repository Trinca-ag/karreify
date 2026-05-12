import { NextRequest, NextResponse } from "next/server";
import { TEMPLATES, type TemplateName, getModernoPdfMargins, MODERNO_ACCENT } from "@/lib/resume-templates";
import type { ResumeSchema } from "@/lib/resume-schema";
import { PDFDocument } from "pdf-lib";

function sanitizeFilename(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export const maxDuration = 60;

async function generatePdfBuffer(
  html: string,
  skipAutoLayout = false,
  extraPdfOptions: Record<string, unknown> = {}
): Promise<Buffer> {
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

    // Capture inline script logs for debugging
    page.on("console", (msg) => console.log("[PDF-Script]", msg.text()));
    page.on("pageerror", (err) => console.error("[PDF-Error]", String(err)));

    await page.setContent(html, { waitUntil: "networkidle0" });

    // Auto-layout: compress or expand content to fit exactly 1 A4 page
    // When user has manual adjustments, skip auto-layout — respect their choices
    if (skipAutoLayout) {
      // Remove min-height so small content doesn't get artificially stretched
      await page.evaluate(() => {
        const pg = document.querySelector(".page") as HTMLElement;
        if (pg) pg.style.minHeight = "0";
      });
    }

    if (!skipAutoLayout) await page.evaluate(() => {
      const pg = document.querySelector(".page") as HTMLElement;
      if (!pg) return;

      // Measure A4 height in pixels (DPI-independent)
      const ruler = document.createElement("div");
      ruler.style.cssText = "height:297mm;position:absolute;visibility:hidden";
      document.body.appendChild(ruler);
      const A4 = ruler.offsetHeight;
      document.body.removeChild(ruler);

      // Natural height without min-height constraint
      function naturalH(): number {
        const prev = pg.style.minHeight;
        pg.style.minHeight = "0";
        const h = pg.offsetHeight;
        pg.style.minHeight = prev;
        return h;
      }

      // Snapshot original margins for gap-bearing elements
      const gapSel =
        ".section, .entry, .header, .header-divider, .section-title, .bullets, .bullets li";
      const gaps: { el: HTMLElement; mt: number; mb: number }[] = [];
      pg.querySelectorAll(gapSel).forEach((el) => {
        const s = getComputedStyle(el);
        const mt = parseFloat(s.marginTop) || 0;
        const mb = parseFloat(s.marginBottom) || 0;
        if (mt > 0 || mb > 0) gaps.push({ el: el as HTMLElement, mt, mb });
      });

      function scaleGaps(factor: number) {
        for (const g of gaps) {
          if (g.mt > 0) g.el.style.marginTop = g.mt * factor + "px";
          if (g.mb > 0) g.el.style.marginBottom = g.mb * factor + "px";
        }
      }

      function scaleFonts(ratio: number) {
        pg.querySelectorAll("*").forEach((el) => {
          const fz = parseFloat(getComputedStyle(el).fontSize);
          if (fz) (el as HTMLElement).style.fontSize = fz * ratio + "px";
        });
      }

      let h = naturalH();
      const wasOverflow = h > A4;
      console.log("[Layout] initial h=" + h + " A4=" + A4 + " diff=" + (h - A4));

      /* ── OVERFLOW: compress to fit 1 page ── */
      if (wasOverflow) {
        // Phase 1: Progressive gap reduction
        for (const f of [0.6, 0.4, 0.2, 0]) {
          scaleGaps(f);
          h = naturalH();
          if (h <= A4) {
            console.log("[Layout] fit with gap factor " + f);
            break;
          }
        }

        // Phase 2: Scale font sizes (floor 0.75x)
        if (h > A4) {
          const ratio = Math.max(A4 / h, 0.75);
          scaleFonts(ratio);
          h = naturalH();
          console.log("[Layout] font scale " + ratio.toFixed(3) + " -> h=" + h);
        }

        // Phase 3: Reduce page padding
        if (h > A4) {
          const cs = getComputedStyle(pg);
          const pT = parseFloat(cs.paddingTop);
          const pB = parseFloat(cs.paddingBottom);
          const excess = h - A4;
          pg.style.paddingTop = Math.max(pT - excess * 0.4, pT * 0.5) + "px";
          pg.style.paddingBottom = Math.max(pB - excess * 0.6, pB * 0.5) + "px";
          h = naturalH();
          console.log("[Layout] padding reduced -> h=" + h);
        }

        // Phase 4: Aggressive font scale (no floor)
        if (h > A4) {
          scaleFonts(A4 / h);
          h = naturalH();
          console.log("[Layout] aggressive font -> h=" + h);
        }

        // Safety net: force single page by clipping
        if (naturalH() > A4) {
          pg.style.maxHeight = A4 + "px";
          pg.style.overflow = "hidden";
          console.warn("[Layout] WARN: forced clip to prevent 2nd page");
        }
      }

      /* ── UNDERFILL: distribute extra space with max-gap limits ── */
      if (!wasOverflow) {
        h = naturalH();
        if (h > 0 && h < A4 * 0.97) {
          const spare = A4 - h;
          const MAX_PRIMARY_GAP = 32;
          const MAX_SECONDARY_GAP = 16;

          const hdr = pg.querySelector(".header") as HTMLElement;
          const secs = Array.from(pg.querySelectorAll(".section")) as HTMLElement[];

          // Primary: header + sections (except last)
          const pri: HTMLElement[] = [];
          if (hdr) pri.push(hdr);
          for (let i = 0; i < secs.length - 1; i++) pri.push(secs[i]);

          // Secondary: entries within sections (except last entry each)
          const sec2: HTMLElement[] = [];
          for (const sec of secs) {
            const ents = Array.from(sec.querySelectorAll(".entry")) as HTMLElement[];
            for (let i = 0; i < ents.length - 1; i++) sec2.push(ents[i]);
          }

          // Phase 1: Distribute gaps with caps
          let gapUsed = 0;
          const priShare = sec2.length > 0 ? spare * 0.7 : spare;
          const secShare = sec2.length > 0 ? spare * 0.3 : 0;

          if (pri.length > 0) {
            const each = Math.min(priShare / pri.length, MAX_PRIMARY_GAP);
            for (const el of pri) {
              const mb = parseFloat(getComputedStyle(el).marginBottom) || 0;
              el.style.marginBottom = mb + each + "px";
              gapUsed += each;
            }
          }
          if (sec2.length > 0) {
            const each = Math.min(secShare / sec2.length, MAX_SECONDARY_GAP);
            for (const el of sec2) {
              const mb = parseFloat(getComputedStyle(el).marginBottom) || 0;
              el.style.marginBottom = mb + each + "px";
              gapUsed += each;
            }
          }

          console.log("[Layout] underfill: gaps used " + gapUsed.toFixed(0) + "px of " + spare.toFixed(0) + "px");

          // Phase 2: Complementary fill strategies for remaining space
          const remaining = A4 - naturalH();
          if (remaining > 10) {
            // 2a. Increase summary line-height (up to 1.85)
            const summary = pg.querySelector(".summary") as HTMLElement;
            if (summary) {
              const curLh = parseFloat(getComputedStyle(summary).lineHeight) || 0;
              const curFs = parseFloat(getComputedStyle(summary).fontSize) || 14;
              const maxLh = curFs * 1.85;
              if (curLh < maxLh) {
                summary.style.lineHeight = "1.85";
              }
            }

            // 2b. Increase header bottom padding
            if (hdr) {
              const extraPad = Math.min(remaining * 0.15, 20);
              const curPb = parseFloat(getComputedStyle(hdr).paddingBottom) || 0;
              hdr.style.paddingBottom = (curPb + extraPad) + "px";
            }

            // 2c. Increase first section margin-top
            if (secs.length > 0) {
              const extraMt = Math.min(remaining * 0.1, 16);
              const curMt = parseFloat(getComputedStyle(secs[0]).marginTop) || 0;
              secs[0].style.marginTop = (curMt + extraMt) + "px";
            }

            // 2d. Increase bullet line-height (up to 1.7)
            const bullets = Array.from(pg.querySelectorAll(".bullets li")) as HTMLElement[];
            for (const li of bullets) {
              const curBulletLh = parseFloat(getComputedStyle(li).lineHeight) || 0;
              const curBulletFs = parseFloat(getComputedStyle(li).fontSize) || 12;
              if (curBulletLh < curBulletFs * 1.7) {
                li.style.lineHeight = "1.7";
              }
            }

            const finalRemaining = A4 - naturalH();
            console.log("[Layout] underfill: after complementary fill, remaining ~" + finalRemaining.toFixed(0) + "px");
          }
        }
      }
    });

    // Verify page count
    const pageCount = await page.evaluate(() => {
      const pg = document.querySelector(".page") as HTMLElement;
      if (!pg) return 1;
      const ruler = document.createElement("div");
      ruler.style.cssText = "height:297mm;position:absolute;visibility:hidden";
      document.body.appendChild(ruler);
      const a4 = ruler.offsetHeight;
      document.body.removeChild(ruler);
      pg.style.minHeight = "0";
      const h = pg.offsetHeight;
      pg.style.minHeight = "";
      return Math.ceil(h / a4);
    });
    if (pageCount > 1) {
      console.warn("[PDF] Content still spans " + pageCount + " pages after layout adjustment");
    }

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      ...extraPdfOptions,
    });

    // Verify actual PDF page count using pdf-lib
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const actualPages = pdfDoc.getPageCount();
    if (actualPages > 1) {
      console.warn(`[PDF] Generated ${actualPages} pages (expected 1)`);
    }

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
    const candidateLevel: string | undefined = body.candidateLevel;
    const fontSizeOffset: number | undefined = body.fontSizeOffset;
    const spacingOffset: number | undefined = body.spacingOffset;
    const hiddenSections: string[] | undefined = body.hiddenSections;

    if (!resumeData || !resumeData.basics?.name) {
      return NextResponse.json({ error: "Dados do currículo inválidos" }, { status: 400 });
    }

    const templateFn = TEMPLATES[template];
    if (!templateFn) {
      return NextResponse.json({ error: "Template não encontrado" }, { status: 400 });
    }

    // 1. JSON → HTML
    const html = templateFn.render(resumeData, {
      candidateLevel,
      fontSizeOffset,
      spacingOffset,
      hiddenSections: hiddenSections as import("@/lib/resume-templates").SectionName[] | undefined,
    });

    // 2. HTML → PDF (Puppeteer)
    const hasManualAdjustments = !!(fontSizeOffset || spacingOffset || (hiddenSections && hiddenSections.length > 0));

    // Moderno with manual adjustments may overflow to multiple pages. Use puppeteer's
    // headerTemplate to draw the navy accent bar at the top of every page (CSS
    // `position: fixed` doesn't repeat reliably in Chromium's PDF print path), and
    // override page margins so every page has consistent top/bottom spacing.
    let extraPdfOptions: Record<string, unknown> = {};
    if (template === "moderno" && hasManualAdjustments) {
      const m = getModernoPdfMargins(resumeData, {
        candidateLevel,
        fontSizeOffset,
        spacingOffset,
        hiddenSections: hiddenSections as import("@/lib/resume-templates").SectionName[] | undefined,
      });
      // Chromium wraps the headerTemplate in a `<div id="header">` that has default
      // padding (~5px), which creates a visible gap between the bar and the paper edge.
      // The `<style>` block below resets all of Chromium's defaults so the bar sticks
      // flush to the top of every page.
      extraPdfOptions = {
        displayHeaderFooter: true,
        headerTemplate: `<style>*,*::before,*::after{margin:0!important;padding:0!important;border:0!important;box-sizing:border-box!important;}html,body{width:100%!important;height:100%!important;-webkit-print-color-adjust:exact;print-color-adjust:exact;}#header,#footer{width:100%!important;padding:0!important;margin:0!important;}</style><div style="width:100%;height:4pt;background:${MODERNO_ACCENT};margin:0;padding:0;-webkit-print-color-adjust:exact;print-color-adjust:exact;"></div>`,
        footerTemplate: `<style>*{margin:0!important;padding:0!important;}</style><div style="height:0;"></div>`,
        margin: m,
      };
    }

    const pdfBuffer = await generatePdfBuffer(html, hasManualAdjustments, extraPdfOptions);

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
