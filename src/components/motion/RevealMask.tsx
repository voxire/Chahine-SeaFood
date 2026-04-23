"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef, type CSSProperties, type ReactNode } from "react";

type Direction = "top" | "right" | "bottom" | "left";

/**
 * Ranges passed to `useScroll`'s `offset` parameter — the first value
 * marks 0% progress and the second marks 100%. See framer-motion docs
 * for the full vocabulary. We narrow to strings here so the TS types
 * don't require the consumer to import framer-motion's internal type.
 */
type ScrollOffsetRange = [string, string];

type Props = {
  children: ReactNode;
  /** Which edge the mask pulls back from. `bottom` = content emerges from below. */
  direction?: Direction;
  className?: string;
  /**
   * Scroll range that drives the reveal. Default starts the moment the
   * element enters the viewport and completes once its top edge hits
   * the viewport center. Slower ranges (e.g. `["start end", "center center"]`)
   * stretch the reveal across a longer scroll distance.
   */
  offset?: ScrollOffsetRange;
};

const INITIAL_BY_DIR: Record<Direction, string> = {
  bottom: "inset(100% 0% 0% 0%)",
  top: "inset(0% 0% 100% 0%)",
  left: "inset(0% 100% 0% 0%)",
  right: "inset(0% 0% 0% 100%)",
};

const OPEN_INSET = "inset(0% 0% 0% 0%)";

/**
 * RevealMask — scroll-driven clip-path reveal for imagery.
 *
 * Wraps children (usually a `<Image>` or any visual block) in a
 * container whose `clip-path` interpolates from one edge fully clipped
 * to `inset(0% 0% 0% 0%)` as the element scrolls through its trigger
 * range. Because the clip-path is animated — not the content — the
 * image stays at its natural size and position; there's no seam when
 * the reveal completes.
 *
 * The reveal is tied to scroll progress rather than a one-shot
 * viewport trigger so the motion feels cinematic (the image emerges
 * AS the user scrolls, not in a single pop).
 *
 * Default direction is `bottom` — content pulls up from below. Use
 * `top` / `left` / `right` for alternate gestures.
 *
 * Reduced motion: renders children with no mask at all.
 *
 * Use inside a container with `overflow: hidden` so the clipped edges
 * can't bleed into neighbouring content.
 */
export function RevealMask({
  children,
  direction = "bottom",
  className,
  offset = ["start end", "start center"],
}: Props) {
  const shouldReduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // framer-motion's `offset` type is a strict union of template-literal
  // shapes — cast at the boundary so consumers can pass plain strings
  // without dragging the internal `ScrollOffset` type into the API.
  // The runtime accepts `["string", "string"]`; only the static type is
  // stricter.
  const scrollOptions = {
    target: ref,
    offset: offset,
  } as unknown as Parameters<typeof useScroll>[0];
  const { scrollYProgress } = useScroll(scrollOptions);

  const clipPath = useTransform(
    scrollYProgress,
    [0, 1],
    [INITIAL_BY_DIR[direction], OPEN_INSET],
  );

  if (shouldReduce) {
    return <div className={className}>{children}</div>;
  }

  // Cast the MotionValue into style — framer-motion accepts
  // MotionValues in the `style` prop at runtime, but the TS types only
  // allow string for `WebkitClipPath` when we're not using
  // framer-motion's own `MotionStyle` type. Compose manually.
  const style: CSSProperties = {
    clipPath: clipPath as unknown as string,
    WebkitClipPath: clipPath as unknown as string,
  };

  return (
    <motion.div ref={ref} className={className} style={style as MotionStyleLike}>
      {children}
    </motion.div>
  );
}

/**
 * Local-narrow alias so the `style` cast carries MotionValue support
 * without pulling in framer-motion's internal MotionStyle type.
 */
type MotionStyleLike = CSSProperties & {
  clipPath?: MotionValue<string> | string;
  WebkitClipPath?: MotionValue<string> | string;
};
