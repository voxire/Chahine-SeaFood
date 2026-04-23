"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

/**
 * Interstitial — pinned sea-line divider between two full sections.
 *
 * Why this section exists. The home page is eight full-bleed beats
 * stacked one after another (Hero → SignatureShowcase → MenuPreview →
 * BranchesTeaser → StoryStrip → Community). Without anything between
 * them, each heavy section butts directly into the next and the page
 * reads as a wall. frieslab uses low-content pinned "breathing" blocks
 * between its hero chapters for exactly this reason — they give the
 * eye somewhere to rest and cue the reader that the next chapter is
 * starting.
 *
 * Motion
 * ──────
 * A single horizontal wave path is the sea surface. As the user
 * scrolls through the stage (220vh runway), the path draws on via
 * `pathLength` 0 → 1. Once drawn, a school of six small fish fade in
 * in a rightward cascade, each slightly behind the last, giving the
 * impression the line "summons" the school.
 *
 * No `<ScrollStage>` used — the component owns its own `useScroll`
 * against its root `<section>` so it stays self-contained and doesn't
 * need to be nested inside a parent stage.
 *
 * Reduced motion
 * ──────────────
 * Under `prefers-reduced-motion: reduce`, the SVG renders in its
 * final state (full path, all fish visible) and the section collapses
 * to a single-viewport spacer so the scroll runway doesn't waste
 * pixels on an animation the reader has asked us not to play.
 */
export function Interstitial() {
  const shouldReduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Path-length timing: 0.15 → 0.55 of the runway. Leaves headroom on
  // either side for the fish cascade and for scroll-in / scroll-out.
  const pathLength = useTransform(scrollYProgress, [0.15, 0.55], [0, 1]);

  // Six fish; each fades in across a small band of scroll progress.
  // The bands overlap so the cascade feels continuous rather than
  // discrete. Centre of the cascade sits around 0.55 → 0.85, right
  // after the line completes.
  const fishRanges: [number, number][] = [
    [0.52, 0.60],
    [0.56, 0.64],
    [0.60, 0.68],
    [0.64, 0.72],
    [0.68, 0.76],
    [0.72, 0.82],
  ];

  // Rest-state (reduced motion or final-state fallback).
  if (shouldReduce) {
    return (
      <section
        ref={ref}
        aria-hidden
        data-bg="navy"
        className="relative h-[40vh] bg-transparent"
      >
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <SeaLineSvg pathProgress={1} fishOpacities={fishRanges.map(() => 1)} />
        </div>
      </section>
    );
  }

  return (
    <section
      ref={ref}
      aria-hidden
      data-bg="navy"
      className="relative h-[220vh] bg-transparent"
    >
      {/* Sticky viewport — pins the SVG at viewport centre while the
          220vh runway scrolls past. */}
      <div
        className="sticky flex h-screen items-center justify-center overflow-hidden"
        style={{ top: "var(--cs-nav-h, 72px)", height: "calc(100vh - var(--cs-nav-h, 72px))" }}
      >
        <InterstitialInner
          pathLength={pathLength}
          scrollYProgress={scrollYProgress}
          fishRanges={fishRanges}
        />
      </div>
    </section>
  );
}

function InterstitialInner({
  pathLength,
  scrollYProgress,
  fishRanges,
}: {
  pathLength: ReturnType<typeof useTransform<number, number>>;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  fishRanges: [number, number][];
}) {
  // Fish opacities — one MotionValue per fish. Hooks must be called at
  // top level of a component (not inside map), so this array is
  // computed in a dedicated child component where we know the length
  // is fixed.
  const o0 = useTransform(scrollYProgress, fishRanges[0], [0, 1]);
  const o1 = useTransform(scrollYProgress, fishRanges[1], [0, 1]);
  const o2 = useTransform(scrollYProgress, fishRanges[2], [0, 1]);
  const o3 = useTransform(scrollYProgress, fishRanges[3], [0, 1]);
  const o4 = useTransform(scrollYProgress, fishRanges[4], [0, 1]);
  const o5 = useTransform(scrollYProgress, fishRanges[5], [0, 1]);
  const fishOpacities = [o0, o1, o2, o3, o4, o5];
  return <SeaLineSvg pathProgress={pathLength} fishOpacities={fishOpacities} />;
}

