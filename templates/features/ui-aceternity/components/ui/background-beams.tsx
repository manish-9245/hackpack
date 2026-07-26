"use client";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export const BackgroundBeams = ({
  className,
}: {
  className?: string;
}) => (
  <motion.div
    className={cn(
      "absolute inset-0 opacity-40",
      className
    )}
    animate={{
      rotate: 360,
    }}
    transition={{
      duration: 20,
      repeat: Infinity,
      ease: "linear",
    }}
  >
    <svg className="w-full h-full" viewBox="0 0 1000 1000">
      <defs>
        <linearGradient id="beam" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "rgb(59, 130, 246)", stopOpacity: 0.5 }} />
          <stop offset="100%" style={{ stopColor: "rgb(139, 92, 246)", stopOpacity: 0 }} />
        </linearGradient>
      </defs>
      <circle cx="500" cy="500" r="300" fill="none" stroke="url(#beam)" strokeWidth="2" />
      <circle cx="500" cy="500" r="450" fill="none" stroke="url(#beam)" strokeWidth="1" opacity="0.5" />
    </svg>
  </motion.div>
);
