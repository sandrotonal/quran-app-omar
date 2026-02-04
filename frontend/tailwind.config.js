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
            }
        },
    },
    plugins: [],
}
