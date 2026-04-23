"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Seconds to delay the enter. */
  delay?: number;
  /** Initial Y offset in px. */
  y?: number;
  /** If the container has multiple children, stagger them by this many seconds. */
  stagger?: number;
  className?: string;
  style?: CSSProperties;
};

/**
 * Baseline enter-on-view fade. Respects `prefers-reduced-motion`.
 *
 * Triggering
 * ──────────
 * Uses `whileInView` with `once: true`, so elements BELOW the fold
 * reveal when they first scroll into the viewport rather than animating
 * silently during the initial page load. Above-the-fold elements fire
 * immediately on mount (their intersection ratio is already >= the
 * threshold).
 *
 * Defaults
 * ────────
 * Tuned for a weighted, cinematic entrance (matching the reference
 * quality bar at frieslab.net): y=32px, duration=0.85s. Callers can
 * override either for lighter/heavier feels.
 */
export function FadeIn({
  children,
  delay = 0,
  y = 32,
  stagger = 0,
  className,
  style,
}: Props) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.85,
        ease: [0.22, 1, 0.36, 1],
        delay,
        staggerChildren: stagger,
      }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}
