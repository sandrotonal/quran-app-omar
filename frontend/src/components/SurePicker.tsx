import { useState } from 'react';
import { createPortal } from 'react-dom';
import { SURAHS, hapticFeedback } from '../lib/constants';
import { createPortal } from 'react-dom';

interface SurePickerProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (sureId: number) => void;
}

export function SurePicker({ isOpen, onClose, onSelect }: SurePickerProps) {
    const [search, setSearch] = useState('');

    const filteredSurahs = SURAHS.filter(
        (surah) =>
            surah.turkish.toLowerCase().includes(search.toLowerCase()) ||
            surah.arabic.includes(search) ||
            surah.id.toString().includes(search)
    );

    const handleSelect = (sureId: number) => {
        hapticFeedback(10);
        onSelect(sureId);
        onClose();
        setSearch('');
    };

    if (!isOpen) return null;

    return createPortal(
<<<<<<< HEAD
        <>
=======
        <div className="portal-root">
>>>>>>> 5f348047ef567a4aca102ff6647db01db05ac532
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] animate-fadeIn"
                onClick={onClose}
            />

            {/* Bottom Sheet */}
            <div className="fixed inset-x-0 bottom-0 z-[70] animate-slideUp">
                <div className="bg-white dark:bg-[#0D1526] rounded-t-[2rem] shadow-2xl border-t border-slate-100 dark:border-white/[0.07] max-h-[82vh] flex flex-col overflow-hidden">

                    {/* Handle */}
                    <div className="flex justify-center pt-3 pb-1 shrink-0">
                        <div className="w-10 h-1 bg-slate-200 dark:bg-white/20 rounded-full"></div>
                    </div>

                    {/* Header with Search */}
                    <div className="px-6 pt-3 pb-4 border-b border-slate-100 dark:border-white/[0.06] shrink-0">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white text-center tracking-tight mb-4">
                            Sure Seç
                        </h3>

                        <div className="relative">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Sure adı veya numarası ara..."
                                className="w-full bg-slate-50 dark:bg-white/[0.03] text-slate-900 dark:text-white px-5 py-3.5 pr-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 border border-slate-200/60 dark:border-white/[0.05] transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                            />
                            {search && (
                                <button
                                    onClick={() => setSearch('')}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-full transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* List */}
                    <div className="overflow-y-auto overscroll-contain pb-safe shrink-1">
                        <div className="px-4 py-2">
                            {filteredSurahs.length === 0 ? (
                                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                                    Sonuç bulunamadı
                                </div>
                            ) : (
                                filteredSurahs.map((surah) => (
                                    <button
                                        key={surah.id}
                                        onClick={() => handleSelect(surah.id)}
                                        className="w-full flex items-center justify-between p-4 my-1 rounded-xl hover:bg-slate-50 dark:hover:bg-white/[0.03] active:bg-slate-100 dark:active:bg-white/5 transition-all text-left group border border-transparent hover:border-slate-100 dark:hover:border-white/[0.02]"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm shrink-0 font-serif border border-emerald-100 dark:border-emerald-500/20 group-hover:scale-110 transition-transform">
                                                {surah.id}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900 dark:text-white text-lg">
                                                    {surah.turkish}
                                                </div>
                                                <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                                    <span>{surah.ayetCount} Ayet</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-2xl text-emerald-600/60 dark:text-emerald-400/60 font-serif group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors shrink-0">
                                            {surah.arabic}
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
<<<<<<< HEAD
        </>,
=======
        </div>,
>>>>>>> 5f348047ef567a4aca102ff6647db01db05ac532
        document.body
    );
}
