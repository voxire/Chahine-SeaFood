"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";

import { branches, type Branch } from "@/data/branches";
import { LEBANON_VIEWBOX, projectToLebanon } from "@/lib/geo";
import { BranchPopup, type BranchPopupContent } from "./BranchPopup";

/**
 * Silhouette of mainland Lebanon — real country boundary, not a stylisation.
 * Derived from the mledoze/countries public-domain GeoJSON dataset
 * (https://github.com/mledoze/countries — Unlicense / ODbL-compatible) and
 * projected into the 300×480 viewBox via the same `projectToLebanon` linear
 * projection used for branch pins in `src/lib/geo.ts`, so the ten Chahine
 * locations all land on landmass.
 *
 * Generation (reproducible):
 *   curl -sL https://raw.githubusercontent.com/mledoze/countries/master/data/lbn.geo.json
 *     | python3 -c "<project each [lng,lat] pair through projectToLebanon
 *                   and emit 'M x y L x y ... Z' rounded to 2dp>"
 *
 * 172 vertices — enough to show Akkar's northern cape, the western coast's
 * concavity around Jounieh, and the full Bekaa / Anti-Lebanon border with
 * Syria on the east.
 */
const LEBANON_PATH =
  "M 104.46 418.73 L 97.27 411.76 L 89.15 430.53 L 89.26 434.87 L 86.37 451.91 L 85.85 452.86 L 85.32 453.41 L 82.23 455.86 L 82.23 459.57 L 82.02 461.78 L 67.61 468.96 L 66.56 469.27 L 58.33 470.85 L 57.81 470.93 L 53.72 470.93 L 52.67 470.61 L 47.54 463.51 L 36.79 460.51 L 7.44 461.38 L 5.82 461.93 L 13.52 451.36 L 22.33 436.61 L 25.1 429.11 L 25.68 424.62 L 26.31 417.67 L 28.35 401.82 L 36.43 367.65 L 38.36 359.53 L 40.62 357.08 L 43.34 354.79 L 43.92 354.24 L 46.02 351.72 L 49.0 347.69 L 53.82 339.33 L 54.19 338.46 L 58.93 321.56 L 61.32 308.33 L 65.46 293.02 L 70.13 277.87 L 74.21 268.72 L 75.63 265.96 L 76.78 262.8 L 77.46 259.25 L 77.93 255.47 L 78.09 252.23 L 78.09 246.39 L 77.99 243.16 L 77.83 242.76 L 75.26 234.08 L 75.16 233.53 L 75.47 232.03 L 77.51 230.61 L 78.35 230.61 L 79.61 230.61 L 85.59 230.85 L 90.21 232.43 L 94.23 230.93 L 95.44 229.19 L 96.7 226.82 L 106.5 200.87 L 109.01 176.49 L 108.75 172.47 L 107.65 166.63 L 107.34 165.13 L 106.55 164.1 L 105.5 163.47 L 104.72 162.6 L 104.77 160.79 L 105.34 148.17 L 105.61 146.51 L 106.29 145.4 L 108.73 142.81 L 109.12 125.45 L 109.33 123.87 L 113.1 115.74 L 113.31 115.35 L 141.35 81.97 L 156.71 70.46 L 172.22 55.15 L 172.54 54.2 L 173.79 47.97 L 173.95 46.23 L 174.0 43.0 L 173.48 32.82 L 172.64 28.64 L 170.33 20.59 L 180.24 24.77 L 182.34 24.93 L 191.98 24.46 L 196.49 23.27 L 197.09 22.87 L 198.22 21.54 L 198.74 21.54 L 231.81 22.17 L 246.49 22.88 L 261.74 23.91 L 262.26 24.06 L 262.26 26.9 L 261.16 35.11 L 260.64 36.06 L 250.47 47.02 L 244.18 51.68 L 241.74 62.27 L 256.6 61.93 L 261.21 64.93 L 274.69 81.82 L 278.62 106.75 L 287.21 139.33 L 287.73 140.04 L 293.16 146.27 L 273.01 174.05 L 250.47 194.87 L 241.56 205.29 L 238.42 209.63 L 236.27 213.57 L 228.93 227.85 L 228.62 229.82 L 229.14 230.77 L 236.84 238.9 L 238.42 239.21 L 241.04 238.42 L 242.61 238.19 L 243.61 238.5 L 244.65 239.29 L 248.27 243.95 L 248.79 244.66 L 249.27 245.84 L 248.95 249.15 L 248.43 250.34 L 246.8 252.31 L 245.23 253.49 L 243.66 253.73 L 242.14 253.65 L 220.91 245.29 L 189.07 253.4 L 188.68 253.57 L 178.72 269.9 L 170.54 283.63 L 169.5 285.44 L 163.0 302.57 L 163.21 305.01 L 164.78 307.06 L 165.78 307.61 L 166.82 307.46 L 169.44 306.2 L 170.44 306.27 L 180.29 312.66 L 185.95 319.29 L 187.0 321.58 L 186.64 323.95 L 181.97 331.36 L 163.05 355.98 L 155.29 364.89 L 154.24 366.0 L 152.15 367.58 L 147.55 370.0 L 143.87 372.39 L 142.82 373.49 L 142.35 374.28 L 141.82 375.78 L 141.3 378.07 L 140.78 383.2 L 140.25 385.17 L 139.73 386.04 L 136.64 388.95 L 135.22 389.9 L 131.97 391.64 L 106.24 408.84 L 105.35 409.64 L 104.66 410.26 L 103.88 411.42 L 104.46 418.73 Z";

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
const HOVER_OPEN_DELAY_MS = 120;
const HOVER_CLOSE_DELAY_MS = 180;

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
   * Pre-resolved popup content, keyed by slug. When present, each pin
   * gets hover/tap-to-open popup behaviour. Omit to render a plain map.
   */
  branchPopups?: Record<string, BranchPopupContent>;
  /**
   * Fired when a dot is clicked — used by the parent section to scroll
   * the branch card row into view or to open a popup.
   */
  onBranchSelect?: (slug: string) => void;
  className?: string;
  style?: CSSProperties;
};

