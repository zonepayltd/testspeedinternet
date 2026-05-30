# Deploying Test Speed Internet to Vercel

This is a Next.js (App Router, SSR) app with API routes + Firebase Admin, so it
needs a Node.js host. **Vercel** runs it perfectly and for free. Your domain can
stay registered at Hostinger — you just point its DNS at Vercel.

---

## 1. Put the code on GitHub (recommended)

1. Create an empty repo on github.com (e.g. `testspeedinternet`).
2. In the project folder:
   ```
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<you>/testspeedinternet.git
   git push -u origin main
   ```
   `.env.local` is git-ignored, so your secrets are NOT pushed (good).

### …or deploy without GitHub (fastest)
```
npm i -g vercel
vercel login
vercel            # first deploy (creates the project)
```
Then add the env vars (step 3) and run `vercel --prod`.

---

## 2. Import to Vercel

- Go to vercel.com → **Add New → Project** → import your GitHub repo.
- Framework preset: **Next.js** (auto-detected). Leave build settings default
  (`next build`). Don't deploy yet — add the env vars first (step 3).

---

## 3. Environment variables (Vercel → Project → Settings → Environment Variables)

Add each of these for the **Production** (and Preview) environment. Copy the
VALUES from your local `.env.local` file.

| Key | Notes |
|-----|-------|
| `NEXT_PUBLIC_LOGODEV_TOKEN` | ISP logos (pk_…) |
| `FIREBASE_PROJECT_ID` | `test-speed-internet` |
| `FIREBASE_CLIENT_EMAIL` | the service-account email |
| `FIREBASE_PRIVATE_KEY` | paste the value **without** the surrounding quotes, keeping the `\n` exactly (begins `-----BEGIN PRIVATE KEY-----\n` … ends `…-----END PRIVATE KEY-----\n`) |
| `ADMIN_USERNAME` | `ahmedaicha` |
| `ADMIN_PASSWORD` | your admin password |
| `ADMIN_SESSION_SECRET` | the long random hex string |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile site key |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile secret key |

(The empty `NEXT_PUBLIC_FIREBASE_*` web-config keys are optional — leave them out.)

Then click **Deploy**. Vercel builds and gives you a `…vercel.app` URL.

---

## 4. Add your domain (keep it at Hostinger)

1. Vercel → Project → **Settings → Domains** → add `testspeedinternet.com`
   (and `www.testspeedinternet.com`).
2. Vercel shows DNS records. In **Hostinger → Domains → DNS / Nameservers**:
   - `A` record `@` → `76.76.21.21` (Vercel's IP, or whatever Vercel shows)
   - `CNAME` `www` → `cname.vercel-dns.com`
   (Use exactly the values Vercel displays.)
3. Wait for DNS to propagate (minutes to a few hours). Vercel auto-issues HTTPS.

---

## 5. Cloudflare Turnstile — allow the live domain

In dash.cloudflare.com → **Turnstile → your widget → Hostnames**, add:
`testspeedinternet.com`, `www.testspeedinternet.com` (and your `*.vercel.app`
URL while testing). Otherwise the captcha will error on the live site.

---

## 6. After it's live

- Visit `https://testspeedinternet.com` — the speed test, IP tools, blog and
  admin (`/admin`) all work.
- `/ads.txt` is served automatically from your AdSense Publisher ID.
- Submit your domain to Google Search Console + Bing, and apply to AdSense.
- Firestore + the service account work from Vercel with no extra config.

> Tip: every `git push` to `main` auto-deploys a new version on Vercel.
