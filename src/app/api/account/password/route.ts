import { hashPassword } from "@/lib/adminAuth";
import { checkPassword, rateLimit, setUserSession, userPasswordProblem } from "@/lib/userAuth";
import { body, err, isResponse, ok, requireUser } from "../_util";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// PUT /api/account/password { currentPassword, newPassword } — signs out other devices.
export async function PUT(req: Request) {
  const u = await requireUser();
  if (isResponse(u)) return u;
  if (!rateLimit(`pw:${u.id}`, 10, 15 * 60_000)) return err("tooMany", 429);
  const b = await body(req);
  const current = typeof b.currentPassword === "string" ? b.currentPassword : "";
  const next = typeof b.newPassword === "string" ? b.newPassword : "";
  if (!checkPassword(current, String(u.get("passwordHash") || ""))) return err("wrongPassword", 403);
  const pw = userPasswordProblem(next);
  if (pw) return err(pw);
  const sv = Number(u.get("sv") || 1) + 1;
  await u.ref.update({ passwordHash: hashPassword(next), sv });
  await setUserSession(u.id, sv);
  return ok();
}
