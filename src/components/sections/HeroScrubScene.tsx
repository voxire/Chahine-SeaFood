"use client";

import Image from "next/image";
import { motion, useReducedMotion, useTransform } from "framer-motion";

import { Pill } from "@/components/motion/Pill";
import { Pinned } from "@/components/motion/Pinned";
import { ScrollStage } from "@/components/motion/ScrollStage";
import { useStageProgress } from "@/components/motion/useStageProgress";
import { StickerLink } from "@/components/ui/StickerButton";

export type HeroScrubSceneProps = {
  /** Big back-layer "ghost" word (uppercase). */
  plain: string;
  /** Punchy gold pill word. */
  pill: string;
  /** One-line tagline that sits below the kicker before the dish dominates. */
  tagline: string;
  /** Body subline; fades out as the dish scales up. */
  subline: string;
  /** "Browse menu" CTA label. */
  ctaMenu: string;
  /** "Find a branch" CTA label. */
  ctaBranches: string;
  /**
   * Hero dish photo. PNG cutout with transparent background reads best —
   * the stage gradient shows through the negative space.
   */
  imageSrc: string;
  /** alt text for the hero dish (descriptive, SEO-aware). */
  imageAlt: string;
};

/**
 * Hero scroll-scrub scene — Moment 1 of the new home sequence.
 *
 * Motion technique
 * ────────────────
 * A pinned runway (~280vh tall) holds the kicker headline + tagline +
 * a hero dish image + CTAs. As the user scrolls through the runway,
 * Framer Motion's `useTransform` maps the 0→1 stage progress into:
 *   - the dish scaling from ~0.5 → ~1.45 and translating up
 *   - the back-layer kicker fading slightly as the dish takes the eye
 *   - the subline + CTAs fading + sliding down out of frame
 * Result: the dish "rises out of the deep" and dominates the viewport
 * by the time the runway ends.
 *
 * Mobile-first
 * ────────────
 * Stage height is responsive (200vh on mobile, 280vh on md+ via CSS
 * media query). The same scrub still runs on phones — just at smaller
 * scale + a shorter runway so it doesn't trap mobile readers in a
 * 3-screen-tall pin. Reduced-motion users get the final state with no
 * scroll-driven transforms (Framer's `useReducedMotion`).
 *
 * SEO / a11y
 * ──────────
 * All text renders in HTML at mount; only opacity/transform animate.
 * Crawlers and screen readers receive the full kicker + tagline +
 * subline + CTAs regardless of scroll position.
 */
export function HeroScrubScene({
  plain,
  pill,
  tagline,
  subline,
  ctaMenu,
  ctaBranches,
  imageSrc,
  imageAlt,
}: HeroScrubSceneProps) {
  const shouldReduce = useReducedMotion();

  return (
    <ScrollStage
      // Tailwind doesn't compile dynamic CSS variables, so use an inline
      // var that the wrapper sets per breakpoint.
      className="cs-hero-stage"
      // Default height gets overridden by globals.css media query — the
      // prop here is the desktop value; mobile gets a shorter runway.
      height="280vh"
    >
      <Pinned align="center" className="bg-cs-bg">
        <HeroScrubBody
          plain={plain}
          pill={pill}
          tagline={tagline}
          subline={subline}
          ctaMenu={ctaMenu}
          ctaBranches={ctaBranches}
          imageSrc={imageSrc}
          imageAlt={imageAlt}
          reduce={shouldReduce ?? false}
        />
      </Pinned>
    </ScrollStage>
  );
}

/**
 * Inner body — split out so we can read `useStageProgress()` only inside
 * the StageProgressContext (which lives inside `<ScrollStage>`).
 */
