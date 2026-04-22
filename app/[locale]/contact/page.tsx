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
    namespace: "pages.contact",
  });
  return buildPageMetadata({
    title: t("title"),
    description: t("description"),
    path: "/contact",
    locale: params.locale as Locale,
  });
}

export default async function ContactPage({ params }: Props) {
  if (!isLocale(params.locale)) notFound();
  setRequestLocale(params.locale);

  const t = await getTranslations("contactPage");

  return (
    <section className="py-section-y">
      <div className="mx-auto max-w-2xl px-6">
        <FadeIn>
          <SectionHeading
            plain={t("heading.plain")}
            pill={t("heading.pill")}
            subhead={t("subhead")}
            as="h1"
          />
        </FadeIn>

        <FadeIn delay={0.2} className="mt-12 grid gap-4">
          <a
            href="https://www.instagram.com/chahine.seafood.lb/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-lg border border-cs-text/10 bg-cs-surface p-6 transition-colors hover:-translate-y-0.5 hover:border-cs-blue/40 hover:shadow-md"
          >
            <div>
              <p className="font-display text-sm uppercase tracking-wider text-cs-text-muted">
                Instagram
              </p>
              <p className="mt-1 font-display text-lg font-black text-cs-text">
                @chahine.seafood.lb
              </p>
            </div>
            <span aria-hidden className="text-cs-blue">→</span>
          </a>
        </FadeIn>

        <FadeIn delay={0.35} className="mt-8 flex justify-center">
          <LinkButton href="/branches">{t("branchesCta")}</LinkButton>
        </FadeIn>
      </div>
    </section>
  );
}
