"use client";

import { motion, useReducedMotion } from "framer-motion";
import clsx from "clsx";
import type { ElementType } from "react";

type Mode = "char" | "word" | "auto";
type Tag = "span" | "div" | "h1" | "h2" | "h3" | "h4" | "p";

type Props = {
  children: string;
  /** How to split the text. `"auto"` picks word-split for cursive scripts. */
  mode?: Mode;
  /** Seconds between each unit's reveal. */
  stagger?: number;
  /** Initial Y offset in px. */
  y?: number;
  /** Delay before the first unit starts. */
  delay?: number;
  /** Per-unit animation duration. */
  duration?: number;
  /** Render container tag. */
  as?: Tag;
  className?: string;
};

/**
 * Scripts where letters must stay in a single run so shaping / joining works.
 * Splitting by grapheme breaks Arabic's cursive connections (same bug we hit
 * in Pill).
 */
const CURSIVE_SCRIPT_RE =
  /[\u0590-\u05FF\u0600-\u06FF\u0700-\u074F\u0750-\u077F\u08A0-\u08FF\uFB00-\uFDFF\uFE70-\uFEFF]/;

/**
 * Text reveal that staggers each unit in with a `y + opacity` spring.
 * Uses parent-driven variants so the whole element owns ONE intersection
 * observer regardless of unit count.
 *
 * - `mode="char"`: one unit per character (Latin only — breaks Arabic shaping).
 * - `mode="word"`: one unit per whitespace-separated word.
 * - `mode="auto"`: word for cursive scripts, char otherwise. Default.
 *
 * Respects `prefers-reduced-motion`.
 */
export function SplitText({
  children,
  mode = "auto",
  stagger = 0.04,
  y = 24,
  delay = 0,
  duration = 0.55,
  as = "span",
  className,
}: Props) {
  const prefersReduced = useReducedMotion();
  const text = children;

  const effectiveMode: Exclude<Mode, "auto"> =
    mode === "auto"
      ? CURSIVE_SCRIPT_RE.test(text)
        ? "word"
        : "char"
      : mode;

  // Reduced motion — render plain text, no units, no animation.
  if (prefersReduced || text.length === 0) {
    const Tag = as as ElementType;
    return <Tag className={className}>{text}</Tag>;
  }

  const units =
    effectiveMode === "word"
      ? text.split(/(\s+)/) // keep whitespace as its own entry
      : Array.from(text); // graphemes-ish (Array.from handles surrogate pairs)

  // Typed access to `motion.<tag>` — the map avoids `motion[as]` indexing
  // which TypeScript won't narrow.
  const motionMap = {
    span: motion.span,
    div: motion.div,
    h1: motion.h1,
    h2: motion.h2,
    h3: motion.h3,
    h4: motion.h4,
    p: motion.p,
  } as const;
  const Outer = motionMap[as];

  return (
    <Outer
      className={clsx("inline-block", className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{
        staggerChildren: stagger,
        delayChildren: delay,
      }}
    >
      {units.map((unit, i) => {
        // Preserve whitespace without animating it.
        if (effectiveMode === "word" && /^\s+$/.test(unit)) {
          return <span key={i}>{unit}</span>;
        }
        if (effectiveMode === "char" && unit === " ") {
          return <span key={i}>{"\u00A0"}</span>;
        }
        return (
          <motion.span
            key={i}
            variants={{
              hidden: { y, opacity: 0 },
              visible: { y: 0, opacity: 1 },
            }}
            transition={{
              duration,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{ display: "inline-block" }}
          >
            {unit}
          </motion.span>
        );
      })}
    </Outer>
  );
}
