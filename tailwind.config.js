export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brandGreen: '#25D366',
        brandDark: '#111B21',
        brandBg: '#F7F3ED',
        brandText: '#667085',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 18px 55px rgba(17, 27, 33, 0.08)',
      },
    },
  },
  plugins: [],
}
