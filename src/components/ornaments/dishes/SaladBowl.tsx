import type { SVGProps } from "react";

/**
 * Line-art salad bowl — shallow bowl with a lettuce cluster and a
 * tomato accent. Used as the salads-category glyph in the MenuPreview
 * grid. Designed to sit on a circular plate backdrop so the visible
 * area is roughly centred and square-friendly.
 */
export function SaladBowl(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 100 80"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {/* Bowl rim — wide ellipse. */}
      <ellipse cx="50" cy="48" rx="38" ry="6" />
      {/* Bowl body — half ellipse. */}
      <path d="M12 48 C 12 68, 24 74, 50 74 C 76 74, 88 68, 88 48" />
      {/* Lettuce crown — overlapping leaf curves. */}
      <path d="M22 46 C 26 30, 36 26, 42 36" />
      <path d="M40 44 C 44 26, 56 22, 60 34" />
      <path d="M58 42 C 62 28, 72 26, 78 40" />
      {/* Tomato accent — small circle + leaf tick. */}
      <circle cx="50" cy="42" r="4" />
      <path d="M50 38 L 52 34" />
    </svg>
  );
}
