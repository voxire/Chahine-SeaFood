import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { isLocale, type Locale } from "../../../i18n";
import { buildPageMetadata } from "@/lib/seo";
import { MenuPageBody } from "@/components/menu/MenuPageBody";

type Props = {
  params: { locale: string };
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  const t = await getTranslations({
    locale: params.locale,
    namespace: "pages.menu",
  });
  return buildPageMetadata({
    title: t("title"),
    description: t("description"),
    path: "/menu",
    locale: params.locale as Locale,
  });
}

export default async function MenuPage({ params }: Props) {
  if (!isLocale(params.locale)) notFound();
  setRequestLocale(params.locale);

  return <MenuPageBody locale={params.locale as Locale} />;
}
