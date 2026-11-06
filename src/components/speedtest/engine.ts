// Measurement engine for the speed test.
// Uses Cloudflare's public speed-test backend, so it measures the REAL internet
// path (also accurate when developing on localhost).

export const CF_DOWN = "https://speed.cloudflare.com/__down";
export const CF_UP = "https://speed.cloudflare.com/__up";

export type StageKind = "download" | "upload";
export type ErrorCode = "network" | "download" | "upload" | "generic";

/** Thrown when a stage can't produce a meaningful result. */
export class SpeedTestError extends Error {
  code: ErrorCode;
  constructor(code: ErrorCode) {
    super(code);
    this.code = code;
  }
}

/** Thrown when the user stops the test (or the component unmounts). */
export class AbortedError extends Error {
  constructor() {
    super("aborted");
  }
}

/** Sleep that wakes up early when `signal` aborts. */
export function wait(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    if (signal?.aborted) return resolve();
    const t = setTimeout(done, ms);
    function done() {
      clearTimeout(t);
      signal?.removeEventListener("abort", done);
      resolve();
    }
    signal?.addEventListener("abort", done, { once: true });
  });
}

/** A child AbortController that also aborts when `parent` aborts (AbortSignal.any isn't everywhere yet). */
function linked(parent: AbortSignal, timeoutMs?: number) {
  const ctrl = new AbortController();
  const onAbort = () => ctrl.abort();
  if (parent.aborted) ctrl.abort();
  else parent.addEventListener("abort", onAbort, { once: true });
  const timer = timeoutMs ? setTimeout(() => ctrl.abort(), timeoutMs) : undefined;
  return {
    ctrl,
    signal: ctrl.signal,
    dispose() {
      if (timer) clearTimeout(timer);
      parent.removeEventListener("abort", onAbort);
    },
  };
}

function throwIfAborted(signal: AbortSignal) {
  if (signal.aborted) throw new AbortedError();
}

// ---------------------------------------------------------------------------
// Latency
// ---------------------------------------------------------------------------

export type PingResult = { ping: number; jitter: number; samples: number[] };

/**
 * Ping = fastest of 8 zero-byte round trips (after one warm-up request that
 * opens the connection). Jitter = mean absolute deviation from the average.
 */
export async function measurePing(opts: {
  signal: AbortSignal;
  onSample?: (ms: number, samples: number[]) => void;
  onColo?: (colo: string) => void;
  count?: number;
}): Promise<PingResult> {
  const { signal, onSample, onColo, count = 8 } = opts;

  // Warm-up: DNS + TLS + connection setup shouldn't count as latency.
  {
    const l = linked(signal, 6000);
    try {
      const res = await fetch(`${CF_DOWN}?bytes=0&warmup=1&t=${performance.now()}`, {
        cache: "no-store",
        signal: l.signal,
      });
      const colo = res.headers.get("cf-meta-colo");
      if (colo) onColo?.(colo);
    } catch {
      /* ignore — the samples below decide whether the network works */
    } finally {
      l.dispose();
    }
  }
  throwIfAborted(signal);

  const samples: number[] = [];
  for (let i = 0; i < count; i++) {
    throwIfAborted(signal);
    const l = linked(signal, 4000);
    const t0 = performance.now();
    try {
      const res = await fetch(`${CF_DOWN}?bytes=0&n=${i}&t=${t0}`, {
        cache: "no-store",
        signal: l.signal,
      });
      const rtt = performance.now() - t0;
      const colo = res.headers.get("cf-meta-colo");
      if (colo) onColo?.(colo);
      samples.push(rtt);
      onSample?.(rtt, samples.slice());
    } catch {
      continue;
    } finally {
      l.dispose();
    }
  }
  throwIfAborted(signal);
  if (samples.length === 0) throw new SpeedTestError("network");

  const min = Math.min(...samples);
  // Jitter = average change between consecutive round trips (the usual
  // definition, as in RFC 3550). Samples far above the median — a stray
  // reconnect or browser hiccup — are dropped so one blip can't dominate.
  const sorted = [...samples].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];
  const clean = samples.filter((s) => s <= Math.max(median * 2.5, median + 50));
  let jitter = 0;
  if (clean.length > 1) {
    let sum = 0;
    for (let i = 1; i < clean.length; i++) sum += Math.abs(clean[i] - clean[i - 1]);
    jitter = sum / (clean.length - 1);
  }
  return { ping: min, jitter, samples };
}

// ---------------------------------------------------------------------------
// Throughput
// ---------------------------------------------------------------------------

const DOWNLOAD_MS = 8000;
const UPLOAD_MS = 6000;
const WARMUP_MS = 1500;
const SAMPLE_MS = 200;
const MAX_FAILURES = 6;

// Upload payload: one random buffer, sliced into right-sized requests.
const UPLOAD_MIN = 256 * 1024;
const UPLOAD_START = 1024 * 1024;
const UPLOAD_MAX = 8 * 1024 * 1024;
const UPLOAD_TARGET_S = 1; // aim for ~1 s per request so slow links never stall

let uploadBlob: Blob | null = null;
function getUploadBlob(): Blob {
  if (uploadBlob) return uploadBlob;
  const buf = new Uint8Array(UPLOAD_MAX);
  // Random (incompressible) data; getRandomValues is limited to 64 KiB per call.
  for (let off = 0; off < buf.length; off += 65536) {
    crypto.getRandomValues(buf.subarray(off, Math.min(off + 65536, buf.length)));
  }
  // No explicit type → no Content-Type header → a CORS "simple request"
  // (avoids an OPTIONS preflight that makes uploads fail).
  uploadBlob = new Blob([buf]);
  return uploadBlob;
}

