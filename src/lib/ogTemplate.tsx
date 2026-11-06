// Shared 1200x630 social-share image layout (rendered with next/og).
export function OgCard({ eyebrow, title, footer }: { eyebrow: string; title: string; footer?: string }) {
  const size = title.length > 70 ? 54 : title.length > 45 ? 62 : 72;
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 72px",
        background: "linear-gradient(135deg, #0b1b4d 0%, #1d4ed8 55%, #0891b2 100%)",
        color: "#fff",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            background: "rgba(255,255,255,0.14)",
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
        <div style={{ display: "flex", fontSize: 30, fontWeight: 800 }}>
          Test Speed <span style={{ color: "#7dd3fc", marginLeft: 8 }}>Internet</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            alignSelf: "flex-start",
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: "uppercase",
            padding: "8px 18px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.16)",
            color: "#e0f2fe",
          }}
        >
          {eyebrow}
        </div>
        <div style={{ display: "flex", marginTop: 26, fontSize: size, fontWeight: 800, lineHeight: 1.1, maxWidth: 1000 }}>
          {title}
        </div>
      </div>

      <div style={{ display: "flex", fontSize: 24, color: "#bae6fd" }}>{footer || "testspeedinternet.com"}</div>
    </div>
  );
}
