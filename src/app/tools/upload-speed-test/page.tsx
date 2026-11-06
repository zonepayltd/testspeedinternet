import type { Metadata } from "next";
import { Upload, Gauge, Server, ArrowDownUp } from "lucide-react";
import SpeedToolPage from "@/components/SpeedToolPage";

export const metadata: Metadata = {
  title: { absolute: "Upload Speed Test: Check Your Upload Mbps Free" },
  description:
    "Free upload speed test. Measure how fast you can send data to the internet in Mbps — for video calls, backups, streaming and file sharing. Accurate and instant.",
  keywords: [
    "upload speed test",
    "test upload speed",
    "check upload speed",
    "internet upload speed",
    "mbps upload test",
    "upload speed checker",
  ],
  alternates: { canonical: "/tools/upload-speed-test" },
};

export default function Page() {
  return (
    <SpeedToolPage
      badge="Free Upload Speed Test"
      mode="upload"
      titleLead="Upload"
      titleHighlight="Speed Test"
      intro="Measure your real upload speed in megabits per second (Mbps). Press GO to see how fast you can send data to the internet — for video calls, cloud backups, live streaming and sharing files."
      sectionsHeading="About upload speed"
      sections={[
        {
          icon: Upload,
          title: "What is upload speed?",
          text: "Upload speed is how fast your connection can send data to the internet, measured in Mbps. It matters for video calls, posting content, online backups and live streaming.",
        },
        {
          icon: Gauge,
          title: "What is a good upload speed?",
          text: "3–5 Mbps handles video calls, 10 Mbps is comfortable for most uploads, and 20 Mbps or more suits creators, streamers and large cloud backups.",
        },
        {
          icon: Server,
          title: "How we measure it",
          text: "We send data through several parallel connections to a global Cloudflare server for a few seconds and calculate your true upload throughput in Mbps.",
        },
        {
          icon: ArrowDownUp,
          title: "Why upload is slower than download",
          text: "Most home plans (cable, DSL) are asymmetric, giving you far more download than upload because people download more than they send. Fiber connections are usually more balanced.",
        },
      ]}
      faqHeading="Upload speed FAQ"
      faqs={[
        {
          q: "How do I test my upload speed?",
          a: "Press the GO button above. The test measures your upload speed in Mbps within a few seconds, alongside your download speed and ping.",
        },
        {
          q: "What is a good upload speed?",
          a: "5–10 Mbps is enough for most users and video calls. Streamers, creators and people doing large cloud backups benefit from 20 Mbps or more.",
        },
        {
          q: "Why is my upload speed so low?",
          a: "Many internet plans are asymmetric and intentionally give much lower upload than download. WiFi, old hardware and congestion can lower it further. A fiber plan usually offers higher upload speeds.",
        },
      ]}
    />
  );
}
