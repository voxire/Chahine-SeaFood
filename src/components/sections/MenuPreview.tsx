import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";

import { FadeIn } from "@/components/motion/FadeIn";
import { CenterTriptych } from "@/components/motion/CenterTriptych";
import { RevealMask } from "@/components/motion/RevealMask";
import { SectionHeading } from "@/components/motion/SectionHeading";
import { LinkButton } from "@/components/ui/Button";
import { DishPlaceholder, type DishVariant } from "@/components/ornaments/DishPlaceholder";
import {
  Sandwich,
  Burger,
  Platter,
  SaladBowl,
  Drink,
  DipBowl,
  FamilyMeal,
  Fries,
} from "@/components/ornaments/dishes";
import { Link } from "@/lib/i18n/navigation";
import { type Locale } from "../../../i18n";
import { categories, type CategoryKey } from "@/data/categories";
import { findItem } from "@/data/menu";
import { menuImage } from "@/lib/menuImage";

/**
 * Menu preview — two-part section:
 *
 *   1. A three-card CenterTriptych showing the signature sandwich,
 *      the seafood platter, and the fillet burger. Each card animates
 *      in from left / scale / right as the section enters the viewport.
 *   2. The full 8-category grid below as the navigation handoff.
 *
 * Lives as a server component so the card names (pulled from `menu.ts`
 * by locale) ship in the initial HTML for SEO + AI-engine parsing
 * (CLAUDE.md §8.1, §9).
 */
