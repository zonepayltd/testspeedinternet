import Link from "next/link";
import { ArrowRight, Download, Gauge, Globe, ShieldAlert, Upload, Wifi, Activity, type LucideIcon } from "lucide-react";
import { lp, pick, type Locale } from "@/i18n/config";
import { toolsMessages } from "@/i18n/messages/tools";

type Key = "full" | "download" | "upload" | "ping" | "wifi" | "myIp" | "ipRisk";

const TOOLS: { key: Key; href: string; icon: LucideIcon }[] = [
  { key: "full", href: "/", icon: Gauge },
  { key: "download", href: "/tools/download-speed-test", icon: Download },
  { key: "upload", href: "/tools/upload-speed-test", icon: Upload },
  { key: "ping", href: "/tools/ping-test", icon: Activity },
  { key: "wifi", href: "/tools/wifi-speed-test", icon: Wifi },
  { key: "myIp", href: "/what-is-my-ip", icon: Globe },
  { key: "ipRisk", href: "/ip-risk-score", icon: ShieldAlert },
];

/** Card grid linking the speed tools and IP tools. `exclude` hides entries (e.g. the current page). */
export default function ToolGrid({ locale, exclude = [] }: { locale: Locale; exclude?: Key[] }) {
  const t = pick(toolsMessages, locale);
  const items = TOOLS.filter((x) => !exclude.includes(x.key));
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map(({ key, href, icon: Icon }) => (
        <li key={key}>
          <Link href={lp(locale, href)} className="card card-hover group flex h-full items-start gap-4 p-5">
            <span className="icon-tile">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white">
                {t.directory[key].title}
                <ArrowRight
                  className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-600 rtl:rotate-180 rtl:group-hover:-translate-x-0.5 dark:group-hover:text-brand-400"
                  aria-hidden="true"
                />
              </span>
              <span className="mt-1 block text-sm leading-relaxed text-slate-500 dark:text-slate-400">{t.directory[key].text}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export type ToolKey = Key;
