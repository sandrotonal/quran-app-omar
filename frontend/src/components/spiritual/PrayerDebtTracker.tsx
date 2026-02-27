import { useState, useEffect } from 'react';
import { PrayerDebt, PrayerDebtService, PrayerType } from '../../lib/PrayerDebtService';
import { Minus, Plus, ChevronLeft, TrendingDown, CheckCircle2, Circle } from 'lucide-react';

interface PrayerDebtTrackerProps {
    onClose: () => void;
}

export function PrayerDebtTracker({ onClose }: PrayerDebtTrackerProps) {
    const [debts, setDebts] = useState<PrayerDebt[]>([]);
    const [dailyTarget, setDailyTarget] = useState<number>(1);
    const [showMotivation, setShowMotivation] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        loadDebts();
        setMounted(true);
        window.addEventListener('prayer-debt-update', loadDebts);
        return () => window.removeEventListener('prayer-debt-update', loadDebts);
    }, []);

    const loadDebts = () => {
        setDebts(PrayerDebtService.getDebts());
    };

    const handleUpdate = (type: PrayerType, delta: number) => {
        const newDebts = PrayerDebtService.updateDebt(type, delta);
        setDebts(newDebts);
        if (navigator.vibrate) navigator.vibrate(10);
        if (delta < 0) {
            setShowMotivation('Allah kabul etsin 🤲');
            setTimeout(() => setShowMotivation(null), 2500);
        }
    };

    const getTotalDebt = () => debts.reduce((acc, curr) => acc + curr.count, 0);

    const getEstimatedFinishTime = () => {
        const total = getTotalDebt();
        if (total === 0) return 'Borç Yok';
        const prayersPerDay = dailyTarget * 6;
        const daysLeft = Math.ceil(total / prayersPerDay);
        const years = Math.floor(daysLeft / 365);
        const remainingDaysAfterYears = daysLeft % 365;
        const months = Math.floor(remainingDaysAfterYears / 30);
        const days = remainingDaysAfterYears % 30;
        const parts = [];
        if (years > 0) parts.push(`${years} Yıl`);
        if (months > 0) parts.push(`${months} Ay`);
        if (days > 0) parts.push(`${days} Gün`);
        return parts.length > 0 ? parts.join(' ') : 'Bugün';
    };

    const totalDebt = getTotalDebt();

    return (
        <div className={`fixed inset-0 z-[60] bg-[#fdfbf7] dark:bg-slate-900 text-slate-900 dark:text-slate-50 flex flex-col font-sans select-none overflow-hidden transition-all duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>

            {/* ─── Motivation Toast ─── */}
            {showMotivation && (
                <div className="fixed top-6 left-0 right-0 z-[90] pointer-events-none flex justify-center animate-slideDown">
                    <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl text-emerald-600 dark:text-emerald-400 px-6 py-3 rounded-2xl shadow-2xl shadow-emerald-500/10 dark:shadow-emerald-900/30 border border-emerald-500/20 font-semibold text-sm flex items-center gap-2.5">
                        <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" />
                        <span>{showMotivation}</span>
                    </div>
                </div>
            )}

            {/* Ambient glow blobs - GPU Optimized */}
            <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-80 h-40 bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.15)_0%,_transparent_70%)]" />
            <div className="pointer-events-none fixed bottom-20 right-0 w-48 h-48 bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.1)_0%,_transparent_70%)]" />

            {/* ─── Header ─── */}
            <div className="relative px-5 pt-5 pb-4 flex items-center justify-between shrink-0 z-10">
                <button
                    onClick={onClose}
                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-300/50 dark:border-slate-700/50 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-500/30 transition-all active:scale-95"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="text-center">
                    <p className="text-[9px] font-black text-emerald-600/70 dark:text-emerald-500/70 uppercase tracking-[0.3em]">İbadet</p>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-slate-50 tracking-widest uppercase">Kaza Takip</h2>
                </div>

                <div className="w-9" />
            </div>

            {/* ─── Scrollable ─── */}
            <div className="flex-1 overflow-y-auto px-5 pb-20 custom-scrollbar space-y-4">

                {/* HERO COUNTER */}
                <div className="relative overflow-hidden bg-white dark:bg-slate-800 border border-slate-300/40 dark:border-slate-700/40 rounded-3xl p-7 text-center transition-colors duration-500">
                    {/* BG chart */}
                    <div className="absolute inset-0 opacity-[0.08] pointer-events-none text-emerald-500 translate-y-4 scale-x-150">
                        <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="w-full h-full">
                            <path d="M0 40 Q 20 35, 40 20 T 100 5 V 40 H 0 Z" fill="currentColor" />
                            <path d="M0 40 Q 20 35, 40 20 T 100 5" fill="none" stroke="currentColor" strokeWidth="0.5" />
                        </svg>
                    </div>

                    {/* Shimmering ring around counter */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-36 h-36 rounded-full border border-emerald-500/10 animate-pulse" />
                        <div className="absolute w-28 h-28 rounded-full border border-emerald-500/[0.07]" style={{ animationDelay: '0.5s' }} />
                    </div>

                    <div className="relative z-10">
                        <div className="mb-1">
                            <span className={`font-light tracking-tighter text-slate-900 dark:text-slate-50 font-mono transition-colors duration-500 ${totalDebt >= 1000 ? 'text-5xl' : 'text-7xl'}`}>
                                {totalDebt.toLocaleString()}
                            </span>
                        </div>
                        <div className="text-[10px] font-black uppercase tracking-[0.35em] text-slate-600 dark:text-slate-400 mb-5 transition-colors duration-500">
                            Vakit Borç
                        </div>

                        {/* Progress bar */}
                        <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700/50 rounded-full overflow-hidden mb-4 mx-auto max-w-[220px]">
                            <div
                                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full animate-pulse"
                                style={{ width: totalDebt === 0 ? '100%' : '20%', transition: 'width 1s ease-out' }}
                            />
                        </div>

                        <div className="flex items-center justify-center gap-2 text-sm">
                            <TrendingDown className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
                            <span className="text-slate-600 dark:text-slate-400 transition-colors duration-500">Tahmini Bitiş:</span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">{getEstimatedFinishTime()}</span>
                        </div>

                        {totalDebt === 0 && (
                            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-semibold">
                                <CheckCircle2 className="w-4 h-4" />
                                Tüm Borçlar Temizlendi!
                            </div>
                        )}
                    </div>
                </div>

                {/* DAILY TARGET */}
                <div className="flex justify-center">
                    <div className="relative overflow-hidden flex items-center gap-1 bg-white dark:bg-slate-800 border border-slate-300/40 dark:border-slate-700/40 rounded-2xl p-1.5 shadow-xl transition-colors duration-500">
                        {/* Shimmer */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/[0.04] to-transparent -translate-x-full animate-[shimmer_3s_infinite] pointer-events-none rounded-2xl" />

                        <button
                            onClick={() => setDailyTarget(Math.max(1, dailyTarget - 1))}
                            className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-500/10 transition-all active:scale-90"
                        >
                            <Minus className="w-4 h-4" />
                        </button>

                        <div className="px-5 flex flex-col items-center min-w-[130px]">
                            <span className="text-[9px] uppercase tracking-[0.25em] text-slate-600 dark:text-slate-400 font-black transition-colors duration-500">Günlük Hedef</span>
                            <div className="flex items-baseline gap-1 mt-0.5">
                                <span className="text-2xl font-bold text-slate-900 dark:text-slate-50 transition-colors duration-500">{dailyTarget}</span>
                                <span className="text-xs text-slate-600 dark:text-slate-400 transition-colors duration-500">Vakit</span>
                            </div>
                        </div>

                        <button
                            onClick={() => setDailyTarget(dailyTarget + 1)}
                            className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-500/10 transition-all active:scale-90"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* PRAYER LIST */}
                <div className="space-y-2.5">
                    {/* Section label */}
                    <div className="flex items-center gap-2 px-1">
                        <span className="w-4 h-px bg-gradient-to-r from-transparent to-emerald-400/50" />
                        <p className="text-[9px] font-black text-emerald-600/70 dark:text-emerald-500/70 uppercase tracking-[0.25em]">Namaz Vakitleri</p>
                        <span className="flex-1 h-px bg-gradient-to-r from-emerald-400/20 to-transparent" />
                    </div>

                    {debts.map((debt, index) => {
                        const isZero = debt.count === 0;

                        return (
                            <div
                                key={debt.type}
                                className={`group relative flex items-center gap-3.5 px-4 py-3.5 rounded-2xl border overflow-hidden transition-all duration-300
                                    ${isZero
                                        ? 'bg-emerald-50 dark:bg-emerald-500/[0.06] border-emerald-500/20'
                                        : 'bg-white dark:bg-slate-800 border-slate-300/50 dark:border-slate-700/50 hover:border-emerald-500/40'
                                    }`}
                                style={{ animationDelay: `${0.1 + index * 0.05}s` }}
                            >
                                {/* Ambient wash */}
                                {!isZero && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 to-emerald-400/0 group-hover:from-emerald-500/[0.03] group-hover:to-transparent transition-all duration-400 pointer-events-none rounded-2xl" />
                                )}

                                {/* Arabic watermark */}
                                <div
                                    dir="rtl"
                                    className="absolute right-14 top-1/2 -translate-y-1/2 font-arabic leading-none select-none pointer-events-none
                                        text-[3rem] text-white/[0.03] group-hover:text-emerald-400/[0.08]
                                        transition-all duration-500 ease-out"
                                >
                                    صلاة
                                </div>

                                {/* Status icon */}
                                <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border shrink-0 transition-colors duration-500
                                    ${isZero
                                        ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                        : 'border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 group-hover:border-emerald-500/50'
                                    }`}>
                                    {isZero
                                        ? <CheckCircle2 className="w-5 h-5" />
                                        : <Circle className="w-5 h-5" />
                                    }
                                </div>

                                {/* Label */}
                                <div className="relative z-10 flex-1 min-w-0 transition-colors duration-500">
                                    <div className={`text-[15px] font-bold leading-tight capitalize
                                        ${isZero ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-slate-50'}`}>
                                        {PrayerDebtService.getLabel(debt.type)}
                                    </div>
                                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                        {isZero ? 'Tamamlandı ✓' : `${debt.count} borç`}
                                    </div>
                                </div>

                                {/* Controls */}
                                <div className="relative z-10 flex items-center gap-2 shrink-0">
                                    <button
                                        onClick={() => handleUpdate(debt.type, -1)}
                                        disabled={isZero}
                                        className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all active:scale-90
                                            ${isZero
                                                ? 'bg-white dark:bg-slate-800 border border-slate-300/50 dark:border-slate-700/50 text-slate-300 dark:text-slate-600 cursor-not-allowed'
                                                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white border border-emerald-500/20 hover:border-emerald-500 hover:shadow-md hover:shadow-emerald-500/20'
                                            }`}
                                    >
                                        <Minus className="w-3.5 h-3.5" />
                                    </button>

                                    <span className={`font-mono text-lg font-bold w-10 text-center transition-colors duration-500
                                        ${isZero ? 'text-emerald-600/60 dark:text-emerald-400/60' : 'text-slate-800 dark:text-slate-100'}`}>
                                        {debt.count}
                                    </span>

                                    <button
                                        onClick={() => handleUpdate(debt.type, 1)}
                                        className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-300/50 dark:border-slate-700/50 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 hover:bg-white dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-all active:scale-90"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Footer tagline */}
                <div className="text-center pt-2 pb-4">
                    <p className="text-[10px] text-slate-600 font-medium tracking-wider">✦ Her namaz bir adım ✦</p>
                </div>
            </div>
        </div>
    );
}
