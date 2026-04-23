import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { isLocale, type Locale, locales } from "../../../../i18n";
import { buildPageMetadata } from "@/lib/seo";
import { branchRestaurantSchema, faqPageSchema } from "@/lib/seo/schemas";
import { StructuredData } from "@/components/seo/StructuredData";
import { FadeIn } from "@/components/motion/FadeIn";
import { SectionHeading } from "@/components/motion/SectionHeading";
import { Link } from "@/lib/i18n/navigation";
import { Breadcrumb } from "@/components/menu/Breadcrumb";
import {
  branchDistrict,
  branchFacts,
  branchMapsUrl,
  branches,
  findBranch,
  formatPhone,
  isBranchSlug,
  type BranchFacts,
} from "@/data/branches";
import { buildContactLink } from "@/lib/whatsapp";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://chahineseafood.com";

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
  const facts = branchFacts(branch.slug);

  const parkingLabel = resolveParkingLabel(facts.parking, (k) =>
    t(`facts.parking${k}`),
  );
  const dineInLabel = facts.dineIn
    ? t("facts.dineInYes")
    : t("facts.dineInNo");
  const deliveryLabel = facts.delivery
    ? t("facts.deliveryYes")
    : t("facts.deliveryNo");

  // Build the FAQ entries once so they can populate both the visible
  // accordion and the FAQPage JSON-LD (§9.1 AEO — same source of truth).
  const faqEntries: { question: string; answer: string }[] = [
    {
      question: t("faq.openQ", { branch: name }),
      answer: t("faq.openA"),
    },
    {
      question: t("faq.orderQ", { branch: name }),
      answer: t("faq.orderA", { branch: name }),
    },
    {
      question: t("faq.dineQ", { branch: name }),
      answer: facts.dineIn
        ? t("faq.dineAYes", { branch: name })
        : t("faq.dineANo", { branch: name }),
    },
    {
      question: t("faq.parkingQ", { branch: name }),
      answer: resolveParkingAnswer(facts.parking, name, (k, v) =>
        t(`faq.parkingA${k}`, v),
      ),
    },
    {
      question: t("faq.deliveryQ", { branch: name }),
      answer: facts.delivery
        ? t("faq.deliveryAYes", { branch: name })
        : t("faq.deliveryANo", { branch: name }),
    },
  ];

  const faqPageUrl = `${SITE_URL}/${locale}/branches/${branch.slug}`;

  return (
    <section className="py-section-y">
      <StructuredData data={branchRestaurantSchema(branch, locale)} />
      <StructuredData data={faqPageSchema(faqEntries, faqPageUrl)} />

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
                {tBranchesPage("hoursDaily")}
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

        {/* Per-branch facts — literal, AEO-friendly detail for both
            readers and LLM indexers. See CLAUDE.md §9.1. */}
        <FadeIn delay={0.4} className="mt-14">
          <h2 className="font-display text-xl font-black uppercase tracking-wide text-cs-blue-deep md:text-2xl">
            {t("factsHeading")}
          </h2>
          <dl className="mt-6 grid gap-5 rounded-xl border border-cs-text/10 bg-cs-surface p-6 sm:grid-cols-2 sm:p-8">
            <FactRow label={t("facts.dineInLabel")} value={dineInLabel} />
            <FactRow label={t("facts.deliveryLabel")} value={deliveryLabel} />
            <FactRow label={t("facts.parkingLabel")} value={parkingLabel} />
            <FactRow
              label={t("facts.signaturesLabel")}
              value={facts.signatures.map(toHumanSignature).join(" · ")}
            />
          </dl>
        </FadeIn>

        {/* FAQ block — rendered as open <details>/<summary> so the first
            paint already shows the answers without JS, and the same Q&A
            content feeds the FAQPage JSON-LD above. */}
        <FadeIn delay={0.45} className="mt-14">
          <h2 className="font-display text-xl font-black uppercase tracking-wide text-cs-blue-deep md:text-2xl">
            {t("faqHeading")}
          </h2>
          <div className="mt-6 divide-y divide-cs-text/10 rounded-xl border border-cs-text/10 bg-cs-surface">
            {faqEntries.map((entry, i) => (
              <details key={i} className="group px-6 py-5 sm:px-8" open={i === 0}>
                <summary className="cursor-pointer list-none font-display text-base font-black uppercase tracking-wide text-cs-blue-deep marker:hidden md:text-lg">
                  <span className="flex items-center justify-between gap-4">
                    <span>{entry.question}</span>
                    <span
                      aria-hidden
                      className="text-cs-blue transition-transform duration-200 ease-cs group-open:rotate-45"
                    >
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-3 text-base leading-relaxed text-cs-text-muted">
                  {entry.answer}
                </p>
              </details>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.5} className="mt-14 flex justify-center">
          <Link
            href="/branches"
            className="inline-flex min-h-[44px] items-center gap-2 px-2 text-base font-semibold text-cs-blue transition-colors hover:text-cs-blue-deep"
          >
            <span aria-hidden>←</span>
            {t("backToAll")}
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Helpers — kept at the module bottom so the page reads top-down.
// ---------------------------------------------------------------------------

function FactRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-[0.2em] text-cs-text-muted">
        {label}
      </dt>
      <dd className="mt-2 text-base leading-relaxed text-cs-blue-deep md:text-lg">
        {value}
      </dd>
    </div>
  );
}

function resolveParkingLabel(
  parking: BranchFacts["parking"],
  t: (key: "Street" | "Lot" | "Valet" | "None") => string,
): string {
  switch (parking) {
    case "lot":
      return t("Lot");
    case "valet":
      return t("Valet");
    case "none":
      return t("None");
    case "street":
    default:
      return t("Street");
  }
}

function resolveParkingAnswer(
  parking: BranchFacts["parking"],
  branch: string,
  t: (key: "Street" | "Lot" | "Valet" | "None", values: { branch: string }) => string,
): string {
  switch (parking) {
    case "lot":
      return t("Lot", { branch });
    case "valet":
      return t("Valet", { branch });
    case "none":
      return t("None", { branch });
    case "street":
    default:
      return t("Street", { branch });
  }
}

/**
 * Human-readable label for a signature-dish slug. Menu items are keyed
 * by slug in the CMS; until we wire up a proper lookup against the menu
 * collection, we split the slug on `-` and title-case it. Good enough
 * for the pitch demo; swap for a menu-item lookup once Sanity lands.
 */
function toHumanSignature(slug: string): string {
  return slug
    .split("-")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}
