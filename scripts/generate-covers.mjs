// Generates a 1200x630 SVG cover image for every article in src/content/blog
// that doesn't have one yet:  node scripts/generate-covers.mjs   (add --force to redo all)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentDir = path.join(root, "src", "content", "blog");
const outDir = path.join(root, "public", "blog");
const force = process.argv.includes("--force");
fs.mkdirSync(outDir, { recursive: true });

const THEMES = {
  "Speed Testing": ["#1e3a8a", "#2563eb", "#22d3ee"],
  "WiFi & Routers": ["#312e81", "#4f46e5", "#a78bfa"],
  "Gaming & Latency": ["#4c0519", "#be123c", "#fb923c"],
  Streaming: ["#3b0764", "#9333ea", "#f472b6"],
  "Connection Types": ["#064e3b", "#059669", "#5eead4"],
  Troubleshooting: ["#7c2d12", "#ea580c", "#fcd34d"],
  "Privacy & Security": ["#0f172a", "#334155", "#38bdf8"],
  "Remote Work": ["#134e4a", "#0d9488", "#a3e635"],
};

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function wrap(text, max) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = "";
  for (const w of words) {
    if ((line + " " + w).trim().length > max && line) {
      lines.push(line);
      line = w;
    } else line = (line + " " + w).trim();
  }
  if (line) lines.push(line);
  return lines;
}

// Simple illustrations drawn in a 360x360 box (translated to the right side).
const ART = {
  "Speed Testing": (a) => `
    <circle cx="180" cy="200" r="150" fill="none" stroke="#fff" stroke-opacity=".15" stroke-width="28"/>
    <path d="M52 250 A140 140 0 0 1 308 250" fill="none" stroke="${a}" stroke-width="28" stroke-linecap="round" stroke-dasharray="330 600"/>
    <line x1="180" y1="200" x2="270" y2="110" stroke="#fff" stroke-width="12" stroke-linecap="round"/>
    <circle cx="180" cy="200" r="20" fill="#fff"/>
    <text x="180" y="300" text-anchor="middle" font-size="44" font-weight="800" fill="#fff">Mbps</text>`,
  "WiFi & Routers": (a) => `
    <path d="M60 150 Q180 40 300 150" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="20" stroke-linecap="round"/>
    <path d="M100 195 Q180 120 260 195" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="20" stroke-linecap="round"/>
    <path d="M140 240 Q180 205 220 240" fill="none" stroke="${a}" stroke-width="20" stroke-linecap="round"/>
    <rect x="70" y="270" width="220" height="60" rx="18" fill="#fff" fill-opacity=".18"/>
    <circle cx="110" cy="300" r="8" fill="${a}"/><circle cx="140" cy="300" r="8" fill="#fff"/><circle cx="170" cy="300" r="8" fill="#fff" fill-opacity=".5"/>`,
  "Gaming & Latency": (a) => `
    <rect x="40" y="150" width="280" height="140" rx="70" fill="#fff" fill-opacity=".16"/>
    <rect x="95" y="205" width="60" height="18" rx="6" fill="#fff"/><rect x="116" y="184" width="18" height="60" rx="6" fill="#fff"/>
    <circle cx="245" cy="195" r="14" fill="${a}"/><circle cx="275" cy="225" r="14" fill="#fff"/>
    <polyline points="40,110 90,110 110,60 135,130 160,95 320,95" fill="none" stroke="${a}" stroke-width="10" stroke-linejoin="round" stroke-linecap="round"/>
    <text x="180" y="340" text-anchor="middle" font-size="40" font-weight="800" fill="#fff">12 ms</text>`,
  Streaming: (a) => `
    <rect x="30" y="70" width="300" height="190" rx="22" fill="#fff" fill-opacity=".16" stroke="#fff" stroke-opacity=".4" stroke-width="6"/>
    <path d="M155 120 L225 165 L155 210 Z" fill="#fff"/>
    <rect x="130" y="270" width="100" height="14" rx="7" fill="#fff" fill-opacity=".4"/>
    <rect x="50" y="310" width="260" height="12" rx="6" fill="#fff" fill-opacity=".2"/>
    <rect x="50" y="310" width="170" height="12" rx="6" fill="${a}"/>`,
  "Connection Types": (a) => `
    <path d="M20 90 C140 90 160 180 340 180" fill="none" stroke="${a}" stroke-width="14" stroke-linecap="round"/>
    <path d="M20 180 C140 180 200 180 340 180" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="14" stroke-linecap="round"/>
    <path d="M20 270 C140 270 160 180 340 180" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="14" stroke-linecap="round"/>
    <circle cx="20" cy="90" r="16" fill="${a}"/><circle cx="20" cy="180" r="16" fill="#fff"/><circle cx="20" cy="270" r="16" fill="#fff" fill-opacity=".5"/>
    <circle cx="330" cy="180" r="34" fill="#fff" fill-opacity=".2" stroke="#fff" stroke-width="6"/>`,
  Troubleshooting: (a) => `
    <rect x="50" y="50" width="220" height="280" rx="24" fill="#fff" fill-opacity=".16"/>
    <path d="M85 120 l18 18 34-38" fill="none" stroke="${a}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="160" y="112" width="80" height="14" rx="7" fill="#fff" fill-opacity=".7"/>
    <path d="M85 190 l18 18 34-38" fill="none" stroke="${a}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="160" y="182" width="80" height="14" rx="7" fill="#fff" fill-opacity=".7"/>
    <circle cx="105" cy="265" r="18" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="8"/>
    <rect x="160" y="252" width="80" height="14" rx="7" fill="#fff" fill-opacity=".35"/>
    <circle cx="300" cy="290" r="44" fill="${a}"/><path d="M285 290 h30 M300 275 v30" stroke="#fff" stroke-width="10" stroke-linecap="round"/>`,
  "Privacy & Security": (a) => `
    <path d="M180 40 L300 85 V180 C300 260 245 310 180 335 C115 310 60 260 60 180 V85 Z" fill="#fff" fill-opacity=".14" stroke="${a}" stroke-width="10"/>
    <rect x="135" y="170" width="90" height="75" rx="14" fill="#fff"/>
    <path d="M150 170 v-22 a30 30 0 0 1 60 0 v22" fill="none" stroke="#fff" stroke-width="12"/>
    <circle cx="180" cy="205" r="10" fill="${a}"/>`,
  "Remote Work": (a) => `
    <rect x="60" y="80" width="240" height="160" rx="16" fill="#fff" fill-opacity=".16" stroke="#fff" stroke-opacity=".5" stroke-width="6"/>
    <rect x="30" y="250" width="300" height="22" rx="11" fill="#fff" fill-opacity=".5"/>
    <circle cx="140" cy="145" r="26" fill="${a}"/><rect x="108" y="180" width="64" height="34" rx="17" fill="${a}"/>
    <circle cx="225" cy="145" r="26" fill="#fff" fill-opacity=".7"/><rect x="193" y="180" width="64" height="34" rx="17" fill="#fff" fill-opacity=".7"/>
    <path d="M120 320 q60 -30 120 0" fill="none" stroke="${a}" stroke-width="10" stroke-linecap="round"/>`,
};

