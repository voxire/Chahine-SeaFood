"use client";

import { motion, useReducedMotion, type MotionProps } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";

type Direction = "left" | "right" | "top" | "bottom";

type Offset = {
  /** Translation on the X axis at initial state (any CSS length). */
  x?: string | number;
  /** Translation on the Y axis at initial state (any CSS length). */
  y?: string | number;
  /** Initial scale (1 = final size). */
  scale?: number;
  /** Initial rotation in degrees. */
  rotate?: number;
};

export type IngredientFlyProps = {
  /**
   * Edge the ingredient flies in from. Sets a sensible default offset;
   * override fine-grained values via `offset`.
   *
   * - `"left"`   → `translateX(-55vw)`
   * - `"right"`  → `translateX(55vw)`
   * - `"top"`    → `translateY(-40vh)`
   * - `"bottom"` → `translateY(40vh)`
   */
  from?: Direction;
  /**
   * Per-axis fine-tuning. Merged on top of the `from` defaults. Useful
   * for diagonal entries ("from left but slightly from below").
   */
  offset?: Offset;
  /** Delay in seconds before the animation starts. */
  delay?: number;
  /**
   * Total duration in seconds of the enter animation. Frieslab runs
   * these around 0.9–1.1s — snappy but not abrupt.
   */
  duration?: number;
  /**
   * Absolute positioning helper — if present, the ingredient is pinned
   * to the given viewport corner before it animates out/in.
   */
  pin?:
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "center";
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  /**
   * If `true`, the animation fires every time the element enters the
   * viewport. Default is `false` — matches frieslab's "once and done"
   * feel, saves CPU on long pages.
   */
  repeat?: boolean;
} & Pick<MotionProps, "viewport">;

const DEFAULTS: Record<Direction, Offset> = {
  left: { x: "-55vw" },
  right: { x: "55vw" },
  top: { y: "-40vh" },
  bottom: { y: "40vh" },
};

const PIN_STYLES: Record<NonNullable<IngredientFlyProps["pin"]>, CSSProperties> = {
  "top-left": { position: "absolute", top: "6vh", left: "4vw" },
  "top-right": { position: "absolute", top: "6vh", right: "4vw" },
  "bottom-left": { position: "absolute", bottom: "6vh", left: "4vw" },
  "bottom-right": { position: "absolute", bottom: "6vh", right: "4vw" },
  center: { position: "absolute", top: "50%", left: "50%", translate: "-50% -50%" },
};

/**
 * The frieslab garnish-fly-in. A child (usually a cutout image or a
 * line illustration) starts off-screen and swooshes into place as its
 * parent enters the viewport.
 *
 * Respects `prefers-reduced-motion: reduce` — when set, children are
 * rendered in their final state with no transition.
 */
export function IngredientFly({
  from = "left",
  offset,
  delay = 0,
  duration = 0.95,
  pin,
  className,
  style,
  children,
  repeat = false,
  viewport,
}: IngredientFlyProps) {
  const shouldReduce = useReducedMotion();
  const base = DEFAULTS[from];
  const merged: Offset = { ...base, ...offset };

  const initial = shouldReduce
    ? { opacity: 1, x: 0, y: 0, scale: merged.scale ?? 1, rotate: merged.rotate ?? 0 }
    : {
        opacity: 0,
        x: merged.x ?? 0,
        y: merged.y ?? 0,
        scale: merged.scale ?? 1,
        rotate: merged.rotate ?? 0,
      };

  const animate = { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 };

  return (
    <motion.div
      className={className}
      style={{
        willChange: "transform, opacity",
        ...(pin ? PIN_STYLES[pin] : null),
        ...style,
      }}
      initial={initial}
      whileInView={animate}
      transition={{
        delay,
        duration,
        ease: [0.22, 1, 0.36, 1],
      }}
      viewport={viewport ?? { once: !repeat, margin: "-15% 0px -15% 0px" }}
      aria-hidden="true"
    >
      {children}
    </motion.div>
  );
}
