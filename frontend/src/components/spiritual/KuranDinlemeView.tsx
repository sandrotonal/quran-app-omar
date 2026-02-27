import { useEffect, useState, useRef } from 'react';
import { hapticFeedback } from '../../lib/constants';
import { useAudio, SURAS } from '../../context/AudioContext';

export function KuranDinlemeView({ onClose }: { onClose: () => void }) {
    const [isVisible, setIsVisible] = useState(false);
    const [showList, setShowList] = useState(false);
    const progressBarRef = useRef<HTMLDivElement>(null);

    // Tüm logic'i Global AudioContext'ten çekiyoruz! (Magic happens here)
    const {
        currentSurahIndex,
        setCurrentSurahIndex,
        isPlaying,
        progress,
        currentTime,
        duration,
        togglePlay,
        playNext,
        playPrev,
        seekTime,
        activeSurah,
        setIsAudioModeActive
    } = useAudio();

    useEffect(() => {
        // Ekran görünürlüğünü tetikle
        requestAnimationFrame(() => requestAnimationFrame(() => setIsVisible(true)));

        // Sistemin "Audio Mode"da olduğunu belirt (Mini-Player'ı da besler)
        setIsAudioModeActive(true);
    }, [setIsAudioModeActive]);

    const handleClose = () => {
        setIsVisible(false);
        // Audio pause YAPMIYORUZ! (Arka planda Spotify gibi çalmaya devam edecek)
        setTimeout(onClose, 500);
    };

    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!progressBarRef.current) return;

        hapticFeedback(10);
        const rect = progressBarRef.current.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;

        const newProgress = (clickX / width) * 100;
        const newTime = (newProgress / 100) * duration;

        seekTime(newTime); // Context üzerinden seek yapıyoruz
    };

    const formatTime = (timeInSeconds: number) => {
        if (isNaN(timeInSeconds) || timeInSeconds === Infinity) return "00:00";
        const m = Math.floor(timeInSeconds / 60);
        const s = Math.floor(timeInSeconds % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden p-0 sm:p-6 md:p-8">
            <div
                className={`absolute inset-0 bg-[#fdfbf7]/95 dark:bg-slate-900/95 backdrop-blur-2xl transition-opacity duration-700 ease-out z-0 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                onClick={handleClose}
            />

            <div className={`relative w-full h-full sm:h-[95vh] sm:max-w-md md:h-auto md:max-h-[85vh] flex flex-col sm:rounded-[40px] overflow-hidden bg-[#fdfbf7] dark:bg-slate-900 border-0 sm:border border-slate-300/30 dark:border-slate-700/30 shadow-3xl shadow-slate-300/50 dark:shadow-indigo-900/40 z-10 transform transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) text-slate-900 dark:text-slate-50 ${isVisible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-20 scale-90 opacity-0'}`}>

                {/* Ambient Blur */}
                <div className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 overflow-hidden ${isPlaying ? 'opacity-100' : 'opacity-40'}`}>
                    <div className={`absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.12)_0%,_transparent_60%)] transition-all duration-1000 ${isPlaying ? 'animate-pulse scale-110' : ''}`} />
                    <div className={`absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-[radial-gradient(circle_at_center,_rgba(20,184,166,0.12)_0%,_transparent_60%)] transition-all duration-1000 ${isPlaying ? 'animate-pulse scale-110' : ''}`} />
                    {/* Solid top gradient to seamlessly blend with the application's header */}
                    <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#fdfbf7] dark:from-slate-900 via-[#fdfbf7]/90 dark:via-slate-900/90 to-transparent z-10" />
                </div>

                <div className="px-6 py-6 md:px-8 md:py-6 flex items-center justify-between shrink-0 relative z-20">
                    <button onClick={() => { hapticFeedback(10); handleClose(); }} className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 border border-slate-300/50 dark:border-slate-700/50 text-slate-900 dark:text-slate-50 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-90 shadow-sm">
                        <svg className="w-5 h-5 -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <div className="text-center pointer-events-none flex flex-col items-center">
                        <span className="text-[10px] font-black tracking-[0.25em] uppercase text-emerald-600/80 dark:text-emerald-400/70 block mb-1.5 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 animate-pulse" />
                            Şu An Çalıyor
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 animate-pulse" />
                        </span>
                        <span className="text-sm font-bold text-slate-900 dark:text-slate-50 font-serif tracking-wide drop-shadow-sm">Kuran Dinleme</span>
                    </div>
                    <button onClick={() => { hapticFeedback(10); setShowList(!showList); }} className={`relative w-10 h-10 flex items-center justify-center rounded-full border transition-all duration-300 active:scale-90 ${showList ? 'border-emerald-500/40 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'border-slate-300/50 dark:border-slate-700/50 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm'}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                        {!showList && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-800 shadow-[0_0_5px_rgba(16,185,129,0.5)]"></span>}
                    </button>
                </div>

                {/* Sure List Overlay - Modern Islamic Chic Design */}
                <div className={`absolute inset-x-0 bottom-0 h-[75%] bg-[#fdfbf7]/95 dark:bg-slate-900/95 backdrop-blur-[40px] z-30 transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) border-t border-slate-300/30 dark:border-slate-700/30 flex flex-col ${showList ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full pointer-events-none'}`}>
                    {/* Header */}
                    <div className="px-6 py-5 border-b border-slate-300/30 dark:border-slate-700/30 flex justify-between items-center relative overflow-hidden bg-white/30 dark:bg-slate-800/30 shrink-0">
                        <div className="flex items-center gap-3 relative z-10">
                            <span className="w-1 h-5 bg-gradient-to-b from-emerald-500 to-teal-600 dark:from-emerald-400 dark:to-teal-500 rounded-full animate-pulse" />
                            <h3 className="font-extrabold text-slate-900 dark:text-slate-50 uppercase tracking-[0.25em] text-xs">Sure Seçimi</h3>
                        </div>
                        <button onClick={() => { hapticFeedback(10); setShowList(false); }} className="w-8 h-8 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 hover:bg-slate-100 dark:hover:bg-slate-700/50 border border-transparent rounded-full transition-all duration-300 active:scale-90 relative z-10 group">
                            <svg className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                        {/* Decorative background Islamic pattern hint */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 150%, #10b981 0%, transparent 60%)' }} />
                    </div>

                    {/* Surah List */}
                    <div className="flex-1 overflow-y-auto px-4 py-4 custom-scrollbar flex flex-col gap-2.5 relative">
                        {SURAS.map((surah, idx) => {
                            const isSelected = idx === currentSurahIndex;
                            return (
                                <button
                                    key={surah.id}
                                    onClick={() => {
                                        hapticFeedback(10);
                                        setCurrentSurahIndex(idx);
                                        setTimeout(() => setShowList(false), 250);
                                    }}
                                    className={`
                                        group relative w-full flex items-center justify-between p-4 rounded-2xl transition-colors duration-300 overflow-hidden
                                        ${isSelected
                                            ? 'bg-white dark:bg-slate-800 border border-emerald-500/30 shadow-[0_4px_15px_rgba(16,185,129,0.1)] dark:shadow-[0_0_20px_rgba(16,185,129,0.15)] py-5 my-1'
                                            : 'bg-white/30 dark:bg-slate-800/30 border border-slate-300/30 dark:border-slate-700/30 hover:bg-white/80 dark:hover:bg-slate-800/80 hover:border-emerald-500/20 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 hover:shadow-sm'
                                        }
                                    `}
                                >
                                    {/* Selected State Background Glows & Effects */}
                                    {isSelected && (
                                        <>
                                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 animate-[shimmer_3s_infinite]" />
                                            {/* Beautiful Arabic Watermark behind the active row */}
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 font-arabic text-6xl text-emerald-600/[0.03] dark:text-emerald-400/[0.04] pointer-events-none select-none transition-transform duration-1000 scale-150">
                                                {surah.arabic}
                                            </div>
                                        </>
                                    )}

                                    {/* Left Content */}
                                    <div className="flex items-center gap-4 relative z-10">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-serif font-bold text-sm transition-colors duration-300
                                            ${isSelected ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-inner' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300/50 dark:border-slate-700/50 group-hover:text-emerald-600 dark:group-hover:text-emerald-300 group-hover:border-emerald-500/20'}
                                        `}>
                                            {surah.id}
                                        </div>
                                        <div className="flex flex-col items-start gap-0.5">
                                            <span className={`font-bold font-serif tracking-wide transition-colors ${isSelected ? 'text-slate-900 dark:text-white text-base drop-shadow-sm dark:drop-shadow-md' : 'group-hover:text-slate-900 dark:group-hover:text-white text-sm'}`}>
                                                {surah.name}
                                            </span>
                                            {isSelected && (
                                                <span className="text-[10px] uppercase tracking-widest text-emerald-600 dark:text-emerald-400/80 font-bold flex items-center gap-1.5 flex-row">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" style={{ animation: isPlaying ? 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite' : 'none' }} />
                                                    {isPlaying ? 'OYNATILIYOR' : 'DURAKLATILDI'}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right Content (Arabic) */}
                                    <span className={`font-arabic text-2xl transition-all duration-300 relative z-10 ${isSelected ? 'text-emerald-600 dark:text-emerald-300 drop-shadow-sm dark:drop-shadow-[0_0_8px_rgba(52,211,153,0.5)] scale-110' : 'opacity-60 group-hover:opacity-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-200'} `} dir="rtl">
                                        {surah.arabic}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                    {/* Fade out bottom list */}
                    <div className="h-8 absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#fdfbf7] dark:from-slate-900 to-transparent pointer-events-none" />
                </div>

                <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center custom-scrollbar w-full relative z-10 transition-opacity duration-300" style={{ opacity: showList ? 0.2 : 1 }}>

                    {/* ── Main Playback Visual Element ── */}
                    <div className="relative w-64 h-64 sm:w-[320px] sm:h-[320px] mb-10 w-full max-w-[340px] aspect-square mx-auto">

                        {/* Core Animated Glows behind the card */}
                        <div className={`absolute inset-0 bg-gradient-to-br from-emerald-500/40 via-teal-600/20 to-indigo-600/30 rounded-[3.5rem] blur-3xl transition-all duration-1000 ${isPlaying ? 'opacity-80 scale-110' : 'opacity-40 scale-95'}`} />
                        <div className={`absolute inset-2 bg-gradient-to-tr from-emerald-400 to-teal-400 rounded-[3.5rem] blur-xl opacity-30 mix-blend-overlay transition-all duration-[2000ms] ${isPlaying ? 'animate-pulse' : ''}`} />

                        {/* Outer Glass Ring (pulsing) */}
                        <div className={`absolute -inset-1 rounded-[3.5rem] border border-emerald-500/30 transition-all duration-1000 ${isPlaying ? 'scale-105 opacity-50 shadow-[0_0_30px_rgba(16,185,129,0.3)]' : 'scale-100 opacity-20'}`} />
                        <div className={`absolute -inset-4 rounded-[3.5rem] border border-teal-500/10 transition-all duration-[1500ms] ${isPlaying ? 'scale-[1.12] opacity-30' : 'scale-100 opacity-0'}`} />

                        {/* The Actual Glass Card */}
                        <div className={`w-full h-full rounded-[3.5rem] border border-slate-300/40 dark:border-slate-700/40 shadow-xl dark:shadow-2xl overflow-hidden bg-white/80 dark:bg-slate-800/80 flex flex-col items-center justify-center relative backdrop-blur-3xl dark:backdrop-blur-2xl transition-transform duration-700 ease-out group ${isPlaying ? 'scale-100' : 'scale-95'}`}>

                            {/* Inner ambient glow */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-50 dark:from-emerald-500/10 via-transparent to-teal-50 dark:to-teal-500/10" />

                            {/* Geometric Islamic Pattern Hint */}
                            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.4) 1px, transparent 0)', backgroundSize: '24px 24px' }} />

                            {/* Massive, Beautiful Arabic Background Watermark */}
                            <h1 className={`absolute inset-0 flex items-center justify-center text-8xl font-arabic text-emerald-600/[0.03] dark:text-emerald-400/[0.08] pointer-events-none px-4 text-center leading-normal transition-all duration-[3000ms] ease-out ${isPlaying ? 'scale-110 opacity-100' : 'scale-90 opacity-60'}`}>
                                {activeSurah.arabic}
                            </h1>

                            {/* Front Content */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 gap-1">
                                {/* Tiny top badge */}
                                <div className="px-3 py-1 mb-2 rounded-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-[9px] font-bold tracking-[0.2em] text-emerald-600 dark:text-emerald-300 uppercase shadow-sm">
                                    Sure {activeSurah.id}
                                </div>
                                <span className={`text-3xl sm:text-5xl font-extrabold font-serif tracking-wider drop-shadow-sm dark:drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] transition-all duration-500 ${isPlaying ? 'text-slate-900 dark:text-slate-50' : 'text-slate-900/80 dark:text-slate-50/80'}`}>
                                    {activeSurah.name}
                                </span>
                                <span className="text-sm font-arabic text-emerald-600/80 dark:text-emerald-300/80 mt-2 tracking-widest drop-shadow-sm dark:drop-shadow-md">
                                    {activeSurah.arabic}
                                </span>
                            </div>

                        </div>
                    </div>

                    <div className="text-center md:text-left w-full px-2 mb-8 flex flex-col items-center">
                        <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-slate-900 dark:text-slate-50 mb-1 tracking-wide drop-shadow-sm dark:drop-shadow-md">
                            {activeSurah.name} Suresi
                        </h2>
                        <p className="text-sm sm:text-base text-emerald-600/80 dark:text-emerald-300/80 font-medium tracking-widest uppercase">
                            Mishary Rashid Alafasy
                        </p>
                    </div>

                    {/* Progress Bar & Durations */}
                    <div className="w-full max-w-[400px] px-2 mb-10 relative group">
                        <div
                            className="h-2 w-full bg-white dark:bg-slate-800 border border-slate-300/50 dark:border-slate-700/50 rounded-full overflow-hidden relative cursor-pointer group-hover:h-3 transition-all duration-300 shadow-inner"
                            ref={progressBarRef}
                            onClick={handleProgressClick}
                        >
                            <div
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all duration-100 pointer-events-none shadow-[0_0_8px_rgba(52,211,153,0.3)] dark:shadow-[0_0_10px_rgba(52,211,153,0.5)]"
                                style={{ width: `${progress}%` }}
                            >
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_12px_rgba(255,255,255,0.9)] opacity-100 scale-0 group-hover:scale-100 transition-transform duration-300 pointer-events-none" />
                            </div>
                        </div>
                        <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 mt-4 font-mono font-bold tracking-widest uppercase">
                            <span className="bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">{formatTime(currentTime)}</span>
                            <span className="bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-300/50 dark:border-slate-700/50">-{formatTime(duration - currentTime)}</span>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-center gap-7 sm:gap-12 w-full max-w-[400px] mb-4">
                        <button onClick={playPrev} className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-300 active:scale-90 p-3 rounded-full hover:bg-emerald-500/10">
                            <svg className="w-8 h-8 drop-shadow-sm dark:drop-shadow-md" fill="currentColor" viewBox="0 0 24 24"><path d="M11 5L4 12l7 7v-4h9V9h-9V5z" /></svg>
                        </button>

                        <button
                            onClick={togglePlay}
                            className={`
                                relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center 
                                transition-all duration-500 ease-out group
                                ${isPlaying
                                    ? 'scale-100 shadow-[0_5px_15px_rgba(16,185,129,0.3)] dark:shadow-[0_10px_40px_rgba(16,185,129,0.4)]'
                                    : 'scale-95 shadow-[0_5px_15px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:scale-100 hover:shadow-[0_8px_20px_rgba(16,185,129,0.2)] dark:hover:shadow-[0_10px_35px_rgba(16,185,129,0.3)]'
                                }
                            `}
                        >
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-teal-400 to-emerald-600 opacity-90 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute inset-px rounded-full bg-gradient-to-br from-[#10b981] to-[#047857]" />
                            <div className="absolute inset-0 rounded-full bg-white/10 dark:bg-black/10 mix-blend-overlay" />

                            <div className="relative z-10 text-white drop-shadow-md transition-transform duration-300 group-active:scale-90 flex items-center justify-center">
                                {isPlaying ? (
                                    <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                                ) : (
                                    <svg className="w-9 h-9 sm:w-11 sm:h-11 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                )}
                            </div>
                        </button>

                        <button onClick={playNext} className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-300 active:scale-90 p-3 rounded-full hover:bg-emerald-500/10">
                            <svg className="w-8 h-8 drop-shadow-sm dark:drop-shadow-md" fill="currentColor" viewBox="0 0 24 24"><path d="M13 5v4H4v6h9v4l7-7-7-7z" /></svg>
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
