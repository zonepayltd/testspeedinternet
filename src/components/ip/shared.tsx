// Small helpers shared by the IP tools (IpDetails, IpSecurity).

const LOGODEV_TOKEN = process.env.NEXT_PUBLIC_LOGODEV_TOKEN ?? "";

// Known ISPs that get a logo next to their name. Keys are matched as whole words.
const ISP_DOMAINS: [string, string][] = [
  ["maroc telecom", "iam.ma"],
  ["maroctelecom", "iam.ma"],
  ["iam", "iam.ma"],
  ["menara", "iam.ma"],
  ["orange", "orange.ma"],
  ["inwi", "inwi.ma"],
  ["wana", "inwi.ma"],
];

export function flagUrl(cc?: string, retina = false): string | null {
  if (!cc || cc.length !== 2) return null;
  const c = cc.toLowerCase();
  return retina ? `https://flagcdn.com/64x48/${c}.png` : `https://flagcdn.com/32x24/${c}.png`;
}

export function ispLogoUrl(isp?: string): string | null {
  if (!isp) return null;
  const s = isp.toLowerCase();
  for (const [key, domain] of ISP_DOMAINS) {
    const re = new RegExp(`(^|[^a-z])${key}([^a-z]|$)`);
    if (re.test(s)) {
      return LOGODEV_TOKEN
        ? `https://img.logo.dev/${domain}?token=${LOGODEV_TOKEN}&size=128&format=png&retina=true`
        : `https://www.google.com/s2/favicons?sz=128&domain=${domain}`;
    }
  }
  return null;
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

export function IspLogo({ isp, size = 20 }: { isp?: string; size?: number }) {
  const src = ispLogoUrl(isp);
  if (!src) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      width={size}
      height={size}
      alt=""
      className="shrink-0 rounded-md bg-white object-contain p-0.5 ring-1 ring-slate-200 dark:ring-white/10"
      style={{ width: size, height: size }}
    />
  );
}

/** Pulsing placeholder bar. */
export function Skeleton({ className = "" }: { className?: string }) {
  return <span aria-hidden="true" className={`block animate-pulse rounded-md bg-slate-200/80 dark:bg-white/[0.08] ${className}`} />;
}
