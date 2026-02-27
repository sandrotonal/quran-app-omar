import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

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

function Particle({ x, y, size, dur, delay, dark }: { x: number; y: number; size: number; dur: number; delay: number; dark: boolean }) {
    return (
        <div className="absolute rounded-full animate-pulse pointer-events-none"
            style={{
                left: `${x}%`, top: `${y}%`, width: size, height: size,
                background: dark ? 'rgba(52,211,153,0.15)' : 'rgba(16,185,129,0.10)',
                animationDuration: `${dur}s`, animationDelay: `${delay}s`,
            }} />
    );
}
const PARTICLES = [
    { x: 10, y: 15, size: 3, dur: 2.2, delay: 0 }, { x: 85, y: 8, size: 2, dur: 3.1, delay: 0.5 },
    { x: 92, y: 60, size: 4, dur: 2.7, delay: 0.3 }, { x: 5, y: 72, size: 2, dur: 3.6, delay: 0.8 },
    { x: 55, y: 4, size: 3, dur: 2.4, delay: 0.2 }, { x: 72, y: 90, size: 2, dur: 4.0, delay: 0.6 },
    { x: 20, y: 88, size: 3, dur: 3.3, delay: 0.1 }, { x: 95, y: 35, size: 2, dur: 2.9, delay: 0.9 },
];

type ChoiceVariant = 'primary' | 'secondary' | 'ghost';
interface ChoiceButtonProps {
    label: string; variant: ChoiceVariant; index: number; onClick: () => void; dark: boolean;
}

function ChoiceButton({ label, variant, index, onClick, dark }: ChoiceButtonProps) {
    const styles: Record<ChoiceVariant, React.CSSProperties> = {
        primary: {
            padding: '14px 24px',
            background: dark ? 'rgba(16,185,129,0.80)' : 'rgba(16,185,129,0.90)',
            border: dark ? '1px solid rgba(52,211,153,0.40)' : '1px solid rgba(16,185,129,0.50)',
            color: '#ffffff',
            boxShadow: dark ? '0 4px 20px rgba(16,185,129,0.25)' : '0 4px 20px rgba(16,185,129,0.20)',
        },
        secondary: {
            padding: '12px 24px',
            background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
            border: dark ? '1px solid rgba(255,255,255,0.09)' : '1px solid rgba(0,0,0,0.09)',
            color: dark ? 'rgba(255,255,255,0.60)' : 'rgba(4,120,87,0.80)',
        },
        ghost: {
            padding: '10px 24px',
            background: 'transparent',
            border: '1px solid transparent',
            color: dark ? 'rgba(255,255,255,0.28)' : 'rgba(4,120,87,0.45)',
        },
    };

    return (
        <div className="opacity-0" style={{
            animation: 'remSlideUp 0.6s cubic-bezier(0.34,1.56,0.64,1) both',
            animationDelay: `${0.35 + index * 0.1}s`,
        }}>
            <button
                onClick={onClick}
                className="group relative w-full overflow-hidden rounded-2xl text-center transition-all duration-300 active:scale-[0.97] hover:brightness-110"
                style={styles[variant] as React.CSSProperties}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none rounded-2xl" />
                <span className="relative z-10 block font-semibold text-[14px] tracking-wide">{label}</span>
            </button>
        </div>
    );
}