/**
 * Active-popup state stored in pixel coordinates relative to the wrapper
 * div. We compute these from the pin `<g>`'s `getBoundingClientRect()`
 * at hover/tap time so the card anchors precisely above the dot even as
 * the SVG scales with its container.
 */
type ActivePopup = {
  slug: string;
  x: number;
  y: number;
};

/**
 * The Lebanon silhouette with 10 positioned branch dots. Rendered as
 * inline SVG so every dot is a real hover/focus target and inherits
 * brand colours from `currentColor`. When `branchPopups` is provided,
 * an HTML popup card appears above the hovered/tapped pin.
 *
 * Layout & a11y:
 *   - The silhouette is aria-hidden (it's decorative).
 *   - Each dot is a `<g>` with `role="button"`, `tabIndex=0`, a `<title>`
 *     for a tooltip, and keyboard support.
 *   - Highlighted branch gets a pulsing ring via Framer Motion. Under
 *     reduced motion, the pulse collapses to a static ring.
 *   - Popup dismisses on outside click, on Escape, and on pointer-leave
 *     (after a small grace period so the user can move into the card).
 */
export function LebanonMap({
  highlightSlug,
  branchNames,
  branchPopups,
  onBranchSelect,
  className,
  style,
}: LebanonMapProps) {
  const shouldReduce = useReducedMotion();
  const { width, height } = LEBANON_VIEWBOX;

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const openTimerRef = useRef<number | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const [active, setActive] = useState<ActivePopup | null>(null);

  const clearTimers = useCallback(() => {
    if (openTimerRef.current !== null) {
      window.clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const computePopupCoords = useCallback(
    (pinEl: SVGGElement): { x: number; y: number } | null => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return null;
      const pinRect = pinEl.getBoundingClientRect();
      const wrapperRect = wrapper.getBoundingClientRect();
      // Anchor at the horizontal centre + vertical top of the pin, so
      // the popup's bottom-centre (translated -100% / -50%) sits just
      // above the dot.
      return {
        x: pinRect.left - wrapperRect.left + pinRect.width / 2,
        y: pinRect.top - wrapperRect.top,
      };
    },
    [],
  );

  const openPopup = useCallback(
    (slug: string, pinEl: SVGGElement) => {
      const coords = computePopupCoords(pinEl);
      if (!coords) return;
      setActive({ slug, x: coords.x, y: coords.y });
    },
    [computePopupCoords],
  );

  const scheduleOpen = useCallback(
    (slug: string, pinEl: SVGGElement) => {
      clearTimers();
      openTimerRef.current = window.setTimeout(() => {
        openPopup(slug, pinEl);
      }, HOVER_OPEN_DELAY_MS);
    },
    [clearTimers, openPopup],
  );

  const scheduleClose = useCallback(() => {
    if (openTimerRef.current !== null) {
      window.clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
    closeTimerRef.current = window.setTimeout(() => {
      setActive(null);
    }, HOVER_CLOSE_DELAY_MS);
  }, []);

  const cancelClose = useCallback(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  // Outside-click + Escape to dismiss.
  useEffect(() => {
    if (!active) return;
    const onDocPointerDown = (ev: PointerEvent) => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      if (!wrapper.contains(ev.target as Node)) {
        clearTimers();
        setActive(null);
      }
    };
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") {
        clearTimers();
        setActive(null);
      }
    };
    document.addEventListener("pointerdown", onDocPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDocPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [active, clearTimers]);

  // Clean up any pending timers when the component unmounts.
  useEffect(() => {
    return () => {
      if (openTimerRef.current !== null) window.clearTimeout(openTimerRef.current);
      if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current);
    };
  }, []);

  const popupsEnabled = !!branchPopups;

  const handlePinPointerEnter = useCallback(
    (slug: string) => (e: ReactPointerEvent<SVGGElement>) => {
      if (!popupsEnabled) return;
      // Only hover-open for mouse/pen — touch opens on tap via onClick.
      if (e.pointerType === "touch") return;
      cancelClose();
      scheduleOpen(slug, e.currentTarget);
    },
    [popupsEnabled, cancelClose, scheduleOpen],
  );

  const handlePinPointerLeave = useCallback(
    (e: ReactPointerEvent<SVGGElement>) => {
      if (!popupsEnabled) return;
      if (e.pointerType === "touch") return;
      scheduleClose();
    },
    [popupsEnabled, scheduleClose],
  );

  const handlePinClick = useCallback(
    (slug: string) => (e: ReactPointerEvent<SVGGElement>) => {
      onBranchSelect?.(slug);
      if (!popupsEnabled) return;
      // Tap to toggle — if this slug is already open, close; otherwise open.
      clearTimers();
      if (active?.slug === slug) {
        setActive(null);
      } else {
        openPopup(slug, e.currentTarget);
      }
    },
    [popupsEnabled, active, onBranchSelect, clearTimers, openPopup],
  );

  const handlePinKeyDown = useCallback(
    (slug: string) => (e: React.KeyboardEvent<SVGGElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onBranchSelect?.(slug);
        if (!popupsEnabled) return;
        clearTimers();
        if (active?.slug === slug) {
          setActive(null);
        } else {
          openPopup(slug, e.currentTarget);
        }
      } else if (e.key === "Escape") {
        setActive(null);
      }
    },
    [popupsEnabled, active, onBranchSelect, clearTimers, openPopup],
  );

  const activeContent = active && branchPopups ? branchPopups[active.slug] ?? null : null;

  return (
    <div
      ref={wrapperRef}
      className={className}
      style={{ position: "relative", ...(style ?? {}) }}
    >
      <svg
        viewBox={`0 0 ${width} ${height + ATTRIBUTION_MARGIN}`}
        role="img"
        aria-label="Chahine Seafood branches across Lebanon"
        className="block h-auto w-full"
      >
        {/* Sea ripples — faint horizontal curves off the west coast. */}
        <g aria-hidden fill="none" stroke="var(--cs-blue)" strokeWidth={0.6} strokeLinecap="round">
          {SEA_LINES.map((line) => (
            <path key={line.d} d={line.d} opacity={line.opacity} />
          ))}
        </g>

        {/* Landmass — warm banded fill with navy coast stroke. */}
        <g aria-hidden>
          <path
            d={LEBANON_PATH}
            fill="var(--cs-surface-2)"
            stroke="var(--cs-blue-deep)"
            strokeWidth={2.25}
            strokeLinejoin="round"
            opacity={1}
          />
          {/* Mount Lebanon range hint. */}
          <path
            d="M 115 395 C 135 300, 150 200, 175 95"
            fill="none"
            stroke="var(--cs-blue)"
            strokeWidth={0.8}
            strokeLinecap="round"
            strokeDasharray="2 3"
            opacity={0.35}
          />
          {/* Anti-Lebanon ridge. */}
          <path
            d="M 218 350 C 245 270, 262 175, 275 110"
            fill="none"
            stroke="var(--cs-blue)"
            strokeWidth={0.8}
            strokeLinecap="round"
            strokeDasharray="2 3"
            opacity={0.3}
          />
        </g>

        {/* Branch pins. Rendered after the landmass so they sit on top. */}
        {branches.map((b) =>
          renderPin(b, {
            highlight: b.slug === highlightSlug,
            label: branchNames[b.slug] ?? b.slug,
            reduce: !!shouldReduce,
            onPointerEnter: handlePinPointerEnter(b.slug),
            onPointerLeave: handlePinPointerLeave,
            onClick: handlePinClick(b.slug),
            onKeyDown: handlePinKeyDown(b.slug),
            popupActive: !!active && active.slug === b.slug && !!branchPopups,
          }),
        )}
      </svg>

      {/* Popup layer — absolutely positioned inside the wrapper so its
          coordinates match the pin rects we compute above. */}
      <AnimatePresence>
        {active && activeContent && (
          <BranchPopup
            key={active.slug}
            content={activeContent}
            x={active.x}
            y={active.y}
            onPointerEnter={cancelClose}
            onPointerLeave={scheduleClose}
            onClose={() => {
              clearTimers();
              setActive(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

type PinState = {
  highlight: boolean;
  label: string;
  reduce: boolean;
  popupActive: boolean;
  onPointerEnter?: (e: ReactPointerEvent<SVGGElement>) => void;
  onPointerLeave?: (e: ReactPointerEvent<SVGGElement>) => void;
  onClick?: (e: ReactPointerEvent<SVGGElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<SVGGElement>) => void;
};

function renderPin(branch: Branch, state: PinState) {
  const { x, y } = projectToLebanon(branch.geo.lat, branch.geo.lng);
  const { highlight, label, reduce, popupActive, onPointerEnter, onPointerLeave, onClick, onKeyDown } = state;

  // Base dot radius + highlight ring radius — larger for the nearest
  // branch so it reads without relying on the pulse alone.
  const r = highlight ? 7 : 5;

  return (
    <g
      key={branch.slug}
      role="button"
      tabIndex={0}
      aria-label={label}
      aria-expanded={popupActive}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onClick={onClick}
      onKeyDown={onKeyDown}
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

      {/* Dot itself. */}
      <circle
        r={r}
        fill="var(--cs-gold)"
        stroke="var(--cs-blue-deep)"
        strokeWidth={1.75}
      />
    </g>
  );
}