/**
 * The actual SVG. Width 1000 × height 220 viewBox so the line stretches
 * across a wide screen without a hard horizontal edge. Cream background
 * is the parent section; the line + fish use navy `currentColor` so the
 * mark reads on either light or dark theme.
 */
function SeaLineSvg({
  pathProgress,
  fishOpacities,
}: {
  pathProgress:
    | number
    | ReturnType<typeof useTransform<number, number>>;
  fishOpacities: (
    | number
    | ReturnType<typeof useTransform<number, number>>
  )[];
}) {
  // Wavy horizontal path — a single cubic sine running from x=40 to
  // x=960 with amplitude ±24 around y=110. Hand-tuned control points
  // so the wave doesn't feel mechanically periodic.
  const linePath =
    "M 40 110 C 120 86, 200 134, 300 110 " +
    "S 460 88, 540 110 " +
    "S 700 134, 780 110 " +
    "S 920 88, 960 110";

  // Fish anchor points along the wave. Each fish is drawn as a tiny
  // leaf-shaped path pointing right; y values hug the wave crests and
  // troughs so the school feels to be swimming along the surface
  // rather than floating over a straight line.
  const fishPositions: { x: number; y: number; rotate: number; scale: number }[] = [
    { x: 150, y: 100, rotate: -8, scale: 1.1 },
    { x: 260, y: 125, rotate: 4, scale: 0.9 },
    { x: 400, y: 100, rotate: -6, scale: 1.0 },
    { x: 560, y: 122, rotate: 6, scale: 1.15 },
    { x: 700, y: 98, rotate: -4, scale: 0.95 },
    { x: 830, y: 120, rotate: 8, scale: 1.05 },
  ];

  return (
    <svg
      viewBox="0 0 1000 220"
      className="h-auto w-full max-w-[1200px] px-6"
      // No explicit `text-*` class — the SVG's `currentColor` strokes
      // and fills inherit from the `<html>` element, which flips from
      // navy (cream mode) to cream (navy mode) via BackgroundShift.
      // This means the sea-line + fish contrast correctly on both
      // backgrounds without any component-side colour handling.
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Two faint parallel hairlines above and below the main wave
          — suggest depth without stealing focus from the main line. */}
      <path
        d="M 40 78 C 140 70, 260 90, 360 78 S 600 66, 700 82 S 900 70, 960 80"
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.08}
        strokeWidth={0.8}
      />
      <path
        d="M 40 148 C 140 156, 260 138, 360 152 S 600 164, 700 146 S 900 160, 960 150"
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.08}
        strokeWidth={0.8}
      />

      {/* Main wave — pathLength animation gives the drawing-on feel. */}
      <motion.path
        d={linePath}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        style={{ pathLength: pathProgress }}
      />

      {/* School of fish — each leaf-shape rotates + scales at its
          anchor point, opacity driven by its own scroll band. */}
      {fishPositions.map((f, i) => (
        <motion.g
          key={i}
          transform={`translate(${f.x} ${f.y}) rotate(${f.rotate}) scale(${f.scale})`}
          style={{ opacity: fishOpacities[i] }}
        >
          {/* Fish body — pointed oval */}
          <path
            d="M -10 0 C -8 -4, 4 -4, 8 0 C 4 4, -8 4, -10 0 Z"
            fill="currentColor"
          />
          {/* Tail */}
          <path d="M -10 0 L -14 -3 L -14 3 Z" fill="currentColor" />
          {/* Small gold eye */}
          <circle cx="4" cy="-1" r="0.7" fill="var(--cs-gold)" />
        </motion.g>
      ))}
    </svg>
  );
}