export function PrayerReminder({
    isActive, onDismiss, onSnooze, onMute,
    content, currentTime, prayerName = 'Vakit Girdi'
}: PrayerReminderProps) {
    const dark = useIsDark();
    const [visible, setVisible] = useState(false);
    const [phase, setPhase] = useState<'in' | 'idle' | 'out'>('in');

    useEffect(() => {
        if (isActive) {
            setPhase('in');
            setVisible(true);
            document.body.style.overflow = 'hidden';
            const t = setTimeout(() => setPhase('idle'), 800);
            return () => clearTimeout(t);
        } else if (visible) {
            setPhase('out');
            const t = setTimeout(() => { setVisible(false); document.body.style.overflow = ''; }, 500);
            return () => clearTimeout(t);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isActive]);

    // Handle theme color change for PWA/Browser Titlebar
    useEffect(() => {
        if (!isActive) return;

        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        const originalContent = metaThemeColor?.getAttribute('content');

        // Namaz Modu (PrayerReminder) background colors
        const modalBgColor = dark ? '#06101e' : '#f0fdf4';

        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', modalBgColor);
        }

        return () => {
            if (metaThemeColor && originalContent) {
                metaThemeColor.setAttribute('content', originalContent);
            }
        };
    }, [isActive, dark]);

    const dismiss = (action: () => void) => {
        setPhase('out');
        setTimeout(() => { setVisible(false); document.body.style.overflow = ''; action(); }, 500);
    };

    if (!visible) return null;

    const D = dark;
    const bg = D ? '#06101e' : '#f0fdf4';
    const radialGlow = D
        ? 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(16,185,129,0.10) 0%, transparent 65%)'
        : 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(16,185,129,0.12) 0%, transparent 65%)';
    const timeColor = D ? '#ffffff' : '#064e3b';
    const timeShadow = D
        ? '0 0 60px rgba(52,211,153,0.18), 0 0 100px rgba(52,211,153,0.07)'
        : '0 0 40px rgba(16,185,129,0.14)';
    const labelColor = D ? '#34d399' : '#059669';
    const divColor = D ? 'rgba(52,211,153,0.50)' : 'rgba(16,185,129,0.30)';
    const quoteColor = D ? 'rgba(255,255,255,0.65)' : '#065f46';
    const srcBg = D ? 'rgba(255,255,255,0.05)' : 'rgba(16,185,129,0.07)';
    const srcBorder = D ? 'rgba(255,255,255,0.10)' : 'rgba(16,185,129,0.20)';
    const srcText = D ? 'rgba(255,255,255,0.35)' : '#047857';
    const lblColor = D ? 'rgba(255,255,255,0.25)' : 'rgba(5,150,105,0.50)';
    const topBarBg = D
        ? 'linear-gradient(90deg, transparent, rgba(52,211,153,0.4), transparent)'
        : 'linear-gradient(90deg, transparent, rgba(16,185,129,0.35), transparent)';

    const overlayStyle: React.CSSProperties = {
        opacity: phase === 'out' ? 0 : 1,
        transform: phase === 'in' ? 'scale(1.03)' : phase === 'out' ? 'scale(0.97)' : 'scale(1)',
        filter: phase === 'out' ? 'blur(6px)' : 'blur(0)',
        transition: 'opacity 0.5s ease, transform 0.5s ease, filter 0.5s ease',
    };

    return createPortal(
        <div className="fixed inset-0 z-[9999] overflow-hidden font-sans" style={overlayStyle}>

            <div className="absolute inset-0" style={{ background: bg }} />
            <div className="absolute inset-0 pointer-events-none" style={{ background: radialGlow }} />
            {PARTICLES.map((p, i) => <Particle key={i} {...p} dark={D} />)}

            <div className="absolute pointer-events-none rounded-full blur-3xl" style={{
                width: 320, height: 320, top: '18%', left: '50%',
                transform: 'translate(-50%, -50%)',
                background: D
                    ? 'radial-gradient(circle, rgba(52,211,153,0.10) 0%, transparent 70%)'
                    : 'radial-gradient(circle, rgba(16,185,129,0.10) 0%, transparent 70%)',
            }} />

            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: topBarBg }} />

            <div className="relative z-10 flex flex-col h-full">

                <div className="flex-1 flex flex-col items-center justify-center text-center px-6 pt-12 pb-4">

                    <div className="flex flex-col items-center gap-2 mb-8"
                        style={{ animation: 'remSlideDown 0.7s cubic-bezier(0.34,1.56,0.64,1) both', animationDelay: '0.05s' }}>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-px" style={{ background: `linear-gradient(to right, transparent, ${labelColor}99)` }} />
                            <p className="uppercase tracking-[0.35em] text-[11px] font-black" style={{ color: labelColor }}>
                                {prayerName}
                            </p>
                            <div className="w-8 h-px" style={{ background: `linear-gradient(to left, transparent, ${labelColor}99)` }} />
                        </div>
                        <div className="flex items-center gap-1">
                            {[0, 0.2, 0.4].map((d, i) => (
                                <div key={i} className="w-1 h-1 rounded-full animate-pulse"
                                    style={{ background: `${labelColor}40`, animationDelay: `${d}s` }} />
                            ))}
                        </div>
                    </div>

                    <div style={{ animation: 'remFadeIn 0.9s ease both', animationDelay: '0.12s' }}>
                        <h1 className="font-thin tracking-tighter select-none"
                            style={{
                                fontSize: 'clamp(5rem, 22vw, 9rem)',
                                lineHeight: 1,
                                fontVariantNumeric: 'tabular-nums',
                                color: timeColor,
                                textShadow: timeShadow,
                            }}>
                            {currentTime}
                        </h1>
                    </div>

                    <div className="my-7 h-px"
                        style={{
                            background: `linear-gradient(to right, transparent, ${divColor}, transparent)`,
                            animation: 'remExpandW 0.8s ease both',
                            animationDelay: '0.3s',
                            width: 0,
                        }} />

                    <div className="max-w-xs" style={{
                        animation: 'remSlideUp 0.8s cubic-bezier(0.34,1.56,0.64,1) both',
                        animationDelay: '0.4s',
                        opacity: 0,
                        animationFillMode: 'forwards',
                    }}>
                        <p className="text-[1.12rem] font-serif italic leading-relaxed mb-3" style={{ color: quoteColor }}>
                            "{content.text}"
                        </p>
                        <span className="inline-block px-3 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase"
                            style={{ background: srcBg, border: `1px solid ${srcBorder}`, color: srcText }}>
                            {content.source}
                        </span>
                    </div>
                </div>

                <div className="relative z-20 w-full px-6 pb-10 pt-2 flex flex-col gap-3 max-w-sm mx-auto">
                    <div className="text-center mb-2" style={{
                        animation: 'remFadeIn 0.6s ease both', animationDelay: '0.25s',
                        opacity: 0, animationFillMode: 'forwards',
                    }}>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: lblColor }}>
                            — Niyetini Belirle —
                        </p>
                    </div>

                    <ChoiceButton dark={D} index={0} variant="primary" label="Şimdi kılacağım" onClick={() => dismiss(onDismiss)} />
                    <ChoiceButton dark={D} index={1} variant="secondary" label="Birazdan (5 dk)" onClick={() => dismiss(() => onSnooze(5))} />
                    <ChoiceButton dark={D} index={2} variant="secondary" label="Uygun olunca (15 dk)" onClick={() => dismiss(() => onSnooze(15))} />
                    <ChoiceButton dark={D} index={3} variant="ghost" label="Bu vakit için hatırlatma istemiyorum" onClick={() => dismiss(onMute)} />
                </div>
            </div>

            <style>{`
                @keyframes remSlideDown { from { opacity:0; transform:translateY(-18px); } to { opacity:1; transform:translateY(0); } }
                @keyframes remSlideUp   { from { opacity:0; transform:translateY(18px);  } to { opacity:1; transform:translateY(0); } }
                @keyframes remFadeIn    { from { opacity:0; } to { opacity:1; } }
                @keyframes remExpandW   { from { width:0; opacity:0; } to { width:180px; opacity:1; } }
            `}</style>
        </div>,
        document.body
    );
}
