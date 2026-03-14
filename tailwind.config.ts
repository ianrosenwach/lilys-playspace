import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-pink': '#FEF6FB',
        'primary': '#FF4FAE',
        'accent': '#FF78C4',
        'teal': '#30D4A8',
        'teal-dark': '#00A880',
        'dark': '#1A0818',
        'mid-pink': '#7B3566',
        'border-pink': '#FFE0F4',
        'deep-pink': '#C060A0',
        'text-dark': '#3D1030',
      },
      fontFamily: {
        sans: ['-apple-system', 'SF Pro Display', 'BlinkMacSystemFont', 'Helvetica Neue', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '20px',
        '4xl': '24px',
      },
    },
  },
  plugins: [],
}
export default config
