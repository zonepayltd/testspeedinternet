import type { Metadata } from "next";
import SpeedToolPage, { TOOL_CONFIG } from "@/components/SpeedToolPage";
import { pick } from "@/i18n/config";
import { localeFromParams, pageMetadata } from "@/i18n/server";
import { toolsMessages } from "@/i18n/messages/tools";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const { meta } = pick(toolsMessages, locale).pages.ping;
  return pageMetadata({
    locale,
    path: TOOL_CONFIG.ping.path,
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    absoluteTitle: true,
  });
}

export default async function Page({ params }: Props) {
  const locale = await localeFromParams(params);
  return <SpeedToolPage locale={locale} tool="ping" />;
}
