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
        'accent-amber': '#F59E0B',
        'text-primary': '#F0F0F8',
        'text-secondary': '#9090A8',
        'text-muted': '#8585A0',
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        display: ['Geist', '"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"Geist Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'body-sm':  ['1rem',    { lineHeight: '1.6' }],   // 16px — minimum body
        'body':     ['1.125rem',{ lineHeight: '1.6' }],   // 18px — comfortable body
        'subtitle': ['1.25rem', { lineHeight: '1.4' }],   // 20px — subtitles
        'heading':  ['1.75rem', { lineHeight: '1.2' }],   // 28px — section headings
        'display':  ['2rem',    { lineHeight: '1.1' }],   // 32px — display headings
      },
      maxWidth: {
        '7xl': '80rem',
      },
    },
  },
  plugins: [],
};
