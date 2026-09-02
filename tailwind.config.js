/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        questDark: '#0d1117',
        questPanel: '#161b22',
        questBorder: '#30363d',
        questAccent: '#38bdf8',
      },
    },
  },
  plugins: [],
};
