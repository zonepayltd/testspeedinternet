// Server-only helpers for the ads admin API.
import "server-only";
import { Timestamp, type Firestore } from "firebase-admin/firestore";
import { LOCALES } from "@/i18n/config";
import { PLACEMENTS, SCOPES, validateAd, type Ad, type AdType } from "@/lib/adsModel";

const TYPES: AdType[] = ["adsense", "image", "card", "text", "html"];
const str = (v: unknown, max = 2000) => String(v ?? "").trim().slice(0, max);
const int = (v: unknown, min: number, max: number) => {
  const n = Math.round(Number(v));
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : 0;
};

/** Extract an uploaded image id from "/api/ad-image/<id>". */
export const imageIdFromUrl = (url: string) => /^\/api\/ad-image\/([A-Za-z0-9_-]+)$/.exec(url)?.[1] || "";

/** Normalise + validate a request body into Firestore fields. */
export function cleanAd(b: Record<string, unknown>): { data?: Record<string, unknown>; error?: string } {
  let type = (TYPES as string[]).includes(String(b.type)) ? (b.type as AdType) : "adsense";
  if (b.type === "custom") type = b.customFormat === "text" ? "text" : b.customFormat === "image" ? "image" : "card";
  const startAt = Number(b.startAt) || 0;
  const endAt = Number(b.endAt) || 0;
  const image = str(b.image);
  const ad: Partial<Ad> = {
    name: str(b.name, 120),
    type,
    placement: (PLACEMENTS.some((p) => p.value === b.placement) ? b.placement : "top") as Ad["placement"],
    scope: (SCOPES.some((s) => s.value === b.scope) ? b.scope : "all") as Ad["scope"],
    pathPrefix: str(b.pathPrefix, 300),
    locales: Array.isArray(b.locales) ? (b.locales.filter((l) => (LOCALES as readonly string[]).includes(String(l))) as Ad["locales"]) : [],
    device: b.device === "desktop" || b.device === "mobile" ? b.device : "all",
    startAt,
    endAt,
    enabled: b.enabled !== false,
    order: int(b.order, -9999, 9999),
    adsenseSlot: str(b.adsenseSlot, 40),
    image,
    imageId: imageIdFromUrl(image),
    alt: str(b.alt, 200),
    title: str(b.title, 140),
    description: str(b.description, 500),
    buttonText: str(b.buttonText, 40),
    link: str(b.link),
    html: String(b.html ?? "").slice(0, 50_000),
    width: int(b.width, 0, 2000),
    height: int(b.height, 0, 2000),
  };
  const error = validateAd(ad);
  if (error) return { error };
  return {
    data: {
      ...ad,
      startAt: startAt ? Timestamp.fromMillis(startAt) : null,
      endAt: endAt ? Timestamp.fromMillis(endAt) : null,
      customFormat: null, // drop legacy field
    },
  };
}

/** Delete uploaded images that no remaining ad references. Returns the number deleted. */
export async function deleteImagesIfUnused(db: Firestore, imageIds: string[]): Promise<number> {
  let deleted = 0;
  for (const id of Array.from(new Set(imageIds.filter(Boolean)))) {
    const used = await db.collection("ads").where("imageId", "==", id).limit(1).get();
    if (used.empty) {
      await db.collection("adImages").doc(id).delete();
      deleted++;
    }
  }
  return deleted;
}
