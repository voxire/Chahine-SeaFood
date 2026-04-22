// Branch registry. Phone numbers are from the current chahineseafood.com
// linktree (confirmed during the 2026-04-22 inspection), cross-checked against
// the client's Instagram bio @chahine.seafood.lb which also lists all ten
// branches. Tripoli is ACTIVE per the IG bio; its phone number was not on
// the linktree and remains to be confirmed by the client (§20 Q#3).
//
// KNOWN PENDING ITEMS (track under CLAUDE.md §20):
//   - Cola & Hamra share phone 96178905282 on the linktree. Likely a shared
//     central-Beirut WhatsApp line, but needs client confirmation — treat
//     both as routing to the same WA inbox for now.
//   - Tripoli phone empty; UI must gracefully omit the Order button until
//     the client confirms it.
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

/** Chain-wide opening hours: 12pm to 2am (next day), every day.
 *  These are 24-hour ISO strings consumed by Schema.org LocalBusiness
 *  structured data. User-visible copy is localized in messages/*.json
 *  ("Open daily", "12pm – 2am" / "مفتوح يومياً", "١٢ ظهراً – ٢ فجراً"). */
export const OPENING_HOURS = {
  openLocal: "12:00",
  closeLocal: "02:00",
};

/**
 * Per-branch operational facts used to power the /branches/[slug] facts
 * grid + FAQ block, and to feed LocalBusiness structured data. Values are
 * reasonable-assumption placeholders per CLAUDE.md §18 — flagged for
 * client confirmation under §20. Swap literal strings for CMS-backed
 * content once we sign the deal.
 */
export type BranchFacts = {
  /** Is dine-in available at this branch? */
  dineIn: boolean;
  /** Does this branch offer delivery via partner apps? */
  delivery: boolean;
  /** Does this branch have parking (street/lot/valet)? */
  parking: "street" | "lot" | "valet" | "none";
  /** Two or three signature-dish keys (align with menu slugs where possible). */
  signatures: readonly string[];
};

const DEFAULT_FACTS: BranchFacts = {
  dineIn: true,
  delivery: true,
  parking: "street",
  signatures: ["fried-fish-sandwich", "mixed-seafood-platter"],
};

/**
 * Overrides for branches where the default isn't quite right. Anything
 * not listed falls back to `DEFAULT_FACTS`. Placeholder assumptions per
 * §18 — to be reviewed/replaced post client-signature.
 */
const FACTS_BY_SLUG: Partial<Record<BranchSlug, Partial<BranchFacts>>> = {
  cola: { parking: "lot", signatures: ["fried-fish-sandwich", "calamari-plate", "mixed-seafood-platter"] },
  hamra: { parking: "street" },
  dekwaneh: { parking: "lot" },
  dahyeh: { parking: "street" },
  khaldeh: { parking: "lot", signatures: ["grilled-sea-bass", "mixed-seafood-platter"] },
  saida: { parking: "lot" },
  alay: { parking: "street" },
  kaslik: { parking: "valet", signatures: ["grilled-sea-bass", "octopus-salad"] },
  byblos: { parking: "street" },
  tripoli: { parking: "street", dineIn: true, delivery: false },
};

export function branchFacts(slug: BranchSlug): BranchFacts {
  const override = FACTS_BY_SLUG[slug] ?? {};
  return { ...DEFAULT_FACTS, ...override };
}

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
 * Format a Lebanese phone number for display.
 *
 *   "96178905282"  → "+961 78 905 282"   (8-digit mobile, country-prefixed)
 *   "9613809922"   → "+961 3 809 922"    (7-digit landline, country-prefixed)
 *   "79144002"     → "+961 79 144 002"   (8-digit mobile, no country prefix in source)
 *   "03885022"     → "+961 3 885 022"    (7-digit with trunk-0)
 *
 * Strategy: strip the 961 country code (if present) and any leading 0, then
 * split by digit count:
 *   - 8 digits → mobile          "XX XXX XXX"
 *   - 7 digits → landline        "X XXX XXX"
 *   - anything else            → display as-is with +961 prefix
 */
export function formatPhone(raw: string): string {
  if (!raw) return "";
  let national = raw.replace(/\D/g, "");              // drop non-digits
  if (national.startsWith("961")) national = national.slice(3);
  if (national.startsWith("0")) national = national.slice(1);

  if (national.length === 8) {
    return `+961 ${national.slice(0, 2)} ${national.slice(2, 5)} ${national.slice(5)}`;
  }
  if (national.length === 7) {
    return `+961 ${national.slice(0, 1)} ${national.slice(1, 4)} ${national.slice(4)}`;
  }
  return `+961 ${national}`;
}
