import type { Metadata } from "next";
import { Suspense } from "react";
import { localeFromParams, pageMetadata } from "@/i18n/server";
import { pick } from "@/i18n/config";
import { accountMessages } from "@/i18n/messages/account";
import Dashboard from "@/components/account/dashboard/Dashboard";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const t = pick(accountMessages, locale);
  return pageMetadata({ locale, path: "/account", title: t.meta.dashboard, description: t.meta.desc, noindex: true });
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <Dashboard />
    </Suspense>
  );
}
