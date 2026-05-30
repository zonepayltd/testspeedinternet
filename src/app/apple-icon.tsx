import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Apple touch icon: brand gauge mark on a blue gradient tile.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
        }}
      >
        <svg width="120" height="120" viewBox="0 0 32 32" fill="none">
          <path d="M8 21a8 8 0 1 1 16 0" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" opacity="0.55" />
          <path d="M16 20.5 21 11" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="16" cy="20.5" r="2.4" fill="#fff" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
