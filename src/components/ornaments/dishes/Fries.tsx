import type { SVGProps } from "react";

/**
 * Line-art fries carton — the add-ons / sides category glyph. Red-
 * striped carton hint via dashed stripes, fries fanning upward.
 */
export function Fries(props: SVGProps<SVGSVGElement>) {
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
      {/* Carton body — trapezoidal. */}
      <path d="M14 50 L 20 94 C 26 96, 54 96, 60 94 L 66 50" />
      {/* Carton rim. */}
      <path d="M12 50 L 68 50" />
      <path d="M14 56 L 66 56" opacity={0.5} />
      {/* Carton stripe hints. */}
      <path d="M22 64 L 22 90" strokeDasharray="2 3" opacity={0.5} />
      <path d="M40 66 L 40 92" strokeDasharray="2 3" opacity={0.5} />
      <path d="M58 64 L 58 90" strokeDasharray="2 3" opacity={0.5} />
      {/* Fries rising out of the carton — vertical sticks. */}
      <path d="M22 50 L 22 18" />
      <path d="M30 50 L 30 10" />
      <path d="M38 50 L 38 14" />
      <path d="M46 50 L 46 6" />
      <path d="M54 50 L 54 12" />
      <path d="M62 50 L 62 22" />
      {/* Tips. */}
      <path d="M20 18 L 24 18" opacity={0.6} />
      <path d="M28 10 L 32 10" opacity={0.6} />
      <path d="M44 6 L 48 6" opacity={0.6} />
    </svg>
  );
}
