/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // New Poule & Poulette color scheme
        olive: '#1C3834',      // primair
        ppwhite: '#FBFBF1',    // off white background
        christmas: '#93231F',  // secundair accent (dieprood)
        lollypop: '#F495BD',   // roze accent
        ppblack: '#060709',    // bijna zwart (tekstkleur)
        creme: '#FDF8C1',      // zachte achtergrond
        
        // Updated primary colors based on olive
        primary: {
          50: '#f0f4f3',
          100: '#dce6e3',
          200: '#b9cdc7',
          300: '#96b4ab',
          400: '#739b8f',
          500: '#508273',
          600: '#3d6659',
          700: '#2a4a3f',
          800: '#1C3834',  // Main olive color
          900: '#0f1c1a',
        },
        // Updated accent colors based on christmas red
        accent: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#93231F',  // Main christmas color
          900: '#7f1d1d',
        },
        // Pink accent colors based on lollypop
        pink: {
          50: '#fef7f3',
          100: '#fdeee7',
          200: '#fbddcf',
          300: '#f9ccb7',
          400: '#f7bb9f',
          500: '#f5aa87',
          600: '#f3996f',
          700: '#f18857',
          800: '#ef773f',
          900: '#F495BD',  // Main lollypop color
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
      },
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', 'Segoe UI', 'Roboto', 'system-ui', 'sans-serif'],
        display: ['Inter', 'SF Pro Display', 'Segoe UI', 'Roboto', 'system-ui', 'sans-serif'],
        body: ['Inter', 'SF Pro Text', 'Segoe UI', 'Roboto', 'system-ui', 'sans-serif'],
        bacon: ['Bacon Kingdom', 'comic sans ms', 'cursive'],
      },
      fontWeight: {
        thin: '100',
        extralight: '200',
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
        black: '900',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
}
