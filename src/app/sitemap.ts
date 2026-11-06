import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/posts";
import { COMPANY } from "@/lib/company";

const SITE = COMPANY.siteUrl;

export const dynamic = "force-dynamic";

type Freq = MetadataRoute.Sitemap[number]["changeFrequency"];

const STATIC: { path: string; priority: number; freq: Freq }[] = [
  { path: "", priority: 1, freq: "daily" },
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let postEntries: MetadataRoute.Sitemap = [];
  let newest = 0;
  try {
    const posts = await getPublishedPosts();
    postEntries = posts.map((p) => {
      const t = p.updatedAt || p.createdAt || Date.now();
      newest = Math.max(newest, t);
      return {
        url: `${SITE}/blog/${p.slug}`,
        lastModified: new Date(t),
        changeFrequency: "monthly" as Freq,
        priority: 0.7,
        images: p.coverImage ? [p.coverImage.startsWith("http") ? p.coverImage : `${SITE}${p.coverImage}`] : undefined,
      };
    });
  } catch {
    /* sitemap still works without posts */
  }

  const now = new Date();
  const base: MetadataRoute.Sitemap = STATIC.map((s) => ({
    url: `${SITE}${s.path}`,
    lastModified: s.path === "/blog" && newest ? new Date(newest) : now,
    changeFrequency: s.freq,
    priority: s.priority,
  }));

  return [...base, ...postEntries];
}
