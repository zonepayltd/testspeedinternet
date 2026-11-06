"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { PublicAd as ModelPublicAd } from "@/lib/adsModel";

export type PublicAd = ModelPublicAd;

export type AdsState = {
  /** master switch from Settings ("Show ads") */
  enabled: boolean;
  /** AdSense publisher id from Settings (ca-pub-…) */
  client: string;
  personalized: boolean;
  ads: PublicAd[];
};

const DEFAULT: AdsState = { enabled: false, client: "", personalized: true, ads: [] };

const Ctx = createContext<AdsState>(DEFAULT);
export const useAds = () => useContext(Ctx);

export function AdsProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AdsState>(DEFAULT);

  useEffect(() => {
    Promise.all([
      fetch("/api/config", { cache: "no-store" }).then((r) => r.json()),
      fetch("/api/ads", { cache: "no-store" }).then((r) => r.json()),
    ])
      .then(([cfg, ads]) => {
        setState({
          enabled: Boolean(cfg?.adsEnabled),
          client: cfg?.adsenseClient || "",
          personalized: cfg?.adsPersonalized !== false,
          ads: Array.isArray(ads?.ads) ? ads.ads : [],
        });
      })
      .catch(() => {});
  }, []);

  return <Ctx.Provider value={state}>{children}</Ctx.Provider>;
}
