import clsx from "clsx";
import type { ReactNode } from "react";
import { Link } from "@/lib/i18n/navigation";

type Variant = "primary" | "ghost";

const base =
  "inline-flex items-center justify-center rounded-pill px-6 py-3 text-base font-semibold " +
  "transition-transform duration-200 ease-cs " +
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-cs-gold focus-visible:ring-offset-2 focus-visible:ring-offset-cs-bg";

const variants: Record<Variant, string> = {
  primary:
    "bg-cs-gold text-cs-bg hover:scale-[1.02] hover:bg-cs-gold-soft active:scale-[0.98]",
  ghost:
    "border border-cs-text/20 bg-transparent text-cs-text hover:border-cs-gold hover:text-cs-gold",
};

type LinkButtonProps = {
  children: ReactNode;
  /** Locale-relative path — the i18n-aware Link prepends the current locale. */
  href: string;
  variant?: Variant;
  className?: string;
  target?: string;
  rel?: string;
};

export function LinkButton({
  href,
  children,
  variant = "primary",
  className,
  target,
  rel,
}: LinkButtonProps) {
  return (
    <Link
      href={href}
      target={target}
      rel={rel}
      className={clsx(base, variants[variant], className)}
    >
      {children}
    </Link>
  );
}

type ButtonProps = {
  children: ReactNode;
  variant?: Variant;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
};

export function Button({
  children,
  variant = "primary",
  className,
  onClick,
  type = "button",
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={clsx(base, variants[variant], className)}
    >
      {children}
    </button>
  );
}
