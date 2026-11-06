import { requireAdmin, unauthorized } from "@/lib/requireAdmin";
import { adminConfigured } from "@/lib/firebaseAdmin";
import { checkAdminLogin, getStoredCredentials, passwordProblem, saveCredentials } from "@/lib/adminAuth";
import { setSessionCookie } from "@/lib/adminSession";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET  -> where the admin login comes from (env vars and/or Firebase)
// PUT  { currentPassword, username, newPassword } -> save new credentials in Firebase
export async function GET() {
  const session = await requireAdmin();
  if (!session) return unauthorized();
  const stored = await getStoredCredentials();
  return Response.json({
    ok: true,
    username: session.username,
    firebase: adminConfigured,
    storedInFirebase: Boolean(stored),
    storedUsername: stored?.username || null,
    updatedAt: stored?.updatedAt || null,
    envLogin: Boolean(process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD),
  });
}

export async function PUT(request: Request) {
  const session = await requireAdmin();
  if (!session) return unauthorized();
  if (!adminConfigured) return Response.json({ ok: false, error: "Firebase is not connected on this server." }, { status: 400 });

  let b: { currentPassword?: string; username?: string; newPassword?: string };
  try {
    b = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  const username = String(b.username || "").trim();
  const newPassword = String(b.newPassword || "");
  if (!/^[a-zA-Z0-9._@-]{3,40}$/.test(username)) {
    return Response.json({ ok: false, error: "Username: 3–40 letters, numbers, dot, dash, underscore or @." }, { status: 400 });
  }
  const problem = passwordProblem(newPassword);
  if (problem) return Response.json({ ok: false, error: problem }, { status: 400 });

  // Confirm the current password before changing anything.
  if (!(await checkAdminLogin(session.username, String(b.currentPassword || "")))) {
    return Response.json({ ok: false, error: "Current password is incorrect." }, { status: 401 });
  }

  await saveCredentials(username, newPassword);
  await setSessionCookie(username);
  return Response.json({ ok: true, username });
}
