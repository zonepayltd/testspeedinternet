import type { MetadataRoute } from "next";
import { getPublishedPosts, postLocales } from "@/lib/posts";
import { COMPANY } from "@/lib/company";
import { LOCALES, LOCALE_META, lp, type Locale } from "@/i18n/config";

const SITE = COMPANY.siteUrl;

export const dynamic = "force-dynamic";

type Freq = MetadataRoute.Sitemap[number]["changeFrequency"];

const STATIC: { path: string; priority: number; freq: Freq }[] = [
  { path: "/", priority: 1, freq: "daily" },
  { path: "/what-is-my-ip", priority: 0.9, freq: "weekly" },
  { path: "/ip-risk-score", priority: 0.9, freq: "weekly" },
  { path: "/tools/download-speed-test", priority: 0.8, freq: "weekly" },
  { path: "/tools/upload-speed-test", priority: 0.8, freq: "weekly" },
  { path: "/tools/ping-test", priority: 0.8, freq: "weekly" },
  { path: "/tools/wifi-speed-test", priority: 0.8, freq: "weekly" },
  { path: "/guides/good-internet-speed", priority: 0.8, freq: "monthly" },
  { path: "/blog", priority: 0.8, freq: "daily" },
  { path: "/how-it-works", priority: 0.6, freq: "monthly" },
  { path: "/faq", priority: 0.6, freq: "monthly" },
  { path: "/about", priority: 0.5, freq: "yearly" },
  { path: "/editorial-policy", priority: 0.4, freq: "yearly" },
  { path: "/contact", priority: 0.4, freq: "yearly" },
  { path: "/privacy", priority: 0.3, freq: "yearly" },
  { path: "/cookies", priority: 0.3, freq: "yearly" },
  { path: "/terms", priority: 0.3, freq: "yearly" },
  { path: "/dmca", priority: 0.3, freq: "yearly" },
];

const url = (l: Locale, path: string) => `${SITE}${lp(l, path)}`;

function languages(path: string, available: readonly Locale[]) {
  const out: Record<string, string> = {};
  for (const l of available) out[LOCALE_META[l].htmlLang] = url(l, path);
  if (available.includes("en")) out["x-default"] = url("en", path);
  return out;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const s of STATIC) {
    for (const l of LOCALES) {
      entries.push({
        url: url(l, s.path),
        lastModified: now,
        changeFrequency: s.freq,
        priority: l === "en" ? s.priority : Math.max(0.1, +(s.priority - 0.1).toFixed(1)),
        alternates: { languages: languages(s.path, LOCALES) },
      });
    }
  }

  for (const l of LOCALES) {
    try {
      const posts = await getPublishedPosts(l);
      for (const p of posts) {
        const path = `/blog/${p.slug}`;
        const available = p.source === "admin" ? (["en"] as Locale[]) : postLocales(p.slug);
        entries.push({
          url: url(l, path),
          lastModified: new Date(p.updatedAt || p.createdAt || Date.now()),
          changeFrequency: "monthly",
          priority: l === "en" ? 0.7 : 0.6,
          alternates: { languages: languages(path, available) },
          images: p.coverImage ? [p.coverImage.startsWith("http") ? p.coverImage : `${SITE}${p.coverImage}`] : undefined,
        });
      }
    } catch {
      /* sitemap still works without posts */
    }
  }

  return entries;
}
