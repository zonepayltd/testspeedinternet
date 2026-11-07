"use client";

import { useRef } from "react";
import { Star } from "lucide-react";

/** Read-only stars with partial fill (e.g. 4.3). */
export function StarDisplay({ value, size = 16, label, className = "" }: { value: number; size?: number; label?: string; className?: string }) {
  const v = Math.max(0, Math.min(5, value));
  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`} role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, v - i));
        return (
          <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
            <Star className="absolute inset-0 text-slate-300 dark:text-slate-600" style={{ width: size, height: size }} strokeWidth={1.5} />
            {fill > 0 && (
              <span className="absolute inset-y-0 start-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <Star className="fill-amber-400 text-amber-400" style={{ width: size, height: size }} strokeWidth={1.5} />
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
}

/** Accessible 1–5 star picker (radio group; arrow keys change the value). */
export function StarInput({
  value,
  onChange,
  labels,
  legend,
  size = 36,
  name = "rating",
  hover,
  onHover,
}: {
  value: number;
  onChange: (n: number) => void;
  labels: string[];
  legend: string;
  size?: number;
  name?: string;
  hover?: number;
  onHover?: (n: number) => void;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const shown = hover || value;
  const move = (to: number) => {
    const n = Math.max(1, Math.min(5, to));
    onChange(n);
    refs.current[n - 1]?.focus();
  };
  return (
    <div>
      <div role="radiogroup" aria-label={legend} className="flex items-center gap-1" onMouseLeave={() => onHover?.(0)}>
        {[1, 2, 3, 4, 5].map((n) => {
          const on = n <= shown;
          const checked = value === n;
          return (
            <button
              key={n}
              ref={(el) => {
                refs.current[n - 1] = el;
              }}
              type="button"
              role="radio"
              name={name}
              aria-checked={checked}
              aria-label={`${n} – ${labels[n - 1]}`}
              tabIndex={checked || (!value && n === 1) ? 0 : -1}
              onClick={() => onChange(n)}
              onMouseEnter={() => onHover?.(n)}
              onFocus={() => onHover?.(0)}
              onKeyDown={(e) => {
                const rtl = getComputedStyle(e.currentTarget).direction === "rtl";
                if (e.key === "ArrowRight" || e.key === "ArrowUp") {
                  e.preventDefault();
                  move((value || 0) + (e.key === "ArrowRight" && rtl ? -1 : 1));
                } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
                  e.preventDefault();
                  move((value || 2) + (e.key === "ArrowLeft" && rtl ? 1 : -1));
                }
              }}
              className="rounded-lg p-0.5 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-ink-900"
            >
              <Star
                style={{ width: size, height: size }}
                strokeWidth={1.5}
                className={`transition-colors ${on ? "fill-amber-400 text-amber-400 drop-shadow-sm" : "text-slate-300 hover:text-amber-300 dark:text-slate-600"}`}
                aria-hidden="true"
              />
            </button>
          );
        })}
        <span className="ms-2 min-w-[5.5rem] text-sm font-semibold text-slate-700 dark:text-slate-200" aria-hidden="true">
          {shown ? labels[shown - 1] : ""}
        </span>
      </div>
    </div>
  );
}
