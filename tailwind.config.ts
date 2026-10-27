import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#000000',
        'bg-2': '#0a0a0b',
        surface: '#1c1c1e',
        'surface-2': '#232325',
        elev: '#2c2c2e',
        'elev-2': '#3a3a3c',
        fill: '#2c2c2e',
        glass: 'rgba(22, 22, 24, 0.72)',
        hairline: 'rgba(255, 255, 255, 0.09)',
        'hairline-2': 'rgba(255, 255, 255, 0.18)',
        fg: '#f5f5f7',
        'fg-strong': '#ffffff',
        'fg-2': '#a1a1a6',
        'fg-3': '#86868b',
        'on-fg': '#0b0b0c',
        accent: '#f3ff34',
        'on-accent': '#0b0b0c',
        'accent-soft': 'rgba(243, 255, 52, 0.14)',
        'accent-hover': '#f8ff7a',
        ok: '#3ddc84',
        'ok-soft': 'rgba(61, 220, 132, 0.14)',
        warn: '#ffb547',
        'warn-soft': 'rgba(255, 181, 71, 0.14)',
        info: '#6cc6ff',
        'info-soft': 'rgba(108, 198, 255, 0.14)',
        bad: '#ff5a4f',
        'bad-soft': 'rgba(255, 90, 79, 0.14)',
      },
      fontFamily: {
        head: ['var(--font-tomorrow)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['var(--font-rubik)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xs: '4px',
        sm: '10px',
        DEFAULT: '16px',
        lg: '22px',
        pill: '999px',
      },
    },
  },
  plugins: [],
};

export default config;

