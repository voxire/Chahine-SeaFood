"use client";

import { motion, useReducedMotion } from "framer-motion";
import clsx from "clsx";

/**
 * Content shown for a single branch in the LebanonMap hover/tap popup.
 * Everything is pre-resolved upstream (server-side i18n) so the popup
 * itself stays a pure presentational component with no i18n coupling.
 */
export type BranchPopupContent = {
  /** Localized branch name, e.g. "Chahine — Hamra". */
  name: string;
  /** Localized district line, e.g. "Hamra, Beirut". */
  district: string;
  /** Pre-formatted hours string, e.g. "Daily 12:00 – 00:00". */
  hoursLine: string;
  /** Formatted phone, or null when the branch has no confirmed number yet. */
  phoneLine: string | null;
  /** Pre-built WhatsApp deep-link, or null when no phone on record. */
  orderHref: string | null;
  /** Pre-built Google Maps URL. */
  mapsHref: string;
  /** Label for the Order CTA, e.g. "Order on WhatsApp". */
  orderLabel: string;
  /** Label for the Maps CTA, e.g. "Open on map". */
  mapsLabel: string;
  /** Label for the phone row when no number is on record. */
  comingSoonLabel: string;
  /** Accessible label for the close button, e.g. "Close". */
  closeLabel: string;
};

export type BranchPopupProps = {
  content: BranchPopupContent;
  /** Pixel offset from the popup's anchoring corner (set by LebanonMap). */
  x: number;
  y: number;
  /** Whether the pointer is currently over the pin or the popup itself. */
  onPointerEnter?: () => void;
  onPointerLeave?: () => void;
  /** Dismiss callback for the close button. */
  onClose: () => void;
  className?: string;
};

/**
 * The small floating card that appears above a branch pin on hover
 * (desktop) or tap (touch). Rendered as absolutely-positioned HTML — NOT
 * inside the SVG — so typography, tap targets, and RTL reading order
 * behave like any other component on the page. LebanonMap supplies the
 * pixel coordinates by reading the pin's `getBoundingClientRect()`.
 *
 * Anchoring: the popup is translated -100% on Y and -50% on X so the
 * bottom-centre of the card sits directly above the pin with a small
 * gap. The tail triangle sits at the bottom-centre of the card.
 */
export function BranchPopup({
  content,
  x,
  y,
  onPointerEnter,
  onPointerLeave,
  onClose,
  className,
}: BranchPopupProps) {
  const shouldReduce = useReducedMotion();

  const initial = shouldReduce
    ? { opacity: 1, y: 0 }
    : { opacity: 0, y: 6 };
  const animate = { opacity: 1, y: 0 };

  return (
    <motion.div
      role="dialog"
      aria-label={content.name}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      initial={initial}
      animate={animate}
      exit={shouldReduce ? undefined : { opacity: 0, y: 4 }}
      transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className={clsx(
        "pointer-events-auto absolute z-20 w-[min(260px,calc(100vw-2rem))]",
        "rounded-xl border border-cs-text/15 bg-cs-surface p-4 shadow-[0_12px_32px_-16px_rgba(10,39,70,0.35)]",
        "text-start",
        className,
      )}
      style={{
        left: x,
        top: y,
        // Anchor: bottom-centre of the card sits ~14px above the pin,
        // so the tail triangle clears the dot + halo without overlap.
        transform: "translate(-50%, calc(-100% - 14px))",
      }}
    >
      <button
        type="button"
        aria-label={content.closeLabel}
        onClick={onClose}
        className="absolute end-2 top-2 grid h-7 w-7 place-items-center rounded-full text-cs-text-muted transition-colors hover:bg-cs-surface-2 hover:text-cs-blue-deep focus:outline-none focus-visible:ring-2 focus-visible:ring-cs-blue"
      >
        <svg
          viewBox="0 0 16 16"
          width={12}
          height={12}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          aria-hidden
        >
          <path d="M 3 3 L 13 13 M 13 3 L 3 13" />
        </svg>
      </button>

      <p className="pe-6 font-display text-base font-black uppercase leading-tight tracking-wide text-cs-blue-deep">
        {content.name}
      </p>
      <p className="mt-0.5 text-xs text-cs-text-muted">{content.district}</p>

      <dl className="mt-3 space-y-1.5 text-sm leading-snug">
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-[11px] uppercase tracking-[0.18em] text-cs-text-muted">
            {/* Reuse the "Hours" label isn't strictly needed — the hoursLine
                already reads "Daily 12:00 – 00:00" so the whole line stands
                alone. We show a bullet marker instead for scan-ability. */}
            <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-cs-gold align-middle" />
          </dt>
          <dd className="flex-1 text-cs-blue-deep">{content.hoursLine}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-[11px] uppercase tracking-[0.18em] text-cs-text-muted">
            <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-cs-gold align-middle" />
          </dt>
          <dd
            className={clsx(
              "flex-1 font-mono text-[13px]",
              content.phoneLine ? "text-cs-blue-deep" : "text-cs-text-muted",
            )}
            dir="ltr"
          >
            {content.phoneLine ?? content.comingSoonLabel}
          </dd>
        </div>
      </dl>

      <div className="mt-4 flex flex-wrap gap-2">
        {content.orderHref ? (
          <a
            href={content.orderHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-1 items-center justify-center rounded-pill bg-cs-gold px-3.5 py-2 text-[13px] font-semibold text-cs-on-gold transition-transform hover:scale-[1.02] hover:bg-cs-gold-soft"
          >
            {content.orderLabel}
          </a>
        ) : (
          <span className="inline-flex flex-1 items-center justify-center rounded-pill border border-cs-text/15 px-3.5 py-2 text-[13px] text-cs-text-muted">
            {content.comingSoonLabel}
          </span>
        )}
        <a
          href={content.mapsHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex flex-1 items-center justify-center rounded-pill border border-cs-text/15 px-3.5 py-2 text-[13px] font-semibold text-cs-blue-deep transition-colors hover:border-cs-blue hover:text-cs-blue"
        >
          {content.mapsLabel}
        </a>
      </div>

      {/* Tail triangle — sits at the bottom-centre of the card and
          points down at the pin. Uses the same surface colour with a
          hairline border to match the card. */}
      <span
        aria-hidden
        className="absolute left-1/2 top-full h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 border-b border-e border-cs-text/15 bg-cs-surface"
      />
    </motion.div>
  );
}
