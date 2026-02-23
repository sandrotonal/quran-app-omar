import { useEffect, useState } from 'react';
import { hapticFeedback } from '../../lib/constants';

export function RamadanOzelView({ onClose }: { onClose: () => void }) {
    const [teravih, setTeravih] = useState(false);
    const [mission, setMission] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        requestAnimationFrame(() => requestAnimationFrame(() => setIsVisible(true)));

        const today = new Date().toDateString();
        const t = localStorage.getItem('ramadan_teravih_' + today);
        const m = localStorage.getItem('ramadan_mission_' + today);
        if (t === 'true') setTeravih(true);
        if (m === 'true') setMission(true);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 500);
    };

    const toggleTeravih = () => {
        hapticFeedback(10);
        const next = !teravih;
        setTeravih(next);
        const today = new Date().toDateString();
        localStorage.setItem('ramadan_teravih_' + today, next.toString());
        if (next) hapticFeedback(50);
    };

    const toggleMission = () => {
        hapticFeedback(10);
        const next = !mission;
        setMission(next);
        const today = new Date().toDateString();
        localStorage.setItem('ramadan_mission_' + today, next.toString());
        if (next) hapticFeedback(50);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden p-4 sm:p-6 md:p-8">
            <div
                className={`absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md transition-opacity duration-700 ease-out z-0 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                onClick={handleClose}
            />

            <div className={`relative w-full max-w-4xl h-[95vh] md:h-auto md:max-h-[90vh] flex flex-col rounded-[2.5rem] overflow-hidden
                bg-slate-50/95 dark:bg-[#09090b]/95 backdrop-blur-3xl
                border border-slate-200/50 dark:border-white/10
                shadow-2xl shadow-emerald-900/10 dark:shadow-black/50 z-10
                transform transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1)
                ${isVisible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-20 scale-95 opacity-0'}
            `}>

                {/* Sleek Minimal Background Art */}
                <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen transition-opacity duration-1000" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-amber-500/5 dark:bg-amber-500/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen transition-opacity duration-1000 delay-300" />

                {/* Header */}
                <div className="px-6 py-5 md:px-10 md:py-6 flex items-center justify-between shrink-0 relative z-20 border-b border-black/5 dark:border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold font-serif text-slate-900 dark:text-white mb-0">Ramazan İklimi</h2>
                            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-0.5">11 Ayın Sultanı</p>
                        </div>
                    </div>
                    <button onClick={() => { hapticFeedback(10); handleClose(); }} className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-all active:scale-95">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-4 md:space-y-6 custom-scrollbar relative z-10 w-full mb-6">

                    {/* Main Iftar Card - Refined Monochrome Calligraphy */}
                    <div className="bg-white/80 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 rounded-[2rem] p-8 md:p-10 shadow-sm backdrop-blur-xl relative overflow-hidden group hover:bg-white dark:hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-3 mb-6 relative z-10">
                            <div className="px-3 py-1.5 bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 text-[10px] font-bold uppercase tracking-widest rounded-lg flex items-center gap-1.5 shadow-sm">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                İftar Duası
                            </div>
                        </div>
                        <div className="space-y-6 relative z-10 w-full">
                            <p className="text-3xl md:text-5xl font-arabic text-emerald-800 dark:text-emerald-500 text-right md:text-center opacity-90 leading-relaxed md:leading-loose drop-shadow-sm transition-transform duration-700 group-hover:scale-[1.02]" dir="rtl">
                                اللَّهُمَّ إِنِّي لَكَ صُمْتُ وَبِكَ آمَنْتُ وَعَلَيْكَ تَوَكَّلْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ
                            </p>
                            <p className="text-sm md:text-base font-serif font-semibold text-slate-600 dark:text-slate-400 leading-relaxed text-center max-w-2xl mx-auto italic">
                                "Allah'ım! Senin rızan için oruç tuttum, sana inandım, sana güvendim ve senin verdiğin rızıkla orucumu açtım."
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                        {/* Teravih Action Card - Sleek Modern */}
                        <div className="bg-white/60 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 rounded-[1.5rem] p-6 shadow-sm flex flex-col justify-between backdrop-blur-md relative overflow-hidden group hover:bg-white dark:hover:bg-white/10 transition-colors">
                            <div className="relative z-10 w-full mb-6">
                                <span className="inline-block px-3 py-1.5 bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 text-[10px] font-bold uppercase tracking-widest rounded-lg mb-4 shadow-sm">
                                    Sünnet-i Müekkede
                                </span>
                                <h4 className="font-bold text-xl font-serif text-slate-900 dark:text-white mb-2">Teravih Takibi</h4>
                                <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed">Ramazan'ın manevi iklimini hissetmek için bugünün teravih namazını eda ettiniz mi?</p>
                            </div>
                            <button
                                onClick={toggleTeravih}
                                className={`relative z-10 w-full py-4 text-[11px] font-bold tracking-widest uppercase rounded-xl transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden
                                    ${teravih
                                        ? 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                                        : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 active:scale-95'
                                    }
                                `}
                            >
                                {teravih ? (
                                    <>
                                        <svg className="w-4 h-4 animate-in zoom-in" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                        Eda Edildi
                                    </>
                                ) : 'Kılındı İşaretle'}
                            </button>
                        </div>

                        {/* Daily Mission Card - Sleek Modern (Theme Matched) */}
                        <div className="bg-white/60 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 rounded-[1.5rem] p-6 shadow-sm flex flex-col justify-between backdrop-blur-md relative overflow-hidden group hover:bg-white dark:hover:bg-white/10 transition-colors">
                            <div className="relative z-10 w-full mb-6">
                                <span className="inline-block px-3 py-1.5 bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 text-[10px] font-bold uppercase tracking-widest rounded-lg mb-4 shadow-sm">
                                    Günün İyiliği
                                </span>
                                <h4 className="font-bold text-xl font-serif text-slate-900 dark:text-white mb-2">Sadaka Ver</h4>
                                <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed">Miktarı hiç önemli değil; bugün bir ihtiyaç sahibine veya kuruma bağışta bulun.</p>
                            </div>
                            <button
                                onClick={toggleMission}
                                className={`relative z-10 w-full py-4 text-[11px] font-bold tracking-widest uppercase rounded-xl transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden
                                    ${mission
                                        ? 'bg-teal-500/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 border border-teal-500/30'
                                        : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 active:scale-95'
                                    }
                                `}
                            >
                                {mission ? (
                                    <>
                                        <svg className="w-4 h-4 animate-in zoom-in" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                        Görev Tamam
                                    </>
                                ) : 'Tamamladım'}
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
