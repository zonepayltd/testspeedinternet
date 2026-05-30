import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/posts";

const SITE = "https://testspeedinternet.com";

export const dynamic = "force-dynamic";

const STATIC: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "", priority: 1, freq: "daily" },
  { path: "/what-is-my-ip", priority: 0.9, freq: "weekly" },
  { path: "/ip-risk-score", priority: 0.9, freq: "weekly" },
  { path: "/tools/download-speed-test", priority: 0.8, freq: "weekly" },
  { path: "/tools/upload-speed-test", priority: 0.8, freq: "weekly" },
  { path: "/tools/ping-test", priority: 0.8, freq: "weekly" },
  { path: "/tools/wifi-speed-test", priority: 0.8, freq: "weekly" },
  { path: "/how-it-works", priority: 0.6, freq: "monthly" },
  { path: "/guides/good-internet-speed", priority: 0.7, freq: "monthly" },
  { path: "/faq", priority: 0.6, freq: "monthly" },
  { path: "/blog", priority: 0.7, freq: "daily" },
  { path: "/about", priority: 0.4, freq: "yearly" },
  { path: "/contact", priority: 0.4, freq: "yearly" },
  { path: "/privacy", priority: 0.3, freq: "yearly" },
  { path: "/terms", priority: 0.3, freq: "yearly" },
  { path: "/dmca", priority: 0.3, freq: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const base: MetadataRoute.Sitemap = STATIC.map((s) => ({
    url: `${SITE}${s.path}`,
    lastModified: now,
    changeFrequency: s.freq,
    priority: s.priority,
  }));

  let posts: MetadataRoute.Sitemap = [];
  try {
    posts = (await getPublishedPosts()).map((p) => ({
      url: `${SITE}/blog/${p.slug}`,
      lastModified: new Date(p.updatedAt || p.createdAt || Date.now()),
      changeFrequency: "weekly",
      priority: 0.6,
    }));
  } catch {
    /* sitemap still works without posts */
  }

  return [...base, ...posts];
}
