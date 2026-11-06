// Firebase Admin SDK — server-only. Powers all Firestore access (analytics,
// blog, settings) through API routes. Never imported into client components.
import "server-only";
import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import fs from "node:fs";
import path from "node:path";

type ServiceAccount = { project_id?: string; client_email?: string; private_key?: string };

/** Service account from FIREBASE_SERVICE_ACCOUNT (JSON text) or FIREBASE_SERVICE_ACCOUNT_FILE (path to the key file Firebase gives you). */
function serviceAccountFromEnv(): ServiceAccount | null {
  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT) as ServiceAccount;
    const file = process.env.FIREBASE_SERVICE_ACCOUNT_FILE;
    if (file) return JSON.parse(fs.readFileSync(path.resolve(process.cwd(), file), "utf8")) as ServiceAccount;
  } catch {
    /* fall back to the individual variables */
  }
  return null;
}
const SA = serviceAccountFromEnv();

let app: App | undefined;

// Robustly load the service-account private key from env. Handles the common
// host pitfalls: literal "\n" sequences, surrounding quotes, or a base64 value.
function loadPrivateKey(): string {
  const b64 = process.env.FIREBASE_PRIVATE_KEY_BASE64;
  if (b64) {
    try {
      const decoded = Buffer.from(b64, "base64").toString("utf8").trim();
      if (decoded.includes("PRIVATE KEY")) return decoded;
    } catch {
      /* fall through */
    }
  }

  let key = (process.env.FIREBASE_PRIVATE_KEY || "").trim();
  // Strip wrapping quotes some hosts keep around the value.
  if (
    (key.startsWith('"') && key.endsWith('"')) ||
    (key.startsWith("'") && key.endsWith("'"))
  ) {
    key = key.slice(1, -1);
  }
  // Turn escaped newlines into real ones.
  key = key.replace(/\\r\\n/g, "\n").replace(/\\n/g, "\n").replace(/\r\n/g, "\n");
  return key;
}

export function getAdminApp(): App {
  if (app) return app;
  if (getApps().length) {
    app = getApps()[0];
    return app;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID || SA?.project_id;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL || SA?.client_email;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY || process.env.FIREBASE_PRIVATE_KEY_BASE64 ? loadPrivateKey() : SA?.private_key || "";

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Firebase Admin is not configured (missing service account env vars).");
  }

  app = initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
  return app;
}

export function adminDb(): Firestore {
  return getFirestore(getAdminApp());
}

export const adminConfigured = Boolean(
  (process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    (process.env.FIREBASE_PRIVATE_KEY || process.env.FIREBASE_PRIVATE_KEY_BASE64)) ||
    (SA?.project_id && SA.client_email && SA.private_key)
);
