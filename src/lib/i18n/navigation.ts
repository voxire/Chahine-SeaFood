import { createSharedPathnamesNavigation } from "next-intl/navigation";
import { locales } from "../../../i18n";

// Locale-aware versions of Next.js's `Link`, `useRouter`, `usePathname`, and
// `redirect`. Always import from here instead of from `next/link` / `next/navigation`.
export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation({ locales: [...locales] });
