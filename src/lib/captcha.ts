// Built-in "slide the puzzle piece" captcha — no third-party service.
//
// 1. createChallenge(): draws a random landscape (PNG, generated here), cuts a
//    jigsaw-shaped piece out of it at a random spot, and returns both images +
//    an ENCRYPTED token holding the answer (the client can't read the x position).
// 2. verifyChallenge(): checks the slider position (±tolerance) and that the drag
//    looks human, then returns a short-lived single-use PASS token.
// 3. verifyPass(): the contact form / admin login API checks that pass token.
import "server-only";
import crypto from "node:crypto";
import zlib from "node:zlib";

export type CaptchaContext = "contact" | "login" | "signup" | "account" | "review";
export const CAPTCHA_CONTEXTS: readonly CaptchaContext[] = ["contact", "login", "signup", "account", "review"];

export const W = 340; // image width (px)
export const H = 170; // image height
const P = 46; // puzzle body size
const R = 9; // knob radius
const BOX = P + R + 4; // piece canvas (body + knob room)
const TOLERANCE = 5; // px
const CHALLENGE_TTL = 2 * 60_000;
const PASS_TTL = 3 * 60_000;

/* --------------------------------- crypto --------------------------------- */

const KEY = crypto
  .createHash("sha256")
  .update(
    // Must be the same for every server instance/route, so derive it from stable secrets.
    `captcha:${process.env.CAPTCHA_SECRET || process.env.ADMIN_SESSION_SECRET || process.env.FIREBASE_PRIVATE_KEY || process.env.ADMIN_PASSWORD || `dev:${process.cwd()}`}`,
  )
  .digest();

function seal(data: object): string {
  const iv = crypto.randomBytes(12);
  const c = crypto.createCipheriv("aes-256-gcm", KEY, iv);
  const enc = Buffer.concat([c.update(JSON.stringify(data), "utf8"), c.final()]);
  return Buffer.concat([iv, c.getAuthTag(), enc]).toString("base64url");
}

function open<T>(token: string): T | null {
  try {
    const raw = Buffer.from(token, "base64url");
    const d = crypto.createDecipheriv("aes-256-gcm", KEY, raw.subarray(0, 12));
    d.setAuthTag(raw.subarray(12, 28));
    return JSON.parse(Buffer.concat([d.update(raw.subarray(28)), d.final()]).toString("utf8")) as T;
  } catch {
    return null;
  }
}

// Single-use: remember spent nonces until they expire (per server instance).
// Shared via globalThis so every route bundle in the same server process sees it.
const g = globalThis as unknown as { __tsiCaptchaSpent?: Map<string, number> };
const spent = (g.__tsiCaptchaSpent ??= new Map<string, number>());
function spend(nonce: string, exp: number): boolean {
  const now = Date.now();
  if (spent.size > 5000) for (const [k, e] of spent) if (e < now) spent.delete(k);
  if (spent.has(nonce)) return false;
  spent.set(nonce, exp);
  return true;
}

