/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark Blue - Primary Color (#17283e)
        primary: {
          50: '#e9ecf0',
          100: '#c8d0da',
          200: '#a4b3c3',
          300: '#8095ac',
          400: '#4c6a89',
          500: '#17283e', // Base Dark Blue
          600: '#132235', // Darker
          700: '#0f1b2b',
          800: '#0b1421',
          900: '#070d17',
        },
        // Golden - Secondary Color (#c28e38)
        secondary: {
          50: '#fdf8ed',
          100: '#f9efd3',
          200: '#f3dfa8',
          300: '#e2c671', // Light Gold (gradient start)
          400: '#d4a94f',
          500: '#c28e38', // Base Golden
          600: '#a87830',
          700: '#8e6328',
          800: '#734e20',
          900: '#593a18',
        },
        // White and Light Grey
        white: '#FFFFFF',
        lightGrey: '#F5F5F5',
        // Accent - Golden variants for consistency
        accent: {
          50: '#fdf8ed',
          100: '#f9efd3',
          200: '#f3dfa8',
          300: '#e2c671',
          400: '#d4a94f',
          500: '#c28e38',
          600: '#a87830',
          700: '#8e6328',
          800: '#734e20',
          900: '#593a18',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Montserrat', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Cormorant', 'Cinzel', 'serif'],
      },
      spacing: {
        '18': '4.5rem',   // 72px
        '88': '22rem',    // 352px
        '100': '25rem',   // 400px
        '120': '30rem',   // 480px
      },
      animation: {
        'gradient': 'gradient 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}