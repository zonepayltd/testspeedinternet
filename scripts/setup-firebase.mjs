// Connect this computer to Firebase and (optionally) save the admin login in Firebase.
//
//   node scripts/setup-firebase.mjs <path/to/serviceAccountKey.json> [--user NAME --pass PASSWORD]
//
// 1. copies the key to ./secrets/serviceAccountKey.json (git-ignored — never uploaded)
// 2. writes FIREBASE_SERVICE_ACCOUNT_FILE to .env.local (git-ignored) for `npm run dev`
// 3. with --user/--pass: stores the admin login in Firestore (admin/credentials, password hashed)
// 4. prints a one-line value you can paste into Vercel as FIREBASE_SERVICE_ACCOUNT if you want
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(path.join(root, "package.json"));
const args = process.argv.slice(2);
const keyPath = args.find((a) => !a.startsWith("--"));
const opt = (name) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};
if (!keyPath) {
  console.error("Usage: node scripts/setup-firebase.mjs <serviceAccountKey.json> [--user NAME --pass PASSWORD]");
  process.exit(1);
}

const sa = JSON.parse(fs.readFileSync(path.resolve(keyPath), "utf8"));
if (sa.type !== "service_account" || !sa.project_id || !sa.private_key || !sa.client_email) {
  console.error("That file is not a Firebase service-account key (Project settings → Service accounts → Generate new private key).");
  process.exit(1);
}

// 1) keep a private copy inside the project (ignored by git)
const secretsDir = path.join(root, "secrets");
fs.mkdirSync(secretsDir, { recursive: true });
const dest = path.join(secretsDir, "serviceAccountKey.json");
if (path.resolve(keyPath) !== dest) fs.copyFileSync(path.resolve(keyPath), dest);
fs.chmodSync(dest, 0o600);

// 2) .env.local for local development
const envFile = path.join(root, ".env.local");
let env = fs.existsSync(envFile) ? fs.readFileSync(envFile, "utf8") : "";
env = env.replace(/^FIREBASE_SERVICE_ACCOUNT_FILE=.*\n?/m, "");
env += `${env && !env.endsWith("\n") ? "\n" : ""}FIREBASE_SERVICE_ACCOUNT_FILE=secrets/serviceAccountKey.json\n`;
fs.writeFileSync(envFile, env, { mode: 0o600 });
console.log(`✓ Firebase project: ${sa.project_id}`);
console.log("✓ Key saved to secrets/serviceAccountKey.json and linked in .env.local (both private, not uploaded to GitHub)");

// 3) admin login in Firestore
const user = opt("user");
const pass = opt("pass");
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
initializeApp({ credential: cert({ projectId: sa.project_id, clientEmail: sa.client_email, privateKey: sa.private_key }) });
const db = getFirestore();

// quick connection test
const collections = await db.listCollections();
console.log(`✓ Connected to Firestore — collections: ${collections.map((c) => c.id).join(", ") || "(none yet)"}`);

if (user && pass) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(pass, salt, 64, { N: 16384, r: 8, p: 1 });
  await db.collection("admin").doc("credentials").set({
    username: user.trim(),
    passwordHash: `scrypt$${salt.toString("base64")}$${hash.toString("base64")}`,
    updatedAt: FieldValue.serverTimestamp(),
  });
  console.log(`✓ Admin login saved in Firebase for user "${user.trim()}" (password stored as a hash)`);
}

// 4) value for Vercel (optional)
console.log("\nOptional — to use the same key on Vercel, add an environment variable FIREBASE_SERVICE_ACCOUNT with this value:");
console.log(JSON.stringify(sa).length + " characters (run with --print-vercel to show it)");
if (args.includes("--print-vercel")) console.log(JSON.stringify(sa));
process.exit(0);
