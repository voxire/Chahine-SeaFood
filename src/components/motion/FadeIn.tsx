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
 * Use this as the default wrapper for any element that should animate in.
 */
export function FadeIn({
  children,
  delay = 0,
  y = 16,
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
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
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
