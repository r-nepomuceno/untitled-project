import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Neutral palette
        neutral: {
          50: "#F9F9F9",
          100: "#EEEBE5",
          200: "#D5D0C8",
          400: "#8B8680",
          600: "#4A4641",
          800: "#2B2622",
          900: "#111111",
        },
        // Accent (yellow)
        accent: {
          DEFAULT: "#F5D547",
          hover: "#E8C935",
          light: "#FEF5D6",
        },
        // Semantic colors
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",
        info: "#3B82F6",
        // Legacy/Compatibility colors
        background: "#F6F1E7",
        surface: "#FFFFFF",
        "text-primary": "#111111",
        "text-secondary": "#4A4641",
        border: "#EEEBE5",
        // shadcn/ui colors (kept for compatibility)
        "shadcn-border": "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        "shadcn-background": "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        "shadcn-accent": {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        sans: ["Geist Sans", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1.4" }],      // 12px
        sm: ["0.875rem", { lineHeight: "1.5" }],     // 14px
        base: ["1rem", { lineHeight: "1.6" }],       // 16px
        lg: ["1.125rem", { lineHeight: "1.6" }],     // 18px
        xl: ["1.25rem", { lineHeight: "1.3" }],      // 20px
        "2xl": ["1.5rem", { lineHeight: "1.3" }],    // 24px
        "3xl": ["2rem", { lineHeight: "1.3" }],     // 32px
        "4xl": ["2.5rem", { lineHeight: "1.2" }],    // 40px
        "5xl": ["3.5rem", { lineHeight: "1.1" }],    // 56px (hero)
        // Legacy aliases
        display: ["3.5rem", { lineHeight: "1.1" }],
        headline: ["2rem", { lineHeight: "1.2" }],
        subheadline: ["1.25rem", { lineHeight: "1.4" }],
        body: ["1rem", { lineHeight: "1.6" }],
      },
      spacing: {
        xs: "0.25rem",   // 4px
        sm: "0.5rem",    // 8px
        md: "1rem",      // 16px
        lg: "1.5rem",    // 24px
        xl: "2rem",      // 32px
        "2xl": "3rem",   // 48px
        "3xl": "4rem",   // 64px
      },
      boxShadow: {
        sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
        DEFAULT: "0 1px 3px rgba(0, 0, 0, 0.06)",
        md: "0 4px 12px rgba(0, 0, 0, 0.08)",
        lg: "0 8px 24px rgba(0, 0, 0, 0.1)",
        // Legacy
        elevation: "0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)",
        "elevation-sm": "0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.03)",
        "elevation-md": "0 4px 12px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)",
        "elevation-lg": "0 8px 24px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.08)",
      },
      borderRadius: {
        sm: "0.375rem",  // 6px
        DEFAULT: "0.5rem", // 8px
        md: "0.75rem",   // 12px
        lg: "1rem",      // 16px
        xl: "1rem",
        "2xl": "1.5rem",
        // Legacy
        "var-radius": "var(--radius)",
        "var-radius-md": "calc(var(--radius) - 2px)",
        "var-radius-sm": "calc(var(--radius) - 4px)",
      },
      transitionProperty: {
        default: "color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter",
      },
      transitionDuration: {
        default: "200ms",
      },
      transitionTimingFunction: {
        default: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      backgroundImage: {
        contours: "url('/textures/contours.svg')",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config

