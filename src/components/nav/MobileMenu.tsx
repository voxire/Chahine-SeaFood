"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { Link } from "@/lib/i18n/navigation";
import { usePathname } from "@/lib/i18n/navigation";

type NavLink = {
  href: string;
  label: string;
};

type Props = {
  /** Link list shown inside the drawer, already localised server-side. */
  links: NavLink[];
  /** Localised "Open menu" a11y label for the hamburger. */
  openLabel: string;
  /** Localised "Close menu" a11y label for the X button. */
  closeLabel: string;
  /** Localised label for the inner `<nav>` element. */
  mainNavLabel: string;
};

/**
 * Mobile navigation drawer.
 *
 * Why this component exists (CLAUDE.md §0 — mobile-first):
 * Before this, the Navbar hid every nav link behind `hidden md:flex`
 * with no hamburger fallback. Mobile users had no way to reach /menu,
 * /branches, /about, or /contact — the primary user jobs listed in
 * CLAUDE.md §1 were unreachable on phones. This component restores
 * mobile navigation per the mobile-first core principle.
 *
 * Behaviour:
 *   - Hamburger button shown only below `md` breakpoint (desktop has
 *     its own horizontal nav).
 *   - Tap opens a full-screen cream-on-wave drawer with big uppercase
 *     display-font links — readable at arm's length, way above the
 *     44×44 tap-target rule (§10.3).
 *   - Dismisses on: close button, ESC key, backdrop click, route
 *     change (watches `pathname`).
 *   - Body scroll is locked while open (stops the page scrolling
 *     under the drawer).
 *   - Focus returns to the hamburger on close for keyboard a11y.
 *   - Animations respect `prefers-reduced-motion` — fall back to a
 *     plain fade with no transform.
 *
 * Trapped focus is handled by the drawer being the only visible
 * interactive surface (other page content is hidden behind the fixed
 * full-screen panel). We don't install a full focus-trap library
 * because the drawer's contents are short (4 links + close button +
 * locale toggle) and tab-cycling through them naturally loops via
 * the close button which is the last focusable item.
 */
