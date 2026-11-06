import { adminDb, adminConfigured } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TYPES = ["image/webp", "image/jpeg", "image/png", "image/gif"];

// GET /api/ad-image/:id — serves an uploaded ad image. Images are immutable
// (a new upload gets a new id), so they can be cached for a year.
export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  if (!adminConfigured || !/^[A-Za-z0-9_-]{1,64}$/.test(id)) return new Response("Not found", { status: 404 });
  const etag = `"${id}"`;
  if (req.headers.get("if-none-match") === etag) {
    return new Response(null, { status: 304, headers: { ETag: etag, "Cache-Control": "public, max-age=31536000, immutable" } });
  }
  try {
    const doc = await adminDb().collection("adImages").doc(id).get();
    const type = String(doc.get("type") || "");
    const data = doc.get("data");
    if (!doc.exists || !data || !TYPES.includes(type)) {
      return new Response("Not found", { status: 404, headers: { "Cache-Control": "public, max-age=60" } });
    }
    const bytes = Buffer.from(String(data), "base64");
    return new Response(new Uint8Array(bytes), {
      headers: {
        "Content-Type": type,
        "Content-Length": String(bytes.length),
        "Cache-Control": "public, max-age=31536000, immutable",
        ETag: etag,
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy": "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'",
      },
    });
  } catch {
    return new Response("Error", { status: 500, headers: { "Cache-Control": "no-store" } });
  }
}
