import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { isLocale, type Locale } from "../../i18n";
import { buildPageMetadata } from "@/lib/seo";
import { Hero } from "@/components/sections/Hero";
import { SignatureDish } from "@/components/sections/SignatureDish";
import { MenuPreview } from "@/components/sections/MenuPreview";
import { BranchesTeaser } from "@/components/sections/BranchesTeaser";
import { StoryStrip } from "@/components/sections/StoryStrip";

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
    // Home title already contains "Chahine Seafood" — opt out of the template
    // from the locale layout to avoid "… · Chahine Seafood · Chahine Seafood".
    titleAbsolute: true,
  });
}

export default function HomePage({ params }: Props) {
  if (!isLocale(params.locale)) notFound();
  // Required for static rendering under next-intl 3.22+.
  setRequestLocale(params.locale);

  return (
    <>
      <Hero />
      <SignatureDish />
      <MenuPreview />
      <BranchesTeaser />
      <StoryStrip />
    </>
  );
}
