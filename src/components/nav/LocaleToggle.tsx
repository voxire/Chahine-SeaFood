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
        "inline-flex items-center gap-2 rounded-pill border border-cs-text/20 px-3 py-1 text-sm",
        "text-cs-text transition-colors hover:border-cs-blue hover:text-cs-blue"
      )}
      aria-label={`Switch language to ${label}`}
    >
      {toggleTo.toUpperCase()}
    </button>
  );
}
