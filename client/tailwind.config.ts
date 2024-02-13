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
  darkMode: 'class',
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
        "shake3": {
          "0%": {
            transform: "rotate(0deg)",
          },
          "25%": {
            transform: "rotate(2deg)",
          },
          "50%": {
            transform: "rotate(0deg)",
          },
          "75%": {
            transform: "rotate(-2deg)",
          },
          "100%": {
            transform: "rotate(0deg)",
          },
        },
      },
      textColor: {
        primary: '#F3A5DE',
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
        primary: '#C97BB7',
        primary_lighter: '#CC94BE',
        secondary: '#1fb2a6'
      },
      fontFamily: {
        'noto-sans': ['Noto Sans', 'sans-serif']
      },
      animation: {
        "shake": "shake3 0.2s",
        "accordion-up": "accordion-up 0.2s ease-out",
        "scroll": "scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite",
        "meteor-effect": "meteor 5s linear infinite",
        "shimmer": "shimmer 2s linear infinite",

      },
    },
  },
  plugins: [iOSHeight, require('tailwindcss-animate')],
} satisfies Config

export default config