"use client";

import Image from "next/image";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";

import { SectionHeading } from "@/components/motion/SectionHeading";
import { GoldText } from "@/components/motion/GoldText";
import { RevealMask } from "@/components/motion/RevealMask";
import { FadeIn } from "@/components/motion/FadeIn";

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
  /**
   * Retained for back-compat with the server wrapper. Previously drove
   * the 01/05 counter in the pinned horizontal rail — the rail is gone
   * and the counter no longer renders, but we keep the prop so the
   * server component doesn't need to change. Unused at runtime.
   */
  counterLabel: string;
  cta: string;
  dishes: ShowcaseDish[];
};

/**
 * Signature Showcase scene — static grid of five signature dishes.
 *
 * This replaced an earlier pinned horizontal-scroll rail that used
 * `useScroll` + `useTransform` to slide the card row as the viewport
 * pinned. The rail worked at 1440px but broke in several real
 * configurations:
 *   - Viewports > 1740px hit the `maxWidth: 1080px` cap on cards, which
 *     desynced vw-based translation math from actual card widths.
 *   - Measurement-based fixes still missed edges (late image loads,
 *     certain flex behaviours returning unexpected scrollWidth).
 *   - Pin release timing vs translation progress ranges were a
 *     constant tuning headache.
 *
 * The grid layout is boring in comparison but bulletproof. Every card
 * renders via `RevealMask` so there's still cinematic reveal motion as
 * each one enters the viewport — just driven by its own intersection,
 * not a shared pinned scroll. Readers get all five dishes without
 * fighting a pin that might trap them or skip ahead.
 *
 * Responsive layout:
 *   base       1-column portrait cards (phones)
 *   sm (640)   2-column landscape cards (tablets)
 *   lg (1024)  3-column landscape cards (desktop) — row 1 has 3,
 *              row 2 has 2 with natural left-alignment. The
 *              asymmetric last row reads as intentional curation.
 */
export function SignatureShowcaseScene({
  plain,
  pill,
  description,
  cta,
  dishes,
}: Props) {
  const shouldReduce = useReducedMotion();

  return (
    <section
      id="signatures"
      className="relative bg-cs-bg py-section-y"
    >
      <div className="mx-auto max-w-container px-6">
        <SectionHeading
          plain={plain}
          pill={pill}
          as="h2"
          align="center"
          subhead={description}
        />

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 md:mt-20 md:gap-8 lg:grid-cols-3">
          {dishes.map((dish, i) => (
            <FadeIn key={dish.id} delay={shouldReduce ? 0 : 0.06 * i}>
              <ShowcaseCard
                dish={dish}
                index={i}
                total={dishes.length}
                cta={cta}
              />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────────────
// Card — cream-surface frame with dish photo on top, text block
// below. Swapped to a "full-bleed photo + dark scrim + title overlay"
// style so each card reads as cinematic on its own, not dependent on
// the old rail mode's dominating scale.
// ──────────────────────────────────────────────────────────────────
function ShowcaseCard({
  dish,
  index,
  total,
  cta,
}: {
  dish: ShowcaseDish;
  index: number;
  total: number;
  cta: string;
}) {
  return (
    <Link
      href={dish.href}
      className="group relative block overflow-hidden rounded-lg bg-cs-blue-deep ring-1 ring-cs-blue-deep/20 shadow-[0_30px_80px_-40px_rgba(10,39,70,0.45)] transition-shadow duration-500 hover:shadow-[0_40px_100px_-40px_rgba(10,39,70,0.6)] aspect-[4/5] sm:aspect-[4/3] lg:aspect-[4/5]"
    >
      {/* Hero dish image — fills the card, wrapped in a RevealMask so
          each card gets its own clip-path wipe on viewport entry. */}
      {dish.imageSrc ? (
        <RevealMask direction="bottom" className="absolute inset-0">
          <div
            className="absolute inset-0 transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
            style={{ willChange: "transform" }}
          >
            <Image
              src={dish.imageSrc}
              alt={dish.name}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              priority={index < 2}
              className="object-cover"
            />
          </div>
        </RevealMask>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-cs-blue to-cs-blue-deep" />
      )}

      {/* Bottom scrim — predictable deep navy gradient that keeps title
          + tagline readable no matter how warm or busy the underlying
          dish photo is. Same tuning as before, no blend-mode tricks. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(10,39,70,0.92) 0%, rgba(10,39,70,0.82) 22%, rgba(10,39,70,0.55) 45%, rgba(10,39,70,0.15) 68%, rgba(10,39,70,0) 82%)",
        }}
      />

      {/* Top scrim — small dark band behind the index tag. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-cs-blue-deep/60 via-cs-blue-deep/20 to-transparent"
      />

      {/* Content — index tag at top-left, name + tagline at bottom.
          Text sizes scale across breakpoints: punchy on mobile,
          bigger on tablet/desktop where the card has more room. */}
      <div className="absolute inset-0 flex flex-col justify-between p-5 md:p-6 lg:p-7">
        <div>
          <GoldText className="font-display text-sm uppercase tracking-[0.3em] drop-shadow-[0_1px_2px_rgba(10,39,70,0.6)]">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </GoldText>
        </div>

        <div>
          <h3
            className="font-display text-3xl font-black uppercase leading-[0.95] text-cs-bg md:text-4xl lg:text-3xl xl:text-4xl"
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
