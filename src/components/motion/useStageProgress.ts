"use client";

import { createContext, useContext } from "react";
import { motionValue, type MotionValue } from "framer-motion";

/**
 * A `MotionValue<number>` representing the scroll progress through the
 * enclosing `<ScrollStage>`, where 0 = stage's top edge reaches the
 * viewport bottom (stage about to enter), and 1 = stage's bottom edge
 * reaches the viewport top (stage has left).
 *
 * Outside a `<ScrollStage>`, falls back to a static MotionValue at 0 so
 * that children can be rendered standalone for storybook/unit testing
 * without throwing.
 */
export const StageProgressContext = createContext<MotionValue<number> | null>(
  null,
);

const fallback = motionValue(0);

export function useStageProgress(): MotionValue<number> {
  const value = useContext(StageProgressContext);
  return value ?? fallback;
}
