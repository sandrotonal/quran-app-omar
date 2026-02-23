import { useEffect, useState } from 'react';
import { hapticFeedback } from '../../lib/constants';

export function IstatistikPaneliView({ onClose }: { onClose: () => void }) {
    const [namaz, setNamaz] = useState(0);
    const [zikir, setZikir] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [animatedScore, setAnimatedScore] = useState(0);

    const TARGET_SCORE = 82;

    useEffect(() => {
        requestAnimationFrame(() => requestAnimationFrame(() => setIsVisible(true)));

        const z = localStorage.getItem('zikir_total_count');
        const n = localStorage.getItem('namaz_asistani');
        if (z) setZikir(parseInt(z));
        else setZikir(124);

        if (n) {
            try {
                const parsed = JSON.parse(n);
                setNamaz(parsed.filter((p: any) => p.isDone).length + 32);
            } catch (e) { }
        } else {
            setNamaz(32);
        }

        // Animate score counter
        const duration = 1500;
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // easeOutQuart
            const easeOut = 1 - Math.pow(1 - progress, 4);

            setAnimatedScore(Math.floor(easeOut * TARGET_SCORE));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);

    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 500);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden p-4 sm:p-6 md:p-8">
            <div
                className={`absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md transition-opacity duration-700 ease-out z-0 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                onClick={handleClose}
            />

            <div className={`relative w-full max-w-4xl h-[95vh] md:h-auto md:max-h-[90vh] flex flex-col rounded-[2.5rem] overflow-hidden
                bg-slate-50/90 dark:bg-[#09090b]/90 backdrop-blur-3xl
                border border-slate-200/50 dark:border-white/10
                shadow-2xl shadow-indigo-900/10 dark:shadow-black/50 z-10
                transform transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1)
                ${isVisible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-20 scale-95 opacity-0'}
            `}>

                {/* Refined Minimal Glows */}
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-500/10 dark:bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen transition-opacity duration-1000" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 dark:bg-purple-500/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen transition-opacity duration-1000 delay-300" />

                {/* Sleek Header */}
                <div className="px-6 py-5 md:px-10 md:py-6 flex items-center justify-between shrink-0 relative z-20 border-b border-black/5 dark:border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold font-serif text-slate-900 dark:text-white mb-0">İstatistik Paneli</h2>
                            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-0.5">Manevi Analiz</p>
                        </div>
                    </div>
                    <button onClick={() => { hapticFeedback(10); handleClose(); }} className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-all active:scale-95">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-4 md:space-y-6 custom-scrollbar relative z-10 w-full mb-6">

                    {/* Minimal Master Score Card */}
                    <div className="bg-white/80 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 rounded-[2rem] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between shadow-sm overflow-hidden relative group backdrop-blur-xl">

                        <div className="relative z-10 w-full md:w-auto text-center md:text-left mb-8 md:mb-0">
                            <span className="inline-block px-3 py-1.5 bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 text-[10px] font-bold uppercase tracking-widest rounded-lg mb-4">
                                Haftalık Puan
                            </span>
                            <h3 className="font-bold text-slate-900 dark:text-white text-3xl font-serif">Mükemmel İlerleme</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium max-w-sm">Geçen haftaya kıyasla düzenliliğini artırdın. <span className="text-emerald-600 dark:text-emerald-400 font-bold">%12 daha yüksek</span> aktivite.</p>
                        </div>

                        {/* Premium Thin Radial Progress */}
                        <div className="relative w-40 h-40 shrink-0 flex items-center justify-center">
                            {/* Glow to replace drop-shadow and prevent browser rendering artifacts */}
                            <div className="absolute inset-0 bg-indigo-500/10 dark:bg-indigo-400/20 rounded-full blur-xl scale-90 pointer-events-none" />
                            <svg className="w-full h-full -rotate-90 relative z-10" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="4" className="text-slate-100 dark:text-white/5" />
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="44"
                                    fill="none"
                                    stroke="url(#gradient)"
                                    strokeWidth="6"
                                    strokeLinecap="round"
                                    strokeDasharray="276"
                                    strokeDashoffset={276 - ((276 * (isVisible ? TARGET_SCORE : 0)) / 100)}
                                    className="transition-all duration-1500 ease-out"
                                />
                                <defs>
                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#818cf8" />
                                        <stop offset="100%" stopColor="#c084fc" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
                                <span className="text-5xl font-light tabular-nums text-slate-900 dark:text-white font-mono tracking-tighter">
                                    {animatedScore}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Monochrome Metrics Grid */}
                    <div className="grid grid-cols-3 gap-3 md:gap-4">
                        <div className="bg-white/60 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 p-5 md:p-6 rounded-[1.5rem] text-center shadow-sm backdrop-blur-md relative overflow-hidden group hover:bg-white dark:hover:bg-white/10 transition-colors">
                            <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Namaz</div>
                            <div className="text-2xl md:text-3xl font-light text-slate-900 dark:text-white tabular-nums font-mono">{namaz}</div>
                            <div className="mt-2 text-[10px] font-bold text-emerald-500 uppercase flex items-center justify-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                                %4 artış
                            </div>
                        </div>

                        <div className="bg-white/60 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 p-5 md:p-6 rounded-[1.5rem] text-center shadow-sm backdrop-blur-md relative overflow-hidden group hover:bg-white dark:hover:bg-white/10 transition-colors">
                            <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Ayet</div>
                            <div className="text-2xl md:text-3xl font-light text-slate-900 dark:text-white tabular-nums font-mono">415</div>
                            <div className="mt-2 text-[10px] font-bold text-slate-400 uppercase flex items-center justify-center gap-1">
                                Stabil
                            </div>
                        </div>

                        <div className="bg-white/60 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 p-5 md:p-6 rounded-[1.5rem] text-center shadow-sm backdrop-blur-md relative overflow-hidden group hover:bg-white dark:hover:bg-white/10 transition-colors">
                            <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Zikir</div>
                            <div className="text-2xl md:text-3xl font-light text-slate-900 dark:text-white tabular-nums font-mono">
                                {zikir > 1000 ? (zikir / 1000).toFixed(1) + 'k' : zikir}
                            </div>
                            <div className="mt-2 text-[10px] font-bold text-emerald-500 uppercase flex items-center justify-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                                %12 artış
                            </div>
                        </div>
                    </div>

                    {/* Elegant Chart Card */}
                    <div className="bg-white/80 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 rounded-[2rem] p-6 md:p-8 shadow-sm backdrop-blur-xl">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white mb-1">Aktivite Trendi</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Son 7 günün özeti</p>
                            </div>
                            <button className="text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors active:scale-95">Rapor Ver</button>
                        </div>

                        <div className="flex items-end justify-between h-48 gap-3 sm:gap-6 mt-4 relative z-10 w-full">
                            {[40, 60, 45, 80, 50, 90, 70].map((val, i) => (
                                <div key={i} className="flex flex-col items-center gap-2 flex-1 group h-full justify-end cursor-pointer">
                                    <div className={`opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 bg-slate-800 dark:bg-white text-white dark:text-slate-900 text-xs font-bold py-1 px-2 rounded-lg mb-1 tabular-nums shadow-lg`}>
                                        {val}
                                    </div>
                                    <div className="w-full max-w-[32px] sm:max-w-[40px] bg-slate-100 dark:bg-white/5 rounded-t-xl rounded-b-xl h-full flex items-end relative overflow-hidden">
                                        <div
                                            className={`w-full rounded-xl transition-all duration-1000 ease-out group-hover:brightness-110 origin-bottom ${isVisible ? 'scale-y-100' : 'scale-y-0'} ${i === 6 ? 'bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.4)]' : 'bg-slate-300 dark:bg-white/20'}`}
                                            style={{ height: `${val}%`, transitionDelay: `${i * 100}ms` }}
                                        />
                                    </div>
                                    <span className={`text-[10px] mt-2 font-bold uppercase tracking-widest transition-colors ${i === 6 ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`}>
                                        {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'][i]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
