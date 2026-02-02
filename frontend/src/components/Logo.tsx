import React from 'react';

interface LogoProps {
    className?: string; // For sizing and colors (e.g., "w-10 h-10 text-emerald-500")
    withGlow?: boolean; // Optional glow effect
}

export function Logo({ className = "w-10 h-10", withGlow = false }: LogoProps) {
    return (
        <div className={`relative flex items-center justify-center ${withGlow ? 'drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]' : ''}`}>
            <svg
                className={className}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
            </svg>
        </div>
    );
}
