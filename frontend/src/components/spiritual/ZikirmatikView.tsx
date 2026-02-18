import { useState, useEffect } from 'react';
import { hapticFeedback } from '../../lib/constants';

interface ZikirmatikViewProps {
    onClose: () => void;
}

export function ZikirmatikView({ onClose }: ZikirmatikViewProps) {
    const [count, setCount] = useState(0);
    const [target, setTarget] = useState(33);
    const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    // Stats State
    const [totalZikir, setTotalZikir] = useState(0);
    const [streak, setStreak] = useState(1);

    // Load state from localStorage on mount
    useEffect(() => {
        const savedCount = localStorage.getItem('zikir_count');
        const savedTarget = localStorage.getItem('zikir_target');
        const savedTotal = localStorage.getItem('zikir_total_count');
        const savedStreak = localStorage.getItem('zikir_streak');
        const lastDate = localStorage.getItem('zikir_last_date');

        if (savedCount) setCount(parseInt(savedCount));
        if (savedTarget) setTarget(parseInt(savedTarget));
        if (savedTotal) setTotalZikir(parseInt(savedTotal));

        // Basic Streak Logic
        const today = new Date().toDateString();
        if (savedStreak && lastDate) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            if (lastDate === today) {
                setStreak(parseInt(savedStreak));
            } else if (lastDate === yesterday.toDateString()) {
                setStreak(parseInt(savedStreak)); // Streak continues today but don't increment yet until action? 
                // actually if they open it today, streak is potentially active. 
                // Let's toggle it when they actually increment.
            } else {
                setStreak(1); // Reset if missed a day
            }
        } else {
            setStreak(1);
        }
    }, []);

    // Save state on change
    useEffect(() => {
        localStorage.setItem('zikir_count', count.toString());
        localStorage.setItem('zikir_target', target.toString());
    }, [count, target]);

    const updateStats = () => {
        const newTotal = totalZikir + 1;
        setTotalZikir(newTotal);
        localStorage.setItem('zikir_total_count', newTotal.toString());

        const today = new Date().toDateString();
        const lastDate = localStorage.getItem('zikir_last_date');

        if (lastDate !== today) {
            let newStreak = 1;
            if (lastDate) {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                if (lastDate === yesterday.toDateString()) {
                    const currentStreak = parseInt(localStorage.getItem('zikir_streak') || '0');
                    newStreak = currentStreak + 1;
                }
            }
            setStreak(newStreak);
            localStorage.setItem('zikir_streak', newStreak.toString());
            localStorage.setItem('zikir_last_date', today);
        } else {
            // Ensure today's streak is persisted if not already
            localStorage.setItem('zikir_last_date', today);
            localStorage.setItem('zikir_streak', streak.toString());
        }
    };

    const handleIncrement = () => {
        if (isCompleted) return;

        const newCount = count + 1;
        setCount(newCount);
        updateStats();
        hapticFeedback(15); // Medium feedback for count

        // Check for target completion
        if (newCount > 0 && newCount % target === 0) {
            hapticFeedback(50); // Stronger feedback
            setIsCompleted(true);
        }
    };

    const handleReset = () => {
        if (confirm('Zikirmatiği sıfırlamak istiyor musunuz?')) {
            setCount(0);
            setIsCompleted(false);
            hapticFeedback(20);
        }
    };

    const handleCompletionAction = (action: 'new-target' | 'continue') => {
        setIsCompleted(false);
        if (action === 'new-target') {
            setCount(0);
            setIsTargetModalOpen(true);
        }
        // 'continue' just closes the modal and keeps counting
    };

    const progress = Math.min(100, (count % target) / target * 100);

    return (
        <div className="fixed inset-0 z-[60] bg-theme-bg/95 backdrop-blur-3xl flex flex-col animate-fadeIn overflow-hidden text-theme-text h-full">

            {/* Header */}
            <div className="px-6 py-6 flex items-center justify-between shrink-0 relative z-20">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onClose}
                        className="p-3 -ml-2 rounded-full hover:bg-theme-surface/50 text-theme-text transition-all active:scale-95 group"
                    >
                        <svg className="w-6 h-6 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <h2 className="text-xl font-bold font-serif tracking-wide opacity-0 animate-slideRight" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
                        Zikirmatik
                    </h2>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsTargetModalOpen(true)}
                        className="p-2.5 rounded-full bg-theme-surface border border-theme-border/50 text-theme-muted hover:text-emerald-500 transition-colors"
                        title="Hedef Belirle"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-1.066 2.573c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </button>
                    <button
                        onClick={handleReset}
                        className="p-2.5 rounded-full bg-theme-surface border border-theme-border/50 text-theme-muted hover:text-red-500 transition-colors"
                        title="Sıfırla"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    </button>
                </div>
            </div>

            {/* Main Click Area */}
            <div className="flex-1 flex flex-col items-center justify-center relative p-6 cursor-pointer select-none" onClick={handleIncrement}>

                {/* Counter Ring */}
                <div className="relative w-72 h-72 sm:w-80 sm:h-80 mx-auto flex items-center justify-center">

                    {/* Ring Background */}
                    <div className="absolute inset-0 rounded-full border-8 border-theme-border/30"></div>

                    {/* Active Progress Ring */}
                    <svg className="w-full h-full -rotate-90 transform absolute inset-0 pointer-events-none">
                        <defs>
                            <linearGradient id="zikirGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#10B981" />
                                <stop offset="100%" stopColor="#34D399" />
                            </linearGradient>
                        </defs>
                        <circle
                            cx="50%"
                            cy="50%"
                            r="140"
                            stroke="currentColor"
                            strokeWidth="2"
                            fill="transparent"
                            className="text-theme-border/20"
                        />
                        <circle
                            cx="50%"
                            cy="50%"
                            r="140"
                            stroke="url(#zikirGradient)"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={2 * Math.PI * 140}
                            strokeDashoffset={2 * Math.PI * 140 * (1 - progress / 100)}
                            strokeLinecap="round"
                            className="transition-all duration-200 ease-out drop-shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                        />
                    </svg>

                    {/* Counter Text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
                        <span className="text-sm font-bold tracking-[0.3em] text-theme-muted uppercase mb-2 opacity-60">
                            TOPLAM
                        </span>
                        <h1 className="text-8xl font-light font-mono tracking-tighter text-theme-text tabular-nums">
                            {count}
                        </h1>
                        <div className="mt-4 px-3 py-1 rounded-full bg-theme-surface border border-theme-border/50 text-xs font-bold text-emerald-500 tracking-wider">
                            HEDEF: {target}
                        </div>
                    </div>
                </div>

                <p className="mt-12 text-theme-muted/50 text-sm font-medium tracking-wide animate-pulse pointer-events-none">
                    Dokunarak zikret
                </p>

            </div>

            {/* Target Modal - Redesigned (Soft & Modern) */}
            {isTargetModalOpen && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" style={{ backdropFilter: 'blur(8px)' }}>
                    <div className="absolute inset-0 bg-black/40 transition-opacity" onClick={() => setIsTargetModalOpen(false)}></div>
                    <div className="bg-theme-surface w-full max-w-sm rounded-[2.5rem] shadow-2xl border border-theme-border/50 relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
                        {/* Decorative Header */}
                        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-emerald-500/10 to-transparent pointer-events-none"></div>

                        <div className="p-6 pt-8 relative">
                            <div className="text-center mb-6">
                                <div className="w-14 h-14 mx-auto bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center mb-3 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20">
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                </div>
                                <h3 className="text-xl font-bold font-serif text-theme-text">Hedefini Seç</h3>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-6">
                                {[33, 99, 100, 500, 1000].map(val => (
                                    <button
                                        key={val}
                                        onClick={() => {
                                            setTarget(val);
                                            hapticFeedback(10);
                                        }}
                                        className={`
                                            relative h-12 rounded-xl border transition-all duration-200 flex items-center justify-center
                                            ${target === val
                                                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold shadow-emerald-500/10 shadow-lg'
                                                : 'border-theme-border/50 bg-theme-bg/50 text-theme-muted hover:border-emerald-500/30'
                                            }
                                        `}
                                    >
                                        {val}
                                    </button>
                                ))}
                                <button
                                    onClick={() => {
                                        const custom = prompt('Özel hedef giriniz:', target.toString());
                                        if (custom && !isNaN(parseInt(custom))) {
                                            setTarget(parseInt(custom));
                                        }
                                    }}
                                    className="relative h-12 rounded-xl border border-dashed border-theme-border/50 bg-theme-bg/30 text-theme-muted hover:border-emerald-500/30 hover:text-emerald-500 transition-colors font-medium flex items-center justify-center"
                                >
                                    Özel
                                </button>
                            </div>

                            <button
                                onClick={() => setIsTargetModalOpen(false)}
                                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white rounded-xl font-bold tracking-wide transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2"
                            >
                                <span>Bismillah, Başla</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Premium Full-Screen Success Modal */}
            {isCompleted && (
                <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#0B1220]/90 backdrop-blur-md animate-in fade-in duration-500">
                    {/* Glass Card */}
                    <div
                        className="w-full max-w-sm mx-4 p-8 rounded-[3rem] text-center relative overflow-hidden animate-in zoom-in-95 duration-500 delay-100 flex flex-col items-center"
                        style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                        }}
                    >
                        {/* Close Icon */}
                        <button
                            onClick={() => setIsCompleted(false)}
                            className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>

                        {/* Background Glows */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-emerald-500/20 rounded-full blur-[60px] animate-pulse-slow pointer-events-none"></div>

                        {/* Icon & Animation */}
                        <div className="relative mb-8 mt-4">
                            {/* Rotating Halo */}
                            <div className="absolute inset-0 border border-emerald-500/30 rounded-full animate-spin-slow [--tw-duration:10s]"></div>
                            <div className="absolute -inset-4 border border-emerald-500/10 rounded-full animate-spin-reverse-slow [--tw-duration:15s]"></div>

                            {/* Main Check Circle */}
                            <div className="w-24 h-24 bg-gradient-to-tr from-emerald-500 to-emerald-400 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)] animate-in zoom-in duration-500 relative z-10">
                                <svg className="w-10 h-10 text-white animate-in zoom-in spin-in-12 duration-500 delay-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>

                        {/* Text Hierarchy */}
                        <h2 className="text-2xl font-bold text-white tracking-widest mb-1 font-serif animate-in slide-in-from-bottom-2 duration-500 delay-200">
                            ELHAMDÜLİLLAH
                        </h2>
                        <p className="text-emerald-400/90 font-medium text-sm tracking-wide uppercase mb-8 animate-in slide-in-from-bottom-2 duration-500 delay-300">
                            Hedef Tamamlandı
                        </p>

                        {/* Stats Row */}
                        <div className="flex items-center justify-center gap-8 mb-10 animate-in slide-in-from-bottom-2 duration-500 delay-400">
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em] mb-1">TOPLAM</span>
                                <span className="text-3xl font-bold text-white tracking-tight">{totalZikir.toLocaleString()}</span>
                            </div>
                            <div className="w-px h-10 bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em] mb-1">SERİ</span>
                                <span className="text-3xl font-bold text-white tracking-tight">
                                    {streak} <span className="text-sm font-medium text-emerald-400/80 align-middle">GÜN</span>
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="w-full space-y-3 animate-in slide-in-from-bottom-2 duration-500 delay-500">
                            <button
                                onClick={() => handleCompletionAction('new-target')}
                                className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl font-bold tracking-wide transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] active:scale-[0.98] group flex items-center justify-center gap-2"
                            >
                                <span>Yeni Hedef Belirle</span>
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                            </button>

                            <button
                                onClick={() => handleCompletionAction('continue')}
                                className="w-full py-3 text-white/40 hover:text-white font-medium text-sm transition-colors hover:bg-white/5 rounded-xl"
                            >
                                Zikre Devam Et
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}
