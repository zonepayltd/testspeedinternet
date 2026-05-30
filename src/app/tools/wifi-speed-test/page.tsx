import type { Metadata } from "next";
import { Wifi, Signal, Cable, Router } from "lucide-react";
import SpeedToolPage from "@/components/SpeedToolPage";

export const metadata: Metadata = {
  title: "WiFi Speed Test | Test Your Wireless Internet Speed Free",
  description:
    "Free WiFi speed test. Check your wireless download speed, upload speed and ping on any device, in any room. Find dead zones and see if your WiFi is fast enough.",
  keywords: [
    "wifi speed test",
    "wireless speed test",
    "test wifi speed",
    "check wifi speed",
    "wifi internet test",
    "wireless internet connection test",
  ],
  alternates: { canonical: "/tools/wifi-speed-test" },
};

export default function Page() {
  return (
    <SpeedToolPage
      badge="Free WiFi Speed Test"
      titleLead="WiFi"
      titleHighlight="Speed Test"
      intro="Test your wireless internet speed in seconds. Press GO to measure your WiFi download speed, upload speed and ping — then walk around to find dead zones and the best spot for your router."
      sectionsHeading="About WiFi speed"
      sections={[
        {
          icon: Wifi,
          title: "How to test your WiFi speed",
          text: "Connect to your WiFi, press GO, and note the result. Then repeat the test in different rooms to compare signal strength and find weak spots in your home.",
        },
        {
          icon: Signal,
          title: "Why is my WiFi slower than my plan?",
          text: "WiFi loses speed with distance, walls, interference from other devices, and older routers. The speed at your device is often lower than the speed reaching your modem.",
        },
        {
          icon: Cable,
          title: "WiFi vs wired speed",
          text: "A wired Ethernet connection is faster and more stable than WiFi. If your WiFi result is much lower than your wired result, the bottleneck is your wireless setup, not your ISP.",
        },
        {
          icon: Router,
          title: "How to improve WiFi speed",
          text: "Move closer to the router, use the 5 GHz band, reduce interference, update the firmware, or add a mesh system or extender for large homes and dead zones.",
        },
      ]}
      faqHeading="WiFi speed FAQ"
      faqs={[
        {
          q: "How do I test my WiFi speed?",
          a: "Connect your device to WiFi and press the GO button above. The test measures your wireless download, upload and ping. Repeat it in different rooms to map your coverage.",
        },
        {
          q: "What is a good WiFi speed?",
          a: "It depends on your plan, but 25–100 Mbps over WiFi is good for most households. If your WiFi result is far below your plan or your wired speed, your wireless setup is the bottleneck.",
        },
        {
          q: "How can I make my WiFi faster?",
          a: "Move closer to the router, switch to the 5 GHz band, reduce interference from other devices, update your router firmware, or add a mesh network or extender to cover dead zones.",
        },
      ]}
    />
  );
}
