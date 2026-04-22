import { clsx } from "clsx";
import type { ReactNode } from "react";

import { Sandwich } from "./dishes/Sandwich";
import { Burger } from "./dishes/Burger";
import { Platter } from "./dishes/Platter";
import { Fish } from "./dishes/Fish";
import { SaladBowl } from "./dishes/SaladBowl";
import { Drink } from "./dishes/Drink";
import { DipBowl } from "./dishes/DipBowl";
import { FamilyMeal } from "./dishes/FamilyMeal";
import { Fries } from "./dishes/Fries";

export type DishVariant =
  | "sandwich"
  | "burger"
  | "platter"
  | "fish"
  | "salad"
  | "drink"
  | "dip"
  | "family"
  | "fries";

export type DishPlaceholderProps = {
  /**
   * Which dish silhouette to render at the centre. The silhouette is
   * stroke-only line-art inheriting the deep-navy brand colour.
   */
  variant: DishVariant;
  /**
   * Optional screen-reader label. Defaults to the variant name for the
   * generic "Sandwich placeholder"-style announcement, but most callers
   * will want to pass the localised dish name here.
   */
  label?: string;
  /**
   * Tailwind aspect hint. Defaults to `aspect-[4/3]` — the same ratio
   * real cutout photography will eventually land at.
   */
  aspect?: string;
  /**
   * Extra className merged onto the outer wrapper. Use for sizing (e.g.
   * `h-40`, `w-full`), radius overrides, or border tweaks.
   */
  className?: string;
};

const VARIANT_GLYPH: Record<DishVariant, (p: { className?: string }) => ReactNode> = {
  sandwich: Sandwich,
  burger: Burger,
  platter: Platter,
  fish: Fish,
  salad: SaladBowl,
  drink: Drink,
  dip: DipBowl,
  family: FamilyMeal,
  fries: Fries,
};

const VARIANT_GLYPH_SIZE: Record<DishVariant, string> = {
  sandwich: "h-[52%] w-[72%]",
  burger: "h-[60%] w-[60%]",
  platter: "h-[50%] w-[74%]",
  fish: "h-[48%] w-[76%]",
  salad: "h-[58%] w-[62%]",
  drink: "h-[66%] w-[44%]",
  dip: "h-[46%] w-[66%]",
  family: "h-[50%] w-[78%]",
  fries: "h-[68%] w-[46%]",
};

/**
 * Branded placeholder shell for any dish-image slot across the site —
 * home page featured cards, SignatureDish hero, StoryStrip chapter
 * tiles, menu item detail pages. Reads as an intentional brand artefact
 * rather than "missing image": a deep-navy rimmed plate on a warm cream
 * surface, a soft gold spotlight behind, and a centred line-art
 * silhouette of the dish itself.
 *
 * When real cutouts land (run `imagery-pipeline/pipeline.py` and drop
 * into `public/signatures/*.png`), callers swap this for
 * `<Image src="/signatures/chahines-shrimp.png" />` and delete the
 * placeholder import. Layout dimensions are unchanged — the placeholder
 * already reserves the exact `aspect-[4/3]` the cutout lands in, so no
 * layout shift when the real photo arrives.
 *
 * Pure server-compatible — no client hooks, no motion. Callers wrap
 * this in their own `<motion.div>` or `<FadeIn>` as needed.
 */
export function DishPlaceholder({
  variant,
  label,
  aspect = "aspect-[4/3]",
  className,
}: DishPlaceholderProps) {
  const Glyph = VARIANT_GLYPH[variant];
  const glyphSize = VARIANT_GLYPH_SIZE[variant];
  const accessibleLabel = label ?? `${variant} placeholder`;

  return (
    <div
      role="img"
      aria-label={accessibleLabel}
      className={clsx(
        "relative isolate w-full overflow-hidden rounded-lg bg-cs-surface-2",
        "ring-1 ring-cs-blue-deep/10",
        aspect,
        className,
      )}
    >
      {/* Soft gold spotlight — reuses the global `.cs-spotlight` utility
          so it matches the hero/signature lighting language exactly. */}
      <div aria-hidden className="cs-spotlight absolute inset-0" />

      {/* Fine dot texture — same grain that the StoryStrip tiles use,
          keeps the cream from feeling flat under the glyph. */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.08] [background-image:radial-gradient(var(--cs-blue-deep)_1px,_transparent_1px)] [background-size:4px_4px]"
      />

      {/* Plate ring — faint concentric circles, centred. */}
      <div
        aria-hidden
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="aspect-square h-[88%] rounded-full border border-cs-blue-deep/15" />
      </div>
      <div
        aria-hidden
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="aspect-square h-[72%] rounded-full border border-cs-blue-deep/10" />
      </div>

      {/* Silhouette glyph — inherits `text-cs-blue-deep` for the stroke
          colour. Sized per-variant so a tall cup and a wide platter both
          land visually centred without cropping. */}
      <div
        aria-hidden
        className="absolute inset-0 flex items-center justify-center text-cs-blue-deep"
      >
        <Glyph className={clsx(glyphSize, "drop-shadow-sm")} />
      </div>
    </div>
  );
}