/* ---------------------------------- PNG ----------------------------------- */

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf: Buffer): number {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type: string, data: Buffer): Buffer {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}
/** Encode RGBA pixels as PNG (alpha=false drops the alpha channel → smaller). */
function png(w: number, h: number, rgba: Uint8ClampedArray, alpha: boolean): string {
  const bpp = alpha ? 4 : 3;
  const stride = w * bpp;
  const raw = Buffer.alloc((stride + 1) * h);
  let prev: Buffer | null = null;
  for (let y = 0; y < h; y++) {
    const row = Buffer.alloc(stride);
    for (let x = 0; x < w; x++) {
      const s = (y * w + x) * 4;
      const d = x * bpp;
      row[d] = rgba[s];
      row[d + 1] = rgba[s + 1];
      row[d + 2] = rgba[s + 2];
      if (alpha) row[d + 3] = rgba[s + 3];
    }
    const o = y * (stride + 1);
    raw[o] = prev ? 2 : 0; // "Up" filter compresses smooth gradients well
    for (let i = 0; i < stride; i++) raw[o + 1 + i] = prev ? (row[i] - prev[i]) & 0xff : row[i];
    prev = row;
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;
  ihdr[9] = alpha ? 6 : 2;
  const file = Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", zlib.deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
  return `data:image/png;base64,${file.toString("base64")}`;
}

/* --------------------------------- artwork -------------------------------- */

type RGB = [number, number, number];
const hex = (h: string): RGB => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const mix = (a: RGB, b: RGB, t: number): RGB => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

// Each theme: sky top, sky bottom, sun, 4 mountain layers (far → near), night?
const THEMES: { sky: [string, string]; sun: string; hills: string[]; night?: boolean; water?: string }[] = [
  { sky: ["#1e3a8a", "#f59e0b"], sun: "#fde68a", hills: ["#7c3aed", "#5b21b6", "#3b0764", "#1e1b4b"] }, // sunset
  { sky: ["#0ea5e9", "#bae6fd"], sun: "#fff7d6", hills: ["#7dd3fc", "#38bdf8", "#0369a1", "#0c4a6e"], water: "#0284c7" }, // lake day
  { sky: ["#020617", "#1e3a8a"], sun: "#e0f2fe", hills: ["#1e40af", "#1e3a8a", "#172554", "#0b1120"], night: true }, // night
  { sky: ["#065f46", "#a7f3d0"], sun: "#fef9c3", hills: ["#6ee7b7", "#10b981", "#047857", "#064e3b"] }, // forest
  { sky: ["#7c2d12", "#fed7aa"], sun: "#fff7ed", hills: ["#fb923c", "#ea580c", "#9a3412", "#431407"] }, // desert
  { sky: ["#312e81", "#22d3ee"], sun: "#ecfeff", hills: ["#6366f1", "#4338ca", "#1e1b4b", "#0f172a"], night: true }, // aurora
  { sky: ["#be185d", "#fbcfe8"], sun: "#fff1f2", hills: ["#f472b6", "#db2777", "#831843", "#500724"] }, // pink dusk
];

function draw(rand: () => number): Uint8ClampedArray {
  const th = THEMES[Math.floor(rand() * THEMES.length)];
  const top = hex(th.sky[0]);
  const bottom = hex(th.sky[1]);
  const px = new Uint8ClampedArray(W * H * 4);
  const sunX = 40 + rand() * (W - 80);
  const sunY = 25 + rand() * 45;
  const sunR = 14 + rand() * 12;
  const sun = hex(th.sun);
  // mountain ridges: sum of sines with random phases
  const ridges = th.hills.map((c, i) => {
    const base = H * (0.38 + i * 0.14);
    const amp = 18 - i * 2 + rand() * 10;
    const f = [0.008 + rand() * 0.01, 0.02 + rand() * 0.02, 0.05 + rand() * 0.04];
    const ph = [rand() * 6.28, rand() * 6.28, rand() * 6.28];
    return { color: hex(c), y: (x: number) => base + amp * Math.sin(x * f[0] + ph[0]) + amp * 0.45 * Math.sin(x * f[1] + ph[1]) + 3 * Math.sin(x * f[2] + ph[2]) };
  });
  const stars = th.night ? Array.from({ length: 60 }, () => [rand() * W, rand() * H * 0.55, rand()]) : [];
  const aurora = th.night ? hex("#22d3ee") : null;

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      let c = mix(top, bottom, Math.pow(y / H, 1.2));
      // aurora band
      if (aurora) {
        const band = Math.exp(-Math.pow((y - (40 + 18 * Math.sin(x * 0.02))) / 16, 2));
        c = mix(c, aurora, band * 0.35);
      }
      // sun / moon with glow
      const d = Math.hypot(x - sunX, y - sunY);
      if (d < sunR) c = sun;
      else c = mix(c, sun, Math.max(0, 0.45 * Math.exp(-(d - sunR) / 22)));
      // hills (far → near), slight vertical shading
      for (let i = 0; i < ridges.length; i++) {
        const ry = ridges[i].y(x);
        if (y >= ry) c = mix(ridges[i].color, [0, 0, 0], Math.min(0.25, (y - ry) / 400));
      }
      // optional water reflection at the bottom
      if (th.water && y > H * 0.86) c = mix(hex(th.water), c, 0.35 + 0.15 * Math.sin(x * 0.3 + y));
      // film grain (also makes automated edge-finding harder)
      const g = (rand() - 0.5) * 10;
      const o = (y * W + x) * 4;
      px[o] = c[0] + g;
      px[o + 1] = c[1] + g;
      px[o + 2] = c[2] + g;
      px[o + 3] = 255;
    }
  }
  for (const [sx, sy, b] of stars) {
    const o = (Math.round(sy) * W + Math.round(sx)) * 4;
    const v = 170 + b * 85;
    px[o] = px[o + 1] = px[o + 2] = v;
  }
  return px;
}

/** Is (x, y) inside the jigsaw piece (coordinates relative to the piece box)? */
function inPiece(x: number, y: number): boolean {
  const bx = x;
  const by = y - R - 2; // body starts below the top knob
  const inBody = bx >= 2 && bx <= P + 2 && by >= 0 && by <= P;
  const topKnob = Math.hypot(x - (P / 2 + 2), y - (R + 2)) <= R;
  const rightKnob = Math.hypot(x - (P + 2), y - (R + 2 + P / 2)) <= R;
  const leftNotch = Math.hypot(x - 2, y - (R + 2 + P / 2)) <= R - 1;
  return ((inBody && !leftNotch) || topKnob || rightKnob) && x < BOX && y < BOX;
}

/* -------------------------------- challenge -------------------------------- */

type ChallengeData = { x: number; y: number; exp: number; n: string; ctx: CaptchaContext };
type PassData = { pass: 1; exp: number; n: string; ctx: CaptchaContext };

