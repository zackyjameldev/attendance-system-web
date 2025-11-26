import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#FFF9F0',
          alt: '#FFF5E3',
        },
        surface: '#FFFFFF',
        primary: {
          DEFAULT: '#F4A300',
          dark: '#D98500',
          muted: '#FFE0A8',
        },
        secondary: {
          DEFAULT: '#2F9E44',
          muted: '#C8F2CF',
        },
        text: {
          DEFAULT: '#1F1B16',
          muted: '#6A5F54',
        },
        border: '#F0E0C2',
        danger: '#D64550',
      },
      spacing: {
        xs: '0.375rem', // 6px
        sm: '0.625rem', // 10px
        md: '1rem',     // 16px
        lg: '1.375rem', // 22px
        xl: '2rem',     // 32px
      },
      borderRadius: {
        sm: '0.625rem', // 10px
        md: '1rem',     // 16px
        lg: '1.625rem', // 26px
      },
      boxShadow: {
        card: '0 12px 24px 0 rgba(244, 163, 0, 0.2)',
      },
    },
  },
  plugins: [],
};

export default config;
