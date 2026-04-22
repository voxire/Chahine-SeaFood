// Root layout is intentionally a pass-through — every route lives under
// `[locale]`, and the real <html>/<body> tags are set in
// `app/[locale]/layout.tsx` so that `lang` and `dir` can reflect the active locale.
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
