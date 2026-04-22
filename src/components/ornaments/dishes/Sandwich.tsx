import type { SVGProps } from "react";

/**
 * Line-art sandwich silhouette — a classic baguette-style sub with a
 * visible fish fillet + lettuce frill. Used as the placeholder glyph
 * for the signature-sandwich cards until real cutouts land.
 *
 * Drawn in a 120×80 viewBox so it keeps the wide, horizontal feel of a
 * Chahine's Shrimp / fish fillet sub without fighting a square card.
 */
export function Sandwich(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 120 80"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {/* Top crust — long, gently curved baguette. */}
      <path d="M10 32 C 22 18, 40 14, 60 14 C 82 14, 100 18, 110 32" />
      {/* Bottom crust — mirrors the top with a slight belly. */}
      <path d="M10 44 C 20 58, 42 64, 60 64 C 80 64, 100 60, 110 44" />
      {/* End caps. */}
      <path d="M10 32 C 7 36, 7 40, 10 44" />
      <path d="M110 32 C 113 36, 113 40, 110 44" />
      {/* Sesame specks across the top crust. */}
      <circle cx="34" cy="22" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="50" cy="19" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="68" cy="19" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="84" cy="22" r="0.9" fill="currentColor" stroke="none" />
      {/* Lettuce frill — peeking out under the crust. */}
      <path d="M14 44 C 18 46, 22 44, 26 47 C 30 44, 34 47, 38 45 C 42 48, 46 45, 50 48 C 54 45, 58 48, 62 46 C 66 49, 70 46, 74 48 C 78 45, 82 48, 86 46 C 90 49, 94 46, 98 48 C 102 45, 106 48, 110 46" />
      {/* Fillet stripe — the fish inside. */}
      <path d="M18 50 C 30 55, 60 54, 102 50" strokeDasharray="2 3" />
    </svg>
  );
}
