import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, isLocale } from "@/i18n/config";

// English lives at "/", other languages at "/fr", "/es", "/ar", "/ru".
// Internally every public page is served from app/[locale]/..., so unprefixed
// URLs are rewritten to /en/... and the active locale is passed in a header.
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
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
  // Skip API, admin, Next internals, metadata files and anything with a file extension.
  matcher: [
    "/((?!api|admin|_next|sitemap.xml|robots.txt|feed.xml|ads.txt|manifest.webmanifest|icon.svg|apple-icon|opengraph-image|.*\\..*).*)",
  ],
};
