import "server-only";
import { adminDb, adminConfigured } from "@/lib/firebaseAdmin";

export type SiteConfig = {
  googleVerification: string;
  bingVerification: string;
  gaMeasurementId: string;
  turnstileSiteKey: string;
  turnstileSecret: string;
  appGooglePlay: string;
  appApple: string;
  appAmazon: string;
  appApk: string;
  // Google AdSense
  adsenseClient: string; // ca-pub-XXXXXXXXXXXXXXXX
  adsEnabled: boolean;
  adsPersonalized: boolean;
  adTopSlot: string;
  adInContentSlot: string;
  adSidebarLeftSlot: string;
  adSidebarRightSlot: string;
  adFooterSlot: string;
};

const DEFAULTS: SiteConfig = {
  googleVerification: "",
  bingVerification: "",
  gaMeasurementId: "",
  turnstileSiteKey: "",
  turnstileSecret: "",
  appGooglePlay: "",
  appApple: "",
  appAmazon: "",
  appApk: "",
  adsenseClient: "",
  adsEnabled: false,
  adsPersonalized: true,
  adTopSlot: "",
  adInContentSlot: "",
  adSidebarLeftSlot: "",
  adSidebarRightSlot: "",
  adFooterSlot: "",
};

let cache: SiteConfig | null = null;
let cacheAt = 0;
const TTL = 60_000;

export async function getSiteConfig(): Promise<SiteConfig> {
  if (cache && Date.now() - cacheAt < TTL) return cache;
  if (!adminConfigured) {
    cache = DEFAULTS;
    cacheAt = Date.now();
    return cache;
  }
  try {
    const doc = await adminDb().collection("config").doc("site").get();
    cache = { ...DEFAULTS, ...(doc.exists ? (doc.data() as Partial<SiteConfig>) : {}) };
  } catch {
    cache = DEFAULTS;
  }
  cacheAt = Date.now();
  return cache;
}

export async function saveSiteConfig(data: Partial<SiteConfig>): Promise<void> {
  await adminDb().collection("config").doc("site").set(data, { merge: true });
  cache = null; // invalidate
}

// Public-safe subset (no secrets). Falls back to env for the captcha key so
// keys set on the host (Vercel) work even if not stored in Firestore.
export function publicConfig(c: SiteConfig) {
  return {
    turnstileSiteKey: c.turnstileSiteKey || process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "",
    gaMeasurementId: c.gaMeasurementId,
    appGooglePlay: c.appGooglePlay,
    appApple: c.appApple,
    appAmazon: c.appAmazon,
    appApk: c.appApk,
    adsenseClient: c.adsenseClient,
    adsEnabled: c.adsEnabled,
    adsPersonalized: c.adsPersonalized,
    adTopSlot: c.adTopSlot,
    adInContentSlot: c.adInContentSlot,
    adSidebarLeftSlot: c.adSidebarLeftSlot,
    adSidebarRightSlot: c.adSidebarRightSlot,
    adFooterSlot: c.adFooterSlot,
  };
}
