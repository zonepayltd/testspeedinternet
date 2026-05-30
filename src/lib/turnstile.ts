// Verify a Cloudflare Turnstile captcha token, server-side.
import "server-only";
import { getSiteConfig } from "@/lib/siteConfig";

export async function verifyTurnstile(token: string | undefined, ip?: string): Promise<boolean> {
  // Secret can come from env or from the admin Settings (Firestore).
  let secret = process.env.TURNSTILE_SECRET_KEY || "";
  if (!secret) {
    try {
      secret = (await getSiteConfig()).turnstileSecret || "";
    } catch {
      /* ignore */
    }
  }

  // Not configured yet → don't block (captcha becomes mandatory once a key is set).
  if (!secret) return true;
  if (!token) return false;

  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip) body.set("remoteip", ip);
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
    });
    const data = await res.json();
    return data?.success === true;
  } catch {
    return false;
  }
}
