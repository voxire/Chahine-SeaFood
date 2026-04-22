import type { SVGProps } from "react";

/**
 * Line-art fillet-burger silhouette — sesame bun top, a pickle slice,
 * the fillet disk, lettuce, bun bottom. Drawn tall in 100×100 so the
 * stack has room to read at card scale.
 */
export function Burger(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {/* Bun top — dome. */}
      <path d="M14 44 C 14 24, 32 14, 50 14 C 68 14, 86 24, 86 44" />
      {/* Dome base seam. */}
      <path d="M12 44 L 88 44" />
      {/* Sesame seeds. */}
      <circle cx="32" cy="30" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="46" cy="24" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="60" cy="26" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="72" cy="34" r="1.2" fill="currentColor" stroke="none" />
      {/* Lettuce frill. */}
      <path d="M12 50 C 16 46, 20 52, 24 49 C 28 52, 32 48, 36 51 C 40 48, 44 52, 48 49 C 52 52, 56 48, 60 51 C 64 48, 68 52, 72 49 C 76 52, 80 48, 84 51 C 88 48, 90 52, 88 50" />
      {/* Fillet disk — the fried fish. */}
      <path d="M16 62 C 22 56, 40 54, 50 54 C 62 54, 78 56, 84 62" />
      <path d="M16 62 C 24 66, 42 68, 50 68 C 62 68, 78 66, 84 62" />
      {/* Pickle slice glimpse on the right. */}
      <path d="M64 60 C 68 60, 70 62, 70 64" />
      {/* Bun bottom. */}
      <path d="M14 76 L 86 76" />
      <path d="M14 76 C 14 82, 26 86, 50 86 C 74 86, 86 82, 86 76" />
    </svg>
  );
}
