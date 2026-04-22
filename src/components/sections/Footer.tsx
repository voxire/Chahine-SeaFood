import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";

export async function Footer() {
  const t = await getTranslations("footer");
  const nav = await getTranslations("nav");
  const year = new Date().getFullYear();

  return (
    <footer className="mt-12 border-t border-cs-text/10 bg-cs-surface/30 py-14">
      <div className="mx-auto flex max-w-container flex-col items-center gap-6 px-6 text-center">
        <p className="font-display text-xl font-black uppercase tracking-wide text-cs-gold">
          Chahine Seafood
        </p>

        <p className="max-w-md text-sm text-cs-text-muted md:text-base">
          {t("tagline")}
        </p>

        <nav
          className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm"
          aria-label="Footer"
        >
          <Link
            href="/menu"
            className="text-cs-text-muted transition-colors hover:text-cs-gold"
          >
            {nav("menu")}
          </Link>
          <Link
            href="/branches"
            className="text-cs-text-muted transition-colors hover:text-cs-gold"
          >
            {nav("branches")}
          </Link>
          <Link
            href="/about"
            className="text-cs-text-muted transition-colors hover:text-cs-gold"
          >
            {nav("about")}
          </Link>
          <Link
            href="/contact"
            className="text-cs-text-muted transition-colors hover:text-cs-gold"
          >
            {nav("contact")}
          </Link>
        </nav>

        <p className="text-xs text-cs-text-muted/70">
          © {year} Chahine Seafood. {t("copyright")}
        </p>
      </div>
    </footer>
  );
}
