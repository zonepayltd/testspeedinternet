// Outgoing email over SMTP (Neo mail by default). Server-only.
//
// Settings come from Admin → Settings → Email first (Firestore doc config/mail; the
// password never leaves the server), otherwise from environment variables:
//   SMTP_HOST (default smtp0001.neo.space), SMTP_PORT (default 465), SMTP_USER, SMTP_PASS,
//   MAIL_FROM_NAME (default "TestSpeedInternet")
import "server-only";
import nodemailer from "nodemailer";
import { adminDb, adminConfigured } from "@/lib/firebaseAdmin";
import { COMPANY } from "@/lib/company";

export type MailConfig = { host: string; port: number; user: string; pass: string; fromName: string; source: "env" | "admin" | "none" };
export type MailResult = { ok: true; id?: string } | { ok: false; error: string };

const DEFAULT_HOST = "smtp0001.neo.space";

let cache: { cfg: MailConfig; at: number } | null = null;

export async function getMailConfig(fresh = false): Promise<MailConfig> {
  if (!fresh && cache && Date.now() - cache.at < 60_000) return cache.cfg;
  let cfg: MailConfig = { host: DEFAULT_HOST, port: 465, user: "", pass: "", fromName: COMPANY.brand, source: "none" };
  // 1) Admin → Settings → Email (Firestore) wins, so the owner can fix it without a redeploy.
  if (adminConfigured) {
    try {
      const d = (await adminDb().collection("config").doc("mail").get()).data() || {};
      if (d.user && d.pass) {
        cfg = { host: String(d.host || DEFAULT_HOST), port: Number(d.port) || 465, user: String(d.user), pass: String(d.pass), fromName: String(d.fromName || COMPANY.brand), source: "admin" };
      }
    } catch {
      /* fall back to env */
    }
  }
  // 2) Environment variables (Vercel).
  if (cfg.source === "none" && process.env.SMTP_USER && process.env.SMTP_PASS) {
    cfg = {
      host: process.env.SMTP_HOST || DEFAULT_HOST,
      port: Number(process.env.SMTP_PORT) || 465,
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
      fromName: process.env.MAIL_FROM_NAME || COMPANY.brand,
      source: "env",
    };
  }
  cache = { cfg, at: Date.now() };
  return cfg;
}

export function clearMailCache() {
  cache = null;
}

function transport(cfg: MailConfig) {
  return nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.port === 465,
    auth: { user: cfg.user, pass: cfg.pass },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });
}

/** Log in to the SMTP server without sending anything. */
export async function verifyMailConfig(cfg?: MailConfig): Promise<MailResult> {
  const c = cfg || (await getMailConfig(true));
  if (!c.user || !c.pass) return { ok: false, error: "Email is not configured (no SMTP user/password)." };
  try {
    await transport(c).verify();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "SMTP error" };
  }
}

export async function sendMail(msg: { to: string; subject: string; html: string; text: string; replyTo?: string }): Promise<MailResult> {
  const cfg = await getMailConfig();
  if (!cfg.user || !cfg.pass) {
    console.warn("[mail] not configured — would send:", msg.subject, "→", msg.to);
    return { ok: false, error: "Email is not configured." };
  }
  try {
    const info = await transport(cfg).sendMail({
      from: { name: cfg.fromName, address: cfg.user },
      to: msg.to,
      replyTo: msg.replyTo,
      subject: msg.subject,
      html: msg.html,
      text: msg.text,
    });
    await logMail(msg.to, msg.subject, true);
    return { ok: true, id: info.messageId };
  } catch (e) {
    const error = e instanceof Error ? e.message : "SMTP error";
    console.error("[mail] send failed:", error);
    await logMail(msg.to, msg.subject, false, error);
    return { ok: false, error };
  }
}

/** Keeps a small log of sent emails for the admin (mailLog collection). */
async function logMail(to: string, subject: string, ok: boolean, error?: string) {
  if (!adminConfigured) return;
  try {
    const { FieldValue } = await import("firebase-admin/firestore");
    await adminDb().collection("mailLog").add({ to: to.toLowerCase(), subject: subject.slice(0, 200), ok, error: error ? error.slice(0, 300) : null, ts: FieldValue.serverTimestamp() });
  } catch {
    /* ignore */
  }
}
