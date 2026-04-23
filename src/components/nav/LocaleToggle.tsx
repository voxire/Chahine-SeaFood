"use client";

import clsx from "clsx";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/lib/i18n/navigation";

export function LocaleToggle() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const toggleTo = locale === "en" ? "ar" : "en";
  const label = toggleTo === "ar" ? "العربية" : "English";

  return (
    <button
      type="button"
      onClick={() => router.replace(pathname, { locale: toggleTo })}
      className={clsx(
        // Base tap target clears §10.3 (≥44×44). Desktop pulls back to
        // the tighter authored padding since it sits inline in the
        // horizontal nav and mouse precision lets us trim chrome.
        "inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-pill border border-cs-text/20 px-4 py-2 text-base",
        "md:min-h-0 md:min-w-0 md:px-3 md:py-1 md:text-sm",
        "text-cs-text outline-none transition-colors hover:border-cs-blue hover:text-cs-blue focus-visible:ring-2 focus-visible:ring-cs-gold"
      )}
      aria-label={`Switch language to ${label}`}
    >
      {toggleTo.toUpperCase()}
    </button>
  );
}
