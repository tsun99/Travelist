/** @type {import('tailwindcss').Config} */
export default {
  mode: 'jit',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
      screens: {
        sm: '100%',
        md: '100%',
        lg: '100%',
        xl: '1280px',
      },
    },
    colors: {
      current: 'currentColor',
      black: '#000000',
      white: '#ffffff',
      green: '#177542',
      gray: '#F1F1F1',
      'black-hover': '#333',
      'green-hover': '#178B4C',
      'gray-hover': '#E7E6E6',
      red: 'red',
      blue: '#0000FF',
      'blue-hover': '#0080ff',
      'bright-blue': '#007FFF',
      'red-hover': '#e66e6e',
      'gray-comment': '#f3f4f6',
    },
  },
  plugins: [],
};
