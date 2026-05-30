import type { Metadata } from "next";
import { Zap, Activity, Gauge, Cable } from "lucide-react";
import SpeedToolPage from "@/components/SpeedToolPage";

export const metadata: Metadata = {
  title: "Ping & Latency Test | Check Your Ping and Jitter Free",
  description:
    "Free ping and latency test. Measure your connection's response time (ping) and jitter in milliseconds — essential for gaming, video calls and live streaming.",
  keywords: [
    "ping test",
    "latency test",
    "ping checker",
    "test my ping",
    "jitter test",
    "internet latency test",
    "ping and latency",
  ],
  alternates: { canonical: "/tools/ping-test" },
};

export default function Page() {
  return (
    <SpeedToolPage
      badge="Free Ping & Latency Test"
      mode="ping"
      titleLead="Ping & Latency"
      titleHighlight="Test"
      intro="Measure your connection's ping and jitter in milliseconds (ms). Press GO to check your latency — the response time that matters most for online gaming, video calls and live streaming."
      sectionsHeading="About ping, latency and jitter"
      sections={[
        {
          icon: Zap,
          title: "What is ping / latency?",
          text: "Ping (latency) is the time it takes for data to travel from your device to a server and back, measured in milliseconds. Lower is better, as it makes everything feel more responsive.",
        },
        {
          icon: Activity,
          title: "What is jitter?",
          text: "Jitter is the variation in your ping over time. High jitter causes lag spikes, stutter in video calls and rubber-banding in games, even when your speed looks fine.",
        },
        {
          icon: Gauge,
          title: "What is a good ping?",
          text: "Under 20 ms is excellent, 20–50 ms is good for gaming, 50–100 ms is fine for browsing, and over 150 ms can feel laggy in real-time apps.",
        },
        {
          icon: Cable,
          title: "How to lower your ping",
          text: "Use a wired Ethernet connection, close bandwidth-heavy apps, choose nearby servers, and avoid WiFi interference. A wired link almost always lowers latency and jitter.",
        },
      ]}
      faqHeading="Ping & latency FAQ"
      faqs={[
        {
          q: "How do I test my ping?",
          a: "Press the GO button above. The test measures your ping and jitter in milliseconds within seconds, alongside your download and upload speed.",
        },
        {
          q: "What is a good ping for gaming?",
          a: "Under 20 ms is excellent and 20–50 ms is good for online gaming. Above 100 ms you may notice lag, and above 150 ms fast-paced games feel unresponsive.",
        },
        {
          q: "What causes high ping and jitter?",
          a: "WiFi interference, long distance to the server, network congestion, old routers and background downloads all raise ping and jitter. A wired connection is the most effective fix.",
        },
      ]}
    />
  );
}
