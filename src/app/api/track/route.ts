import { adminDb, adminConfigured } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";
import { parseUA } from "@/lib/ua";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function sourceFromReferrer(ref: string, selfHost: string): string {
  if (!ref) return "Direct";
  try {
    const h = new URL(ref).hostname.replace(/^www\./, "");
    if (selfHost && h.includes(selfHost.replace(/^www\./, ""))) return "Internal";
    if (/google\./.test(h)) return "Google";
    if (/bing\./.test(h)) return "Bing";
    if (/duckduckgo/.test(h)) return "DuckDuckGo";
    if (/yahoo\./.test(h)) return "Yahoo";
    if (/yandex\./.test(h)) return "Yandex";
    if (/facebook|fb\.com/.test(h)) return "Facebook";
    if (/t\.co|twitter|x\.com/.test(h)) return "Twitter/X";
    if (/instagram/.test(h)) return "Instagram";
    if (/linkedin/.test(h)) return "LinkedIn";
    if (/reddit/.test(h)) return "Reddit";
    if (/t\.me|telegram/.test(h)) return "Telegram";
    return h;
  } catch {
    return "Direct";
  }
}

export async function POST(request: Request) {
  if (!adminConfigured) return Response.json({ ok: false }, { status: 200 });

  let body: {
    path?: string;
    referrer?: string;
    visitorId?: string;
    sessionId?: string;
    screen?: string;
  };
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }

  const { path = "/", referrer = "", visitorId = "", sessionId = "", screen = "" } = body;
  if (!visitorId || path.startsWith("/admin")) {
    return Response.json({ ok: true }); // don't track admin or anonymous
  }

  const selfHost = (() => {
    try {
      return new URL(request.url).hostname;
    } catch {
      return "";
    }
  })();

  const source = sourceFromReferrer(referrer, selfHost);
  const ua = request.headers.get("user-agent")?.slice(0, 300) || "";
  // Don't count search-engine crawlers and headless bots as visitors.
  if (parseUA(ua).device === "bot") return Response.json({ ok: true });

  // Visitor IP + geo. Country code comes free from Cloudflare/Vercel headers;
  // otherwise (and on localhost) we resolve it via ip-api.
  const fwd = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "";
  let ip = fwd || request.headers.get("x-real-ip") || "";
  let countryCode =
    request.headers.get("cf-ipcountry") || request.headers.get("x-vercel-ip-country") || "";
  let country = "";
  let city = "";

  const isPrivate = (a: string) =>
    !a || a === "::1" || a.startsWith("127.") || a.startsWith("10.") || a.startsWith("192.168.") || /^172\.(1[6-9]|2\d|3[01])\./.test(a) || a.startsWith("fc") || a.startsWith("fd");

  if (!countryCode || isPrivate(ip)) {
    try {
      const lookupIp = isPrivate(ip) ? "" : ip;
      const geo = await fetch(
        `http://ip-api.com/json/${lookupIp}?fields=status,country,countryCode,city,query`,
        { cache: "no-store", signal: AbortSignal.timeout(3000) }
      ).then((r) => r.json());
      if (geo?.status === "success") {
        country = geo.country || "";
        countryCode = geo.countryCode || countryCode;
        city = geo.city || "";
        if (isPrivate(ip)) ip = geo.query || ip;
      }
    } catch {
      /* geo optional */
    }
  }

  try {
    const db = adminDb();
    const now = FieldValue.serverTimestamp();

    // 1) Append the visit
    await db.collection("visits").add({
      visitorId,
      sessionId,
      path,
      referrer,
      source,
      country,
      countryCode,
      city,
      ip,
      screen,
      ua,
      ts: now,
    });

    // 2) Update / create the visitor aggregate (firstSeen + source set once)
    const visitorRef = db.collection("visitors").doc(visitorId);
    await db.runTransaction(async (tx) => {
      const snap = await tx.get(visitorRef);
      const data: Record<string, unknown> = {
        lastSeen: now,
        lastPath: path,
        visits: FieldValue.increment(1),
      };
      if (country) data.country = country;
      if (countryCode) data.countryCode = countryCode;
      if (city) data.city = city;
      if (ip) data.ip = ip;
      if (ua) data.ua = ua;
      if (!snap.exists) {
        data.firstSeen = now;
        if (source !== "Internal") data.source = source;
      } else if (source !== "Internal" && !snap.get("source")) {
        data.source = source;
      }
      tx.set(visitorRef, data, { merge: true });
    });

    return Response.json({ ok: true });
  } catch {
    // Never break the visitor's page over analytics.
    return Response.json({ ok: false }, { status: 200 });
  }
}
