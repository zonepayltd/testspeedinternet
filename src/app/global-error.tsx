"use client";

// Last-resort error boundary: replaces the root layout, so it must render its own
// <html>/<body> and can't rely on Tailwind, fonts or i18n. Kept self-contained.
const css = `
  :root { color-scheme: light dark; }
  * { box-sizing: border-box; }
  body {
    margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center;
    padding: 24px; font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    background: radial-gradient(60% 50% at 50% 0%, rgba(37,99,235,0.10), transparent), #ffffff; color: #0f172a;
    -webkit-font-smoothing: antialiased;
  }
  .card { width: 100%; max-width: 440px; text-align: center; }
  .icon { width: 56px; height: 56px; margin: 0 auto; border-radius: 16px; display: flex; align-items: center;
    justify-content: center; background: #fffbeb; color: #d97706; box-shadow: inset 0 0 0 1px #fde68a; }
  .brand { margin: 20px 0 0; font-size: 12px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: #2563eb; }
  h1 { margin: 8px 0 0; font-size: 26px; font-weight: 800; letter-spacing: -0.02em; }
  p.text { margin: 10px 0 0; font-size: 15px; line-height: 1.6; color: #475569; }
  .actions { margin-top: 28px; display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
  .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; border-radius: 12px;
    padding: 11px 20px; font: 600 14px/1 inherit; font-family: inherit; cursor: pointer; text-decoration: none; transition: background .15s; }
  .primary { border: 0; background: #2563eb; color: #fff; }
  .primary:hover { background: #1d4ed8; }
  .secondary { border: 1px solid #e2e8f0; background: #fff; color: #334155; }
  .secondary:hover { background: #f8fafc; }
  .ref { margin-top: 24px; font-size: 12px; color: #94a3b8; }
  code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
  @media (prefers-color-scheme: dark) {
    body { background: radial-gradient(60% 50% at 50% 0%, rgba(59,130,246,0.18), transparent), #070b16; color: #f1f5f9; }
    .icon { background: rgba(251,191,36,0.1); color: #fcd34d; box-shadow: inset 0 0 0 1px rgba(251,191,36,0.2); }
    .brand { color: #60a5fa; }
    p.text { color: #94a3b8; }
    .primary { background: #3b82f6; }
    .primary:hover { background: #60a5fa; }
    .secondary { border-color: rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); color: #e2e8f0; }
    .secondary:hover { background: rgba(255,255,255,0.1); }
    .ref { color: #64748b; }
  }
`;

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <head>
        <title>Something went wrong | TestSpeedInternet</title>
        <meta name="robots" content="noindex" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style dangerouslySetInnerHTML={{ __html: css }} />
      </head>
      <body>
        <main className="card">
          <div className="icon" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
            </svg>
          </div>
          <p className="brand">TestSpeedInternet</p>
          <h1>Something went wrong</h1>
          <p className="text">An unexpected error occurred. Please try again, or go back to the homepage.</p>
          <div className="actions">
            <button type="button" className="btn primary" onClick={() => reset()}>
              Try again
            </button>
            {/* Plain <a>: a full reload is the safest recovery from a root-level crash. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a className="btn secondary" href="/">
              Back to home
            </a>
          </div>
          {error.digest && (
            <p className="ref">
              Error reference: <code>{error.digest}</code>
            </p>
          )}
        </main>
      </body>
    </html>
  );
}
