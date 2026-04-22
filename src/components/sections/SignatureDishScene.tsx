"use client";

import Image from "next/image";
import { motion, useTransform } from "framer-motion";

import { useStageProgress } from "@/components/motion/useStageProgress";
import { GoldText } from "@/components/motion/GoldText";
import { SectionHeading } from "@/components/motion/SectionHeading";
import { StickerLink } from "@/components/ui/StickerButton";
import { DishPlaceholder } from "@/components/ornaments/DishPlaceholder";

export type SignatureDishSceneProps = {
  /** Section heading — non-pill word. */
  plain: string;
  /** Section heading — pill word (rendered as cobalt-bg pill). */
  pill: string;
  /** Body copy under the heading. */
  description: string;
  /** CTA label. */
  cta: string;
  /** Placeholder label overlaid on the dish image until the PNG lands. */
  imagePlaceholder: string;
  /**
   * Optional dish photo URL. When supplied, renders a real `<Image>`
   * inside the scroll-linked reveal; when omitted, falls back to the
   * branded silhouette placeholder.
   */
  imageSrc?: string;
  /** Localized callout labels. */
  callouts: {
    bread: string;
    fish: string;
    sauce: string;
  };
};

/**
 * The scroll-linked reveal inside `<ScrollStage>`. Consumes the stage
 * progress MotionValue and drives every child's opacity / transform off
 * it — no `whileInView` triggers inside this component, so the same
 * scroll gesture orchestrates the entire reveal.
 *
 * Scroll choreography (progress 0 → 1):
 *   0.00 – 0.18  heading fades in + descends into place
 *   0.08 – 0.32  body copy fades in
 *   0.15 – 0.55  dish image eases from scale 1.12 → 1, opacity 0 → 1
 *   0.50 – 0.66  callout "bread" springs in from the left
 *   0.62 – 0.78  callout "fish" slides in from the right
 *   0.74 – 0.90  callout "sauce" rises from below
 *   0.88 – 1.00  CTA fades in at the end of the runway
 *
 * Under reduced motion, ScrollStage pins progress to 1 so every piece
 * renders in its final state instantly — nothing to special-case here.
 */
export function SignatureDishScene({
  plain,
  pill,
  description,
  cta,
  imagePlaceholder,
  imageSrc,
  callouts,
}: SignatureDishSceneProps) {
  const progress = useStageProgress();

  const headingOpacity = useTransform(progress, [0, 0.18], [0, 1]);
  const headingY = useTransform(progress, [0, 0.18], [28, 0]);

  const bodyOpacity = useTransform(progress, [0.08, 0.32], [0, 1]);
  const bodyY = useTransform(progress, [0.08, 0.32], [18, 0]);

  const imageOpacity = useTransform(progress, [0.15, 0.55], [0, 1]);
  const imageScale = useTransform(progress, [0.15, 0.55], [1.12, 1]);

  const calloutBreadOpacity = useTransform(progress, [0.5, 0.66], [0, 1]);
  const calloutBreadX = useTransform(progress, [0.5, 0.66], [-48, 0]);

  const calloutFishOpacity = useTransform(progress, [0.62, 0.78], [0, 1]);
  const calloutFishX = useTransform(progress, [0.62, 0.78], [48, 0]);

  const calloutSauceOpacity = useTransform(progress, [0.74, 0.9], [0, 1]);
  const calloutSauceY = useTransform(progress, [0.74, 0.9], [24, 0]);

  const ctaOpacity = useTransform(progress, [0.88, 1], [0, 1]);
  const ctaY = useTransform(progress, [0.88, 1], [16, 0]);

  return (
    <div className="relative mx-auto flex w-full max-w-container flex-col items-center px-6 pt-28 pb-14 md:pt-24 md:pb-12">
      {/* Heading stack */}
      <motion.div
        style={{ opacity: headingOpacity, y: headingY }}
        className="w-full"
      >
        <SectionHeading plain={plain} pill={pill} as="h2" align="center" />
      </motion.div>

      {/* Body copy */}
      <motion.p
        style={{ opacity: bodyOpacity, y: bodyY }}
        className="mx-auto mt-5 max-w-xl text-center text-base text-cs-text-muted md:text-lg"
      >
        {description}
      </motion.p>

      {/* Dish image + callouts stage */}
      <div className="relative mx-auto mt-10 h-[320px] w-full max-w-3xl md:mt-14 md:h-[440px]">
        {/* Dish photo slot — renders the AI-generated editorial shot when
            an `imageSrc` is supplied, otherwise falls back to the branded
            silhouette placeholder so the frame always reads as
            intentional rather than missing. */}
        <motion.div
          style={{ opacity: imageOpacity, scale: imageScale }}
          className="absolute inset-0"
        >
          {imageSrc ? (
            <div className="relative h-full w-full overflow-hidden rounded-lg bg-cs-surface-2 ring-1 ring-cs-blue-deep/10">
              <Image
                src={imageSrc}
                alt={imagePlaceholder}
                fill
                sizes="(min-width: 768px) 48rem, 100vw"
                priority
                className="object-cover"
              />
            </div>
          ) : (
            <DishPlaceholder
              variant="sandwich"
              label={imagePlaceholder}
              aspect=""
              className="h-full"
            />
          )}
        </motion.div>

        {/* Callout — bread (top-left) */}
        <motion.div
          style={{ opacity: calloutBreadOpacity, x: calloutBreadX }}
          className="absolute -left-2 top-6 max-w-[180px] rounded-lg bg-cs-surface/90 px-4 py-3 text-left text-sm font-medium text-cs-blue-deep shadow-md ring-1 ring-cs-text/5 backdrop-blur md:-left-6 md:top-10 md:max-w-[220px] md:text-base"
        >
          <GoldText className="block font-display text-xs uppercase tracking-[0.2em]">
            01
          </GoldText>
          <span className="mt-1 block">{callouts.bread}</span>
        </motion.div>

        {/* Callout — fish (right) */}
        <motion.div
          style={{ opacity: calloutFishOpacity, x: calloutFishX }}
          className="absolute -right-2 top-1/2 -translate-y-1/2 max-w-[180px] rounded-lg bg-cs-surface/90 px-4 py-3 text-left text-sm font-medium text-cs-blue-deep shadow-md ring-1 ring-cs-text/5 backdrop-blur md:-right-6 md:max-w-[220px] md:text-base"
        >
          <GoldText className="block font-display text-xs uppercase tracking-[0.2em]">
            02
          </GoldText>
          <span className="mt-1 block">{callouts.fish}</span>
        </motion.div>

        {/* Callout — sauce (bottom-left) */}
        <motion.div
          style={{ opacity: calloutSauceOpacity, y: calloutSauceY }}
          className="absolute bottom-4 left-2 max-w-[180px] rounded-lg bg-cs-surface/90 px-4 py-3 text-left text-sm font-medium text-cs-blue-deep shadow-md ring-1 ring-cs-text/5 backdrop-blur md:bottom-6 md:left-8 md:max-w-[220px] md:text-base"
        >
          <GoldText className="block font-display text-xs uppercase tracking-[0.2em]">
            03
          </GoldText>
          <span className="mt-1 block">{callouts.sauce}</span>
        </motion.div>
      </div>

      {/* CTA */}
      <motion.div style={{ opacity: ctaOpacity, y: ctaY }} className="mt-10">
        <StickerLink href="/menu/sandwiches" variant="primary">
          {cta}
        </StickerLink>
      </motion.div>
    </div>
  );
}
