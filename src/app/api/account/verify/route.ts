import { body, err, ok, str } from "../_util";
import { verifyEmailToken } from "./verifyToken";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST /api/account/verify { token } → confirms the email address.
export async function POST(req: Request) {
  const b = await body(req);
  return (await verifyEmailToken(str(b.token, 100))) ? ok() : err("tokenInvalid");
}
