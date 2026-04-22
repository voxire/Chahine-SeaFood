import clsx from "clsx";
import type { MenuItem } from "@/data/menu";
import type { Locale } from "../../../i18n";
import { formatLBP } from "@/lib/format";

type Props = {
  item: MenuItem;
  locale: Locale;
  className?: string;
};

const TAG_LABELS: Record<"en" | "ar", Record<string, string>> = {
  en: { signature: "Signature", new: "New", spicy: "Spicy" },
  ar: { signature: "مميّز", new: "جديد", spicy: "حار" },
};

export function ItemCard({ item, locale, className }: Props) {
  const name = locale === "ar" ? item.name_ar : item.name_en;
  const description =
    locale === "ar" ? item.description_ar : item.description_en;

  return (
    <article
      className={clsx(
        "group flex h-full flex-col justify-between gap-5 rounded-lg border border-cs-text/10 bg-cs-surface p-6",
        "transition-all duration-200 ease-cs",
        "hover:-translate-y-0.5 hover:border-cs-blue/40 hover:shadow-md",
        className,
      )}
    >
      <header className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-lg font-black uppercase leading-tight text-cs-blue-deep md:text-xl">
            {name}
          </h3>
          {item.tags?.length ? (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-pill bg-cs-gold-soft/25 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-cs-on-gold"
                >
                  {TAG_LABELS[locale][tag] ?? tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>
        <span
          className="shrink-0 font-display text-base font-black text-cs-blue md:text-lg"
          aria-label={`${name} price`}
        >
          {formatLBP(item.price, locale)}
        </span>
      </header>

      <p className="text-sm leading-relaxed text-cs-text-muted md:text-base">
        {description}
      </p>
    </article>
  );
}
