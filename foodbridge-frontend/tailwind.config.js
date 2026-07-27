/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#16211D',
          soft: '#4B5750',
        },
        paper: {
          DEFAULT: '#FBFAF5',
          alt: '#F1EEE3',
        },
        line: '#DED9C9',
        teal: {
          DEFAULT: '#0F5C56',
          deep: '#0A403C',
        },
        amber: {
          DEFAULT: '#E2932B',
          deep: '#B8721A',
        },
        night: {
          DEFAULT: '#10201D',
          soft: '#1A2F29',
        },
        code: {
          bg: '#12211D',
          text: '#DCEAE4',
        },
        red: {
          soft: '#B4502F',
        },
        green: {
          soft: '#3F7D5C',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        body: ['Public Sans', '-apple-system', 'sans-serif'],
        mono: ['IBM Plex Mono', 'Consolas', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '3px',
        sm: '3px',
        md: '3px',
        lg: '4px',
      },
      borderWidth: {
        hairline: '1px',
        accent: '2px',
        thick: '3px',
      },
      boxShadow: {
        flat: 'none',
        floating: '0 4px 20px rgba(22, 33, 29, 0.08)',
      },
      width: {
        sidebar: '292px',
      },
    },
  },
  plugins: [],
};
