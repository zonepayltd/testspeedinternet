"use client";

// "Delete all analytics" — clears page views, visitors, online sessions,
// speed tests and ad statistics in one go (behind a type-DELETE confirm).
// Messages, blog posts, ads themselves and settings are NOT touched.

import { useState } from "react";
import { Eraser, Loader2 } from "lucide-react";
import { Button, api, fmtNum, useAdminUI } from "@/components/admin/ui";
import { TypeToConfirm } from "./DataManager";

const STEPS = [
  { id: "visits", label: "Page views" },
  { id: "visitors", label: "Visitors" },
  { id: "presence", label: "Online sessions" },
  { id: "tests", label: "Speed tests" },
] as const;

export function useWipeAnalytics(onDone?: () => void) {
  const { toast } = useAdminUI();
  const [asking, setAsking] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [deleted, setDeleted] = useState(0);

  const run = async () => {
    setAsking(false);
    let total = 0;
    setDeleted(0);
    try {
      for (const step of STEPS) {
        setBusy(step.label);
        // The API deletes in capped chunks and reports `more` until the collection is empty.
        for (let guard = 0; guard < 500; guard++) {
          const r = await api<{ deleted: number; more: boolean }>("/api/admin/data", { method: "DELETE", json: { collection: step.id, all: true } });
          total += r.deleted || 0;
          setDeleted(total);
          if (!r.more) break;
        }
      }
      setBusy("Ad statistics");
      await api("/api/admin/data", { method: "POST", json: { action: "resetAdStats" } });
      toast(`All analytics deleted — ${fmtNum(total)} records removed`);
      window.dispatchEvent(new Event("admin:refresh-badges"));
      onDone?.();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Delete failed — some data may remain", "error");
      onDone?.();
    } finally {
      setBusy(null);
    }
  };

  const dialog = asking ? (
    <TypeToConfirm
      title="Delete ALL analytics?"
      message="This permanently deletes every page view, visitor, online session and speed test, and resets ad impressions/clicks to 0. Messages, blog posts, your ads and settings are kept. This can't be undone."
      onClose={() => setAsking(false)}
      onConfirm={run}
    />
  ) : null;

  return { ask: () => setAsking(true), busy, deleted, dialog };
}

/** Danger-zone card for Settings → Data & privacy. */
export default function WipeAnalyticsCard({ onDone }: { onDone?: () => void }) {
  const { ask, busy, deleted, dialog } = useWipeAnalytics(onDone);
  return (
    <section className="overflow-hidden rounded-2xl border border-rose-200 bg-rose-50/50 dark:border-rose-400/20 dark:bg-rose-400/[0.04]">
      <div className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-400/15 dark:text-rose-300">
            <Eraser className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">Delete all analytics</h3>
            <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">
              Start fresh: removes all page views, visitors, online sessions and speed tests, and resets ad stats. Messages, posts, ads and settings stay.
            </p>
          </div>
        </div>
        <Button variant="danger" icon={busy ? undefined : Eraser} loading={!!busy} onClick={ask} className="shrink-0">
          {busy ? "Deleting…" : "Delete all analytics"}
        </Button>
      </div>
      {busy && (
        <p className="flex items-center gap-2 border-t border-rose-200/70 px-5 py-2.5 text-xs text-rose-700 dark:border-rose-400/15 dark:text-rose-300" aria-live="polite">
          <Loader2 className="h-3.5 w-3.5 animate-spin" /> {busy}… {fmtNum(deleted)} records deleted so far
        </p>
      )}
      {dialog}
    </section>
  );
}
