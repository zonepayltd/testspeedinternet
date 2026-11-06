// Tiny user-agent parser for the admin (device type, OS, browser). No dependency.
export type Device = "mobile" | "tablet" | "desktop" | "bot";

export function parseUA(ua = ""): { device: Device; os: string; browser: string } {
  const s = ua.toLowerCase();
  const device: Device = /bot|crawler|spider|slurp|bingpreview|headless|lighthouse/.test(s)
    ? "bot"
    : /ipad|tablet|(android(?!.*mobile))/.test(s)
      ? "tablet"
      : /mobi|iphone|ipod|android/.test(s)
        ? "mobile"
        : "desktop";
  const os = /windows/.test(s)
    ? "Windows"
    : /iphone|ipad|ipod/.test(s)
      ? "iOS"
      : /mac os x|macintosh/.test(s)
        ? "macOS"
        : /android/.test(s)
          ? "Android"
          : /cros/.test(s)
            ? "ChromeOS"
            : /linux/.test(s)
              ? "Linux"
              : "Other";
  const browser = /edg\//.test(s)
    ? "Edge"
    : /opr\/|opera/.test(s)
      ? "Opera"
      : /samsungbrowser/.test(s)
        ? "Samsung"
        : /firefox|fxios/.test(s)
          ? "Firefox"
          : /chrome|crios/.test(s)
            ? "Chrome"
            : /safari/.test(s)
              ? "Safari"
              : "Other";
  return { device, os, browser };
}

/** Search engines we recognise in referrers / visit sources. */
export { SEARCH_SOURCES as SEARCH_ENGINES } from "@/lib/sources";
