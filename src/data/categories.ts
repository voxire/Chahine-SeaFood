// Menu category registry. Source of truth for what categories exist in the
// nav, on the home menu preview, and as routes under /menu/[category].
// Once Sanity is wired up, this will be replaced by a CMS query — until then
// the category set is fixed in code so pages can prerender statically.

export type CategoryKey =
  | "sandwiches"
  | "platters"
  | "seafood-by-weight"
  | "sides"
  | "drinks"
  | "packaged";

export type Category = {
  slug: CategoryKey;
  order: number;
};

export const categories: readonly Category[] = [
  { slug: "sandwiches", order: 1 },
  { slug: "platters", order: 2 },
  { slug: "seafood-by-weight", order: 3 },
  { slug: "sides", order: 4 },
  { slug: "drinks", order: 5 },
  { slug: "packaged", order: 6 },
] as const;

export const categorySlugs = categories.map((c) => c.slug);

export function isCategorySlug(value: string): value is CategoryKey {
  return (categorySlugs as string[]).includes(value);
}
