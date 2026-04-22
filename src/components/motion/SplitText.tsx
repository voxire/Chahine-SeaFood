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
 *
 * - `mode="char"` — one motion span per character, **wrapped in a per-word
 *   nowrap group** so the browser still breaks lines only at word
 *   boundaries. Without the wrap, chars are treated as atomic inline-block
 *   boxes and the browser is free to break mid-word at awkward viewport widths.
 * - `mode="word"` — one unit per whitespace-separated word.
 * - `mode="auto"` — word for cursive scripts, char otherwise. Default.
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

  // --- Word mode: every word gets its own motion span ---
  if (effectiveMode === "word") {
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
    const units = text.split(/(\s+)/); // keep whitespace as its own entry

    return (
      <Outer
        className={clsx("inline-block", className)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ staggerChildren: stagger, delayChildren: delay }}
      >
        {units.map((unit, i) => {
          if (/^\s+$/.test(unit)) return <span key={i}>{unit}</span>;
          return (
            <motion.span
              key={i}
              variants={{
                hidden: { y, opacity: 0 },
                visible: { y: 0, opacity: 1 },
              }}
              transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: "inline-block" }}
            >
              {unit}
            </motion.span>
          );
        })}
      </Outer>
    );
  }

  // --- Char mode: chars animated individually, but grouped by word ---
  // Each word is an `inline-block` `whitespace-nowrap` span so the browser
  // can only wrap BETWEEN words, never between chars within a word.
  // We use explicit per-char delay (instead of variants + staggerChildren)
  // because the chars are grandchildren through the nowrap word wrapper,
  // and Framer's staggerChildren only hits direct motion children.
  const words = text.split(/(\s+)/);
  const Tag = as as ElementType;
  let charIndex = 0;

  return (
    <Tag className={clsx("inline-block", className)}>
      {words.map((word, wi) => {
        if (/^\s+$/.test(word)) {
          return <span key={wi}>{word}</span>;
        }
        return (
          <span
            key={wi}
            style={{
              display: "inline-block",
              whiteSpace: "nowrap",
            }}
          >
            {Array.from(word).map((ch) => {
              const i = charIndex++;
              return (
                <motion.span
                  key={i}
                  initial={{ y, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{
                    duration,
                    delay: delay + i * stagger,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  style={{ display: "inline-block" }}
                >
                  {ch}
                </motion.span>
              );
            })}
          </span>
        );
      })}
    </Tag>
  );
}
