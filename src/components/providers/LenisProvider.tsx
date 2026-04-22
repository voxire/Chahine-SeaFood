"use client";

import { useEffect, type ReactNode } from "react";

/**
 * Lenis smooth-scroll provider.
 *
 * Per CLAUDE.md §2 & §10.1:
 *   - Lenis is the only smooth-scroll dep (no GSAP ScrollTrigger plugin).
 *   - It must respect `prefers-reduced-motion: reduce` (no instantiation).
 *   - Desktop-only by default — coarse-pointer devices fall back to native
 *     scroll so momentum, overscroll, and keyboard accessibility all stay
 *     OS-standard on phones/tablets. The intent is to re-test on mobile
 *     once we've tuned the runway scenes (§Phase 1 sign-off note).
 *
 * Implementation notes:
 *   - Dynamically imports `lenis` so the module isn't in the initial
 *     server-rendered bundle and only ships when this provider actually
 *     runs in the browser.
 *   - Uses the native `requestAnimationFrame` raf loop pattern that Lenis
 *     documents as its canonical driver.
 *   - Cleans up fully on unmount — destroys the Lenis instance and
 *     cancels the raf so HMR and locale-toggle don't stack listeners.
 *   - Sets `html.cs-lenis-on` while active so global CSS can branch if
 *     needed (e.g. to disable `scroll-behavior: smooth` that would fight
 *     Lenis on anchor jumps). The rule is applied in globals.css.
 */
export function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Respect reduced-motion: skip Lenis entirely, keep native scroll.
    const mediaReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaReduce.matches) return;

    // Desktop only — coarse pointers (touch) stay on native scroll.
    const mediaCoarse = window.matchMedia("(pointer: coarse)");
    if (mediaCoarse.matches) return;

    const html = document.documentElement;
    let rafId = 0;
    let cancelled = false;
    // `lenis` default export — captured so cleanup can destroy it.
    let instance: { raf: (t: number) => void; destroy: () => void } | null = null;

    (async () => {
      const { default: Lenis } = await import("lenis");
      if (cancelled) return;

      instance = new Lenis({
        // Duration the scroll eases over per wheel-tick, in seconds.
        // 1.1 feels close to frieslab's hand — present but never laggy.
        duration: 1.1,
        // Easing curve — same as --cs-ease (cubic-bezier(0.22, 1, 0.36, 1))
        // so page transitions and Lenis share one motion vocabulary.
        easing: (t: number) => 1 - Math.pow(1 - t, 4),
        // Let Lenis drive the native scroll bar position so anchor links,
        // scrollTo, and IntersectionObservers still work untouched.
        smoothWheel: true,
      });

      html.classList.add("cs-lenis-on");

      const raf = (time: number) => {
        instance?.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
    })();

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      instance?.destroy();
      html.classList.remove("cs-lenis-on");
    };
  }, []);

  return <>{children}</>;
}
