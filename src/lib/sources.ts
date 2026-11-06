// Where a visit came from. Shared by the tracker, the admin APIs and the admin UI.

export const SEARCH_SOURCES = ["Google", "Bing", "DuckDuckGo", "Yahoo", "Yandex", "Baidu", "Ecosia", "Brave", "Naver", "Seznam", "Qwant", "Startpage", "Mojeek"] as const;
export const SEARCH = new Set<string>(SEARCH_SOURCES);

export type SourceKind = "search" | "social" | "ai" | "direct" | "referral";
export const KIND_LABEL: Record<SourceKind | string, string> = { search: "Search engines", social: "Social", ai: "AI assistants", direct: "Direct", referral: "Other websites" };

export function sourceKind(s: string): SourceKind {
  if (SEARCH.has(s)) return "search";
  if (!s || s === "Direct" || s === "Internal") return "direct";
  if (/chatgpt|openai|perplexity|gemini|copilot|claude|you\.com|poe\.com|deepseek|grok/i.test(s)) return "ai";
  if (/facebook|instagram|twitter|^x$|t\.co|reddit|linkedin|tiktok|youtube|pinterest|telegram|whatsapp|vk\.com|snapchat|quora|threads/i.test(s)) return "social";
  return "referral";
}

/** Referrer URL → a readable source name ("Google", "Facebook", "example.com", "Direct", "Internal"). */
export function sourceFromReferrer(ref: string, selfHost: string): string {
  if (!ref) return "Direct";
  try {
    const h = new URL(ref).hostname.replace(/^www\./, "").toLowerCase();
    const self = selfHost.replace(/^www\./, "").toLowerCase();
    if (self && (h === self || h.endsWith(`.${self}`))) return "Internal";
    if (/gemini\.google|bard\.google/.test(h)) return "Gemini";
    if (/(^|\.)google\.|googleusercontent\.com$|^android-app/.test(h)) return "Google";
    if (/(^|\.)bing\.com$|^cn\.bing|msn\.com$/.test(h)) return "Bing";
    if (/duckduckgo/.test(h)) return "DuckDuckGo";
    if (/(^|\.)yahoo\./.test(h)) return "Yahoo";
    if (/(^|\.)yandex\.|ya\.ru$/.test(h)) return "Yandex";
    if (/(^|\.)baidu\.com$/.test(h)) return "Baidu";
    if (/ecosia\.org$/.test(h)) return "Ecosia";
    if (/search\.brave\.com$/.test(h)) return "Brave";
    if (/naver\.com$/.test(h)) return "Naver";
    if (/seznam\.cz$/.test(h)) return "Seznam";
    if (/qwant\.com$/.test(h)) return "Qwant";
    if (/startpage\.com$/.test(h)) return "Startpage";
    if (/mojeek\.com$/.test(h)) return "Mojeek";
    if (/chatgpt\.com$|openai\.com$/.test(h)) return "ChatGPT";
    if (/perplexity\.ai$/.test(h)) return "Perplexity";
    if (/copilot\.microsoft\.com$/.test(h)) return "Copilot";
    if (/claude\.ai$/.test(h)) return "Claude";
    if (/facebook|fb\.com|fb\.me/.test(h)) return "Facebook";
    if (/^t\.co$|twitter\.com$|^x\.com$/.test(h)) return "Twitter/X";
    if (/instagram/.test(h)) return "Instagram";
    if (/linkedin|lnkd\.in/.test(h)) return "LinkedIn";
    if (/reddit/.test(h)) return "Reddit";
    if (/youtube\.com$|youtu\.be$/.test(h)) return "YouTube";
    if (/tiktok/.test(h)) return "TikTok";
    if (/^t\.me$|telegram/.test(h)) return "Telegram";
    if (/whatsapp/.test(h)) return "WhatsApp";
    if (/pinterest/.test(h)) return "Pinterest";
    return h;
  } catch {
    return "Direct";
  }
}