function svgFor({ title, category }) {
  const [c1, c2, accent] = THEMES[category] || THEMES["Speed Testing"];
  const art = (ART[category] || ART["Speed Testing"])(accent);
  const lines = wrap(title, 21).slice(0, 4);
  const fs = lines.length > 3 ? 46 : 52;
  const startY = 315 - ((lines.length - 1) * fs * 1.15) / 2;
  const text = lines
    .map((l, i) => `<text x="72" y="${startY + i * fs * 1.15}" font-size="${fs}" font-weight="800" fill="#fff">${esc(l)}</text>`)
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" font-family="Inter, 'Segoe UI', Helvetica, Arial, sans-serif">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
      <stop stop-color="${c1}"/><stop offset=".6" stop-color="${c2}"/><stop offset="1" stop-color="${accent}" stop-opacity=".85"/>
    </linearGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#fff" stroke-opacity=".06"/></pattern>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <circle cx="1060" cy="90" r="220" fill="#fff" fill-opacity=".06"/>
  <circle cx="980" cy="560" r="160" fill="#fff" fill-opacity=".05"/>
  <rect x="72" y="70" width="${esc(category).length * 14 + 48}" height="44" rx="22" fill="#fff" fill-opacity=".16"/>
  <text x="96" y="99" font-size="20" font-weight="700" letter-spacing="2" fill="#fff">${esc(category.toUpperCase())}</text>
  ${text}
  <text x="72" y="560" font-size="24" font-weight="600" fill="#fff" fill-opacity=".75">testspeedinternet.com</text>
  <g transform="translate(790 135)">${art}</g>
</svg>
`;
}

let n = 0;
for (const file of fs.readdirSync(contentDir).filter((f) => f.endsWith(".md"))) {
  const slug = file.replace(/\.md$/, "");
  const out = path.join(outDir, `${slug}.svg`);
  if (fs.existsSync(out) && !force) continue;
  const { data } = matter(fs.readFileSync(path.join(contentDir, file), "utf8"));
  fs.writeFileSync(out, svgFor({ title: data.title || slug, category: data.category || "Speed Testing" }));
  n++;
}
console.log(`Generated ${n} cover image(s) in public/blog`);
