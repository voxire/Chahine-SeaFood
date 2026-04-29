"use client";

import clsx from "clsx";
import { useCallback, useEffect, useRef, useState } from "react";

import type { CategoryKey } from "@/data/categories";

type CategoryEntry = {
  slug: CategoryKey;
  label: string;
  count: number;
};

type Props = {
  categories: CategoryEntry[];
  /**
   * If set, the page lands with this category scrolled into view and
   * the rail/tab pre-highlighted. Wins over `window.location.hash`.
   */
  initialCategory?: CategoryKey;
  /**
   * The vertical offset (px) above which a section is considered "active".
   * Tunes how aggressively the active state flips as the user scrolls.
   * Defaults to a value that matches the navbar + sticky-tab heights.
   */
  activeOffsetPx?: number;
};

const NAVBAR_OFFSET = 72; // app navbar height
const MOBILE_TAB_OFFSET = 56; // sticky horizontal tab bar height
const SCROLL_PADDING = NAVBAR_OFFSET + MOBILE_TAB_OFFSET + 16;

/**
 * Twin-mode navigator for the unified menu page.
 *
 *  - On md+ it renders a sticky vertical rail (intended to be placed in a
 *    dedicated grid column on the page). Each entry: the category name
 *    in display caps + a small numeric count.
 *  - Below md it renders as a sticky horizontal pill bar at the top of
 *    the page (under the navbar). Horizontal-scrollable; the active pill
 *    auto-scrolls into view via `scrollIntoView({ inline: 'center' })`.
 *
 * Active-section tracking is done by an `IntersectionObserver` keyed on
 * each section's `data-category-section`. We pick the topmost intersecting
 * section (or, if multiple are intersecting, the one whose top is closest
 * to the SCROLL_PADDING line). When the user clicks a pill / rail entry
 * we set a `clickedRef` lock for ~600ms so the observer doesn't fight the
 * `scrollIntoView` animation.
 */
