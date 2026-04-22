"use client";

import { motion, useReducedMotion } from "framer-motion";
import clsx from "clsx";
import type { ReactNode } from "react";

type Size = "sm" | "md" | "lg";

type Props = {
  children: ReactNode;
  className?: string;
  size?: Size;
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-1 text-sm",
  md: "px-5 py-1.5 text-base",
  lg: "px-7 py-2 text-2xl md:text-4xl lg:text-5xl",
};

/**
 * The gold pill — our signature typographic device (the Chahine take on
 * frieslab's red pill). When children is a string and motion is allowed,
 * letters stagger in from below. Otherwise renders children as-is.
 */
export function Pill({ children, className, size = "md" }: Props) {
  const prefersReduced = useReducedMotion();
  const shouldAnimate = !prefersReduced && typeof children === "string";

  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-pill bg-cs-gold font-display font-black uppercase leading-none text-cs-bg",
        "-skew-x-3",
        sizes[size],
        className
      )}
    >
      <span className="skew-x-3">
        {shouldAnimate
          ? (children as string).split("").map((ch, i) => (
              <motion.span
                key={i}
                initial={{ y: "100%", opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, margin: "-20% 0px" }}
                transition={{
                  delay: i * 0.03,
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{ display: "inline-block" }}
              >
                {ch === " " ? "\u00A0" : ch}
              </motion.span>
            ))
          : children}
      </span>
    </span>
  );
}
