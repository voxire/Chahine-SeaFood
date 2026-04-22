import type { Metadata } from "next";
import { defaultLocale, locales, type Locale } from "../../i18n";

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
  /**
   * When true, the title is rendered verbatim and bypasses the layout's
   * `title.template`. Use for the home page, where the title already
   * contains "Chahine Seafood".
   */
  titleAbsolute?: boolean;
};

/**
 * Build a complete Metadata object with canonical URL, hreflang alternates
 * (including `x-default`), OpenGraph, and Twitter cards. Every route's
 * `generateMetadata()` should call this — never return a partial metadata
 * object.
 *
 * `x-default` points at the default-locale version of the same path, per
 * Google's hreflang guidance. Unknown-locale users land on `/en/<path>`.
 */
export function buildPageMetadata(input: PageMetaInput): Metadata {
  const url = `${SITE_URL}/${input.locale}${input.path}`;

  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[l] = `${SITE_URL}/${l}${input.path}`;
  }
  languages["x-default"] = `${SITE_URL}/${defaultLocale}${input.path}`;

  const ogImage = input.ogImage ?? DEFAULT_OG;
  const ogLocale = input.locale === "ar" ? "ar_LB" : "en_US";

  return {
    title: input.titleAbsolute ? { absolute: input.title } : input.title,
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
