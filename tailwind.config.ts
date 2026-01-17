import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Background tiers
        canvas: '#1c2128',
        surface: '#22272e',
        overlay: '#2d333b',
        inset: '#161b22',

        // Border
        border: {
          DEFAULT: '#373e47',
          muted: '#30363d',
          emphasis: '#444c56',
        },

        // Foreground / Text
        fg: {
          DEFAULT: '#adbac7',
          secondary: '#768390',
          muted: '#545d68',
          link: '#539bf5',
          inverse: '#1c2128',
        },

        // Accent
        accent: {
          DEFAULT: '#539bf5',
          secondary: '#316dca',
          subtle: '#1f3855',
        },

        // State colors
        success: '#57ab5a',
        warning: '#c69026',
        error: '#e5534b',
        info: '#539bf5',

        // Entity type colors
        entity: {
          character: '#a371f7',
          location: '#57ab5a',
          item: '#c69026',
          event: '#e5534b',
          concept: '#539bf5',
        },
      },

      fontFamily: {
        sans: ['var(--font-inter)', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'Fira Code', 'monospace'],
        serif: ['var(--font-merriweather)', 'Georgia', 'serif'],
      },

      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
      },

      borderRadius: {
        sm: '0.25rem',
        DEFAULT: '0.375rem',
        md: '0.375rem',
        lg: '0.5rem',
      },

      boxShadow: {
        panel: '0 1px 3px 0 rgba(0, 0, 0, 0.3)',
        dropdown: '0 4px 12px 0 rgba(0, 0, 0, 0.4)',
        modal: '0 8px 24px 0 rgba(0, 0, 0, 0.5)',
      },

      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in-from-top': {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },

      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
        'slide-in': 'slide-in-from-top 0.2s ease-out',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;
