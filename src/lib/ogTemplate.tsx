// Shared 1200x630 social-share image layout (rendered with next/og).

type OgFont = { name: string; data: ArrayBuffer; weight: 400 | 700 | 800; style: "normal" };

const fontCache = new Map<string, ArrayBuffer>();

/**
 * Loads a Google Font (subset to `text`) as TTF for next/og. Returns null on any
 * failure/timeout so callers can fall back to the default font.
 */
async function loadGoogleFont(family: string, weight: number, text: string): Promise<ArrayBuffer | null> {
  const key = `${family}:${weight}:${text}`;
  const hit = fontCache.get(key);
  if (hit) return hit;
  try {
    const cssUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}&text=${encodeURIComponent(text)}`;
    const css = await (await fetch(cssUrl, { signal: AbortSignal.timeout(4000) })).text();
    const src = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/);
    if (!src) return null;
    const res = await fetch(src[1], { signal: AbortSignal.timeout(4000) });
    if (!res.ok) return null;
    const data = await res.arrayBuffer();
    if (fontCache.size > 200) fontCache.clear();
    fontCache.set(key, data);
    return data;
  } catch {
    return null;
  }
}

/**
 * Fonts for an OG card: Inter (Latin + Cyrillic), plus Cairo for Arabic.
 * (Noto Sans/Kufi Arabic use GSUB lookups satori can't parse and crash the renderer.)
 */
export async function loadOgFonts(text: string, arabic = false): Promise<OgFont[] | null> {
  const chars = Array.from(new Set(text + text.toUpperCase() + "TestSpeedInternet.com·0123456789")).join("");
  const [inter, arab] = await Promise.all([
    loadGoogleFont("Inter", 800, chars),
    arabic ? loadGoogleFont("Cairo", 800, chars) : Promise.resolve(null),
  ]);
  if (arabic && !arab) return null;
  const fonts: OgFont[] = [];
  if (inter) fonts.push({ name: "Inter", data: inter, weight: 800, style: "normal" });
  if (arab) fonts.push({ name: "Cairo", data: arab, weight: 800, style: "normal" });
  return fonts;
}

/**
 * satori has no bidi layout: Arabic runs come out in left-to-right word order.
 * Render each word as its own flex item in a row-reverse wrap so the words read
 * right-to-left, and split off trailing Arabic punctuation (؟ ، ؛), which
 * otherwise breaks the joining of the last letter.
 */
const ARABIC = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;

/** Split into display tokens: Arabic words, or runs of Latin words/numbers kept together (they read LTR). */
function rtlTokens(text: string): { core: string; punct: string }[] {
  const out: { core: string; punct: string; ltr: boolean; open: boolean }[] = [];
  for (const w of text.split(/\s+/).filter(Boolean)) {
    const m = w.match(/^(.*?)([؟،؛!?.:,]*)$/);
    const core = m?.[1] || w;
    const punct = m?.[1] ? m[2] : "";
    const ltr = !ARABIC.test(core);
    const last = out[out.length - 1];
    if (ltr && last && last.ltr && last.open) {
      last.core += ` ${core}`;
      last.punct = punct;
      last.open = !punct;
    } else {
      out.push({ core, punct, ltr, open: !punct });
    }
  }
  return out;
}

function RtlWords({ text, gap }: { text: string; gap: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "row-reverse", flexWrap: "wrap", justifyContent: "flex-start", columnGap: gap }}>
      {rtlTokens(text).map((tok, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "row-reverse" }}>
          <span>{tok.core}</span>
          {tok.punct ? <span>{tok.punct}</span> : null}
        </div>
      ))}
    </div>
  );
}

export function OgCard({
  eyebrow,
  title,
  footer,
  rtl = false,
}: {
  eyebrow: string;
  title: string;
  footer?: string;
  /** Right-align the text block (Arabic). */
  rtl?: boolean;
}) {
  const size = title.length > 70 ? 54 : title.length > 45 ? 62 : 72;
  const align = rtl ? "flex-end" : "flex-start";
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 72px",
        background: "linear-gradient(135deg, #070b16 0%, #0b1b4d 45%, #1d4ed8 100%)",
        color: "#fff",
        fontFamily: rtl ? "Cairo, Inter, sans-serif" : "Inter, sans-serif",
        position: "relative",
      }}
    >
      {/* soft glow */}
      <div
        style={{
          position: "absolute",
          top: -200,
          right: -120,
          width: 700,
          height: 700,
          borderRadius: 9999,
          background: "radial-gradient(circle, rgba(34,211,238,0.28) 0%, rgba(34,211,238,0) 65%)",
          display: "flex",
        }}
      />
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
            border: "1px solid rgba(255,255,255,0.18)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="44" height="44" viewBox="0 0 32 32" fill="none">
            <path d="M8 21a8 8 0 1 1 16 0" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" opacity="0.55" />
            <path d="M16 20.5 21 11" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
            <circle cx="16" cy="20.5" r="2.4" fill="#fff" />
          </svg>
        </div>
        <div style={{ display: "flex", fontSize: 30, fontWeight: 800, fontFamily: "Inter, sans-serif" }}>
          Test Speed <span style={{ color: "#7dd3fc", marginLeft: 8 }}>Internet</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: align }}>
        <div
          style={{
            display: "flex",
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: rtl ? 0 : 2,
            textTransform: rtl ? "none" : "uppercase",
            padding: "8px 18px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.10)",
            border: "1px solid rgba(255,255,255,0.18)",
            color: "#e0f2fe",
          }}
        >
          {rtl ? <RtlWords text={eyebrow} gap={8} /> : eyebrow}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 26,
            fontSize: size,
            fontWeight: 800,
            lineHeight: 1.12,
            letterSpacing: rtl ? 0 : -1,
            maxWidth: 1040,
            textAlign: rtl ? "right" : "left",
            justifyContent: align,
          }}
        >
          {rtl ? <RtlWords text={title} gap={Math.round(size * 0.2)} /> : title}
        </div>
      </div>

      <div style={{ display: "flex", fontSize: 24, color: "#bae6fd", fontFamily: "Inter, sans-serif" }}>
        {footer || "testspeedinternet.com"}
      </div>
    </div>
  );
}
