"use client";

import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";

import type { MenuItem } from "@/data/menu";
import type { Locale } from "../../../i18n";
import { Link } from "@/lib/i18n/navigation";
import { formatLBP } from "@/lib/format";
import { menuImage } from "@/lib/menuImage";

type Props = {
  items: MenuItem[];
  locale: Locale;
  /** Localised label for the signature mark, e.g. "Signature" / "مميّز". */
  signatureLabel: string;
  /** Localised "Photo" tooltip / aria, e.g. "Show photo" / "عرض الصورة". */
  photoLabel: string;
};

/**
 * Paper-menu row list (Direction 2 / two-pane classic).
 *
 * Each row is a single Link to the item's detail page — name on the left,
 * dotted leader, price on the right, ingredients underneath as a quiet
 * second line. The whole row is the affordance; there's no inline order
 * button at this level (the detail page owns the WhatsApp branch picker).
 *
 * Photo handling
 * ──────────────
 * Each row carries a small circular dish photo when one exists in
 * `menuImage()`. On md+ it's permanently visible to the left of the name
 * (32px) — adds visual rhythm without dominating the typography. Below
 * md it's hidden by default and a "show photo" toggle reveals it inline.
 * This keeps the mobile layout text-led and fast, but lets a curious
 * tap surface imagery on demand.
 *
 * Signature items get a ★ glyph to the right of the name (locale-aware
 * — sits before the name in RTL via `rtl:order-first`).
 *
 * Mobile-first authoring
 * ──────────────────────
 * Base classes target 390px:
 *   - Vertical stack, name + price on one row, dot leader collapses to a
 *     thin underline (no animated dots — too noisy at this size).
 *   - 44px tap target (py-3.5 * 2 + line-height).
 *   - Ingredient line wraps freely.
 * From md: dot leader appears, photo thumb is always-on.
 */
export function MenuRowList({
  items,
  locale,
  signatureLabel,
  photoLabel,
}: Props) {
  return (
    <ul className="divide-y divide-cs-text/10">
      {items.map((item) => (
        <MenuRow
          key={`${item.category}-${item.slug}`}
          item={item}
          locale={locale}
          signatureLabel={signatureLabel}
          photoLabel={photoLabel}
        />
      ))}
    </ul>
  );
}

function MenuRow({
  item,
  locale,
  signatureLabel,
  photoLabel,
}: {
  item: MenuItem;
  locale: Locale;
  signatureLabel: string;
  photoLabel: string;
}) {
  const photo = menuImage(item.category, item.slug);
  const name = locale === "ar" ? item.name_ar : item.name_en;
  const description =
    locale === "ar" ? item.description_ar : item.description_en;
  const isSignature = Boolean(item.tags?.includes("signature"));

  const [photoOpen, setPhotoOpen] = useState(false);

  return (
    <li className="group relative">
      <Link
        href={`/menu/${item.category}/${item.slug}`}
        aria-label={`${name} — ${formatLBP(item.price, locale)}`}
        className={clsx(
          "flex flex-col gap-2 py-4 transition-colors",
          "hover:bg-cs-surface/60",
          "focus-visible:bg-cs-surface focus-visible:outline-none",
          "md:gap-3 md:py-5",
        )}
      >
        {/* Top row: thumb (md+) / placeholder dot (mobile) + name + leader + price */}
        <div className="flex items-baseline gap-3 md:gap-4">
          {/* Always-on circular thumb on md+. */}
          {photo ? (
            <span
              aria-hidden
              className={clsx(
                "relative hidden shrink-0 self-center overflow-hidden rounded-full bg-cs-surface-2 ring-1 ring-cs-text/10",
                "h-9 w-9 md:block",
              )}
            >
              <Image
                src={photo}
                alt=""
                fill
                sizes="36px"
                loading="lazy"
                className="object-cover transition-transform duration-300 ease-cs group-hover:scale-110"
              />
            </span>
          ) : (
            <span
              aria-hidden
              className="hidden h-9 w-9 shrink-0 self-center rounded-full bg-cs-surface-2 ring-1 ring-cs-text/10 md:block"
            />
          )}

          {/* Name */}
          <h3
            className={clsx(
              "font-display font-black uppercase leading-tight text-cs-text",
              "text-base md:text-xl",
              "group-hover:text-cs-blue transition-colors",
            )}
          >
            {name}
            {isSignature ? (
              <span
                className="ms-2 inline-flex translate-y-[-2px] items-baseline align-baseline text-cs-gold"
                aria-label={signatureLabel}
                title={signatureLabel}
              >
                ★
              </span>
            ) : null}
          </h3>

          {/* Dot leader — md+ only. Pure CSS, no DOM noise. */}
          <span
            aria-hidden
            className="hidden flex-1 translate-y-[-3px] self-end border-b border-dotted border-cs-text/25 md:block"
          />

          {/* Price */}
          <span
            className={clsx(
              "shrink-0 font-display font-black tabular-nums text-cs-blue-deep",
              "ms-auto md:ms-0",
              "text-base md:text-lg",
            )}
          >
            {formatLBP(item.price, locale)}
          </span>
        </div>

        {/* Ingredient line */}
        {description ? (
          <p
            className={clsx(
              "text-sm leading-relaxed text-cs-text-muted",
              // Indent on md+ to align under the name (thumb 36px + gap-4 16px = 52px).
              "md:ps-[52px]",
            )}
          >
            {description}
          </p>
        ) : null}
      </Link>

      {/* Mobile-only photo toggle. Sits OUTSIDE the Link so tapping it
          doesn't navigate. md+ already shows the thumb permanently. */}
      {photo ? (
        <div className="md:hidden">
          <button
            type="button"
            onClick={() => setPhotoOpen((v) => !v)}
            className={clsx(
              "mb-2 inline-flex min-h-[44px] items-center gap-2 px-1 text-xs uppercase tracking-wider",
              "text-cs-text-muted hover:text-cs-blue",
              "focus-visible:outline-none focus-visible:text-cs-blue",
            )}
            aria-expanded={photoOpen}
            aria-controls={`photo-${item.category}-${item.slug}`}
          >
            <span aria-hidden>{photoOpen ? "−" : "+"}</span>
            {photoLabel}
          </button>
          {photoOpen ? (
            <div
              id={`photo-${item.category}-${item.slug}`}
              className="relative mb-4 h-44 w-full overflow-hidden rounded-md bg-cs-surface-2 ring-1 ring-cs-text/10"
            >
              <Image
                src={photo}
                alt={`${name} — ${description}`}
                fill
                sizes="(min-width: 768px) 0px, 100vw"
                loading="lazy"
                className="object-cover"
              />
            </div>
          ) : null}
        </div>
      ) : null}
    </li>
  );
}
