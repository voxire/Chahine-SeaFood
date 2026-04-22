import type { SVGProps } from "react";

/**
 * Line-art soft-drink cup — lidded cup with a straw. The beverages
 * category glyph in the MenuPreview grid.
 */
export function Drink(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 80 100"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {/* Lid rim. */}
      <path d="M14 22 L 66 22" />
      <path d="M12 22 C 12 18, 16 16, 20 16 L 60 16 C 64 16, 68 18, 68 22" />
      {/* Lid dome hint. */}
      <path d="M18 22 C 22 20, 58 20, 62 22" opacity={0.6} />
      {/* Straw. */}
      <path d="M44 14 L 48 2" />
      <path d="M48 2 L 54 4" />
      {/* Cup body — tapered. */}
      <path d="M14 22 L 20 92 C 26 94, 54 94, 60 92 L 66 22" />
      {/* Logo band hint. */}
      <path d="M22 50 L 58 50" strokeDasharray="2 3" opacity={0.5} />
      <path d="M22 58 L 58 58" strokeDasharray="2 3" opacity={0.3} />
    </svg>
  );
}
