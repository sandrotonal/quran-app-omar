import { useEffect, useState } from 'react';

interface SplashScreenProps {
    onFinish: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
    const [stage, setStage] = useState(0);
    // 0 = black  1 = draw stroke  2 = fill + glow  3 = text  4 = subtitle  5 = exit

    useEffect(() => {
        const ts = [
            setTimeout(() => setStage(1), 200),   // start drawing
            setTimeout(() => setStage(2), 1400),   // fill icon
            setTimeout(() => setStage(3), 1900),   // title
            setTimeout(() => setStage(4), 2500),   // subtitle
            setTimeout(() => setStage(5), 3800),   // exit
            setTimeout(onFinish, 5000),
        ];
        return () => ts.forEach(clearTimeout);
    }, [onFinish]);

    // Handle theme color change for PWA/Browser Titlebar during Splash Screen
    useEffect(() => {
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        const originalContent = metaThemeColor?.getAttribute('content');

        // Splash ekranı her zaman karanlık, bu rengi koruyoruz
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', '#070f1a');
        }

        return () => {
            if (metaThemeColor && originalContent) {
                // Splash bittiğinde tarayıcı title bar eski orjinal renge geri dön
                metaThemeColor.setAttribute('content', originalContent);
            }
        };
    }, []);

    const exiting = stage >= 5;

    return (
        <div
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
            style={{
                background: '#070f1a',
                opacity: exiting ? 0 : 1,
                filter: exiting ? 'blur(10px)' : 'blur(0)',
                transform: exiting ? 'scale(1.05)' : 'scale(1)',
                transition: 'opacity 1.2s ease, filter 1.2s ease, transform 1.2s ease',
                pointerEvents: exiting ? 'none' : 'auto',
            }}
        >
            {/* Subtle ambient — appears only after icon fills */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse 55% 45% at 50% 44%, rgba(16,185,129,0.12) 0%, transparent 65%)',
                    opacity: stage >= 2 ? 1 : 0,
                    transition: 'opacity 1.4s ease',
                }}
            />

            {/* ── CENTER CONTENT ── */}
            <div className="relative z-10 flex flex-col items-center" style={{ gap: 0 }}>

                {/* ── Animated Book SVG ── */}
                <div
                    className="relative"
                    style={{
                        marginBottom: 52,
                        // scale-spring on fill stage
                        transform: stage >= 2 ? 'scale(1)' : 'scale(0.88)',
                        transition: 'transform 0.8s cubic-bezier(0.34,1.56,0.64,1) 0.1s',
                    }}
                >
                    {/* Glow halo — only after fill */}
                    <div
                        className="absolute rounded-full pointer-events-none"
                        style={{
                            width: 120, height: 120,
                            top: '50%', left: '50%',
                            transform: 'translate(-50%, -50%)',
                            background: 'radial-gradient(circle, rgba(52,211,153,0.22) 0%, transparent 68%)',
                            filter: 'blur(16px)',
                            opacity: stage >= 2 ? 1 : 0,
                            transition: 'opacity 0.8s ease',
                            animation: stage >= 2 ? 'splHaloPulse 3s ease-in-out infinite' : undefined,
                        }}
                    />

                    {/* The SVG book icon with draw-in stroke animation */}
                    <svg
                        viewBox="0 0 24 24"
                        width={72}
                        height={72}
                        fill="none"
                        style={{ display: 'block', position: 'relative', zIndex: 1 }}
                    >
                        {/* Left page */}
                        <path
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253"
                            stroke="rgba(52,211,153,0.90)"
                            strokeWidth={1.4}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeDasharray="52"
                            style={{
                                strokeDashoffset: stage >= 1 ? 0 : 52,
                                transition: 'stroke-dashoffset 0.9s cubic-bezier(0.4,0,0.2,1) 0s',
                            }}
                        />
                        {/* Right page */}
                        <path
                            d="M12 6.253v13m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            stroke="rgba(52,211,153,0.90)"
                            strokeWidth={1.4}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeDasharray="52"
                            style={{
                                strokeDashoffset: stage >= 1 ? 0 : 52,
                                transition: 'stroke-dashoffset 0.9s cubic-bezier(0.4,0,0.2,1) 0.15s',
                            }}
                        />
                        {/* Glow duplicate — same paths, blurred, emerald fill for "lit" look */}
                        <path
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            stroke="rgba(52,211,153,0.30)"
                            strokeWidth={4}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            filter="url(#glow)"
                            style={{
                                opacity: stage >= 2 ? 1 : 0,
                                transition: 'opacity 0.6s ease',
                            }}
                        />
                        <defs>
                            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur stdDeviation="1.5" result="blur" />
                                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                            </filter>
                        </defs>
                    </svg>
                </div>

                {/* KUR'AN — letter spacing reveal */}
                <h1
                    style={{
                        fontFamily: 'Georgia, serif',
                        fontWeight: 200,
                        fontSize: 'clamp(1.9rem, 8vw, 2.6rem)',
                        color: '#ffffff',
                        letterSpacing: stage >= 3 ? '0.28em' : '0.65em',
                        paddingLeft: stage >= 3 ? '0.28em' : '0.65em',
                        opacity: stage >= 3 ? 1 : 0,
                        transform: stage >= 3 ? 'translateY(0)' : 'translateY(14px)',
                        textShadow: '0 0 50px rgba(52,211,153,0.16)',
                        transition: 'opacity 0.9s ease, transform 0.9s cubic-bezier(0.22,1,0.36,1), letter-spacing 1.2s cubic-bezier(0.22,1,0.36,1), padding-left 1.2s cubic-bezier(0.22,1,0.36,1)',
                        textAlign: 'center',
                    }}
                >
                    KUR'AN
                </h1>

                {/* Divider line */}
                <div style={{
                    height: 1,
                    width: stage >= 3 ? 96 : 0,
                    background: 'linear-gradient(to right, transparent, rgba(52,211,153,0.45), transparent)',
                    margin: '18px 0 14px',
                    transition: 'width 1.0s ease 0.3s',
                }} />

                {/* ANLAM HARİTASI */}
                <p style={{
                    color: 'rgba(255,255,255,0.22)',
                    fontSize: '0.58rem',
                    letterSpacing: '0.40em',
                    textTransform: 'uppercase',
                    fontWeight: 300,
                    paddingLeft: '0.40em',
                    opacity: stage >= 4 ? 1 : 0,
                    transform: stage >= 4 ? 'translateY(0)' : 'translateY(8px)',
                    transition: 'opacity 0.9s ease, transform 0.9s ease',
                }}>
                    ANLAM HARİTASI
                </p>
            </div>

            {/* Crescent — fades in with subtitle */}
            <div
                className="absolute"
                style={{
                    bottom: '10%', left: '50%', transform: 'translateX(-50%)',
                    opacity: stage >= 4 ? 0.45 : 0,
                    transition: 'opacity 1.2s ease 0.2s',
                }}
            >
                <svg viewBox="0 0 60 60" width={22} height={22}>
                    <path d="M30,7 A23,23 0 1,1 30,53 A16,16 0 1,0 30,7 Z" fill="rgba(52,211,153,0.65)" />
                    <circle cx="43" cy="14" r="3.5" fill="rgba(52,211,153,0.65)" />
                </svg>
            </div>

            <style>{`
                @keyframes splHaloPulse {
                    0%, 100% { opacity: 0.8; transform: translate(-50%, -50%) scale(1);    }
                    50%       { opacity: 0.3; transform: translate(-50%, -50%) scale(1.35); }
                }
            `}</style>
        </div>
    );
}
