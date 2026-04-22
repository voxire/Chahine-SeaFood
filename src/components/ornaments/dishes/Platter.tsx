import type { SVGProps } from "react";

/**
 * Line-art platter — oval plate with three items arranged: a shrimp
 * curled on the left, a fillet centre, a wedge of lemon on the right.
 * Deliberately schematic so it reads at 80–120px and doesn't look
 * "trying to be" a photograph.
 */
export function Platter(props: SVGProps<SVGSVGElement>) {
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
      {/* Plate rim — wide oval. */}
      <ellipse cx="60" cy="40" rx="54" ry="28" />
      {/* Inner rim ring. */}
      <ellipse cx="60" cy="40" rx="48" ry="24" opacity={0.5} />
      {/* Shrimp curl (left). */}
      <path d="M28 36 C 22 32, 22 44, 28 46 C 34 48, 40 44, 42 40 C 40 36, 34 34, 28 36 Z" />
      <path d="M26 34 L 22 30" />
      {/* Fillet centre — long rounded rectangle. */}
      <path d="M50 34 C 56 32, 66 32, 72 34 C 74 38, 74 42, 72 46 C 66 48, 56 48, 50 46 C 48 42, 48 38, 50 34 Z" />
      <path d="M52 40 L 70 40" strokeDasharray="2 2" opacity={0.6} />
      {/* Lemon wedge (right). */}
      <path d="M86 32 L 100 40 L 86 48 Z" />
      <path d="M88 40 L 96 40" opacity={0.6} />
      <path d="M92 36 L 92 44" opacity={0.6} />
    </svg>
  );
}
