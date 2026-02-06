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
    const { isPlaying, isLoading, togglePlay, segments, activeWordIndex } = useAudio(sure, ayet);

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

    const [isFavorite, setIsFavorite] = useState(false);

    // Load favorite status
    useEffect(() => {
        try {
            const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
            setIsFavorite(favs.some((f: any) => f.sure === sure && f.ayet === ayet));
        } catch (e) { console.error(e); }
    }, [sure, ayet]);

    const handleToggleFavorite = (e: React.MouseEvent) => {
        e.stopPropagation();
        hapticFeedback(15);
        try {
            const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
            let newFavs;
            if (isFavorite) {
                newFavs = favs.filter((f: any) => !(f.sure === sure && f.ayet === ayet));
            } else {
                newFavs = [...favs, { sure, ayet, date: Date.now() }];
            }
            localStorage.setItem('favorites', JSON.stringify(newFavs));
            setIsFavorite(!isFavorite);
        } catch (e) {
            console.error("Fav toggle error", e);
        }
    };

    const percentage = similarityScore ? Math.round(similarityScore * 100) : 0;

    const getCardStyle = () => {
        if (isMain) {
            // Golden Frame ONLY for the main focused ayet
            return 'border-2 border-amber-400/40 shadow-[0_0_30px_rgba(251,191,36,0.1)] ring-1 ring-amber-400/20 bg-theme-surface/10';
        }
        // Standard Card Style (Quiet) - Updated with Semantic Tokens
        return 'border border-theme-border/20 shadow-sm hover:shadow-md hover:border-emerald-500/20 bg-theme-surface/60 hover:bg-theme-surface';
    };

    // Karaoke Mode Renderer
    const renderKaraokeText = () => {
        if (!segments || segments.length === 0) return arabicText;
        // ... (existing code omitted for brevity in tool call, but context kept)
        // Wait, replace requires exact context.
        return (
            <div className="flex flex-wrap flex-row-reverse gap-3 leading-[2.8] relative z-20">
                {segments.map((segment: any, index: number) => {
                    const isActive = index === activeWordIndex;
                    return (
                        <span
                            key={index}
                            className={`
                                transition-all duration-300 cursor-pointer rounded px-1.5
                                ${isActive
                                    ? 'text-emerald-600 dark:text-emerald-400 scale-110 font-bold drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                                    : 'text-theme-text hover:text-emerald-600 transition-colors'
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
                rounded-[2rem] p-6 md:p-8 cursor-pointer
                transition-all duration-500 ease-out relative overflow-hidden group
                ${getCardStyle()}
                ${isMain ? 'mb-10 scale-[1.02]' : 'mb-4 hover:scale-[1.01]'}
            `}
        >
            {/* Bağlantı Çizgisi Efekti - Sadece listede */}
            {!isMain && (
                <div className="absolute -top-4 left-8 w-px h-6 bg-gradient-to-b from-emerald-500/20 to-transparent"></div>
            )}

            {/* Header: Verse Number & Similarity */}
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                    <span className={`
                        flex items-center justify-center w-10 h-10 rounded-full font-serif text-lg font-bold shadow-sm transition-all duration-300
                        ${isMain
                            ? 'bg-amber-100 text-amber-800 ring-2 ring-amber-200 shadow-amber-500/20'
                            : 'bg-theme-surface border border-theme-border text-theme-muted'
                        }
                    `}>
                        {ayet}
                    </span>

                    {!isMain && (
                        <span className="text-xs font-bold text-theme-muted uppercase tracking-wider">
                            {SURAHS[sure - 1]?.turkish || `${sure}. Sure`}
                        </span>
                    )}
                </div>

                {/* Actions: Audio & Score & Favorite */}
                <div className="flex items-center gap-3">
                    {/* Favorite Button (New) */}
                    <button
                        onClick={handleToggleFavorite}
                        className={`
                            p-2 rounded-full transition-all duration-300
                            ${isFavorite
                                ? 'text-red-500 bg-red-500/10 scale-110'
                                : 'text-theme-muted hover:text-red-500 hover:bg-theme-surface'
                            }
                        `}
                        aria-label="Favorilere Ekle"
                    >
                        <svg className="w-5 h-5" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </button>

                    {/* Audio Button */}
                    <button
                        onClick={handlePlay}
                        disabled={isLoading}
                        className={`
                            p-2 rounded-full transition-all duration-300
                            ${isPlaying
                                ? 'text-emerald-500 bg-emerald-500/10'
                                : 'text-theme-muted hover:text-emerald-500 hover:bg-theme-surface'
                            }
                        `}
                        aria-label={isPlaying ? "Durdur" : "Dinle"}
                    >
                        {isLoading ? (
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                        ) : isPlaying ? (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                        ) : (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                        )}
                    </button>

                    {/* Similarity Score Indicator - Only for non-main cards */}
                    {similarityScore !== undefined && !isMain && (
                        <div className="relative group">
                            <CircularProgress size={36} strokeWidth={3} percentage={similarityScore * 100} color="emerald" />
                            <span className="absolute -bottom-6 right-0 text-[10px] font-medium text-theme-muted opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                Benzerlik
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Arabic Text (The Core) */}
            <div
                className={`
                    text-right font-arabic leading-[2.2] tracking-wide
                    ${isExpanded ? 'text-4xl md:text-5xl mb-8' : 'text-3xl md:text-4xl mb-5'}
                    ${isExpanded ? 'text-4xl md:text-5xl mb-8' : 'text-3xl md:text-4xl mb-5'}
                    ${isMain ? 'text-theme-text drop-shadow-sm' : 'text-theme-text'}
                    transition-all duration-500 ease-out relative z-10 py-2
                `}
                dir="rtl"
            >
                {(isPlaying || segments.length > 0) ? renderKaraokeText() : (
                    isExpanded ? arabicText : `${arabicText.substring(0, 120)}${arabicText.length > 120 ? '...' : ''}`
                )}
            </div>

            {/* Turkish Text (The Support) */}
            <div className={`
                font-serif leading-relaxed
                ${isMain ? 'text-theme-text' : 'text-theme-muted'}
                ${isExpanded ? 'text-lg md:text-xl font-medium' : 'text-base line-clamp-2'} 
                transition-all duration-500
            `}>
                {turkishText}
            </div>

            {/* Expand Indicator (Subtle) */}
            {!isMain && !isExpanded && (
                <div className="mt-4 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            )}

            {/* Collapse Indicator */}
            {isExpanded && !isMain && (
                <div className="mt-6 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg className="w-4 h-4 text-gray-500 hover:text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                </div>
            )}
        </div>
    );
}
