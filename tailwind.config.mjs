/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0a1628',
          800: '#0f1f3d',
          700: '#162a4a',
        },
        charcoal: {
          900: '#1a1a2e',
          800: '#232340',
        },
        accent: {
          green: '#22c55e',
          'green-light': '#4ade80',
          gold: '#f59e0b',
          'gold-light': '#fbbf24',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
