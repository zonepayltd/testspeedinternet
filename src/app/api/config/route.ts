import { getSiteConfig, publicConfig } from "@/lib/siteConfig";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Public, non-secret config for the client (captcha site key, GA id).
export async function GET() {
  const config = await getSiteConfig();
  return Response.json(publicConfig(config), {
    headers: { "Cache-Control": "public, max-age=60" },
  });
}
