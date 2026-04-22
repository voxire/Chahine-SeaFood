import type { SVGProps } from "react";

/**
 * Line-art lemon slice — a round cut with six radial wedges, pith ring,
 * and rind notches. Used as a garnish fly-in paired with shrimp and
 * anchovy in the hero (§motion-spec §6.1). Stroke-only with
 * `currentColor`; we let Framer Motion wrappers sit around it to do the
 * fly + rotate entry.
 */
export function LemonSlice(props: SVGProps<SVGSVGElement>) {
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
      {/* Outer rind. */}
      <circle cx="50" cy="50" r="42" />
      {/* Inner pith ring. */}
      <circle cx="50" cy="50" r="36" strokeDasharray="2 3" />
      {/* Wedge membrane. */}
      <circle cx="50" cy="50" r="30" />
      {/* Six wedge spokes — 60° apart. */}
      <path d="M50 20 L 50 80" />
      <path d="M24 35 L 76 65" />
      <path d="M24 65 L 76 35" />
      {/* Central pith dot. */}
      <circle cx="50" cy="50" r="2.5" fill="currentColor" stroke="none" />
      {/* Seed-like nicks along the rind edge (four marks). */}
      <path d="M50 16 L 50 20" />
      <path d="M84 50 L 80 50" />
      <path d="M50 84 L 50 80" />
      <path d="M16 50 L 20 50" />
    </svg>
  );
}
