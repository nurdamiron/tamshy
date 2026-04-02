import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        tamshy: {
          primary: '#1D9E75',
          'primary-hover': '#0F6E56',
          'primary-light': '#2BBFA0',
          'primary-pale': '#E1F5EE',
          accent: '#F5A623',
          'accent-hover': '#D4891A',
          surface: '#F8FAF9',
          card: '#FFFFFF',
          border: '#E2EDE9',
          text: '#111B17',
          muted: '#5A7A6E',
        },
      },
    },
  },
  plugins: [],
};
export default config;
