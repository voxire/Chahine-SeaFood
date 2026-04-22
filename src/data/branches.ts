// Branch registry. Phone numbers are from the current chahineseafood.com
// linktree (confirmed during the 2026-04-22 inspection). Tripoli was on
// Instagram but not on the current site — leaving as a placeholder until
// the client confirms. See CLAUDE.md §20 parked question #3.

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
  geo?: { lat: number; lng: number };
};

export const branches: readonly Branch[] = [
  { slug: "cola",     phone: "96178905282", geo: { lat: 33.8698, lng: 35.5012 } },
  { slug: "hamra",    phone: "96178905282", geo: { lat: 33.8959, lng: 35.4784 } },
  { slug: "dekwaneh", phone: "96181800302", geo: { lat: 33.8724, lng: 35.5573 } },
  { slug: "dahyeh",   phone: "9613809922",  geo: { lat: 33.8547, lng: 35.5078 } },
  { slug: "khaldeh",  phone: "96181820062", geo: { lat: 33.7706, lng: 35.4906 } },
  { slug: "saida",    phone: "9613885022",  geo: { lat: 33.5634, lng: 35.3711 } },
  { slug: "alay",     phone: "96171200612", geo: { lat: 33.8039, lng: 35.5978 } },
  { slug: "kaslik",   phone: "96178777961", geo: { lat: 33.9792, lng: 35.6131 } },
  { slug: "byblos",   phone: "79144002",    geo: { lat: 34.1232, lng: 35.6518 } },
  { slug: "tripoli",  phone: "",            geo: { lat: 34.4367, lng: 35.8497 } },
] as const;

export const branchSlugs = branches.map((b) => b.slug);

export function isBranchSlug(value: string): value is BranchSlug {
  return (branchSlugs as string[]).includes(value);
}

export function findBranch(slug: string): Branch | undefined {
  return branches.find((b) => b.slug === slug);
}
