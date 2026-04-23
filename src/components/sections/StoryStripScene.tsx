"use client";

import clsx from "clsx";
import { motion, useTransform } from "framer-motion";

import { useStageProgress } from "@/components/motion/useStageProgress";
import { SectionHeading } from "@/components/motion/SectionHeading";
import { StickerLink } from "@/components/ui/StickerButton";
import {
  DishPlaceholder,
  type DishVariant,
} from "@/components/ornaments/DishPlaceholder";

export type StoryStripSceneProps = {
  /** Heading — non-pill word. */
  plain: string;
  /** Heading — pill word. */
  pill: string;
  /** Body copy. */
  body: string;
  /** Ghost CTA label. */
  cta: string;
  /** Localized chapter labels, rendered as captions on the photo strip. */
  chapters: {
    est: string;
    daily: string;
    reach: string;
  };
};

/**
 * Story strip — the pinned split storytelling beat.
 *
 * Inside the parent `<ScrollStage>` this component renders a full-viewport
 * split: the text column stays pinned in place while a three-photo strip
 * on the right translates upward as the runway scrolls, cycling through
 * three brand chapters (Est. 1978 → the daily catch → ten branches).
 *
 * Choreography (progress 0 → 1):
 *   0.00 – 0.18  heading + pill fade-up
 *   0.08 – 0.32  body copy fades in
 *   0.22 – 0.45  CTA fades in
 *   0.05 – 0.95  photo strip translates 0% → -66% (reveals all 3 tiles)
 *
 * Mobile: the grid collapses to a single column; the text comes first
 * and the photo strip renders underneath at a shorter height. The same
 * useTransform mapping still drives the strip — narrower, but the
 * cinema-strip effect reads clearly on small viewports too.
 *
 * Under reduced motion, ScrollStage pins progress at 1, which lands
 * every piece in its final state and neutralises the strip scroll.
 */
export function StoryStripScene({
  plain,
  pill,
  body,
  cta,
  chapters,
}: StoryStripSceneProps) {
  const progress = useStageProgress();

  // Text column — staggered entrance over the first half of the runway.
  const headingOpacity = useTransform(progress, [0, 0.18], [0, 1]);
  const headingY = useTransform(progress, [0, 0.18], [28, 0]);
  const bodyOpacity = useTransform(progress, [0.08, 0.32], [0, 1]);
  const bodyY = useTransform(progress, [0.08, 0.32], [18, 0]);
  const ctaOpacity = useTransform(progress, [0.22, 0.45], [0, 1]);
  const ctaY = useTransform(progress, [0.22, 0.45], [14, 0]);

  // Photo strip — translate inside its masked viewport. -66% lands the
  // third of three stacked tiles at the top of the viewport.
  const stripY = useTransform(progress, [0.05, 0.95], ["0%", "-66%"]);

  // Three chapters, three visual anchors. Each tile uses a branded
  // DishPlaceholder with a caption overlaid — swap to real chapter
  // photography by replacing `<DishPlaceholder>` with `<Image>`.
  //   est 1978 → a whole fish (heritage beat: "the catch")
  //   daily    → a sandwich (the signature format built on that catch)
  //   reach    → a family platter (ten branches, one table)
  const tiles: { caption: string; variant: DishVariant }[] = [
    { caption: chapters.est, variant: "fish" },
    { caption: chapters.daily, variant: "sandwich" },
    { caption: chapters.reach, variant: "family" },
  ];

  return (
    <div className="mx-auto w-full max-w-container px-6">
      <div className="grid items-center gap-10 md:grid-cols-[minmax(0,_1fr)_minmax(0,_1fr)] md:gap-16 lg:gap-24">
        {/* Left — pinned text column. */}
        <div className="flex flex-col">
          <motion.div style={{ opacity: headingOpacity, y: headingY }}>
            <SectionHeading plain={plain} pill={pill} as="h2" align="left" />
          </motion.div>
          <motion.p
            style={{ opacity: bodyOpacity, y: bodyY }}
            className="mt-8 max-w-prose text-base leading-relaxed text-cs-text-muted md:text-lg"
          >
            {body}
          </motion.p>
          <motion.div
            style={{ opacity: ctaOpacity, y: ctaY }}
            className="mt-10"
          >
            <StickerLink href="/about" variant="ghost">
              {cta}
            </StickerLink>
          </motion.div>
        </div>

        {/* Right — masked photo strip that scrolls through three chapters.
            Mobile-first height tuned for the pinned split to actually
            fit inside `calc(100vh - 72px)` on small phones (iPhone SE
            at 667 high is the tight case). Text column ≈ 300px + gap
            ≈ 40px + strip must sit under ≈ 255px on a 595px pinned
            frame, so base `h-[34vh] max-h-[320px]` keeps the strip
            proportional to the viewport without overflowing. md: goes
            back to the authored desktop height. */}
        <div
          aria-hidden
          className="relative h-[34vh] max-h-[320px] overflow-hidden rounded-lg ring-1 ring-cs-text/10 bg-cs-surface md:h-[560px] md:max-h-none"
        >
          <motion.div
            style={{ y: stripY }}
            className="flex flex-col gap-5 p-5"
          >
            {tiles.map((t, i) => (
              <div
                key={i}
                className={clsx(
                  "relative aspect-[4/5] w-full overflow-hidden rounded-md ring-1 ring-cs-text/5",
                )}
              >
                <DishPlaceholder
                  variant={t.variant}
                  label={t.caption}
                  aspect=""
                  className="h-full rounded-md"
                />
                {/* Caption overlay — solid navy bar along the bottom so
                    the chapter label clears WCAG AA against any dish art
                    behind it. Cream text on deep navy = ~16:1 contrast. */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center gap-2 bg-cs-blue-deep px-5 py-3">
                  <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-cs-gold" />
                  <span className="font-display text-sm uppercase tracking-[0.18em] text-cs-bg md:text-base">
                    {t.caption}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
