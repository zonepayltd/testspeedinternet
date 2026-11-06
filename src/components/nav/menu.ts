import {
  Activity,
  BookOpen,
  Building2,
  Download,
  FileCheck2,
  Gauge,
  Globe,
  HelpCircle,
  Mail,
  Newspaper,
  ShieldCheck,
  Upload,
  Wifi,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import type { NavMessages } from "@/i18n/messages/nav";

export type ItemKey = keyof NavMessages["items"];
export type MenuKey = keyof NavMessages["menus"];
export type MenuItem = { key: ItemKey; href: string; icon: LucideIcon };
export type Menu = { key: MenuKey; items: MenuItem[] };

// Site navigation, shared by the header mega-menu and the footer.
export const MENUS: Menu[] = [
  {
    key: "speed",
    items: [
      { key: "internet", href: "/", icon: Gauge },
      { key: "download", href: "/tools/download-speed-test", icon: Download },
      { key: "upload", href: "/tools/upload-speed-test", icon: Upload },
      { key: "ping", href: "/tools/ping-test", icon: Activity },
      { key: "wifi", href: "/tools/wifi-speed-test", icon: Wifi },
    ],
  },
  {
    key: "ip",
    items: [
      { key: "myIp", href: "/what-is-my-ip", icon: Globe },
      { key: "ipRisk", href: "/ip-risk-score", icon: ShieldCheck },
    ],
  },
  {
    key: "learn",
    items: [
      { key: "guide", href: "/guides/good-internet-speed", icon: BookOpen },
      { key: "howItWorks", href: "/how-it-works", icon: Workflow },
      { key: "blog", href: "/blog", icon: Newspaper },
      { key: "faq", href: "/faq", icon: HelpCircle },
    ],
  },
  {
    key: "company",
    items: [
      { key: "about", href: "/about", icon: Building2 },
      { key: "editorial", href: "/editorial-policy", icon: FileCheck2 },
      { key: "contact", href: "/contact", icon: Mail },
    ],
  },
];

export const POPULAR_GUIDES = [
  { key: "learnA", href: "/blog/what-is-a-good-ping-for-gaming" },
  { key: "learnB", href: "/blog/why-is-my-internet-so-slow" },
  { key: "learnC", href: "/blog/how-to-boost-wifi-signal" },
] as const;

/** Is `href` the current page (or a parent section of it)? */
export function isActive(current: string, href: string) {
  return href === "/" ? current === "/" : current === href || current.startsWith(`${href}/`);
}
