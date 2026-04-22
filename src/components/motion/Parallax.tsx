"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Total Y travel in px from enter to leave. Positive = element moves up slower than scroll. */
  offset?: number;
  className?: string;
};

/**
 * Scroll-driven parallax. Translates children on the Y axis as the element
 * passes through the viewport. Respects `prefers-reduced-motion`.
 */
export function Parallax({ children, offset = 80, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);

  if (prefersReduced) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div ref={ref} className={className} style={{ y }}>
      {children}
    </motion.div>
  );
}
