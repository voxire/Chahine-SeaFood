import { getTranslations } from "next-intl/server";
import { FadeIn } from "@/components/motion/FadeIn";
import { Parallax } from "@/components/motion/Parallax";
import { SectionHeading } from "@/components/motion/SectionHeading";
import { LinkButton } from "@/components/ui/Button";

export async function StoryStrip() {
  const t = await getTranslations("story");

  return (
    <section
      aria-labelledby="story-heading"
      className="py-section-y"
    >
      <div className="mx-auto max-w-container px-6">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <FadeIn>
            <SectionHeading
              plain={t("plain")}
              pill={t("pill")}
              align="left"
              as="h2"
            />
            <p className="mt-8 text-base leading-relaxed text-cs-text-muted md:text-lg">
              {t("body")}
            </p>
            <div className="mt-8">
              <LinkButton href="/about" variant="ghost">
                {t("cta")}
              </LinkButton>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <Parallax offset={32}>
              {/* Placeholder for the environmental photo from IG — see
                  docs/02-asset-prompts.md §A4. */}
              <div className="aspect-[4/5] w-full rounded-lg bg-cs-surface ring-1 ring-cs-text/10" />
            </Parallax>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
