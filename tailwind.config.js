export default {
  content: [
    './index.html',
    './src/**/*.{vue,ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'zc-primary': 'var(--zc-primary)',
        'zc-primary-strong': 'var(--zc-primary-strong)',
        'zc-ink': 'var(--zc-ink)',
        'zc-body': 'var(--zc-body)',
        'zc-muted': 'var(--zc-muted)',
        'zc-bg': 'var(--zc-bg)',
        'zc-surface': 'var(--zc-surface)',
        'zc-border': 'var(--zc-border)',
        'zc-dark': 'var(--zc-dark)',
      },
      fontFamily: {
        serif: 'var(--font-serif)',
        condensed: 'var(--font-condensed)',
        sans: 'var(--font-sans)',
      },
    },
  },
  plugins: [],
};