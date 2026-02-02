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
        setSelectedSure(sureId);
        setSelectedAyet(1); // Reset ayet
        // Auto-open ayet picker after sure selection
        setTimeout(() => setShowAyetPicker(true), 300);
    };

    const handleSearch = () => {
        hapticFeedback([50, 30, 50]);
        onSearch(selectedSure, selectedAyet);
    };

    return (
        <div className="mb-6">
            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-emerald-200/30 dark:border-emerald-700/30 overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500"></div>

                <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
                        <span className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg text-emerald-600 dark:text-emerald-400">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </span>
                        <span>Ayet Seç</span>
                    </h2>

                    <div className="space-y-4">
                        {/* Sure Selector Button */}
                        <button
                            onClick={() => {
                                hapticFeedback(10);
                                setShowSurePicker(true);
                            }}
                            disabled={isLoading}
                            className="w-full text-left px-5 py-4 bg-gradient-to-br from-gray-50 to-emerald-50/30 dark:from-slate-700 dark:to-emerald-900/10 border-2 border-emerald-200 dark:border-emerald-700 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                            <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                                Sure Seç
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                                        {selectedSure}. {selectedSurah?.turkish}
                                    </span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                                        ({selectedSurah?.ayetCount} ayet)
                                    </span>
                                </div>
                                <span className="text-xl font-arabic text-emerald-600 dark:text-emerald-400" dir="rtl">
                                    {selectedSurah?.arabic}
                                </span>
                            </div>
                        </button>

                        {/* Ayet Selector Button */}
                        <button
                            onClick={() => {
                                hapticFeedback(10);
                                setShowAyetPicker(true);
                            }}
                            disabled={isLoading}
                            className="w-full text-left px-5 py-4 bg-gradient-to-br from-gray-50 to-emerald-50/30 dark:from-slate-700 dark:to-emerald-900/10 border-2 border-emerald-200 dark:border-emerald-700 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                            <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                                Ayet No
                            </div>
                            <div className="text-lg font-bold text-gray-900 dark:text-white">
                                {selectedAyet}. Ayet
                            </div>
                        </button>

                        {/* Search Button */}
                        <button
                            onClick={handleSearch}
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:via-emerald-600 hover:to-teal-600 text-white font-bold py-5 px-8 rounded-xl shadow-xl hover:shadow-2xl transform active:scale-[0.97] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-lg relative overflow-hidden group flex items-center justify-center gap-3"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    <span>Benzer Ayetler Aranıyor...</span>
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

                        {/* Info Note */}
                        <div className="bg-gradient-to-r from-amber-50 to-emerald-50 dark:from-amber-900/10 dark:to-emerald-900/10 border-l-4 border-amber-500 dark:border-amber-400 px-5 py-4 rounded-r-lg flex items-start gap-3">
                            <span className="text-amber-600 dark:text-amber-400 pt-0.5">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </span>
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                <span className="font-bold text-amber-700 dark:text-amber-400">Not:</span> Benzerlik skorları NLP tabanlı otomatik hesaplamadır.
                            </p>
                        </div>
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
                onSelect={setSelectedAyet}
                maxAyet={selectedSurah?.ayetCount || 286}
                selectedAyet={selectedAyet}
            />
        </div>
    );
}
