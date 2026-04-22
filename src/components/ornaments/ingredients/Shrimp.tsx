import type { SVGProps } from "react";

/**
 * Line-art curled shrimp — the signature protein on Chahine's menu.
 * Drawn as a C-curve with segmented shell bands, whisker antennae, and
 * a splayed fan tail. Stroke inherits `currentColor` so it can take the
 * cobalt-on-cream palette in light mode and the blue-deep reversal on
 * dark without edit.
 */
export function Shrimp(props: SVGProps<SVGSVGElement>) {
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
      {/* Body curl — C shape, opening to the right. */}
      <path d="M72 22 C 42 14, 18 32, 18 56 C 18 78, 40 90, 62 84" />
      {/* Outer body contour (second curve creating thickness). */}
      <path d="M76 34 C 52 26, 32 40, 32 56 C 32 74, 48 82, 60 78" />
      {/* Segment bands across the belly. */}
      <path d="M30 44 L 38 48" />
      <path d="M26 52 L 34 56" />
      <path d="M26 62 L 34 64" />
      <path d="M30 70 L 40 72" />
      {/* Head cap + eye. */}
      <path d="M72 22 C 78 18, 86 20, 88 28 C 86 32, 80 32, 76 30" />
      <circle cx="82" cy="24" r="1.2" fill="currentColor" stroke="none" />
      {/* Antennae — two long sweeping whiskers. */}
      <path d="M88 22 C 96 14, 98 8, 94 2" />
      <path d="M86 28 C 96 30, 98 24, 96 18" />
      {/* Tail fan — three splayed rays. */}
      <path d="M62 84 L 78 94" />
      <path d="M62 84 L 72 96" />
      <path d="M62 84 L 62 96" />
      <path d="M62 84 L 52 96" />
    </svg>
  );
}
