import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { LocaleToggle } from "./LocaleToggle";
import { MobileMenu } from "./MobileMenu";

export async function Navbar() {
  const t = await getTranslations("nav");

  // Link list — resolved server-side so the MobileMenu client island
  // doesn't need to re-hydrate the i18n bundle. Identical order to the
  // desktop nav below so keyboard users get the same tab sequence.
  const mobileLinks = [
    { href: "/menu", label: t("menu") },
    { href: "/branches", label: t("branches") },
    { href: "/about", label: t("about") },
    { href: "/contact", label: t("contact") },
  ];

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-30 h-[72px] border-b border-cs-text/10 bg-cs-bg/85 backdrop-blur">
        <div className="mx-auto flex h-full max-w-container items-center justify-between px-6">
          <Link
            href="/"
            aria-label="Chahine Seafood — home"
            className="flex items-center gap-3 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-cs-gold"
          >
            <Image
              src="/brand/logo.jpg"
              alt=""
              width={48}
              height={48}
              priority
              className="h-12 w-12 rounded-full object-cover"
            />
            <span className="hidden font-display text-base font-black uppercase tracking-wide text-cs-blue sm:inline">
              Chahine Seafood
            </span>
          </Link>

          {/* Desktop nav — hidden below md. On mobile the hamburger
              drawer takes over (see <MobileMenu /> below). */}
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

          {/* Mobile cluster — locale toggle + hamburger. Before this
              commit there was no hamburger and the four nav links were
              `hidden md:flex`, leaving mobile users with no way to
              reach /menu, /branches, /about, or /contact. That was a
              critical §0 mobile-first failure. MobileMenu fixes it. */}
          <div className="flex items-center gap-2 md:hidden">
            <LocaleToggle />
            <MobileMenu
              links={mobileLinks}
              openLabel={t("openMenu")}
              closeLabel={t("closeMenu")}
              mainNavLabel={t("mainNav")}
            />
          </div>
        </div>
      </header>
      <ScrollProgress />
      {/* Spacer so content doesn't render behind the fixed header */}
      <div className="h-[72px]" aria-hidden />
    </>
  );
}
