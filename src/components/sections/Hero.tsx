import { getTranslations } from "next-intl/server";

import { FadeIn } from "@/components/motion/FadeIn";
import { IngredientFly } from "@/components/motion/IngredientFly";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { SectionHeading } from "@/components/motion/SectionHeading";
import { SplitText } from "@/components/motion/SplitText";
import { StickerLink } from "@/components/ui/StickerButton";
import { WavePattern } from "@/components/ornaments/WavePattern";
import {
  Anchovy,
  LemonSlice,
  MintSprig,
  Shrimp,
} from "@/components/ornaments/ingredients";

/**
 * Home hero — cream-on-cobalt kinetic moment.
 *
 * Layering (back to front, matching the motion spec §6.1 scene 1):
 *   1. Ambient drifting wave pattern (cobalt, ~25% opacity).
 *   2. Cream vignette at the edges to focus the eye on the type stack.
 *   3. Soft gold spotlight behind the headline.
 *   4. Four garnish fly-ins anchored to the viewport corners —
 *      line-art anchovy, lemon slice, shrimp, mint sprig. Each
 *      enters off-screen and springs into place as the page mounts.
 *   5. Type stack: pill + plain → gradient-gold split headline → sub →
 *      dual CTAs wrapped in MagneticButton.
 *
 * Per CLAUDE.md §14 this stays a server component — all strings come
 * from `getTranslations` at render time so search crawlers and the
 * no-JS pass both receive the full copy.
 */
export async function Hero() {
  const t = await getTranslations("hero");

  return (
    <section className="relative isolate min-h-[calc(100vh-72px)] overflow-hidden bg-cs-bg">
      {/* 1. Ambient wave pattern — slow drift, tinted via currentColor.
          On light theme renders as cobalt sketch lines against cream. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 text-cs-blue"
      >
        <div className="cs-wave-drift absolute inset-0 opacity-25">
          <WavePattern className="h-full w-full" />
        </div>
      </div>

      {/* 2. Soft cream-to-cream vignette — focuses centre, softens edges. */}
      <div
        aria-hidden
        className="cs-hero-vignette pointer-events-none absolute inset-0"
      />

      {/* 3. Soft gold spotlight behind the headline. */}
      <div
        aria-hidden
        className="cs-spotlight pointer-events-none absolute left-1/2 top-1/2 h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2"
      />

      {/* 4. Corner garnish ornaments — line-art, `currentColor` = deep
          navy so they read confidently against cream. IngredientFly
          handles the entry animation + reduced-motion. LemonSlice
          overrides to gold; MintSprig keeps the cobalt for contrast. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 text-cs-blue-deep"
      >
        <IngredientFly
          from="left"
          pin="top-left"
          delay={0.1}
          className="hidden md:block"
        >
          <Anchovy className="h-14 w-44 -rotate-6 md:h-16 md:w-52" />
        </IngredientFly>

        <IngredientFly
          from="top"
          pin="top-right"
          delay={0.2}
          offset={{ rotate: -18 }}
          className="text-cs-gold"
        >
          {/* Mobile-first sizing (per CLAUDE.md §10.1). On 390px viewports
              the lemon sits at `right: 4vw` (~15px) with a 72px footprint
              so it reads as a corner accent, not a dominant mascot. */}
          <LemonSlice className="h-[72px] w-[72px] sm:h-20 sm:w-20 md:h-28 md:w-28" />
        </IngredientFly>

        <IngredientFly
          from="right"
          pin="bottom-right"
          delay={0.15}
          offset={{ rotate: 14 }}
        >
          {/* Mobile-first sizing. Shrimp at the original h-32 w-32 (128px)
              dominated a 390-wide hero — it read as a cartoon mascot
              rather than garnish. Scaling from 80px base up to 160px at
              md: keeps it present-but-subordinate on phones and gives it
              authority on desktop. */}
          <Shrimp className="h-20 w-20 sm:h-28 sm:w-28 md:h-40 md:w-40" />
        </IngredientFly>

        <IngredientFly
          from="bottom"
          pin="bottom-left"
          delay={0.25}
          className="hidden text-cs-blue sm:block"
        >
          <MintSprig className="h-28 w-20 md:h-36 md:w-24" />
        </IngredientFly>
      </div>

      {/* 5. Type stack — centred content layer. */}
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-72px)] max-w-container flex-col items-center justify-center px-6 py-20 text-center">
        {/* SectionHeading does its own scroll-triggered reveal per
            #61; the outer FadeIn was double-triggering the same
            moment and muddying the stagger. */}
        <SectionHeading plain={t("plain")} pill={t("pill")} align="center" />

        {/* h1 uses SplitText for a stagger reveal — word-split on Arabic,
            char-split on Latin. */}
        <SplitText
          as="h1"
          delay={0.25}
          stagger={0.035}
          y={28}
          className="mt-8 font-display text-3xl font-black uppercase leading-tight text-cs-blue-deep md:text-5xl lg:text-6xl"
        >
          {t("tagline")}
        </SplitText>

        <FadeIn delay={0.55}>
          <p className="mx-auto mt-6 max-w-xl text-base text-cs-text-muted md:text-lg">
            {t("subline")}
          </p>
        </FadeIn>

        <FadeIn
          delay={0.75}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          {/* Hero CTAs ship with strength=22 — almost double the
              MagneticButton primitive default of 12. Rationale: the
              hero is the site's only cream-on-cobalt kinetic moment,
              and its CTAs are visually big (px-7 + py-3.5 + display
              font). A conservative 12px pull on elements that large
              barely reads; 22px makes the cursor "magnetize" clearly
              without feeling grabby. Keep the primitive default at 12
              for secondary CTAs elsewhere on the site. */}
          <MagneticButton strength={22}>
            <StickerLink href="/menu" variant="gold">
              {t("ctaMenu")}
            </StickerLink>
          </MagneticButton>
          <MagneticButton strength={22}>
            <StickerLink href="/branches" variant="ghost">
              {t("ctaBranches")}
            </StickerLink>
          </MagneticButton>
        </FadeIn>
      </div>
    </section>
  );
}
