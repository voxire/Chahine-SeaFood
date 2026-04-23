"use client";

import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { SectionHeading } from "@/components/motion/SectionHeading";
import { GoldText } from "@/components/motion/GoldText";

export type ShowcaseDish = {
  id: string;
  name: string;
  tagline: string;
  imageSrc: string | null;
  href: string;
};

type Props = {
  plain: string;
  pill: string;
  description: string;
  counterLabel: string;
  cta: string;
  dishes: ShowcaseDish[];
};

/**
 * Signature Showcase scene — the horizontal-scroll pinned card rail.
 *
 * Scroll choreography (desktop, motion-enabled):
 *   0.00 – 0.08   entrance breathing room — heading + counter settle
 *                 as the stage enters the viewport
 *   0.08 – 0.92   horizontal translation of the card row: x scales
 *                 linearly from `5vw` (first card peeking from the right)
 *                 to `-(N-1) * (cardWidth + gap) + 5vw` (last card
 *                 resting against the left edge)
 *   0.92 – 1.00   exit breathing room — cards hold at final position
 *
 * Counter derivation: we floor scroll progress (after the entrance
 * runway) into `[1, N]` so the "0X / 05" indicator advances as each
 * card centres in the viewport. Because `useTransform` reads a function,
 * the counter updates on every scroll frame with no React re-renders.
 *
 * Reduced motion + mobile fallback: render a plain static heading and a
 * responsive 2-column grid of the same cards. The horizontal pin is a
 * desktop pleasure — on mobile it would fight vertical scroll direction
 * and on reduced-motion it would skip straight to the final card with
 * nothing in between.
 *
 * Why not use `<ScrollStage>` + `<Pinned>`? The stage primitive pins a
 * centred child inside a sticky 100vh frame, but the horizontal rail
 * wants to own the whole pinned viewport AND fill its full width with
 * overflow. A bespoke sticky wrapper keeps that contract clean and
 * avoids wrestling the stage's `max-w-container` + flex-centre layout.
 */
