"use client";

// Small helpers shared by the IP tools (IpDetails, IpSecurity) and the speed test.
import { useState } from "react";
import { ispBrand, type IspBrand } from "@/lib/isp";

export function flagUrl(cc?: string, retina = false): string | null {
  if (!cc || cc.length !== 2) return null;
  const c = cc.toLowerCase();
  return retina ? `https://flagcdn.com/64x48/${c}.png` : `https://flagcdn.com/32x24/${c}.png`;
}

export function Flag({ cc, label, className = "" }: { cc?: string; label?: string; className?: string }) {
  const src = flagUrl(cc);
  const src2x = flagUrl(cc, true);
  if (!src) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      srcSet={src2x ? `${src2x} 2x` : undefined}
      width={20}
      height={15}
      alt={label ?? ""}
      className={`h-[15px] w-5 shrink-0 rounded-[3px] object-cover ring-1 ring-black/10 dark:ring-white/15 ${className}`}
    />
  );
}

/** Our logo endpoint for a provider website (see /api/isp-logo). */
export function ispLogoSrc(domain: string | null | undefined): string | null {
  return domain ? `/api/isp-logo?d=${encodeURIComponent(domain)}` : null;
}

/** Provider logo: the brand's current logo, or a neat initials badge if there isn't one. */
export function ProviderLogo({ brand, size = 20, className = "" }: { brand: IspBrand; size?: number; className?: string }) {
  const [failed, setFailed] = useState(false);
  const src = failed ? null : ispLogoSrc(brand.domain);
  const box = { width: size, height: size };
  if (!src) {
    const initials = (brand.name || "?").replace(/[^\p{L}\p{N}& ]/gu, "").split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase() || "?";
    return (
      <span
        aria-hidden="true"
        style={{ ...box, fontSize: Math.max(8, size * 0.38) }}
        className={`inline-flex shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-brand-500 to-indigo-600 font-bold text-white ${className}`}
      >
        {initials}
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      width={size}
      height={size}
      alt=""
      onError={() => setFailed(true)}
      style={box}
      className={`shrink-0 rounded-md bg-white object-contain p-[2px] ring-1 ring-slate-200 dark:ring-white/10 ${className}`}
    />
  );
}

/** @deprecated kept for older call sites: logo from a raw ISP name. */
export function IspLogo({ isp, size = 20 }: { isp?: string; size?: number }) {
  if (!isp) return null;
  return <ProviderLogo brand={ispBrand(isp)} size={size} />;
}

/** Pulsing placeholder bar. */
export function Skeleton({ className = "" }: { className?: string }) {
  return <span aria-hidden="true" className={`block animate-pulse rounded-md bg-slate-200/80 dark:bg-white/[0.08] ${className}`} />;
}
