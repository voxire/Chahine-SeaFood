"use client";

import clsx from "clsx";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { Link } from "@/lib/i18n/navigation";

type Variant = "primary" | "ghost" | "gold";

const base =
  "relative z-10 inline-flex items-center justify-center rounded-pill px-7 py-3.5 " +
  "text-base font-semibold tracking-wide border-2 " +
  "transition-[transform,background-color,border-color] duration-200 ease-cs " +
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-cs-gold focus-visible:ring-offset-2 focus-visible:ring-offset-cs-bg";

const variants: Record<Variant, { btn: string; shadow: string }> = {
  // Cobalt button, gold shadow behind it — hero primary CTA.
  primary: {
    btn: "bg-cs-blue text-cs-bg border-cs-blue hover:bg-cs-blue-deep",
    shadow: "border-cs-gold",
  },
  // Transparent button, cobalt text + border, cobalt shadow behind.
  ghost: {
    btn: "bg-transparent text-cs-blue-deep border-cs-blue-deep hover:bg-cs-blue-deep hover:text-cs-bg",
    shadow: "border-cs-blue",
  },
  // Gold-filled button, cobalt shadow behind — inverse emphasis for
  // gold-on-cream sections (menu CTAs, order buttons).
  gold: {
    btn: "bg-cs-gold text-cs-on-gold border-cs-gold hover:bg-cs-gold-soft",
    shadow: "border-cs-blue-deep",
  },
};

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  className?: string;
  /**
   * Enable the magnetic pointer pull (small cursor-tracked translation).
   * Defaults to `true` on pointer devices; never runs under reduced motion.
   */
  magnetic?: boolean;
};

type StickerLinkProps = CommonProps & {
  href: string;
  /** External-link flags (opens in new tab when set). */
  target?: string;
  rel?: string;
  /** If provided, renders a plain `<a>` instead of the i18n `<Link>` —
   *  required for `tel:`, `mailto:`, `wa.me` URLs. */
  external?: boolean;
};

type StickerButtonElProps = CommonProps &
  Pick<ComponentPropsWithoutRef<"button">, "onClick" | "type" | "disabled" | "aria-label">;

/**
 * The layered offset-shadow CTA — two concentric pill elements where
 * the back sibling is translated slightly so it reads as a printed
 * "sticker" on the cream canvas. Matches frieslab's Dine In / Delivery
 * buttons, recast into the Chahine cobalt + gold palette.
 *
 * Layout is ALWAYS a relative wrapper with:
 *   - an absolutely positioned empty pill (the "shadow") in accent color
 *   - the real button on top with brand color
 *
 * Ships with a magnetic pointer pull on pointer devices, suppressed
 * under `prefers-reduced-motion: reduce` and on touch devices.
 */
export function StickerLink({
  href,
  children,
  variant = "primary",
  className,
  target,
  rel,
  external = false,
  magnetic = true,
}: StickerLinkProps) {
  const v = variants[variant];
  const shouldReduce = useReducedMotion();
  const useMagnet = magnetic && !shouldReduce;

  const inner = (
    <StickerWrapper variantShadow={v.shadow} magnetic={useMagnet} className={className}>
      {external ? (
        <a
          href={href}
          target={target}
          rel={rel}
          className={clsx(base, v.btn)}
          data-cursor="cta"
        >
          {children}
        </a>
      ) : (
        <Link
          href={href}
          target={target}
          rel={rel}
          className={clsx(base, v.btn)}
          data-cursor="cta"
        >
          {children}
        </Link>
      )}
    </StickerWrapper>
  );
  return inner;
}

/**
 * `<button>` variant of the sticker CTA for in-page actions (open
 * modal, submit form). Same visual contract.
 */
export function StickerButton({
  children,
  variant = "primary",
  className,
  onClick,
  type = "button",
  disabled,
  magnetic = true,
  ...rest
}: StickerButtonElProps) {
  const v = variants[variant];
  const shouldReduce = useReducedMotion();
  const useMagnet = magnetic && !shouldReduce;

  return (
    <StickerWrapper variantShadow={v.shadow} magnetic={useMagnet} className={className}>
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={clsx(base, v.btn, disabled && "opacity-50 cursor-not-allowed")}
        data-cursor="cta"
        {...rest}
      >
        {children}
      </button>
    </StickerWrapper>
  );
}

/**
 * Shared wrapper — renders the back "shadow" pill and positions the
 * actual button element on top. Handles the optional magnetic pull.
 */
function StickerWrapper({
  children,
  variantShadow,
  magnetic,
  className,
}: {
  children: ReactNode;
  variantShadow: string;
  magnetic: boolean;
  className?: string;
}) {
  return (
    <motion.span
      className={clsx("relative inline-flex", className)}
      whileHover={
        magnetic
          ? { scale: 1.03, transition: { type: "spring", stiffness: 320, damping: 18 } }
          : undefined
      }
      whileTap={magnetic ? { scale: 0.97 } : undefined}
    >
      {/* Back shadow pill — exact size of the button, offset by 0.4rem */}
      <span
        aria-hidden="true"
        className={clsx(
          "pointer-events-none absolute inset-0 rounded-pill border-2",
          "-translate-y-1 translate-x-1",
          "transition-transform duration-200 ease-cs",
          "group-hover:-translate-y-1.5 group-hover:translate-x-1.5",
          variantShadow,
        )}
      />
      {children}
    </motion.span>
  );
}
