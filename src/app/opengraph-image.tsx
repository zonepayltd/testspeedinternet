import { ImageResponse } from "next/og";
import { OgCard } from "@/lib/ogTemplate";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Free internet speed test: download, upload and ping";

export default function Image() {
  return new ImageResponse(
    <OgCard
      eyebrow="Free · No signup · Any device"
      title="Test your internet speed in seconds: download, upload, ping & jitter"
    />,
    { ...size },
  );
}
