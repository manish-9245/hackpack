"use client";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import React from "react";

export const MovingBorder = ({
  children,
  duration = 2000,
  rx,
  ry,
  ...otherProps
}: {
  children: React.ReactNode;
  duration?: number;
  rx?: string;
  ry?: string;
  [key: string]: any;
}) => {
  return (
    <motion.div
      {...otherProps}
      style={{
        "--duration": `${duration}ms`,
      } as any}
      className={cn(
        "relative inline-block",
        otherProps.className
      )}
    >
      <motion.div
        className="absolute inset-0 rounded-lg"
        style={{
          background: "linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6)",
          backgroundSize: "200% 200%",
        }}
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: duration / 1000,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <div className="absolute inset-[2px] bg-black rounded-lg">
        {children}
      </div>
    </motion.div>
  );
};
