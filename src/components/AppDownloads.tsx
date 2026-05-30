"use client";

import { useEffect, useState } from "react";
import { Play, Smartphone, ShoppingBag, Download } from "lucide-react";

type Apps = {
  appGooglePlay?: string;
  appApple?: string;
  appAmazon?: string;
  appApk?: string;
};

const ITEMS = [
  { key: "appGooglePlay" as const, top: "Get it on", label: "Google Play", icon: Play },
  { key: "appApple" as const, top: "Download on the", label: "App Store", icon: Smartphone },
  { key: "appAmazon" as const, top: "Available at", label: "Amazon Appstore", icon: ShoppingBag },
  { key: "appApk" as const, top: "Direct", label: "Download APK", icon: Download },
];

export default function AppDownloads() {
  const [apps, setApps] = useState<Apps>({});

  useEffect(() => {
    fetch("/api/config", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setApps(d || {}))
      .catch(() => {});
  }, []);

  return (
    <div className="text-center">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-900">
        Download our apps
      </h2>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        {ITEMS.map(({ key, top, label, icon: Icon }) => {
          const url = apps[key];
          const isApk = key === "appApk";

          if (url) {
            return (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                {...(isApk ? { download: "" } : {})}
                className="group flex items-center gap-2.5 rounded-2xl bg-slate-900 px-4 py-2.5 text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-md"
              >
                <Icon className="h-6 w-6 text-cyan-400 transition-transform group-hover:scale-110" aria-hidden="true" />
                <span className="flex flex-col text-left leading-tight">
                  <span className="text-[10px] font-medium text-slate-300">{top}</span>
                  <span className="text-sm font-bold">{label}</span>
                </span>
              </a>
            );
          }

          return (
            <span
              key={key}
              className="flex items-center gap-2.5 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-400"
            >
              <Icon className="h-6 w-6 text-slate-300" aria-hidden="true" />
              <span className="flex flex-col text-left leading-tight">
                <span className="text-[10px] font-medium text-slate-300">{label}</span>
                <span className="text-sm font-bold">Coming soon</span>
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
