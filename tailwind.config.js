/** @type {import('tailwindcss').Config} */
const { heroui } = require("@heroui/react");

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Medical teal as primary brand
        brand: {
          50: "#ECFEFF",
          100: "#CFFAFE",
          200: "#A5F3FC",
          300: "#67E8F9",
          400: "#22D3EE",
          500: "#06B6D4",
          600: "#0891B2",
          700: "#0E7490",
          800: "#155E75",
          900: "#164E63",
        },
        // Warm coral accent for kids touch
        accent: {
          50: "#FFF7ED",
          100: "#FFEDD5",
          200: "#FED7AA",
          300: "#FDBA74",
          400: "#FB923C",
          500: "#F97316",
          600: "#EA580C",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#F8FAFC",
          subtle: "#F1F5F9",
        },
        ink: {
          DEFAULT: "#0F172A",
          muted: "#475569",
          soft: "#64748B",
          faint: "#94A3B8",
        },
        // Backward-compat tokens remapped to new palette
        customPink: "#E0F7FA",
        customPurple: "#0E7490",
      },
      fontFamily: {
        sans: ["var(--font-plus-jakarta)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 1px 2px 0 rgb(15 23 42 / 0.04), 0 1px 3px 0 rgb(15 23 42 / 0.06)",
        card: "0 4px 12px -2px rgb(15 23 42 / 0.06), 0 2px 6px -2px rgb(15 23 42 / 0.08)",
        pop: "0 12px 32px -8px rgb(14 116 144 / 0.18)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            background: "#F8FAFC",
            foreground: "#0F172A",
            divider: "#E2E8F0",
            focus: "#0E7490",
            content1: "#FFFFFF",
            content2: "#F8FAFC",
            content3: "#F1F5F9",
            content4: "#E2E8F0",
            default: {
              50: "#F8FAFC",
              100: "#F1F5F9",
              200: "#E2E8F0",
              300: "#CBD5E1",
              400: "#94A3B8",
              500: "#64748B",
              600: "#475569",
              700: "#334155",
              800: "#1E293B",
              900: "#0F172A",
              DEFAULT: "#F1F5F9",
              foreground: "#0F172A",
            },
            primary: {
              50: "#ECFEFF",
              100: "#CFFAFE",
              200: "#A5F3FC",
              300: "#67E8F9",
              400: "#22D3EE",
              500: "#06B6D4",
              600: "#0891B2",
              700: "#0E7490",
              800: "#155E75",
              900: "#164E63",
              DEFAULT: "#0E7490",
              foreground: "#FFFFFF",
            },
            // Remapped from purple to deep teal so existing
            // color="secondary" usages feel cohesive
            secondary: {
              50: "#ECFEFF",
              100: "#CFFAFE",
              200: "#A5F3FC",
              300: "#67E8F9",
              400: "#22D3EE",
              500: "#06B6D4",
              600: "#0891B2",
              700: "#0E7490",
              800: "#155E75",
              900: "#164E63",
              DEFAULT: "#0E7490",
              foreground: "#FFFFFF",
            },
            success: {
              50: "#ECFDF5",
              100: "#D1FAE5",
              500: "#10B981",
              600: "#059669",
              700: "#047857",
              DEFAULT: "#059669",
              foreground: "#FFFFFF",
            },
            warning: {
              50: "#FFFBEB",
              100: "#FEF3C7",
              500: "#F59E0B",
              600: "#D97706",
              DEFAULT: "#D97706",
              foreground: "#FFFFFF",
            },
            danger: {
              50: "#FEF2F2",
              100: "#FEE2E2",
              500: "#EF4444",
              600: "#DC2626",
              700: "#B91C1C",
              DEFAULT: "#DC2626",
              foreground: "#FFFFFF",
            },
          },
        },
      },
      layout: {
        radius: {
          small: "0.5rem",
          medium: "0.75rem",
          large: "1rem",
        },
      },
    }),
  ],
};
