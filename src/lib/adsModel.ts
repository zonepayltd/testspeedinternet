import type { Timestamp } from "firebase-admin/firestore";

export type AdType = "adsense" | "custom";
export type Placement = "top" | "inContent" | "sidebarLeft" | "sidebarRight" | "footer";
export type Scope = "all" | "home" | "blog" | "tools" | "ip" | "path";
export type CustomFormat = "image" | "text" | "card"; // image only | text only | image + text

export type Ad = {
  id: string;
  name: string;
  type: AdType;
  placement: Placement;
  scope: Scope;
  pathPrefix: string;
  enabled: boolean;
  adsenseSlot: string;
  customFormat: CustomFormat;
  image: string;
  title: string;
  description: string;
  link: string;
  order: number;
  updatedAt: number;
  // stats
  impressions: number;
  clicks: number;
  impByCountry: Record<string, number>;
};

export const CUSTOM_FORMATS: { value: CustomFormat; label: string }[] = [
  { value: "card", label: "Image + text" },
  { value: "text", label: "Text only" },
  { value: "image", label: "Image only" },
];

export const PLACEMENTS: { value: Placement; label: string }[] = [
  { value: "top", label: "Top banner" },
  { value: "inContent", label: "In-content (home)" },
  { value: "sidebarLeft", label: "Left side rail" },
  { value: "sidebarRight", label: "Right side rail" },
  { value: "footer", label: "Footer banner" },
];

export const SCOPES: { value: Scope; label: string }[] = [
  { value: "all", label: "All pages" },
  { value: "home", label: "Home only" },
  { value: "blog", label: "Blog pages" },
  { value: "tools", label: "Speed-test tools" },
  { value: "ip", label: "IP tools" },
  { value: "path", label: "Custom path prefix" },
];

const ms = (t?: Timestamp) => (t ? t.toMillis() : 0);

export function mapAd(id: string, x: FirebaseFirestore.DocumentData): Ad {
  const cf = x.customFormat;
  return {
    id,
    name: x.name || "",
    type: x.type === "custom" ? "custom" : "adsense",
    placement: (x.placement || "top") as Placement,
    scope: (x.scope || "all") as Scope,
    pathPrefix: x.pathPrefix || "",
    enabled: x.enabled !== false,
    adsenseSlot: x.adsenseSlot || "",
    customFormat: cf === "text" ? "text" : cf === "image" ? "image" : "card",
    image: x.image || "",
    title: x.title || "",
    description: x.description || "",
    link: x.link || "",
    order: typeof x.order === "number" ? x.order : 0,
    updatedAt: ms(x.updatedAt),
    impressions: x.impressions || 0,
    clicks: x.clicks || 0,
    impByCountry: x.impByCountry && typeof x.impByCountry === "object" ? x.impByCountry : {},
  };
}

// Does this ad apply to the given pathname?
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
    case "path":
      return Boolean(pathPrefix) && pathname.startsWith(pathPrefix);
    default:
      return false;
  }
}
