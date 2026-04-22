import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { isLocale, type Locale, locales } from "../../../../i18n";
import { buildPageMetadata } from "@/lib/seo";
import { branchRestaurantSchema } from "@/lib/seo/schemas";
import { StructuredData } from "@/components/seo/StructuredData";
import { FadeIn } from "@/components/motion/FadeIn";
import { SectionHeading } from "@/components/motion/SectionHeading";
import { Link } from "@/lib/i18n/navigation";
import { Breadcrumb } from "@/components/menu/Breadcrumb";
import {
  branches,
  branchDistrict,
  branchMapsUrl,
  findBranch,
  formatPhone,
  isBranchSlug,
  OPENING_HOURS,
} from "@/data/branches";
import { buildContactLink } from "@/lib/whatsapp";

type Props = {
  params: { locale: string; slug: string };
};

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    branches.map((b) => ({ locale, slug: b.slug })),
  );
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  if (!isLocale(params.locale) || !isBranchSlug(params.slug)) return {};
  const branch = findBranch(params.slug);
  if (!branch) return {};
  const locale = params.locale as Locale;

  const tBranches = await getTranslations({
    locale: params.locale,
    namespace: "branchNames",
  });
  const t = await getTranslations({
    locale: params.locale,
    namespace: "pages.branchDetail",
  });
  const name = tBranches(branch.slug);
  const district = branchDistrict(branch, locale);

  return buildPageMetadata({
    title: t("title", { branch: name }),
    description: t("description", { branch: name, district }),
    path: `/branches/${branch.slug}`,
    locale,
  });
}

export default async function BranchDetailPage({ params }: Props) {
  if (!isLocale(params.locale) || !isBranchSlug(params.slug)) notFound();
  const branch = findBranch(params.slug);
  if (!branch) notFound();
  const locale = params.locale as Locale;
  setRequestLocale(locale);

  const t = await getTranslations("branchDetail");
  const tBranches = await getTranslations("branchNames");
  const tBranchesPage = await getTranslations("branchesPage");
  const tNav = await getTranslations("nav");
  const tCommon = await getTranslations("common");

  const name = tBranches(branch.slug);
  const district = branchDistrict(branch, locale);
  const hasPhone = Boolean(branch.phone);

  return (
    <section className="py-section-y">
      <StructuredData data={branchRestaurantSchema(branch, locale)} />

      <div className="mx-auto max-w-3xl px-6">
        <FadeIn>
          <Breadcrumb
            items={[
              { href: "/branches", label: tNav("branches") },
              { label: name },
            ]}
          />
        </FadeIn>

        <FadeIn delay={0.1} className="mt-10">
          <SectionHeading
            plain={t("heading.plain")}
            pill={name}
            subhead={district}
            as="h1"
            align="left"
          />
        </FadeIn>

        <FadeIn delay={0.25} className="mt-12">
          <dl className="grid gap-6 rounded-xl border border-cs-text/10 bg-cs-surface p-6 sm:grid-cols-2 sm:p-8">
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-cs-text-muted">
                {tBranchesPage("hoursLabel")}
              </dt>
              <dd className="mt-2 font-display text-xl font-black text-cs-blue-deep md:text-2xl">
                {tBranchesPage("hoursDaily", {
                  open: OPENING_HOURS.openLocal,
                  close: OPENING_HOURS.closeLocal,
                })}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-cs-text-muted">
                {tBranchesPage("phoneLabel")}
              </dt>
              <dd
                className="mt-2 font-mono text-lg text-cs-blue-deep md:text-xl"
                dir="ltr"
              >
                {hasPhone
                  ? formatPhone(branch.phone)
                  : tBranchesPage("phonePending")}
              </dd>
            </div>
          </dl>
        </FadeIn>

        <FadeIn delay={0.35} className="mt-8 flex flex-wrap gap-3">
          {hasPhone ? (
            <a
              href={buildContactLink(branch.phone)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 items-center justify-center rounded-pill bg-cs-gold px-6 py-3.5 text-base font-semibold text-cs-on-gold transition-transform hover:scale-[1.02] hover:bg-cs-gold-soft"
            >
              {tCommon("orderNow")}
            </a>
          ) : (
            <span className="inline-flex flex-1 items-center justify-center rounded-pill border border-cs-text/15 px-6 py-3.5 text-base text-cs-text-muted">
              {tCommon("comingSoon")}
            </span>
          )}
          <a
            href={branchMapsUrl(branch, locale)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-1 items-center justify-center rounded-pill border border-cs-text/15 px-6 py-3.5 text-base font-semibold text-cs-blue-deep transition-colors hover:border-cs-blue hover:text-cs-blue"
          >
            {tBranchesPage("openOnMap")}
          </a>
        </FadeIn>

        <FadeIn delay={0.5} className="mt-14 flex justify-center">
          <Link
            href="/branches"
            className="inline-flex items-center gap-2 text-sm font-semibold text-cs-blue transition-colors hover:text-cs-blue-deep"
          >
            <span aria-hidden>←</span>
            {t("backToAll")}
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
