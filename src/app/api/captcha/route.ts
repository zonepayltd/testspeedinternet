import { createChallenge, type CaptchaContext } from "@/lib/captcha";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// New slider-puzzle challenge: GET /api/captcha?ctx=contact|login
export async function GET(request: Request) {
  const ctx = new URL(request.url).searchParams.get("ctx") === "login" ? "login" : ("contact" as CaptchaContext);
  return Response.json({ ok: true, ...createChallenge(ctx) }, { headers: { "Cache-Control": "no-store" } });
}
