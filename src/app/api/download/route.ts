// Streams a requested number of bytes so the client can measure download speed.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_BYTES = 100_000_000; // 100 MB safety cap
const CHUNK_SIZE = 65_536; // 64 KB

// A single random-filled chunk, reused for every enqueue. Random content keeps
// any intermediate proxy from compressing the payload and skewing the result.
const chunk = new Uint8Array(CHUNK_SIZE);
for (let i = 0; i < CHUNK_SIZE; i++) {
  chunk[i] = Math.floor(Math.random() * 256);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const requested = Number.parseInt(searchParams.get("bytes") ?? "10000000", 10);
  const total = Math.min(
    Number.isFinite(requested) && requested > 0 ? requested : 10_000_000,
    MAX_BYTES
  );

  let sent = 0;
  const stream = new ReadableStream<Uint8Array>({
    pull(controller) {
      if (sent >= total) {
        controller.close();
        return;
      }
      const remaining = total - sent;
      const size = Math.min(CHUNK_SIZE, remaining);
      controller.enqueue(size === CHUNK_SIZE ? chunk : chunk.subarray(0, size));
      sent += size;
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Length": String(total),
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
    },
  });
}
