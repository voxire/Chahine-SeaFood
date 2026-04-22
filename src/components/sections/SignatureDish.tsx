import { getTranslations } from "next-intl/server";
import { FadeIn } from "@/components/motion/FadeIn";
import { Parallax } from "@/components/motion/Parallax";
import { SectionHeading } from "@/components/motion/SectionHeading";
import { LinkButton } from "@/components/ui/Button";

export async function SignatureDish() {
  const t = await getTranslations("signatureDish");

  return (
    <section
      aria-labelledby="signature-heading"
      className="relative overflow-hidden py-section-y"
    >
      <div className="mx-auto max-w-container px-6">
        <FadeIn>
          <SectionHeading
            plain={t("plain")}
            pill={t("pill")}
            as="h2"
            className="[&_h2]:text-inherit"
          />
        </FadeIn>

        {/* Hero product placeholder — will be replaced by the cutout PNG from
            the IG pipeline output (public/signatures/fish-sandwich.png). */}
        <div className="relative mx-auto mt-16 h-[420px] max-w-3xl md:h-[560px]">
          <Parallax offset={48} className="absolute inset-0">
            <div className="flex h-full items-center justify-center rounded cs-spotlight bg-cs-surface/50 backdrop-blur-sm ring-1 ring-cs-text/5">
              <span className="px-6 text-center font-display text-sm uppercase tracking-[0.2em] text-cs-text-muted md:text-base">
                {t("imagePlaceholder")}
              </span>
            </div>
          </Parallax>
        </div>

        <FadeIn delay={0.2} className="mx-auto mt-12 max-w-xl text-center">
          <p className="text-base text-cs-text-muted md:text-lg">
            {t("description")}
          </p>
          <div className="mt-8">
            <LinkButton href="/menu/sandwiches">{t("cta")}</LinkButton>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
