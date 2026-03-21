import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 30;

// ── HTML helpers ──────────────────────────────────────────────────────────────

function getMeta(html: string, prop: string): string {
  const regexes = [
    new RegExp(`<meta[^>]+(?:property|name)=["']${prop}["'][^>]+content=["']([^"']{1,1000})["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']{1,1000})["'][^>]+(?:property|name)=["']${prop}["']`, "i"),
  ];
  for (const re of regexes) {
    const m = html.match(re);
    if (m?.[1]) return m[1].trim();
  }
  return "";
}

function getTitle(html: string): string {
  const m = html.match(/<title>([^<]+)<\/title>/i);
  return m?.[1]?.replace(/\s*\|\s*LinkedIn\s*/gi, "").trim() ?? "";
}

function getJsonLd(html: string): Record<string, unknown> | null {
  const matches = Array.from(html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi));
  for (const m of matches) {
    try {
      const obj = JSON.parse(m[1]);
      if (obj["@type"] === "Person" || obj.name) return obj;
    } catch { /* skip */ }
  }
  return null;
}

/** Strip all HTML tags and collapse whitespace */
function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ")
    .replace(/\s{3,}/g, "\n")
    .trim();
}

// ── Profile text builder ──────────────────────────────────────────────────────

interface RawProfile {
  url: string;
  ogTitle: string;
  ogDesc: string;
  title: string;
  jsonLd: Record<string, unknown> | null;
  bodyText?: string;
}

function buildProfileText(p: RawProfile): string {
  const lines: string[] = [`URL do perfil: ${p.url}`];

  // Name + headline from og:title ("Name - Headline" or "Name | Title at Company")
  const displayTitle = p.ogTitle || p.title;
  if (displayTitle) {
    const sep = displayTitle.includes(" - ") ? " - " : " | ";
    const parts = displayTitle.split(sep);
    lines.push(`Nome: ${parts[0].trim()}`);
    if (parts.length > 1) lines.push(`Headline: ${parts.slice(1).join(sep).trim()}`);
  }

  if (p.ogDesc) lines.push(`\nSobre (extrato público):\n${p.ogDesc}`);

  if (p.jsonLd) {
    const j = p.jsonLd as Record<string, unknown>;
    if (j.jobTitle)       lines.push(`Cargo: ${j.jobTitle}`);
    if (j.description && j.description !== p.ogDesc)
                          lines.push(`Descrição: ${j.description}`);
    if (j.address && typeof j.address === "object") {
      const a = j.address as Record<string, unknown>;
      if (a.addressLocality) lines.push(`Localização: ${a.addressLocality}${a.addressRegion ? `, ${a.addressRegion}` : ""}`);
    }
    if (j.worksFor && typeof j.worksFor === "object") {
      const w = j.worksFor as Record<string, unknown>;
      if (w.name) lines.push(`Empresa atual: ${w.name}`);
    }
    if (Array.isArray(j.alumniOf)) {
      const schools = (j.alumniOf as Record<string, unknown>[])
        .map(a => a.name).filter(Boolean).join(", ");
      if (schools) lines.push(`Formação: ${schools}`);
    }
    if (Array.isArray(j.knowsAbout)) {
      lines.push(`Áreas de conhecimento: ${(j.knowsAbout as string[]).join(", ")}`);
    }
    if (Array.isArray(j.hasCredential)) {
      const creds = (j.hasCredential as Record<string, unknown>[])
        .map(c => c.name).filter(Boolean).join(", ");
      if (creds) lines.push(`Credenciais: ${creds}`);
    }
  }

  // Supplement with body text sections if we have them
  if (p.bodyText) {
    const lower = p.bodyText.toLowerCase();
    const hasExperience = lower.includes("experience") || lower.includes("experiência");
    const hasEducation  = lower.includes("education")  || lower.includes("educação") || lower.includes("formação");
    const hasSkills     = lower.includes("skills")     || lower.includes("habilidades") || lower.includes("competências");

    if (hasExperience || hasEducation || hasSkills) {
      lines.push("\n--- Dados extraídos da página ---");
      // Limit body text to avoid token explosion
      lines.push(p.bodyText.slice(0, 3000));
    }
  }

  return lines.filter(Boolean).join("\n");
}

// ── Strategy 1: Simple fetch (Googlebot / browser UA) ────────────────────────

async function fetchWithHttp(url: string, ua: string): Promise<{ html: string; ok: boolean }> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": ua,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
        "Accept-Encoding": "gzip, deflate, br",
        "Cache-Control": "no-cache",
        "Upgrade-Insecure-Requests": "1",
      },
      signal: AbortSignal.timeout(8000),
      redirect: "follow",
    });
    if (!res.ok) return { html: "", ok: false };
    const html = await res.text();
    return { html, ok: true };
  } catch {
    return { html: "", ok: false };
  }
}

// ── Strategy 2: Puppeteer stealth ────────────────────────────────────────────

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

