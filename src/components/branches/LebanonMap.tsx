"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { CSSProperties } from "react";

import { branches, type Branch } from "@/data/branches";
import { LEBANON_VIEWBOX, projectToLebanon } from "@/lib/geo";

/**
 * Silhouette of mainland Lebanon — recognisable at a glance while still
 * a stylisation (not cartography). Authored directly in the 300×480
 * viewBox along real-coast anchor points projected from the same
 * LEBANON_BBOX we use for branch pins, so the ten Chahine locations all
 * land on landmass when projected via `src/lib/geo.ts`.
 *
 * Clockwise from the south-west corner (Naqoura):
 *   SW → Tyre → Saida → Beirut peninsula → Jounieh → Byblos → Batroun
 *     → Tripoli → Akkar cape → N border → Hermel → Anti-Lebanon ridge
 *     → Bekaa east → south-east → south border → close
 */
const LEBANON_PATH =
  "M 7 463 " +
  "C 18 430, 28 380, 40 345 " +
  "C 50 320, 62 290, 72 268 " +
  "C 76 240, 74 216, 80 195 " +
  "C 94 162, 106 128, 128 88 " +
  "C 144 62, 160 38, 172 22 " +
  "C 200 15, 235 18, 268 30 " +
  "C 280 40, 282 54, 276 66 " +
  "C 264 86, 254 100, 248 116 " +
  "C 246 146, 248 172, 244 198 " +
  "C 238 224, 228 248, 216 268 " +
  "C 208 294, 198 318, 184 338 " +
  "C 168 362, 148 384, 122 404 " +
  "C 92 428, 52 452, 7 463 Z";

/**
 * Faint Mediterranean ripple lines drawn off the western coast. Purely
 * decorative — adds visual texture to the cream "sea" area without
 * competing with the silhouette itself.
 */
const SEA_LINES: readonly { d: string; opacity: number }[] = [
  { d: "M -6 380 C 6 378, 20 384, 32 380", opacity: 0.22 },
  { d: "M -6 340 C 8 338, 22 344, 34 340", opacity: 0.18 },
  { d: "M -6 300 C 10 298, 24 304, 36 300", opacity: 0.16 },
  { d: "M -6 260 C 12 258, 26 264, 38 260", opacity: 0.14 },
  { d: "M -6 220 C 14 218, 28 224, 40 220", opacity: 0.12 },
  { d: "M -6 180 C 16 178, 32 184, 46 180", opacity: 0.1 },
  { d: "M -6 140 C 18 138, 34 144, 52 140", opacity: 0.09 },
];

const ATTRIBUTION_MARGIN = 12;

export type LebanonMapProps = {
  /**
   * Slug of the branch to highlight with a pulsing gold ring. Usually
   * set to the user's nearest branch once geolocation resolves.
   */
  highlightSlug?: string | null;
  /**
   * Localized branch names, keyed by slug. Rendered inside each dot's
   * `<title>` for screen-reader access and as the tooltip on hover.
   */
  branchNames: Record<string, string>;
  /**
   * Fired when a dot is clicked — used by the parent section to scroll
   * the branch card row into view or to open a popup.
   */
  onBranchSelect?: (slug: string) => void;
  className?: string;
  style?: CSSProperties;
};

/**
 * The decorative Lebanon silhouette with 10 positioned branch dots.
 * Rendered as inline SVG so every dot is a real hover/focus target and
 * so the whole thing inherits brand colours from `currentColor`.
 *
 * Layout & a11y:
 *   - The silhouette is aria-hidden (it's decorative).
 *   - Each dot is a `<button>`-equivalent `<g>` with `role="button"`,
 *     `tabIndex=0`, a `<title>` for a tooltip, and keyboard support.
 *   - Highlighted branch gets a pulsing ring via Framer Motion. Under
 *     reduced motion, the pulse collapses to a static ring.
 */
