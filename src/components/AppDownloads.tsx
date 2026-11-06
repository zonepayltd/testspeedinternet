"use client";

import { useEffect, useState } from "react";
import { Play, Smartphone, ShoppingBag, Download } from "lucide-react";
import { useLocale } from "@/i18n/client";
import { pick } from "@/i18n/config";
import { chromeMessages, type ChromeMessages } from "@/i18n/messages/chrome";

type Apps = {
  appGooglePlay?: string;
  appApple?: string;
  appAmazon?: string;
  appApk?: string;
};

const items = (t: ChromeMessages["apps"]) => [
  { key: "appGooglePlay" as const, top: t.googlePlayTop, label: "Google Play", icon: Play },
  { key: "appApple" as const, top: t.appleTop, label: "App Store", icon: Smartphone },
  { key: "appAmazon" as const, top: t.amazonTop, label: "Amazon Appstore", icon: ShoppingBag },
  { key: "appApk" as const, top: t.apkTop, label: t.apkLabel, icon: Download },
];

export default function AppDownloads() {
  const [apps, setApps] = useState<Apps>({});
  const t = pick(chromeMessages, useLocale()).apps;

  useEffect(() => {
    fetch("/api/config", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setApps(d || {}))
      .catch(() => {});
  }, []);

  // Only show stores that have a link in the admin settings; hide the row otherwise.
  const available = items(t).filter(({ key }) => Boolean(apps[key]));
  if (available.length === 0) return null;

  return (
    <div className="mt-14 border-t border-slate-200/80 pt-10 text-center dark:border-white/[0.07]">
      <h2 className="text-sm font-semibold text-slate-900 dark:text-white">{t.heading}</h2>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        {available.map(({ key, top, label, icon: Icon }) => {
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
                className="group flex items-center gap-2.5 rounded-xl bg-slate-900 px-4 py-2.5 text-white shadow-sm ring-1 ring-inset ring-white/10 transition-all hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-md dark:bg-white/[0.06] dark:hover:bg-white/10"
              >
                <Icon className="h-6 w-6 text-cyan-400 transition-transform group-hover:scale-110" aria-hidden="true" />
                <span className="flex flex-col text-start leading-tight">
                  <span className="text-[10px] font-medium text-slate-300">{top}</span>
                  <span className="text-sm font-bold">{label}</span>
                </span>
              </a>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}
