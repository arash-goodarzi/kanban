/** @type {import('tailwindcss').Config} */
export default {
  content: ["index.html","./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors:{
        "primaryMainBackgroundColor": '#0D1117',
        "primaryColumnBackgroundColor":'#161C22'
      }
    },
  },
  plugins: [],
}

