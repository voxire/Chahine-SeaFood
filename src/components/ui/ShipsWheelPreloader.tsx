"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Ship's-wheel brand preloader — gold line art on cream, slow continuous
 * spin, with the Chahine Seafood wordmark anchored below and a school of
 * stylised fish drifting horizontally across the overlay so the moment
 * feels like an aquarium rather than a generic spinner. Mounted once in
 * `app/[locale]/layout.tsx` so it appears on every full page load and
 * locale switch, but NOT on client-side route transitions (the layout
 * persists across them).
 *
 * Behavioural contract
 * ────────────────────
 * • Shows immediately on mount (SSR-visible, no flash during hydration).
 * • Stays up for at least `MIN_VISIBLE_MS` so the brand beat lands even
 *   on instant loads — skipping it on fast connections would feel too
 *   abrupt and negate the whole point of having one.
 * • Fades out once BOTH the min-time and `document.readyState` have
 *   resolved ("complete"), so fonts + above-the-fold images have had a
 *   chance to settle before we unveil the page.
 * • Hard cap at `MAX_VISIBLE_MS` — if something never fires the `load`
 *   event (stalled analytics, slow third-party script) we dismiss
 *   anyway rather than leaving the overlay stuck on screen forever.
 * • `prefers-reduced-motion: reduce` → no spin, static wheel, no fish
 *   swimming, shorter min-time. Brand moment still lands, minus motion.
 * • Locks `<html>` scroll while visible so underlying content can't be
 *   dragged around on mobile.
 */
const MIN_VISIBLE_MS = 1400;
const MIN_VISIBLE_REDUCED_MS = 400;
const MAX_VISIBLE_MS = 4500;

/**
 * Fish swim-lane choreography. Each entry is one stylised fish placed at
 * a fixed vertical offset (`top`), crossing the viewport at its own
 * pace. The `visibleVw` field says where along its path the fish should
 * appear at t=0 — we convert that into a negative `animation-delay` so
 * the fish is already mid-swim the instant the overlay paints, rather
 * than waiting off-screen for a one-second preloader window that will
 * dismiss before it ever enters frame.
 */
type FishSpec = {
  id: string;
  /** Vertical position as a CSS `top` value (percent of viewport). */
  top: string;
  /** Direction of travel — "right" enters left, exits right. */
  dir: "left" | "right";
  /** Visual scale applied to the base 40×16 fish silhouette. */
  scale: number;
  /** Seconds for a full start→end traversal (animation duration). */
  duration: number;
  /** Where the fish should appear horizontally at t=0, in vw. */
  visibleVw: number;
  /** Fill token — gold reads brighter, navy reads as a silhouette. */
  fill: "gold" | "navy";
  /** Opacity. Tuned high enough to read on cream without competing. */
  opacity: number;
};

const START_VW = -14;
const END_VW = 114;
const PATH_VW = END_VW - START_VW;

const FISH: FishSpec[] = [
  { id: "a", top: "14%", dir: "right", scale: 0.9,  duration: 12, visibleVw: 20, fill: "navy", opacity: 0.45 },
  { id: "b", top: "26%", dir: "left",  scale: 0.7,  duration: 10, visibleVw: 75, fill: "gold", opacity: 0.8  },
  { id: "c", top: "72%", dir: "right", scale: 1.15, duration: 14, visibleVw: 55, fill: "gold", opacity: 0.75 },
  { id: "d", top: "82%", dir: "left",  scale: 0.85, duration: 11, visibleVw: 15, fill: "navy", opacity: 0.5  },
  { id: "e", top: "58%", dir: "right", scale: 0.65, duration: 9,  visibleVw: 85, fill: "navy", opacity: 0.55 },
  { id: "f", top: "8%",  dir: "left",  scale: 0.8,  duration: 13, visibleVw: 35, fill: "gold", opacity: 0.7  },
];

/**
 * For a given fish, work out the negative `animation-delay` needed so
 * it's already at `visibleVw` when the overlay mounts. The clamp keeps
 * us inside [-duration, 0] in case a spec value strays outside the
 * start→end range.
 */
