"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

type CursorState = "default" | "link" | "cta" | "media";

const STATE_MAP: Record<string, CursorState> = {
  link: "link",
  cta: "cta",
  media: "media",
};

/**
 * Custom cursor — dot + ring that morphs over interactive targets.
 *
 * On by default for mouse-driven desktop (`(hover: hover) and
 * (pointer: fine)`). The previous `?cursor=1` opt-in gate is gone now
 * that the cursor has been tuned across all four states and we've
 * confirmed it doesn't fight the rest of the motion language. A kill
 * switch `?cursor=0` remains for screenshot / video capture workflows
 * where a floating brand cursor gets in the way.
 *
 * Hiding rules (in order of priority):
 *   1. Not mounted on touch devices or touch-capable browsers with
 *      coarse pointers — `(hover: hover) and (pointer: fine)` is the
 *      canonical CSS feature query for "real mouse with hover state."
 *   2. Hidden under `prefers-reduced-motion: reduce`.
 *   3. Hidden when the user passes `?cursor=0`.
 *
 * Targeting: any element with `data-cursor="<state>"` morphs the
 * cursor into the corresponding state on hover. States:
 *   - `link`  — 56px ring, cobalt outline
 *   - `cta`   — 80px gold disc, slight scale pulse
 *   - `media` — 120px ring with gold outline
 *   - (none)  — default 36px ring + 8px dot
 */
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [state, setState] = useState<CursorState>("default");
  const shouldReduce = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  // Raw pointer position — the dot reads these directly (no lag).
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  // Ring position — softened by a spring so it trails the dot.
  const ringX = useSpring(x, { damping: 24, stiffness: 260, mass: 0.4 });
  const ringY = useSpring(y, { damping: 24, stiffness: 260, mass: 0.4 });

  // Gate: desktop mouse + not reduced-motion + not killed via query.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const qs = new URLSearchParams(window.location.search);
    if (qs.get("cursor") === "0") {
      setEnabled(false);
      return;
    }
    const desktop = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    setEnabled(desktop && !shouldReduce);
  }, [shouldReduce]);

  // Mouse tracking — only wired when enabled so disabled sessions pay
  // zero pointer-event cost.
  useEffect(() => {
    if (!enabled) return;
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const target = (e.target as HTMLElement | null)?.closest("[data-cursor]");
      if (!target) return setState("default");
      const raw = target.getAttribute("data-cursor") ?? "default";
      setState(STATE_MAP[raw] ?? "default");
    };
    const leave = () => setState("default");
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    window.addEventListener("pointerout", leave, { passive: true });
    document.documentElement.classList.add("cs-cursor-hidden");
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerout", leave);
      document.documentElement.classList.remove("cs-cursor-hidden");
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const ringSize =
    state === "cta" ? 80 : state === "media" ? 120 : state === "link" ? 56 : 36;
  const ringFill = state === "cta" ? "var(--cs-gold-soft)" : "transparent";
  const ringBorder =
    state === "media"
      ? "var(--cs-gold)"
      : state === "cta"
        ? "var(--cs-gold)"
        : "var(--cs-blue)";

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[9999]"
    >
      {/* Ring — smoothly trails the pointer. Morphs size + color per state. */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border-2"
        style={{
          x: ringX,
          y: ringY,
          translate: "-50% -50%",
          width: ringSize,
          height: ringSize,
          background: ringFill,
          borderColor: ringBorder,
          mixBlendMode: state === "cta" ? "normal" : "multiply",
        }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        animate={{ width: ringSize, height: ringSize }}
      />
      {/* Dot — tracks instantly. Hidden on every non-default state to
          keep the morphed ring legible. */}
      {state === "default" && (
        <motion.div
          className="fixed top-0 left-0 h-2 w-2 rounded-full"
          style={{
            x,
            y,
            translate: "-50% -50%",
            background: "var(--cs-blue-deep)",
          }}
        />
      )}
    </div>
  );
}
