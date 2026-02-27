import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface PrayerFocusModeProps {
    isActive: boolean;
    onExit: () => void;
    currentPrayer?: string;
    suggestion?: { topic: string; ayetLink?: string };
}

function useIsDark() {
    const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));
    useEffect(() => {
        const obs = new MutationObserver(() =>
            setDark(document.documentElement.classList.contains('dark'))
        );
        obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => obs.disconnect();
    }, []);
    return dark;
}

function PulseRing({ size, delay, opacity, dark }: { size: number; delay: number; opacity: number; dark: boolean }) {
    return (
        <div
            className="absolute rounded-full pointer-events-none animate-ping"
            style={{
                width: size, height: size,
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                border: `1px solid ${dark ? 'rgba(52,211,153,0.30)' : 'rgba(16,185,129,0.20)'}`,
                animationDuration: '3s',
                animationDelay: `${delay}s`,
                opacity,
            }}
        />
    );
}

function Star({ x, y, size, dur, dark }: { x: number; y: number; size: number; dur: number; dark: boolean }) {
    return (
        <div
            className="absolute rounded-full animate-pulse pointer-events-none"
            style={{
                left: `${x}%`, top: `${y}%`, width: size, height: size,
                background: dark ? 'rgba(52,211,153,0.20)' : 'rgba(16,185,129,0.12)',
                animationDuration: `${dur}s`,
            }}
        />
    );
}

const STARS = [
    { x: 15, y: 20, size: 3, dur: 2.1 }, { x: 80, y: 10, size: 2, dur: 3.4 },
    { x: 90, y: 70, size: 4, dur: 2.7 }, { x: 5, y: 75, size: 2, dur: 4.0 },
    { x: 50, y: 5, size: 3, dur: 3.2 }, { x: 70, y: 88, size: 2, dur: 2.5 },
    { x: 25, y: 90, size: 3, dur: 3.8 }, { x: 92, y: 40, size: 2, dur: 2.2 },
];

