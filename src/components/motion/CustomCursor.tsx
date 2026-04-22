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
 * Opt-in behind the `?cursor=1` query param per the Q5 decision. The
 * gate lives inside this component so we can wire it into the root
 * layout without shipping it on day one. Once tuned, flip the default
 * to `true` and retire the flag.
 *
 * Hiding rules (in order of priority):
 *   1. Not mounted on touch devices (`@media (pointer: coarse)`).
 *   2. Hidden under `prefers-reduced-motion: reduce`.
 *   3. Hidden when the user hasn't passed `?cursor=1`.
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

  // Gate on query param + non-touch + reduced-motion check.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const qs = new URLSearchParams(window.location.search);
    const wants = qs.get("cursor") === "1";
    const touch = window.matchMedia("(pointer: coarse)").matches;
    setEnabled(wants && !touch && !shouldReduce);
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
