import { useEffect, useState } from 'react';
import { hapticFeedback } from '../../lib/constants';

export function HatimTakipView({ onClose }: { onClose: () => void }) {
    const [juzler, setJuzler] = useState<boolean[]>(Array(30).fill(false));
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Mount edilirken DOM'un 30 öğeyi ve SVG'yi çizmesi için kısa bir gecikme tanıyoruz (takılmayı önler)
        const tnt = setTimeout(() => setIsVisible(true), 50);

        const saved = localStorage.getItem('hatim_takip');
        if (saved) {
            try {
                setJuzler(JSON.parse(saved));
            } catch (e) { }
        }

        return () => clearTimeout(tnt);
    }, []);

    const toggleJuz = (index: number) => {
        hapticFeedback(10);
        setJuzler(prev => {
            const next = [...prev];
            next[index] = !next[index];
            localStorage.setItem('hatim_takip', JSON.stringify(next));

            if (next[index]) {
                hapticFeedback([30, 50, 30]); // success feel
            }
            return next;
        });
    };

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 500);
    };

    const completedCount = juzler.filter(Boolean).length;
    const progress = (completedCount / 30) * 100;
    const remaining = 30 - completedCount;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden p-4 sm:p-6 md:p-8">
            <div
                className={`absolute inset-0 bg-black/40 dark:bg-black/80 backdrop-blur-md transition-opacity duration-500 ease-out z-0 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                onClick={handleClose}
            />

            <div className={`relative w-full max-w-5xl h-[95vh] md:h-auto md:max-h-[95vh] flex flex-col rounded-[2.5rem] overflow-hidden
                bg-teal-50/90 dark:bg-[#042f2e]/90 backdrop-blur-xl
                border border-teal-200/50 dark:border-teal-500/20
                shadow-2xl shadow-teal-900/20 dark:shadow-teal-900/50 z-10
                transition-all duration-300 ease-out will-change-transform
                ${isVisible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-16 scale-95 opacity-0'}
            `}>

                {/* Glows */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-400/20 dark:bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-400/20 dark:bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

                {/* Header */}
                <div className="px-6 py-6 md:px-10 md:py-8 flex items-center justify-between shrink-0 relative z-20 border-b border-black/5 dark:border-white/5">
                    <div className="flex items-center gap-4 group">
                        <div className="w-12 h-12 shrink-0 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-teal-500/30 group-hover:scale-105 transition-transform duration-300">
                            <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold font-serif text-teal-950 dark:text-teal-50 mb-0.5">Hatim Takip Şeceresi</h2>
                            <p className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-widest">Kuran Hatmi</p>
                        </div>
                    </div>
                    <button onClick={() => { hapticFeedback(10); handleClose(); }} className="w-10 h-10 flex items-center justify-center rounded-full bg-teal-100/50 dark:bg-white/5 border border-teal-200 dark:border-white/10 text-teal-800 dark:text-teal-100 hover:text-teal-950 dark:hover:text-white hover:bg-teal-200/50 dark:hover:bg-white/10 transition-all active:scale-95">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 md:space-y-8 custom-scrollbar relative z-10 w-full mb-6">

                    {/* Progress Dashboard */}
                    <div className="bg-white/60 dark:bg-black/40 border border-teal-200/50 dark:border-white/10 rounded-[2rem] p-6 md:p-10 shadow-xl backdrop-blur-md relative overflow-hidden group flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-teal-500/10 rounded-full blur-[60px] pointer-events-none" />

                        <div className="relative z-10 w-full md:w-auto text-center md:text-left flex-1">
                            <h3 className="text-3xl font-serif font-bold text-teal-950 dark:text-teal-50 mb-3">{completedCount === 30 ? 'Elhamdülillah, Hatim Tamam!' : 'Hatim Durumu'}</h3>
                            <p className="text-base text-teal-800/80 dark:text-teal-200/70 font-medium">
                                {completedCount === 30 ? 'Allah kabul etsin, yeni bir hatme başlamak için cüzleri sıfırlayabilirsiniz.' : `Şu ana kadar ${completedCount} cüz tamamladınız. Hatmi bitirmeye ${remaining} cüz kaldı.`}
                            </p>
                        </div>

                        {/* Circular Progress */}
                        <div className="relative w-36 h-36 md:w-44 md:h-44 shrink-0 flex items-center justify-center">
                            {/* Glow background replacing drop-shadow to fix browser artifacts */}
                            <div className="absolute inset-0 bg-teal-500/10 dark:bg-teal-400/20 rounded-full blur-xl scale-90 pointer-events-none" />
                            <svg className="w-full h-full -rotate-90 relative z-10" viewBox="0 0 100 100">
                                {/* Track */}
                                <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-teal-200 dark:text-white/5" />
                                {/* Progress */}
                                <circle
                                    cx="50" cy="50" r="42"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    strokeLinecap="round"
                                    strokeDasharray="264"
                                    strokeDashoffset={264 - ((264 * progress) / 100)}
                                    className="text-teal-500 dark:text-teal-400 transition-all duration-1000 ease-out"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-3xl font-black tabular-nums text-teal-950 dark:text-teal-50 font-mono tracking-tighter">
                                    {Math.round(progress)}<span className="text-xl text-teal-600 dark:text-teal-400">%</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Guzes Grid */}
                    <div className="bg-white/40 dark:bg-black/20 border border-teal-200/30 dark:border-white/5 rounded-[2rem] p-6 md:p-8 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-8">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,1)] animate-pulse"></span>
                            <h3 className="text-sm font-bold text-teal-800 dark:text-teal-200 uppercase tracking-widest">Cüz Haritası</h3>
                        </div>

                        <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-10 gap-3 md:gap-4">
                            {juzler.map((isDone, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => toggleJuz(idx)}
                                    className={`
                                        aspect-square relative flex items-center justify-center rounded-2xl transition-all duration-300 font-mono font-black text-xl md:text-2xl shadow-sm
                                        ${isDone
                                            ? 'bg-teal-500 text-white shadow-[0_5px_15px_rgba(20,184,166,0.4)] border border-teal-400 scale-[1.02] transform'
                                            : 'bg-white dark:bg-white/5 text-teal-700/50 dark:text-teal-500/50 border border-teal-200/50 dark:border-white/10 hover:bg-teal-50 hover:text-teal-700 dark:hover:bg-white/10 dark:hover:text-teal-200 active:scale-95'
                                        }
                                    `}
                                >
                                    {/* Subdued checkmark when done */}
                                    {isDone && (
                                        <div className="absolute inset-x-0 bottom-1 flex justify-center opacity-40">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                        </div>
                                    )}
                                    <span className={`${isDone ? '-translate-y-1' : ''} transition-transform`}>{idx + 1}</span>
                                </button>
                            ))}
                        </div>

                        <div className="mt-8 flex justify-center">
                            <button
                                onClick={() => { if (confirm('Tüm ilerlemeyi sıfırlamak istiyor musunuz?')) setJuzler(Array(30).fill(false)) }}
                                className="text-xs font-semibold text-teal-600/60 dark:text-teal-400/50 hover:text-teal-600 dark:hover:text-teal-400 tracking-wider uppercase transition-colors"
                            >
                                Hatmi Sıfırla
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
