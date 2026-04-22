"use client";

import { Children, isValidElement } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { clsx } from "clsx";
import type { CSSProperties, ReactNode } from "react";

export type CenterTriptychProps = {
  /**
   * Stagger between card entries in seconds.
   * @default 0.12
   */
  stagger?: number;
  /**
   * Base duration of each card's enter.
   * @default 0.95
   */
  duration?: number;
  /**
   * Gap between cards. Accepts any CSS length.
   * @default "clamp(1rem, 2vw, 2rem)"
   */
  gap?: CSSProperties["gap"];
  /**
   * How much of a viewport swing the side cards traverse on enter.
   * Mobile gets 25vw by default via a media query override below.
   * @default "50vw"
   */
  travel?: string;
  className?: string;
  children: ReactNode;
};

/**
 * Wraps exactly three children and animates them as the frieslab
 * "burger triptych": left slides in from `-travel`, center scales up
 * from 0.8 while fading in, right slides in from `+travel`. Stagger
 * is applied in order of DOM children.
 *
 * More or fewer than three children? They still animate — the first
 * renders as "left", the last as "right", and anything in between as
 * "center" scale-in. Best results with exactly three.
 *
 * Respects `prefers-reduced-motion: reduce`.
 */
export function CenterTriptych({
  stagger = 0.12,
  duration = 0.95,
  gap = "clamp(1rem, 2vw, 2rem)",
  travel = "50vw",
  className,
  children,
}: CenterTriptychProps) {
  const shouldReduce = useReducedMotion();
  const kids = Children.toArray(children).filter(isValidElement);
  const last = kids.length - 1;

  const variants = (i: number) => {
    if (shouldReduce) {
      return {
        initial: { opacity: 1, x: 0, scale: 1 },
        animate: { opacity: 1, x: 0, scale: 1 },
      };
    }
    if (i === 0) {
      return {
        initial: { opacity: 0, x: `-${travel}`, scale: 1 },
        animate: { opacity: 1, x: "0px", scale: 1 },
      };
    }
    if (i === last && last > 0) {
      return {
        initial: { opacity: 0, x: travel, scale: 1 },
        animate: { opacity: 1, x: "0px", scale: 1 },
      };
    }
    return {
      initial: { opacity: 0, x: 0, scale: 0.8 },
      animate: { opacity: 1, x: 0, scale: 1 },
    };
  };

  return (
    <div
      className={clsx(
        "flex flex-col items-stretch justify-center md:flex-row md:items-center md:justify-center",
        className,
      )}
      style={{ gap }}
    >
      {kids.map((child, i) => {
        const v = variants(i);
        return (
          <motion.div
            key={i}
            style={{ willChange: "transform, opacity" }}
            initial={v.initial}
            whileInView={v.animate}
            viewport={{ once: true, margin: "-20% 0px -20% 0px" }}
            transition={{
              duration,
              delay: i * stagger,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {child}
          </motion.div>
        );
      })}
    </div>
  );
}
