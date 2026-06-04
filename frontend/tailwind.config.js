/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      colors: {
        'custom-blue': '#E5F4FF',
        'custom-border': '#00599D',
        'custom-footer-border': '#B7E0FF',
        'primary': '#0070C6',
        'primary-border': '#0088EF',
        'primary-hover': '#8ACCFF',
        'primary-pressed': '#004275',
        'primary-focus': '#0088EF',
        'primary-text': '#31373C',
        'general-text': '#111111',
        'input-border': '#454D53',
        'general-border': '#5CB8FF',
        'custom-disable': '#CDD5DB',
        'custom_disable_text': '#9DA6AE',
        'login-text': '#6F7980'
      },
    },
  },
  plugins: [],
}