async function fetchWithPuppeteer(url: string): Promise<{ html: string; ok: boolean }> {
  let browser = null;
  try {
    const puppeteer = await import("puppeteer-core");

    let executablePath: string;
    let baseArgs: string[];

    if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
      const chromium = await import("@sparticuz/chromium");
      executablePath = await chromium.default.executablePath();
      baseArgs = chromium.default.args;
    } else {
      executablePath = findLocalChrome();
      baseArgs = ["--no-sandbox", "--disable-setuid-sandbox"];
    }

    browser = await puppeteer.default.launch({
      executablePath,
      headless: "shell" as const,
      args: [
        ...baseArgs,
        "--disable-blink-features=AutomationControlled",
        "--disable-dev-shm-usage",
        "--window-size=1366,768",
        "--disable-infobars",
        "--disable-notifications",
      ],
    });

    const page = await browser.newPage();

    // Stealth: mask automation signals
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, "webdriver", { get: () => undefined });
      // @ts-expect-error patching prototype
      delete navigator.__proto__.webdriver;
      // @ts-expect-error injecting chrome object
      window.chrome = { runtime: {}, loadTimes: () => {}, csi: () => {}, app: {} };
      Object.defineProperty(navigator, "plugins", { get: () => [1, 2, 3, 4, 5] });
      Object.defineProperty(navigator, "languages", { get: () => ["pt-BR", "pt", "en-US", "en"] });
    });

    await page.setViewport({ width: 1366, height: 768 });
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
    );
    await page.setExtraHTTPHeaders({
      "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8",
      "sec-ch-ua": '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
    });

    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 });

    // Wait a moment for dynamic content
    await new Promise(r => setTimeout(r, 2000));

    // Try to dismiss any login modals / overlays
    await page.evaluate(() => {
      const overlays = document.querySelectorAll(
        ".modal__overlay, .artdeco-modal-overlay, [data-test-modal-overlay]"
      );
      overlays.forEach(el => (el as HTMLElement).remove());
    });

    const html = await page.content();
    await page.close();

    return { html, ok: html.length > 5000 };
  } catch (err) {
    console.error("[Puppeteer] error:", err);
    return { html: "", ok: false };
  } finally {
    if (browser) await browser.close();
  }
}

// ── Evaluate HTML quality ─────────────────────────────────────────────────────

function evaluateHtml(html: string): { hasRichData: boolean; blocked: boolean } {
  if (!html || html.length < 1000) return { hasRichData: false, blocked: true };

  const isAuthwall =
    html.includes("authwall") ||
    (html.includes("session_redirect") && !html.includes("og:title")) ||
    html.includes("join/") && html.length < 15000;

  const hasProfile =
    html.includes("og:title") ||
    html.includes('"@type":"Person"') ||
    html.includes("application/ld+json");

  return { hasRichData: hasProfile, blocked: isAuthwall };
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL obrigatória" }, { status: 400 });
    }

    const cleanUrl = url.trim().replace(/\/$/, "");
    if (!/^https?:\/\/(www\.)?linkedin\.com\/in\/[\w%.-]+$/i.test(cleanUrl)) {
      return NextResponse.json(
        { error: "URL inválida. Use o formato: linkedin.com/in/seu-usuario" },
        { status: 400 }
      );
    }

    let html = "";
    let fetchedOk = false;

    // Strategy 1a: Googlebot UA (LinkedIn serves full public content to crawlers)
    const googlebot = await fetchWithHttp(
      cleanUrl,
      "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
    );
    const ev1 = evaluateHtml(googlebot.html);
    if (googlebot.ok && ev1.hasRichData && !ev1.blocked) {
      html = googlebot.html;
      fetchedOk = true;
    }

    // Strategy 1b: Real browser UA fetch (sometimes works when Googlebot doesn't)
    if (!fetchedOk) {
      const browser = await fetchWithHttp(
        cleanUrl,
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
      );
      const ev1b = evaluateHtml(browser.html);
      if (browser.ok && ev1b.hasRichData && !ev1b.blocked) {
        html = browser.html;
        fetchedOk = true;
      }
    }

    // Strategy 2: Headless Puppeteer with stealth (most powerful, slower)
    if (!fetchedOk) {
      const puppet = await fetchWithPuppeteer(cleanUrl);
      const ev2 = evaluateHtml(puppet.html);
      if (puppet.ok && !ev2.blocked) {
        html = puppet.html;
        fetchedOk = true;
      } else if (puppet.html.length > 3000) {
        // partial data is still useful
        html = puppet.html;
        fetchedOk = true;
      }
    }

    // Build profile text from whatever we collected
    const ogTitle  = getMeta(html, "og:title");
    const ogDesc   = getMeta(html, "og:description");
    const title    = getTitle(html);
    const jsonLd   = getJsonLd(html);
    const bodyText = html ? stripHtml(html) : "";

    const ev = evaluateHtml(html);
    const hasRichData = fetchedOk && ev.hasRichData;

    const profileText = buildProfileText({
      url: cleanUrl,
      ogTitle,
      ogDesc,
      title,
      jsonLd,
      bodyText: hasRichData ? bodyText : undefined,
    });

    return NextResponse.json({ success: true, profileText, hasRichData });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Erro desconhecido";
    console.error("[fetch-linkedin] error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
