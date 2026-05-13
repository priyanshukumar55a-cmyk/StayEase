/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.{html,ejs}"],
  theme: {
    extend: {
      colors: {
        // Primary brand colors - warm and inviting
        primary: {
          50: '#fdf8f3',
          100: '#faf0e6',
          200: '#f4dcc9',
          300: '#ecc8ad',
          400: '#e0a878',
          500: '#d4905a', // Primary accent - warm gold
          600: '#c87f48',
          700: '#a86639',
          800: '#8b5434',
          900: '#72452b',
        },
        // Secondary - luxurious rose/coral
        accent: {
          50: '#fdf2f1',
          100: '#fce4e1',
          200: '#f9c9c3',
          300: '#f4a9a0',
          400: '#ed837a',
          500: '#e56b5e', // Secondary accent
          600: '#d94f44',
          700: '#b73f38',
          800: '#963533',
          900: '#7a2d2c',
        },
        // Neutral earth tones
        earth: {
          50: '#f9f8f6',
          100: '#f3f0ed',
          200: '#e8e4dd',
          300: '#ddd8d0',
          400: '#c9bfb3',
          500: '#b5a89b',
          600: '#9d9087',
          700: '#7d7468',
          800: '#5f5954',
          900: '#473f3a',
        },
      },
      backgroundImage: {
        'gradient-warm': 'linear-gradient(135deg, #fdf8f3 0%, #faf0e6 100%)',
        'gradient-sunset': 'linear-gradient(135deg, #e56b5e 0%, #d4905a 100%)',
      },
    },
  },
  plugins: [],
}