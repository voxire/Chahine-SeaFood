"use client";

import { clsx } from "clsx";
import type { CSSProperties, ReactNode } from "react";

type Align = "center" | "top" | "bottom" | "start" | "end";

export type PinnedProps = {
  /**
   * Vertical alignment inside the pinned viewport. The container is
   * flexbox column by default; this controls `justify-content`.
   *
   * @default "center"
   */
  align?: Align;
  /**
   * Extra class names merged onto the pinned wrapper.
   */
  className?: string;
  /**
   * Optional inline style overrides. Any `position`/`inset` keys here
   * are ignored to preserve the fixed-to-viewport contract.
   */
  style?: Omit<CSSProperties, "position" | "inset">;
  children: ReactNode;
};

const JUSTIFY: Record<Align, CSSProperties["justifyContent"]> = {
  center: "center",
  top: "flex-start",
  start: "flex-start",
  bottom: "flex-end",
  end: "flex-end",
};

/**
 * The fixed-viewport child of a `<ScrollStage>`. Renders a
 * `position: fixed; inset: 0;` flexbox column pinned to the viewport
 * while the surrounding `<ScrollStage>` runway scrolls past.
 *
 * Use inside `<ScrollStage>` only. Any `<Pinned>` rendered outside a
 * stage still works — it just stays glued to the viewport as normal
 * fixed content, which is occasionally useful (e.g. standalone heroes).
 *
 * Children can read scroll progress via `useStageProgress()` and drive
 * their own enter animations with `useTransform()`.
 */
export function Pinned({
  align = "center",
  className,
  style,
  children,
}: PinnedProps) {
  return (
    <div
      data-scroll-stage-pinned
      className={clsx(
        "pointer-events-none flex flex-col items-center",
        className,
      )}
      style={{
        position: "fixed",
        inset: 0,
        justifyContent: JUSTIFY[align],
        ...style,
      }}
    >
      {/* Inner wrapper restores pointer events for interactive content
          while the fixed outer stays transparent to clicks on the runway. */}
      <div className="pointer-events-auto contents">{children}</div>
    </div>
  );
}
