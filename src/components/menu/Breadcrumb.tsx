import { Link } from "@/lib/i18n/navigation";

type Crumb = {
  /** Locale-relative href — the i18n-aware Link prepends the locale. Omit for the last crumb. */
  href?: string;
  label: string;
};

type Props = {
  items: Crumb[];
  className?: string;
};

/**
 * Accessible breadcrumb trail. The last crumb is rendered as plain text with
 * aria-current="page"; all previous crumbs link back. Separators are inert
 * per the WAI-ARIA breadcrumb pattern.
 */
export function Breadcrumb({ items, className }: Props) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-cs-text-muted">
        {items.map((crumb, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={`${crumb.label}-${i}`} className="flex items-center gap-x-2">
              {crumb.href && !isLast ? (
                <Link
                  href={crumb.href}
                  className="transition-colors hover:text-cs-blue"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined} className="text-cs-text">
                  {crumb.label}
                </span>
              )}
              {!isLast ? (
                <span aria-hidden className="text-cs-text-muted/50">
                  /
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
