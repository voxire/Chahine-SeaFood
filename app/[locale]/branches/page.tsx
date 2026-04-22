import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { isLocale, type Locale } from "../../../i18n";
import { buildPageMetadata } from "@/lib/seo";
import { FadeIn } from "@/components/motion/FadeIn";
import { SectionHeading } from "@/components/motion/SectionHeading";
import { LinkButton } from "@/components/ui/Button";
import { branches } from "@/data/branches";
import { BranchCard } from "@/components/branches/BranchCard";
import { BranchesMap } from "@/components/branches/BranchesMap";

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
  const locale = params.locale as Locale;
  setRequestLocale(locale);

  const t = await getTranslations("branchesPage");
  const tBranchNames = await getTranslations("branchNames");
  const tCommon = await getTranslations("common");

  // Pre-translate branch names + popup labels here (server) so the map's
  // client component doesn't need its own translation context.
  const branchLabels = Object.fromEntries(
    branches.map((b) => [b.slug, tBranchNames(b.slug)]),
  );
  const mapLabels = {
    orderOnWhatsapp: tCommon("orderNow"),
    openOnMap: t("openOnMap"),
    phonePending: t("phonePending"),
  };

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

        {/* Interactive Lebanon map with 10 pins. Responsive height. */}
        <FadeIn delay={0.2}>
          <BranchesMap
            locale={locale}
            branchLabels={branchLabels}
            labels={mapLabels}
            className="mt-16 h-[380px] md:h-[520px]"
          />
        </FadeIn>

        {/* Card grid (keeps mobile users a one-tap list). */}
        <FadeIn delay={0.3} className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {branches.map((branch, i) => (
            <FadeIn key={branch.slug} delay={0.04 * i}>
              <BranchCard branch={branch} locale={locale} />
            </FadeIn>
          ))}
        </FadeIn>

        <FadeIn delay={0.6} className="mt-16 flex justify-center">
          <LinkButton href="/contact" variant="ghost">
            {t("contactCta")}
          </LinkButton>
        </FadeIn>
      </div>
    </section>
  );
}
