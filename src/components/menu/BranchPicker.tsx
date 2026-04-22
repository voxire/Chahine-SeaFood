import { getTranslations } from "next-intl/server";

import type { MenuItem } from "@/data/menu";
import type { Locale } from "../../../i18n";
import { branches } from "@/data/branches";
import { buildOrderLink } from "@/lib/whatsapp";

type Props = {
  item: MenuItem;
  locale: Locale;
};

/**
 * Grid of branch cards. Each card is a WhatsApp deep-link pre-filled with
 * the given item (quantity 1 + price). Branches without a phone number show
 * a disabled state until the client confirms the number.
 */
export async function BranchPicker({ item, locale }: Props) {
  const tBranches = await getTranslations("branchNames");
  const tItem = await getTranslations("itemDetail");

  const itemName = locale === "ar" ? item.name_ar : item.name_en;

  return (
    <div
      role="list"
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5"
    >
      {branches.map((branch) => {
        const branchName = tBranches(branch.slug);

        if (!branch.phone) {
          return (
            <span
              key={branch.slug}
              role="listitem"
              className="flex flex-col items-center gap-1 rounded-lg border border-cs-text/10 bg-cs-surface/60 px-4 py-5 text-center opacity-60"
            >
              <span className="font-display text-sm font-black uppercase text-cs-text-muted">
                {branchName}
              </span>
              <span className="text-[11px] text-cs-text-muted">
                {tItem("branchPhonePending")}
              </span>
            </span>
          );
        }

        const waUrl = buildOrderLink({
          branchPhone: branch.phone,
          branchName,
          items: [{ name: itemName, qty: 1, price: item.price }],
          locale,
        });

        return (
          <a
            key={branch.slug}
            role="listitem"
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-1 rounded-lg border border-cs-text/10 bg-cs-surface px-4 py-5 text-center transition-all duration-200 ease-cs hover:-translate-y-0.5 hover:border-cs-blue/50 hover:shadow-md"
            aria-label={`${tItem("orderAt")} ${branchName} — WhatsApp`}
          >
            <span className="font-display text-sm font-black uppercase text-cs-blue-deep transition-colors group-hover:text-cs-blue">
              {branchName}
            </span>
            <span className="text-[11px] font-medium uppercase tracking-wider text-cs-text-muted">
              {tItem("orderOnWhatsapp")}
            </span>
          </a>
        );
      })}
    </div>
  );
}
