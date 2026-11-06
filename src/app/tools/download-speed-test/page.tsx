import type { Metadata } from "next";
import { Download, Gauge, Server, Lightbulb } from "lucide-react";
import SpeedToolPage from "@/components/SpeedToolPage";

export const metadata: Metadata = {
  title: { absolute: "Download Speed Test: Check Your Mbps Free & Fast" },
  description:
    "Free download speed test. Measure how fast you can download data from the internet in Mbps, on any device, in seconds. Accurate, real-time and no app needed.",
  keywords: [
    "download speed test",
    "test download speed",
    "check download speed",
    "download speed checker",
    "internet download speed",
    "mbps download test",
  ],
  alternates: { canonical: "/tools/download-speed-test" },
};

export default function Page() {
  return (
    <SpeedToolPage
      badge="Free Download Speed Test"
      mode="download"
      titleLead="Download"
      titleHighlight="Speed Test"
      intro="Measure your real download speed in megabits per second (Mbps). Press GO to see how fast you can pull data from the internet — for streaming, browsing, gaming and downloads."
      sectionsHeading="About download speed"
      sections={[
        {
          icon: Download,
          title: "What is download speed?",
          text: "Download speed is how fast your connection can receive data from the internet, measured in Mbps. It affects streaming quality, page loading, file downloads and video calls.",
        },
        {
          icon: Gauge,
          title: "What is a good download speed?",
          text: "5–10 Mbps is fine for browsing, 25 Mbps for HD streaming, and 100 Mbps or more is ideal for 4K, gaming and busy households with many devices.",
        },
        {
          icon: Server,
          title: "How we measure it",
          text: "We open several parallel connections to a global Cloudflare server and transfer data for a few seconds, then calculate your true download throughput in Mbps.",
        },
        {
          icon: Lightbulb,
          title: "Tips for an accurate test",
          text: "Test on a wired connection if possible, pause other downloads and streaming, and keep this tab open while the test runs for the most reliable result.",
        },
      ]}
      faqHeading="Download speed FAQ"
      faqs={[
        {
          q: "How do I test my download speed?",
          a: "Just press the GO button above. The test will measure your download speed in Mbps in a few seconds, along with your upload speed and ping.",
        },
        {
          q: "Why is my download speed slower than my plan?",
          a: "WiFi interference, distance from the router, old hardware, VPNs, background downloads and peak-hour congestion can all reduce your measured download speed. Test on a wired connection for the most accurate result.",
        },
        {
          q: "What is a good download speed?",
          a: "For most homes 25–100 Mbps is good. Heavy users, 4K streaming and gaming benefit from 100–500 Mbps, while light browsing works on 5–10 Mbps.",
        },
      ]}
    />
  );
}
