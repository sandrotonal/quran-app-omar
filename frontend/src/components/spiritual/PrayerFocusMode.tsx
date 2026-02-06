
import { useState, useEffect } from 'react';

interface PrayerFocusModeProps {
    isActive: boolean;
    onExit: () => void;
    currentPrayer?: string;
    suggestion?: { topic: string; ayetLink?: string };
}

export function PrayerFocusMode({ isActive, onExit, currentPrayer, suggestion }: PrayerFocusModeProps) {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        if (!isActive) return;
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, [isActive]);

    if (!isActive) return null;

    return (
        <div className="fixed inset-0 z-50 bg-theme-bg text-theme-text flex flex-col items-center justify-center transition-opacity duration-700 animate-fadeIn">
            {/* Ambient Background - Adaptive */}
            <div className="absolute inset-0 bg-emerald-500/5 dark:bg-indigo-900/10 pointer-events-none"></div>

            {/* Content Container */}
            <div className="text-center space-y-12 relative z-10 max-w-md px-6">

                {/* 1. Time (Huge & Thin) */}
                <h1 className="text-8xl md:text-9xl font-thin tracking-tighter opacity-90 font-mono text-theme-text">
                    {currentTime.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                </h1>

                {/* 2. Prayer Name */}
                <div className="space-y-4">
                    <p className="text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.3em] text-sm font-bold">
                        {currentPrayer || 'HUZUR VAKTİ'}
                    </p>
                    <div className="w-12 h-px bg-emerald-500/30 mx-auto"></div>
                </div>

                {/* 3. Contextual Ayet/Quote */}
                {suggestion && (
                    <div className="opacity-80">
                        <p className="text-2xl font-serif italic leading-relaxed mb-4 text-theme-text">
                            "{suggestion.topic}"
                        </p>
                        {suggestion.ayetLink && (
                            <span className="px-3 py-1 border border-theme-border rounded-full text-xs font-mono opacity-60 text-theme-muted">
                                {suggestion.ayetLink}
                            </span>
                        )}
                    </div>
                )}

                {/* 4. Exit Button (Subtle yet visible) */}
                <button
                    onClick={onExit}
                    className="mt-20 text-theme-muted hover:text-emerald-500 transition-colors text-sm uppercase tracking-widest border-b border-transparent hover:border-emerald-500/50 pb-1"
                >
                    Modu Kapat
                </button>
            </div>
        </div>
    );
}
