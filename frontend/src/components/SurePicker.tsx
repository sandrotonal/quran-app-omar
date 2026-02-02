import { useState } from 'react';
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

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fadeIn"
                onClick={onClose}
            />

            {/* Bottom Sheet */}
            <div className="fixed inset-x-0 bottom-0 z-50 animate-slideUp">
                <div className="bg-white dark:bg-slate-800 rounded-t-3xl shadow-2xl max-h-[80vh] flex flex-col">
                    {/* Handle */}
                    <div className="flex justify-center pt-3 pb-2">
                        <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                    </div>

                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                            Sure Seç
                        </h3>

                        {/* Search Input */}
                        <input
                            type="text"
                            placeholder="Sure ara... (örn: Bakara)"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white"
                            autoFocus
                        />
                    </div>

                    {/* Surah List */}
                    <div className="overflow-y-auto flex-1 px-6 py-2">
                        {filteredSurahs.length === 0 ? (
                            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                                <p className="text-lg">😔 Sure bulunamadı</p>
                                <p className="text-sm mt-2">Farklı bir arama deneyin</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {filteredSurahs.map((surah) => (
                                    <button
                                        key={surah.id}
                                        onClick={() => handleSelect(surah.id)}
                                        className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 hover:from-emerald-100 hover:to-teal-100 dark:hover:from-emerald-800/30 dark:hover:to-teal-800/30 rounded-xl border border-emerald-200/50 dark:border-emerald-700/50 transition-all active:scale-[0.98]"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-lg font-bold text-sm">
                                                {surah.id}
                                            </div>
                                            <div className="text-left">
                                                <div className="font-semibold text-gray-900 dark:text-white">
                                                    {surah.turkish}
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    {surah.ayetCount} ayet
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className="text-lg font-arabic text-emerald-700 dark:text-emerald-400"
                                            dir="rtl"
                                        >
                                            {surah.arabic}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