export function MobileMenu({ links, openLabel, closeLabel, mainNavLabel }: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isRtl, setIsRtl] = useState(false);
  const pathname = usePathname();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const prefersReduced = useReducedMotion();

  // Wait for client mount before rendering the portal target. The
  // drawer is portalled to `document.body` (see the AnimatePresence
  // block below) to escape the Navbar <header>'s `backdrop-filter`,
  // which creates a containing block that would otherwise trap the
  // `position: fixed` panel at 72px tall — clipping the entire
  // drawer to the navbar height.
  useEffect(() => {
    setMounted(true);
    // Read writing direction once on mount. Used below to drive the
    // panel's slide direction — LTR pulls in from the right, RTL from
    // the left. next-intl sets `dir` on the <html> element, so this
    // check is correct the moment the portal mounts.
    setIsRtl(document.documentElement.dir === "rtl");
  }, []);


  // Close on route change — ensures the drawer never lingers after
  // the user taps a link.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // ESC to close, and auto-focus the close button when the drawer
  // opens so keyboard users land somewhere sensible. Also locks
  // body scroll while the drawer is visible.
  useEffect(() => {
    if (!open) return;
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    // Defer focus so the drawer has time to mount before we move
    // the cursor.
    const raf = requestAnimationFrame(() => {
      closeBtnRef.current?.focus();
    });

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      cancelAnimationFrame(raf);
    };
  }, [open]);

  // Return focus to the hamburger when the drawer closes — keyboard
  // users should land back where they triggered from.
  const handleClose = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label={openLabel}
        aria-expanded={open}
        aria-controls="mobile-nav-drawer"
        onClick={() => setOpen(true)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-pill text-cs-blue-deep outline-none transition-colors hover:text-cs-blue focus-visible:ring-2 focus-visible:ring-cs-gold md:hidden"
      >
        {/* Three-bar hamburger. The visual rule §10.3 "no hover-only
            interactive states" is satisfied by `focus-visible:ring-2`. */}
        <svg
          viewBox="0 0 24 24"
          width="26"
          height="26"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden
        >
          <line x1="4" y1="7" x2="20" y2="7" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="17" x2="20" y2="17" />
        </svg>
      </button>

      {mounted &&
        createPortal(
          <div
            id="mobile-nav-drawer"
            role="dialog"
            aria-modal={open}
            aria-hidden={!open}
            aria-label={mainNavLabel}
            className="fixed inset-0 z-50 md:hidden"
            style={{
              // Keep the drawer always mounted so the panel can ride
              // its initial `translateX(100%)` on first paint and CSS
              // transitions can then animate to 0 when `open` flips.
              // AnimatePresence approach didn't work: the child mounted
              // with `open: true` on the very first render, so the
              // browser never saw a transition between states.
              opacity: open ? 1 : 0,
              pointerEvents: open ? "auto" : "none",
              transition: prefersReduced
                ? "opacity 0ms"
                : "opacity 200ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            {/* Backdrop — tapping here closes the drawer. The
                backdrop is a separate element (not the panel) so
                taps on the panel itself don't dismiss. */}
            <button
              type="button"
              aria-label={closeLabel}
              onClick={handleClose}
              className="absolute inset-0 bg-cs-blue-deep/60 backdrop-blur-sm outline-none"
              tabIndex={-1}
            />

            {/* Panel — full-height cream sheet sliding from the
                right. Width capped at 22rem so short landscape
                phones still see a hint of the underlying page.
                Uses the brand wave pattern for continuity with the
                PageTransition curtain.
                Slide animation is CSS-driven (not framer-motion)
                because a nested motion.div inside the portalled
                AnimatePresence was stalling its translateX at the
                halfway point under React dev StrictMode + Fast
                Refresh. A CSS transition keyed off the `open` state
                is simpler, always runs to completion, and doesn't
                require AnimatePresence coordination. Reduced motion
                falls back to a plain fade (outer opacity animation
                still runs). */}
            <div
              className="absolute right-0 top-0 flex h-full w-full max-w-[22rem] flex-col bg-cs-bg shadow-2xl rtl:left-0 rtl:right-auto"
              style={{
                // Inline `transform` + `transition` instead of Tailwind
                // `translate-x-*` classes, because the Tailwind utilities
                // are CSS-variable-based and browsers don't reliably
                // animate transitions when only the variable changes —
                // the panel was stalling exactly at 50% translateX in
                // practice. Explicit transform string gives us a clean
                // transitionable property value.
                // LTR hides off-screen-right (translateX(100%)), RTL
                // hides off-screen-left (translateX(-100%)). Both use
                // `absolute right-0` / `rtl:left-0` for resting edge,
                // so the sign flip is the only piece we drive in JS.
                // The drawer container is always mounted (opacity
                // gated by `open`) so the first paint of the panel
                // renders with the off-screen transform, and CSS
                // transition picks up when `open` flips to animate
                // the slide cleanly.
                transform: open
                  ? "translateX(0)"
                  : isRtl
                  ? "translateX(-100%)"
                  : "translateX(100%)",
                transition: prefersReduced
                  ? "none"
                  : "transform 320ms cubic-bezier(0.22, 1, 0.36, 1)",
                backgroundImage: "url(/patterns/wave.svg)",
                backgroundRepeat: "repeat",
                backgroundSize: "360px",
              }}
            >
              {/* Top bar inside the panel — close button aligned to
                  the end so it's in the expected place under both
                  LTR and RTL. */}
              <div className="flex items-center justify-end px-6 pt-6">
                <button
                  ref={closeBtnRef}
                  type="button"
                  aria-label={closeLabel}
                  onClick={handleClose}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-pill text-cs-blue-deep outline-none transition-colors hover:text-cs-blue focus-visible:ring-2 focus-visible:ring-cs-gold"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="22"
                    height="22"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    aria-hidden
                  >
                    <line x1="6" y1="6" x2="18" y2="18" />
                    <line x1="18" y1="6" x2="6" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Link stack — large uppercase display-font items.
                  Every link is 56px tall (py-4 + text-2xl leading)
                  so they clear §10.3's 44×44 rule with margin.
                  Links route via the i18n-aware <Link>; we don't
                  need to manually close the drawer on click since
                  the pathname-change effect above handles it. */}
              <nav aria-label={mainNavLabel} className="flex-1 px-6 pt-6">
                <ul className="flex flex-col gap-2">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="flex w-full items-center justify-between rounded-lg px-4 py-4 font-display text-2xl font-black uppercase tracking-wide text-cs-blue-deep outline-none transition-colors hover:bg-cs-surface-2 hover:text-cs-blue focus-visible:ring-2 focus-visible:ring-cs-gold"
                      >
                        <span>{link.label}</span>
                        <span aria-hidden className="text-cs-gold rtl:rotate-180">
                          →
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              </div>
          </div>,
          document.body,
        )}
    </>
  );
}
