import { useEffect, useState } from 'react';
import { hapticFeedback } from '../../lib/constants';

const PRAYERS = [
    { id: 'fajr', name: 'Sabah', time: '06:15', isDone: false, isJamaah: false },
    { id: 'dhuhr', name: 'Öğle', time: '13:02', isDone: false, isJamaah: false },
    { id: 'asr', name: 'İkindi', time: '16:11', isDone: false, isJamaah: false },
    { id: 'maghrib', name: 'Akşam', time: '19:05', isDone: false, isJamaah: false },
    { id: 'isha', name: 'Yatsı', time: '20:23', isDone: false, isJamaah: false },
];

const getPrayerIcon = (id: string, isDone: boolean) => {
    const baseClass = `w-6 h-6 transition-colors duration-300 ${isDone ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`;
    switch (id) {
        case 'fajr':
            return <svg className={baseClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>;
        case 'dhuhr':
            return <svg className={baseClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>;
        case 'asr':
            return <svg className={baseClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" /></svg>;
        case 'maghrib':
            return <svg className={baseClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15h18M5 15v3a2 2 0 002 2h10a2 2 0 002-2v-3M12 3v6m0 0l-3-3m3 3l3-3" /></svg>;
        case 'isha':
            return <svg className={baseClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>;
        default:
            return <svg className={baseClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>;
    }
}

export function NamazAsistaniView({ onClose }: { onClose: () => void }) {
    const [prayers, setPrayers] = useState(PRAYERS);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // DOM'un render olabilmesi için kısa bir nefes payı bırakıyoruz, bu sayede takılmaz.
        const tnt = setTimeout(() => setIsVisible(true), 50);

        const saved = localStorage.getItem('namaz_asistani');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                const today = new Date().toDateString();
                const lastDate = localStorage.getItem('namaz_date');
                if (lastDate === today) {
                    const merged = PRAYERS.map(p => {
                        const s = parsed.find((x: any) => x.id === p.id);
                        return s ? { ...p, isDone: s.isDone, isJamaah: s.isJamaah } : p;
                    });
                    setPrayers(merged);
                } else {
                    localStorage.setItem('namaz_date', today);
                }
            } catch (e) { }
        } else {
            localStorage.setItem('namaz_date', new Date().toDateString());
        }

        return () => clearTimeout(tnt);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 500);
    };

    const toggleStatus = (id: string, field: 'isDone' | 'isJamaah') => {
        hapticFeedback(10);
        setPrayers(prev => {
            const next = prev.map(p => {
                if (p.id !== id) return p;
                const updated = { ...p, [field]: !p[field] };
                if (field === 'isJamaah' && updated.isJamaah) updated.isDone = true;
                return updated;
            });
            localStorage.setItem('namaz_asistani', JSON.stringify(next));
            return next;
        });
    };

    const completedCount = prayers.filter(p => p.isDone).length;
    const progressPerc = (completedCount / prayers.length) * 100;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden p-4 sm:p-6 md:p-8">
            <div
                className={`absolute inset-0 bg-black/40 dark:bg-black/80 backdrop-blur-md transition-opacity duration-500 z-0 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                onClick={handleClose}
            />

            <div className={`relative w-full max-w-2xl h-[95vh] md:h-auto md:max-h-[90vh] flex flex-col rounded-[2.5rem] overflow-hidden
                bg-white/90 dark:bg-[#0c0a09]/90 backdrop-blur-xl
                border border-emerald-200/50 dark:border-emerald-500/20
                shadow-2xl shadow-emerald-900/10 dark:shadow-emerald-900/40 z-10
                transition-all duration-300 ease-out will-change-transform
                ${isVisible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-16 scale-95 opacity-0'}
            `}>

                {/* Ambient Glows */}
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/10 dark:bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
                <div className="absolute bottom-[-100px] left-[-100px] w-[300px] h-[300px] bg-teal-500/10 dark:bg-teal-500/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

                {/* Minimal Header */}
                <div className="px-6 py-6 md:px-8 md:py-6 flex items-center justify-between shrink-0 relative z-20 border-b border-black/5 dark:border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold font-serif text-slate-900 dark:text-white mb-0">Namaz Asistanı</h2>
                            <p className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mt-0.5">Günlük Takip</p>
                        </div>
                    </div>
                    <button onClick={() => { hapticFeedback(10); handleClose(); }} className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 custom-scrollbar relative z-10 w-full mb-6">

                    {/* Minimal Progress Dashboard */}
                    <div className="bg-slate-50/60 dark:bg-black/40 border border-slate-200/60 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden group">
                        <div className="flex justify-between items-end mb-4">
                            <div>
                                <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-widest uppercase mb-1">Bugünün Hedefi</h3>
                                <p className="text-3xl font-black text-slate-900 dark:text-white flex items-baseline gap-2 font-mono tabular-nums">
                                    {completedCount} <span className="text-xl text-slate-400 dark:text-slate-600">/ 5</span>
                                </p>
                            </div>
                            <div className="text-right">
                                <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full transition-colors ${progressPerc === 100 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30' : 'bg-emerald-50/50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400/80 border border-emerald-200/50 dark:border-emerald-500/20'}`}>
                                    {progressPerc === 100 ? 'TAMAMLANDI' : 'DEVAM EDİYOR'}
                                </span>
                            </div>
                        </div>
                        {/* Thin Progress Bar */}
                        <div className="w-full h-2 bg-slate-200/50 dark:bg-white/5 rounded-full overflow-hidden relative mt-2">
                            <div
                                className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out ${progressPerc === 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-emerald-500 to-teal-400'}`}
                                style={{ width: `${progressPerc}%` }}
                            />
                        </div>
                    </div>

                    {/* Prayer List - Sleek & Modern */}
                    <div className="space-y-3">
                        {prayers.map((prayer) => (
                            <div
                                key={prayer.id}
                                className={`
                                    relative overflow-hidden rounded-[1.5rem] p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300
                                    ${prayer.isDone
                                        ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-200/50 dark:border-emerald-500/20 shadow-sm'
                                        : 'bg-white/60 dark:bg-black/40 border border-slate-200/50 dark:border-white/5 hover:border-slate-300/50 dark:hover:border-white/10 shadow-sm'
                                    }
                                    backdrop-blur-md group
                                `}
                            >
                                <div className="flex items-center gap-4 z-10 w-full sm:w-auto">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300 ${prayer.isDone ? 'bg-white dark:bg-emerald-950 shadow-sm border border-emerald-100 dark:border-emerald-800' : 'bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5'}`}>
                                        {getPrayerIcon(prayer.id, prayer.isDone)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between sm:justify-start gap-4">
                                            <h4 className={`text-lg font-bold font-serif ${prayer.isDone ? 'text-emerald-900 dark:text-emerald-100' : 'text-slate-900 dark:text-slate-200'}`}>
                                                {prayer.name}
                                            </h4>
                                            <div className={`text-sm font-bold font-mono tracking-wider ${prayer.isDone ? 'text-emerald-600/70 dark:text-emerald-400/70' : 'text-slate-400 dark:text-slate-500'}`}>
                                                {prayer.time}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 sm:ml-auto z-10 w-full sm:w-auto">
                                    <button
                                        onClick={() => toggleStatus(prayer.id, 'isJamaah')}
                                        className={`
                                            flex-1 sm:flex-none px-5 py-2.5 sm:py-2 text-[10px] md:text-xs font-bold uppercase tracking-widest rounded-lg transition-all duration-300 border
                                            ${prayer.isJamaah
                                                ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-300/50 dark:border-amber-500/30'
                                                : 'bg-transparent text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 active:scale-95'
                                            }
                                        `}
                                    >
                                        Cemaat
                                    </button>
                                    <button
                                        onClick={() => toggleStatus(prayer.id, 'isDone')}
                                        className={`
                                            w-12 h-12 sm:w-10 sm:h-10 flex shrink-0 items-center justify-center rounded-lg transition-all duration-300 border active:scale-95
                                            ${prayer.isDone
                                                ? 'bg-emerald-600 dark:bg-emerald-500 text-white border-emerald-600 dark:border-emerald-400 shadow-md shadow-emerald-500/20'
                                                : 'bg-transparent text-slate-400 dark:text-slate-500 border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-600 dark:hover:text-slate-300'
                                            }
                                        `}                                    >
                                        {prayer.isDone ? (
                                            <svg className="w-5 h-5 animate-in zoom-in-50 duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        ) : (
                                            <div className="w-4 h-4 rounded-full border-2 border-slate-300 dark:border-slate-600 group-hover:border-slate-400 dark:group-hover:border-slate-400 transition-colors" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
}
