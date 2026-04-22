import type { SVGProps } from "react";

/**
 * Line-art whole fish silhouette — the "seafood by weight" glyph and a
 * generic fallback for any fish-card placeholder. Distinct from the
 * anchovy ornament: this is taller, with a clear dorsal fin and a
 * larger tail so it reads at small sizes in menu category tiles.
 */
export function Fish(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 120 60"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {/* Body — almond shape, blunt head right. */}
      <path d="M96 30 C 86 12, 56 10, 30 16 C 16 20, 6 26, 2 30 C 6 34, 16 40, 30 44 C 56 50, 86 48, 96 30 Z" />
      {/* Tail fork. */}
      <path d="M96 30 L 118 12" />
      <path d="M96 30 L 118 48" />
      <path d="M118 12 L 108 30 L 118 48" opacity={0.7} />
      {/* Dorsal fin. */}
      <path d="M40 14 C 48 4, 68 4, 78 14" />
      {/* Gill line. */}
      <path d="M80 20 C 78 24, 78 36, 80 40" />
      {/* Eye. */}
      <circle cx="88" cy="26" r="1.6" fill="currentColor" stroke="none" />
      {/* Scales. */}
      <path d="M28 30 C 36 28, 44 28, 52 30" strokeDasharray="1 3" opacity={0.6} />
      <path d="M28 36 C 36 38, 44 38, 52 36" strokeDasharray="1 3" opacity={0.6} />
    </svg>
  );
}
