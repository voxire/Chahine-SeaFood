import { getTranslations } from "next-intl/server";
import { FadeIn } from "@/components/motion/FadeIn";
import { SectionHeading } from "@/components/motion/SectionHeading";
import { LinkButton } from "@/components/ui/Button";

export async function Hero() {
  const t = await getTranslations("hero");

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative min-h-[calc(100vh-72px)] overflow-hidden bg-cs-bg"
    >
      {/* Ambient background layer — will house the video loop + wave pattern.
          Placeholder gradient keeps the section visually complete until the
          IG hero reels and atmospheric assets land in /public. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(10,31,51,0.95)_80%)]"
      />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-72px)] max-w-container flex-col items-center justify-center px-6 py-20 text-center">
        <FadeIn>
          <SectionHeading
            plain={t("plain")}
            pill={t("pill")}
            align="center"
          />
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
