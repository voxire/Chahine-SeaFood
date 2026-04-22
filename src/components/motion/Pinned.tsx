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
 * The pinned child of a `<ScrollStage>`. Renders a
 * `position: sticky; top: var(--cs-nav-h); height: calc(100vh - var(--cs-nav-h));`
 * flexbox column that sticks below the fixed navbar while the surrounding
 * `<ScrollStage>` runway scrolls past, then releases when the runway ends.
 *
 * Sticky (not fixed) is the correct pinned-runway contract — it scopes
 * the pin to the parent's scroll window, so the content only appears
 * while its `<ScrollStage>` is actually in view. Using `fixed` here
 * would glue the content to the viewport globally and bleed over every
 * other section of the page.
 *
 * The `top` offset reads `--cs-nav-h` (72px by default, declared in
 * globals.css) so pinned content never slides under the fixed navbar
 * — it stops flush beneath it. `height: calc(100vh - var(--cs-nav-h))`
 * keeps the flex column exactly the visible area below the nav.
 *
 * Use inside `<ScrollStage>` only. Children can read scroll progress
 * via `useStageProgress()` and drive their own enter animations with
 * `useTransform()`.
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
        "flex w-full flex-col items-center overflow-hidden",
        className,
      )}
      style={{
        position: "sticky",
        top: "var(--cs-nav-h, 72px)",
        height: "calc(100vh - var(--cs-nav-h, 72px))",
        justifyContent: JUSTIFY[align],
        ...style,
      }}
    >
      {children}
    </div>
  );
}
