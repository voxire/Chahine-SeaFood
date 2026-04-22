import type { CategoryKey } from "./categories";

// ---------------------------------------------------------------------------
// Menu data — transcribed from the client's in-branch menu card (April 2026).
// Prices are in LBP (Lebanese pounds) as integers — never decimals.
// Each item carries bilingual name + ingredient description so the page
// layer can render locale-appropriate content without hitting next-intl.
// Once Sanity is wired up this file will be replaced by a CMS query.
// ---------------------------------------------------------------------------

export type MenuItemTag = "signature" | "new" | "spicy";

export type MenuItem = {
  /** Unique within its category. URL-safe lowercase kebab. */
  slug: string;
  category: CategoryKey;
  name_en: string;
  name_ar: string;
  /** Ingredient / composition list, comma-separated. */
  description_en: string;
  description_ar: string;
  /** Price in LBP (integer, no decimals). */
  price: number;
  tags?: MenuItemTag[];
};

export const menu: readonly MenuItem[] = [
  // -------------------------------------------------------------------------
  // Sandwiches (9)
  // -------------------------------------------------------------------------
  {
    slug: "calamari",
    category: "sandwiches",
    name_en: "Calamari",
    name_ar: "كلاماري",
    description_en: "Calamari, tartar, lettuce, pickles, lemon",
    description_ar: "كلاماري، تارتار، خس، كبيس، حامض",
    price: 500_000,
  },
  {
    slug: "chahines-shrimp",
    category: "sandwiches",
    name_en: "Chahine's Shrimp",
    name_ar: "قريدس شاهين",
    description_en: "Shrimp, tartar, BBQ sauce, lettuce, potato chips",
    description_ar: "قريدس، تارتار، باربيكيو صوص، خس، بطاطا شيبس",
    price: 550_000,
    tags: ["signature"],
  },
  {
    slug: "chinese-shrimp",
    category: "sandwiches",
    name_en: "Chinese Shrimp",
    name_ar: "قريدس صيني",
    description_en: "Shrimp with Chinese sauce, soy sauce, tartar, mozzarella, pickles",
    description_ar: "قريدس مع تشاينيز صوص، صويا صوص، تارتار، جبنة موزاريلا، كبيس",
    price: 550_000,
  },
  {
    slug: "crab",
    category: "sandwiches",
    name_en: "Crab",
    name_ar: "كراب",
    description_en: "Crab, tartar, pickles, lemon",
    description_ar: "كراب، تارتار، كبيس، حامض",
    price: 450_000,
  },
  {
    slug: "crispy-fillet",
    category: "sandwiches",
    name_en: "Crispy Fillet",
    name_ar: "كرسبي فيليه",
    description_en: "Crispy fish fillet, tartar, lettuce, pickles, lemon",
    description_ar: "كرسبي فيليه، تارتار، خس، كبيس، حامض",
    price: 450_000,
    tags: ["signature"],
  },
  {
    slug: "crispy-shrimp",
    category: "sandwiches",
    name_en: "Crispy Shrimp",
    name_ar: "كرسبي قريدس",
    description_en: "Shrimp, tartar, cocktail sauce, lettuce, pickles",
    description_ar: "قريدس، تارتار، كوكتيل، خس، كبيس",
    price: 500_000,
  },
  {
    slug: "fries",
    category: "sandwiches",
    name_en: "Fries",
    name_ar: "بطاطا",
    description_en: "Fries, tartar, cocktail sauce, lettuce, pickles",
    description_ar: "بطاطا، تارتار، كوكتيل، خس، كبيس",
    price: 300_000,
  },
  {
    slug: "shrimp-and-crab",
    category: "sandwiches",
    name_en: "Shrimp and Crab",
    name_ar: "قريدس وكراب",
    description_en: "Boiled shrimp, crab, tartar, pickles, lemon",
    description_ar: "قريدس مسلوق، كراب، تارتار، كبيس، حامض",
    price: 550_000,
  },
  {
    slug: "shrimp-maslooq",
    category: "sandwiches",
    name_en: "Shrimp Maslooq",
    name_ar: "قريدس مسلوق",
    description_en: "Boiled shrimp, tartar, cocktail sauce, lettuce, pickles",
    description_ar: "قريدس مسلوق، تارتار، كوكتيل، خس، كبيس",
    price: 500_000,
  },

  // -------------------------------------------------------------------------
  // Burgers (3)
  // -------------------------------------------------------------------------
  {
    slug: "crispy-fillet-burger",
    category: "burgers",
    name_en: "Crispy Fillet Burger",
    name_ar: "برغر كرسبي فيليه",
    description_en: "Crispy fillet, tartar, mozzarella slice, lettuce, pickles",
    description_ar: "كرسبي فيليه، تارتار، شريحة موزاريلا، خس، كبيس",
    price: 550_000,
  },
  {
    slug: "fish-metla-burger",
    category: "burgers",
    name_en: "Fish Metla Burger",
    name_ar: "برغر فش متلا",
    description_en: "Shrimp, fillet, crab, tartar, cocktail sauce, lettuce",
    description_ar: "قريدس، فيليه، كراب، تارتار، كوكتيل، خس",
    price: 600_000,
    tags: ["signature"],
  },
  {
    slug: "shrimp-burger",
    category: "burgers",
    name_en: "Shrimp Burger",
    name_ar: "برغر قريدس",
    description_en:
      "Shrimp, tartar, cocktail sauce, BBQ sauce, mozzarella slice, lettuce, pickles",
    description_ar:
      "قريدس، تارتار، كوكتيل، باربيكيو صوص، شريحة موزاريلا، خس، كبيس",
    price: 550_000,
  },

  // -------------------------------------------------------------------------
  // Platters (9)
  // -------------------------------------------------------------------------
  {
    slug: "calamari",
    category: "platters",
    name_en: "Calamari Platter",
    name_ar: "صحن كلاماري",
    description_en:
      "6 calamari pieces, fries, tartar, cocktail sauce, pickles, mini buns",
    description_ar: "6 قطع كلاماري، بطاطا، تارتار، كوكتيل، كبيس، خبز (ميني بان)",
    price: 950_000,
  },
  {
    slug: "chinese-shrimp",
    category: "platters",
    name_en: "Chinese Shrimp Platter",
    name_ar: "صحن قريدس صيني",
    description_en:
      "Shrimp with Chinese sauce, soy sauce, mozzarella, fries, tartar, cocktail sauce, pickles, mini buns",
    description_ar:
      "قريدس مع تشاينيز صوص، صويا صوص، جبنة موزاريلا، بطاطا، تارتار، كوكتيل، كبيس، ميني بان",
    price: 950_000,
  },
  {
    slug: "crispy-fillet",
    category: "platters",
    name_en: "Crispy Fillet Platter",
    name_ar: "صحن كرسبي فيليه",
    description_en:
      "6 crispy fillet pieces, fries, tartar, cocktail sauce, pickles, mini buns",
    description_ar: "6 قطع كرسبي فيليه، بطاطا، تارتار، كوكتيل، كبيس، ميني بان",
    price: 950_000,
  },
  {
    slug: "crispy-mixed-seafood",
    category: "platters",
    name_en: "Crispy Mixed Seafood",
    name_ar: "صحن كرسبي مشكل بحري",
    description_en:
      "8 shrimp, 3 crispy fillet, 1 calamari, tartar, cocktail sauce, pickles, mini buns",
    description_ar: "8 قريدس، 3 كرسبي فيليه، 1 كالاماري، تارتار، كوكتيل، كبيس، ميني بان",
    price: 950_000,
  },
  {
    slug: "grilled-shrimps",
    category: "platters",
    name_en: "Grilled Shrimps",
    name_ar: "قريدس مشوي",
    description_en:
      "10 grilled jumbo shrimp, sautéed greens (or swap for fries), BBQ sauce",
    description_ar: "10 قريدس جامبو مشوي، خضرة سوتيه أو تبديل بـ بطاطا، باربيكيو صوص",
    price: 1_000_000,
    tags: ["signature"],
  },
  {
    slug: "loaded-seafood-mix",
    category: "platters",
    name_en: "Loaded Seafood Mix",
    name_ar: "علبة مشكل بحري",
    description_en: "Box of fries, fried shrimp, crab, BBQ and cocktail sauces",
    description_ar: "علبة بطاطا، قريدس مقلي، كراب، باربيكيو، كوكتيل",
    price: 550_000,
  },
  {
    slug: "shrimps",
    category: "platters",
    name_en: "Shrimps Platter",
    name_ar: "صحن قريدس",
    description_en: "15 shrimp, fries, pickles, cocktail sauce, tartar, mini buns",
    description_ar: "15 قريدس، بطاطا، كبيس، كوكتيل، تارتار، ميني بان",
    price: 950_000,
  },
  {
    slug: "fries-box",
    category: "platters",
    name_en: "Fries Box",
    name_ar: "علبة بطاطا",
    description_en: "Box of fries, cocktail sauce",
    description_ar: "علبة بطاطا، كوكتيل صوص",
    price: 300_000,
  },
  {
    slug: "fries-platter",
    category: "platters",
    name_en: "Fries Platter",
    name_ar: "صحن بطاطا",
    description_en: "2 plates of fries, cocktail sauce",
    description_ar: "صحن بطاطا ×2، كوكتيل صوص",
    price: 500_000,
  },

  // -------------------------------------------------------------------------
  // Family Meals (4)
  // -------------------------------------------------------------------------
  {
    slug: "crispy-fillet",
    category: "family-meals",
    name_en: "Crispy Fillet Family",
    name_ar: "عائلي كرسبي فيليه",
    description_en:
      "22 crispy fillet pieces, plate of fries, 3 tartar, 3 cocktail sauces, pickles",
    description_ar: "22 قطعة كرسبي فيليه، صحن بطاطا، 3 تارتار، 3 كوكتيل صوص، كبيس",
    price: 2_400_000,
  },
  {
    slug: "crispy-mixed-seafood",
    category: "family-meals",
    name_en: "Crispy Mixed Seafood Family",
    name_ar: "عائلي كرسبي مشكل بحري",
    description_en:
      "25 shrimp, 12 crispy fillet, 3 calamari, plate of fries, 3 tartar, 3 cocktail, pickles",
    description_ar:
      "25 قريدس، 12 كرسبي فيليه، 3 كالاماري، صحن بطاطا، 3 تارتار، 3 كوكتيل، كبيس",
    price: 2_400_000,
  },
  {
    slug: "grilled-shrimps",
    category: "family-meals",
    name_en: "Grilled Shrimps Family",
    name_ar: "عائلي قريدس مشوي",
    description_en:
      "25 grilled jumbo shrimp, sautéed greens (or swap for fries), 3 BBQ sauces",
    description_ar:
      "25 قريدس جامبو مشوي، خضرة سوتيه أو تبديل بـ بطاطا، 3 باربيكيو صوص",
    price: 2_400_000,
    tags: ["signature"],
  },
  {
    slug: "shrimps",
    category: "family-meals",
    name_en: "Shrimps Family",
    name_ar: "عائلي قريدس",
    description_en:
      "45 shrimp pieces, plate of fries, 3 tartar, 3 cocktail sauces, pickles",
    description_ar: "45 قطعة قريدس، صحن بطاطا، 3 تارتار، 3 كوكتيل صوص، كبيس",
    price: 2_400_000,
  },

  // -------------------------------------------------------------------------
  // Salads (2)
  // -------------------------------------------------------------------------
  {
    slug: "crab",
    category: "salads",
    name_en: "Crab Salad",
    name_ar: "سلطة كراب",
    description_en: "Crab, lettuce, corn, cherry tomatoes, crab dressing",
    description_ar: "كراب، خس، ذرة، بندورة كرزية، كراب صوص",
    price: 500_000,
  },
  {
    slug: "crab-and-shrimps",
    category: "salads",
    name_en: "Crab & Shrimp Salad",
    name_ar: "سلطة كراب وقريدس",
    description_en: "Crab, shrimp, lettuce, corn, cherry tomatoes, crab dressing",
    description_ar: "كراب، قريدس، خس، ذرة، بندورة كرزية، كراب صوص",
    price: 650_000,
  },

  // -------------------------------------------------------------------------
  // Add-Ons (4)
  // -------------------------------------------------------------------------
  {
    slug: "bun",
    category: "add-ons",
    name_en: "Bun",
    name_ar: "خبز",
    description_en: "Extra bun",
    description_ar: "خبز إضافي",
    price: 30_000,
  },
  {
    slug: "shrimp",
    category: "add-ons",
    name_en: "Shrimp",
    name_ar: "قريدس",
    description_en: "Extra shrimp",
    description_ar: "قريدس إضافي",
    price: 50_000,
  },
  {
    slug: "calamari",
    category: "add-ons",
    name_en: "Calamari",
    name_ar: "كلاماري",
    description_en: "Extra calamari",
    description_ar: "كلاماري إضافي",
    price: 80_000,
  },
  {
    slug: "fillet",
    category: "add-ons",
    name_en: "Fillet",
    name_ar: "فيليه",
    description_en: "Extra fillet",
    description_ar: "فيليه إضافي",
    price: 100_000,
  },

  // -------------------------------------------------------------------------
  // Dips (3)
  // -------------------------------------------------------------------------
  {
    slug: "crab-dressing",
    category: "dips",
    name_en: "Crab Dressing",
    name_ar: "كراب صوص",
    description_en: "House crab dressing",
    description_ar: "كراب صوص البيت",
    price: 100_000,
  },
  {
    slug: "tartar-or-cocktail",
    category: "dips",
    name_en: "Tartar or Cocktail",
    name_ar: "تارتار أو كوكتيل",
    description_en: "Choice of tartar or cocktail sauce",
    description_ar: "تارتار أو كوكتيل صوص",
    price: 50_000,
  },
  {
    slug: "sweet-chili-or-bbq",
    category: "dips",
    name_en: "Sweet Chili or BBQ",
    name_ar: "تشيلي حلو أو باربيكيو",
    description_en: "Choice of sweet chili or BBQ sauce",
    description_ar: "تشيلي حلو أو باربيكيو صوص",
    price: 50_000,
  },

  // -------------------------------------------------------------------------
  // Beverages (2)
  // -------------------------------------------------------------------------
  {
    slug: "soft-drinks",
    category: "beverages",
    name_en: "Soft Drinks",
    name_ar: "مشروبات غازية",
    description_en: "Assorted soft drinks",
    description_ar: "مشروبات غازية متنوعة",
    price: 100_000,
  },
  {
    slug: "water",
    category: "beverages",
    name_en: "Water",
    name_ar: "مياه",
    description_en: "Still water",
    description_ar: "مياه",
    price: 50_000,
  },
];

/** Filter helpers */

export function itemsByCategory(category: CategoryKey): MenuItem[] {
  return menu
    .filter((i) => i.category === category)
    .slice() // fresh mutable array
    .sort((a, b) => a.name_en.localeCompare(b.name_en));
}

export function findItem(
  category: CategoryKey,
  slug: string,
): MenuItem | undefined {
  return menu.find((i) => i.category === category && i.slug === slug);
}

/** Return all items flagged as signature — used for home-page previews. */
export function signatureItems(): MenuItem[] {
  return menu.filter((i) => i.tags?.includes("signature"));
}
