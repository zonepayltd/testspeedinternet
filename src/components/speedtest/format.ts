import type { Locale } from "@/i18n/config";

/** Locale for numbers/dates. Arabic keeps Latin digits so speeds read clearly. */
export function numberLocale(locale: Locale): string {
  return locale === "ar" ? "ar-u-nu-latn" : locale;
}

const nfCache = new Map<string, Intl.NumberFormat>();
function nf(locale: Locale, digits: number): Intl.NumberFormat {
  const key = `${locale}:${digits}`;
  let f = nfCache.get(key);
  if (!f) {
    f = new Intl.NumberFormat(numberLocale(locale), {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    });
    nfCache.set(key, f);
  }
  return f;
}

/** Speed in Mbps: 2 decimals under 1, 1 decimal under 100, whole numbers above. */
export function formatSpeed(v: number, locale: Locale): string {
  if (!Number.isFinite(v) || v < 0) v = 0;
  const digits = v >= 100 ? 0 : v >= 1 || v === 0 ? 1 : 2;
  return nf(locale, digits).format(v);
}

/** Milliseconds as a whole number. */
export function formatMs(v: number, locale: Locale): string {
  return nf(locale, 0).format(Math.max(0, Math.round(v)));
}

/** Gauge tick labels: integers as-is, small scales with one decimal. */
export function formatTick(v: number, locale: Locale): string {
  return nf(locale, Number.isInteger(v) ? 0 : 1).format(v);
}

// ---------------------------------------------------------------------------
// Gauge scale — the max adapts to the connection so the dial is meaningful
// whether you have 1.5 Mbps or 900 Mbps. Each tier ÷ 5 gives clean ticks.
// ---------------------------------------------------------------------------
export const SCALE_TIERS = [2.5, 5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000];
export const PING_TIERS = [100, 250, 500, 1000, 2500];

export function niceMax(v: number, tiers: number[] = SCALE_TIERS): number {
  for (const t of tiers) if (v <= t * 0.95) return t;
  return tiers[tiers.length - 1];
}

// ---------------------------------------------------------------------------
// Connection details
// ---------------------------------------------------------------------------

/** Cloudflare data-centre (IATA code) → city. Unknown codes show the code itself. */
const COLO: Record<string, string> = {
  // Africa & Middle East
  CMN: "Casablanca", RBA: "Rabat", ALG: "Algiers", TUN: "Tunis", CAI: "Cairo", LOS: "Lagos",
  JNB: "Johannesburg", CPT: "Cape Town", NBO: "Nairobi", ACC: "Accra", DKR: "Dakar",
  DXB: "Dubai", AUH: "Abu Dhabi", DOH: "Doha", RUH: "Riyadh", JED: "Jeddah", KWI: "Kuwait City",
  BAH: "Manama", MCT: "Muscat", AMM: "Amman", BEY: "Beirut", TLV: "Tel Aviv", BGW: "Baghdad",
  IST: "Istanbul",
  // Europe
  MRS: "Marseille", CDG: "Paris", LYS: "Lyon", LHR: "London", MAN: "Manchester", DUB: "Dublin",
  MAD: "Madrid", BCN: "Barcelona", LIS: "Lisbon", FRA: "Frankfurt", MUC: "Munich", DUS: "Düsseldorf",
  HAM: "Hamburg", BER: "Berlin", TXL: "Berlin", AMS: "Amsterdam", BRU: "Brussels", ZRH: "Zurich",
  GVA: "Geneva", VIE: "Vienna", MXP: "Milan", FCO: "Rome", PRG: "Prague", WAW: "Warsaw",
  BUD: "Budapest", OTP: "Bucharest", SOF: "Sofia", ATH: "Athens", CPH: "Copenhagen", ARN: "Stockholm",
  OSL: "Oslo", HEL: "Helsinki", RIX: "Riga", TLL: "Tallinn", VNO: "Vilnius", KBP: "Kyiv",
  KIV: "Chișinău", DME: "Moscow", SVO: "Moscow", LED: "Saint Petersburg", TBS: "Tbilisi", EVN: "Yerevan",
  GYD: "Baku", ALA: "Almaty",
  // Americas
  IAD: "Washington", EWR: "Newark", JFK: "New York", BOS: "Boston", ATL: "Atlanta", MIA: "Miami",
  ORD: "Chicago", DFW: "Dallas", IAH: "Houston", DEN: "Denver", PHX: "Phoenix", LAX: "Los Angeles",
  SJC: "San Jose", SFO: "San Francisco", SEA: "Seattle", YYZ: "Toronto", YUL: "Montréal", YVR: "Vancouver",
  MEX: "Mexico City", QRO: "Querétaro", BOG: "Bogotá", LIM: "Lima", SCL: "Santiago", EZE: "Buenos Aires",
  GRU: "São Paulo", GIG: "Rio de Janeiro",
  // Asia-Pacific
  SIN: "Singapore", HKG: "Hong Kong", NRT: "Tokyo", KIX: "Osaka", ICN: "Seoul", TPE: "Taipei",
  BOM: "Mumbai", DEL: "New Delhi", MAA: "Chennai", BLR: "Bangalore", KHI: "Karachi", BKK: "Bangkok",
  KUL: "Kuala Lumpur", CGK: "Jakarta", MNL: "Manila", SGN: "Ho Chi Minh City", HAN: "Hanoi",
  SYD: "Sydney", MEL: "Melbourne", BNE: "Brisbane", PER: "Perth", AKL: "Auckland",
};

