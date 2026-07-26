"use client";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export const ShimmerButton = ({
  children,
  className,
  shimmerColor = "rgba(255, 255, 255, 0.3)",
  shimmerSize = "0.05em",
  shimmerDuration = "3s",
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  shimmerColor?: string;
  shimmerSize?: string;
  shimmerDuration?: string;
  [key: string]: any;
}) => {
  return (
    <motion.button
      {...props}
      className={cn(
        "relative px-6 py-2 font-medium rounded-lg overflow-hidden",
        "bg-gradient-to-r from-blue-500 to-purple-600 text-white",
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="absolute inset-0 opacity-0"
        style={{
          background: `linear-gradient(90deg, transparent, ${shimmerColor}, transparent)`,
        }}
        animate={{
          x: ["0%", "100%"],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};
