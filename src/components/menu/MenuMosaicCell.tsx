import clsx from "clsx";
import Image from "next/image";

import type { MenuItem } from "@/data/menu";
import type { Locale } from "../../../i18n";
import { formatLBP } from "@/lib/format";
import { menuImage } from "@/lib/menuImage";
import { Link } from "@/lib/i18n/navigation";

type Size = "regular" | "signature";

type Props = {
  item: MenuItem;
  locale: Locale;
  /** "signature" cells render the title at hero size + a corner badge. */
  size?: Size;
  className?: string;
};

const TAG_LABELS: Record<"en" | "ar", Record<string, string>> = {
  en: { signature: "Signature", new: "New", spicy: "Spicy" },
  ar: { signature: "مميّز", new: "جديد", spicy: "حار" },
};

/**
 * One cell of the editorial menu mosaic. Always renders as a Link to the
 * item detail page (where the WhatsApp branch picker lives) — there's no
 * inline order CTA here. The card itself IS the affordance.
 *
 * Layout
 * ──────
 * Single relative box, image fills via `next/image fill`. A bottom-up dark
 * gradient sits over the photo so the title and price stay legible against
 * any dish photography. Signature items grow the title to display size to
 * match their bigger cell area; regulars stay at body-display size.
 *
 * No-photo state
 * ──────────────
 * When `menuImage()` returns null (item has no AI/IG photo wired yet),
 * the cell falls back to a cream-on-cream surface with a soft gold
 * spotlight and the dish name centred — so the layout never breaks before
 * imagery lands.
 */
export function MenuMosaicCell({
  item,
  locale,
  size = "regular",
  className,
}: Props) {
  const photo = menuImage(item.category, item.slug);
  const name = locale === "ar" ? item.name_ar : item.name_en;
  const description =
    locale === "ar" ? item.description_ar : item.description_en;
  const isSignature = size === "signature";

  return (
    <Link
      href={`/menu/${item.category}/${item.slug}`}
      className={clsx(
        "group relative block h-full overflow-hidden rounded-lg bg-cs-surface-2",
        "ring-1 ring-cs-text/5 transition-all duration-300 ease-cs",
        "hover:ring-cs-blue/40 hover:shadow-xl",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cs-gold focus-visible:ring-offset-2 focus-visible:ring-offset-cs-bg",
        className,
      )}
      aria-label={`${name} — ${formatLBP(item.price, locale)}`}
    >
      {photo ? (
        <Image
          src={photo}
          alt={`${name} — ${description}`}
          fill
          sizes={
            isSignature
              ? "(min-width: 1024px) 50vw, (min-width: 640px) 100vw, 100vw"
              : "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          }
          loading="lazy"
          className="object-cover transition-transform duration-500 ease-cs group-hover:scale-[1.04]"
        />
      ) : (
        <div className="cs-spotlight flex h-full w-full items-center justify-center bg-cs-surface">
          <span className="px-6 text-center font-display text-xs uppercase tracking-[0.25em] text-cs-text-muted md:text-sm">
            {name}
          </span>
        </div>
      )}

      {/* Bottom-up gradient — keeps title + price readable on any photo. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-cs-blue-deep/90 via-cs-blue-deep/35 to-transparent"
      />

      {/* Signature mark — gold pill in the inline-end corner. */}
      {item.tags?.includes("signature") ? (
        <span
          className="absolute top-3 inline-flex items-center gap-1 rounded-pill bg-cs-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-cs-on-gold ltr:right-3 rtl:left-3"
          aria-hidden
        >
          ★ {TAG_LABELS[locale].signature}
        </span>
      ) : null}

      {/* Title + price overlay — bottom of the cell, with safe padding. */}
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 md:p-5">
        <h3
          className={clsx(
            "font-display font-black uppercase leading-tight text-white",
            isSignature
              ? "text-2xl md:text-4xl lg:text-5xl"
              : "text-base md:text-lg",
          )}
        >
          {name}
        </h3>
        <span
          className={clsx(
            "shrink-0 font-display font-black text-cs-gold-soft",
            isSignature ? "text-base md:text-xl" : "text-sm md:text-base",
          )}
        >
          {formatLBP(item.price, locale)}
        </span>
      </div>
    </Link>
  );
}
