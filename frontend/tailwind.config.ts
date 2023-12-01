import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        title: ['var(--font-suite)'],
        body: ['var(--font-suit)'],
      },
      height: {
        screen: '100svh',
      },
      minHeight: {
        screen: '100svh',
      },
    },
  },
  plugins: [],
}
export default config
