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
import { Hero } from "@/components/sections/Hero";
import { SignatureShowcase } from "@/components/sections/SignatureShowcase";
import { MenuPreview } from "@/components/sections/MenuPreview";
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

      <Hero />
      <SignatureShowcase />
      <MenuPreview />
      <BranchesTeaser />
      <StoryStrip />
      <Community />
    </>
  );
}
