import { getTranslations } from "next-intl/server";

import { FadeIn } from "@/components/motion/FadeIn";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { SectionHeading } from "@/components/motion/SectionHeading";
import { SplitText } from "@/components/motion/SplitText";
import { LinkButton } from "@/components/ui/Button";
import { WavePattern } from "@/components/ornaments/WavePattern";

export async function Hero() {
  const t = await getTranslations("hero");

  return (
    <section className="relative min-h-[calc(100vh-72px)] overflow-hidden bg-cs-bg">
      {/* Ambient wave pattern — slow drift, tinted via currentColor. On light
          theme it renders as cobalt sketch lines against cream. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 text-cs-blue"
      >
        <div className="cs-wave-drift absolute inset-0 opacity-25">
          <WavePattern className="h-full w-full" />
        </div>
      </div>

      {/* Soft vignette for focus — cream at the edges on light, navy on dark. */}
      <div
        aria-hidden
        className="cs-hero-vignette pointer-events-none absolute inset-0"
      />

      {/* Hero content */}
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-72px)] max-w-container flex-col items-center justify-center px-6 py-20 text-center">
        <FadeIn>
          <SectionHeading plain={t("plain")} pill={t("pill")} align="center" />
        </FadeIn>

        {/* h1 now uses SplitText for a stagger reveal — auto-picks word-split
            for Arabic, char-split for Latin. */}
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
          <MagneticButton>
            <LinkButton href="/menu">{t("ctaMenu")}</LinkButton>
          </MagneticButton>
          <MagneticButton>
            <LinkButton href="/branches" variant="ghost">
              {t("ctaBranches")}
            </LinkButton>
          </MagneticButton>
        </FadeIn>
      </div>
    </section>
  );
}
