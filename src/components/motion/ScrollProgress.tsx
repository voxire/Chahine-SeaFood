"use client";

import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";

/**
 * Thin horizontal progress bar fixed just under the navbar. Mirrors the gold
 * hairline frieslab uses under its logo. Hides entirely when the user
 * prefers reduced motion.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 20,
    mass: 0.3,
  });
  const prefersReduced = useReducedMotion();

  if (prefersReduced) return null;

  return (
    <motion.div
      aria-hidden
      className="fixed left-0 top-[72px] z-40 h-[2px] w-full origin-left bg-cs-gold"
      style={{ scaleX }}
    />
  );
}
