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
                            <span className="text-[10px] font-bold tracking-widest text-accent uppercase mb-0.5">Sure</span>
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
                            <span className="text-[10px] font-bold tracking-widest text-accent uppercase mb-0.5">Ayet</span>
                            <span className="text-xl font-bold text-theme-text font-serif">{selectedAyet}</span>
                        </button>
                    </div>

                    {/* Bottom Row: Action Button - Refined Outline Style */}
                    <button
                        onClick={handleSearch}
                        disabled={isLoading}
                        className="h-12 w-full relative overflow-hidden bg-transparent hover:bg-accent/5 border-t border-theme-border/30 flex items-center justify-center gap-2.5 transition-all duration-300 group"
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce"></span>
                                <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            </div>
                        ) : (
                            <>
                                <span className="text-xs font-bold text-accent group-hover:tracking-[0.2em] transition-all duration-300 uppercase tracking-widest font-serif relative z-10">KEŞFET & OKU</span>
                                <svg
                                    className="w-4 h-4 text-accent/70 group-hover:translate-x-1 transition-all duration-300 relative z-10"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>

                                {/* Subtle Hover Shine Effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                            </>
                        )}
                    </button>

                    {/* Progress/Decorative Line */}
                    <div className="h-[1px] w-full bg-theme-border/10">
                        <div className="h-full bg-accent/30 w-0 group-hover:w-full transition-all duration-700 ease-out"></div>
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
