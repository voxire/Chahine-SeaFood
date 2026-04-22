import { getTranslations } from "next-intl/server";

import { FadeIn } from "@/components/motion/FadeIn";
import { SectionHeading } from "@/components/motion/SectionHeading";
import { StickerLink } from "@/components/ui/StickerButton";
import {
  DishPlaceholder,
  type DishVariant,
} from "@/components/ornaments/DishPlaceholder";

const INSTAGRAM_URL = "https://www.instagram.com/chahine.seafood.lb/";

/**
 * Community section — the social-proof beat of the home page.
 *
 * Anchors the page's "ten branches, one family" narrative with the
 * actual community number: more than 68,300 regulars follow along on
 * Instagram. Per CLAUDE.md §20 question #7, the IG Basic Display API
 * credentials are not yet available, so the six post tiles ship as
 * branded `<DishPlaceholder>` frames with topic captions — they swap
 * to real post thumbnails as soon as the API is wired and each tile
 * becomes `<a href="post permalink">`.
 *
 * Server component — every string comes from `getTranslations` at
 * render time so search crawlers, AI engines, and the no-JS pass all
 * receive the full copy, and the concrete follower count is a
 * cite-worthy fact under CLAUDE.md §9 (GEO / LLMO / AEO).
 */
export async function Community() {
  const t = await getTranslations("community");

  // Six placeholder posts, each keyed to a topic from the community.tiles
  // namespace. `variant` drives the silhouette inside the tile; `key`
  // is used to look up the localised caption. When the real IG feed
  // hooks up, these become [ { id, permalink, thumbnailUrl } ].
  const tiles: {
    key: "catch" | "fryer" | "family" | "branch" | "giveaway" | "regulars";
    variant: DishVariant;
  }[] = [
    { key: "catch", variant: "fish" },
    { key: "fryer", variant: "sandwich" },
    { key: "family", variant: "family" },
    { key: "branch", variant: "platter" },
    { key: "giveaway", variant: "burger" },
    { key: "regulars", variant: "drink" },
  ];

  return (
    <section
      aria-labelledby="community-heading"
      className="bg-cs-bg py-section-y"
    >
      <div className="mx-auto max-w-container px-6">
        <FadeIn>
          <SectionHeading
            plain={t("plain")}
            pill={t("pill")}
            subhead={t("description")}
            as="h2"
          />
        </FadeIn>

        <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,_0.9fr)_minmax(0,_1.1fr)] lg:items-center lg:gap-20">
          {/* Left — the headline number + handle + CTA. */}
          <FadeIn className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <span className="font-display text-xs uppercase tracking-[0.3em] text-cs-gold">
              {t("followerLabel")}
            </span>
            <span className="mt-3 font-display text-6xl font-black leading-none text-cs-blue-deep md:text-7xl lg:text-[96px]">
              {t("followerCount")}
            </span>
            <span className="mt-6 block font-display text-sm uppercase tracking-[0.25em] text-cs-blue">
              {t("handle")}
            </span>

            <div className="mt-8">
              <StickerLink
                href={INSTAGRAM_URL}
                variant="gold"
                external
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("cta")}
              </StickerLink>
            </div>
          </FadeIn>

          {/* Right — six placeholder post tiles. 3×2 grid; each is a
              square DishPlaceholder with an IG-style caption overlay
              at the bottom. Real thumbnails replace these once the IG
              Basic Display API is wired (CLAUDE.md §20 Q#7). */}
          <FadeIn delay={0.1}>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4">
              {tiles.map((tile, i) => {
                const caption = t(`tiles.${tile.key}`);
                const postLabel = `${t("tilePrefix")} ${i + 1}`;
                return (
                  <li key={tile.key}>
                    <a
                      href={INSTAGRAM_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${postLabel} — ${caption}`}
                      data-cursor="link"
                      className="group relative block overflow-hidden rounded-lg ring-1 ring-cs-text/10 transition-transform hover:-translate-y-0.5 hover:ring-cs-blue/40"
                    >
                      <DishPlaceholder
                        variant={tile.variant}
                        label={caption}
                        aspect="aspect-square"
                        className="rounded-none"
                      />
                      {/* IG-style gradient caption bar. */}
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end bg-gradient-to-t from-cs-blue-deep/80 via-cs-blue-deep/25 to-transparent p-3">
                        <span className="font-display text-[10px] uppercase tracking-[0.18em] text-cs-bg md:text-xs">
                          {caption}
                        </span>
                      </div>
                    </a>
                  </li>
                );
              })}
            </ul>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
