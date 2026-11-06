import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { pick } from "@/i18n/config";
import { localeFromParams, pageMetadata } from "@/i18n/server";
import { editorialMessages } from "@/i18n/messages/legal/editorial";

const PATH = "/editorial-policy";
const UPDATED = "2026-11-06";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const t = pick(editorialMessages, locale);
  return pageMetadata({ locale, path: PATH, title: t.meta.title, description: t.meta.description });
}

export default async function EditorialPolicyPage({ params }: Props) {
  const locale = await localeFromParams(params);
  return <LegalPage locale={locale} path={PATH} doc={pick(editorialMessages, locale)} updated={UPDATED} />;
}
