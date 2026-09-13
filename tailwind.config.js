/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          burgundy: '#6D0808',
          'burgundy-hover': '#820a0a',
          maroon: '#2D0000',
          'maroon-dark': '#1c0000',
          sage: '#757D6F',
          'sage-light': '#8e9687',
          'sage-muted': '#a8b0a2',
          cream: '#EEEAD7',
          'cream-light': '#F8F6EC',
          'cream-dark': '#E2DDC7',
          'cream-border': '#D8D2BC',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
