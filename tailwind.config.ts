import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#FBF9F5',
          subtle: '#F4F0E8',
          card: '#FFFFFF',
          raised: '#FFFFFF',
          dark: '#1C1A17',
          'dark-subtle': '#25221E',
        },
        ink: {
          DEFAULT: '#181715',
          secondary: '#3E3A34',
          muted: '#6E695F',
          faint: '#9C968B',
          inverted: '#FBF9F5',
        },
        sand: {
          50: '#FAF8F4',
          100: '#F5F1EB',
          200: '#EAE5DB',
          300: '#DFD7CB',
          400: '#C7BCAC',
          500: '#AFA18E',
          600: '#8C7E6C',
          700: '#695E50',
          800: '#484037',
          900: '#27231E',
        },
        terracotta: {
          50: '#FBF4F1',
          100: '#F5E6E1',
          200: '#ECCDC3',
          300: '#DEACA0',
          400: '#CF8473',
          500: '#B85D43',
          600: '#9E4A32',
          700: '#7E3925',
          800: '#5F291A',
          900: '#411B10',
        },
        olive: {
          50: '#F3F5F2',
          100: '#E5EAE2',
          200: '#CBD6C6',
          300: '#ABBEA3',
          400: '#879F7E',
          500: '#637E5A',
          600: '#4E6546',
          700: '#3D5036',
          800: '#2D3B28',
          900: '#1D2619',
        },
      },
      fontFamily: {
        serif: ['var(--font-editorial)', 'Georgia', 'Cambria', 'serif'],
        sans: ['var(--font-sans)', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      borderRadius: {
        none: '0px',
        xs: '2px',
        sm: '4px',
        DEFAULT: '6px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
      boxShadow: {
        fine: '0 1px 2px 0 rgba(28, 25, 23, 0.04)',
        subtle: '0 1px 3px 0 rgba(28, 25, 23, 0.06), 0 1px 2px -1px rgba(28, 25, 23, 0.06)',
        card: '0 4px 16px -2px rgba(28, 25, 23, 0.05), 0 2px 6px -1px rgba(28, 25, 23, 0.03)',
        elevated: '0 12px 32px -4px rgba(28, 25, 23, 0.08), 0 4px 12px -2px rgba(28, 25, 23, 0.04)',
      },
    },
  },
  plugins: [],
};

export default config;