export function PrayerFocusMode({ isActive, onExit, currentPrayer, suggestion }: PrayerFocusModeProps) {
    const dark = useIsDark();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [phase, setPhase] = useState<'in' | 'idle' | 'out'>('in');

    useEffect(() => {
        if (isActive) {
            setPhase('in');
            // Scrollbar kaybolunca oluşan layout shift'i önle
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = `${scrollbarWidth}px`;
            const t = setTimeout(() => setPhase('idle'), 700);
            return () => clearTimeout(t);
        } else {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        }
    }, [isActive]);

    useEffect(() => {
        if (!isActive) return;
        const id = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(id);
    }, [isActive]);

    useEffect(() => {
        if (!isActive) return;

        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        const originalContent = metaThemeColor?.getAttribute('content');

        // Odak modunun o anki dark/light modu rengi
        const focusBgColor = dark ? '#070f1a' : '#f0fdf4';

        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', focusBgColor);
        }

        return () => {
            if (metaThemeColor && originalContent) {
                // Modül kapanırken eski orjinal renge geri dön
                metaThemeColor.setAttribute('content', originalContent);
            }
        };
    }, [isActive, dark]);

    const handleExit = () => {
        setPhase('out');
        setTimeout(onExit, 600);
    };

    if (!isActive) return null;

    const timeStr = currentTime.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

    const D = dark;
    const bg = D ? '#070f1a' : '#f0fdf4';
    const radialGlow = D
        ? 'radial-gradient(ellipse 70% 55% at 50% 45%, rgba(16,185,129,0.11) 0%, transparent 70%)'
        : 'radial-gradient(ellipse 70% 55% at 50% 45%, rgba(16,185,129,0.13) 0%, transparent 70%)';
    const timeColor = D ? '#ffffff' : '#064e3b';
    const timeShadow = D
        ? '0 0 60px rgba(52,211,153,0.20), 0 0 120px rgba(52,211,153,0.08)'
        : '0 0 40px rgba(16,185,129,0.15)';
    const labelColor = D ? '#34d399' : '#059669';
    const dividerColor = D ? 'rgba(52,211,153,0.55)' : 'rgba(16,185,129,0.35)';
    const quoteColor = D ? 'rgba(255,255,255,0.68)' : '#065f46';
    const badgeBg = D ? 'rgba(255,255,255,0.06)' : 'rgba(16,185,129,0.08)';
    const badgeBorder = D ? 'rgba(255,255,255,0.12)' : 'rgba(16,185,129,0.25)';
    const badgeText = D ? 'rgba(52,211,153,0.75)' : '#059669';
    const exitBg = D ? 'rgba(255,255,255,0.04)' : 'rgba(16,185,129,0.06)';
    const exitBorder = D ? 'rgba(255,255,255,0.10)' : 'rgba(16,185,129,0.25)';
    const exitText = D ? 'rgba(255,255,255,0.40)' : '#047857';
    const exitIconColor = D ? 'rgba(255,255,255,0.35)' : 'rgba(5,150,105,0.55)';

    const overlayStyle: React.CSSProperties = {
        opacity: phase === 'out' ? 0 : 1,
        transform: phase === 'in' ? 'scale(1.04)' : phase === 'out' ? 'scale(0.96)' : 'scale(1)',
        filter: phase === 'out' ? 'blur(8px)' : 'blur(0)',
        transition: 'opacity 0.6s cubic-bezier(0.4,0,0.2,1), transform 0.6s cubic-bezier(0.4,0,0.2,1), filter 0.6s ease',
    };

    return createPortal(
        <div className="fixed inset-0 z-[9999] overflow-hidden font-sans" style={overlayStyle}>

            <div className="absolute inset-0" style={{ background: bg }} />
            <div className="absolute inset-0 pointer-events-none" style={{ background: radialGlow }} />

            {STARS.map((s, i) => <Star key={i} {...s} dark={D} />)}

            <div className="absolute" style={{ top: '50%', left: '50%' }}>
                <PulseRing size={260} delay={0} opacity={0.35} dark={D} />
                <PulseRing size={340} delay={0.8} opacity={0.20} dark={D} />
                <PulseRing size={420} delay={1.6} opacity={0.10} dark={D} />
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center h-full gap-0 px-6 text-center">

                <div className="mb-6 flex flex-col items-center gap-3"
                    style={{ animation: 'focusSlideDown 0.7s cubic-bezier(0.34,1.56,0.64,1) both', animationDelay: '0.05s' }}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-px" style={{ background: `linear-gradient(to right, transparent, ${labelColor}80)` }} />
                        <p className="uppercase tracking-[0.35em] text-[11px] font-black" style={{ color: labelColor }}>
                            {currentPrayer || 'Huzur Vakti'}
                        </p>
                        <div className="w-10 h-px" style={{ background: `linear-gradient(to left, transparent, ${labelColor}80)` }} />
                    </div>
                    <div className="flex items-center gap-1.5">
                        {[0, 0.2, 0.4].map((d, i) => (
                            <div key={i} className="w-1 h-1 rounded-full animate-pulse"
                                style={{ background: `${labelColor}50`, animationDelay: `${d}s` }} />
                        ))}
                    </div>
                </div>

                <div style={{ animation: 'focusFadeIn 0.8s ease both', animationDelay: '0.15s' }}>
                    <h1 className="font-thin tracking-tighter select-none"
                        style={{
                            fontSize: 'clamp(5rem, 22vw, 9rem)',
                            lineHeight: 1,
                            fontVariantNumeric: 'tabular-nums',
                            color: timeColor,
                            textShadow: timeShadow,
                        }}>
                        {timeStr}
                    </h1>
                </div>

                <div className="my-8 h-px"
                    style={{
                        background: `linear-gradient(to right, transparent, ${dividerColor}, transparent)`,
                        animation: 'focusExpandW 0.9s cubic-bezier(0.4,0,0.2,1) both',
                        animationDelay: '0.35s',
                        width: 0,
                    }} />

                {suggestion && (
                    <div className="max-w-xs" style={{
                        animation: 'focusSlideUp 0.8s cubic-bezier(0.34,1.56,0.64,1) both',
                        animationDelay: '0.45s',
                        opacity: 0,
                        animationFillMode: 'forwards',
                    }}>
                        <p className="text-[1.2rem] font-serif italic leading-relaxed mb-4" style={{ color: quoteColor }}>
                            "{suggestion.topic}"
                        </p>
                        {suggestion.ayetLink && (
                            <span className="inline-block px-3 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase"
                                style={{ background: badgeBg, border: `1px solid ${badgeBorder}`, color: badgeText }}>
                                {suggestion.ayetLink}
                            </span>
                        )}
                    </div>
                )}

                <button
                    onClick={handleExit}
                    className="group relative mt-14 overflow-hidden"
                    style={{ animation: 'focusFadeIn 1s ease both', animationDelay: '0.7s' }}
                >
                    <div className="flex items-center gap-2.5 px-7 py-3.5 rounded-full transition-all duration-400"
                        style={{ background: exitBg, border: `1px solid ${exitBorder}` }}>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none rounded-full" />
                        <svg className="w-3.5 h-3.5 relative z-10" style={{ color: exitIconColor }}
                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className="text-[11px] font-black uppercase tracking-[0.3em] relative z-10" style={{ color: exitText }}>
                            Modu Kapat
                        </span>
                    </div>
                </button>
            </div>

            <style>{`
                @keyframes focusSlideDown { from { opacity:0; transform:translateY(-20px); } to { opacity:1; transform:translateY(0); } }
                @keyframes focusSlideUp   { from { opacity:0; transform:translateY(20px);  } to { opacity:1; transform:translateY(0); } }
                @keyframes focusFadeIn    { from { opacity:0; } to { opacity:1; } }
                @keyframes focusExpandW   { from { width:0; opacity:0; } to { width:200px; opacity:1; } }
            `}</style>
        </div>,
        document.body
    );
}
