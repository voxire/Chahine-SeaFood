"use client";

import {
  motion,
  useScroll,
  useSpring,
  useReducedMotion,
  useTransform,
} from "framer-motion";

const RING_RADIUS = 16;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS; // ≈100.53

/**
 * Scroll progress — two coordinated indicators:
 *
 *   1. Thin horizontal hairline fixed just under the navbar (the
 *      frieslab gold band). Scales from 0→1 with scroll.
 *   2. Circular percentage ring at bottom-right that fades in after
 *      ~20% page scroll and out past ~95%. The ring arc tracks
 *      progress exactly; a small "42" / "83" style number sits in
 *      the centre for readers who want a precise hint of how far
 *      they've scrolled through a long page.
 *
 * Both indicators hide under `prefers-reduced-motion: reduce`.
 *
 * Why appear after 20% not 0%? On the hero itself the hairline alone
 * is enough — a corner ring at 3% would be noise. The ring earns its
 * screen real-estate only when the user is clearly committed to
 * scrolling through the page, and disappears before the footer so it
 * doesn't dilute the final CTA.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 20,
    mass: 0.3,
  });
  const prefersReduced = useReducedMotion();

  // Ring opacity: invisible until 15%, full between 22% and 92%, fades
  // out approaching 98%. The 15→22 ramp gives the ring a soft entrance
  // instead of popping in at exactly 20%.
  const ringOpacity = useTransform(
    scrollYProgress,
    [0.15, 0.22, 0.92, 0.98],
    [0, 1, 1, 0],
  );
  // Dash offset drives the arc length. `strokeDasharray = circumference`
  // means the dash is exactly one full loop; offsetting by `circumference
  // * (1 - progress)` pulls the loop closed from empty → full as we
  // scroll. Spring-smoothed so the arc feels weighted, not digital.
  const smoothedProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 24,
    mass: 0.45,
  });
  const dashOffset = useTransform(
    smoothedProgress,
    (p) => RING_CIRCUMFERENCE * (1 - p),
  );
  // Percentage number (0–100). MotionValue children in motion.span
  // render live without triggering React re-renders.
  const percent = useTransform(smoothedProgress, (p) => Math.round(p * 100));

  if (prefersReduced) return null;

  return (
    <>
      {/* Hairline under the navbar — unchanged from the original
          ScrollProgress. Keep as the always-on, never-intrusive
          baseline indicator. */}
      <motion.div
        aria-hidden
        className="fixed left-0 top-[72px] z-40 h-[2px] w-full origin-left bg-cs-gold"
        style={{ scaleX }}
      />

      {/* Circular percentage ring — bottom-right (bottom-left under
          RTL). `pointer-events-none` so it never intercepts clicks. */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed bottom-6 right-6 z-40 h-11 w-11 rtl:left-6 rtl:right-auto"
        style={{ opacity: ringOpacity }}
      >
        <svg viewBox="0 0 40 40" className="h-full w-full -rotate-90">
          {/* Track — faint navy ring under the progress arc. */}
          <circle
            cx="20"
            cy="20"
            r={RING_RADIUS}
            fill="none"
            stroke="var(--cs-blue-deep)"
            strokeOpacity="0.14"
            strokeWidth="2.5"
          />
          {/* Progress arc — gold. Animated via strokeDashoffset. */}
          <motion.circle
            cx="20"
            cy="20"
            r={RING_RADIUS}
            fill="none"
            stroke="var(--cs-gold)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={RING_CIRCUMFERENCE}
            style={{ strokeDashoffset: dashOffset }}
          />
        </svg>
        {/* Percentage digits in the centre. `tabular-nums` keeps the
            digits from shifting as values tick over. */}
        <motion.span
          data-cs-ring="digits"
          className="absolute inset-0 flex items-center justify-center font-display text-[10px] font-black leading-none tabular-nums text-cs-blue-deep"
        >
          {percent}
        </motion.span>
      </motion.div>
    </>
  );
}
