import type { Metadata } from "next";
import { Suspense } from "react";

import { localeFromParams, pageMetadata } from "@/i18n/server";
import { pick } from "@/i18n/config";
import { accountMessages } from "@/i18n/messages/account";

import AuthShell from "@/components/account/AuthShell";
import { ResetForm } from "@/components/account/AuthForms";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const t = pick(accountMessages, locale);
  return pageMetadata({ locale, path: "/account/reset", title: t.meta.reset, description: t.meta.desc, noindex: true });
}

export default async function ResetPage({ params }: Props) {
  const locale = await localeFromParams(params);
  const t = pick(accountMessages, locale);

  return (
    <AuthShell t={t} title={t.reset.title} subtitle={t.reset.subtitle} aside={false}>
      <Suspense fallback={<div className="h-40" />}>
        <ResetForm />
      </Suspense>
    </AuthShell>
  );
}
