"use client";

import { useMemo } from "react";
import type { OnlineUser } from "./bits";

// Same projection as scripts/generate-hero.mjs (1600×900 canvas, map from lat 76 to -56).
const W = 1600;
const H = 900;
const PX = W / 360;
const MAP_Y = 110;
const LAT_TOP = 76;
const CROP_TOP = 85; // px of empty sky cropped off the top
const CROP_H = 640; // visible height of the map area

const project = (lat: number, lon: number) => ({ x: ((lon + 180) / 360) * W, y: MAP_Y + (LAT_TOP - lat) * PX });

type Pin = { key: string; x: number; y: number; users: OnlineUser[] };

export default function LiveMap({ users, countryName }: { users: OnlineUser[]; countryName: (cc: string) => string }) {
  const { pins, unplaced } = useMemo(() => {
    const m = new Map<string, Pin>();
    let unplaced = 0;
    for (const u of users) {
      if (u.lat == null || u.lon == null) {
        unplaced++;
        continue;
      }
      const key = `${u.lat.toFixed(1)},${u.lon.toFixed(1)}`;
      const p = m.get(key) || { key, ...project(u.lat, u.lon), users: [] };
      p.users.push(u);
      m.set(key, p);
    }
    return { pins: [...m.values()], unplaced };
  }, [users]);

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-b from-slate-50 to-white ring-1 ring-inset ring-slate-200/70 dark:from-white/[0.03] dark:to-transparent dark:ring-white/[0.06]" style={{ aspectRatio: `${W} / ${CROP_H}` }}>
      <div className="absolute inset-x-0" style={{ top: `${(-CROP_TOP / CROP_H) * 100}%`, height: `${(H / CROP_H) * 100}%` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/hero/world-map-light.svg" alt="" className="absolute inset-0 h-full w-full dark:hidden" draggable={false} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/hero/world-map-dark.svg" alt="" className="absolute inset-0 hidden h-full w-full dark:block" draggable={false} />
        {pins.map((p) => {
          const n = p.users.length;
          const first = p.users[0];
          const size = Math.min(22, 10 + (n - 1) * 3);
          const label = `${first.city || "Unknown city"}, ${first.country || countryName(first.countryCode)} — ${n} online\n${p.users
            .slice(0, 5)
            .map((u) => `• ${u.path}`)
            .join("\n")}`;
          return (
            <span
              key={p.key}
              title={label}
              className="group absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${(p.x / W) * 100}%`, top: `${(p.y / H) * 100}%` }}
            >
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/50" style={{ width: size, height: size }} />
              <span
                className="relative flex items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white shadow-[0_0_0_3px_rgba(16,185,129,0.25),0_4px_12px_rgba(16,185,129,0.45)]"
                style={{ width: size, height: size }}
              >
                {n > 1 ? n : ""}
              </span>
              <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1.5 text-[11px] font-medium text-white shadow-lg group-hover:block dark:bg-white dark:text-slate-900">
                {first.city || countryName(first.countryCode)} · {n} online
              </span>
            </span>
          );
        })}
      </div>
      <div className="pointer-events-none absolute bottom-2 start-3 flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500" /> Online now
        </span>
        {unplaced > 0 && <span>{unplaced} without location</span>}
      </div>
    </div>
  );
}
