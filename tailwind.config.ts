import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./app/**/*.{ts,tsx}','./components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['DM Serif Display','Georgia','serif'],
        body: ['Plus Jakarta Sans','system-ui','sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
