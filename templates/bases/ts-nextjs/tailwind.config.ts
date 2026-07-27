import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#3b82f6", dark: "#1e40af", light: "#60a5fa" },
        success: { DEFAULT: "#10b981", dark: "#059669", light: "#6ee7b7" },
        warning: { DEFAULT: "#f59e0b", dark: "#d97706", light: "#fbbf24" },
        error: { DEFAULT: "#ef4444", dark: "#dc2626", light: "#f87171" },
        accent: { pink: "#ec4899", purple: "#8b5cf6", orange: "#f97316", indigo: "#6366f1" },
        surface: { base: "#0f172a", elevated: "#1a2a4a", muted: "#1e293b" },
      },
    },
  },
  plugins: [],
} satisfies Config;
