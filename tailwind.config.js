/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        'skelton-animation': 'from-left-to-right 2s infinite',
      },
      keyframes: {
        'from-left-to-right': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      backgroundImage: {
        'custom-gradient': "radial-gradient(circle at 50% 50%, rgba(34, 34, 102, 0.7) 20%, transparent 100%)",
      }
    },
  },
  plugins: [],
}

