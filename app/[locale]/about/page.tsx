import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { isLocale, type Locale } from "../../../i18n";
import { buildPageMetadata } from "@/lib/seo";
import { FadeIn } from "@/components/motion/FadeIn";
import { SectionHeading } from "@/components/motion/SectionHeading";

type Props = {
  params: { locale: string };
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  const t = await getTranslations({
    locale: params.locale,
    namespace: "pages.about",
  });
  return buildPageMetadata({
    title: t("title"),
    description: t("description"),
    path: "/about",
    locale: params.locale as Locale,
  });
}

export default async function AboutPage({ params }: Props) {
  if (!isLocale(params.locale)) notFound();
  setRequestLocale(params.locale);

  const t = await getTranslations("aboutPage");

  return (
    <section className="py-section-y">
      <div className="mx-auto max-w-3xl px-6">
        <FadeIn>
          <SectionHeading
            plain={t("heading.plain")}
            pill={t("heading.pill")}
            as="h1"
          />
        </FadeIn>

        <FadeIn delay={0.2} className="mt-12 space-y-6 text-base leading-relaxed text-cs-text-muted md:text-lg">
          <p>{t("paragraphs.one")}</p>
          <p>{t("paragraphs.two")}</p>
          <p>{t("paragraphs.three")}</p>
        </FadeIn>
      </div>
    </section>
  );
}
