// Lightweight endpoint used to measure round-trip latency (ping & jitter).
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const NO_STORE = "no-store, no-cache, must-revalidate, max-age=0";

export async function GET() {
  return new Response("pong", {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": NO_STORE,
    },
  });
}
