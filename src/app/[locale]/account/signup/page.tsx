import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { localeFromParams, pageMetadata } from "@/i18n/server";
import { lp, pick } from "@/i18n/config";
import { accountMessages } from "@/i18n/messages/account";
import { getSessionUser } from "@/lib/userAuth";
import AuthShell from "@/components/account/AuthShell";
import { SignupForm } from "@/components/account/AuthForms";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const t = pick(accountMessages, locale);
  return pageMetadata({ locale, path: "/account/signup", title: t.meta.signup, description: t.meta.desc, noindex: true });
}

export default async function SignupPage({ params }: Props) {
  const locale = await localeFromParams(params);
  const t = pick(accountMessages, locale);
  if (await getSessionUser().catch(() => null)) redirect(lp(locale, "/account"));
  return (
    <AuthShell t={t} title={t.signup.title} subtitle={t.signup.subtitle} aside={true}>
      <Suspense fallback={<div className="h-40" />}>
        <SignupForm />
      </Suspense>
    </AuthShell>
  );
}
