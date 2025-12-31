import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary - Coach Energy
        'coach-charcoal': '#1A1A1A',
        'coach-slate': '#2D2D2D',
        'focus-orange': '#E85A24',
        'focus-orange-soft': '#FF7A47',
        // Achievement & Status
        'streak-gold': '#F5B800',
        'success-green': '#22C55E',
        'warning-red': '#EF4444',
        'rest-blue': '#3B82F6',
        // Neutrals
        'paper': '#FAFAF9',
        'warm-gray': '#E7E5E4',
        'medium-gray': '#A8A29E',
        'text-primary': '#1C1917',
        'text-secondary': '#57534E',
      },
      fontFamily: {
        'display': ['Space Mono', 'monospace'],
        'body': ['Outfit', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'streak-pulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'streak-pulse': 'streak-pulse 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
