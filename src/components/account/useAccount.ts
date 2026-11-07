"use client";

// Shared "who is signed in" state for the header, prompts and account pages.
// One /api/account/me request per page load; refresh() after login/logout/profile edits.
import { useEffect, useState } from "react";

export type AccountUser = {
  id: string;
  email: string;
  name: string;
  phone: string;
  country: string;
  countryCode: string;
  locale: string;
  emailVerified: boolean;
  createdAt: number;
};

type State = { loading: boolean; user: AccountUser | null };

let state: State = { loading: true, user: null };
let inflight: Promise<void> | null = null;
const listeners = new Set<(s: State) => void>();

function emit(next: State) {
  state = next;
  listeners.forEach((l) => l(state));
}

export function refreshAccount(): Promise<void> {
  inflight = fetch("/api/account/me", { cache: "no-store", credentials: "same-origin" })
    .then((r) => r.json())
    .then((d) => emit({ loading: false, user: d?.user || null }))
    .catch(() => emit({ loading: false, user: null }))
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

export function setAccountUser(user: AccountUser | null) {
  emit({ loading: false, user });
}

export function useAccount() {
  const [s, setS] = useState<State>(state);
  useEffect(() => {
    listeners.add(setS);
    setS(state);
    if (state.loading && !inflight) refreshAccount();
    return () => {
      listeners.delete(setS);
    };
  }, []);
  return { ...s, refresh: refreshAccount };
}

export async function signOut() {
  await fetch("/api/account/logout", { method: "POST" }).catch(() => null);
  emit({ loading: false, user: null });
}

/** POST/PUT/DELETE JSON helper → { ok, error?, ...data }. Network errors become { ok:false, error:"network" }. */
export async function apiJson<T = Record<string, unknown>>(url: string, method = "POST", data?: unknown): Promise<{ ok: boolean; error?: string } & T> {
  try {
    const r = await fetch(url, {
      method,
      headers: data !== undefined ? { "Content-Type": "application/json" } : undefined,
      body: data !== undefined ? JSON.stringify(data) : undefined,
      cache: "no-store",
    });
    const j = await r.json().catch(() => ({}));
    return { ok: !!j.ok && r.ok, ...j } as { ok: boolean; error?: string } & T;
  } catch {
    return { ok: false, error: "network" } as { ok: boolean; error?: string } & T;
  }
}

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("") || "?";
