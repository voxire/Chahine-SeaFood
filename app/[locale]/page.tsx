import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/Hero";
import { SignatureDish } from "@/components/sections/SignatureDish";
import { MenuPreview } from "@/components/sections/MenuPreview";
import { BranchesTeaser } from "@/components/sections/BranchesTeaser";
import { StoryStrip } from "@/components/sections/StoryStrip";

type Props = {
  params: { locale: string };
};

export default function HomePage({ params }: Props) {
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
