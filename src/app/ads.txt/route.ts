import { getSiteConfig } from "@/lib/siteConfig";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Serves /ads.txt from the AdSense publisher ID set in Settings.
export async function GET() {
  const cfg = await getSiteConfig();
  const client = cfg.adsenseClient.trim(); // ca-pub-XXXXXXXXXXXXXXXX
  const pub = client.replace(/^ca-/, ""); // pub-XXXXXXXXXXXXXXXX

  const body = pub
    ? `google.com, ${pub}, DIRECT, f08c47fec0942fa0\n`
    : "# Set your AdSense Publisher ID in the admin settings to populate ads.txt\n";

  return new Response(body, {
    status: 200,
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=300" },
  });
}
