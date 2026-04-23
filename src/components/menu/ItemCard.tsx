import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import type { MenuItem } from "@/data/menu";
import type { Locale } from "../../../i18n";
import { formatLBP } from "@/lib/format";
import { menuImage } from "@/lib/menuImage";
import { RevealMask } from "@/components/motion/RevealMask";
import { buildOrderLink } from "@/lib/whatsapp";

type Props = {
  item: MenuItem;
  locale: Locale;
  className?: string;
  /**
   * Optional pre-selected branch. When provided, the Order button opens
   * WhatsApp directly with this item pre-filled for that branch. Omit on
   * the generic /menu/[category] listing so the button routes users to
   * the branch picker first (respects the §11 contract).
   */
  branch?: {
    slug: string;
    phone: string;
    name: string;
  };
};

const TAG_LABELS: Record<"en" | "ar", Record<string, string>> = {
  en: { signature: "Signature", new: "New", spicy: "Spicy" },
  ar: { signature: "مميّز", new: "جديد", spicy: "حار" },
};

const ORDER_LABEL: Record<"en" | "ar", string> = {
  en: "Order on WhatsApp",
  ar: "اطلب عبر واتساب",
};

const PICK_BRANCH_LABEL: Record<"en" | "ar", string> = {
  en: "Order — choose branch",
  ar: "اطلب — اختر الفرع",
};

export function ItemCard({ item, locale, className, branch }: Props) {
  const name = locale === "ar" ? item.name_ar : item.name_en;
  const description =
    locale === "ar" ? item.description_ar : item.description_en;

  // When we know the branch, build the wa.me link directly via the
  // single-source-of-truth helper. Otherwise, route to /branches so the
  // user picks one — we never hand-assemble a wa.me URL (§11).
  const orderHref =
    branch && branch.phone
      ? buildOrderLink({
          branchPhone: branch.phone,
          branchName: branch.name,
          items: [{ name, qty: 1, price: item.price }],
          locale,
        })
      : `/${locale}/branches`;

  const orderLabel = branch && branch.phone ? ORDER_LABEL[locale] : PICK_BRANCH_LABEL[locale];
  const isExternal = orderHref.startsWith("https://");
  const photo = menuImage(item.category, item.slug);

  return (
    <article
      className={clsx(
        "group flex h-full flex-col overflow-hidden rounded-lg border border-cs-text/10 bg-cs-surface",
        "transition-all duration-200 ease-cs",
        "hover:-translate-y-0.5 hover:border-cs-blue/40 hover:shadow-md",
        className,
      )}
    >
      {/* Dish photo — AI-generated editorial still. Lazy-loaded because
          category listings are long (up to 9 items in sandwiches) and the
          LCP belongs to the page heading, not the first card. Falls
          through to no-image layout when a photo isn't wired up yet. */}
      {photo ? (
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-cs-surface-2">
          {/* Scroll-driven clip-path reveal wrapping the image. On a
              long category page the grid scrolls past many items —
              RevealMask gives each card image a cinematic uncover as
              it enters the viewport, rather than popping in all at
              once. */}
          <RevealMask direction="bottom" className="absolute inset-0">
            <Image
              src={photo}
              alt={`${name} — ${description}`}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              loading="lazy"
              className="object-cover transition-transform duration-500 ease-cs group-hover:scale-[1.03]"
            />
          </RevealMask>
        </div>
      ) : null}

      <div className="flex flex-1 flex-col gap-5 p-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-lg font-black uppercase leading-tight text-cs-blue-deep md:text-xl">
            {name}
          </h3>
          {item.tags?.length ? (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-pill bg-cs-gold-soft/25 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-cs-on-gold"
                >
                  {TAG_LABELS[locale][tag] ?? tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>
        <span
          className="shrink-0 font-display text-base font-black text-cs-blue md:text-lg"
          aria-label={`${name} price`}
        >
          {formatLBP(item.price, locale)}
        </span>
      </header>

      <p className="text-base leading-relaxed text-cs-text-muted">
        {description}
      </p>

      {/* Order CTA — always present so there's a commerce surface on every
          menu row (the site's job #2 per CLAUDE.md §1). When no branch
          context is provided, we route to the branch picker rather than
          pretending a random branch was chosen. */}
      {isExternal ? (
        <a
          href={orderHref}
          target="_blank"
          rel="noopener noreferrer"
          className={clsx(
            "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-pill bg-cs-gold px-5 py-3",
            "font-display text-base font-black uppercase tracking-wider text-cs-on-gold",
            "transition-transform duration-200 ease-cs hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cs-blue-deep",
          )}
          aria-label={`${orderLabel} — ${name}`}
        >
          <WhatsAppGlyph />
          <span>{orderLabel}</span>
        </a>
      ) : (
        <Link
          href={orderHref}
          className={clsx(
            "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-pill border border-cs-blue-deep bg-cs-surface px-5 py-3",
            "font-display text-base font-black uppercase tracking-wider text-cs-blue-deep",
            "transition-transform duration-200 ease-cs hover:-translate-y-0.5 hover:bg-cs-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cs-blue-deep",
          )}
          aria-label={`${orderLabel} — ${name}`}
        >
          <WhatsAppGlyph />
          <span>{orderLabel}</span>
        </Link>
      )}
      </div>
    </article>
  );
}

/**
 * Minimal inline WhatsApp glyph — avoids adding a new icon dep for a
 * single-use mark. Sized to match the 14 px text baseline.
 */
function WhatsAppGlyph() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="currentColor"
    >
      <path d="M20.52 3.48A11.77 11.77 0 0 0 12 0C5.37 0 0 5.37 0 12a11.94 11.94 0 0 0 1.64 6.03L0 24l6.13-1.6A12 12 0 1 0 20.52 3.48ZM12 21.82a9.8 9.8 0 0 1-5.02-1.37l-.36-.21-3.64.95.97-3.55-.23-.37A9.82 9.82 0 1 1 12 21.82Zm5.43-7.35c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15s-.77.97-.95 1.17c-.17.2-.35.22-.65.07a8.07 8.07 0 0 1-2.38-1.47 8.94 8.94 0 0 1-1.65-2.05c-.17-.3 0-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5s.05-.37-.02-.52c-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51-.17-.01-.37-.01-.57-.01s-.52.07-.8.37c-.27.3-1.05 1.02-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.13 3.26 5.17 4.58.72.31 1.28.5 1.72.64.72.23 1.37.2 1.88.12.57-.08 1.76-.72 2.01-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" />
    </svg>
  );
}
