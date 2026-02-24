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

    useEffect(() => {
        if (activeSure) setSelectedSure(activeSure);
        if (activeAyet) setSelectedAyet(activeAyet);
    }, [activeSure, activeAyet]);

    const selectedSurah = SURAHS.find((s) => s.id === selectedSure);

    const handleSureSelect = (sureId: number) => {
        hapticFeedback(10);
        setSelectedSure(sureId);
        setSelectedAyet(1);
        setShowSurePicker(false);
        setTimeout(() => setShowAyetPicker(true), 250);
    };

    const handleAyetSelect = (ayetNo: number) => {
        hapticFeedback(10);
        setSelectedAyet(ayetNo);
        setShowAyetPicker(false);
    };

    const handleSearch = () => {
        hapticFeedback([50, 30, 50]);
        onSearch(selectedSure, selectedAyet);
    };

    return (
        <div className="mb-6 mx-3">
            {/* Card container */}
            <div className="relative z-30 overflow-hidden rounded-2xl bg-white dark:bg-[#0D1526] border border-slate-100 dark:border-white/[0.07] shadow-xl transition-colors duration-300">

                {/* Subtle ambient glow */}
                <div className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 bg-emerald-400/10 dark:bg-emerald-500/[0.06] rounded-full blur-[50px]"></div>

                {/* Top row: Selectors */}
                <div className="flex h-[4.25rem]">
                    {/* Sure Selector */}
                    <button
                        onClick={() => { hapticFeedback(10); setShowSurePicker(true); }}
                        disabled={isLoading}
                        className="flex-1 flex flex-col justify-center px-5 hover:bg-slate-50 dark:hover:bg-white/[0.03] active:bg-slate-100 dark:active:bg-white/5 transition-colors duration-150 text-left group"
                    >
                        <span className="text-[9px] font-extrabold tracking-[0.18em] text-emerald-500 dark:text-emerald-400 uppercase mb-1">SURE</span>
                        <div className="flex items-baseline gap-2 truncate">
                            <span className="text-[1.15rem] font-bold text-slate-900 dark:text-white font-serif leading-none">{selectedSure}.</span>
                            <span className="text-base font-semibold text-slate-700 dark:text-slate-200 truncate leading-none group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200">{selectedSurah?.turkish}</span>
                        </div>
                    </button>

                    {/* Divider */}
                    <div className="w-px bg-slate-100 dark:bg-white/[0.06] self-stretch my-3"></div>

                    {/* Ayet Selector */}
                    <button
                        onClick={() => { hapticFeedback(10); setShowAyetPicker(true); }}
                        disabled={isLoading}
                        className="w-24 flex flex-col justify-center items-center hover:bg-slate-50 dark:hover:bg-white/[0.03] active:bg-slate-100 dark:active:bg-white/5 transition-colors duration-150 group"
                    >
                        <span className="text-[9px] font-extrabold tracking-[0.18em] text-emerald-500 dark:text-emerald-400 uppercase mb-1">AYET</span>
                        <span className="text-[1.35rem] font-bold text-slate-900 dark:text-white font-serif leading-none group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200">{selectedAyet}</span>
                    </button>
                </div>

                {/* Divider */}
                <div className="h-px bg-slate-100 dark:bg-white/[0.06]"></div>

                {/* KEŞFET & OKU Button */}
                <button
                    onClick={handleSearch}
                    disabled={isLoading}
                    className="relative h-12 w-full flex items-center justify-center gap-2.5 overflow-hidden
                        hover:bg-emerald-50 dark:hover:bg-emerald-500/[0.06]
                        active:bg-emerald-100 dark:active:bg-emerald-500/10
                        transition-colors duration-200 group"
                >
                    {isLoading ? (
                        <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0ms]"></span>
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:150ms]"></span>
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:300ms]"></span>
                        </div>
                    ) : (
                        <>
                            <span className="text-[11px] font-black text-emerald-500 dark:text-emerald-400 uppercase tracking-[0.2em] group-hover:tracking-[0.28em] transition-all duration-300">KEŞFET & OKU</span>
                            <svg className="w-4 h-4 text-emerald-400 group-hover:translate-x-1.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                            {/* Sheen sweep */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none"></div>
                        </>
                    )}
                </button>
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
