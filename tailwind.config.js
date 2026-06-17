/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg:      '#0A0A0A',
        surface: '#141414',
        accent:  '#E8FF00',
        primary: '#F5F5F5',
        muted:   '#888888',
        border:  '#2A2A2A',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body:    ['Inter', 'sans-serif'],
        mono:    ['"Space Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
