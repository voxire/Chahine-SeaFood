import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { isLocale, type Locale, locales } from "../../../../i18n";
import { buildPageMetadata } from "@/lib/seo";
import { FadeIn } from "@/components/motion/FadeIn";
import { SectionHeading } from "@/components/motion/SectionHeading";
import { Link } from "@/lib/i18n/navigation";
import {
  categories,
  isCategorySlug,
  type CategoryKey,
} from "@/data/categories";
import { itemsByCategory } from "@/data/menu";
import { ItemCard } from "@/components/menu/ItemCard";

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

export default async function CategoryPage({ params }: Props) {
  if (!isLocale(params.locale) || !isCategorySlug(params.category)) {
    notFound();
  }
  const locale = params.locale as Locale;
  setRequestLocale(locale);

  const tCategories = await getTranslations("categories");
  const t = await getTranslations("menuCategory");
  const category = params.category as CategoryKey;
  const items = itemsByCategory(category);

  return (
    <section className="py-section-y">
      <div className="mx-auto max-w-container px-6">
        <FadeIn>
          <SectionHeading
            plain={t("heading.plain")}
            pill={tCategories(category)}
            subhead={t("subhead", { count: items.length })}
            as="h1"
          />
        </FadeIn>

        {items.length === 0 ? (
          <FadeIn delay={0.2} className="mt-16 text-center">
            <p className="mx-auto max-w-md text-sm text-cs-text-muted">
              {t("empty")}
            </p>
          </FadeIn>
        ) : (
          <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item, i) => (
              <FadeIn key={item.slug} delay={0.05 + i * 0.04}>
                <Link
                  href={`/menu/${category}/${item.slug}`}
                  className="block h-full"
                  aria-label={locale === "ar" ? item.name_ar : item.name_en}
                >
                  <ItemCard item={item} locale={locale} />
                </Link>
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
