"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { useReducedMotion, useScroll } from "framer-motion";

import { StageProgressContext } from "./useStageProgress";

type Offset = [string, string];

export type ScrollStageProps = {
  /**
   * Total scroll runway of the stage. A stage taller than the viewport
   * creates the "pinned" illusion — its fixed children stay in view
   * while the runway scrolls through them. Accepts any CSS length.
   *
   * @default "200vh"
   */
  height?: CSSProperties["height"];
  /**
   * Framer Motion `useScroll` offsets. The defaults yield a progress
   * value of 0 when the stage's top edge hits the viewport bottom, and
   * 1 when the stage's bottom edge hits the viewport top.
   *
   * @default ["start end", "end start"]
   */
  offset?: Offset;
  /**
   * Optional extra className on the outer section.
   */
  className?: string;
  /**
   * Optional id for in-page anchors / SEO.
   */
  id?: string;
  children: ReactNode;
};

/**
 * The frieslab "pinned runway" primitive.
 *
 * Renders a `<section>` that reserves `height` of vertical scroll (default
 * 200vh). Inside, any `<Pinned>` child renders as `position: fixed` so it
 * stays in the viewport for the full runway, while the runway itself
 * scrolls past. Children can consume the runway's 0–1 scroll progress via
 * the `useStageProgress()` hook to drive their own enter animations.
 *
 * When `prefers-reduced-motion: reduce` is active, the stage still
 * reserves scroll space but the progress MotionValue is clamped to 1 —
 * children render as if already in their final state, matching CLAUDE.md
 * §7 rules.
 */
export function ScrollStage({
  height = "200vh",
  offset = ["start end", "end start"],
  className,
  id,
  children,
}: ScrollStageProps) {
  const ref = useRef<HTMLElement>(null);
  const shouldReduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    // Framer's types want a 4-tuple here; the 2-tuple is a valid
    // runtime input but the public type is stricter. Cast narrowly.
    offset: offset as unknown as never,
  });

  // When reduced motion is on, force children into their "in view" state
  // by pinning progress at 1. MotionValue reassignment via a static 1 is
  // safe because we only *read* it in consumers.
  const progress = shouldReduce
    ? (scrollYProgress.set(1), scrollYProgress)
    : scrollYProgress;

  return (
    <section
      ref={ref}
      id={id}
      className={className}
      style={{ position: "relative", height }}
      data-scroll-stage
    >
      <StageProgressContext.Provider value={progress}>
        {children}
      </StageProgressContext.Provider>
    </section>
  );
}
