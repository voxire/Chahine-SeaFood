"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Route-change curtain. On every navigation, a full-height cream sheet
 * travels upward through the viewport: slides up from below to fully
 * cover, holds briefly on a rotating ship's-wheel + wordmark brand beat,
 * then slides off the top. Total ~950ms.
 *
 * Why a curtain (not a clip-path polygon). The previous implementation
 * used a rect-corner clip-path that read as a corner sweep rather than a
 * clean sheet — the eye tracked a diagonal edge travelling across the
 * viewport instead of a continuous vertical plane, which doesn't match
 * the reference quality bar (frieslab.net). A single sheet translating
 * on the Y axis is the classic cinematic curtain and is what we want.
 *
 * Sequencing
 * ──────────
 * The element is keyed on `pathname` inside `AnimatePresence`. On each
 * nav:
 *   t=0        sheet sits at y=100% (just below the viewport)
 *   t≈0.42s    y=0%, viewport fully covered, hold phase begins
 *   t≈0.58s    hold ends, sheet starts sliding off the top
 *   t≈0.95s    y=−100%, unmount
 *
 * React has already swapped the page content under the sheet during the
 * cover phase, so when the curtain slides off the top the new route is
 * revealed in place with no visible content swap.
 *
 * The inner wheel + wordmark stack fades in/out around the cover
 * window so it only reads during the hold, not as it's mid-travel.
 *
 * Reduced motion: collapse to a brief opacity cross-fade; the brand
 * hold beat still lands, minus the translate.
 *
 * `initial={false}` on AnimatePresence keeps the curtain from playing
 * on first mount — `ShipsWheelPreloader` already owns that moment.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const shouldReduce = useReducedMotion();

  // Cubic easing tuned to feel like a weighted cloth drop: slow start,
  // quick middle, soft landing. Tighter than Chahine's default
  // --cs-ease so the curtain has more authority.
  const curtainEase: [number, number, number, number] = [0.76, 0, 0.24, 1];

  return (
    <>
      {children}
      <AnimatePresence mode="sync" initial={false}>
        <motion.div
          key={pathname}
          className="pointer-events-none fixed inset-0 z-[9000] flex items-center justify-center"
          initial={
            shouldReduce ? { opacity: 0, y: 0 } : { y: "100%", opacity: 1 }
          }
          animate={
            shouldReduce
              ? { opacity: [0, 1, 1, 0] }
              : { y: ["100%", "0%", "0%", "-100%"] }
          }
          transition={
            shouldReduce
              ? {
                  duration: 0.55,
                  times: [0, 0.28, 0.62, 1],
                  ease: [0.22, 1, 0.36, 1],
                }
              : {
                  duration: 0.95,
                  times: [0, 0.42, 0.58, 1],
                  ease: curtainEase,
                }
          }
          exit={{ opacity: 0 }}
          style={{
            background: "var(--cs-bg)",
            // Same wave-pattern texture the Hero uses, for brand cohesion.
            backgroundImage: "url(/patterns/wave.svg)",
            backgroundRepeat: "repeat",
            backgroundSize: "480px",
            backgroundPosition: "center",
          }}
        >
          {/* Brand hold beat — mini wheel + wordmark. Fades in as the
              curtain reaches full cover, holds through the hold window,
              fades out as the curtain begins to slide off. Tied to the
              same parent timeline so it always syncs with the cover. */}
          <motion.div
            className="flex flex-col items-center gap-4"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={
              shouldReduce
                ? { opacity: 1, scale: 1 }
                : {
                    opacity: [0, 0, 1, 1, 0],
                    scale: [0.94, 0.94, 1, 1, 0.98],
                  }
            }
            transition={
              shouldReduce
                ? { duration: 0.3 }
                : {
                    duration: 0.95,
                    times: [0, 0.35, 0.48, 0.62, 0.82],
                    ease: [0.22, 1, 0.36, 1],
                  }
            }
          >
            {/* Mini ship's wheel — same geometry as the preloader, scaled
                down. Continuous slow rotation so the frame feels alive
                during the hold (disabled under reduced motion). */}
            <svg
              viewBox="0 0 160 160"
              width="88"
              height="88"
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

              {/* Eight spokes radiating to handle knobs. */}
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

            {/* Wordmark echo — tight two-line CHAHINE / SEAFOOD stack
                matching the client's circular logo. Smaller than the
                preloader's wordmark since this is a transient beat. */}
            <div className="flex flex-col items-center gap-0.5">
              <p className="font-display text-sm font-black uppercase leading-none tracking-[0.24em] text-cs-blue-deep">
                Chahine
              </p>
              <p className="font-display text-xs font-black uppercase leading-none tracking-[0.34em] text-cs-gold">
                Seafood
              </p>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
