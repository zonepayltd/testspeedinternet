import { adminDb, adminConfigured } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Serves /ads.txt from the AdSense publisher ID saved in Admin → Settings → Ads.
// Read fresh on every request (no in-memory cache), so a new ID shows up at once.
// If the database can't be reached we answer 503 (crawlers retry later) instead of
// an empty file, which AdSense would treat as "ads.txt missing your publisher".
export async function GET() {
  let client = "";
  if (adminConfigured) {
    try {
      const doc = await adminDb().collection("config").doc("site").get();
      client = String(doc.get("adsenseClient") || "").trim();
    } catch {
      return new Response("# Temporarily unavailable, please retry\n", {
        status: 503,
        headers: { "Content-Type": "text/plain; charset=utf-8", "Retry-After": "120", "Cache-Control": "no-store" },
      });
    }
  }
  const pub = (/pub-\d{10,20}/.exec(client) || [""])[0]; // pub-XXXXXXXXXXXXXXXX

  const body = pub
    ? `google.com, ${pub}, DIRECT, f08c47fec0942fa0\n`
    : "# Set your AdSense Publisher ID in Admin > Settings > Ads to populate ads.txt\n";

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=60, s-maxage=120, stale-while-revalidate=600",
    },
  });
}
