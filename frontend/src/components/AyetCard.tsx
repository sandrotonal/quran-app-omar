import { useState } from 'react';
import { hapticFeedback } from '../lib/constants';
import { useAudio } from '../hooks/useAudio';

interface AyetCardProps {
    sure: number;
    ayet: number;
    arabicText: string;
    turkishText: string;
    similarityScore?: number;
    isMain?: boolean;
    onClick?: () => void;
}

export function AyetCard({
    sure,
    ayet,
    arabicText,
    turkishText,
    similarityScore,
    isMain = false,
    onClick,
}: AyetCardProps) {
    const [isExpanded, setIsExpanded] = useState(isMain);
    const { isPlaying, isLoading, togglePlay, error } = useAudio(sure, ayet);

    const handleClick = () => {
        hapticFeedback(10);
        setIsExpanded(!isExpanded);
        onClick?.();
    };

    const handlePlay = (e: React.MouseEvent) => {
        e.stopPropagation(); // Card click'ini engelle
        hapticFeedback(20);
        togglePlay();
    };

    const getBadgeColor = (score?: number) => {
        if (!score) return '';
        if (score >= 0.85) return 'bg-emerald-500 text-white';
        if (score >= 0.70) return 'bg-yellow-500 text-white';
        return 'bg-orange-500 text-white';
    };

    const getCardBorder = (score?: number) => {
        if (isMain) return 'border-4 border-amber-400 shadow-2xl shadow-emerald-900/30';
        if (!score) return 'border-2 border-gray-200 dark:border-gray-700';
        if (score >= 0.85) return 'border-2 border-emerald-400 shadow-lg shadow-emerald-500/20';
        if (score >= 0.70) return 'border-2 border-yellow-400 shadow-lg shadow-yellow-500/20';
        return 'border-2 border-orange-400 shadow-lg shadow-orange-500/20';
    };

    return (
        <div
            onClick={handleClick}
            className={`
        bg-white dark:bg-slate-800 rounded-2xl p-5 cursor-pointer
        transition-all duration-300 active:scale-[0.98] hover:shadow-xl
        ${getCardBorder(similarityScore)}
        ${isMain ? 'mb-6' : 'mb-4'}
      `}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={`
            ${isMain ? 'w-12 h-12 text-base' : 'w-10 h-10 text-sm'}
            bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-xl flex items-center justify-center font-bold shadow-lg
          `}>
                        {sure}:{ayet}
                    </div>
                    {isMain && (
                        <span className="px-3 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs font-bold rounded-full shadow-lg">
                            Ana Ayet
                        </span>
                    )}

                    {/* Audio Player Button */}
                    <button
                        onClick={handlePlay}
                        disabled={isLoading}
                        className={`
                            w-10 h-10 rounded-full flex items-center justify-center transition-all
                            ${isPlaying
                                ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 animate-pulse'
                                : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400 hover:bg-emerald-100 hover:text-emerald-600 dark:hover:bg-emerald-900/30'
                            }
                        `}
                        aria-label={isPlaying ? "Durdur" : "Dinle"}
                    >
                        {isLoading ? (
                            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : isPlaying ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        )}
                    </button>
                </div>

                {similarityScore !== undefined && !isMain && (
                    <div className={`px-3 py-1.5 ${getBadgeColor(similarityScore)} rounded-full text-sm font-bold shadow-lg`}>
                        %{(similarityScore * 100).toFixed(0)} benzer
                    </div>
                )}
            </div>

            {/* Error Message for Audio */}
            {error && (
                <div className="text-red-500 text-xs mb-2 pl-1">
                    {error}
                </div>
            )}

            {/* Arabic Text */}
            {arabicText && (
                <div
                    className={`text-right mb-3 font-arabic leading-relaxed text-gray-900 dark:text-white ${isExpanded ? 'text-3xl' : 'text-2xl'
                        } transition-all duration-300`}
                    dir="rtl"
                >
                    {isExpanded ? arabicText : `${arabicText.substring(0, 80)}${arabicText.length > 80 ? '...' : ''}`}
                </div>
            )}

            {/* Turkish Text */}
            <div className={`text-gray-700 dark:text-gray-300 leading-relaxed ${isExpanded ? 'text-lg' : 'text-base'} transition-all duration-300`}>
                {isExpanded ? turkishText : `${turkishText.substring(0, 120)}${turkishText.length > 120 ? '...' : ''}`}
            </div>

            {/* Expand Indicator */}
            {!isMain && (
                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700/50 text-center text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center justify-center gap-1 group-hover:text-emerald-500 transition-colors">
                    {isExpanded ? (
                        <>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                            Küçült
                        </>
                    ) : (
                        <>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                            Detayları Gör
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
