import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { isLocale, type Locale, locales } from "../../../../i18n";
import { buildPageMetadata } from "@/lib/seo";
import {
  categories,
  isCategorySlug,
  type CategoryKey,
} from "@/data/categories";
import { MenuPageBody } from "@/components/menu/MenuPageBody";

type Props = {
  params: { locale: string; category: string };
};

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    categories.map((c) => ({ locale, category: c.slug })),
  );
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  if (!isLocale(params.locale) || !isCategorySlug(params.category)) return {};
  const tCategories = await getTranslations({
    locale: params.locale,
    namespace: "categories",
  });
  const t = await getTranslations({
    locale: params.locale,
    namespace: "pages.menuCategory",
  });
  return buildPageMetadata({
    title: `${tCategories(params.category as CategoryKey)} · ${t("titleSuffix")}`,
    description: t("description", {
      category: tCategories(params.category as CategoryKey),
    }),
    path: `/menu/${params.category}`,
    locale: params.locale as Locale,
  });
}

/**
 * Category route — renders the same unified menu body as `/menu`, but
 * lands at the requested category section. Each category URL stays a
 * legitimate, indexable, share-able URL (with its own metadata + canonical),
 * even though structurally it shows the full menu.
 */
export default async function CategoryPage({ params }: Props) {
  if (!isLocale(params.locale) || !isCategorySlug(params.category)) {
    notFound();
  }
  setRequestLocale(params.locale);

  return (
    <MenuPageBody
      locale={params.locale as Locale}
      initialCategory={params.category as CategoryKey}
    />
  );
}
