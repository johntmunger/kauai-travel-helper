/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'region-north': '#3B82F6', // blue
        'region-east': '#10B981', // green
        'region-south': '#F97316', // coral/orange
        'region-west': '#F59E0B', // amber
      },
    },
  },
  plugins: [],
}

