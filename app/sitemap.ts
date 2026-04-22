import type { MetadataRoute } from "next";

import { defaultLocale, locales } from "../i18n";
import { branches } from "../src/data/branches";
import { categories } from "../src/data/categories";
import { menu } from "../src/data/menu";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://chahineseafood.com";

type StaticEntry = {
  /** Locale-relative path, always starting with "/". */
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
};

/**
 * Dynamic sitemap.
 *
 * Generates the full URL set (static pages + every category + every menu
 * item) for every supported locale. Each URL carries `alternates.languages`
 * so Google can pair the en / ar variants and route unknown-locale users to
 * the default-locale version via `x-default`.
 *
 * Routes per locale:
 *   1  home
 *   1  /menu
 *   8  /menu/[category]
 *  36  /menu/[category]/[item]
 *   1  /branches
 *   1  /about
 *   1  /contact
 * = 49 × 2 locales = ~98 URLs
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticEntries: StaticEntry[] = [
    { path: "/",          priority: 1.0, changeFrequency: "monthly" },
    { path: "/menu",      priority: 0.9, changeFrequency: "weekly" },
    { path: "/branches",  priority: 0.9, changeFrequency: "monthly" },
    { path: "/about",     priority: 0.6, changeFrequency: "yearly" },
    { path: "/contact",   priority: 0.7, changeFrequency: "yearly" },
  ];

  const categoryEntries: StaticEntry[] = categories.map((c) => ({
    path: `/menu/${c.slug}`,
    priority: 0.8,
    changeFrequency: "weekly",
  }));

  const itemEntries: StaticEntry[] = menu.map((i) => ({
    path: `/menu/${i.category}/${i.slug}`,
    priority: 0.7,
    changeFrequency: "weekly",
  }));

  const branchEntries: StaticEntry[] = branches.map((b) => ({
    path: `/branches/${b.slug}`,
    priority: 0.75,
    changeFrequency: "monthly",
  }));

  const allEntries = [
    ...staticEntries,
    ...categoryEntries,
    ...itemEntries,
    ...branchEntries,
  ];

  const urls: MetadataRoute.Sitemap = [];

  for (const entry of allEntries) {
    for (const locale of locales) {
      const url = `${SITE_URL}/${locale}${entry.path}`;

      // Build the hreflang alternates map — same path across every locale
      // plus `x-default` pointing at the default-locale version.
      const languages: Record<string, string> = {};
      for (const l of locales) {
        languages[l] = `${SITE_URL}/${l}${entry.path}`;
      }
      languages["x-default"] = `${SITE_URL}/${defaultLocale}${entry.path}`;

      urls.push({
        url,
        lastModified,
        changeFrequency: entry.changeFrequency,
        priority: entry.priority,
        alternates: { languages },
      });
    }
  }

  return urls;
}
