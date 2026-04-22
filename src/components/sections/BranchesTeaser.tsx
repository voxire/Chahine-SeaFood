import { getTranslations } from "next-intl/server";
import { FadeIn } from "@/components/motion/FadeIn";
import { SectionHeading } from "@/components/motion/SectionHeading";
import { LinkButton } from "@/components/ui/Button";
import { branches } from "@/data/branches";

export async function BranchesTeaser() {
  const t = await getTranslations("branchesTeaser");
  const tBranches = await getTranslations("branchNames");

  return (
    <section
      aria-labelledby="branches-teaser-heading"
      className="bg-cs-surface/30 py-section-y"
    >
      <div className="mx-auto max-w-container px-6">
        <FadeIn>
          <SectionHeading
            plain={t("plain")}
            pill={t("pill")}
            subhead={t("description")}
            as="h2"
          />
        </FadeIn>

        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {branches.map((b, i) => (
            <FadeIn key={b.slug} delay={0.04 * i}>
              <span className="inline-block rounded-pill border border-cs-text/20 px-4 py-2 text-sm font-medium text-cs-text-muted">
                {tBranches(b.slug)}
              </span>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.5} className="mt-12 flex justify-center">
          <LinkButton href="/branches">{t("cta")}</LinkButton>
        </FadeIn>
      </div>
    </section>
  );
}
