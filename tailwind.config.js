/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage:{
        'back1': "url('src/assets/back.jpg')",
        'back2': "url('src/assets/back2.jpg')",
        'back3': "url('src/assets/back3.jpg')",
        'back4': "url('src/assets/back4.jpg')",
        'back5': "url('src/assets/back5.jpg')",
        'back6': "url('src/assets/back6.jpg')",
        'back7': "url('src/assets/back7.jpg')",
      }
    },
  },
  plugins: [],
}

