import type { ReactNode } from "react";

import { PageTransition } from "@/components/motion/PageTransition";

/**
 * Next.js `template.tsx` re-mounts on every navigation — unlike
 * `layout.tsx` which is preserved. That re-mount is what allows
 * `<PageTransition>`'s `AnimatePresence` to key on `pathname` and run
 * a fresh enter/exit cycle per route change.
 *
 * Kept absolutely minimal: any global chrome (nav, footer, etc.) stays
 * in the locale layout so it doesn't re-render on every nav.
 */
export default function LocaleTemplate({ children }: { children: ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
