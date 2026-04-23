"use client";

import clsx from "clsx";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { Pill } from "./Pill";

type Align = "left" | "center";
type HeadingTag = "h1" | "h2" | "div";

type Props = {
  /** The big, slightly-transparent first word (or words) that sits behind. */
  plain: string;
  /** The gold pill text — usually the punchy second word. */
  pill: string;
  /** Optional subhead underneath. */
  subhead?: ReactNode;
  className?: string;
  align?: Align;
  /** What heading level this composition represents. Default `div` (decorative). */
  as?: HeadingTag;
};

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Scripts where letters must stay in a single run so the browser can
 * shape / join them correctly. Splitting by grapheme breaks joining
 * (the disconnected-Arabic bug #41, previously fixed in Pill.tsx but
 * not here). Covers Arabic, Arabic supplements, Arabic presentation
 * forms, Hebrew, and adjacent ranges.
 */
const CURSIVE_SCRIPT_RE =
  /[\u0590-\u05FF\u0600-\u06FF\u0700-\u074F\u0750-\u077F\u08A0-\u08FF\uFB00-\uFDFF\uFE70-\uFEFF]/;

/**
 * The signature composition — semi-transparent display word + skewed gold
 * pill + optional subhead. Core building block of every section heading
 * on the site.
 *
 * Client-side motion upgrade (frieslab-level reference bar):
 * the whole composition reveals when it scrolls into view, not when the
 * page mounts. Characters of the plain word stagger in, the pill plays
 * its own letter-stagger (see Pill — also viewport-triggered now), and
 * the optional subhead rises with a short delay.
 *
 * Accessibility
 * ─────────────
 * - The plain word is wrapped in `aria-label={plain}` with per-char
 *   spans set to `aria-hidden`, so assistive tech announces the whole
 *   word and skips the decorative split.
 * - `useReducedMotion` collapses the whole composition to its static
 *   final state — no stagger, no translation, no opacity transitions.
 *
 * SEO
 * ───
 * Text renders in the HTML at mount regardless of viewport state —
 * only visual opacity + translate are animated. Crawlers and no-JS
 * pass both receive the full heading text.
 */
export function SectionHeading({
  plain,
  pill,
  subhead,
  className,
  align = "center",
  as = "div",
}: Props) {
  const shouldReduce = useReducedMotion();
  const Heading = as;

  // ────────────────────────────────────────────────────────────────
  // Reduced-motion path — static final-state render, no motion lib.
  // ────────────────────────────────────────────────────────────────
  if (shouldReduce) {
    return (
      <div className={clsx("w-full", className)}>
        <Heading
          className={clsx(
            "m-0 flex flex-wrap items-center gap-x-4 gap-y-2",
            align === "center" ? "justify-center" : "justify-start",
          )}
        >
          <span className="font-display text-4xl font-black uppercase leading-none opacity-20 text-cs-text md:text-6xl lg:text-7xl">
            {plain}
          </span>
          <Pill size="lg">{pill}</Pill>
        </Heading>
        {subhead ? (
          <p
            className={clsx(
              "mt-4 text-base text-cs-text-muted md:text-lg",
              align === "center" ? "text-center" : "",
            )}
          >
            {subhead}
          </p>
        ) : null}
      </div>
    );
  }

  // ────────────────────────────────────────────────────────────────
  // Full motion path — scroll-triggered reveal.
  // ────────────────────────────────────────────────────────────────
  // Cursive scripts (Arabic etc.) need to stay as single-run words so
  // glyph joining works. For those we split by whitespace and animate
  // each word; for Latin we keep the per-character stagger that reads
  // as signature frieslab motion.
  const isCursive = CURSIVE_SCRIPT_RE.test(plain);
  const parts: string[] = isCursive
    ? plain.split(/(\s+)/).filter((p) => p.length > 0)
    : Array.from(plain);
  // Slow the stagger slightly for word-chunked reveals so 2–3 chunks
  // don't fire nearly simultaneously. Characters can stay snappy.
  const staggerChildren = isCursive ? 0.09 : 0.035;

  const plainContainer: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren, delayChildren: 0 },
    },
  };

  const charVariant: Variants = {
    hidden: { y: 32, opacity: 0 },
    visible: {
      y: 0,
      opacity: 0.2, // matches the original "ghost word" tone
      transition: { duration: 0.55, ease: EASE },
    },
  };

  // Subhead lands after both the plain-word stagger and the pill's own
  // letter-stagger (see Pill's own `whileInView`) have had time to play.
  const subheadDelay = 0.3 + Math.min(parts.length, 16) * staggerChildren;

  const subheadVariant: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: EASE, delay: subheadDelay },
    },
  };

  return (
    <motion.div
      className={clsx("w-full", className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
    >
      <Heading
        className={clsx(
          "m-0 flex flex-wrap items-center gap-x-4 gap-y-2",
          align === "center" ? "justify-center" : "justify-start",
        )}
      >
        {/* Plain word — per-character stagger for Latin, per-word
            stagger for Arabic / cursive scripts so letterforms stay
            connected. `aria-label` gives SR users the whole word
            regardless of visual split. */}
        <motion.span
          aria-label={plain}
          className="inline-block font-display text-4xl font-black uppercase leading-none text-cs-text md:text-6xl lg:text-7xl"
          variants={plainContainer}
        >
          {parts.map((part, i) =>
            /^\s+$/.test(part) ? (
              <span key={i} aria-hidden>
                {part}
              </span>
            ) : (
              <motion.span
                key={i}
                aria-hidden
                variants={charVariant}
                style={{ display: "inline-block" }}
              >
                {part === " " ? "\u00A0" : part}
              </motion.span>
            ),
          )}
        </motion.span>

        {/* Pill — handles its own viewport-triggered letter reveal. */}
        <Pill size="lg">{pill}</Pill>
      </Heading>

      {subhead ? (
        <motion.p
          variants={subheadVariant}
          className={clsx(
            "mt-4 text-base text-cs-text-muted md:text-lg",
            align === "center" ? "text-center" : "",
          )}
        >
          {subhead}
        </motion.p>
      ) : null}
    </motion.div>
  );
}
