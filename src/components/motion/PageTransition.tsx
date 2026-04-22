"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Route-change overlay. Wraps `app/[locale]/template.tsx` so that each
 * navigation keys a fresh animation cycle. On route change, a
 * cream-colored overlay slides in from the bottom-right over ~300 ms,
 * holds for ~120 ms with the logo wave mask, then slides out to the
 * top-left for ~300 ms. Under reduced motion, the overlay is replaced
 * by an instant fade.
 *
 * The actual page content always renders in place — the overlay is an
 * additional fixed layer that sits above while it animates.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const shouldReduce = useReducedMotion();

  return (
    <>
      {children}
      <AnimatePresence mode="sync" initial={false}>
        <motion.div
          key={pathname}
          className="pointer-events-none fixed inset-0 z-[9000]"
          initial={
            shouldReduce
              ? { opacity: 0 }
              : { clipPath: "polygon(100% 100%, 100% 100%, 100% 100%, 100% 100%)" }
          }
          animate={
            shouldReduce
              ? { opacity: 0 }
              : {
                  clipPath: [
                    "polygon(100% 100%, 100% 100%, 100% 100%, 100% 100%)",
                    "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                    "polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%)",
                  ],
                }
          }
          transition={
            shouldReduce
              ? { duration: 0.15 }
              : {
                  duration: 0.72,
                  times: [0, 0.45, 1],
                  ease: [0.22, 1, 0.36, 1],
                }
          }
          exit={{ opacity: 0 }}
          style={{
            background: "var(--cs-bg)",
            // Layered wave texture from the brand pattern — the same
            // file the Hero uses at low opacity.
            backgroundImage: "url(/patterns/wave.svg)",
            backgroundRepeat: "repeat",
            backgroundSize: "480px",
            backgroundPosition: "center",
            mixBlendMode: "normal",
          }}
        />
      </AnimatePresence>
    </>
  );
}
