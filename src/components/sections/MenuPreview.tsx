import { getTranslations } from "next-intl/server";
import { FadeIn } from "@/components/motion/FadeIn";
import { SectionHeading } from "@/components/motion/SectionHeading";
import { LinkButton } from "@/components/ui/Button";
import { Link } from "@/lib/i18n/navigation";
import { categories } from "@/data/categories";

export async function MenuPreview() {
  const t = await getTranslations("menuPreview");
  const tCategories = await getTranslations("categories");

  return (
    <section
      aria-labelledby="menu-preview-heading"
      className="py-section-y"
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

        <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4">
          {categories.map((c, i) => (
            <FadeIn key={c.slug} delay={0.08 + i * 0.05}>
              <Link
                href={`/menu/${c.slug}`}
                className="group block h-full rounded-lg border border-cs-text/10 bg-cs-surface p-8 text-center transition-colors hover:-translate-y-0.5 hover:border-cs-blue/40 hover:shadow-md"
              >
                <span className="block font-display text-base font-black uppercase leading-none text-cs-text transition-colors group-hover:text-cs-blue md:text-lg">
                  {tCategories(c.slug)}
                </span>
              </Link>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.45} className="mt-12 flex justify-center">
          <LinkButton href="/menu" variant="ghost">
            {t("viewAllCta")}
          </LinkButton>
        </FadeIn>
      </div>
    </section>
  );
}
