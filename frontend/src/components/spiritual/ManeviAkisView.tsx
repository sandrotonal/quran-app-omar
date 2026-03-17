import React, { useEffect, useState } from 'react';
import { hapticFeedback } from '../../lib/constants';
import { DailyContentService } from '../../lib/DailyContentService';

interface ManeviAkisViewProps {
    onClose: () => void;
}


export const ManeviAkisView = React.memo(function ManeviAkisView({ onClose }: ManeviAkisViewProps) {
    const [actionDone, setActionDone] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    // Get today's dynamic contents
    const dailyVerse = DailyContentService.getDailyVerse();
    const dailyHadith = DailyContentService.getDailyHadith();
    const dailyEsma = DailyContentService.getDailyEsma();
    const dailyTefekkur = DailyContentService.getDailyTefekkur();

    useEffect(() => {
        // Mount transition
        requestAnimationFrame(() => requestAnimationFrame(() => setIsVisible(true)));

        // Load State
        const _done = localStorage.getItem('manevi_akis_done');
        const _date = localStorage.getItem('manevi_akis_date');
        const today = new Date().toDateString();
        if (_date === today && _done === 'true') {
            setActionDone(true);
        } else {
            localStorage.setItem('manevi_akis_date', today);
            localStorage.setItem('manevi_akis_done', 'false');
        }
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 500); // Wait for exit animation
    };

    const markAsDone = () => {
        if (actionDone) return;
        hapticFeedback(50);
        setActionDone(true);
        localStorage.setItem('manevi_akis_done', 'true');
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden p-4 sm:p-6 md:p-8">
            <div
                className={`absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md transition-opacity duration-700 ease-out z-0 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                onClick={handleClose}
            />

            <div className={`relative w-full max-w-4xl h-[95vh] md:h-auto md:max-h-[90vh] flex flex-col rounded-[2.5rem] overflow-hidden
                bg-slate-50/95 dark:bg-[#0f172a]/95 backdrop-blur-3xl
                border border-slate-200/50 dark:border-white/10
                shadow-2xl shadow-emerald-900/10 dark:shadow-black/50 z-10
                transform transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1)
                ${isVisible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-20 scale-95 opacity-0'}
            `}>
                {/* Refined Minimal Glows matching main theme */}
                <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen transition-opacity duration-1000" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-teal-500/5 dark:bg-teal-500/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen transition-opacity duration-1000 delay-300" />

                {/* Sleek Header */}
                <div className="px-6 py-5 md:px-10 md:py-6 flex items-center justify-between shrink-0 relative z-20 border-b border-black/5 dark:border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold font-serif text-slate-900 dark:text-white mb-0">Günün Akışı</h2>
                            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-0.5">Ruhunu Dinlendir</p>
                        </div>
                    </div>
                    <button onClick={() => { hapticFeedback(10); handleClose(); }} className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-all active:scale-95">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Content Body */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-4 md:space-y-6 custom-scrollbar relative z-10 w-full mb-6">

                    {/* Featured Verse Card - Minimalist */}
                    <div className="bg-white/80 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 rounded-[2rem] p-6 md:p-8 relative overflow-hidden group shadow-sm backdrop-blur-xl hover:bg-white dark:hover:bg-white/10 transition-colors">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10 w-full">
                            <div className="flex-1 w-full">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="px-3 py-1.5 bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 text-[10px] font-bold uppercase tracking-widest rounded-lg flex items-center gap-1.5 shadow-sm">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                        Günün Ayeti
                                    </div>
                                </div>
                                <p className="text-lg md:text-xl font-serif font-medium text-slate-800 dark:text-slate-200 leading-relaxed mb-4 pl-4 border-l-2 border-emerald-500/50">
                                    "{dailyVerse.text}"
                                </p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-4">{dailyVerse.source}</p>
                            </div>
                            <div className="w-full md:w-1/2 flex justify-end">
                                <p className="text-2xl md:text-3xl font-arabic text-emerald-700 dark:text-emerald-500 opacity-90 leading-tight text-right md:-mt-1" dir="rtl" style={{ lineHeight: '1.6' }}>
                                    {dailyVerse.arabic}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Hadith & Esma Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-5">

                        {/* Hadith Card - Minimalist */}
                        <div className="md:col-span-3 bg-white/60 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 rounded-[1.5rem] p-6 relative overflow-hidden shadow-sm backdrop-blur-md hover:bg-white dark:hover:bg-white/10 transition-colors flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="px-3 py-1.5 bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 text-[10px] font-bold uppercase tracking-widest rounded-lg flex items-center gap-1.5 shadow-sm">
                                        Hadis-i Şerif
                                    </div>
                                </div>
                                <p className="text-base md:text-lg font-serif font-medium text-slate-800 dark:text-slate-200 leading-relaxed italic mb-4">
                                    "{dailyHadith.text}"
                                </p>
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">{dailyHadith.source}</p>
                        </div>

                        {/* Esma Card - Refined Elegant (Theme Matched) */}
                        <div className="md:col-span-2 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-900/10 dark:to-teal-900/5 border border-slate-200/50 dark:border-white/5 rounded-[1.5rem] p-6 flex flex-col items-center justify-center text-center shadow-sm backdrop-blur-md relative overflow-hidden group hover:bg-white dark:hover:bg-white/10 transition-colors">
                            <span className="px-3 py-1.5 bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 text-[10px] font-bold uppercase tracking-widest rounded-lg absolute top-5 left-5 shadow-sm">
                                Esmaül Hüsna
                            </span>

                            <h3 className="text-5xl font-arabic text-emerald-700 dark:text-emerald-500 mt-10 mb-3 transition-transform duration-500 group-hover:scale-110">
                                {dailyEsma.arabic}
                            </h3>
                            <h4 className="text-xl font-bold font-serif text-slate-900 dark:text-white">{dailyEsma.turkish}</h4>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">{dailyEsma.meaning}</p>
                        </div>
                    </div>

                    {/* Action Card - Theme Matched Elegant Focus */}
                    <div className="bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-500/10 rounded-[2rem] p-6 md:p-8 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center gap-6 justify-between transition-colors">

                        {/* Subtly animated glow effect behind the card content */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-400/5 via-transparent to-teal-400/5 pointer-events-none" />

                        <div className="flex-1 relative z-10 w-full text-center md:text-left">
                            <div className="inline-flex px-3 py-1.5 bg-white dark:bg-white/5 border border-emerald-100 dark:border-white/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-widest rounded-lg mb-4 shadow-sm">
                                Günün Meyvesi • 1 Dk Tefekkür
                            </div>
                            <h4 className="font-bold font-serif text-xl sm:text-2xl mb-2 text-slate-900 dark:text-white">{dailyTefekkur.title}</h4>
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl mx-auto md:mx-0">
                                {dailyTefekkur.text}
                            </p>
                        </div>

                        <div className="relative z-10 w-full md:w-auto shrink-0 flex items-center justify-center">
                            <button
                                onClick={markAsDone}
                                disabled={actionDone}
                                className={`
                                    w-full md:w-48 py-4 rounded-[1.25rem] font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden relative group
                                    ${actionDone
                                        ? 'bg-emerald-100/50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 cursor-default'
                                        : 'bg-emerald-600 dark:bg-emerald-500 text-white hover:bg-emerald-700 dark:hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/30 active:scale-95'
                                    }
                                `}
                            >
                                {actionDone ? (
                                    <>
                                        <div className="absolute inset-0 bg-emerald-500/10 animate-pulse pointer-events-none"></div>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                        <span className="text-[11px]">Etkileşim Sağlandı</span>
                                    </>
                                ) : (
                                    <span className="text-[11px]">Tefekkür Ettim</span>
                                )}
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
});
