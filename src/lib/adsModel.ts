// Shared ad model — used by the admin (editor, list, API) and the public site
// (AdSlot / AdsContext). Safe to import from client components (type-only
// firebase import).
import type { Timestamp } from "firebase-admin/firestore";
import { LOCALES, type Locale } from "@/i18n/config";

/** "custom" is the legacy stored type (image/text/card chosen by customFormat); mapAd converts it. */
export type AdType = "adsense" | "image" | "card" | "text" | "html";
export type Placement = "top" | "inContent" | "afterResults" | "inArticle" | "sidebarLeft" | "sidebarRight" | "footer";
export type Scope = "all" | "home" | "blog" | "tools" | "ip" | "path";
export type Device = "all" | "desktop" | "mobile";
export type AdStatus = "active" | "scheduled" | "expired" | "disabled";
/** Legacy, kept so old imports keep compiling. */
export type CustomFormat = "image" | "text" | "card";

export type Ad = {
  id: string;
  name: string;
  type: AdType;
  placement: Placement;
  scope: Scope;
  pathPrefix: string;
  /** empty = every language */
  locales: Locale[];
  device: Device;
  /** ms epoch, 0 = no limit */
  startAt: number;
  endAt: number;
  enabled: boolean;
  /** priority: lower shows first when several ads match a slot */
  order: number;
  // creative
  adsenseSlot: string;
  image: string;
  /** id in `adImages` when the image was uploaded through the admin */
  imageId: string;
  alt: string;
  title: string;
  description: string;
  buttonText: string;
  link: string;
  html: string;
  /** px, 0 = responsive (full width / auto height) */
  width: number;
  height: number;
  createdAt: number;
  updatedAt: number;
  // stats
  impressions: number;
  clicks: number;
  impByCountry: Record<string, number>;
  clickByCountry: Record<string, number>;
  impByDay: Record<string, number>;
  clickByDay: Record<string, number>;
};

/** Fields sent to the public site (no stats, no internal name). */
export type PublicAd = Pick<
  Ad,
  | "id"
  | "type"
  | "placement"
  | "scope"
  | "pathPrefix"
  | "locales"
  | "device"
  | "startAt"
  | "endAt"
  | "order"
  | "adsenseSlot"
  | "image"
  | "alt"
  | "title"
  | "description"
  | "buttonText"
  | "link"
  | "html"
  | "width"
  | "height"
>;

export const AD_TYPES: { value: AdType; label: string; hint: string }[] = [
  { value: "adsense", label: "Google AdSense", hint: "Ad unit from your AdSense account" },
  { value: "image", label: "Image banner", hint: "Uploaded image or URL + link" },
  { value: "card", label: "Card", hint: "Image, title, text and button" },
  { value: "text", label: "Text ad", hint: "Headline, text and button" },
  { value: "html", label: "HTML / Script", hint: "Any ad-network or affiliate code" },
];

export const PLACEMENTS: { value: Placement; label: string; hint: string }[] = [
  { value: "top", label: "Top banner", hint: "Under the header on every page" },
  { value: "inContent", label: "In-content", hint: "Between sections (home, blog, IP tools)" },
  { value: "afterResults", label: "After speed test results", hint: "Below the speed test on the home page" },
  { value: "inArticle", label: "Blog in-article", hint: "Inside blog articles (uses the article's content slot)" },
  { value: "sidebarLeft", label: "Left side rail", hint: "160px rail, wide screens (≥1280px) only" },
  { value: "sidebarRight", label: "Right side rail", hint: "160px rail, wide screens (≥1280px) only" },
  { value: "footer", label: "Footer banner", hint: "Above the footer on every page" },
];

export const SCOPES: { value: Scope; label: string }[] = [
  { value: "all", label: "All pages" },
  { value: "home", label: "Home only" },
  { value: "blog", label: "Blog pages" },
  { value: "tools", label: "Speed-test tools" },
  { value: "ip", label: "IP tools" },
  { value: "path", label: "Custom path prefix" },
];

export const DEVICES: { value: Device; label: string }[] = [
  { value: "all", label: "All devices" },
  { value: "desktop", label: "Desktop" },
  { value: "mobile", label: "Mobile" },
];

