import type { SVGProps } from "react";

/**
 * Line-art mint sprig — central stem with five paired leaves, each with
 * a single spine vein. Skinny 80×120 viewBox so it can sit tucked against
 * the hero headline or dropped into SignatureDish callouts without
 * eating vertical space.
 */
export function MintSprig(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 80 120"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {/* Main stem — gently curved. */}
      <path d="M40 114 C 36 96, 42 70, 38 44 C 36 28, 40 16, 42 6" />

      {/* Leaf pair 1 (bottom) — largest. */}
      <path d="M38 92 C 22 88, 10 94, 12 104 C 22 108, 36 102, 38 92 Z" />
      <path d="M12 102 L 36 94" />
      <path d="M40 92 C 56 88, 68 94, 66 104 C 56 108, 42 102, 40 92 Z" />
      <path d="M66 102 L 42 94" />

      {/* Leaf pair 2. */}
      <path d="M37 70 C 24 66, 14 72, 16 80 C 26 84, 36 78, 37 70 Z" />
      <path d="M16 78 L 34 71" />
      <path d="M41 70 C 54 66, 64 72, 62 80 C 52 84, 42 78, 41 70 Z" />
      <path d="M62 78 L 44 71" />

      {/* Leaf pair 3. */}
      <path d="M38 48 C 28 44, 20 50, 22 56 C 30 60, 38 54, 38 48 Z" />
      <path d="M22 54 L 36 49" />
      <path d="M40 48 C 50 44, 58 50, 56 56 C 48 60, 40 54, 40 48 Z" />
      <path d="M56 54 L 42 49" />

      {/* Leaf pair 4. */}
      <path d="M39 28 C 32 24, 26 28, 28 34 C 34 36, 40 32, 39 28 Z" />
      <path d="M28 33 L 38 29" />
      <path d="M41 28 C 48 24, 54 28, 52 34 C 46 36, 40 32, 41 28 Z" />
      <path d="M52 33 L 42 29" />

      {/* Top leaf (single, small). */}
      <path d="M40 10 C 34 8, 32 14, 36 18 C 42 16, 44 12, 40 10 Z" />
    </svg>
  );
}
