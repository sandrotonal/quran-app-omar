import { useState } from 'react';
import { SurePicker } from './SurePicker';
import { AyetPicker } from './AyetPicker';
import { SURAHS, hapticFeedback } from '../lib/constants';

interface MobileAyetSelectorProps {
    onSearch: (sure: number, ayet: number) => void;
    isLoading: boolean;
}

export function MobileAyetSelector({ onSearch, isLoading }: MobileAyetSelectorProps) {
    const [selectedSure, setSelectedSure] = useState(2);
    const [selectedAyet, setSelectedAyet] = useState(286);
    const [showSurePicker, setShowSurePicker] = useState(false);
    const [showAyetPicker, setShowAyetPicker] = useState(false);

    const selectedSurah = SURAHS.find((s) => s.id === selectedSure);

    const handleSureSelect = (sureId: number) => {
        hapticFeedback(10);
        setSelectedSure(sureId);
        setSelectedAyet(1); // Reset ayet
        setShowSurePicker(false); // Auto close
        // Auto-open ayet picker after sure selection with a slight delay
        setTimeout(() => setShowAyetPicker(true), 300);
    };

    const handleAyetSelect = (ayetNo: number) => {
        hapticFeedback(10);
        setSelectedAyet(ayetNo);
        setShowAyetPicker(false); // Auto close
    };

    const handleSearch = () => {
        hapticFeedback([50, 30, 50]);
        onSearch(selectedSure, selectedAyet);
    };

    return (
        <div className="mb-6 relative z-30">
            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl shadow-xl shadow-emerald-900/5 border border-white/50 dark:border-white/10 overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500"></div>

                <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-5 flex items-center gap-3">
                        <span className="p-2 bg-gradient-to-br from-emerald-100 to-teal-50 dark:from-emerald-900/50 dark:to-teal-900/30 rounded-xl text-emerald-600 dark:text-emerald-400 shadow-sm">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </span>
                        <span>Ayet Seç</span>
                    </h2>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            {/* Sure Selector Button */}
                            <button
                                onClick={() => {
                                    hapticFeedback(10);
                                    setShowSurePicker(true);
                                }}
                                disabled={isLoading}
                                className="col-span-1 text-left px-4 py-3 bg-gray-50 dark:bg-slate-700/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border border-gray-200 dark:border-gray-700 rounded-2xl transition-all active:scale-[0.98]"
                            >
                                <div className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400 mb-1">
                                    Sure
                                </div>
                                <div className="font-bold text-gray-900 dark:text-white truncate">
                                    {selectedSure}. {selectedSurah?.turkish}
                                </div>
                            </button>

                            {/* Ayet Selector Button */}
                            <button
                                onClick={() => {
                                    hapticFeedback(10);
                                    setShowAyetPicker(true);
                                }}
                                disabled={isLoading}
                                className="col-span-1 text-left px-4 py-3 bg-gray-50 dark:bg-slate-700/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border border-gray-200 dark:border-gray-700 rounded-2xl transition-all active:scale-[0.98]"
                            >
                                <div className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400 mb-1">
                                    Ayet
                                </div>
                                <div className="font-bold text-gray-900 dark:text-white">
                                    {selectedAyet}
                                </div>
                            </button>
                        </div>

                        {/* Search Button */}
                        <button
                            onClick={handleSearch}
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:via-emerald-600 hover:to-teal-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transform active:scale-[0.97] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-base flex items-center justify-center gap-2 group"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white/90" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    <span>Aranıyor...</span>
                                </>
                            ) : (
                                <>
                                    <span>Benzer Ayetleri Keşfet</span>
                                    <svg className="w-5 h-5 opacity-90 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Pickers */}
            <SurePicker
                isOpen={showSurePicker}
                onClose={() => setShowSurePicker(false)}
                onSelect={handleSureSelect}
            />
            <AyetPicker
                isOpen={showAyetPicker}
                onClose={() => setShowAyetPicker(false)}
                onSelect={handleAyetSelect}
                maxAyet={selectedSurah?.ayetCount || 286}
                selectedAyet={selectedAyet}
            />
        </div>
    );
}