export function SignatureShowcaseScene({
  plain,
  pill,
  description,
  counterLabel,
  cta,
  dishes,
}: Props) {
  const shouldReduce = useReducedMotion();
  const isNarrow = useMediaQuery("(max-width: 768px)");

  // Hooks must run unconditionally. Attach the ref only on the motion
  // branch; the static branch leaves it unattached and `useScroll`
  // tolerates an unmounted target. `layoutEffect: false` silences the
  // framer-motion dev warning about measuring a ref before hydration —
  // we don't need the pre-paint measurement because the horizontal
  // rail isn't visible until scroll progress > 0 anyway.
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    layoutEffect: false,
    offset: ["start start", "end end"],
  });

  // Layout constants. Tuned so a card reads as a hero image at a typical
  // 1440-wide viewport while still leaving a peek of the next card at
  // the right edge — that "there's more coming" affordance is what makes
  // horizontal-scroll sections feel inevitable rather than surprising.
  const CARD_VW = 62;   // each card is 62% viewport width
  const GAP_VW = 2.5;   // gap between cards
  const START_PAD_VW = 6; // left padding before first card
  const totalTravel =
    (dishes.length - 1) * (CARD_VW + GAP_VW); // total vw the row must slide

  // Horizontal position of the card row. Entrance 0→0.08: first card
  // rides in from START_PAD_VW. Travel 0.08→0.92: translates by the
  // cumulative dish width. Exit 0.92→1: hold.
  const rowXVw = useTransform(
    scrollYProgress,
    [0, 0.08, 0.92, 1],
    [START_PAD_VW + 4, START_PAD_VW, START_PAD_VW - totalTravel, START_PAD_VW - totalTravel],
  );
  const rowX = useMotionTemplate`${rowXVw}vw`;

  // Active card index 1..N — floored progress mapped onto card count.
  // We bias the mapping so the counter ticks over as each card reaches
  // the viewport centre (approximately) rather than at the edges.
  const counterIndex = useTransform(scrollYProgress, (p) => {
    if (p <= 0.08) return 1;
    if (p >= 0.92) return dishes.length;
    const local = (p - 0.08) / 0.84;
    return Math.min(dishes.length, Math.floor(local * dishes.length) + 1);
  });

  // Header drift — let the left-aligned heading translate a few px up
  // as the user scrolls through the stage. Tiny movement, big
  // perceptual effect: the heading reads as moored to the top rather
  // than rigid.
  const headingY = useTransform(scrollYProgress, [0, 1], [0, -28]);

  // ────────────────────────────────────────────────────────────────
  // Fallback — reduced motion OR narrow viewport.
  // Still a strong section, just no horizontal pin.
  // ────────────────────────────────────────────────────────────────
  if (shouldReduce || isNarrow) {
    return (
      <section id="signatures" className="relative bg-cs-bg px-6 py-20 md:py-28">
        <div className="mx-auto max-w-container">
          <SectionHeading
            plain={plain}
            pill={pill}
            as="h2"
            align="left"
            subhead={description}
          />
          <div className="mt-12 grid grid-cols-1 gap-6 md:mt-16 md:grid-cols-2 md:gap-8">
            {dishes.map((dish, i) => (
              <ShowcaseCard
                key={dish.id}
                dish={dish}
                index={i}
                total={dishes.length}
                cta={cta}
                widthStyle={undefined}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ────────────────────────────────────────────────────────────────
  // Desktop + motion — pinned horizontal rail.
  // Outer section reserves N viewports of scroll runway so the inner
  // sticky frame has room to translate the full card row. `overflow-x:
  // hidden` on the sticky frame clips the overflowing row.
  // ────────────────────────────────────────────────────────────────
  const stageHeightVh = Math.max(240, dishes.length * 90); // ~450vh for 5 dishes
  const cardWidthStyle = { width: `${CARD_VW}vw`, maxWidth: "1080px" };
  const gapStyle = { gap: `${GAP_VW}vw` };

  return (
    <section
      ref={sectionRef}
      id="signatures"
      className="relative bg-cs-bg"
      style={{ height: `${stageHeightVh}vh` }}
    >
      <div
        className="sticky top-0 flex h-screen flex-col overflow-hidden"
        style={{ paddingTop: "var(--cs-nav-h, 72px)" }}
      >
        {/* Header bar — sits above the horizontal rail inside the pinned
            frame. Left-aligned heading on one side, counter + label on
            the other. Stays on-screen for the entire pinned run so the
            user keeps context while the cards sweep across. */}
        <div className="flex items-start justify-between gap-6 px-6 pt-8 md:px-12 md:pt-10">
          <motion.div
            className="flex-1"
            style={{ y: headingY }}
          >
            <SectionHeading
              plain={plain}
              pill={pill}
              as="h2"
              align="left"
              subhead={description}
              className="max-w-2xl"
            />
          </motion.div>

          {/* Counter — 01/05 style indicator, font-display for brand
              coherence with the pill and hero. Monospace-feeling via
              `tabular-nums` so the digits don't jitter as the counter
              advances. */}
          <div className="hidden shrink-0 pt-2 text-right md:block">
            <div className="font-display text-sm uppercase tracking-[0.28em] text-cs-text-muted">
              {counterLabel}
            </div>
            <div className="mt-2 flex items-baseline justify-end gap-2 font-display text-4xl font-black leading-none tabular-nums text-cs-blue-deep">
              <motion.span>{counterIndex}</motion.span>
              <span className="text-cs-text-muted/60">/</span>
              <span className="text-cs-text-muted/60">
                {String(dishes.length).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>

        {/* Horizontal card rail. `flex` + per-card explicit width gives
            us predictable offsets. The row itself is wider than the
            viewport — overflow is clipped by the `overflow-hidden` on
            the sticky ancestor. Vertical centring uses `items-center`
            so cards sit mid-viewport between header and bottom. */}
        <motion.div
          className="flex flex-1 items-center will-change-transform"
          style={{ x: rowX, ...gapStyle }}
        >
          {dishes.map((dish, i) => (
            <ShowcaseCard
              key={dish.id}
              dish={dish}
              index={i}
              total={dishes.length}
              cta={cta}
              widthStyle={cardWidthStyle}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────────────
// Card — shared between the motion rail and the static fallback.
// In rail mode, `widthStyle` pins each card's width in vw so the
// translation math lines up. In stack mode, the width is left to the
// parent grid.
// ──────────────────────────────────────────────────────────────────
function ShowcaseCard({
  dish,
  index,
  total,
  cta,
  widthStyle,
}: {
  dish: ShowcaseDish;
  index: number;
  total: number;
  cta: string;
  widthStyle?: React.CSSProperties;
}) {
  // `widthStyle` present → rail mode (desktop horizontal scroll). In
  // rail mode each card is pinned to CARD_VW (62vw) and we want a
  // wide 16:10 cinema aspect. In grid mode (undefined) the card fills
  // its grid cell width and picks a mobile-first portrait aspect so
  // there's room for the title stack + tagline, shifting to a
  // landscape aspect at desktop breakpoints where the grid is 2-col.
  const isRail = Boolean(widthStyle);
  return (
    <Link
      href={dish.href}
      className={
        "group relative block flex-shrink-0 overflow-hidden rounded-lg bg-cs-blue-deep ring-1 ring-cs-blue-deep/20 shadow-[0_30px_80px_-40px_rgba(10,39,70,0.45)] transition-shadow duration-500 hover:shadow-[0_40px_100px_-40px_rgba(10,39,70,0.6)]" +
        // Grid-mode aspect ratios: portrait on mobile (cards stack in
        // a 1-col grid with ≈342px width → 428px height — plenty of
        // vertical room for the title + tagline block); landscape
        // from the 2-col breakpoint up where wider cards suit the
        // dish photography.
        (isRail ? "" : " aspect-[4/5] md:aspect-[4/3]")
      }
      style={isRail ? { ...widthStyle, aspectRatio: "16 / 10" } : undefined}
    >
      {/* Hero dish image — fills the card. If no image is available,
          render a simple branded tone so the layout still reads as
          intentional. */}
      {dish.imageSrc ? (
        <div
          className="absolute inset-0 transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
          style={{ willChange: "transform" }}
        >
          <Image
            src={dish.imageSrc}
            alt={dish.name}
            fill
            // Sizes hint covers both render paths: narrow viewports
            // get the full-width grid card (≤100vw), the 2-col grid
            // breakpoint gives us ≈50vw cards, and the desktop rail
            // maxes out at 1080px × 62vw.
            sizes="(min-width: 1440px) 1080px, (min-width: 768px) 50vw, 100vw"
            priority={index < 2}
            className="object-cover"
          />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-cs-blue to-cs-blue-deep" />
      )}

      {/* Bottom scrim — deep navy fade that covers the lower ~55% of the
          card in solid dark tone so the title + tagline always read with
          firm contrast regardless of how warm or busy the underlying
          image is. We avoid `mix-blend-multiply` (previous version) —
          it's unreliable on already-warm pixels like grilled shrimp or
          golden batter, which is where we were seeing text wash out. A
          straight rgba gradient is predictable on every image. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(10,39,70,0.92) 0%, rgba(10,39,70,0.82) 22%, rgba(10,39,70,0.55) 45%, rgba(10,39,70,0.15) 68%, rgba(10,39,70,0) 82%)",
        }}
      />
      {/* Top scrim — small dark band behind the index tag. Keeps the
          gold counter legible even when the top of the image is bright
          (plate rim, lemons). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-cs-blue-deep/60 via-cs-blue-deep/20 to-transparent"
      />

      {/* Content — index tag at top-left, name + tagline at bottom.
          Title and tagline wear a soft `text-shadow` so stray light
          pixels in the image can't chew into the letterforms. The
          shadow is deep-navy and low-opacity — invisible on a dark
          scrim, but a safety net on the brightest frames.

          Sizes are mobile-first per CLAUDE.md §10.1:
          - Index counter: `text-sm` base (14px) → nudges up at `md:`.
            Small metadata; allowed under 16px because it's decorative,
            but we keep it at 14px minimum so it's still legible.
          - Name: `text-3xl` base (30px) fits "LOADED SEAFOOD MIX"
            inside a ~294px interior card at 390px viewport.
            `md:text-6xl lg:text-7xl` takes over once the card
            widens (rail cards are 62vw; grid cards ≈50vw at md).
          - Tagline: `text-base` base (16px) — meets the §10.3
            minimum for text on interactive surfaces.
          - CTA row: `text-sm` base (14px) uppercase-tracking reads
            as small-cap metadata. The entire card is the tap target,
            so this row isn't individually interactive. */}
      <div className="absolute inset-0 flex flex-col justify-between p-5 md:p-10">
        <div>
          <GoldText className="font-display text-sm uppercase tracking-[0.3em] drop-shadow-[0_1px_2px_rgba(10,39,70,0.6)] md:text-sm">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </GoldText>
        </div>

        <div>
          <h3
            className="font-display text-3xl font-black uppercase leading-[0.95] text-cs-bg md:text-6xl lg:text-7xl"
            style={{ textShadow: "0 2px 24px rgba(10,39,70,0.6)" }}
          >
            {dish.name}
          </h3>
          <p
            className="mt-3 max-w-xl text-base leading-relaxed text-cs-bg md:mt-4"
            style={{ textShadow: "0 1px 8px rgba(10,39,70,0.7)" }}
          >
            {dish.tagline}
          </p>
          <div className="mt-5 inline-flex items-center gap-2 font-display text-sm uppercase tracking-[0.28em] text-cs-gold-soft transition-transform duration-500 group-hover:translate-x-1 md:mt-6 rtl:group-hover:-translate-x-1">
            <span style={{ textShadow: "0 1px 6px rgba(10,39,70,0.8)" }}>
              {cta}
            </span>
            <span
              aria-hidden
              className="rtl:rotate-180"
              style={{ textShadow: "0 1px 6px rgba(10,39,70,0.8)" }}
            >
              →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ──────────────────────────────────────────────────────────────────
// useMediaQuery — tiny CSR-only hook. Defaults to `true` on SSR so
// the mobile-first grid is what ships in the initial HTML; the
// horizontal rail only appears on desktop after hydration confirms
// a wide viewport. This matches CLAUDE.md §0 — the browser never
// shows a desktop layout before the media query confirms desktop
// width. Mobile users get no flash; desktop users get a brief
// CSS-only layout shift as the rail takes over.
// ──────────────────────────────────────────────────────────────────
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(true);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query]);
  return matches;
}
