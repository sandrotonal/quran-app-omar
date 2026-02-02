/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
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
