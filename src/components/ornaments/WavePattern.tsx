import clsx from "clsx";

type Props = {
  className?: string;
};

/**
 * Inline version of `public/patterns/wave.svg`. Inlining lets the SVG inherit
 * `currentColor` from its React parent — so theme-aware tinting works without
 * generating color variants of the file. The asset is also kept as a file in
 * public/ for places (OG images, PDF exports) where inlining isn't possible.
 */
export function WavePattern({ className }: Props) {
  return (
    <svg
      viewBox="0 0 2400 1000"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      aria-hidden
      className={clsx("select-none", className)}
    >
      <path opacity={0.7}  d="M 0 140 Q 300 100 600 140 T 1200 140 T 1800 140 T 2400 140" />
      <path opacity={0.5}  d="M 0 280 Q 300 320 600 280 T 1200 280 T 1800 280 T 2400 280" />
      <path opacity={0.6}  d="M 0 420 Q 300 380 600 420 T 1200 420 T 1800 420 T 2400 420" />
      <path opacity={0.45} d="M 0 560 Q 300 600 600 560 T 1200 560 T 1800 560 T 2400 560" />
      <path opacity={0.55} d="M 0 700 Q 300 660 600 700 T 1200 700 T 1800 700 T 2400 700" />
      <path opacity={0.35} d="M 0 840 Q 300 880 600 840 T 1200 840 T 1800 840 T 2400 840" />
    </svg>
  );
}