export const labelOf = (list: { value: string; label: string }[], v: string) => list.find((x) => x.value === v)?.label || v;

const ms = (t?: Timestamp | number | null) =>
  typeof t === "number" ? t : t && typeof (t as Timestamp).toMillis === "function" ? (t as Timestamp).toMillis() : 0;
const num = (v: unknown, d = 0) => (typeof v === "number" && Number.isFinite(v) ? v : d);
const numMap = (v: unknown): Record<string, number> => (v && typeof v === "object" ? (v as Record<string, number>) : {});

const TYPES: AdType[] = ["adsense", "image", "card", "text", "html"];
const PLACEMENT_VALUES: string[] = PLACEMENTS.map((p) => p.value);
const SCOPE_VALUES: string[] = SCOPES.map((s) => s.value);

/** Firestore document → Ad (handles legacy `type: "custom"` + `customFormat`). */
export function mapAd(id: string, x: FirebaseFirestore.DocumentData): Ad {
  let type: AdType = TYPES.includes(x.type) ? x.type : "adsense";
  if (x.type === "custom") type = x.customFormat === "text" ? "text" : x.customFormat === "image" ? "image" : "card";
  return {
    id,
    name: x.name || "",
    type,
    placement: (PLACEMENT_VALUES.includes(x.placement) ? x.placement : "top") as Placement,
    scope: (SCOPE_VALUES.includes(x.scope) ? x.scope : "all") as Scope,
    pathPrefix: x.pathPrefix || "",
    locales: Array.isArray(x.locales) ? x.locales.filter((l: string) => (LOCALES as readonly string[]).includes(l)) : [],
    device: x.device === "desktop" || x.device === "mobile" ? x.device : "all",
    startAt: ms(x.startAt),
    endAt: ms(x.endAt),
    enabled: x.enabled !== false,
    order: num(x.order),
    adsenseSlot: x.adsenseSlot || "",
    image: x.image || "",
    imageId: x.imageId || "",
    alt: x.alt || "",
    title: x.title || "",
    description: x.description || "",
    buttonText: x.buttonText || "",
    link: x.link || "",
    html: x.html || "",
    width: num(x.width),
    height: num(x.height),
    createdAt: ms(x.createdAt),
    updatedAt: ms(x.updatedAt),
    impressions: num(x.impressions),
    clicks: num(x.clicks),
    impByCountry: numMap(x.impByCountry),
    clickByCountry: numMap(x.clickByCountry),
    impByDay: numMap(x.impByDay),
    clickByDay: numMap(x.clickByDay),
  };
}

export function toPublicAd(a: Ad): PublicAd {
  const { id, type, placement, scope, pathPrefix, locales, device, startAt, endAt, order, adsenseSlot, image, alt, title, description, buttonText, link, html, width, height } = a;
  return { id, type, placement, scope, pathPrefix, locales, device, startAt, endAt, order, adsenseSlot, image, alt, title, description, buttonText, link, html, width, height };
}

export function adStatus(a: Pick<Ad, "enabled" | "startAt" | "endAt">, now = Date.now()): AdStatus {
  if (!a.enabled) return "disabled";
  if (a.startAt && a.startAt > now) return "scheduled";
  if (a.endAt && a.endAt <= now) return "expired";
  return "active";
}

export const inSchedule = (a: Pick<Ad, "startAt" | "endAt">, now = Date.now()) =>
  (!a.startAt || a.startAt <= now) && (!a.endAt || a.endAt > now);

/** Does this ad have everything it needs to render? (AdSense also needs the client id from Settings.) */
export function adIsRenderable(a: Pick<PublicAd, "type" | "adsenseSlot" | "image" | "title" | "link" | "html">): boolean {
  switch (a.type) {
    case "adsense":
      return Boolean(a.adsenseSlot);
    case "image":
      return Boolean(a.image && a.link);
    case "card":
      return Boolean(a.image && a.title && a.link);
    case "text":
      return Boolean(a.title && a.link);
    case "html":
      return Boolean(a.html.trim());
    default:
      return false;
  }
}