export function LebanonMap({
  highlightSlug,
  branchNames,
  onBranchSelect,
  className,
  style,
}: LebanonMapProps) {
  const shouldReduce = useReducedMotion();
  const { width, height } = LEBANON_VIEWBOX;

  return (
    <svg
      viewBox={`0 0 ${width} ${height + ATTRIBUTION_MARGIN}`}
      role="img"
      aria-label="Chahine Seafood branches across Lebanon"
      className={className}
      style={style}
    >
      {/* Sea ripples — faint horizontal curves off the west coast. */}
      <g aria-hidden fill="none" stroke="var(--cs-blue)" strokeWidth={0.6} strokeLinecap="round">
        {SEA_LINES.map((line) => (
          <path key={line.d} d={line.d} opacity={line.opacity} />
        ))}
      </g>

      {/* Landmass — cream fill with navy coast stroke. */}
      <g aria-hidden>
        <path
          d={LEBANON_PATH}
          fill="var(--cs-surface)"
          stroke="var(--cs-blue-deep)"
          strokeWidth={1.5}
          strokeLinejoin="round"
          opacity={0.95}
        />
        {/* Inner mountain-range hint — a faint ridge following the coast
            spine of Lebanon (the Mount Lebanon range parallels the coast
            about 20–30km inland). */}
        <path
          d="M 58 330 C 80 300, 108 240, 130 180 C 150 130, 170 80, 186 40"
          fill="none"
          stroke="var(--cs-blue)"
          strokeWidth={0.8}
          strokeLinecap="round"
          strokeDasharray="2 3"
          opacity={0.35}
        />
        {/* Anti-Lebanon ridge (eastern inner mountain). */}
        <path
          d="M 210 260 C 220 220, 232 170, 238 120"
          fill="none"
          stroke="var(--cs-blue)"
          strokeWidth={0.8}
          strokeLinecap="round"
          strokeDasharray="2 3"
          opacity={0.3}
        />
      </g>

      {/* Branch pins. Rendered after the landmass so they sit on top. */}
      {branches.map((b) => renderPin(b, {
        highlight: b.slug === highlightSlug,
        label: branchNames[b.slug] ?? b.slug,
        onSelect: onBranchSelect,
        reduce: !!shouldReduce,
      }))}
    </svg>
  );
}

type PinState = {
  highlight: boolean;
  label: string;
  onSelect?: (slug: string) => void;
  reduce: boolean;
};

function renderPin(branch: Branch, state: PinState) {
  const { x, y } = projectToLebanon(branch.geo.lat, branch.geo.lng);
  const { highlight, label, onSelect, reduce } = state;

  // Base dot radius + highlight ring radius — larger for the nearest
  // branch so it reads without relying on the pulse alone.
  const r = highlight ? 7 : 5;

  return (
    <g
      key={branch.slug}
      role="button"
      tabIndex={0}
      aria-label={label}
      onClick={() => onSelect?.(branch.slug)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect?.(branch.slug);
        }
      }}
      className="cursor-pointer outline-none focus-visible:[&_circle]:stroke-cs-blue-deep"
      style={{ transform: `translate(${x}px, ${y}px)` }}
    >
      <title>{label}</title>

      {/* Static halo — sits behind the pulse to give the dot weight. */}
      <circle
        r={r + 4}
        fill="var(--cs-gold-soft)"
        opacity={highlight ? 0.35 : 0.15}
      />

      {/* Pulsing ring — only for the highlighted branch. */}
      {highlight && !reduce && (
        <motion.circle
          r={r + 4}
          fill="none"
          stroke="var(--cs-gold)"
          strokeWidth={1.5}
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{ scale: 1.9, opacity: 0 }}
          transition={{
            duration: 1.8,
            ease: "easeOut",
            repeat: Infinity,
            repeatDelay: 0.1,
          }}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        />
      )}

      {/* Dot itself — gold on cream with deep-navy outline for contrast. */}
      <circle
        r={r}
        fill={highlight ? "var(--cs-gold)" : "var(--cs-gold-soft)"}
        stroke="var(--cs-blue-deep)"
        strokeWidth={1}
      />
    </g>
  );
}
