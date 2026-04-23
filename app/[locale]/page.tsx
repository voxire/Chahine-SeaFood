import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { isLocale, type Locale } from "../../i18n";
import { buildPageMetadata } from "@/lib/seo";
import {
  organizationSchema,
  restaurantChainSchema,
} from "@/lib/seo/schemas";
import { StructuredData } from "@/components/seo/StructuredData";
import { BackgroundShift } from "@/components/motion/BackgroundShift";
import { Hero } from "@/components/sections/Hero";
import { SignatureShowcase } from "@/components/sections/SignatureShowcase";
import { MenuPreview } from "@/components/sections/MenuPreview";
import { Interstitial } from "@/components/sections/Interstitial";
import { BranchesTeaser } from "@/components/sections/BranchesTeaser";
import { StoryStrip } from "@/components/sections/StoryStrip";
import { Community } from "@/components/sections/Community";

type Props = {
  params: { locale: string };
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  const t = await getTranslations({
    locale: params.locale,
    namespace: "pages.home",
  });
  return buildPageMetadata({
    title: t("title"),
    description: t("description"),
    path: "/",
    locale: params.locale as Locale,
    titleAbsolute: true,
  });
}

export default function HomePage({ params }: Props) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  setRequestLocale(locale);

  return (
    <>
      {/* Schema.org JSON-LD: the brand Organization + the Restaurant chain
          with all ten branches nested as `department`. */}
      <StructuredData
        data={[organizationSchema(locale), restaurantChainSchema(locale)]}
      />

      {/* Home-only background crossfade — when a section marked
          `data-bg="navy"` scrolls into the viewport's middle band,
          the page bg flips from cream to navy. Currently applied to
          the Interstitial divider so the "going deep into the sea"
          moment actually reads that way visually. */}
      <BackgroundShift />

      <Hero />
      <SignatureShowcase />
      <MenuPreview />
      {/* Pinned sea-line divider — gives the eye a breathing beat
          between "food" and "find us," and cues the reader that the
          next chapter is starting. */}
      <Interstitial />
      <BranchesTeaser />
      <StoryStrip />
      <Community />
    </>
  );
}
