import clsx from "clsx";
import type { ReactNode } from "react";
import { Pill } from "./Pill";

type Align = "left" | "center";
type HeadingTag = "h1" | "h2" | "div";

type Props = {
  /** The big, slightly-transparent first word (or words) that sits behind. */
  plain: string;
  /** The gold pill text — usually the punchy second word. */
  pill: string;
  /** Optional subhead underneath. */
  subhead?: ReactNode;
  className?: string;
  align?: Align;
  /** What heading level this composition represents. Default `div` (decorative). */
  as?: HeadingTag;
};

/**
 * The signature composition from frieslab, adapted to Chahine's palette:
 * semi-transparent display word + skewed gold pill + optional subhead.
 * Core building block of every section heading on the site.
 *
 * When used as a page's primary heading, set `as="h1"`. For sub-sections on
 * a page that already has an h1 elsewhere, use `as="h2"` (or the default
 * `div` if the section is purely decorative).
 */
export function SectionHeading({
  plain,
  pill,
  subhead,
  className,
  align = "center",
  as = "div",
}: Props) {
  const Heading = as;

  return (
    <div className={clsx("w-full", className)}>
      <Heading
        className={clsx(
          "m-0 flex flex-wrap items-center gap-x-4 gap-y-2",
          align === "center" ? "justify-center" : "justify-start"
        )}
      >
        <span className="font-display text-4xl font-black uppercase leading-none opacity-20 text-cs-text md:text-6xl lg:text-7xl">
          {plain}
        </span>
        <Pill size="lg">{pill}</Pill>
      </Heading>
      {subhead ? (
        <p
          className={clsx(
            "mt-4 text-base text-cs-text-muted md:text-lg",
            align === "center" ? "text-center" : ""
          )}
        >
          {subhead}
        </p>
      ) : null}
    </div>
  );
}
