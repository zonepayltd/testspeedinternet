import { adminConfigured } from "@/lib/firebaseAdmin";
import { getSiteConfig, saveSiteConfig, type SiteConfig } from "@/lib/siteConfig";
import { requireAdmin, unauthorized } from "@/lib/requireAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET            → { ok, config, env }
// GET ?check=1   → { ok, checks } — fetches the live home page + /ads.txt and
//                  reports whether each configured tag is actually served.
export async function GET(request: Request) {
  if (!(await requireAdmin())) return unauthorized();
  try {
    const config = await getSiteConfig();
    if (new URL(request.url).searchParams.get("check")) return Response.json({ ok: true, checks: await liveChecks(request, config) });
    return Response.json({
      ok: true,
      config,
      env: {
        firebase: adminConfigured,
        turnstileSiteKeyFromEnv: Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY),
        turnstileSecretFromEnv: Boolean(process.env.TURNSTILE_SECRET_KEY),
      },
    });
  } catch (err) {
    return Response.json(
      { ok: false, error: err instanceof Error ? err.message : "Failed to load settings" },
      { status: 200 }
    );
  }
}

export async function PUT(request: Request) {
  if (!(await requireAdmin())) return unauthorized();
  if (!adminConfigured) return Response.json({ ok: false, error: "Firebase not configured" }, { status: 200 });

  let b: Record<string, unknown>;
  try {
    b = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }

  const str = (v: unknown) => String(v ?? "").trim();
  const bool = (v: unknown) => v === true || v === "true";
  try {
    await saveSiteConfig({
    googleVerification: str(b.googleVerification),
    bingVerification: str(b.bingVerification),
    gaMeasurementId: str(b.gaMeasurementId),
    turnstileSiteKey: str(b.turnstileSiteKey),
    turnstileSecret: str(b.turnstileSecret),
    appGooglePlay: str(b.appGooglePlay),
    appApple: str(b.appApple),
    appAmazon: str(b.appAmazon),
    appApk: str(b.appApk),
    adsenseClient: str(b.adsenseClient),
    adsEnabled: bool(b.adsEnabled),
    adsPersonalized: bool(b.adsPersonalized),
    adTopSlot: str(b.adTopSlot),
    adInContentSlot: str(b.adInContentSlot),
    adSidebarLeftSlot: str(b.adSidebarLeftSlot),
    adSidebarRightSlot: str(b.adSidebarRightSlot),
      adFooterSlot: str(b.adFooterSlot),
      socials: Array.isArray(b.socials)
        ? (b.socials as unknown[])
            .map((s) => {
              const o = (s || {}) as Record<string, unknown>;
              return { platform: str(o.platform) || "website", url: str(o.url) };
            })
            .filter((s) => s.url)
        : [],
      trustpilotUrl: str(b.trustpilotUrl),
      trustpilotBusinessId: str(b.trustpilotBusinessId),
    });
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json(
      { ok: false, error: err instanceof Error ? err.message : "Failed to save settings" },
      { status: 200 }
    );
  }
}

type Check = { configured: boolean; found: boolean | null };

async function liveChecks(request: Request, c: SiteConfig): Promise<{ fetchedFrom: string; error?: string; [k: string]: Check | string | undefined }> {
  const origin = new URL(request.url).origin;
  let html = "";
  let adsTxt = "";
  let error: string | undefined;
  try {
    const [h, a] = await Promise.all([
      fetch(`${origin}/`, { cache: "no-store", signal: AbortSignal.timeout(8000) }).then((r) => r.text()),
      fetch(`${origin}/ads.txt`, { cache: "no-store", signal: AbortSignal.timeout(8000) }).then((r) => r.text()),
    ]);
    html = h;
    adsTxt = a;
  } catch (err) {
    error = err instanceof Error ? err.message : "Could not fetch the site";
  }
  const has = (v: string) => (v ? (error ? null : html.includes(v)) : null);
  const pub = c.adsenseClient.replace(/^ca-/, "");
  return {
    fetchedFrom: origin,
    ...(error ? { error } : {}),
    google: { configured: Boolean(c.googleVerification), found: has(c.googleVerification) },
    bing: { configured: Boolean(c.bingVerification), found: has(c.bingVerification) },
    analytics: { configured: Boolean(c.gaMeasurementId), found: has(c.gaMeasurementId) },
    adsense: { configured: Boolean(c.adsenseClient), found: has(c.adsenseClient) },
    adsTxt: { configured: Boolean(pub), found: pub ? (error ? null : adsTxt.includes(pub)) : null },
  };
}
