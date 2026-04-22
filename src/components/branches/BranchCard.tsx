import { getTranslations } from "next-intl/server";

import type { Branch } from "@/data/branches";
import {
  OPENING_HOURS,
  branchDistrict,
  branchMapsUrl,
  formatPhone,
} from "@/data/branches";
import { buildContactLink } from "@/lib/whatsapp";
import { Link } from "@/lib/i18n/navigation";
import type { Locale } from "../../../i18n";

type Props = {
  branch: Branch;
  locale: Locale;
};

/**
 * Full-fat branch card used on /branches. Shows the branch name, district,
 * formatted phone, shared opening hours, and two CTAs (WhatsApp + Google Maps).
 * Handles branches without a confirmed phone (currently Tripoli).
 */
export async function BranchCard({ branch, locale }: Props) {
  const tBranches = await getTranslations("branchNames");
  const t = await getTranslations("branchesPage");
  const tCommon = await getTranslations("common");

  const hasPhone = Boolean(branch.phone);

  return (
    <article className="flex h-full flex-col justify-between gap-6 rounded-xl border border-cs-text/10 bg-cs-surface p-6 transition-all duration-200 ease-cs hover:-translate-y-0.5 hover:border-cs-blue/40 hover:shadow-md">
      <header className="space-y-1">
        <Link
          href={`/branches/${branch.slug}`}
          className="block font-display text-xl font-black uppercase leading-none text-cs-blue-deep transition-colors hover:text-cs-blue md:text-2xl"
        >
          <h2>{tBranches(branch.slug)}</h2>
        </Link>
        <p className="text-sm text-cs-text-muted">
          {branchDistrict(branch, locale)}
        </p>
      </header>

      <dl className="grid gap-2 text-sm">
        <div className="flex items-baseline gap-2">
          <dt className="min-w-16 text-xs uppercase tracking-wider text-cs-text-muted/80">
            {t("hoursLabel")}
          </dt>
          <dd className="text-cs-text">
            {t("hoursDaily", {
              open: OPENING_HOURS.openLocal,
              close: OPENING_HOURS.closeLocal,
            })}
          </dd>
        </div>

        <div className="flex items-baseline gap-2">
          <dt className="min-w-16 text-xs uppercase tracking-wider text-cs-text-muted/80">
            {t("phoneLabel")}
          </dt>
          <dd className="font-mono text-cs-text" dir="ltr">
            {hasPhone ? formatPhone(branch.phone) : t("phonePending")}
          </dd>
        </div>
      </dl>

      <div className="flex flex-wrap gap-2">
        {hasPhone ? (
          <a
            href={buildContactLink(branch.phone)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-1 items-center justify-center rounded-pill bg-cs-gold px-4 py-2.5 text-sm font-semibold text-cs-on-gold transition-transform hover:scale-[1.02] hover:bg-cs-gold-soft"
          >
            {tCommon("orderNow")}
          </a>
        ) : (
          <span className="inline-flex flex-1 items-center justify-center rounded-pill border border-cs-text/15 px-4 py-2.5 text-sm text-cs-text-muted">
            {tCommon("comingSoon")}
          </span>
        )}
        <a
          href={branchMapsUrl(branch, locale)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex flex-1 items-center justify-center rounded-pill border border-cs-text/15 px-4 py-2.5 text-sm font-semibold text-cs-blue-deep transition-colors hover:border-cs-blue hover:text-cs-blue"
        >
          {t("openOnMap")}
        </a>
      </div>
    </article>
  );
}
