// Builds the hero backgrounds: a dotted world map with glowing connection arcs
// between major cities, in a dark and a light colour scheme.
//   node scripts/generate-hero.mjs <path/to/ne_110m_land.geojson>
// Land shapes: Natural Earth (public domain), https://www.naturalearthdata.com
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = process.argv[2];
if (!src) {
  console.error("Usage: node scripts/generate-hero.mjs <ne_110m_land.geojson>");
  process.exit(1);
}
const land = JSON.parse(fs.readFileSync(src, "utf8"));

const W = 1600;
const LAT_TOP = 76;
const LAT_BOTTOM = -56;
const PX = W / 360; // px per degree
const MAP_Y = 110; // top of the map inside the 1600x900 canvas
const H = 900;
const STEP = 1.75; // degrees between dots

const X = (lon) => ((lon + 180) / 360) * W;
const Y = (lat) => MAP_Y + (LAT_TOP - lat) * PX;

// --- point in polygon (ray casting) over all land polygons ---
const polys = [];
for (const f of land.features) {
  const g = f.geometry;
  const list = g.type === "Polygon" ? [g.coordinates] : g.coordinates;
  for (const p of list) {
    const ring = p[0];
    let minX = 180, maxX = -180, minY = 90, maxY = -90;
    for (const [x, y] of ring) {
      minX = Math.min(minX, x); maxX = Math.max(maxX, x);
      minY = Math.min(minY, y); maxY = Math.max(maxY, y);
    }
    polys.push({ ring, holes: p.slice(1), minX, maxX, minY, maxY });
  }
}
function inRing(x, y, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}
const isLand = (lon, lat) =>
  polys.some(
    (p) => lon >= p.minX && lon <= p.maxX && lat >= p.minY && lat <= p.maxY && inRing(lon, lat, p.ring) && !p.holes.some((h) => inRing(lon, lat, h)),
  );

// deterministic pseudo-random so the output is stable between runs
let seed = 7;
const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

const dots = [];
for (let lat = LAT_TOP - STEP / 2; lat > LAT_BOTTOM; lat -= STEP) {
  for (let lon = -180 + STEP / 2; lon < 180; lon += STEP) {
    if (isLand(lon, lat)) dots.push([+X(lon).toFixed(1), +Y(lat).toFixed(1), rand()]);
  }
}

// --- cities + connections (one city per site language, plus major hubs) ---
const C = {
  ny: [-74, 40.7], sf: [-122.4, 37.8], sp: [-46.6, -23.5], lon: [-0.1, 51.5], par: [2.35, 48.85],
  mad: [-3.7, 40.4], cas: [-7.6, 33.6], lag: [3.4, 6.5], dxb: [55.3, 25.2], ruh: [46.7, 24.7],
  mow: [37.6, 55.75], bom: [72.9, 19], sin: [103.8, 1.35], tyo: [139.7, 35.7], syd: [151.2, -33.9], jnb: [28, -26.2],
};
const LINKS = [
  ["sf", "ny"], ["ny", "lon"], ["ny", "sp"], ["lon", "par"], ["par", "mow"], ["mad", "cas"], ["lon", "mad"],
  ["cas", "lag"], ["par", "dxb"], ["ruh", "dxb"], ["dxb", "bom"], ["bom", "sin"], ["sin", "tyo"], ["sin", "syd"],
  ["lag", "jnb"], ["sp", "mad"], ["mow", "tyo"], ["dxb", "jnb"],
];
const arcs = LINKS.map(([a, b], i) => {
  const [x1, y1] = [X(C[a][0]), Y(C[a][1])];
  const [x2, y2] = [X(C[b][0]), Y(C[b][1])];
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  // lift the control point "up" (perpendicular) for a nice arc
  let nx = -dy / len, ny = dx / len;
  if (ny > 0) { nx = -nx; ny = -ny; }
  const lift = Math.min(160, len * 0.32);
  const cx = (x1 + x2) / 2 + nx * lift, cy = (y1 + y2) / 2 + ny * lift;
  return { d: `M${x1.toFixed(1)} ${y1.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`, delay: (i * 0.53) % 6, len };
});

function svg(theme) {
  const dark = theme === "dark";
  const dot = dark ? "#5b8cff" : "#2563eb";
  const dotMin = dark ? 0.16 : 0.13;
  const dotVar = dark ? 0.26 : 0.17;
  const arcBase = dark ? "rgba(96,165,250,0.22)" : "rgba(37,99,235,0.16)";
  const glow = dark ? "#67e8f9" : "#0ea5e9";
  const city = dark ? "#a5f3fc" : "#2563eb";

  const dotsSvg = dots
    .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r > 0.93 ? 2.1 : 1.55}" fill-opacity="${(dotMin + r * dotVar).toFixed(2)}"/>`)
    .join("");
  const arcsSvg = arcs
    .map(
      (a) =>
        `<path d="${a.d}" stroke="${arcBase}" stroke-width="1"/>` +
        `<path class="pulse" d="${a.d}" pathLength="100" stroke="url(#arc)" stroke-width="${dark ? 2 : 1.8}" style="animation-delay:-${a.delay.toFixed(2)}s"/>`,
    )
    .join("");
  const citiesSvg = Object.values(C)
    .map(([lon, lat], i) => {
      const x = X(lon).toFixed(1), y = Y(lat).toFixed(1);
      return `<circle class="ring" cx="${x}" cy="${y}" r="9" style="animation-delay:-${((i * 0.41) % 3).toFixed(2)}s"/><circle cx="${x}" cy="${y}" r="5" fill="${glow}" fill-opacity="${dark ? 0.25 : 0.18}"/><circle cx="${x}" cy="${y}" r="2.6" fill="${city}"/>`;
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">
<defs>
<linearGradient id="arc" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${glow}" stop-opacity="0"/><stop offset=".5" stop-color="${glow}"/><stop offset="1" stop-color="${dark ? "#818cf8" : "#6366f1"}" stop-opacity=".2"/></linearGradient>
</defs>
<style>
.pulse{fill:none;stroke-linecap:round;stroke-dasharray:14 86;animation:flow 6s linear infinite}
.ring{fill:none;stroke:${glow};stroke-width:1.2;opacity:0;transform-box:fill-box;transform-origin:center;animation:ring 3s ease-out infinite}
@keyframes flow{from{stroke-dashoffset:100}to{stroke-dashoffset:0}}
@keyframes ring{0%{opacity:.7;transform:scale(.4)}100%{opacity:0;transform:scale(1.8)}}
@media (prefers-reduced-motion:reduce){.pulse,.ring{animation:none}.ring{opacity:0}}
</style>
<g fill="${dot}">${dotsSvg}</g>
<g fill="none">${arcsSvg}</g>
<g>${citiesSvg}</g>
</svg>`;
}

const out = path.join(root, "public", "hero");
fs.mkdirSync(out, { recursive: true });
for (const theme of ["dark", "light"]) {
  const file = path.join(out, `world-${theme}.svg`);
  fs.writeFileSync(file, svg(theme));
  console.log(`${file}  ${(fs.statSync(file).size / 1024).toFixed(0)} KB, ${dots.length} dots, ${arcs.length} arcs`);
}
