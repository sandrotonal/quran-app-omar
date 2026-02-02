import { useState, useEffect } from 'react';
import { hapticFeedback, SURAHS } from '../lib/constants';
import { useAudio } from '../hooks/useAudio';
import { CircularProgress } from './CircularProgress';

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
    const { isPlaying, isLoading, togglePlay, error, segments, activeWordIndex } = useAudio(sure, ayet);

    // Get Surah Info
    const surahInfo = SURAHS.find(s => s.id === sure);

    // Auto expand when playing to show karaoke
    useEffect(() => {
        if (isPlaying && !isExpanded) {
            setIsExpanded(true);
        }
    }, [isPlaying]);

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

    const percentage = similarityScore ? Math.round(similarityScore * 100) : 0;

    const getCardStyle = () => {
        if (isMain) {
            return 'border-2 border-amber-400/50 shadow-glow-amber ring-1 ring-amber-400/30';
        }
        if (!similarityScore) {
            return 'border border-gray-200 dark:border-gray-700/50';
        }
        if (similarityScore >= 0.85) {
            return 'border border-emerald-400/30 hover:border-emerald-400/60 shadow-lg shadow-emerald-900/10';
        }
        if (similarityScore >= 0.70) {
            return 'border border-amber-400/30 hover:border-amber-400/60 shadow-lg shadow-amber-900/10';
        }
        return 'border border-orange-400/30 hover:border-orange-400/60 shadow-lg shadow-orange-900/10';
    };

    // Karaoke Mode Renderer
    const renderKaraokeText = () => {
        if (!segments || segments.length === 0) return arabicText;

        return (
            <div className="flex flex-wrap flex-row-reverse gap-2 leading-[2.5] relative z-20">
                {segments.map((segment: any, index: number) => {
                    const isActive = index === activeWordIndex;
                    return (
                        <span
                            key={index}
                            className={`
                                transition-all duration-200 cursor-pointer rounded px-1
                                ${isActive
                                    ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-100/50 dark:bg-emerald-900/30 scale-110 font-bold shadow-sm'
                                    : 'text-gray-800 dark:text-slate-200 hover:text-emerald-500'
                                }
                            `}
                        >
                            {segment.text}
                        </span>
                    );
                })}
            </div>
        );
    };

    return (
        <div
            onClick={handleClick}
            className={`
                bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-6 cursor-pointer
                transition-all duration-300 active:scale-[0.98] hover:shadow-2xl relative overflow-hidden group
                ${getCardStyle()}
                ${isMain ? 'mb-8 scale-[1.01]' : 'mb-4'}
            `}
        >
            {/* Bağlantı Çizgisi Efekti */}
            {!isMain && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-px h-4 bg-gradient-to-b from-gray-300 to-transparent dark:from-gray-600 opacity-50"></div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3 relative z-10 w-full">
                    {/* Verse Number Box */}
                    <div className={`
                        ${isMain ? 'w-14 h-14 text-lg' : 'w-10 h-10 text-sm'}
                        flex-shrink-0
                        bg-gradient-to-br from-gray-100 to-white dark:from-slate-700 dark:to-slate-600 
                        text-gray-700 dark:text-gray-200 rounded-2xl flex items-center justify-center font-bold shadow-inner border border-white/50 dark:border-white/10
                    `}>
                        {sure}:{ayet}
                    </div>

                    {/* Surah Name & Info */}
                    <div className="flex flex-col flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <h3 className={`font-bold truncat ${isMain ? 'text-lg text-gray-900 dark:text-white' : 'text-base text-gray-800 dark:text-gray-200'}`}>
                                {surahInfo?.turkish || `${sure}. Sure`}
                            </h3>
                            {isMain && (
                                <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-[10px] font-bold uppercase rounded-full tracking-wider whitespace-nowrap">
                                    Ana Ayet
                                </span>
                            )}
                        </div>
                        <div className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 truncate font-arabic opacity-80">
                            {surahInfo?.arabic} • {surahInfo?.ayetCount} Ayet
                        </div>
                    </div>

                    {/* Audio Player Button (Right Aligned in this layout to avoid overlap) */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                        <button
                            onClick={handlePlay}
                            disabled={isLoading}
                            className={`
                                w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 transform active:scale-90
                                ${isPlaying
                                    ? 'bg-amber-100/50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400 ring-2 ring-amber-400/30'
                                    : 'bg-gray-50 dark:bg-slate-700/50 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                                }
                            `}
                            aria-label={isPlaying ? "Durdur" : "Dinle"}
                        >
                            {isLoading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent opacity-50"></div>
                            ) : isPlaying ? (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" /></svg>
                            ) : (
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                            )}
                        </button>

                        {similarityScore !== undefined && !isMain && (
                            <div className="relative z-10">
                                <CircularProgress percentage={percentage} size={42} strokeWidth={4} showText={true} />
                            </div>
                        )}
                    </div>

                    {/* Error Message for Audio */}
                    {error && (
                        <div className="absolute left-14 bottom-0 text-red-500 text-[10px] whitespace-nowrap">
                            ⚠️ Hata
                        </div>
                    )}
                </div>
            </div>

            {/* Arabic Text (Karaoke Aware) */}
            <div
                className={`
                    text-right font-arabic leading-[1.8] text-gray-800 dark:text-slate-100 
                    ${isExpanded ? 'text-4xl mb-6' : 'text-3xl mb-4'} 
                    ${isMain ? 'text-amber-900 dark:text-amber-50' : ''}
                    transition-all duration-500 ease-out relative z-10
                `}
                dir="rtl"
            >
                {(isPlaying || segments.length > 0) ? renderKaraokeText() : (
                    isExpanded ? arabicText : `${arabicText.substring(0, 100)}${arabicText.length > 100 ? '...' : ''}`
                )}
            </div>

            {/* Turkish Text */}
            <div className={`
                text-gray-600 dark:text-slate-300 leading-relaxed font-normal
                ${isExpanded ? 'text-lg' : 'text-base'} 
                transition-all duration-300 relative z-10 border-t border-gray-100 dark:border-gray-700/50 pt-4
            `}>
                {isExpanded ? turkishText : `${turkishText.substring(0, 140)}${turkishText.length > 140 ? '...' : ''}`}
            </div>

            {/* Expand Indicator & Gradient Overlay (if collapsed) */}
            {!isMain && !isExpanded && (
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-slate-800 dark:via-slate-800/80 pointer-events-none flex items-end justify-center pb-2">
                    <div className="text-emerald-500/50">
                        {/* animate-bounce REMOVED as requested */}
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                </div>
            )}

            {/* Collapse Button (if expanded) */}
            {isExpanded && !isMain && (
                <div className="mt-4 flex justify-center text-gray-400 hover:text-emerald-500 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                </div>
            )}

            {/* Background Glow for Main Card */}
            {isMain && (
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent pointer-events-none"></div>
            )}
        </div>
    );
}
