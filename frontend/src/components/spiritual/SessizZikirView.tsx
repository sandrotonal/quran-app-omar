import { useState, useEffect } from 'react';
import { hapticFeedback } from '../../lib/constants';

export function SessizZikirView({ onClose }: { onClose: () => void }) {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [tapEffect, setTapEffect] = useState(false);

    useEffect(() => {
        requestAnimationFrame(() => requestAnimationFrame(() => setIsVisible(true)));

        // PWA & Browser Title Bar Tema Rengini Siyah Yapma
        const metaThemeColor = document.getElementById('meta-theme-color') as HTMLMetaElement | null;
        let originalColor = '#070f1a'; // Fallback

        if (metaThemeColor) {
            originalColor = metaThemeColor.content;
            metaThemeColor.content = '#000000';
        }

        return () => {
            if (metaThemeColor) {
                metaThemeColor.content = originalColor;
            }
        };
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 800);
    };

    const handleTap = () => {
        hapticFeedback(50); // Titreşim (Sessiz)
        setCount(c => c + 1);

        // Tap animation trigger
        setTapEffect(true);
        setTimeout(() => setTapEffect(false), 300);

        if ((count + 1) % 33 === 0) {
            setTimeout(() => hapticFeedback([100, 50, 100]), 100);
        }
    };

    const handleReset = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm("Tüm zikri sıfırlamak istiyor musunuz?")) {
            setCount(0);
            hapticFeedback(20);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden p-0 sm:p-4">
            {/* The base OLED black backdrop */}
            <div
                className={`absolute inset-0 bg-black transition-opacity duration-1000 ease-out z-0 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
            />

            <div
                className={`absolute inset-0 sm:relative sm:w-full sm:max-w-md sm:h-[90vh] sm:rounded-[3rem] overflow-hidden flex flex-col items-center justify-between p-6 sm:p-8 select-none z-10 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 scale-100' : 'translate-y-20 scale-95'} ${tapEffect ? 'scale-[0.99] brightness-125' : ''}`}
                onClick={handleTap}
            >
                {/* Minimal Aurora Background (deeply subtle to save battery but premium) */}
                <div className="absolute inset-x-0 top-0 h-full pointer-events-none opacity-20">
                    <div className={`absolute top-0 right-[-20%] w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] mix-blend-screen transition-all duration-300 ${tapEffect ? 'scale-125 opacity-30' : ''}`} />
                    <div className={`absolute bottom-[-10%] left-[-20%] w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[100px] mix-blend-screen transition-all duration-300 delay-75 ${tapEffect ? 'scale-125 opacity-30' : ''}`} />
                </div>

                {/* Header (Very Dim) */}
                <div className="w-full flex items-center justify-between opacity-40 hover:opacity-100 transition-opacity text-white shrink-0 relative z-20">
                    <button
                        onClick={(e) => { e.stopPropagation(); hapticFeedback(10); handleClose(); }}
                        className="w-12 h-12 flex items-center justify-center -ml-2 rounded-full active:scale-90 transition-transform bg-white/5 hover:bg-white/10"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <div className="text-center absolute inset-x-0 pointer-events-none">
                        <span className="text-[10px] font-black uppercase tracking-widest block text-white/50 border border-white/10 px-3 py-1 rounded-full w-max mx-auto backdrop-blur-sm">Aura Mode</span>
                    </div>
                    <button
                        onClick={handleReset}
                        className="w-12 h-12 flex items-center justify-center -mr-2 rounded-full active:scale-90 transition-transform bg-white/5 hover:bg-white/10 ml-auto"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    </button>
                </div>

                {/* Content (Dim & Focused) */}
                <div className="flex-1 flex flex-col items-center justify-center pointer-events-none w-full relative z-10 text-white">
                    <div className="relative">
                        <h2 className={`text-[120px] sm:text-[140px] font-mono font-light leading-none tracking-tighter tabular-nums transition-all duration-300 ease-out 
                            ${tapEffect ? 'opacity-40 scale-105 text-indigo-100' : 'opacity-20 text-white scale-100'}`}
                        >
                            {count}
                        </h2>
                        {/* Tap Ripple Layer */}
                        {tapEffect && (
                            <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full scale-150 animate-pulse" />
                        )}
                    </div>

                    <div className={`mt-16 flex flex-col items-center gap-4 transition-all duration-500 ${count > 0 ? 'opacity-0 scale-95' : 'opacity-[0.15] scale-100'}`}>
                        <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center animate-bounce">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z" /></svg>
                        </div>
                        <span className="text-[10px] tracking-[0.4em] font-medium uppercase text-center max-w-[200px] leading-relaxed">
                            Zikretmek için ekrana dokun
                        </span>
                    </div>
                </div>

                {/* Footer Progress Indicators (e.g. 33 blocks) */}
                <div className="w-full relative z-20 pb-4">
                    <div className="flex justify-center gap-[2px] opacity-20 px-2 w-full max-w-[250px] mx-auto flex-wrap pointer-events-none">
                        {Array.from({ length: 33 }).map((_, i) => (
                            <div
                                key={i}
                                className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${i < (count % 33) ? 'bg-indigo-300 shadow-[0_0_5px_rgba(165,180,252,0.8)] scale-110' : 'bg-white/20'}`}
                            />
                        ))}
                    </div>
                    <div className="text-[9px] text-white/30 font-mono uppercase tracking-widest mt-6 pointer-events-none text-center">
                        Pil koruma ve derin odak
                    </div>
                </div>
            </div>
        </div>
    );
}
