// Drains the uploaded body and reports how many bytes were received so the
// client can measure upload speed.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const NO_STORE = "no-store, no-cache, must-revalidate, max-age=0";

export async function POST(request: Request) {
  let received = 0;

  if (request.body) {
    const reader = request.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      received += value?.byteLength ?? 0;
    }
  } else {
    const buffer = await request.arrayBuffer();
    received = buffer.byteLength;
  }

  return new Response(JSON.stringify({ received }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": NO_STORE,
    },
  });
}
