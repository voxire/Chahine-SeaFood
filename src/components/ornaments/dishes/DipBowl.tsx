import type { SVGProps } from "react";

/**
 * Line-art small dip ramekin — a shallow round bowl with a swoosh of
 * sauce and a herb fleck. Dips category glyph.
 */
export function DipBowl(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 100 70"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {/* Ramekin rim. */}
      <ellipse cx="50" cy="30" rx="38" ry="8" />
      {/* Inner sauce ellipse. */}
      <ellipse cx="50" cy="30" rx="32" ry="5" opacity={0.55} />
      {/* Ramekin body. */}
      <path d="M12 30 C 14 52, 28 62, 50 62 C 72 62, 86 52, 88 30" />
      {/* Swirl on the sauce surface. */}
      <path d="M34 30 C 42 26, 58 34, 66 30" opacity={0.65} />
      {/* Herb fleck. */}
      <path d="M56 26 L 58 22" />
      <path d="M58 22 L 60 24" />
    </svg>
  );
}
