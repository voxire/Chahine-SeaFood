import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { isLocale, type Locale, locales } from "../../../../../i18n";
import { buildPageMetadata } from "@/lib/seo";
import { menuItemSchema } from "@/lib/seo/schemas";
import { StructuredData } from "@/components/seo/StructuredData";
import { formatLBP } from "@/lib/format";
import { FadeIn } from "@/components/motion/FadeIn";
import { Link } from "@/lib/i18n/navigation";
import {
  categories,
  isCategorySlug,
  type CategoryKey,
} from "@/data/categories";
import { menu, itemsByCategory, findItem } from "@/data/menu";
import { ItemCard } from "@/components/menu/ItemCard";
import { BranchPicker } from "@/components/menu/BranchPicker";
import { Breadcrumb } from "@/components/menu/Breadcrumb";

type Props = {
  params: { locale: string; category: string; item: string };
};

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    menu.map((item) => ({
      locale,
      category: item.category,
      item: item.slug,
    })),
  );
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  if (!isLocale(params.locale) || !isCategorySlug(params.category)) return {};
  const item = findItem(params.category as CategoryKey, params.item);
  if (!item) return {};

  const locale = params.locale as Locale;
  const name = locale === "ar" ? item.name_ar : item.name_en;
  const description =
    locale === "ar" ? item.description_ar : item.description_en;
  const price = formatLBP(item.price, locale);

  return buildPageMetadata({
    title: name,
    description:
      locale === "ar"
        ? `${description} · ${price}. اطلب من أقرب فرع شاهين سيفود عبر واتساب.`
        : `${description} · ${price}. Order from your nearest Chahine Seafood branch on WhatsApp.`,
    path: `/menu/${params.category}/${params.item}`,
    locale,
  });
}

export default async function ItemDetailPage({ params }: Props) {
  if (!isLocale(params.locale) || !isCategorySlug(params.category)) {
    notFound();
  }
  const locale = params.locale as Locale;
  setRequestLocale(locale);

  const category = params.category as CategoryKey;
  const item = findItem(category, params.item);
  if (!item) notFound();

  const t = await getTranslations("itemDetail");
  const tCategories = await getTranslations("categories");
  const tNav = await getTranslations("nav");

  const name = locale === "ar" ? item.name_ar : item.name_en;
  const description =
    locale === "ar" ? item.description_ar : item.description_en;

  // Related items = up to 3 other items from the same category, sorted.
  const related = itemsByCategory(category)
    .filter((i) => i.slug !== item.slug)
    .slice(0, 3);

  const tagLabels: Record<Locale, Record<string, string>> = {
    en: { signature: "Signature", new: "New", spicy: "Spicy" },
    ar: { signature: "مميّز", new: "جديد", spicy: "حار" },
  };

  return (
    <section className="py-section-y">
      <StructuredData data={menuItemSchema(item, locale)} />
      <div className="mx-auto max-w-container px-6">
        <FadeIn>
          <Breadcrumb
            items={[
              { href: "/menu", label: tNav("menu") },
              { href: `/menu/${category}`, label: tCategories(category) },
              { label: name },
            ]}
          />
        </FadeIn>

        {/* Main item block */}
        <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-[5fr_6fr] md:items-start">
          <FadeIn>
            {/* Image placeholder — swap for <Image src={item.imageSrc} /> when
                the cutout PNG arrives at public/menu/{category}/{slug}.png. */}
            <div className="cs-spotlight relative aspect-square overflow-hidden rounded-xl bg-cs-surface ring-1 ring-cs-text/5">
              <div className="flex h-full items-center justify-center p-8 text-center">
                <span className="font-display text-xs uppercase tracking-[0.2em] text-cs-text-muted md:text-sm">
                  {t("imagePlaceholder")}
                </span>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.12}>
            <div className="flex flex-col gap-6">
              {item.tags?.length ? (
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-pill bg-cs-gold-soft/25 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cs-on-gold"
                    >
                      {tagLabels[locale][tag] ?? tag}
                    </span>
                  ))}
                </div>
              ) : null}

              <h1 className="font-display text-4xl font-black uppercase leading-tight text-cs-blue-deep md:text-5xl lg:text-6xl">
                {name}
              </h1>

              <p className="text-base leading-relaxed text-cs-text-muted md:text-lg">
                {description}
              </p>

              <div className="flex items-baseline gap-3 pt-2">
                <span className="text-xs uppercase tracking-wider text-cs-text-muted">
                  {t("priceLabel")}
                </span>
                <span
                  className="font-display text-3xl font-black text-cs-blue md:text-4xl"
                  aria-label={`${name} price`}
                >
                  {formatLBP(item.price, locale)}
                </span>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Branch picker */}
        <FadeIn delay={0.2} className="mt-16">
          <div className="border-t border-cs-text/10 pt-12">
            <h2 className="font-display text-2xl font-black uppercase leading-tight text-cs-blue-deep md:text-3xl">
              {t("orderFromBranch")}
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-cs-text-muted md:text-base">
              {t("orderFromBranchHint")}
            </p>
            <div className="mt-8">
              <BranchPicker item={item} locale={locale} />
            </div>
          </div>
        </FadeIn>

        {/* Related */}
        {related.length > 0 ? (
          <FadeIn delay={0.3} className="mt-16">
            <div className="border-t border-cs-text/10 pt-12">
              <h2 className="font-display text-2xl font-black uppercase leading-tight text-cs-blue-deep md:text-3xl">
                {t("related.heading", { category: tCategories(category) })}
              </h2>

              <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
                {related.map((r, i) => (
                  <FadeIn key={r.slug} delay={0.04 * i}>
                    <Link
                      href={`/menu/${r.category}/${r.slug}`}
                      className="block h-full"
                    >
                      <ItemCard item={r} locale={locale} />
                    </Link>
                  </FadeIn>
                ))}
              </div>
            </div>
          </FadeIn>
        ) : null}

        {/* Back link */}
        <FadeIn delay={0.4} className="mt-14 flex justify-center">
          <Link
            href={`/menu/${category}`}
            className="inline-flex min-h-[44px] items-center gap-2 px-2 text-base font-semibold text-cs-blue transition-colors hover:text-cs-blue-deep"
          >
            <span aria-hidden className="rtl:rotate-180">←</span>
            {t("backToCategory", { category: tCategories(category) })}
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
