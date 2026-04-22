import { getTranslations } from "next-intl/server";
import Image from "next/image";

import { FadeIn } from "@/components/motion/FadeIn";
import { SectionHeading } from "@/components/motion/SectionHeading";
import { LinkButton } from "@/components/ui/Button";
import { WavePattern } from "@/components/ornaments/WavePattern";

export async function Hero() {
  const t = await getTranslations("hero");

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative min-h-[calc(100vh-72px)] overflow-hidden bg-cs-bg"
    >
      {/* Ambient wave pattern — slow drift, tinted via currentColor, disabled when
          the user prefers reduced motion (class handled in globals.css). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 text-cs-brand-navy"
      >
        <div className="cs-wave-drift absolute inset-0">
          <WavePattern className="h-full w-full opacity-40" />
        </div>
      </div>

      {/* Gold-dust sparkle — low opacity, sits under the vignette. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-screen opacity-40"
      >
        <Image
          src="/textures/gold-dust.png"
          alt=""
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
      </div>

      {/* Vignette for contrast — pure CSS, no external PNG required. */}
      <div aria-hidden className="cs-hero-vignette pointer-events-none absolute inset-0" />

      {/* Hero content */}
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-72px)] max-w-container flex-col items-center justify-center px-6 py-20 text-center">
        <FadeIn>
          <SectionHeading plain={t("plain")} pill={t("pill")} align="center" />
        </FadeIn>

        <FadeIn delay={0.2}>
          <h1
            id="hero-heading"
            className="mt-8 font-display text-3xl font-black uppercase leading-tight text-cs-text md:text-5xl lg:text-6xl"
          >
            {t("tagline")}
          </h1>
        </FadeIn>

        <FadeIn delay={0.32}>
          <p className="mx-auto mt-6 max-w-xl text-base text-cs-text-muted md:text-lg">
            {t("subline")}
          </p>
        </FadeIn>

        <FadeIn
          delay={0.45}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <LinkButton href="/menu">{t("ctaMenu")}</LinkButton>
          <LinkButton href="/branches" variant="ghost">
            {t("ctaBranches")}
          </LinkButton>
        </FadeIn>
      </div>
    </section>
  );
}
