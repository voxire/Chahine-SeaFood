import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/Hero";

type Props = {
  params: { locale: string };
};

export default function HomePage({ params }: Props) {
  // Required for static rendering under next-intl 3.22+.
  setRequestLocale(params.locale);

  return (
    <>
      <Hero />
    </>
  );
}