export function MenuNavigator({ categories, initialCategory }: Props) {
  const [active, setActive] = useState<CategoryKey | null>(
    initialCategory ?? categories[0]?.slug ?? null,
  );
  const clickedRef = useRef<{ slug: CategoryKey; until: number } | null>(null);
  const tabsRef = useRef<HTMLDivElement | null>(null);

  // ---------------------------------------------------------------------
  // Intersection observer — picks the active category as the user scrolls.
  // ---------------------------------------------------------------------
  useEffect(() => {
    if (typeof window === "undefined") return;
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-category-section]"),
    );
    if (sections.length === 0) return;

    const setIfNotLocked = (slug: CategoryKey) => {
      const lock = clickedRef.current;
      if (lock && Date.now() < lock.until) return;
      setActive(slug);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        // Of the currently-intersecting sections, pick the one closest to
        // the scroll-padding line.
        const intersecting = entries
          .filter((e) => e.isIntersecting)
          .map((e) => ({
            slug: e.target.getAttribute("data-category-section") as CategoryKey,
            top: e.boundingClientRect.top,
          }))
          .filter((e) => Boolean(e.slug));

        if (intersecting.length === 0) return;

        // Closest top above the SCROLL_PADDING line.
        const above = intersecting
          .filter((e) => e.top <= SCROLL_PADDING + 4)
          .sort((a, b) => b.top - a.top)[0];

        const winner =
          above ??
          intersecting.sort((a, b) => Math.abs(a.top - SCROLL_PADDING) - Math.abs(b.top - SCROLL_PADDING))[0];

        if (winner) setIfNotLocked(winner.slug);
      },
      {
        rootMargin: `-${SCROLL_PADDING}px 0px -55% 0px`,
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // ---------------------------------------------------------------------
  // Initial scroll target.
  //
  // Order of preference:
  //   1. `initialCategory` prop — set by `/menu/[category]` routes.
  //   2. `window.location.hash` — set by user clicking a nav link or
  //      sharing a URL fragment.
  //   3. Nothing — page lands at the top.
  // ---------------------------------------------------------------------
  useEffect(() => {
    if (typeof window === "undefined") return;

    const propTarget =
      initialCategory && categories.some((c) => c.slug === initialCategory)
        ? initialCategory
        : null;

    const hashRaw = window.location.hash.replace("#", "");
    const hashTarget =
      hashRaw && categories.some((c) => c.slug === hashRaw)
        ? (hashRaw as CategoryKey)
        : null;

    const target = propTarget ?? hashTarget;
    if (!target) return;

    const node = document.querySelector<HTMLElement>(
      `[data-category-section="${target}"]`,
    );
    if (!node) return;

    // Lock the active state for the smooth-scroll's duration so the
    // observer doesn't fight us.
    clickedRef.current = { slug: target, until: Date.now() + 800 };

    // Defer a tick so layout (sticky bars, fonts) is settled before
    // measuring.
    requestAnimationFrame(() => {
      const top =
        node.getBoundingClientRect().top +
        window.scrollY -
        SCROLL_PADDING +
        8;
      window.scrollTo({ top, behavior: "smooth" });
      setActive(target);
    });
  }, [initialCategory, categories]);

  // ---------------------------------------------------------------------
  // Auto-scroll the active mobile pill into view.
  // ---------------------------------------------------------------------
  useEffect(() => {
    const tabs = tabsRef.current;
    if (!tabs || !active) return;
    const btn = tabs.querySelector<HTMLAnchorElement>(
      `a[data-category-pill="${active}"]`,
    );
    if (!btn) return;
    btn.scrollIntoView({
      block: "nearest",
      inline: "center",
      behavior: "smooth",
    });
  }, [active]);

  const handleJump = useCallback(
    (slug: CategoryKey) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      const target = document.querySelector<HTMLElement>(
        `[data-category-section="${slug}"]`,
      );
      if (!target) return;

      // Lock active state to the clicked slug for the duration of the
      // smooth-scroll so the observer doesn't bounce us back.
      clickedRef.current = { slug, until: Date.now() + 700 };
      setActive(slug);

      const top =
        target.getBoundingClientRect().top + window.scrollY - SCROLL_PADDING + 8;
      window.scrollTo({ top, behavior: "smooth" });

      // Mirror to URL without re-rendering the page.
      if (typeof history !== "undefined") {
        history.replaceState(null, "", `#${slug}`);
      }
    },
    [],
  );

  return (
    <>
      {/* Mobile sticky horizontal pill bar */}
      <div
        className={clsx(
          "sticky z-30 -mx-6 mb-8 border-y border-cs-text/10 bg-cs-bg/95 backdrop-blur",
          "md:hidden",
        )}
        style={{ top: `${NAVBAR_OFFSET}px` }}
        aria-label="Menu sections"
      >
        <div
          ref={tabsRef}
          className={clsx(
            "no-scrollbar flex items-center gap-2 overflow-x-auto px-6 py-3",
          )}
        >
          {categories.map((c) => {
            const isActive = c.slug === active;
            return (
              <a
                key={c.slug}
                href={`#${c.slug}`}
                data-category-pill={c.slug}
                onClick={handleJump(c.slug)}
                className={clsx(
                  "inline-flex shrink-0 items-center gap-2 rounded-pill px-4 py-2",
                  "min-h-[40px] text-xs font-bold uppercase tracking-wider",
                  "transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cs-gold focus-visible:ring-offset-2 focus-visible:ring-offset-cs-bg",
                  isActive
                    ? "bg-cs-blue text-white"
                    : "bg-cs-surface-2 text-cs-text-muted hover:text-cs-blue-deep",
                )}
                aria-current={isActive ? "true" : undefined}
              >
                <span>{c.label}</span>
                <span
                  className={clsx(
                    "rounded-pill px-1.5 py-0.5 text-[10px] tabular-nums",
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-cs-bg text-cs-text-muted",
                  )}
                >
                  {c.count}
                </span>
              </a>
            );
          })}
        </div>
      </div>

      {/* Desktop sticky vertical rail */}
      <nav
        aria-label="Menu sections"
        className="hidden md:sticky md:top-[104px] md:block"
      >
        <ul className="flex flex-col gap-1 border-s border-cs-text/10 ps-4">
          {categories.map((c) => {
            const isActive = c.slug === active;
            return (
              <li key={c.slug}>
                <a
                  href={`#${c.slug}`}
                  onClick={handleJump(c.slug)}
                  aria-current={isActive ? "true" : undefined}
                  className={clsx(
                    "group relative flex items-center justify-between gap-3 py-2",
                    "transition-colors",
                    "focus-visible:outline-none",
                    isActive
                      ? "text-cs-blue-deep"
                      : "text-cs-text-muted hover:text-cs-blue-deep",
                  )}
                >
                  {/* Active marker — rides on the rail's left border */}
                  <span
                    aria-hidden
                    className={clsx(
                      "absolute -start-[17px] top-1/2 h-6 w-[2px] -translate-y-1/2 rounded-pill bg-cs-blue transition-opacity",
                      isActive ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <span
                    className={clsx(
                      "font-display text-sm font-black uppercase leading-tight tracking-wider",
                      "transition-transform",
                      isActive && "translate-x-0",
                    )}
                  >
                    {c.label}
                  </span>
                  <span
                    className={clsx(
                      "shrink-0 rounded-pill bg-cs-surface-2 px-2 py-0.5 text-[10px] font-bold tabular-nums",
                      isActive ? "text-cs-blue-deep" : "text-cs-text-muted",
                    )}
                  >
                    {c.count}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
