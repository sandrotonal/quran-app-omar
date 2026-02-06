import { useState, useEffect } from 'react';

interface AyetSelectorProps {
    onSearch: (sure: number, ayet: number) => void;
    isLoading: boolean;
    activeSure?: number;
    activeAyet?: number;
}

export function AyetSelector({ onSearch, isLoading, activeSure, activeAyet }: AyetSelectorProps) {
    const [sure, setSure] = useState('1');
    const [ayet, setAyet] = useState('1');

    // Sync active state from parent
    useEffect(() => {
        if (activeSure) setSure(activeSure.toString());
        if (activeAyet) setAyet(activeAyet.toString());
    }, [activeSure, activeAyet]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(parseInt(sure), parseInt(ayet));
    };

    return (
        <div className="mb-8 group">
            <div className="bg-theme-bg/40 dark:bg-slate-800/40 backdrop-blur-xl rounded-3xl shadow-sm border border-theme-border/30 overflow-hidden transition-all duration-500 hover:shadow-md hover:border-accent/20">
                <div className="p-8">
                    <h2 className="text-xl font-bold text-theme-text mb-6 flex items-center gap-3 opacity-90">
                        <span className="p-2 bg-accent/5 dark:bg-accent/10 rounded-xl text-accent">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </span>
                        <span>Ayet Seç</span>
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Sure Input */}
                            <div>
                                <label className="block text-xs font-bold text-theme-muted uppercase tracking-widest mb-2.5 ml-1">
                                    Sure No
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="114"
                                    value={sure}
                                    onChange={(e) => setSure(e.target.value)}
                                    className="w-full px-5 py-3.5 bg-theme-surface/50 dark:bg-slate-700/50 border border-theme-border/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/40 transition-all text-lg font-medium text-theme-text"
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Ayet Input */}
                            <div>
                                <label className="block text-xs font-bold text-theme-muted uppercase tracking-widest mb-2.5 ml-1">
                                    Ayet No
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={ayet}
                                    onChange={(e) => setAyet(e.target.value)}
                                    className="w-full px-5 py-3.5 bg-theme-surface/50 dark:bg-slate-700/50 border border-theme-border/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/40 transition-all text-lg font-medium text-theme-text"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-14 border border-accent/30 hover:border-accent text-accent font-bold rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group/btn flex items-center justify-center gap-3 text-sm tracking-widest uppercase"
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce"></span>
                                    <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                </div>
                            ) : (
                                <>
                                    <span>Keşfet & Oku</span>
                                    <svg className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="bg-gradient-to-r from-amber-50 to-emerald-50 dark:from-amber-900/10 dark:to-emerald-900/10 border-l-4 border-amber-500 dark:border-amber-400 px-5 py-4 rounded-r-lg flex items-start gap-3 mt-6">
                        <span className="text-amber-600 dark:text-amber-400 pt-0.5">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </span>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                            <span className="font-bold text-amber-700 dark:text-amber-400">Not:</span> Bu skorlar NLP tabanlı otomatik hesaplamadır. Ayetlerin tefsiri ve yorumu için uzman kaynaklara başvurunuz.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

