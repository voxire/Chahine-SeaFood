"use client";

import { useEffect } from "react";

/**
 * BackgroundShift — crossfades the page background between cream and
 * navy as sections with `data-bg="navy"` enter / leave the viewport.
 *
 * The shift happens on `document.documentElement` (the `<html>` tag)
 * so it covers every pixel, including the overscroll area at the top
 * of iOS Safari and the bottom of Android Chrome. Transition is CSS-
 * driven and applied once on mount; the observer only toggles the
 * target colour.
 *
 * How a section opts in
 * ─────────────────────
 * Mark its root element with `data-bg="navy"` AND render its own
 * container as `bg-transparent` so the HTML background shows
 * through. Example:
 *
 *   <section data-bg="navy" className="bg-transparent py-20">…</section>
 *
 * If multiple navy sections overlap on screen at the same time (can
 * happen with pinned scroll stages), the page stays navy — we just
 * count how many are currently intersecting and switch back to cream
 * when the count returns to zero.
 *
 * Reduced motion
 * ──────────────
 * The class toggle still runs (content depending on navy mode still
 * needs to flip), but the CSS transition timing is overridden to 0ms
 * under `@media (prefers-reduced-motion: reduce)` — declared in
 * globals.css.
 */
export function BackgroundShift() {
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("[data-bg='navy']");
    if (sections.length === 0) return;

    const html = document.documentElement;
    // Apply the transition once. Keep the duration here (not in
    // globals.css) so this component is the single source of truth —
    // if we tune timing, we do it in one file. `color` transitions too
    // so any body-text descendants that use `currentColor` stay in
    // sync with the background flip.
    const prevTransition = html.style.transition;
    html.style.transition =
      "background-color 800ms cubic-bezier(0.22, 1, 0.36, 1), color 800ms cubic-bezier(0.22, 1, 0.36, 1)";

    let navyInView = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) navyInView += 1;
          else navyInView = Math.max(0, navyInView - 1);
        }
        if (navyInView > 0) {
          html.classList.add("page-navy");
        } else {
          html.classList.remove("page-navy");
        }
      },
      {
        // Trigger when the section crosses into the middle band of
        // the viewport. Using a rootMargin shrink rather than a
        // threshold gives us a predictable "section is meaningfully
        // on screen" cue regardless of section height.
        rootMargin: "-25% 0px -25% 0px",
        threshold: 0,
      },
    );
    sections.forEach((s) => observer.observe(s));

    return () => {
      observer.disconnect();
      html.classList.remove("page-navy");
      html.style.transition = prevTransition;
    };
  }, []);

  return null;
}
