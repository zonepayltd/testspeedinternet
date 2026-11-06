import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, isLocale } from "@/i18n/config";
import { identifyBot } from "@/lib/bots";

// Files crawlers fetch that we serve as-is, but still want to log bot visits to.
const CRAWL_FILES = /^\/(robots\.txt|sitemap\.xml|sitemaps\/[\w-]+\.xml|ads\.txt|feed\.xml)$/;

/** Logs a crawler hit in the background (never delays the response). */
function logBot(req: NextRequest, event: NextFetchEvent) {
  if (req.method !== "GET" && req.method !== "HEAD") return;
  if (req.headers.get("purpose") === "prefetch" || req.headers.get("next-router-prefetch")) return;
  const ua = req.headers.get("user-agent") || "";
  if (!identifyBot(ua)) return;
  const body = JSON.stringify({
    path: req.nextUrl.pathname,
    ua,
    ip: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "",
    country: req.headers.get("x-vercel-ip-country") || req.headers.get("cf-ipcountry") || "",
  });
  event.waitUntil(
    fetch(new URL("/api/bot-hit", req.nextUrl.origin), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      signal: AbortSignal.timeout(4000),
    }).catch(() => {}),
  );
}

// English lives at "/", other languages at "/fr", "/es", "/ar", "/ru".
// Internally every public page is served from app/[locale]/..., so unprefixed
// URLs are rewritten to /en/... and the active locale is passed in a header.
export function middleware(req: NextRequest, event: NextFetchEvent) {
  const { pathname } = req.nextUrl;
  logBot(req, event);
  if (CRAWL_FILES.test(pathname)) return NextResponse.next();

  const seg = pathname.split("/")[1];

  // "/en/..." is the same as "/..." — redirect so there's one URL per page.
  if (seg === DEFAULT_LOCALE) {
    const url = req.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url, 308);
  }

  const headers = new Headers(req.headers);
  if (isLocale(seg)) {
    headers.set("x-locale", seg);
    return NextResponse.next({ request: { headers } });
  }

  headers.set("x-locale", DEFAULT_LOCALE);
  const url = req.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url, { request: { headers } });
}

export const config = {
  // Pages (skip API, admin, Next internals, metadata files and anything with a file extension),
  // plus the crawler files above so bot visits to them are logged too.
  matcher: [
    "/((?!api|admin|_next|sitemap.xml|sitemaps|robots.txt|feed.xml|ads.txt|manifest.webmanifest|icon.svg|apple-icon|opengraph-image|.*\\..*).*)",
    "/robots.txt",
    "/sitemap.xml",
    "/sitemaps/:file*",
    "/ads.txt",
    "/feed.xml",
  ],
};