/**
 * Saturate the link with parallel streams for a fixed time and report Mbps.
 * The first 1.5 s (TCP slow start) is excluded from the final figure.
 * `onSample` receives a live throughput estimate every 200 ms.
 */
export async function measureThroughput(
  kind: StageKind,
  opts: {
    signal: AbortSignal;
    onSample?: (mbps: number) => void;
    onColo?: (colo: string) => void;
  }
): Promise<number> {
  const { signal, onSample, onColo } = opts;
  throwIfAborted(signal);

  const durationMs = kind === "download" ? DOWNLOAD_MS : UPLOAD_MS;
  const streams = kind === "download" ? 5 : 3;
  // Hard-stop for all in-flight requests (user abort, or grace period over).
  const hard = linked(signal);

  let bytes = 0;
  let stop = false;
  let failures = 0;
  const start = performance.now();
  let warmed = false;
  let warmupBytes = 0;
  let warmupTime = start;
  let stopTime = 0;

  const payload = kind === "upload" ? getUploadBlob() : null;

  const downloadLoop = async (idx: number) => {
    while (!stop) {
      try {
        const res = await fetch(`${CF_DOWN}?bytes=25000000&r=${start}-${idx}-${performance.now()}`, {
          cache: "no-store",
          signal: hard.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const colo = res.headers.get("cf-meta-colo");
        if (colo) onColo?.(colo);
        if (!res.body) {
          const b = await res.arrayBuffer();
          if (!stop) bytes += b.byteLength;
          continue;
        }
        const reader = res.body.getReader();
        try {
          while (!stop) {
            const { done, value } = await reader.read();
            if (done || stop) break; // bytes that arrive after the stop don't count
            bytes += value.byteLength;
          }
        } finally {
          reader.cancel().catch(() => {});
        }
      } catch {
        if (stop || hard.signal.aborted) break;
        if (++failures > MAX_FAILURES) break;
        await wait(300, hard.signal);
      }
    }
  };

  const uploadLoop = async () => {
    let size = UPLOAD_START;
    while (!stop) {
      try {
        const body = payload!.slice(0, size); // slice() without a type keeps it typeless
        const t0 = performance.now();
        const res = await fetch(CF_UP, { method: "POST", body, cache: "no-store", signal: hard.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        bytes += size;
        // Right-size the next request so each takes about UPLOAD_TARGET_S.
        const secs = Math.max((performance.now() - t0) / 1000, 0.001);
        const next = (size / secs) * UPLOAD_TARGET_S;
        size = Math.round(Math.min(UPLOAD_MAX, Math.max(UPLOAD_MIN, Math.min(next, size * 4))));
      } catch {
        if (stop || hard.signal.aborted) break;
        if (++failures > MAX_FAILURES) break;
        await wait(300, hard.signal);
      }
    }
  };

  const loops = Array.from({ length: streams }, (_, i) =>
    kind === "download" ? downloadLoop(i) : uploadLoop()
  );

  // Live estimate. Download streams continuously, so a ~1 s sliding window is
  // smooth; upload bytes land per request, so use the running average instead.
  const history: { t: number; b: number }[] = [{ t: start, b: 0 }];
  const interval = setInterval(() => {
    const now = performance.now();
    if (!warmed && now - start >= WARMUP_MS) {
      warmed = true;
      warmupBytes = bytes;
      warmupTime = now;
    }
    history.push({ t: now, b: bytes });
    while (history.length > 2 && now - history[0].t > 1000) history.shift();
    let mbps: number;
    if (kind === "download") {
      const first = history[0];
      const dt = (now - first.t) / 1000;
      mbps = dt > 0 ? ((bytes - first.b) * 8) / dt / 1e6 : 0;
    } else {
      const fromB = warmed && bytes > warmupBytes ? warmupBytes : 0;
      const fromT = warmed && bytes > warmupBytes ? warmupTime : start;
      const dt = (now - fromT) / 1000;
      mbps = dt > 0 ? ((bytes - fromB) * 8) / dt / 1e6 : 0;
    }
    if (Number.isFinite(mbps)) onSample?.(mbps);
  }, SAMPLE_MS);

  try {
    await wait(durationMs, signal);
    stop = true;
    stopTime = performance.now();
    clearInterval(interval);
    throwIfAborted(signal);

    if (kind === "upload") {
      // Let in-flight uploads finish (their bytes count) — but never hang.
      const grace = wait(2500).then(() => hard.ctrl.abort());
      await Promise.race([Promise.allSettled(loops), grace]);
    } else {
      hard.ctrl.abort();
    }
    await Promise.allSettled(loops);
    throwIfAborted(signal);
  } finally {
    stop = true;
    clearInterval(interval);
    hard.ctrl.abort();
    hard.dispose();
  }

  // Download stops counting at the stop flag; upload counts requests that
  // complete during the grace period, so its window ends when they settle.
  const end = kind === "download" ? stopTime : performance.now();
  let useBytes = warmed ? bytes - warmupBytes : bytes;
  let useTime = (warmed ? end - warmupTime : end - start) / 1000;
  // Fallback: if nothing completed after warm-up (very slow link), use the
  // whole run so it still reports a real figure instead of 0.
  if (useBytes <= 0) {
    useBytes = bytes;
    useTime = (end - start) / 1000;
  }
  if (bytes <= 0) throw new SpeedTestError(kind);
  const mbps = useTime > 0 ? (useBytes * 8) / useTime / 1e6 : 0;
  return Number.isFinite(mbps) ? mbps : 0;
}
