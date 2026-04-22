"use client";

import { motion, useReducedMotion } from "framer-motion";
import clsx from "clsx";
import type { ReactNode } from "react";

type Size = "sm" | "md" | "lg";

type Props = {
  children: ReactNode;
  className?: string;
  size?: Size;
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-1 text-sm",
  md: "px-5 py-1.5 text-base",
  lg: "px-7 py-2 text-2xl md:text-4xl lg:text-5xl",
};

/**
 * Scripts where letters must stay in a single run so the browser can shape /
 * join them correctly. Splitting by grapheme breaks joining (the disconnected-
 * Arabic bug). Covers Arabic, Arabic supplements, Arabic presentation forms,
 * Hebrew, and adjacent ranges.
 */
const CURSIVE_SCRIPT_RE =
  /[\u0590-\u05FF\u0600-\u06FF\u0700-\u074F\u0750-\u077F\u08A0-\u08FF\uFB00-\uFDFF\uFE70-\uFEFF]/;

/**
 * The gold pill — our signature typographic device (the Chahine take on
 * frieslab's red pill). For Latin strings, letters stagger in from below.
 * For Arabic / other cursive scripts, we stagger by *word* instead of by
 * character so glyph joining stays intact.
 */
export function Pill({ children, className, size = "md" }: Props) {
  const prefersReduced = useReducedMotion();
  const isString = typeof children === "string";
  const text = isString ? (children as string) : "";
  const isCursive = isString && CURSIVE_SCRIPT_RE.test(text);

  // The gold pill is sheared -3° in LTR to mirror frieslab's red pill.
  // Under RTL, mirror the shear (+3°) so the slant still reads the same
  // direction relative to reading direction — without this, the pill
  // "leans backwards" in Arabic and the composition looks broken.
  const wrapperClasses = clsx(
    "inline-flex items-center rounded-pill bg-cs-gold font-display font-black uppercase leading-none text-cs-on-gold",
    "-skew-x-3 rtl:skew-x-3",
    sizes[size],
    className,
  );

  // Non-string children or reduced motion — render plain.
  if (!isString || prefersReduced || text.length === 0) {
    return (
      <span className={wrapperClasses}>
        <span className="skew-x-3 rtl:-skew-x-3">{children}</span>
      </span>
    );
  }

  // Cursive scripts: stagger by word. The whole word stays in one span so
  // Arabic letters keep their joining behaviour.
  if (isCursive) {
    const parts = text.split(/(\s+)/); // keep whitespace as its own entry
    return (
      <span className={wrapperClasses}>
        <span className="skew-x-3 rtl:-skew-x-3">
          {parts.map((part, i) =>
            /^\s+$/.test(part) ? (
              <span key={i}>{part}</span>
            ) : (
              <motion.span
                key={i}
                initial={{ y: "40%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  delay: i * 0.08,
                  duration: 0.55,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{ display: "inline-block" }}
              >
                {part}
              </motion.span>
            ),
          )}
        </span>
      </span>
    );
  }

  // Latin (and other non-cursive scripts): stagger by character.
  return (
    <span className={wrapperClasses}>
      <span className="skew-x-3 rtl:-skew-x-3">
        {text.split("").map((ch, i) => (
          <motion.span
            key={i}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              delay: i * 0.03,
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{ display: "inline-block" }}
          >
            {ch === " " ? "\u00A0" : ch}
          </motion.span>
        ))}
      </span>
    </span>
  );
}
