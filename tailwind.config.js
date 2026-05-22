/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'ivory': '#fdfcf0',
        'soft-gold': '#d4af37',
        'deep-slate': '#2f4f4f',
        'sky-blue': '#f0f8ff',
        'warm-grey': '#708090',
        'cloud-white': '#ffffff',
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'serif'],
      },
    },
  },
  plugins: [],
};
