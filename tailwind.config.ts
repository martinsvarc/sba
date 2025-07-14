import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
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
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
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
        accent: {
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
        gold: {
          50: "#FFF9EB",
          100: "#FFF3D6",
          200: "#FFE7AD",
          300: "#FFDA85",
          400: "#FFCE5C",
          500: "#E7C078", // Updated to match requested gold color
          600: "#DBAB2C",
          700: "#B78E25",
          800: "#93721E",
          900: "#705617",
          950: "#4D3B10",
        },
        // New custom colors based on user's request
        custom: {
          black: "#0A0A0A",
          gold: "#E7C078",
          white: "#F7F5F0",
          bronze: "#7A5C2E",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
        "pulse-slow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-2px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(2px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0) translateZ(0) rotateX(0) rotateY(0)" },
          "25%": { transform: "translateY(-5px) translateZ(5px) rotateX(2deg) rotateY(1deg)" },
          "50%": { transform: "translateY(0) translateZ(10px) rotateX(0) rotateY(0)" },
          "75%": { transform: "translateY(5px) translateZ(5px) rotateX(-2deg) rotateY(-1deg)" },
        },
        tilt: {
          "0%, 100%": { transform: "rotateX(0deg) rotateY(0deg)" },
          "25%": { transform: "rotateX(1deg) rotateY(1deg)" },
          "75%": { transform: "rotateX(-1deg) rotateY(-1deg)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-slow": "pulse-slow 3s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 8s ease-in-out infinite",
        shake: "shake 0.5s cubic-bezier(.36,.07,.19,.97) both",
        "float-slow": "float-slow 8s ease-in-out infinite",
        tilt: "tilt 6s ease-in-out infinite",
        fadeIn: "fadeIn 0.5s ease-out forwards",
        scaleIn: "scaleIn 0.5s ease-out forwards",
        slideUp: "slideUp 0.5s ease-out forwards",
      },
      boxShadow: {
        glow: "0 0 15px rgba(231, 192, 120, 0.5)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        shimmer: "linear-gradient(90deg, transparent, rgba(231, 192, 120, 0.1), transparent)",
      },
      perspective: {
        none: "none",
        "500": "500px",
        "800": "800px",
        "1000": "1000px",
        "1200": "1200px",
      },
      transformStyle: {
        flat: "flat",
        "3d": "preserve-3d",
      },
      backfaceVisibility: {
        visible: "visible",
        hidden: "hidden",
      },
      translate: {
        "z-0": "translateZ(0px)",
        "z-2": "translateZ(2px)",
        "z-4": "translateZ(4px)",
        "z-6": "translateZ(6px)",
        "z-8": "translateZ(8px)",
        "z-12": "translateZ(12px)",
        "z-16": "translateZ(16px)",
        "z-20": "translateZ(20px)",
        "z-24": "translateZ(24px)",
        "z-32": "translateZ(32px)",
      },
      rotate: {
        "y-0": "rotateY(0deg)",
        "y-90": "rotateY(90deg)",
        "y-minus-90": "rotateY(-90deg)",
        "x-0": "rotateX(0deg)",
        "x-90": "rotateX(90deg)",
        "x-minus-90": "rotateX(-90deg)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
