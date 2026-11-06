// Client-side mirror of SiteConfig (src/lib/siteConfig.ts is server-only).
export type Social = { platform: string; url: string };

export type Config = {
  googleVerification: string;
  bingVerification: string;
  gaMeasurementId: string;
  turnstileSiteKey: string;
  turnstileSecret: string;
  appGooglePlay: string;
  appApple: string;
  appAmazon: string;
  appApk: string;
  adsenseClient: string;
  adsEnabled: boolean;
  adsPersonalized: boolean;
  adTopSlot: string;
  adInContentSlot: string;
  adSidebarLeftSlot: string;
  adSidebarRightSlot: string;
  adFooterSlot: string;
  socials: Social[];
  trustpilotUrl: string;
  trustpilotBusinessId: string;
};

export const EMPTY_CONFIG: Config = {
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
  socials: [],
  trustpilotUrl: "",
  trustpilotBusinessId: "",
};

export type EnvInfo = { firebase: boolean; turnstileSiteKeyFromEnv: boolean; turnstileSecretFromEnv: boolean };

export type Check = { configured: boolean; found: boolean | null };
export type Checks = { fetchedFrom: string; error?: string; google: Check; bing: Check; analytics: Check; adsense: Check; adsTxt: Check };

export type SetFn = <K extends keyof Config>(k: K, v: Config[K]) => void;
