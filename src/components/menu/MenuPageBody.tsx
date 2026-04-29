import { getTranslations } from "next-intl/server";

import type { Locale } from "../../../i18n";
import { FadeIn } from "@/components/motion/FadeIn";
import { SectionHeading } from "@/components/motion/SectionHeading";
import { categories, type CategoryKey } from "@/data/categories";
import { itemsByCategory } from "@/data/menu";
import { MenuNavigator } from "@/components/menu/MenuNavigator";
import { MenuRowList } from "@/components/menu/MenuRowList";

type Props = {
  locale: Locale;
  /**
   * If set, the page mounts with this category scrolled into view and
   * marked active. Used by the `/menu/[category]` route so deep-link
   * URLs feel native.
   */
  initialCategory?: CategoryKey;
};

/**
 * Shared renderer for the unified `/menu` page (Direction 2 — two-pane
 * classic).
 *
 * Why a shared component?
 * ───────────────────────
 * `/menu` and `/menu/[category]` both render the same UI — every dish on
 * a single scrollable page, organised into 8 chapters. The only
 * difference is the initial scroll target: `/menu` lands at the top,
 * `/menu/sandwiches` lands at the Sandwiches section. Factoring this
 * into a shared component keeps the two routes from drifting.
 */
export async function MenuPageBody({ locale, initialCategory }: Props) {
  const t = await getTranslations({ locale, namespace: "menu" });
  const tCategories = await getTranslations({
    locale,
    namespace: "categories",
  });

  // Pre-compute every category's items + count once on the server.
  const sections = categories.map((c) => {
    const items = itemsByCategory(c.slug);
    return {
      slug: c.slug as CategoryKey,
      label: tCategories(c.slug),
      count: items.length,
      items,
    };
  });

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

        {/*
          Two-pane layout (md+): 220px sticky rail + flexible right pane.
          Mobile (<md): single column. The horizontal pill bar lives
          inside <MenuNavigator> and renders sticky above the list.
        */}
        <div
          className={[
            "mt-12 md:mt-16",
            "md:grid md:grid-cols-[220px_1fr] md:gap-12 lg:grid-cols-[240px_1fr] lg:gap-16",
          ].join(" ")}
        >
          <div className="md:col-start-1">
            <MenuNavigator
              initialCategory={initialCategory}
              categories={sections.map(({ slug, label, count }) => ({
                slug,
                label,
                count,
              }))}
            />
          </div>

          <div className="md:col-start-2 md:min-w-0">
            <FadeIn delay={0.1}>
              <p className="mb-10 max-w-prose text-sm leading-relaxed text-cs-text-muted md:mb-12 md:text-base">
                {t("rail.hint")}
              </p>
            </FadeIn>

            <div className="space-y-16 md:space-y-24">
              {sections.map((section, idx) => (
                <FadeIn
                  key={section.slug}
                  delay={Math.min(idx, 4) * 0.05}
                >
                  <section
                    id={section.slug}
                    data-category-section={section.slug}
                    aria-labelledby={`${section.slug}-heading`}
                    className="scroll-mt-[140px] md:scroll-mt-[120px]"
                  >
                    {/* Chapter header */}
                    <header className="mb-6 flex items-end justify-between gap-4 border-b-2 border-cs-blue-deep pb-3 md:mb-8 md:pb-4">
                      <h2
                        id={`${section.slug}-heading`}
                        className="font-display text-2xl font-black uppercase leading-none text-cs-text md:text-3xl lg:text-4xl"
                      >
                        {section.label}
                      </h2>
                      <span
                        className="shrink-0 font-display text-xs font-black uppercase tracking-wider text-cs-text-muted md:text-sm"
                        aria-label={t("section.countLabel", {
                          count: section.count,
                        })}
                      >
                        {section.count}{" "}
                        <span className="text-cs-text-muted/60">
                          {t("section.itemsLabel")}
                        </span>
                      </span>
                    </header>

                    {section.items.length === 0 ? (
                      <p className="py-6 text-sm text-cs-text-muted">
                        {t("section.empty")}
                      </p>
                    ) : (
                      <MenuRowList
                        items={section.items}
                        locale={locale}
                        signatureLabel={t("signature.label")}
                        photoLabel={t("photo.show")}
                      />
                    )}
                  </section>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
