import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { LocaleToggle } from "./LocaleToggle";

export async function Navbar() {
  const t = await getTranslations("nav");

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-30 h-[72px] border-b border-cs-text/10 bg-cs-bg/85 backdrop-blur">
        <div className="mx-auto flex h-full max-w-container items-center justify-between px-6">
          <Link
            href="/"
            className="font-display text-lg font-black uppercase tracking-wide text-cs-blue"
          >
            Chahine Seafood
          </Link>
          <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
            <Link
              href="/menu"
              className="text-sm font-medium text-cs-text transition-colors hover:text-cs-blue"
            >
              {t("menu")}
            </Link>
            <Link
              href="/branches"
              className="text-sm font-medium text-cs-text transition-colors hover:text-cs-blue"
            >
              {t("branches")}
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-cs-text transition-colors hover:text-cs-blue"
            >
              {t("about")}
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-cs-text transition-colors hover:text-cs-blue"
            >
              {t("contact")}
            </Link>
            <LocaleToggle />
          </nav>
          <div className="md:hidden">
            <LocaleToggle />
          </div>
        </div>
      </header>
      <ScrollProgress />
      {/* Spacer so content doesn't render behind the fixed header */}
      <div className="h-[72px]" aria-hidden />
    </>
  );
}
