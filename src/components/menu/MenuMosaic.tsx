import clsx from "clsx";

import type { MenuItem } from "@/data/menu";
import type { Locale } from "../../../i18n";
import { FadeIn } from "@/components/motion/FadeIn";
import { MenuMosaicCell } from "./MenuMosaicCell";

type Props = {
  items: MenuItem[];
  locale: Locale;
};

/**
 * Asymmetric editorial menu grid (Direction 2).
 *
 * Layout strategy
 * ───────────────
 * - **Categories with at least one signature item** use a 4-column grid
 *   (md+) with `grid-auto-flow: dense`. Signature cells span 2 cols × 2
 *   rows, so they sit at ~4× the visual weight of a regular cell. Regular
 *   cells fill the surrounding voids.
 *
 * - **Categories without signatures** (Salads, Add-Ons, Dips, Beverages)
 *   fall back to a tighter uniform grid — there's no item to elevate, so
 *   asymmetry would feel arbitrary.
 *
 * Mobile drops everything to a single column (which makes signature spans
 * meaningless), so the responsive `auto-rows` only kicks in from `md` up.
 */
export function MenuMosaic({ items, locale }: Props) {
  const hasSignatures = items.some((i) => i.tags?.includes("signature"));

  if (!hasSignatures) {
    // Uniform grid for short / undifferentiated categories.
    return (
      <div
        className={clsx(
          "grid gap-3",
          "grid-cols-1 sm:grid-cols-2",
          items.length >= 4 && "md:grid-cols-3",
          "auto-rows-[260px] md:auto-rows-[260px]",
        )}
      >
        {items.map((item, i) => (
          <FadeIn key={item.slug} delay={Math.min(i, 8) * 0.04}>
            <MenuMosaicCell item={item} locale={locale} />
          </FadeIn>
        ))}
      </div>
    );
  }

  // Mosaic layout for signature-bearing categories.
  return (
    <div
      className={clsx(
        "grid gap-3 [grid-auto-flow:dense]",
        "grid-cols-1 sm:grid-cols-2 md:grid-cols-4",
        "auto-rows-[240px] sm:auto-rows-[220px] md:auto-rows-[200px] lg:auto-rows-[240px]",
      )}
    >
      {items.map((item, i) => {
        const isSignature = Boolean(item.tags?.includes("signature"));
        return (
          <FadeIn
            key={item.slug}
            delay={Math.min(i, 10) * 0.04}
            className={clsx(
              "h-full",
              isSignature && "sm:col-span-2 sm:row-span-2",
            )}
          >
            <MenuMosaicCell
              item={item}
              locale={locale}
              size={isSignature ? "signature" : "regular"}
            />
          </FadeIn>
        );
      })}
    </div>
  );
}
