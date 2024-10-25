/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        chess: ['Chess', 'ui-sans-serif', 'system-ui', '-apple-system'],
      },
      dropShadow: {
        'piece': '0 2px 2px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
};