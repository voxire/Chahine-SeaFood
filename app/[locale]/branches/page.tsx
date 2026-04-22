import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { isLocale, type Locale } from "../../../i18n";
import { buildPageMetadata } from "@/lib/seo";
import { FadeIn } from "@/components/motion/FadeIn";
import { SectionHeading } from "@/components/motion/SectionHeading";
import { LinkButton } from "@/components/ui/Button";
import { branches } from "@/data/branches";
import { buildContactLink } from "@/lib/whatsapp";

type Props = {
  params: { locale: string };
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  const t = await getTranslations({
    locale: params.locale,
    namespace: "pages.branches",
  });
  return buildPageMetadata({
    title: t("title"),
    description: t("description"),
    path: "/branches",
    locale: params.locale as Locale,
  });
}

export default async function BranchesPage({ params }: Props) {
  if (!isLocale(params.locale)) notFound();
  setRequestLocale(params.locale);

  const t = await getTranslations("branchesPage");
  const tBranches = await getTranslations("branchNames");
  const tCommon = await getTranslations("common");

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
          className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {branches.map((b) => (
            <article
              key={b.slug}
              className="flex flex-col justify-between rounded-lg border border-cs-text/10 bg-cs-surface p-6"
            >
              <header>
                <h2 className="font-display text-xl font-black uppercase leading-none text-cs-text">
                  {tBranches(b.slug)}
                </h2>
                <p className="mt-2 text-sm text-cs-text-muted">
                  {b.phone
                    ? `+${b.phone.replace(/^(\d{3})/, "$1 ").trim()}`
                    : t("phonePending")}
                </p>
              </header>
              <div className="mt-6">
                {b.phone ? (
                  <a
                    href={buildContactLink(b.phone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-pill bg-cs-gold px-4 py-2 text-sm font-semibold text-cs-bg transition-transform hover:scale-[1.02]"
                  >
                    {tCommon("orderNow")}
                  </a>
                ) : (
                  <span className="inline-flex items-center rounded-pill border border-cs-text/20 px-4 py-2 text-sm text-cs-text-muted">
                    {tCommon("comingSoon")}
                  </span>
                )}
              </div>
            </article>
          ))}
        </FadeIn>

        <FadeIn delay={0.5} className="mt-16 flex justify-center">
          <LinkButton href="/contact" variant="ghost">
            {t("contactCta")}
          </LinkButton>
        </FadeIn>
      </div>
    </section>
  );
}
