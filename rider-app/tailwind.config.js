/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rider: {
          bg: '#ffffff',
          card: '#f8fafc',
          accent: '#10b981',
          primary: '#6366f1',
          danger: '#ef4444',
        }
      }
    },
  },
  plugins: [],
}
