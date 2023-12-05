import { type Config } from "tailwindcss";
const iOSHeight = require('@rvxlab/tailwind-plugin-ios-full-height');

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
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
  plugins: [
    iOSHeight,
  ],
} satisfies Config;
