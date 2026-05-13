import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const ALLOWED_HOSTS = ["adzuna.com", "adzuna.com.br", "www.adzuna.com", "www.adzuna.com.br"];
const MAX_REDIRECTS = 8;
const TIMEOUT_MS = 5000;

function isAdzunaHost(hostname: string): boolean {
  return ALLOWED_HOSTS.some((h) => hostname === h || hostname.endsWith("." + h));
}

function isAllowedInput(url: string): boolean {
  try {
    return isAdzunaHost(new URL(url).hostname);
  } catch {
    return false;
  }
}

function extractAdzunaLandUrl(html: string): string | null {
  const patterns = [
    /href="(https?:\/\/[^"]*adzuna\.com(?:\.br)?\/land\/ad\/[^"]+)"/i,
    /href="(\/land\/ad\/[^"]+)"/i,
    /"(https?:\/\/[^"]*adzuna\.com(?:\.br)?\/land\/ad\/[^"]+)"/i,
  ];
  for (const p of patterns) {
    const m = html.match(p);
    if (m && m[1]) {
      const url = m[1].replace(/&amp;/g, "&").replace(/\\\//g, "/");
      if (url.startsWith("/")) return `https://www.adzuna.com.br${url}`;
      return url;
    }
  }
  return null;
}

function extractExternalUrl(html: string): string | null {
  const patterns = [
    /location\.replace\s*\(\s*["']([^"']+)["']\s*\)/i,
    /location\.href\s*=\s*["']([^"']+)["']/i,
    /window\.location(?:\.href)?\s*=\s*["']([^"']+)["']/i,
    /<meta[^>]+http-equiv\s*=\s*["']refresh["'][^>]*content\s*=\s*["'][^"';]*;\s*url\s*=\s*([^"';\s]+)/i,
    /"applyUrl"\s*:\s*"([^"]+)"/i,
    /"redirect_url"\s*:\s*"([^"]+)"/i,
    /<a[^>]+id="apply[^"]*"[^>]*\bhref="([^"]+)"/i,
    /<a[^>]+class="[^"]*apply[^"]*"[^>]*\bhref="([^"]+)"/i,
    /<a[^>]+href="(https?:\/\/[^"]+)"[^>]*>\s*(?:Apply|Aplicar|Candidatar(?:-se)?)/i,
  ];
  for (const p of patterns) {
    const m = html.match(p);
    if (m && m[1]) {
      try {
        const decoded = m[1].replace(/\\\//g, "/").replace(/&amp;/g, "&");
        const parsed = new URL(decoded);
        if (!isAdzunaHost(parsed.hostname)) return decoded;
      } catch {
        /* keep looking */
      }
    }
  }
  return null;
}

function getSetCookies(headers: Headers): string[] {
  const h = headers as Headers & { getSetCookie?: () => string[] };
  if (typeof h.getSetCookie === "function") return h.getSetCookie();
  const single = headers.get("set-cookie");
  return single ? [single] : [];
}

function mergeCookies(jar: Map<string, string>, setCookies: string[]): void {
  for (const sc of setCookies) {
    const eq = sc.indexOf("=");
    if (eq <= 0) continue;
    const name = sc.slice(0, eq).trim();
    const semi = sc.indexOf(";", eq);
    const value = (semi === -1 ? sc.slice(eq + 1) : sc.slice(eq + 1, semi)).trim();
    if (name) jar.set(name, value);
  }
}

async function followRedirects(startUrl: string, signal: AbortSignal): Promise<string | null> {
  let currentUrl = startUrl;
  let previousUrl = "";
  const cookies = new Map<string, string>();

  for (let i = 0; i < MAX_REDIRECTS; i++) {
    const cookieHeader = Array.from(cookies.entries())
      .map(([k, v]) => `${k}=${v}`)
      .join("; ");

    const headers: Record<string, string> = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8",
    };
    if (cookieHeader) headers["Cookie"] = cookieHeader;
    if (previousUrl) headers["Referer"] = previousUrl;

    const response = await fetch(currentUrl, {
      method: "GET",
      redirect: "manual",
      signal,
      cache: "no-store",
      headers,
    });

    mergeCookies(cookies, getSetCookies(response.headers));

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) return null;
      const next = new URL(location, currentUrl).toString();
      const parsed = new URL(next);
      if (!isAdzunaHost(parsed.hostname)) return next;
      previousUrl = currentUrl;
      currentUrl = next;
      continue;
    }

    if (response.ok) {
      const html = await response.text();
      const externalUrl = extractExternalUrl(html);
      if (externalUrl) return externalUrl;
      const landUrl = extractAdzunaLandUrl(html);
      if (landUrl && landUrl !== currentUrl) {
        previousUrl = currentUrl;
        currentUrl = landUrl;
        continue;
      }
      return null;
    }

    return null;
  }
  return null;
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  if (!url || !isAllowedInput(url)) {
    return NextResponse.json({ error: "URL inválida." }, { status: 400 });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const finalUrl = await followRedirects(url, controller.signal);
    clearTimeout(timer);
    return NextResponse.redirect(finalUrl || url, { status: 302 });
  } catch (err) {
    clearTimeout(timer);
    console.error("[jobs/redirect] error following", err);
    return NextResponse.redirect(url, { status: 302 });
  }
}