function HeroScrubBody({
  plain,
  pill,
  tagline,
  subline,
  ctaMenu,
  ctaBranches,
  imageSrc,
  imageAlt,
  reduce,
}: HeroScrubSceneProps & { reduce: boolean }) {
  const progress = useStageProgress();

  // Dish: small + low at the start, big + slightly raised at the end.
  // Tuning notes:
  //   - Start scale 0.55 keeps the dish visible as a "preview" but
  //     leaves the kicker headline as the focal point in the first
  //     viewport.
  //   - End scale 1.45 makes the dish bleed past the gutters and feel
  //     dominant — but stops short of a full-bleed (1.6+) which felt
  //     suffocating on a 27" monitor.
  //   - Y travel from +18vh to -6vh: the dish "rises" rather than
  //     "shrinks down". Slight negative end Y centres it nicely.
  const dishScale = useTransform(progress, [0, 1], [0.55, 1.45]);
  const dishY = useTransform(progress, [0, 1], ["18vh", "-6vh"]);

  // Kicker layer: sits behind. Holds at low opacity throughout, fades
  // slightly more as the dish takes over the centre.
  const kickerOpacity = useTransform(progress, [0, 0.6, 1], [0.22, 0.18, 0.1]);
  const kickerScale = useTransform(progress, [0, 1], [1, 1.06]);

  // Subline + CTAs fade out as scroll advances — they belong to the
  // first beat, not the climax.
  const subOpacity = useTransform(progress, [0, 0.35, 0.6], [1, 0.5, 0]);
  const subY = useTransform(progress, [0, 0.6], ["0px", "-24px"]);

  // Reduced-motion shortcut: render the static "final state" feel —
  // dish at scale 1, full opacity throughout. Match Hero.tsx defaults.
  const dishStyle = reduce
    ? undefined
    : { scale: dishScale, y: dishY };
  const kickerStyle = reduce
    ? { opacity: 0.2 }
    : { opacity: kickerOpacity, scale: kickerScale };
  const subStyle = reduce ? undefined : { opacity: subOpacity, y: subY };

  return (
    <div className="relative isolate flex h-full w-full items-center justify-center overflow-hidden">
      {/* Soft gold spotlight behind the kicker — keeps the back layer
          legible on cream without being noisy. */}
      <div
        aria-hidden
        className="cs-spotlight pointer-events-none absolute left-1/2 top-1/2 h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2"
      />

      {/* Layer 1 — kicker headline behind. Stays in the centre, scales
          subtly as dish grows so the parallax feels orchestrated. */}
      <motion.div
        aria-hidden
        style={kickerStyle}
        className="absolute inset-x-0 top-1/2 z-0 -translate-y-1/2 px-6 text-center will-change-transform"
      >
        <div className="m-0 inline-flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          <span className="font-display text-5xl font-black uppercase leading-none text-cs-text md:text-7xl lg:text-[8rem]">
            {plain}
          </span>
          <Pill size="lg">{pill}</Pill>
        </div>
      </motion.div>

      {/* Real semantic h1 (off-screen for SEO/SR — sighted users see the
          decorative kicker layer above + tagline below). */}
      <h1 className="sr-only">
        {plain} {pill} — {tagline}
      </h1>

      {/* Layer 2 — hero dish photo. Centred, scaled by scroll progress.
          PNG cutouts work best (transparent background lets the stage
          gradient show through the silhouette). */}
      <motion.div
        style={dishStyle}
        className="relative z-10 h-[60vh] w-[min(86vw,720px)] will-change-transform md:h-[70vh] md:w-[min(70vw,860px)]"
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          sizes="(min-width: 1024px) 860px, (min-width: 640px) 70vw, 86vw"
          className="object-contain"
        />
      </motion.div>

      {/* Layer 3 — tagline + subline + CTAs. Sits at the bottom of the
          stage, fades out as the dish takes the eye. */}
      <motion.div
        style={subStyle}
        className="absolute inset-x-0 bottom-[6vh] z-20 mx-auto flex max-w-container flex-col items-center gap-5 px-6 text-center md:bottom-[8vh]"
      >
        <p className="font-display text-2xl font-black uppercase leading-tight text-cs-blue-deep md:text-4xl lg:text-5xl">
          {tagline}
        </p>
        <p className="max-w-xl text-sm text-cs-text-muted md:text-base">
          {subline}
        </p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3 md:gap-4">
          <StickerLink href="/menu" variant="gold">
            {ctaMenu}
          </StickerLink>
          <StickerLink href="/branches" variant="ghost">
            {ctaBranches}
          </StickerLink>
        </div>
      </motion.div>
    </div>
  );
}
