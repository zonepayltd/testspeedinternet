import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { pick } from "@/i18n/config";
import { localeFromParams, pageMetadata } from "@/i18n/server";
import { termsMessages } from "@/i18n/messages/legal/terms";

const PATH = "/terms";
const UPDATED = "2026-05-29";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const t = pick(termsMessages, locale);
  return pageMetadata({ locale, path: PATH, title: t.meta.title, description: t.meta.description });
}

export default async function TermsPage({ params }: Props) {
  const locale = await localeFromParams(params);
  return <LegalPage locale={locale} path={PATH} doc={pick(termsMessages, locale)} updated={UPDATED} />;
}
