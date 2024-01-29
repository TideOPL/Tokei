import type { Config } from "tailwindcss"
const iOSHeight = require('@rvxlab/tailwind-plugin-ios-full-height');

const config = {
  content: [
    './src/pages/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/app/**/*.{ts,tsx}',
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
      textColor: {
        primary: '#d926a9',
        secondary: '#1fb2a6'
      },
      backgroundColor: {
        'dark-primary': {
          'pink': '#d926a9',
          'dark': '#1a1b1e',
          'light': '#282b33'
        },
        'light-primary': {
          'light': '#FEFEFE',
          'dark': '#bfbfbf'
        }
      },
      colors: {
        primary: '#d926a9',
        primary_lighter: '#dc3bb1',
        secondary: '#1fb2a6'
      },
      fontFamily: {
        'noto-sans': ['Noto Sans', 'sans-serif']
      }
    },
  },
  plugins: [iOSHeight, require("tailwindcss-animate")],
} satisfies Config

export default config