export function createChallenge(ctx: CaptchaContext) {
  const seed = crypto.randomBytes(4).readUInt32BE();
  let s = seed || 1;
  const rand = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;

  const img = draw(rand);
  const tx = Math.round(BOX + 20 + rand() * (W - 2 * BOX - 30)); // never at the start position
  const ty = Math.round(6 + rand() * (H - BOX - 12));
  // decoy hole elsewhere (fainter), to confuse automated solvers
  let dx = Math.round(BOX + rand() * (W - 2 * BOX));
  if (Math.abs(dx - tx) < BOX + 10) dx = tx > W / 2 ? Math.max(BOX, tx - BOX - 40) : Math.min(W - BOX - 4, tx + BOX + 40);
  const dy = Math.round(6 + rand() * (H - BOX - 12));

  // piece image (copy of the original pixels inside the jigsaw shape)
  const piece = new Uint8ClampedArray(BOX * BOX * 4);
  for (let y = 0; y < BOX; y++) {
    for (let x = 0; x < BOX; x++) {
      if (!inPiece(x, y)) continue;
      const s4 = ((ty + y) * W + (tx + x)) * 4;
      const d4 = (y * BOX + x) * 4;
      const edge = !inPiece(x - 1, y) || !inPiece(x + 1, y) || !inPiece(x, y - 1) || !inPiece(x, y + 1);
      piece[d4] = edge ? 255 : img[s4];
      piece[d4 + 1] = edge ? 255 : img[s4 + 1];
      piece[d4 + 2] = edge ? 255 : img[s4 + 2];
      piece[d4 + 3] = edge ? 235 : 255;
    }
  }
  // background with the hole (darkened + light outline) and the decoy
  const bg = new Uint8ClampedArray(img);
  const hole = (ox: number, oy: number, dark: number, line: number) => {
    for (let y = 0; y < BOX; y++) {
      for (let x = 0; x < BOX; x++) {
        if (!inPiece(x, y)) continue;
        const o = ((oy + y) * W + (ox + x)) * 4;
        const edge = !inPiece(x - 1, y) || !inPiece(x + 1, y) || !inPiece(x, y - 1) || !inPiece(x, y + 1);
        for (let k = 0; k < 3; k++) bg[o + k] = edge ? bg[o + k] + (255 - bg[o + k]) * line : bg[o + k] * dark;
      }
    }
  };
  hole(dx, dy, 0.8, 0.25);
  hole(tx, ty, 0.42, 0.7);

  const token = seal({ x: tx, y: ty, exp: Date.now() + CHALLENGE_TTL, n: crypto.randomBytes(9).toString("base64url"), ctx } satisfies ChallengeData);
  return { token, bg: png(W, H, bg, false), piece: png(BOX, BOX, piece, true), y: ty, width: W, height: H, size: BOX };
}

/** trail = [[ms since drag start, x], ...] recorded on the client. */
export function verifyChallenge(token: string, x: number, trail: unknown): { ok: true; pass: string } | { ok: false; error: string } {
  const c = open<ChallengeData>(token);
  if (!c || typeof c.x !== "number") return { ok: false, error: "invalid" };
  if (Date.now() > c.exp) return { ok: false, error: "expired" };
  if (!spend(c.n, c.exp)) return { ok: false, error: "used" };
  if (!Number.isFinite(x) || Math.abs(x - c.x) > TOLERANCE) return { ok: false, error: "mismatch" };
  if (!humanLike(trail, c.x)) return { ok: false, error: "behaviour" };
  const pass = seal({ pass: 1, exp: Date.now() + PASS_TTL, n: crypto.randomBytes(9).toString("base64url"), ctx: c.ctx } satisfies PassData);
  return { ok: true, pass };
}

/** Rough "is this a person dragging?" check on the movement trail. */
function humanLike(trail: unknown, target: number): boolean {
  if (!Array.isArray(trail) || trail.length < 4 || trail.length > 2000) return false;
  const pts = trail.filter((p): p is [number, number] => Array.isArray(p) && p.length >= 2 && p.every((v) => typeof v === "number" && Number.isFinite(v)));
  if (pts.length < 4) return false;
  const duration = pts[pts.length - 1][0] - pts[0][0];
  if (duration < 250 || duration > 60_000) return false; // too fast to be a hand, or abandoned
  // not a perfectly constant speed (scripts usually move linearly)
  const v: number[] = [];
  for (let i = 1; i < pts.length; i++) {
    const dt = pts[i][0] - pts[i - 1][0];
    if (dt > 0) v.push((pts[i][1] - pts[i - 1][1]) / dt);
  }
  if (v.length >= 3) {
    const mean = v.reduce((a, b) => a + b, 0) / v.length;
    const sd = Math.sqrt(v.reduce((a, b) => a + (b - mean) ** 2, 0) / v.length);
    if (sd < 0.002) return false;
  }
  // the trail must actually travel to (roughly) the target
  const maxX = Math.max(...pts.map((p) => p[1]));
  return maxX >= target - TOLERANCE * 3;
}

/** Check a pass token from the client (single use). */
export function verifyPass(pass: string | undefined, ctx: CaptchaContext): boolean {
  if (!pass) return false;
  const p = open<PassData>(pass);
  if (!p || p.pass !== 1 || p.ctx !== ctx || Date.now() > p.exp) return false;
  return spend(`pass:${p.n}`, p.exp);
}
