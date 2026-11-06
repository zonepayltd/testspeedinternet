// Small local history of recent results (this browser only, never sent anywhere).

export type HistoryEntry = {
  t: number; // timestamp (ms)
  mode: "full" | "download" | "upload" | "ping";
  download: number | null;
  upload: number | null;
  ping: number | null;
  jitter: number | null;
};

const KEY = "tsi:speedtest:history:v1";
const MAX = 5;

const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : null);

export function loadHistory(): HistoryEntry[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data
      .filter((e) => e && typeof e.t === "number")
      .map((e) => ({
        t: e.t,
        mode: ["full", "download", "upload", "ping"].includes(e.mode) ? e.mode : "full",
        download: num(e.download),
        upload: num(e.upload),
        ping: num(e.ping),
        jitter: num(e.jitter),
      }))
      .slice(0, MAX);
  } catch {
    return [];
  }
}

export function saveHistory(list: HistoryEntry[]): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX)));
  } catch {
    /* storage full / blocked — history is a nicety */
  }
}

export function addToHistory(entry: HistoryEntry): HistoryEntry[] {
  const next = [entry, ...loadHistory()].slice(0, MAX);
  saveHistory(next);
  return next;
}

export function clearHistory(): void {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
