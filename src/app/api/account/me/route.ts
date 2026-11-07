import { getSessionUser } from "@/lib/userAuth";
import { ok } from "../_util";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/account/me → { ok, user: PublicUser | null }
export async function GET() {
  const user = await getSessionUser().catch(() => null);
  return ok({ user });
}
