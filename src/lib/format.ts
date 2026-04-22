import type { Locale } from "../../i18n";

/**
 * Format a Lebanese-pound price with locale-appropriate digits and separator,
 * always followed by the "LL" suffix (or "ل.ل" in Arabic).
 *
 * Examples:
 *   formatLBP(550_000, "en") → "550,000 LL"
 *   formatLBP(550_000, "ar") → "٥٥٠٬٠٠٠ ل.ل"
 */
export function formatLBP(amount: number, locale: Locale): string {
  if (locale === "ar") {
    const digits = amount.toLocaleString("ar-LB");
    return `${digits}\u00A0ل.ل`;
  }
  return `${amount.toLocaleString("en-US")}\u00A0LL`;
}
