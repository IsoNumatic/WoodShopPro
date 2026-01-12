/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['Inter', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      colors: {
        'bg-dark': '#1A1B1E',
        'bg-light': '#FFFFFF',
        'fg-dark': '#E0E0E0',
        'fg-light': '#333333',
        'muted-dark': '#A0A0A0',
        'muted-light': '#666666',
        accent: '#6C63FF',
        'accent-light': '#8B84FF',
        teal: '#38B2AC',
        white: '#FFFFFF',
        black: '#000000',
      },
      boxShadow: {
        card: '0 4px 6px rgba(0,0,0,0.1)',
        'card-hover': '0 8px 12px rgba(0,0,0,0.15)',
      },
      borderRadius: {
        card: '8px',
        btn: '4px',
        inner: '4px',
      },
    },
  },
  plugins: [],
};