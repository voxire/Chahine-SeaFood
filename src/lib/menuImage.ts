import type { CategoryKey } from "@/data/categories";

/**
 * Build-time manifest of dish photos that exist under `/public/menu/`.
 *
 * Each entry is the `category-slug` key that `menuImage()` uses to look
 * up a photo. Anything absent from this set falls through to
 * `<DishPlaceholder>` so dishes without photography still read as an
 * intentional brand artefact rather than "missing image".
 *
 * Keep this list in lockstep with the files under `public/menu/` — if you
 * add or remove a `.jpg` there, mirror the change here. The alternative
 * would be reading the filesystem at request time, which works in Node
 * runtime but breaks Edge/middleware (and forces image URLs through
 * server-only boundaries). A static manifest keeps the lookup pure.
 */
const MENU_IMAGE_MANIFEST: ReadonlySet<string> = new Set([
  // Sandwiches
  "sandwiches-calamari",
  "sandwiches-chahines-shrimp",
  "sandwiches-chinese-shrimp",
  "sandwiches-crab",
  "sandwiches-crispy-fillet",
  "sandwiches-crispy-shrimp",
  "sandwiches-fries",
  "sandwiches-shrimp-and-crab",
  "sandwiches-shrimp-maslooq",

  // Burgers
  "burgers-crispy-fillet-burger",
  "burgers-fish-metla-burger",
  "burgers-shrimp-burger",

  // Platters
  "platters-chinese-shrimp",
  "platters-crispy-fillet",
  "platters-crispy-mixed-seafood",
  "platters-fries-box",
  "platters-fries-platter",
  "platters-grilled-shrimps",
  "platters-loaded-seafood-mix",
  "platters-shrimps",

  // Family meals
  "family-meals-crispy-fillet",
  "family-meals-crispy-mixed-seafood",
  "family-meals-grilled-shrimps",
  "family-meals-shrimps",

  // Salads
  "salads-crab",
  "salads-crab-and-shrimps",

  // Add-ons
  "add-ons-bun",

  // Beverages
  "beverages-soft-drinks",
  "beverages-water",
]);

/**
 * Resolve the public URL for a dish photo, or `null` if we don't have
 * one yet. Callers should fall through to `<DishPlaceholder>` on `null`.
 *
 *   menuImage("sandwiches", "chahines-shrimp")
 *     // -> "/menu/sandwiches-chahines-shrimp.jpg"
 *   menuImage("dips", "tartar-or-cocktail")
 *     // -> null
 */
export function menuImage(
  category: CategoryKey,
  slug: string,
): string | null {
  const key = `${category}-${slug}`;
  return MENU_IMAGE_MANIFEST.has(key) ? `/menu/${key}.jpg` : null;
}
