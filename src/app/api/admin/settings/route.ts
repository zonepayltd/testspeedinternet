import { adminConfigured } from "@/lib/firebaseAdmin";
import { getSiteConfig, saveSiteConfig } from "@/lib/siteConfig";
import { requireAdmin, unauthorized } from "@/lib/requireAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await requireAdmin())) return unauthorized();
  try {
    const config = await getSiteConfig();
    return Response.json({ ok: true, config });
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
