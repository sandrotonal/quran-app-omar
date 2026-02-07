import { useEffect, useState } from 'react';

interface PrayerReminderProps {
    isActive: boolean;
    onDismiss: () => void;
    onSnooze: (duration: number) => void;
    onMute: () => void;
    isMuted: boolean;
    content: { text: string; source: string };
    currentTime: string;
    prayerName?: string;
}

export function PrayerReminder({
    isActive,
    onDismiss,
    onSnooze,
    onMute,
    isMuted,
    content,
    currentTime,
    prayerName = "Vakit Girdi"
}: PrayerReminderProps) {
    const [visible, setVisible] = useState(false);
    const [dismissing, setDismissing] = useState(false); // For micro-interaction

    useEffect(() => {
        if (isActive) {
            setVisible(true);
            setDismissing(false);
            // Lock body scroll
            document.body.style.overflow = 'hidden';
        } else {
            const timer = setTimeout(() => {
                setVisible(false);
                // Unlock body scroll after animation
                document.body.style.overflow = '';
            }, 700);
            return () => {
                clearTimeout(timer);
                document.body.style.overflow = ''; // Ensure unlock on unmount
            };
        }

        // Cleanup on unmount or when isActive changes
        return () => {
            document.body.style.overflow = '';
        };
    }, [isActive]);

    const handleIntention = (action: () => void) => {
        setDismissing(true);
        setTimeout(() => {
            action();
        }, 400); // Wait for micro-animation
    };

    if (!visible) return null;

    return (
        <div className={`fixed inset-0 z-[100] bg-theme-bg text-theme-text flex flex-col items-center justify-between transition-opacity duration-700 font-sans animate-fadeIn
            ${isActive ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>

            {/* Ambient Background */}
            <div className="absolute inset-0 bg-emerald-500/5 dark:bg-indigo-900/10 pointer-events-none"></div>

            {/* Content Container with Focus Mode Animation */}
            <div className={`relative z-10 w-full h-full flex flex-col items-center pt-24 pb-12 px-8 transition-all duration-700
                ${dismissing ? 'scale-95 opacity-0 blur-sm' : 'scale-100 opacity-100 blur-0'}
            `}>

                {/* 1. TIME Section (Top) */}
                <div className="flex-1 flex flex-col items-center justify-center -mt-20 space-y-8 text-center">
                    <h1 className="text-8xl md:text-9xl font-thin tracking-tighter opacity-90 font-mono text-theme-text">
                        {currentTime}
                    </h1>

                    <div className="space-y-4">
                        <p className="text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.3em] text-sm font-bold animate-pulse-slow">
                            {prayerName} VAKTİ
                        </p>
                        <div className="w-12 h-px bg-emerald-500/30 mx-auto"></div>
                    </div>

                    <div className="opacity-80 max-w-md mx-auto">
                        <p className="text-2xl font-serif italic leading-relaxed mb-4 text-theme-text">
                            "{content.text}"
                        </p>
                        <p className="text-xs font-mono opacity-60 text-theme-muted uppercase tracking-widest">
                            {content.source}
                        </p>
                    </div>
                </div>

                {/* 2. INTENTION CHOICES (Bottom) */}
                <div className="w-full max-w-sm space-y-3 relative z-20">
                    <p className="text-center text-xs text-theme-muted uppercase tracking-widest mb-6 opacity-50">
                        Niyetini Belirle
                    </p>

                    {/* Choice 1: Now */}
                    <button
                        onClick={() => handleIntention(onDismiss)}
                        className="group w-full py-4 px-6 rounded-2xl bg-theme-surface border border-theme-border/50 hover:border-emerald-500/30 text-left transition-all hover:shadow-lg hover:shadow-emerald-500/5 active:scale-[0.98]"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-lg font-medium text-theme-text group-hover:text-emerald-600 transition-colors">Şimdi kılacağım</span>
                            <div className="w-5 h-5 rounded-full border border-theme-border group-hover:border-emerald-500 group-hover:bg-emerald-500/10 transition-colors flex items-center justify-center">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                            </div>
                        </div>
                    </button>

                    {/* Choice 2: Later (5 min) */}
                    <button
                        onClick={() => handleIntention(() => onSnooze(5))}
                        className="group w-full py-4 px-6 rounded-2xl bg-transparent border border-transparent hover:bg-theme-surface/50 text-left transition-all active:scale-[0.98]"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-base text-theme-muted group-hover:text-theme-text transition-colors">Birazdan (5 dk)</span>
                        </div>
                    </button>

                    {/* Choice 3: Later (15 min) */}
                    <button
                        onClick={() => handleIntention(() => onSnooze(15))}
                        className="group w-full py-3 px-6 rounded-2xl bg-transparent border border-transparent hover:bg-theme-surface/50 text-left transition-all active:scale-[0.98]"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-base text-theme-muted group-hover:text-theme-text transition-colors">Uygun olunca (15 dk)</span>
                        </div>
                    </button>

                    {/* Choice 4: Not Now (Mute) */}
                    <div className="pt-4 text-center">
                        <button
                            onClick={() => handleIntention(onMute)}
                            className="text-xs text-theme-muted/50 hover:text-theme-muted hover:underline transition-colors"
                        >
                            Bu vakit için hatırlatma istemiyorum
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
