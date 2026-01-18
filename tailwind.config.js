/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark Emerald Green - Primary color
        emerald: {
          DEFAULT: '#003900',
          50: '#E6F2E6',
          100: '#CCE5CC',
          200: '#99CC99',
          300: '#66B266',
          400: '#339933',
          500: '#003900',
          600: '#002E00',
          700: '#002400',
          800: '#001A00',
          900: '#001000',
        },
        // Cream - Secondary color
        cream: {
          DEFAULT: '#FFFFCC',
          50: '#FFFFFE',
          100: '#FFFFFD',
          200: '#FFFFFB',
          300: '#FFFFF9',
          400: '#FFFFF7',
          500: '#FFFFCC',
          600: '#FFFFB3',
          700: '#FFFF99',
          800: '#FFFF80',
          900: '#FFFF66',
        },
        // For convenience, map to semantic names
        primary: {
          DEFAULT: '#003900', // Dark Emerald Green
          50: '#E6F2E6',
          100: '#CCE5CC',
          200: '#99CC99',
          300: '#66B266',
          400: '#339933',
          500: '#003900',
          600: '#002E00',
          700: '#002400',
          800: '#001A00',
          900: '#001000',
        },
        secondary: {
          DEFAULT: '#FFFFCC', // Cream
          50: '#FFFFFE',
          100: '#FFFFFD',
          200: '#FFFFFB',
          300: '#FFFFF9',
          400: '#FFFFF7',
          500: '#FFFFCC',
          600: '#FFFFB3',
          700: '#FFFF99',
          800: '#FFFF80',
          900: '#FFFF66',
        },
        accent: {
          DEFAULT: '#003900', // Dark Emerald Green
          50: '#E6F2E6',
          100: '#CCE5CC',
          200: '#99CC99',
          300: '#66B266',
          400: '#339933',
          500: '#003900',
          600: '#002E00',
          700: '#002400',
          800: '#001A00',
          900: '#001000',
        },
        // Remove old color mappings
        wasabi: {
          DEFAULT: '#003900', // Map to dark emerald green
        },
        khaki: {
          DEFAULT: '#FFFFCC', // Map to cream
        },
        earth: {
          DEFAULT: '#003900', // Map to dark emerald green
        },
        noir: {
          DEFAULT: '#003900', // Map to dark emerald green
        },
        warning: {
          DEFAULT: '#003900', // Map to dark emerald green
        },
        dark: {
          DEFAULT: '#003900', // Map to dark emerald green
        },
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
} 