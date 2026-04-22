// Schema.org JSON-LD builders. Keep these as plain value-returning functions
// so they can be used by any server component; rendering happens in
// `components/seo/StructuredData.tsx`.
//
// Spec references:
//   Organization:    https://schema.org/Organization
//   Restaurant:      https://schema.org/Restaurant
//   LocalBusiness:   https://schema.org/LocalBusiness
//   department:      used to list sub-locations of a chain
//
// A single home page emits Organization + Restaurant (the chain, with all
// ten branches nested as `department` entries). Each branch entry is itself
// a Restaurant with its own `@id`, `geo`, `telephone`, and `openingHours`,
// so search engines can index them as individual local businesses.

import { branches, formatPhone, OPENING_HOURS } from "@/data/branches";
import type { Locale } from "../../../i18n";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://chahineseafood.com";

const INSTAGRAM_URL = "https://www.instagram.com/chahine.seafood.lb/";

/** Schema.org opening-hours spec: "Mo-Su 12:00-24:00" (noon to midnight). */
const OPENING_HOURS_SPEC = `Mo-Su ${OPENING_HOURS.openLocal}-24:00`;

export function organizationSchema(locale: Locale) {
  const name = locale === "ar" ? "شاهين سيفود" : "Chahine Seafood";
  const description =
    locale === "ar"
      ? "بيت السندويشات البحرية في لبنان — عشرة فروع من طرابلس إلى صيدا."
      : "Lebanon's seafood sandwich house — ten branches from Tripoli to Saida.";

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}#organization`,
    name,
    alternateName:
      locale === "ar" ? "Chahine Seafood" : "شاهين سيفود",
    url: SITE_URL,
    logo: `${SITE_URL}/brand/logo.jpg`,
    description,
    areaServed: { "@type": "Country", name: "Lebanon" },
    sameAs: [INSTAGRAM_URL],
  };
}

/**
 * Restaurant entity for the entire chain, with the ten branches nested as
 * `department`. Each department is itself a Restaurant with geo, phone, and
 * opening hours — which is what Google reads to show branches on Maps /
 * Knowledge-Panel results.
 */
export function restaurantChainSchema(locale: Locale) {
  const name = locale === "ar" ? "شاهين سيفود" : "Chahine Seafood";

  const department = branches.map((b) => {
    const branchName = locale === "ar" ? b.district_ar : b.district_en;
    const departmentNode: Record<string, unknown> = {
      "@type": "Restaurant",
      "@id": `${SITE_URL}#branch-${b.slug}`,
      name: `${name} — ${branchName}`,
      parentOrganization: { "@id": `${SITE_URL}#organization` },
      address: {
        "@type": "PostalAddress",
        addressLocality: branchName,
        addressCountry: "LB",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: b.geo.lat,
        longitude: b.geo.lng,
      },
      servesCuisine: locale === "ar" ? "مأكولات بحرية" : "Seafood",
      priceRange: "$$",
      openingHours: OPENING_HOURS_SPEC,
      url: `${SITE_URL}/${locale}/branches`,
    };
    if (b.phone) {
      departmentNode.telephone = formatPhone(b.phone).replace(/\s+/g, "");
    }
    return departmentNode;
  });

  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${SITE_URL}#chain`,
    name,
    url: `${SITE_URL}/${locale}/`,
    image: `${SITE_URL}/brand/logo.jpg`,
    servesCuisine: locale === "ar" ? "مأكولات بحرية" : "Seafood",
    priceRange: "$$",
    openingHours: OPENING_HOURS_SPEC,
    areaServed: { "@type": "Country", name: "Lebanon" },
    hasMenu: `${SITE_URL}/${locale}/menu`,
    sameAs: [INSTAGRAM_URL],
    parentOrganization: { "@id": `${SITE_URL}#organization` },
    department,
  };
}
