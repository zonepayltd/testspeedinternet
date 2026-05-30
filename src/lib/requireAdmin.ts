import "server-only";
import { getAdminSession } from "@/lib/adminSession";

// Returns the session or null. Use in admin API routes to gate access.
export async function requireAdmin() {
  return getAdminSession();
}

export function unauthorized() {
  return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
}
