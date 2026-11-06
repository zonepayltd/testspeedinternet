import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { pick } from "@/i18n/config";
import { localeFromParams, pageMetadata } from "@/i18n/server";
import { privacyMessages } from "@/i18n/messages/legal/privacy";

const PATH = "/privacy";
const UPDATED = "2026-11-06";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const t = pick(privacyMessages, locale);
  return pageMetadata({ locale, path: PATH, title: t.meta.title, description: t.meta.description });
}

export default async function PrivacyPage({ params }: Props) {
  const locale = await localeFromParams(params);
  return <LegalPage locale={locale} path={PATH} doc={pick(privacyMessages, locale)} updated={UPDATED} />;
}
