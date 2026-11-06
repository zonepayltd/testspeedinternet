"use client";

import { useState } from "react";
import { Monitor, Moon, Smartphone, Sun } from "lucide-react";
import AdCreative, { type CreativeAd } from "@/components/ads/AdCreative";
import { Segmented } from "@/components/admin/ui";
import type { Placement } from "@/lib/adsModel";
import PreviewFrame from "./PreviewFrame";

const Bar = ({ w = "100%", h = 10, className = "" }: { w?: string; h?: number; className?: string }) => (
  <span className={`block rounded-full bg-slate-200/80 dark:bg-white/[0.07] ${className}`} style={{ width: w, height: h }} />
);

function MockHeader() {
  return (
    <div className="flex items-center justify-between border-b border-slate-200/70 bg-white px-5 py-3.5 dark:border-white/[0.06] dark:bg-ink-900">
      <div className="flex items-center gap-2">
        <span className="h-6 w-6 rounded-lg bg-brand-600" />
        <Bar w="110px" h={9} />
      </div>
      <div className="hidden gap-4 sm:flex">
        <Bar w="44px" h={7} />
        <Bar w="44px" h={7} />
        <Bar w="44px" h={7} />
      </div>
    </div>
  );
}

function MockText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2.5">
      {Array.from({ length: lines }, (_, i) => (
        <Bar key={i} w={i === lines - 1 ? "62%" : "100%"} h={8} />
      ))}
    </div>
  );
}

function MockSpeedTest() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-slate-200/70 bg-white p-6 dark:border-white/[0.06] dark:bg-ink-900">
      <div className="grid w-full grid-cols-3 gap-3">
        {["Download", "Upload", "Ping"].map((l, i) => (
          <div key={l} className="rounded-xl bg-slate-50 p-3 text-center dark:bg-white/[0.03]">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{l}</p>
            <p className="mt-1 text-lg font-bold tabular-nums text-slate-800 dark:text-white">{["248", "41.2", "12"][i]}</p>
          </div>
        ))}
      </div>
      <span className="rounded-full bg-brand-600 px-5 py-1.5 text-xs font-semibold text-white">Test again</span>
    </div>
  );
}

/** Live preview: the ad placed inside a mock page, in an isolated frame. */
export default function AdPreview({ ad, placement }: { ad: CreativeAd; placement: Placement }) {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const mobile = device === "mobile";
  const rail = placement === "sidebarLeft" || placement === "sidebarRight";
  const slot = (
    <div className={rail ? "" : "mx-auto w-full max-w-3xl"}>
      {(ad.type === "adsense" || ad.type === "html") && !rail && (
        <p className="mb-1 text-center text-[10px] font-medium uppercase tracking-wider text-slate-300 dark:text-slate-600">Advertisement</p>
      )}
      <AdCreative ad={ad} vertical={rail} preview />
    </div>
  );

  let page: React.ReactNode;
  if (rail) {
    page = (
      <div className={`flex gap-5 px-4 py-6 ${placement === "sidebarRight" ? "flex-row-reverse" : ""}`}>
        <div className="w-[160px] shrink-0">{slot}</div>
        <div className="min-w-0 flex-1 space-y-6">
          <Bar w="55%" h={18} />
          <MockSpeedTest />
          <MockText lines={6} />
        </div>
      </div>
    );
  } else {
    const content = (
      <div className="space-y-6">
        <Bar w="55%" h={18} />
        <MockText lines={3} />
      </div>
    );
    page = (
      <div className="space-y-6 px-5 py-6">
        {placement === "top" && slot}
        {content}
        {placement === "afterResults" ? (
          <>
            <MockSpeedTest />
            {slot}
          </>
        ) : (
          <MockSpeedTest />
        )}
        {(placement === "inContent" || placement === "inArticle") && slot}
        <MockText lines={4} />
        {placement === "footer" && slot}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <Segmented
          value={device}
          onChange={setDevice}
          options={[
            { value: "desktop", label: "Desktop" },
            { value: "mobile", label: "Mobile" },
          ]}
        />
        <Segmented
          value={theme}
          onChange={setTheme}
          options={[
            { value: "light", label: "Light" },
            { value: "dark", label: "Dark" },
          ]}
        />
      </div>
      <PreviewFrame width={mobile ? 390 : 900} dark={theme === "dark"}>
        <div>
          <MockHeader />
          {page}
          <div className="border-t border-slate-200/70 bg-white px-5 py-5 dark:border-white/[0.06] dark:bg-ink-900">
            <Bar w="40%" h={8} />
          </div>
        </div>
      </PreviewFrame>
      <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
        {mobile ? <Smartphone className="h-3.5 w-3.5" /> : <Monitor className="h-3.5 w-3.5" />}
        {mobile ? "390px phone" : "900px desktop (scaled)"} · {theme === "dark" ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />} {theme} theme
        {rail && mobile && " · side rails are hidden on phones on the live site"}
      </p>
    </div>
  );
}
