import { getTranslations } from "next-intl/server";

import { menuImage } from "@/lib/menuImage";
import { SignatureShowcaseScene } from "./SignatureShowcaseScene";
import type { CategoryKey } from "@/data/categories";

/**
 * Signature Showcase — the home page's frieslab-level signature moment.
 *
 * Replaces the previous single-dish "SignatureDish" pinned scene, which
 * read as a card with three floating callouts and didn't carry enough
 * weight to stand as the home page's cinematic beat.
 *
 * This new implementation pins the viewport while FIVE signature dishes
 * translate horizontally across the screen as the user scrolls down.
 * Each card is full-bleed with a huge display-font title and a terse
 * tagline. A live 01/05 counter ticks through as cards pass.
 *
 * Server-side work: look up each dish's image URL at render time so the
 * initial HTML already carries the `<img src>` for SEO and no-JS users.
 * All copy (heading, taglines, CTA, counter label) is pulled via
 * `getTranslations` so both EN and AR are server-rendered.
 *
 * The client island (`SignatureShowcaseScene`) owns the scroll hook + the
 * motion.div translation. Reduced motion and narrow viewports (≤ md)
 * collapse to a static 2-column grid — the horizontal pin only makes
 * sense on wide screens and with motion enabled.
 */

type DishSlug = {
  id: "crispyFillet" | "shrimpBurger" | "grilledShrimps" | "loadedSeafoodMix" | "calamari";
  category: CategoryKey;
  slug: string;
  href: string;
};

// Curated to three dishes that together tell the brand story:
//   1. Crispy Fillet — the signature sandwich ("the one that built
//      this house")
//   2. Grilled Shrimps — the heritage grill side, minimal by design
//   3. Loaded Seafood Mix — the sharing plate, the celebration meal
//
// Kept shrimpBurger + calamari i18n strings in the messages file in
// case the curated set changes later, but they aren't rendered.
const DISHES: DishSlug[] = [
  { id: "crispyFillet",     category: "sandwiches", slug: "crispy-fillet",      href: "/menu/sandwiches" },
  { id: "grilledShrimps",   category: "platters",   slug: "grilled-shrimps",    href: "/menu/platters" },
  { id: "loadedSeafoodMix", category: "platters",   slug: "loaded-seafood-mix", href: "/menu/platters" },
];

export async function SignatureShowcase() {
  const t = await getTranslations("signatureShowcase");

  const dishes = DISHES.map((d) => ({
    id: d.id,
    name: t(`dishes.${d.id}.name`),
    tagline: t(`dishes.${d.id}.tagline`),
    imageSrc: menuImage(d.category, d.slug),
    href: d.href,
  }));

  return (
    <SignatureShowcaseScene
      plain={t("plain")}
      pill={t("pill")}
      description={t("description")}
      counterLabel={t("counterLabel")}
      cta={t("cta")}
      dishes={dishes}
    />
  );
}
