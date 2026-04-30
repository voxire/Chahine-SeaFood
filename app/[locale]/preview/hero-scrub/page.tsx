import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

import { isLocale, type Locale } from "../../../../i18n";
import { HeroScrub } from "@/components/sections/HeroScrub";

type Props = {
  params: { locale: string };
};

/**
 * Sandbox preview route for the new pinned hero scroll-scrub.
 *
 * Lives under `/preview/*` — intentionally NOT added to the navbar,
 * sitemap, or hreflang alternates. This is a private review surface
 * for getting motion-feel feedback before committing to a wider
 * sequence of sections in the same vocabulary.
 *
 * `robots: noindex` keeps it out of search indexes even if the URL
 * leaks. Once the design lands on `/`, this route will be deleted.
 */
export const metadata: Metadata = {
  title: "Preview · Hero Scrub",
  robots: { index: false, follow: false },
};

export default function HeroScrubPreviewPage({ params }: Props) {
  if (!isLocale(params.locale)) notFound();
  setRequestLocale(params.locale);

  return (
    <main>
      <HeroScrub locale={params.locale as Locale} />

      {/* Trailing spacer so you can scroll past the pinned stage and
          confirm release behaviour. */}
      <section className="bg-cs-surface-2 py-section-y">
        <div className="mx-auto max-w-container px-6 text-center">
          <p className="font-display text-sm font-black uppercase tracking-wider text-cs-text-muted">
            End of pinned runway · scroll-scrub releases here
          </p>
        </div>
      </section>
    </main>
  );
}
