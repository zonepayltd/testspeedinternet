import { verifyChallenge } from "@/lib/captcha";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Check the slider answer: POST { token, x, trail } -> { ok, pass } (pass = single-use token for the form)
export async function POST(request: Request) {
  let b: { token?: string; x?: number; trail?: unknown };
  try {
    b = await request.json();
  } catch {
    return Response.json({ ok: false, error: "invalid" }, { status: 400 });
  }
  const res = verifyChallenge(String(b.token || ""), Number(b.x), b.trail);
  return Response.json(res, { status: res.ok ? 200 : 400, headers: { "Cache-Control": "no-store" } });
}
