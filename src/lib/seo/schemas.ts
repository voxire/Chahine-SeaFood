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

import {
  branches,
  branchDistrict,
  formatPhone,
  OPENING_HOURS,
  type Branch,
} from "@/data/branches";
import type { MenuItem } from "@/data/menu";
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

/**
 * Single-branch Restaurant / LocalBusiness entity. Emitted on the per-branch
 * detail page (`/branches/[slug]`). Uses the same `@id` as the matching
 * entry in the home-page chain graph so search engines see one entity, two
 * places where it's declared.
 */
export function branchRestaurantSchema(branch: Branch, locale: Locale) {
  const brand = locale === "ar" ? "شاهين سيفود" : "Chahine Seafood";
  const district = branchDistrict(branch, locale);
  const fullName = `${brand} — ${district}`;

  const node: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${SITE_URL}#branch-${branch.slug}`,
    name: fullName,
    url: `${SITE_URL}/${locale}/branches/${branch.slug}`,
    image: `${SITE_URL}/brand/logo.jpg`,
    servesCuisine: locale === "ar" ? "مأكولات بحرية" : "Seafood",
    priceRange: "$$",
    openingHours: OPENING_HOURS_SPEC,
    address: {
      "@type": "PostalAddress",
      addressLocality: district,
      addressCountry: "LB",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: branch.geo.lat,
      longitude: branch.geo.lng,
    },
    hasMenu: `${SITE_URL}/${locale}/menu`,
    parentOrganization: { "@id": `${SITE_URL}#organization` },
    branchOf: { "@id": `${SITE_URL}#chain` },
  };
  if (branch.phone) {
    node.telephone = `+${branch.phone.replace(/\D/g, "")}`.startsWith("+961")
      ? `+${branch.phone.replace(/\D/g, "")}`
      : `+961${branch.phone.replace(/\D/g, "")}`;
  }
  return node;
}

/**
 * Per-item `MenuItem` schema. Emitted on /menu/[category]/[item]. Prices go
 * under `offers` rather than directly so consumers can read them as a proper
 * monetary offer with the right currency (LBP).
 */
export function menuItemSchema(item: MenuItem, locale: Locale) {
  const name = locale === "ar" ? item.name_ar : item.name_en;
  const description =
    locale === "ar" ? item.description_ar : item.description_en;

  return {
    "@context": "https://schema.org",
    "@type": "MenuItem",
    "@id": `${SITE_URL}#menu-${item.category}-${item.slug}`,
    name,
    description,
    inLanguage: locale === "ar" ? "ar-LB" : "en",
    offers: {
      "@type": "Offer",
      price: item.price,
      priceCurrency: "LBP",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/${locale}/menu/${item.category}/${item.slug}`,
    },
    // Link the item to the parent Restaurant so the chain graph joins up.
    menuAddOn: item.tags?.includes("signature") ? undefined : undefined,
    isPartOf: { "@id": `${SITE_URL}#chain` },
  };
}
