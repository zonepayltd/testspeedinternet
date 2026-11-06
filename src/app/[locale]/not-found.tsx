import type { Metadata } from "next";
import NotFoundView from "@/components/NotFoundView";
import { pick } from "@/i18n/config";
import { getLocale } from "@/i18n/server";
import { errorMessages } from "@/i18n/messages/errors";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: pick(errorMessages, locale).notFound.metaTitle,
    robots: { index: false, follow: true },
  };
}

export default async function NotFound() {
  return <NotFoundView locale={await getLocale()} />;
}
