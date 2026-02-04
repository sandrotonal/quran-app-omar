import { useState, useEffect } from 'react';
import { SurePicker } from './SurePicker';
import { AyetPicker } from './AyetPicker';
import { SURAHS, hapticFeedback } from '../lib/constants';

interface MobileAyetSelectorProps {
    onSearch: (sure: number, ayet: number) => void;
    isLoading: boolean;
    activeSure?: number;
    activeAyet?: number;
}

export function MobileAyetSelector({ onSearch, isLoading, activeSure, activeAyet }: MobileAyetSelectorProps) {
    const [selectedSure, setSelectedSure] = useState(1);
    const [selectedAyet, setSelectedAyet] = useState(1);
    const [showSurePicker, setShowSurePicker] = useState(false);
    const [showAyetPicker, setShowAyetPicker] = useState(false);

    // Sync state with props
    useEffect(() => {
        if (activeSure) setSelectedSure(activeSure);
        if (activeAyet) setSelectedAyet(activeAyet);
    }, [activeSure, activeAyet]);

    const selectedSurah = SURAHS.find((s) => s.id === selectedSure);

    const handleSureSelect = (sureId: number) => {
        hapticFeedback(10);
        setSelectedSure(sureId);
        setSelectedAyet(1); // Reset ayet
        setShowSurePicker(false); // Auto close
        setTimeout(() => setShowAyetPicker(true), 250);
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
        <div className="mb-6 relative z-30 mx-3">
            {/* Elegant Glass Container */}
            <div className="bg-theme-surface/80 backdrop-blur-md rounded-2xl shadow-lg border border-theme-border/50 overflow-hidden transition-all duration-300">

                {/* Compact Row Layout */}
                <div className="flex flex-col">

                    {/* Top Row: Selectors */}
                    <div className="flex divide-x divide-theme-border/30 h-16">
                        {/* Sure Selector (Wider) */}
                        <button
                            onClick={() => {
                                hapticFeedback(10);
                                setShowSurePicker(true);
                            }}
                            disabled={isLoading}
                            className="flex-1 flex flex-col justify-center px-5 hover:bg-theme-bg/50 active:bg-theme-bg/80 transition-colors text-left"
                        >
                            <span className="text-[10px] font-bold tracking-widest text-emerald-500 uppercase mb-0.5">Sure</span>
                            <div className="flex items-baseline gap-2 truncate">
                                <span className="text-lg font-bold text-theme-text font-serif">{selectedSure}.</span>
                                <span className="text-base font-medium text-theme-text/90 truncate">{selectedSurah?.turkish}</span>
                            </div>
                        </button>

                        {/* Ayet Selector (Narrower) */}
                        <button
                            onClick={() => {
                                hapticFeedback(10);
                                setShowAyetPicker(true);
                            }}
                            disabled={isLoading}
                            className="w-24 flex flex-col justify-center px-4 hover:bg-theme-bg/50 active:bg-theme-bg/80 transition-colors text-center border-l border-theme-border/30"
                        >
                            <span className="text-[10px] font-bold tracking-widest text-emerald-500 uppercase mb-0.5">Ayet</span>
                            <span className="text-xl font-bold text-theme-text font-serif">{selectedAyet}</span>
                        </button>
                    </div>

                    {/* Bottom Row: Action Button */}
                    <button
                        onClick={handleSearch}
                        disabled={isLoading}
                        className="h-12 w-full relative overflow-hidden bg-theme-bg/30 hover:bg-emerald-500/5 border-t border-theme-border/30 flex items-center justify-center gap-2.5 transition-all duration-300 group"
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></span>
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            </div>
                        ) : (
                            <>
                                <span className="text-sm font-bold text-theme-text/90 group-hover:text-emerald-500 transition-colors uppercase tracking-widest font-serif relative z-10">KEŞFET & OKU</span>
                                <svg
                                    className="w-4 h-4 text-theme-muted group-hover:text-emerald-500 group-hover:scale-110 transition-all duration-300 relative z-10"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>

                                {/* Subtle Hover Shine Effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                            </>
                        )}
                    </button>

                    {/* Progress/Decorative Line */}
                    <div className="h-0.5 w-full bg-theme-border/20">
                        <div className="h-full bg-emerald-500/50 w-0 group-hover:w-full transition-all duration-700 ease-out"></div>
                    </div>
                </div>
            </div>

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
