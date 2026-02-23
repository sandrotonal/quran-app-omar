/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Semantic Colors (Renamed to avoid collisions)
                'theme-bg': 'rgb(var(--bg-primary) / <alpha-value>)',
                'theme-surface': 'rgb(var(--bg-surface) / <alpha-value>)',
                'theme-text': 'rgb(var(--text-primary) / <alpha-value>)',
                'theme-muted': 'rgb(var(--text-muted) / <alpha-value>)',
                'theme-border': 'rgb(var(--border) / <alpha-value>)',
                accent: 'rgb(var(--accent) / <alpha-value>)',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                arabic: ['Amiri', 'Traditional Arabic', 'serif'],
            },
            boxShadow: {
                'glow-emerald': '0 0 20px -5px rgba(16, 185, 129, 0.4)',
                'glow-amber': '0 0 20px -5px rgba(245, 158, 11, 0.4)',
            },
            animation: {
                'border-glow': 'borderGlow 4s ease-in-out infinite',
                'float-up': 'floatUp 6s ease-in-out infinite',
                'breathe': 'breathe 4s ease-in-out infinite',
                'gradient-shift': 'gradientShift 8s ease-in-out infinite',
                'count-pulse': 'countPulse 2s ease-in-out infinite',
                'orbit': 'orbit 20s linear infinite',
                'shimmer-fast': 'shimmerFast 3s ease-in-out infinite',
            },
            keyframes: {
                borderGlow: {
                    '0%, 100%': { boxShadow: '0 0 15px -3px rgba(16, 185, 129, 0.15), inset 0 0 15px -3px rgba(16, 185, 129, 0.05)' },
                    '50%': { boxShadow: '0 0 30px -3px rgba(16, 185, 129, 0.3), inset 0 0 30px -3px rgba(16, 185, 129, 0.1)' },
                },
                floatUp: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-6px)' },
                },
                breathe: {
                    '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
                    '50%': { opacity: '0.8', transform: 'scale(1.05)' },
                },
                gradientShift: {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
                countPulse: {
                    '0%, 100%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.03)' },
                },
                orbit: {
                    '0%': { transform: 'rotate(0deg) translateX(60px) rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg) translateX(60px) rotate(-360deg)' },
                },
                shimmerFast: {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(100%)' },
                },
            },
        },
    },
    plugins: [],
}
