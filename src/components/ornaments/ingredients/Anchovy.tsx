import type { SVGProps } from "react";

/**
 * Line-art anchovy silhouette — stroke-only so it inherits colour via
 * `currentColor`. Used as a hero garnish fly-in (§motion-spec §6.1).
 * ViewBox 0 0 120 40 keeps the sketchy, wide-body proportions small
 * enough to park in hero margins without fighting the headline.
 */
export function Anchovy(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 120 40"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {/* Body — teardrop with a blunt head on the right, tapering to a
          forked tail on the left. */}
      <path d="M108 20 C 96 6, 66 4, 38 8 C 20 11, 8 16, 4 20 C 8 24, 20 29, 38 32 C 66 36, 96 34, 108 20 Z" />
      {/* Tail fork (left side). */}
      <path d="M4 20 L 0 10" />
      <path d="M4 20 L 0 30" />
      {/* Eye — tiny dot near the head. */}
      <circle cx="100" cy="18" r="1.2" fill="currentColor" stroke="none" />
      {/* Gill line. */}
      <path d="M93 12 C 91 16, 91 24, 93 28" />
      {/* Lateral stripe. */}
      <path d="M18 21 C 40 19, 70 19, 94 21" strokeDasharray="1 3" />
      {/* Top fin. */}
      <path d="M56 8 C 60 2, 72 2, 76 8" />
      {/* Bottom fin. */}
      <path d="M44 32 C 48 38, 60 38, 64 32" />
    </svg>
  );
}
