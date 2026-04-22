import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { isLocale, type Locale } from "../../../i18n";
import { buildPageMetadata } from "@/lib/seo";
import { FadeIn } from "@/components/motion/FadeIn";
import { SectionHeading } from "@/components/motion/SectionHeading";
import { Link } from "@/lib/i18n/navigation";
import { categories } from "@/data/categories";

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

  const t = await getTranslations("menu");
  const tCategories = await getTranslations("categories");

  return (
    <section className="py-section-y">
      <div className="mx-auto max-w-container px-6">
        <FadeIn>
          <SectionHeading
            plain={t("heading.plain")}
            pill={t("heading.pill")}
            subhead={t("subhead")}
            as="h1"
          />
        </FadeIn>

        <FadeIn
          delay={0.2}
          className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-3"
        >
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/menu/${c.slug}`}
              className="group block rounded-lg border border-cs-text/10 bg-cs-surface/40 p-10 text-center transition-colors hover:border-cs-gold/60 hover:bg-cs-surface"
            >
              <span className="block font-display text-lg font-black uppercase leading-none text-cs-text transition-colors group-hover:text-cs-gold md:text-xl">
                {tCategories(c.slug)}
              </span>
            </Link>
          ))}
        </FadeIn>
      </div>
    </section>
  );
}
