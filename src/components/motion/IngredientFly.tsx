"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
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
   * Retained for backwards compatibility with call sites that used the
   * previous `whileInView` implementation. We now fire on mount so the
   * flag is ignored — kept to avoid forcing a prop-removal refactor.
   */
  repeat?: boolean;
};

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
/**
 * Scroll-velocity micro-rotation.
 *
 * Hero garnishes feel dead if they just pin to their corners after
 * their enter animation completes — real decorations on a cream page
 * should respond to the reader's energy. This hook subscribes to
 * `scrollY` velocity (pixels/sec, signed — negative scrolling up),
 * smooths it with a spring, and maps it to a rotation angle capped at
 * ±8° so the garnish tilts in the direction of scroll, returning to
 * zero when the user stops.
 *
 * The rotation is ADDED to the enter animation's end-state rotate
 * value via `useTransform` composition, so items with a baseline tilt
 * (e.g. Shrimp's rotate=14) still "rest" at their design rotation and
 * only tilt AROUND it when the user scrolls.
 *
 * Hero-only primitive: the hook is cheap (one scroll listener, one
 * spring) but scroll velocity tracking across the entire page would be
 * wasteful for elements below the fold that never see it.
 */
function useScrollTilt(baseRotate: number) {
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smoothed = useSpring(velocity, {
    damping: 18,
    stiffness: 110,
    mass: 0.4,
  });
  // Velocity can easily reach ±3000 px/s on a trackpad flick. Divide
  // to map it into ±8° range, then clamp in case of genuinely wild
  // input (inertial scroll on trackpads can spike higher).
  return useTransform(smoothed, (v) => {
    const tilt = Math.max(-8, Math.min(8, v / 200));
    return baseRotate + tilt;
  });
}

export function IngredientFly({
  from = "left",
  offset,
  delay = 0,
  duration = 0.95,
  pin,
  className,
  style,
  children,
}: IngredientFlyProps) {
  const shouldReduce = useReducedMotion();
  const base = DEFAULTS[from];
  const merged: Offset = { ...base, ...offset };

  // Baseline rotation from the design (e.g. Shrimp rotates 14°, Lemon
  // rotates -18°). Scroll tilt is ADDED to this so items tilt around
  // their resting angle rather than rotating from zero.
  const rotateTilt = useScrollTilt(merged.rotate ?? 0);

  const initial = shouldReduce
    ? { opacity: 1, x: 0, y: 0, scale: merged.scale ?? 1, rotate: merged.rotate ?? 0 }
    : {
        opacity: 0,
        x: merged.x ?? 0,
        y: merged.y ?? 0,
        scale: merged.scale ?? 1,
        rotate: merged.rotate ?? 0,
      };

  const animate = {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    // After the enter animation completes, framer-motion hands off the
    // `rotate` property to the `style.rotate` MotionValue below. The
    // `animate` target matches the baseline so the handoff is seamless
    // (no visible snap when scroll tilt takes over).
    rotate: merged.rotate ?? 0,
  };

  return (
    <motion.div
      className={className}
      style={{
        willChange: "transform, opacity",
        ...(pin ? PIN_STYLES[pin] : null),
        // Scroll tilt takes over the rotate axis after the enter
        // animation resolves. Reduced-motion users get the static
        // baseline angle — no scroll subscription work.
        ...(shouldReduce ? {} : { rotate: rotateTilt }),
        ...style,
      }}
      initial={initial}
      animate={animate}
      transition={{
        delay,
        duration,
        ease: [0.22, 1, 0.36, 1],
      }}
      aria-hidden="true"
    >
      {children}
    </motion.div>
  );
}
