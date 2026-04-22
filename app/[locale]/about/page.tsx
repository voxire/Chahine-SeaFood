import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { isLocale, type Locale } from "../../../i18n";
import { buildPageMetadata } from "@/lib/seo";
import { FadeIn } from "@/components/motion/FadeIn";
import { SectionHeading } from "@/components/motion/SectionHeading";
import { LinkButton } from "@/components/ui/Button";

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
  const locale = params.locale as Locale;
  setRequestLocale(locale);

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

        {/* Pull-quote tagline */}
        <FadeIn delay={0.15}>
          <p className="mt-12 font-display text-2xl font-black leading-tight text-cs-blue md:text-3xl">
            {t("tagline")}
          </p>
        </FadeIn>

        <FadeIn
          delay={0.25}
          className="mt-8 space-y-6 text-base leading-relaxed text-cs-text md:text-lg"
        >
          <p>{t("paragraphs.one")}</p>
          <p>{t("paragraphs.two")}</p>
          <p>{t("paragraphs.three")}</p>
        </FadeIn>

        {/* Fact strip */}
        <FadeIn delay={0.4} className="mt-12">
          <div className="grid grid-cols-3 gap-2 rounded-xl border border-cs-text/10 bg-cs-surface-2 p-6 text-center">
            <div>
              <p className="font-display text-3xl font-black text-cs-blue md:text-4xl">
                10
              </p>
              <p className="mt-1 text-xs uppercase tracking-wider text-cs-text-muted">
                {t("stats.branches")}
              </p>
            </div>
            <div>
              <p className="font-display text-3xl font-black text-cs-blue md:text-4xl">
                68K+
              </p>
              <p className="mt-1 text-xs uppercase tracking-wider text-cs-text-muted">
                {t("stats.followers")}
              </p>
            </div>
            <div>
              <p className="font-display text-3xl font-black text-cs-blue md:text-4xl">
                12–00
              </p>
              <p className="mt-1 text-xs uppercase tracking-wider text-cs-text-muted">
                {t("stats.hours")}
              </p>
            </div>
          </div>
        </FadeIn>

        <FadeIn
          delay={0.55}
          className="mt-12 flex flex-wrap justify-center gap-4"
        >
          <LinkButton href="/menu">{t("ctaMenu")}</LinkButton>
          <LinkButton href="/branches" variant="ghost">
            {t("ctaBranches")}
          </LinkButton>
        </FadeIn>
      </div>
    </section>
  );
}