export function coloCity(code: string): string {
  return COLO[code] ?? code;
}

/** Real flag image (emoji flags don't render on Windows browsers). */
export function flagUrl(cc?: string, retina = false): string | null {
  if (!cc || cc.length !== 2) return null;
  const c = cc.toLowerCase();
  return retina ? `https://flagcdn.com/64x48/${c}.png` : `https://flagcdn.com/32x24/${c}.png`;
}

/** Localized country name from an ISO code, falling back to the API's English name. */
export function countryName(cc: string | undefined, fallback: string | undefined, locale: Locale): string {
  if (cc && cc.length === 2) {
    try {
      const dn = new Intl.DisplayNames([locale], { type: "region" });
      const name = dn.of(cc.toUpperCase());
      if (name && name !== cc.toUpperCase()) return name;
    } catch {
      /* older browsers */
    }
  }
  return fallback ?? "";
}

// ---------------------------------------------------------------------------
// Verdict — what the connection is good for
// ---------------------------------------------------------------------------

export type Results = {
  download: number | null;
  upload: number | null;
  ping: number | null;
  jitter: number | null;
};

export type Rating = "excellent" | "veryGood" | "good" | "fair" | "slow";
export type Activity = "browsing" | "hdStreaming" | "uhdStreaming" | "videoCalls" | "gaming" | "wfh" | "uploads";

const RATINGS: Rating[] = ["excellent", "veryGood", "good", "fair", "slow"];

function bucket(v: number, thresholds: number[], higherIsBetter: boolean): number {
  // returns index into RATINGS
  for (let i = 0; i < thresholds.length; i++) {
    if (higherIsBetter ? v >= thresholds[i] : v <= thresholds[i]) return i;
  }
  return RATINGS.length - 1;
}

/** Overall rating + which signal it was based on. */
export function rateConnection(r: Results): { rating: Rating; basis: "download" | "upload" | "latency" } | null {
  if (r.download != null) {
    let i = bucket(r.download, [200, 50, 20, 5], true);
    if (r.ping != null && r.ping > 100) i = Math.min(i + 1, RATINGS.length - 1);
    return { rating: RATINGS[i], basis: "download" };
  }
  if (r.upload != null) return { rating: RATINGS[bucket(r.upload, [100, 20, 5, 1], true)], basis: "upload" };
  if (r.ping != null) {
    let i = bucket(r.ping, [20, 40, 80, 150], false);
    if (r.jitter != null && r.jitter > 30) i = Math.min(i + 1, RATINGS.length - 1);
    return { rating: RATINGS[i], basis: "latency" };
  }
  return null;
}

/** For each activity: true (fine), false (may struggle) — omitted when there isn't enough data. */
export function activityChecks(r: Results): { id: Activity; ok: boolean }[] {
  const { download: dl, upload: ul, ping, jitter } = r;
  const out: { id: Activity; ok: boolean }[] = [];
  const pingOk = (max: number) => ping == null || ping <= max;
  if (dl != null) {
    out.push({ id: "browsing", ok: dl >= 2 });
    out.push({ id: "hdStreaming", ok: dl >= 5 });
    out.push({ id: "uhdStreaming", ok: dl >= 25 });
  }
  if (dl != null && ul != null) out.push({ id: "videoCalls", ok: dl >= 3 && ul >= 2 && pingOk(150) });
  if (ping != null) {
    out.push({
      id: "gaming",
      ok: ping <= 60 && (jitter == null || jitter <= 30) && (dl == null || dl >= 3),
    });
  }
  if (dl != null && ul != null) out.push({ id: "wfh", ok: dl >= 25 && ul >= 5 && pingOk(100) });
  if (ul != null) out.push({ id: "uploads", ok: ul >= 20 });
  return out;
}

export const RATING_TONE: Record<Rating, string> = {
  excellent:
    "bg-emerald-50 text-emerald-700 ring-emerald-600/15 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-400/20",
  veryGood:
    "bg-emerald-50 text-emerald-700 ring-emerald-600/15 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-400/20",
  good: "bg-brand-50 text-brand-700 ring-brand-600/15 dark:bg-brand-400/10 dark:text-brand-300 dark:ring-brand-400/20",
  fair: "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-400/20",
  slow: "bg-rose-50 text-rose-700 ring-rose-600/15 dark:bg-rose-400/10 dark:text-rose-300 dark:ring-rose-400/20",
};
