import type { SVGProps } from "react";

/**
 * Line-art family meal — a larger oval serving platter stacked with
 * three fillets and two shrimp garnishes. Reads as "for the table"
 * even at small sizes.
 */
export function FamilyMeal(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 130 80"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {/* Large oval platter. */}
      <ellipse cx="65" cy="44" rx="60" ry="30" />
      <ellipse cx="65" cy="44" rx="54" ry="26" opacity={0.4} />
      {/* Three fillets. */}
      <path d="M22 44 C 30 38, 42 38, 50 44 C 42 50, 30 50, 22 44 Z" />
      <path d="M52 38 C 60 32, 74 32, 82 38 C 74 44, 60 44, 52 38 Z" />
      <path d="M22 58 C 30 52, 44 52, 52 58 C 44 64, 30 64, 22 58 Z" />
      {/* Two shrimps on the right. */}
      <path d="M92 36 C 88 34, 88 42, 92 42 C 96 42, 100 40, 102 36" />
      <path d="M96 56 C 92 54, 92 62, 96 62 C 100 62, 104 60, 106 56" />
      {/* Lemon wedges. */}
      <path d="M108 42 L 118 48 L 108 54 Z" opacity={0.85} />
      <path d="M58 58 L 66 62 L 58 66 Z" opacity={0.85} />
    </svg>
  );
}
