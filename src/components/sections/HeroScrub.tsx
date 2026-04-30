import { getTranslations } from "next-intl/server";

import type { Locale } from "../../../i18n";
import { menuImage } from "@/lib/menuImage";
import { findItem } from "@/data/menu";
import { HeroScrubScene } from "./HeroScrubScene";

type Props = {
  locale: Locale;
};

/**
 * Server wrapper for the new pinned hero scroll-scrub moment (Moment 1
 * of the redesigned home sequence). Fetches translations + resolves the
 * hero dish photo, hands them to <HeroScrubScene/>.
 *
 * Hero dish selection
 * ───────────────────
 * The signature platter ("Grilled Shrimps") is the first hero — it's
 * one of the four signature-tagged dishes, the imagery is dramatic,
 * and "from the heart of the sea" reads more directly against shrimp
 * than against a sandwich. Swap the `findItem(...)` call to change the
 * featured dish without touching the scene component.
 *
 * Translation source
 * ──────────────────
 * Reuses the existing `hero` namespace — no new keys introduced. The
 * pinned-scrub hero composes `plain` + `pill` as the back-layer ghost
 * headline and `tagline` as the prominent foreground phrase, exactly
 * the same set of strings the static <Hero/> already uses.
 */
export async function HeroScrub({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: "hero" });

  const heroDish = findItem("platters", "grilled-shrimps");
  const imageSrc =
    menuImage("platters", "grilled-shrimps") ??
    "/menu/platters-grilled-shrimps.jpg";
  const imageAlt =
    locale === "ar"
      ? heroDish?.description_ar ?? heroDish?.name_ar ?? ""
      : heroDish?.description_en ?? heroDish?.name_en ?? "";

  return (
    <HeroScrubScene
      plain={t("plain")}
      pill={t("pill")}
      tagline={t("tagline")}
      subline={t("subline")}
      ctaMenu={t("ctaMenu")}
      ctaBranches={t("ctaBranches")}
      imageSrc={imageSrc}
      imageAlt={imageAlt}
    />
  );
}
