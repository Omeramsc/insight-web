/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        ink: '#0A0A0F',
        surface: '#111118',
        'surface-2': '#1A1A24',
        border: '#2A2A38',
        accent: '#6C8EFF',
        'accent-2': '#FF6B6B',
        'text-primary': '#F0F0F8',
        'text-secondary': '#9090A8',
        'text-muted': '#505068',
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        display: ['Geist', '"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"Geist Mono"', 'ui-monospace', 'monospace'],
      },
      maxWidth: {
        '7xl': '80rem',
      },
    },
  },
  plugins: [],
};
