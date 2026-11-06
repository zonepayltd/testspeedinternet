import {
  BarChart3,
  FileText,
  Gauge,
  LayoutDashboard,
  Mail,
  Megaphone,
  Radio,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";

export type NavItem = { href: string; label: string; icon: LucideIcon; badge?: "online" | "unread"; keywords?: string };
export type NavGroup = { label: string; items: NavItem[] };

/** Admin navigation — used by the sidebar, breadcrumb and the Cmd/Ctrl+K palette. */
export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { href: "/admin", label: "Overview", icon: LayoutDashboard, keywords: "dashboard home kpi" },
      { href: "/admin/online", label: "Online now", icon: Radio, badge: "online", keywords: "live presence realtime" },
      { href: "/admin/analytics", label: "Analytics", icon: BarChart3, keywords: "traffic sources search engines google bing" },
    ],
  },
  {
    label: "Activity",
    items: [
      { href: "/admin/tests", label: "Speed tests", icon: Gauge, keywords: "download upload ping results" },
      { href: "/admin/visitors", label: "Visitors", icon: Users, keywords: "users people sessions" },
      { href: "/admin/messages", label: "Messages", icon: Mail, badge: "unread", keywords: "contact inbox email" },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/blog", label: "Blog", icon: FileText, keywords: "posts articles write" },
      { href: "/admin/ads", label: "Ads", icon: Megaphone, keywords: "adsense banners scripts images" },
    ],
  },
  {
    label: "System",
    items: [{ href: "/admin/settings", label: "Settings", icon: Settings, keywords: "config search console captcha" }],
  },
];

export const NAV_ITEMS = NAV_GROUPS.flatMap((g) => g.items);

export function activeNav(pathname: string | null): NavItem | undefined {
  const p = pathname || "/admin";
  if (p === "/admin") return NAV_ITEMS[0];
  return NAV_ITEMS.filter((n) => n.href !== "/admin" && (p === n.href || p.startsWith(n.href + "/"))).sort((a, b) => b.href.length - a.href.length)[0];
}
