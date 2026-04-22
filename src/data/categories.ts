// Menu category registry. Source of truth for what categories exist in the
// nav, on the home menu preview, and as routes under /menu/[category].
// Replaces the invented scaffold categories with the real ones from the
// client's in-branch menu (April 2026).
//
// Once Sanity is wired up, this will be replaced by a CMS query — until then
// the category set is fixed in code so pages can prerender statically.

export type CategoryKey =
  | "sandwiches"
  | "burgers"
  | "platters"
  | "family-meals"
  | "salads"
  | "add-ons"
  | "dips"
  | "beverages";

export type Category = {
  slug: CategoryKey;
  order: number;
};

export const categories: readonly Category[] = [
  { slug: "sandwiches",    order: 1 },
  { slug: "burgers",       order: 2 },
  { slug: "platters",      order: 3 },
  { slug: "family-meals",  order: 4 },
  { slug: "salads",        order: 5 },
  { slug: "add-ons",       order: 6 },
  { slug: "dips",          order: 7 },
  { slug: "beverages",     order: 8 },
] as const;

export const categorySlugs = categories.map((c) => c.slug);

export function isCategorySlug(value: string): value is CategoryKey {
  return (categorySlugs as string[]).includes(value);
}
