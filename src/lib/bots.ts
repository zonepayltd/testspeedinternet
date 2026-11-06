// Recognises crawlers / bots from the user agent. Edge-safe (used by middleware).
// Bots are logged separately from real visitors (collection "bots").

export type BotKind = "search" | "ads" | "ai" | "seo" | "social" | "monitor" | "other";

export const BOT_KIND_LABEL: Record<BotKind, string> = {
  search: "Search engine",
  ads: "Ads crawler",
  ai: "AI crawler",
  seo: "SEO tool",
  social: "Link preview",
  monitor: "Monitoring",
  other: "Other bot",
};

// Order matters: the first match wins (specific names before generic ones).
const BOTS: { re: RegExp; name: string; kind: BotKind; domain?: string }[] = [
  { re: /mediapartners-google/i, name: "AdSense crawler", kind: "ads", domain: "adsense.google.com" },
  { re: /adsbot-google/i, name: "AdsBot Google", kind: "ads", domain: "ads.google.com" },
  { re: /google-inspectiontool/i, name: "Google Search Console", kind: "search", domain: "search.google.com" },
  { re: /googlebot-image/i, name: "Googlebot Image", kind: "search", domain: "google.com" },
  { re: /googlebot|google-site-verification|googleother|storebot-google/i, name: "Googlebot", kind: "search", domain: "google.com" },
  { re: /bingbot|bingpreview|msnbot|adidxbot/i, name: "Bingbot", kind: "search", domain: "bing.com" },
  { re: /yandex/i, name: "YandexBot", kind: "search", domain: "yandex.com" },
  { re: /baiduspider/i, name: "Baiduspider", kind: "search", domain: "baidu.com" },
  { re: /duckduckbot|duckassistbot/i, name: "DuckDuckBot", kind: "search", domain: "duckduckgo.com" },
  { re: /applebot/i, name: "Applebot", kind: "search", domain: "apple.com" },
  { re: /yahoo! slurp|slurp/i, name: "Yahoo Slurp", kind: "search", domain: "yahoo.com" },
  { re: /seznambot/i, name: "SeznamBot", kind: "search", domain: "seznam.cz" },
  { re: /yeti\//i, name: "Naver Yeti", kind: "search", domain: "naver.com" },
  { re: /petalbot/i, name: "PetalBot", kind: "search", domain: "petalsearch.com" },
  { re: /sogou/i, name: "Sogou", kind: "search", domain: "sogou.com" },
  { re: /qwant/i, name: "Qwantbot", kind: "search", domain: "qwant.com" },
  { re: /ecosia/i, name: "Ecosia", kind: "search", domain: "ecosia.org" },
  { re: /mojeekbot/i, name: "MojeekBot", kind: "search", domain: "mojeek.com" },
  { re: /gptbot|chatgpt-user|oai-searchbot/i, name: "OpenAI (ChatGPT)", kind: "ai", domain: "openai.com" },
  { re: /claudebot|claude-user|claude-searchbot|anthropic-ai/i, name: "Claude", kind: "ai", domain: "claude.ai" },
  { re: /perplexity/i, name: "Perplexity", kind: "ai", domain: "perplexity.ai" },
  { re: /bytespider/i, name: "Bytespider (TikTok)", kind: "ai", domain: "bytedance.com" },
  { re: /ccbot/i, name: "Common Crawl", kind: "ai", domain: "commoncrawl.org" },
  { re: /amazonbot/i, name: "Amazonbot", kind: "ai", domain: "amazon.com" },
  { re: /meta-externalagent|meta-externalfetcher/i, name: "Meta AI", kind: "ai", domain: "meta.com" },
  { re: /cohere-ai|youbot|diffbot|timpibot|ai2bot/i, name: "AI crawler", kind: "ai" },
  { re: /ahrefs/i, name: "AhrefsBot", kind: "seo", domain: "ahrefs.com" },
  { re: /semrush/i, name: "SemrushBot", kind: "seo", domain: "semrush.com" },
  { re: /mj12bot/i, name: "Majestic", kind: "seo", domain: "majestic.com" },
  { re: /dotbot|rogerbot/i, name: "Moz", kind: "seo", domain: "moz.com" },
  { re: /screaming frog/i, name: "Screaming Frog", kind: "seo", domain: "screamingfrog.co.uk" },
  { re: /serpstatbot/i, name: "Serpstat", kind: "seo", domain: "serpstat.com" },
  { re: /dataforseo/i, name: "DataForSEO", kind: "seo", domain: "dataforseo.com" },
  { re: /barkrowler|blexbot|seokicks|linkdexbot/i, name: "SEO crawler", kind: "seo" },
  { re: /facebookexternalhit|facebookcatalog/i, name: "Facebook", kind: "social", domain: "facebook.com" },
  { re: /twitterbot/i, name: "X (Twitter)", kind: "social", domain: "x.com" },
  { re: /linkedinbot/i, name: "LinkedIn", kind: "social", domain: "linkedin.com" },
  { re: /slackbot|slack-imgproxy/i, name: "Slack", kind: "social", domain: "slack.com" },
  { re: /telegrambot/i, name: "Telegram", kind: "social", domain: "telegram.org" },
  { re: /whatsapp/i, name: "WhatsApp", kind: "social", domain: "whatsapp.com" },
  { re: /discordbot/i, name: "Discord", kind: "social", domain: "discord.com" },
  { re: /pinterest/i, name: "Pinterest", kind: "social", domain: "pinterest.com" },
  { re: /redditbot/i, name: "Reddit", kind: "social", domain: "reddit.com" },
  { re: /skypeuripreview|microsoftpreview/i, name: "Microsoft Teams", kind: "social", domain: "microsoft.com" },
  { re: /uptimerobot/i, name: "UptimeRobot", kind: "monitor", domain: "uptimerobot.com" },
  { re: /pingdom/i, name: "Pingdom", kind: "monitor", domain: "pingdom.com" },
  { re: /vercel-(screenshot|favicon)|vercelbot/i, name: "Vercel", kind: "monitor", domain: "vercel.com" },
  { re: /lighthouse|pagespeed|chrome-lighthouse/i, name: "PageSpeed / Lighthouse", kind: "monitor", domain: "pagespeed.web.dev" },
  { re: /gtmetrix/i, name: "GTmetrix", kind: "monitor", domain: "gtmetrix.com" },
];

const GENERIC = /bot\b|bot\/|crawler|spider|crawl|headlesschrome|python-requests|python-urllib|aiohttp|curl\/|wget\/|go-http-client|okhttp|java\/|libwww|httpclient|axios\/|node-fetch|scrapy|phantomjs|puppeteer|playwright/i;

export type BotInfo = { name: string; kind: BotKind; domain?: string };

/** Returns the bot behind a user agent, or null for (probably) a real browser. */
export function identifyBot(ua: string | null | undefined): BotInfo | null {
  const s = (ua || "").trim();
  if (!s) return { name: "Unknown (no user agent)", kind: "other" };
  for (const b of BOTS) if (b.re.test(s)) return { name: b.name, kind: b.kind, domain: b.domain };
  if (/headlesschrome|puppeteer|playwright|phantomjs/i.test(s)) return { name: "Headless browser", kind: "other" };
  if (GENERIC.test(s)) {
    // Name it after the first product token, e.g. "python-requests/2.31" → "python-requests".
    const m = /([A-Za-z][\w.-]*(?:bot|crawler|spider)[\w.-]*)/i.exec(s) || /^([\w.-]+)\//.exec(s);
    const name = m?.[1] && !/^mozilla$/i.test(m[1]) ? m[1] : "Unknown bot";
    return { name: name.slice(0, 40), kind: "other" };
  }
  return null;
}

/** Domain for a bot name (for logos in the admin). */
export function botDomain(name: string): string {
  return BOTS.find((b) => b.name === name)?.domain || "";
}
