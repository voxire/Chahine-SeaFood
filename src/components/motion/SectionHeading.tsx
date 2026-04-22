import clsx from "clsx";
import type { ReactNode } from "react";
import { Pill } from "./Pill";

type Align = "left" | "center";

type Props = {
  /** The big, slightly-transparent first word (or words) that sits behind. */
  plain: string;
  /** The gold pill text — usually the punchy second word. */
  pill: string;
  /** Optional subhead underneath. */
  subhead?: ReactNode;
  className?: string;
  align?: Align;
};

/**
 * The signature composition from frieslab, adapted to Chahine's palette:
 * semi-transparent display word + skewed gold pill + optional subhead.
 * Core building block of every section heading on the site.
 */
export function SectionHeading({
  plain,
  pill,
  subhead,
  className,
  align = "center",
}: Props) {
  return (
    <div
      className={clsx(
        "flex flex-wrap items-center gap-x-4 gap-y-2",
        align === "center" ? "justify-center text-center" : "justify-start",
        className
      )}
    >
      <span className="font-display text-4xl font-black uppercase leading-none opacity-20 text-cs-text md:text-6xl lg:text-7xl">
        {plain}
      </span>
      <Pill size="lg">{pill}</Pill>
      {subhead ? (
        <p className="mt-4 w-full text-base text-cs-text-muted md:text-lg">
          {subhead}
        </p>
      ) : null}
    </div>
  );
}
