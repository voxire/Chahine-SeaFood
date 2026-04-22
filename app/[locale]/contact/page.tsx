import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { isLocale, type Locale } from "../../../i18n";
import { buildPageMetadata } from "@/lib/seo";
import { FadeIn } from "@/components/motion/FadeIn";
import { SectionHeading } from "@/components/motion/SectionHeading";
import { LinkButton } from "@/components/ui/Button";
import {
  branches,
  branchDistrict,
  formatPhone,
  OPENING_HOURS,
} from "@/data/branches";
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
  const locale = params.locale as Locale;
  setRequestLocale(locale);

  const t = await getTranslations("contactPage");
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

        {/* Chain-wide hours strip */}
        <FadeIn delay={0.15} className="mt-12">
          <div className="mx-auto max-w-xl rounded-xl border border-cs-text/10 bg-cs-surface px-6 py-5 text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-cs-text-muted">
              {t("hoursLabel")}
            </p>
            <p className="mt-2 font-display text-xl font-black text-cs-blue-deep md:text-2xl">
              {t("hoursDaily", {
                open: OPENING_HOURS.openLocal,
                close: OPENING_HOURS.closeLocal,
              })}
            </p>
          </div>
        </FadeIn>

        {/* Social channels */}
        <FadeIn delay={0.25} className="mt-14">
          <h2 className="font-display text-2xl font-black uppercase text-cs-blue-deep md:text-3xl">
            {t("socialsHeading")}
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-cs-text-muted md:text-base">
            {t("socialsHint")}
          </p>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <a
              href="https://www.instagram.com/chahine.seafood.lb/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-xl border border-cs-text/10 bg-cs-surface p-5 transition-all hover:-translate-y-0.5 hover:border-cs-blue/40 hover:shadow-md"
            >
              <div>
                <p className="font-display text-xs uppercase tracking-wider text-cs-text-muted">
                  Instagram
                </p>
                <p className="mt-1 font-display text-lg font-black text-cs-blue-deep">
                  @chahine.seafood.lb
                </p>
              </div>
              <span aria-hidden className="text-cs-blue">→</span>
            </a>

            <a
              href="https://chahineseafood.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-xl border border-cs-text/10 bg-cs-surface p-5 transition-all hover:-translate-y-0.5 hover:border-cs-blue/40 hover:shadow-md"
            >
              <div>
                <p className="font-display text-xs uppercase tracking-wider text-cs-text-muted">
                  {t("websiteLabel")}
                </p>
                <p className="mt-1 font-display text-lg font-black text-cs-blue-deep">
                  chahineseafood.com
                </p>
              </div>
              <span aria-hidden className="text-cs-blue">→</span>
            </a>
          </div>
        </FadeIn>

        {/* WhatsApp quick-connect per branch */}
        <FadeIn delay={0.35} className="mt-14">
          <h2 className="font-display text-2xl font-black uppercase text-cs-blue-deep md:text-3xl">
            {t("branchesHeading")}
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-cs-text-muted md:text-base">
            {t("branchesHint")}
          </p>

          <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {branches.map((branch) => {
              const hasPhone = Boolean(branch.phone);
              const name = tBranches(branch.slug);
              const district = branchDistrict(branch, locale);

              const body = (
                <>
                  <div>
                    <p className="font-display text-base font-black uppercase text-cs-blue-deep">
                      {name}
                    </p>
                    <p className="mt-0.5 text-xs text-cs-text-muted">{district}</p>
                    {hasPhone ? (
                      <p
                        className="mt-1 font-mono text-xs text-cs-text-muted"
                        dir="ltr"
                      >
                        {formatPhone(branch.phone)}
                      </p>
                    ) : null}
                  </div>
                  <span
                    aria-hidden
                    className={
                      hasPhone ? "text-cs-blue" : "text-cs-text-muted/50"
                    }
                  >
                    →
                  </span>
                </>
              );

              return (
                <li key={branch.slug}>
                  {hasPhone ? (
                    <a
                      href={buildContactLink(branch.phone)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start justify-between gap-3 rounded-xl border border-cs-text/10 bg-cs-surface p-4 transition-all hover:-translate-y-0.5 hover:border-cs-blue/40 hover:shadow-md"
                      aria-label={`${tCommon("orderNow")} — ${name}`}
                    >
                      {body}
                    </a>
                  ) : (
                    <div className="flex items-start justify-between gap-3 rounded-xl border border-cs-text/10 bg-cs-surface/60 p-4 opacity-60">
                      {body}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </FadeIn>

        <FadeIn delay={0.5} className="mt-14 flex justify-center">
          <LinkButton href="/branches" variant="ghost">
            {t("branchesCta")}
          </LinkButton>
        </FadeIn>
      </div>
    </section>
  );
}
