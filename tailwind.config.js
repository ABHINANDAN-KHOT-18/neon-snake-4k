/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#050711',
          card: '#0c1022',
          border: '#1a2444',
          neonCyan: '#00f6ff',
          neonPink: '#ff0077',
          neonGreen: '#00ff66',
          neonYellow: '#ffe600',
          neonPurple: '#a855f7',
          neonOrange: '#ff6600',
        }
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        rajdhani: ['Rajdhani', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'neon-cyan': '0 0 15px rgba(0, 246, 255, 0.6), 0 0 30px rgba(0, 246, 255, 0.2)',
        'neon-pink': '0 0 15px rgba(255, 0, 119, 0.6), 0 0 30px rgba(255, 0, 119, 0.2)',
        'neon-green': '0 0 15px rgba(0, 255, 102, 0.6), 0 0 30px rgba(0, 255, 102, 0.2)',
        'neon-yellow': '0 0 15px rgba(255, 230, 0, 0.6), 0 0 30px rgba(255, 230, 0, 0.2)',
        'neon-purple': '0 0 15px rgba(168, 85, 247, 0.6), 0 0 30px rgba(168, 85, 247, 0.2)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'grid-scroll': 'gridScroll 20s linear infinite',
        'radar-sweep': 'radarSweep 4s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 15px rgba(0, 246, 255, 0.8))' },
          '50%': { opacity: '0.7', filter: 'drop-shadow(0 0 5px rgba(0, 246, 255, 0.3))' },
        },
        gridScroll: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '40px 40px' },
        },
      }
    },
  },
  plugins: [],
}
