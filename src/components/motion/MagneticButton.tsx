"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import clsx from "clsx";

type Props = {
  children: ReactNode;
  /** Max pixels the button is pulled toward the cursor. */
  strength?: number;
  className?: string;
};

/**
 * Wrapper that translates its child toward the cursor on pointer-move, then
 * releases back to origin on pointer-leave. A lightweight spring keeps the
 * motion organic. No-op on touch pointers and when `prefers-reduced-motion`.
 *
 * Usage:
 *   <MagneticButton><LinkButton href="/menu">Browse</LinkButton></MagneticButton>
 *
 * Max pull is clamped both by percentage of half-size and by the `strength`
 * cap, so a very narrow button never moves further than a wide one.
 */
export function MagneticButton({ children, strength = 12, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const prefersReduced = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 170, damping: 16, mass: 0.35 });
  const springY = useSpring(y, { stiffness: 170, damping: 16, mass: 0.35 });

  const clamp = (value: number, cap: number) =>
    Math.max(-cap, Math.min(cap, value));

  function handlePointerMove(e: PointerEvent<HTMLSpanElement>) {
    if (prefersReduced) return;
    if (e.pointerType === "touch") return; // no hover on touch devices

    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    // Distance from center, expressed as a fraction of half the element's size.
    // Multiplied by `strength` gives the target translation, which we then
    // clamp hard at ±strength so nothing escapes.
    const normalX = ((e.clientX - cx) / (rect.width / 2)) * strength;
    const normalY = ((e.clientY - cy) / (rect.height / 2)) * strength;

    x.set(clamp(normalX, strength));
    y.set(clamp(normalY, strength));
  }

  function handlePointerLeave() {
    x.set(0);
    y.set(0);
  }

  if (prefersReduced) {
    return (
      <span className={clsx("inline-block", className)}>{children}</span>
    );
  }

  return (
    <motion.span
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ x: springX, y: springY, display: "inline-block" }}
      className={className}
    >
      {children}
    </motion.span>
  );
}
