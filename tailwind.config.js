/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage:{
        'back': "url('/back.jpg')",
        'back2': "url('/back2.jpg')",
        'back3': "url('/back3.jpg')",
        'back4': "url('/back4.jpg')",
        'back5': "url('/back5.jpg')",
        'back6': "url('/back6.jpg')",
        'back7': "url('/back7.jpg')",
      }
    },
  },
  plugins: [],
}

