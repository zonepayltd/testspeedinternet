import { clearUserSession } from "@/lib/userAuth";
import { ok } from "../_util";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  await clearUserSession();
  return ok();
}
