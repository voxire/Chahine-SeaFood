import type { Metadata } from "next";
import { locales, type Locale } from "../../i18n";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://chahineseafood.com";
const DEFAULT_OG = "/assets/images/og/og-default.jpg";

type PageMetaInput = {
  title: string;
  description: string;
  /** Locale-relative path starting with "/" (e.g. "/menu/sandwiches"). */
  path: string;
  locale: Locale;
  ogImage?: string;
};

/**
 * Build a complete Metadata object with canonical URL, hreflang alternates,
 * OpenGraph, and Twitter cards. Every route's `generateMetadata()` should
 * call this — never return a partial metadata object.
 */
export function buildPageMetadata(input: PageMetaInput): Metadata {
  const url = `${SITE_URL}/${input.locale}${input.path}`;

  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[l] = `${SITE_URL}/${l}${input.path}`;
  }

  const ogImage = input.ogImage ?? DEFAULT_OG;
  const ogLocale = input.locale === "ar" ? "ar_LB" : "en_US";

  return {
    title: input.title,
    description: input.description,
    alternates: {
      canonical: url,
      languages,
    },
    openGraph: {
      title: input.title,
      description: input.description,
      url,
      locale: ogLocale,
      siteName: "Chahine Seafood",
      images: [{ url: ogImage, width: 1200, height: 630 }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: [ogImage],
    },
  };
}