export async function MenuPreview() {
  const t = await getTranslations("menuPreview");
  const tCategories = await getTranslations("categories");
  const locale = (await getLocale()) as Locale;

  // Featured trio — hand-picked as the "three to try first" trio.
  // Each item must exist in src/data/menu.ts; if a slug is renamed
  // there later, the render falls through gracefully (card is omitted).
  // `variant` drives which silhouette the `<DishPlaceholder>` renders
  // above the tag until real cutouts land in /public/signatures/.
  const featured: {
    item: ReturnType<typeof findItem>;
    tag: string;
    href: string;
    variant: DishVariant;
  }[] = [
    {
      item: findItem("sandwiches", "chahines-shrimp"),
      tag: t("featured.shrimpTag"),
      href: "/menu/sandwiches/chahines-shrimp",
      variant: "sandwich",
    },
    {
      item: findItem("platters", "loaded-seafood-mix"),
      tag: t("featured.platterTag"),
      href: "/menu/platters/loaded-seafood-mix",
      variant: "platter",
    },
    {
      item: findItem("burgers", "crispy-fillet-burger"),
      tag: t("featured.burgerTag"),
      href: "/menu/burgers/crispy-fillet-burger",
      variant: "burger",
    },
  ];
  const resolvedFeatured = featured.filter(
    (f): f is typeof f & { item: NonNullable<typeof f.item> } => Boolean(f.item),
  );

  // Category-tile glyph map. Each category gets a small line-art SVG
  // above the category name so "Sandwiches" and "Beverages" read
  // visually distinct at a glance.
  const CATEGORY_GLYPH: Record<CategoryKey, (p: { className?: string }) => JSX.Element> = {
    sandwiches: Sandwich,
    burgers: Burger,
    platters: Platter,
    "family-meals": FamilyMeal,
    salads: SaladBowl,
    "add-ons": Fries,
    dips: DipBowl,
    beverages: Drink,
  };

  return (
    <section
      aria-labelledby="menu-preview-heading"
      className="bg-cs-bg py-section-y"
    >
      <div className="mx-auto max-w-container px-6">
        {/* SectionHeading drives its own scroll-triggered reveal since
            #61, so the outer FadeIn wrapper was redundant work that
            muddied the stagger. Strip it — just the heading. */}
        <SectionHeading
          plain={t("plain")}
          pill={t("pill")}
          subhead={t("description")}
          as="h2"
        />

        {/* Featured kicker */}
        <FadeIn delay={0.15} className="mt-14 text-center">
          <span className="block font-display text-xs uppercase tracking-[0.3em] text-cs-gold">
            {t("featuredKicker")}
          </span>
        </FadeIn>

        {/* Triptych — animates left / center / right on enter. */}
        <CenterTriptych className="mt-8" travel="64px" gap="1.5rem">
          {resolvedFeatured.map(({ item, tag, href, variant }) => {
            const name = locale === "ar" ? item.name_ar : item.name_en;
            const description =
              locale === "ar" ? item.description_ar : item.description_en;
            const photo = menuImage(item.category, item.slug);
            return (
              <Link
                key={`${item.category}-${item.slug}`}
                href={href}
                data-cursor="cta"
                className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-cs-text/10 bg-cs-surface transition-colors hover:-translate-y-0.5 hover:border-cs-blue/40 hover:shadow-lg"
              >
                {/* Branded image slot — renders the AI-generated editorial
                    photo when one exists in /public/menu/, falls back to
                    the branded silhouette placeholder otherwise. */}
                {photo ? (
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-lg bg-cs-surface-2">
                    {/* RevealMask — clip-path wipe from bottom as the
                        card enters the viewport. Uses `start end` →
                        `start center` scroll range so the reveal is
                        already half-finished by the time the card hits
                        the centre of the viewport, which is when the
                        eye is actually looking at it. */}
                    <RevealMask direction="bottom" className="absolute inset-0">
                      <Image
                        src={photo}
                        alt={`${name} — ${description}`}
                        fill
                        sizes="(min-width: 768px) 33vw, 100vw"
                        className="object-cover transition-transform duration-500 ease-cs group-hover:scale-[1.03]"
                      />
                    </RevealMask>
                  </div>
                ) : (
                  <DishPlaceholder
                    variant={variant}
                    label={name}
                    aspect="aspect-[4/3]"
                    className="rounded-none rounded-t-lg border-0 ring-0"
                  />
                )}

                <div className="flex flex-1 flex-col p-6 md:p-7">
                  {/* Gold tag line */}
                  <span className="block font-display text-[10px] uppercase tracking-[0.25em] text-cs-gold">
                    {tag}
                  </span>
                  {/* Dish name */}
                  <h3 className="mt-3 font-display text-xl font-black uppercase leading-tight text-cs-blue-deep transition-colors group-hover:text-cs-blue md:text-2xl">
                    {name}
                  </h3>
                  {/* Ingredient strip. Base `text-base` (16px) meets
                      §10.3's ≥16px rule — the description sits inside a
                      Link so it counts as interactive text. */}
                  <p className="mt-3 text-base leading-relaxed text-cs-text-muted">
                    {description}
                  </p>
                  {/* Arrow affordance — flips 180° under RTL so it
                      points in the reading direction (← visually). */}
                  <span
                    aria-hidden
                    className="mt-5 inline-flex items-center gap-1 font-display text-xs uppercase tracking-[0.2em] text-cs-blue transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
                  >
                    <span className="rtl:rotate-180">→</span>
                  </span>
                </div>
              </Link>
            );
          })}
        </CenterTriptych>

        {/* Category grid kicker */}
        <FadeIn delay={0.35} className="mt-20 text-center">
          <span className="block font-display text-xs uppercase tracking-[0.3em] text-cs-gold">
            {t("categoriesKicker")}
          </span>
        </FadeIn>

        {/* The full category grid stays — navigation layer beneath the
            featured-trio hero. Each tile now carries an SVG glyph so
            "Sandwiches" and "Beverages" read visually distinct at a
            glance, not just as identical text tiles. */}
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {categories.map((c, i) => {
            const Glyph = CATEGORY_GLYPH[c.slug];
            return (
              <FadeIn key={c.slug} delay={0.08 + i * 0.05}>
                <Link
                  href={`/menu/${c.slug}`}
                  className="group flex h-full flex-col items-center justify-center gap-4 rounded-lg border border-cs-text/10 bg-cs-surface px-6 py-8 text-center transition-colors hover:-translate-y-0.5 hover:border-cs-blue/40 hover:shadow-md"
                >
                  <span
                    aria-hidden
                    className="flex h-16 w-20 items-center justify-center text-cs-blue-deep transition-colors group-hover:text-cs-blue"
                  >
                    <Glyph className="h-full w-full" />
                  </span>
                  <span className="block font-display text-base font-black uppercase leading-none text-cs-text transition-colors group-hover:text-cs-blue md:text-lg">
                    {tCategories(c.slug)}
                  </span>
                </Link>
              </FadeIn>
            );
          })}
        </div>

        <FadeIn delay={0.5} className="mt-12 flex justify-center">
          <LinkButton href="/menu" variant="ghost">
            {t("viewAllCta")}
          </LinkButton>
        </FadeIn>
      </div>
    </section>
  );
}