function negativeDelayFor(f: FishSpec): number {
  const startAt = f.dir === "right" ? START_VW : END_VW;
  const travelled = Math.abs(f.visibleVw - startAt);
  const progress = Math.min(1, Math.max(0, travelled / PATH_VW));
  return -progress * f.duration;
}

/** Stylised fish silhouette — oval body, triangular tail, cream eye. */
function FishGlyph({ fill }: { fill: "gold" | "navy" }) {
  const colour =
    fill === "gold" ? "var(--cs-gold-soft)" : "var(--cs-blue-deep)";
  return (
    <svg
      viewBox="0 0 40 16"
      width="40"
      height="16"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {/* Body — soft lens shape. */}
      <path
        d="M 2 8 C 6 2, 22 1, 30 8 C 22 15, 6 14, 2 8 Z"
        fill={colour}
      />
      {/* Tail — triangular fin off the back. */}
      <path d="M 30 8 L 38 3 L 38 13 Z" fill={colour} />
      {/* Eye — cream dot so the creature reads on cream bg. */}
      <circle cx="8" cy="7.5" r="0.9" fill="var(--cs-bg)" />
    </svg>
  );
}

export function ShipsWheelPreloader() {
  const shouldReduce = useReducedMotion();
  const [visible, setVisible] = useState(true);

  // Dismiss on (readyState === "complete" && elapsed ≥ min) || safety.
  useEffect(() => {
    const mountedAt = Date.now();
    const minMs = shouldReduce ? MIN_VISIBLE_REDUCED_MS : MIN_VISIBLE_MS;
    let pendingTimer: number | null = null;

    const tryDismiss = () => {
      const elapsed = Date.now() - mountedAt;
      const remaining = Math.max(0, minMs - elapsed);
      if (pendingTimer !== null) window.clearTimeout(pendingTimer);
      pendingTimer = window.setTimeout(() => setVisible(false), remaining);
    };

    if (document.readyState === "complete") {
      tryDismiss();
    } else {
      window.addEventListener("load", tryDismiss, { once: true });
    }

    // Safety net — never let the overlay block the page indefinitely.
    const safety = window.setTimeout(() => setVisible(false), MAX_VISIBLE_MS);

    return () => {
      window.removeEventListener("load", tryDismiss);
      window.clearTimeout(safety);
      if (pendingTimer !== null) window.clearTimeout(pendingTimer);
    };
  }, [shouldReduce]);

  // Freeze underlying scroll while the overlay is up so it can't
  // compete with the reveal animation or cause a mid-dismiss jump.
  useEffect(() => {
    if (!visible) return;
    const el = document.documentElement;
    const previous = el.style.overflow;
    el.style.overflow = "hidden";
    return () => {
      el.style.overflow = previous;
    };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="status"
          aria-live="polite"
          aria-label="Loading Chahine Seafood"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[999] overflow-hidden bg-cs-bg"
        >
          {/* Keyframes scoped to the preloader. Kept inline (rather than
              in globals.css) so the rule lives next to the markup it
              drives — nothing else in the app animates horizontal vw
              translation like this. `dangerouslySetInnerHTML` is how
              React lets us emit raw CSS without escaping braces. */}
          <style
            dangerouslySetInnerHTML={{
              __html: `
                @keyframes cs-swim-right {
                  from { transform: translateX(${START_VW}vw); }
                  to   { transform: translateX(${END_VW}vw); }
                }
                @keyframes cs-swim-left {
                  from { transform: translateX(${END_VW}vw); }
                  to   { transform: translateX(${START_VW}vw); }
                }
              `,
            }}
          />

          {/* ────────────────────────────────────────────────────────────
             Fish swim-lane. Sits behind the wheel + wordmark, non-
             interactive. Hidden under reduced motion so the overlay
             reduces to a still brand plate rather than a kinetic scene.
             ──────────────────────────────────────────────────────────── */}
          {!shouldReduce && (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
            >
              {FISH.map((f) => (
                <div
                  key={f.id}
                  className="absolute left-0"
                  style={{
                    top: f.top,
                    opacity: f.opacity,
                    // CSS keyframes are rock-solid for continuous
                    // ambient motion — no dependency on framer-motion
                    // picking up the initial state before first paint.
                    // Negative delay = already mid-swim at t=0 so the
                    // school reads immediately, even on fast loads
                    // that dismiss the overlay in ~1.4s.
                    animation: `cs-swim-${f.dir} ${f.duration}s linear ${negativeDelayFor(
                      f,
                    )}s infinite`,
                    willChange: "transform",
                  }}
                >
                  {/* Inner wrapper carries the scale + horizontal flip
                      so the outer node's `transform: translateX(...)`
                      driven by the keyframes isn't overwritten. */}
                  <div
                    style={{
                      transform: `scale(${f.scale}) ${
                        f.dir === "left" ? "scaleX(-1)" : ""
                      }`,
                      transformOrigin: "center",
                    }}
                  >
                    <FishGlyph fill={f.fill} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ────────────────────────────────────────────────────────────
             Centre stack — wheel + wordmark. `relative` so it layers
             above the fish lane regardless of source order.
             ──────────────────────────────────────────────────────────── */}
          <div className="relative flex h-full flex-col items-center justify-center gap-6 px-6">
            <svg
              viewBox="0 0 160 160"
              width="140"
              height="140"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
              className={
                shouldReduce
                  ? "origin-center"
                  : "origin-center animate-[spin_3.2s_linear_infinite]"
              }
            >
              {/* Outer rim — thin double-stroke band. */}
              <circle
                cx="80"
                cy="80"
                r="50"
                fill="none"
                stroke="var(--cs-blue-deep)"
                strokeWidth="1.5"
              />
              <circle
                cx="80"
                cy="80"
                r="46"
                fill="none"
                stroke="var(--cs-blue-deep)"
                strokeWidth="0.75"
              />

              {/* Eight spokes — from the hub edge out through the rim
                  to the knob centres (the gripping handles on a real
                  helm). */}
              <g
                stroke="var(--cs-blue-deep)"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <line x1="98"    y1="80"    x2="150"   y2="80" />
                <line x1="92.73" y1="92.73" x2="129.5" y2="129.5" />
                <line x1="80"    y1="98"    x2="80"    y2="150" />
                <line x1="67.27" y1="92.73" x2="30.5"  y2="129.5" />
                <line x1="62"    y1="80"    x2="10"    y2="80" />
                <line x1="67.27" y1="67.27" x2="30.5"  y2="30.5" />
                <line x1="80"    y1="62"    x2="80"    y2="10" />
                <line x1="92.73" y1="67.27" x2="129.5" y2="30.5" />
              </g>

              {/* Eight gold handle knobs. */}
              <g
                fill="var(--cs-gold)"
                stroke="var(--cs-blue-deep)"
                strokeWidth="1.25"
              >
                <circle cx="150"   cy="80"    r="6" />
                <circle cx="129.5" cy="129.5" r="6" />
                <circle cx="80"    cy="150"   r="6" />
                <circle cx="30.5"  cy="129.5" r="6" />
                <circle cx="10"    cy="80"    r="6" />
                <circle cx="30.5"  cy="30.5"  r="6" />
                <circle cx="80"    cy="10"    r="6" />
                <circle cx="129.5" cy="30.5"  r="6" />
              </g>

              {/* Central hub — gold cap with a navy boss. */}
              <circle
                cx="80"
                cy="80"
                r="14"
                fill="var(--cs-gold)"
                stroke="var(--cs-blue-deep)"
                strokeWidth="1.5"
              />
              <circle cx="80" cy="80" r="4" fill="var(--cs-blue-deep)" />
            </svg>

            {/* Wordmark — two-line split mirroring the client's logo:
                navy "CHAHINE" over gold "SEAFOOD", both in the display
                font with extra tracking for the signage feel. */}
            <div className="flex flex-col items-center gap-1">
              <p className="font-display text-xl font-black uppercase leading-none tracking-[0.24em] text-cs-blue-deep sm:text-2xl">
                Chahine
              </p>
              <p className="font-display text-lg font-black uppercase leading-none tracking-[0.34em] text-cs-gold sm:text-xl">
                Seafood
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
