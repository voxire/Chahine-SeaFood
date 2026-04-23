import { getLocale, getTranslations } from "next-intl/server";

import { FadeIn } from "@/components/motion/FadeIn";
import { SectionHeading } from "@/components/motion/SectionHeading";
import { StickerLink } from "@/components/ui/StickerButton";
import type { BranchPopupContent } from "@/components/branches/BranchPopup";
import { BranchesScene } from "@/components/branches/BranchesScene";
import {
  branchDistrict,
  branchMapsUrl,
  branches,
  formatPhone,
} from "@/data/branches";
import type { Locale } from "../../../i18n";
import { buildContactLink } from "@/lib/whatsapp";
import { Link } from "@/lib/i18n/navigation";

/**
 * Branches teaser — Lebanon silhouette with 10 gold dots, the user's
 * nearest branch highlighted with a pulsing ring (client-side
 * geolocation), and the 10 branch names laid out below as chip-style
 * links into their detail pages.
 *
 * Rendering model:
 *   - Server component: heading, localized branch-name dictionary, CTA.
 *   - `<BranchesScene>` client island: geolocation + pulse + status.
 *
 * Privacy: no geolocation request runs unless the user lets it; no
 * coordinates are transmitted anywhere — everything computes locally.
 */
export async function BranchesTeaser() {
  const t = await getTranslations("branchesTeaser");
  const tBranches = await getTranslations("branchNames");
  const tCommon = await getTranslations("common");
  const tBranchesPage = await getTranslations("branchesPage");
  const locale = (await getLocale()) as Locale;

  // Build a slug→localized-name dictionary once, server-side, so the
  // client scene doesn't need to import the i18n provider.
  const branchNames = Object.fromEntries(
    branches.map((b) => [b.slug, tBranches(b.slug)]),
  );

  // Pre-resolve every piece of popup content on the server so the client
  // island receives a ready-to-render dictionary. Tripoli has no phone
  // on record yet — gracefully degrade its Order CTA to a "coming soon"
  // placeholder rather than an un-clickable wa.me/0 link.
  //
  // Popup hours line composes the "Open daily" label with the time range
  // into a single row so the tooltip reads as a complete thought —
  // "Open daily · 12pm – 2am" / "مفتوح يومياً · من ١٢ ظهراً حتى ٢ فجراً".
  const hoursLine = `${tBranchesPage("hoursLabel")} · ${tBranchesPage("hoursDaily")}`;
  const orderLabel = tCommon("orderNow");
  const mapsLabel = tBranchesPage("openOnMap");
  const comingSoonLabel = tCommon("comingSoon");
  const closeLabel = t("popupClose");

  const branchPopups: Record<string, BranchPopupContent> = Object.fromEntries(
    branches.map((b) => {
      const name = tBranches(b.slug);
      const content: BranchPopupContent = {
        name,
        district: branchDistrict(b, locale),
        hoursLine,
        phoneLine: b.phone ? formatPhone(b.phone) : null,
        orderHref: b.phone ? buildContactLink(b.phone) : null,
        mapsHref: branchMapsUrl(b, locale),
        orderLabel,
        mapsLabel,
        comingSoonLabel,
        closeLabel,
      };
      return [b.slug, content];
    }),
  );

  return (
    <section
      aria-labelledby="branches-teaser-heading"
      className="bg-cs-surface-2 py-section-y"
    >
      <div className="mx-auto max-w-container px-6">
        {/* Redundant FadeIn wrapper removed — SectionHeading drives
            its own scroll-triggered reveal (see #61). */}
        <SectionHeading
          plain={t("plain")}
          pill={t("pill")}
          subhead={t("description")}
          as="h2"
        />

        {/* Mobile UX strategy (per CLAUDE.md §0 + §10.1 rule 5):
            On narrow viewports the map stacks above and is effectively
            DECORATIVE — SVG pins render at ~18px which is well below
            the 44px tap target, and can't be enlarged without
            overlapping each other (Beirut branches Cola + Hamra sit
            close on the real geography). The pill list below becomes
            the primary branch-selection affordance on mobile; each
            chip routes to the branch detail page. On desktop the map
            regains primacy via hover-to-open BranchPopup, with the
            pills acting as a quick-scan sidebar. */}
        <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,_1fr)_minmax(0,_1.2fr)] lg:items-center">
          {/* Left: silhouette + status. On mobile this stacks above. */}
          <FadeIn className="flex justify-center">
            <BranchesScene
              branchNames={branchNames}
              branchPopups={branchPopups}
              nearestLabel={t("nearest")}
              locatingLabel={t("locating")}
              mapDisclaimer={t("mapDisclaimer")}
            />
          </FadeIn>

          {/* Right: branch pill list. On mobile these are the primary
              interactive affordance (map pins are too small to tap).
              Sized to clear the 44×44 tap-target rule (§10.3) and the
              ≥16px interactive-text rule: `px-5 py-3 text-base` →
              ~48px tall pills. Desktop re-scales slightly smaller
              since the map absorbs the primary interaction there. */}
          <FadeIn delay={0.15}>
            <ul className="flex flex-wrap justify-center gap-3 lg:justify-start">
              {branches.map((b) => (
                <li key={b.slug}>
                  <Link
                    href={`/branches/${b.slug}`}
                    className="inline-flex items-center rounded-pill border border-cs-text/15 bg-cs-surface px-5 py-3 text-base font-medium text-cs-text-muted transition-colors hover:border-cs-blue/40 hover:text-cs-blue-deep lg:px-4 lg:py-2 lg:text-sm"
                    data-cursor="link"
                  >
                    {tBranches(b.slug)}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex justify-center lg:justify-start">
              <StickerLink href="/branches" variant="primary">
                {t("cta")}
              </StickerLink>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
