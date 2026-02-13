/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        olive: {
          50: '#f5f7f0',
          100: '#e8eddb',
          200: '#d1dbb7',
          300: '#b3c28d',
          400: '#9aaf6f',
          500: '#808000', // Classic olive green
          600: '#6b8e23', // Olive drab
          700: '#556b2f', // Dark olive
          800: '#4a5d23',
          900: '#3d4d1e',
          // More visible button colors
          btn: '#5a7a1f', // Darker olive for buttons
          'btn-dark': '#4a5d23', // Even darker for hover
        },
        primary: {
          50: '#f5f7f0',
          100: '#e8eddb',
          200: '#d1dbb7',
          300: '#b3c28d',
          400: '#9aaf6f',
          500: '#808000',
          600: '#6b8e23',
          700: '#556b2f',
          800: '#4a5d23',
          900: '#3d4d1e',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
