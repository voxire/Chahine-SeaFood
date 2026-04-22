// Branch registry. Phone numbers are from the current chahineseafood.com
// linktree (confirmed during the 2026-04-22 inspection), cross-checked against
// the client's Instagram bio @chahine.seafood.lb which also lists all ten
// branches. Tripoli is ACTIVE per the IG bio; its phone number was not on
// the linktree and remains to be confirmed by the client (§20 Q#3).
//
// Opening hours are chain-wide: 12:00–00:00 every day of the week, confirmed
// via each branch's WtsMenu ordering page (2026-04-22 research pass).

import type { Locale } from "../../i18n";

export type BranchSlug =
  | "cola"
  | "hamra"
  | "dekwaneh"
  | "dahyeh"
  | "khaldeh"
  | "saida"
  | "alay"
  | "kaslik"
  | "byblos"
  | "tripoli";

export type Branch = {
  slug: BranchSlug;
  /** E.164 digits without the leading "+". Empty string = unknown. */
  phone: string;
  /** Approximate coordinates (Google Maps lookup). To be confirmed by client. */
  geo: { lat: number; lng: number };
  /** District / city label used under the branch name. */
  district_en: string;
  district_ar: string;
};

export const branches: readonly Branch[] = [
  { slug: "cola",     phone: "96178905282", geo: { lat: 33.8698, lng: 35.5012 }, district_en: "Cola, Beirut",            district_ar: "الكولا، بيروت" },
  { slug: "hamra",    phone: "96178905282", geo: { lat: 33.8959, lng: 35.4784 }, district_en: "Hamra, Beirut",           district_ar: "الحمرا، بيروت" },
  { slug: "dekwaneh", phone: "96181800302", geo: { lat: 33.8724, lng: 35.5573 }, district_en: "Dekwaneh, Metn",          district_ar: "الدكوانة، المتن" },
  { slug: "dahyeh",   phone: "9613809922",  geo: { lat: 33.8547, lng: 35.5078 }, district_en: "Southern Suburb, Beirut", district_ar: "الضاحية الجنوبية، بيروت" },
  { slug: "khaldeh",  phone: "96181820062", geo: { lat: 33.7706, lng: 35.4906 }, district_en: "Khaldeh, Aley",           district_ar: "خلدة، عاليه" },
  { slug: "saida",    phone: "9613885022",  geo: { lat: 33.5634, lng: 35.3711 }, district_en: "Saida, South Lebanon",    district_ar: "صيدا، جنوب لبنان" },
  { slug: "alay",     phone: "96171200612", geo: { lat: 33.8039, lng: 35.5978 }, district_en: "Aley, Mount Lebanon",     district_ar: "عاليه، جبل لبنان" },
  { slug: "kaslik",   phone: "96178777961", geo: { lat: 33.9792, lng: 35.6131 }, district_en: "Kaslik, Keserwan",        district_ar: "الكسليك، كسروان" },
  { slug: "byblos",   phone: "79144002",    geo: { lat: 34.1232, lng: 35.6518 }, district_en: "Byblos, Mount Lebanon",   district_ar: "جبيل، جبل لبنان" },
  { slug: "tripoli",  phone: "",            geo: { lat: 34.4367, lng: 35.8497 }, district_en: "Tripoli, North Lebanon",  district_ar: "طرابلس، شمال لبنان" },
] as const;

/** Chain-wide opening hours: noon to midnight, every day. */
export const OPENING_HOURS = {
  openLocal: "12:00",
  closeLocal: "00:00",
};

export const branchSlugs = branches.map((b) => b.slug);

export function isBranchSlug(value: string): value is BranchSlug {
  return (branchSlugs as string[]).includes(value);
}

export function findBranch(slug: string): Branch | undefined {
  return branches.find((b) => b.slug === slug);
}

export function branchDistrict(branch: Branch, locale: Locale): string {
  return locale === "ar" ? branch.district_ar : branch.district_en;
}

/**
 * Google Maps search URL from the branch's coordinates plus a human label.
 * We use a `?q=<lat>,<lng>` URL rather than a place ID since we don't have
 * individual place IDs yet — this still opens Google Maps at the pin.
 */
export function branchMapsUrl(branch: Branch, locale: Locale): string {
  const label =
    locale === "ar"
      ? `شاهين سيفود ${branch.district_ar}`
      : `Chahine Seafood ${branch.district_en}`;
  return `https://www.google.com/maps/search/?api=1&query=${branch.geo.lat},${branch.geo.lng}&query_place_id=${encodeURIComponent(label)}`;
}

/**
 * Format an E.164 phone (without the leading "+") for display.
 * "96178905282" → "+961 78 905 282".
 */
export function formatPhone(e164: string): string {
  if (!e164) return "";
  if (e164.startsWith("961")) {
    const rest = e164.slice(3);
    return `+961 ${rest.slice(0, 2)} ${rest.slice(2, 5)} ${rest.slice(5)}`.trim();
  }
  // Numbers we have without the country-code prefix (e.g. "79144002"): render as-is with "+".
  return `+${e164}`;
}