/** Does this ad apply to the given pathname (WITHOUT language prefix)? */
export function adMatchesPath(scope: Scope, pathPrefix: string, pathname: string): boolean {
  switch (scope) {
    case "all":
      return true;
    case "home":
      return pathname === "/";
    case "blog":
      return pathname === "/blog" || pathname.startsWith("/blog/");
    case "tools":
      return pathname.startsWith("/tools");
    case "ip":
      return pathname === "/what-is-my-ip" || pathname === "/ip-risk-score";
    case "path": {
      if (!pathPrefix) return false;
      // The admin may type a prefixed path ("/fr/blog"); targeting is language-neutral (use the language filter).
      const p = pathPrefix.startsWith("/") ? pathPrefix : `/${pathPrefix}`;
      const seg = p.split("/")[1];
      const bare = (LOCALES as readonly string[]).includes(seg) ? p.slice(seg.length + 1) || "/" : p;
      return pathname.startsWith(bare);
    }
    default:
      return false;
  }
}

/** http(s) or a same-site relative path (blocks javascript:, data:, protocol-relative). */
export const isSafeUrl = (u: string) => /^https?:\/\//i.test(u) || /^\/(?!\/)/.test(u);

/** Validation shared by the editor and the API. Returns an error message or null. */
export function validateAd(a: Partial<Ad>): string | null {
  if (!String(a.name || "").trim()) return "Give the ad a name.";
  const link = String(a.link || "").trim();
  const image = String(a.image || "").trim();
  switch (a.type) {
    case "adsense":
      if (!/^\d{6,}$/.test(String(a.adsenseSlot || "").trim())) return "AdSense slot ID must be digits (e.g. 1234567890).";
      break;
    case "image":
      if (!image) return "Upload an image or paste an image URL.";
      break;
    case "card":
      if (!image) return "Cards need an image.";
      if (!String(a.title || "").trim()) return "Cards need a title.";
      break;
    case "text":
      if (!String(a.title || "").trim()) return "Text ads need a headline.";
      break;
    case "html":
      if (!String(a.html || "").trim()) return "Paste the ad code.";
      if (String(a.html).length > 50_000) return "Ad code is too long (max 50,000 characters).";
      break;
    default:
      return "Pick an ad type.";
  }
  if (a.type === "image" || a.type === "card" || a.type === "text") {
    if (!link) return "Add the link (where the ad goes when clicked).";
    if (!isSafeUrl(link)) return "Link must start with https:// (or http://).";
  }
  if ((a.type === "image" || a.type === "card") && !isSafeUrl(image)) return "Image URL must start with https://";
  if (a.scope === "path" && !String(a.pathPrefix || "").trim().startsWith("/")) return "Path prefix must start with / (e.g. /blog).";
  if (a.startAt && a.endAt && a.endAt <= a.startAt) return "End date must be after the start date.";
  const w = a.width || 0;
  const h = a.height || 0;
  if (w < 0 || w > 2000 || h < 0 || h > 2000) return "Width and height must be between 0 and 2000 px.";
  return null;
}

/** Wraps pasted ad code in a full document for a sandboxed <iframe srcdoc>. The tiny
 *  script reports the content height to the parent so responsive frames grow to fit. */
export function buildAdSrcDoc(html: string): string {
  const resize =
    `<script>(function(){var last=0;function s(){var b=document.body,h=Math.ceil(Math.max(b?b.scrollHeight:0,b?b.offsetHeight:0));` +
    `if(h&&h!==last){last=h;parent.postMessage({tsiAdHeight:h},"*")}}window.addEventListener("load",s);` +
    `if(window.ResizeObserver&&document.body){new ResizeObserver(s).observe(document.body)}` +
    `var n=0,t=setInterval(function(){s();if(++n>30)clearInterval(t)},500);s()})();</script>`;
  return (
    `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">` +
    `<base target="_blank"><style>html,body{margin:0;padding:0;background:transparent;overflow:hidden}` +
    `body{text-align:center;font-family:system-ui,sans-serif}img{max-width:100%;height:auto}</style></head>` +
    `<body>${html}${resize}</body></html>`
  );
}

/** UTC day key used by impByDay / clickByDay. */
export const dayKey = (d = new Date()) => d.toISOString().slice(0, 10);
