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
          primary: '#0284C7',
          'primary-hover': '#0369A1',
          'primary-light': '#38BDF8',
          'primary-pale': '#E0F2FE',
          accent: '#F59E0B',
          'accent-hover': '#D97706',
          surface: '#F8FAFC',
          card: '#FFFFFF',
          border: '#E2E8F0',
          text: '#0F172A',
          muted: '#64748B',
        },
      },
    },
  },
  plugins: [],
};
export default config;
