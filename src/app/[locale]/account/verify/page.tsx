import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CircleCheck, CircleX } from "lucide-react";
import { localeFromParams, pageMetadata } from "@/i18n/server";
import { lp, pick } from "@/i18n/config";
import { accountMessages } from "@/i18n/messages/account";
import { getSessionUser } from "@/lib/userAuth";
import AuthShell from "@/components/account/AuthShell";
import { verifyEmailToken } from "@/app/api/account/verify/verifyToken";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ token?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const t = pick(accountMessages, locale);
  return pageMetadata({ locale, path: "/account/verify", title: t.meta.verify, description: t.meta.desc, noindex: true });
}

export default async function VerifyPage({ params, searchParams }: Props) {
  const locale = await localeFromParams(params);
  const t = pick(accountMessages, locale);
  const { token = "" } = await searchParams;
  const ok = await verifyEmailToken(String(token).slice(0, 100)).catch(() => false);
  const user = await getSessionUser().catch(() => null);

  return (
    <AuthShell t={t} title={ok ? t.verify.okTitle : t.verify.badTitle} aside={false}>
      <div className="text-center">
        <span
          className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ring-1 ring-inset ${
            ok
              ? "bg-emerald-50 text-emerald-600 ring-emerald-200 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-400/20"
              : "bg-amber-50 text-amber-600 ring-amber-200 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-400/20"
          }`}
        >
          {ok ? <CircleCheck className="h-8 w-8" aria-hidden="true" /> : <CircleX className="h-8 w-8" aria-hidden="true" />}
        </span>
        <p className="muted mx-auto mt-5 max-w-sm text-sm leading-relaxed">{ok ? t.verify.okText : t.verify.badText}</p>
        <Link href={lp(locale, user ? "/account" : "/account/login")} className="btn-primary mt-6">
          {user ? t.verify.dashboard : t.verify.signIn}
          <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
        </Link>
      </div>
    </AuthShell>
  );
}
