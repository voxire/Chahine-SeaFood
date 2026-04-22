import { clsx } from "clsx";
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

type GoldTextProps<T extends ElementType> = {
  /**
   * The HTML element to render. Defaults to `span` so `<GoldText>` can
   * sit inline inside a sentence or a bigger heading without breaking
   * hierarchy (§8.1 of CLAUDE.md — exactly one `<h1>` per page).
   */
  as?: T;
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

/**
 * Applies the brand gold-gradient clipped to the text via the
 * `.cs-gold-text` utility (declared in `globals.css`).
 *
 * Use for the accented word inside a `<SectionHeading>`, the hero
 * kicker, or any callout where a word needs to shimmer gold against
 * cream/cobalt copy. Stays accessible because the fallback (no
 * `background-clip: text` support) resolves to a flat AA-safe gold.
 *
 * Example:
 *   <h2>Our <GoldText>Signature</GoldText> Dishes</h2>
 */
export function GoldText<T extends ElementType = "span">({
  as,
  className,
  children,
  ...rest
}: GoldTextProps<T>) {
  const Tag = (as ?? "span") as ElementType;
  return (
    <Tag className={clsx("cs-gold-text", className)} {...rest}>
      {children}
    </Tag>
  );
}
