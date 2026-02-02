import { useState } from 'react';

interface AyetSelectorProps {
    onSearch: (sure: number, ayet: number) => void;
    isLoading: boolean;
}

export function AyetSelector({ onSearch, isLoading }: AyetSelectorProps) {
    const [sure, setSure] = useState('2');
    const [ayet, setAyet] = useState('286');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(parseInt(sure), parseInt(ayet));
    };

    return (
        <div className="mb-8">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-emerald-200/30 dark:border-emerald-700/30 overflow-hidden">
                {/* Decorative top border */}
                <div className="h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500"></div>

                <div className="p-8">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
                        <span className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg text-emerald-600 dark:text-emerald-400">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </span>
                        <span>Ayet Seç</span>
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Sure Input */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Sure No <span className="text-emerald-600 dark:text-emerald-400 font-normal">(1-114)</span>
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="114"
                                    value={sure}
                                    onChange={(e) => setSure(e.target.value)}
                                    className="w-full px-5 py-4 bg-gradient-to-br from-gray-50 to-emerald-50/30 dark:from-slate-700 dark:to-emerald-900/10 border-2 border-emerald-200 dark:border-emerald-700 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all text-lg font-semibold text-gray-800 dark:text-white"
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Ayet Input */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Ayet No
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={ayet}
                                    onChange={(e) => setAyet(e.target.value)}
                                    className="w-full px-5 py-4 bg-gradient-to-br from-gray-50 to-emerald-50/30 dark:from-slate-700 dark:to-emerald-900/10 border-2 border-emerald-200 dark:border-emerald-700 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all text-lg font-semibold text-gray-800 dark:text-white"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:via-emerald-600 hover:to-teal-600 text-white font-bold py-5 px-8 rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg relative overflow-hidden group flex items-center justify-center gap-3"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    <span>Aranıyor...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                    </svg>
                                    <span>Benzer Ayetleri Keşfet</span>
                                </>
                            )}
                        </button>

                        <div className="bg-gradient-to-r from-amber-50 to-emerald-50 dark:from-amber-900/10 dark:to-emerald-900/10 border-l-4 border-amber-500 dark:border-amber-400 px-5 py-4 rounded-r-lg flex items-start gap-3">
                            <span className="text-amber-600 dark:text-amber-400 pt-0.5">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </span>
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                <span className="font-bold text-amber-700 dark:text-amber-400">Not:</span> Bu skorlar NLP tabanlı otomatik hesaplamadır. Ayetlerin tefsiri ve yorumu için uzman kaynaklara başvurunuz.
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
