import { useState } from 'react';
import { createPortal } from 'react-dom';
import { SURAHS, hapticFeedback } from '../lib/constants';

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
        <div className="portal-root">
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

                    {/* Header */}
                    <div className="px-6 pt-3 pb-4 shrink-0">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
                            Sure Seç
                        </h3>

                        {/* Search Input */}
                        <div className="relative">
                            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Sure ara... (örn: Bakara)"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.08] rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400 dark:focus:border-emerald-500/50 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 text-sm transition-all duration-200"
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-slate-100 dark:bg-white/[0.06] shrink-0"></div>

                    {/* Surah List */}
                    <div className="overflow-y-auto flex-1 px-4 py-3 space-y-1.5">
                        {filteredSurahs.length === 0 ? (
                            <div className="text-center py-16 text-slate-400 dark:text-slate-500">
                                <p className="text-4xl mb-3">😔</p>
                                <p className="font-semibold text-slate-600 dark:text-slate-400">Sure bulunamadı</p>
                                <p className="text-sm mt-1">Farklı bir arama deneyin</p>
                            </div>
                        ) : (
                            filteredSurahs.map((surah) => (
                                <button
                                    key={surah.id}
                                    onClick={() => handleSelect(surah.id)}
                                    className="w-full flex items-center justify-between p-3.5 rounded-2xl
                                        bg-slate-50 dark:bg-[#141f35]
                                        border border-slate-100 dark:border-white/[0.05]
                                        hover:bg-emerald-50 dark:hover:bg-emerald-500/10
                                        hover:border-emerald-200 dark:hover:border-emerald-500/20
                                        active:scale-[0.98]
                                        transition-all duration-200 group"
                                >
                                    <div className="flex items-center gap-3.5">
                                        {/* Number Badge */}
                                        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white font-bold text-sm shadow-md shadow-emerald-500/20 shrink-0 group-hover:scale-105 transition-transform duration-200">
                                            {surah.id}
                                        </div>
                                        <div className="text-left">
                                            <div className="font-semibold text-slate-900 dark:text-white text-[15px] leading-tight group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors duration-200">
                                                {surah.turkish}
                                            </div>
                                            <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 font-medium">
                                                {surah.ayetCount} ayet
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-base font-arabic text-emerald-600 dark:text-emerald-400 opacity-70 group-hover:opacity-100 transition-opacity duration-200" dir="rtl">
                                        {surah.arabic}
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
