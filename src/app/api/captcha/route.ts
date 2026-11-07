import { CAPTCHA_CONTEXTS, createChallenge, type CaptchaContext } from "@/lib/captcha";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// New slider-puzzle challenge: GET /api/captcha?ctx=contact|login|signup|account|review
export async function GET(request: Request) {
  const raw = new URL(request.url).searchParams.get("ctx") as CaptchaContext;
  const ctx: CaptchaContext = CAPTCHA_CONTEXTS.includes(raw) ? raw : "contact";
  return Response.json({ ok: true, ...createChallenge(ctx) }, { headers: { "Cache-Control": "no-store" } });
}
