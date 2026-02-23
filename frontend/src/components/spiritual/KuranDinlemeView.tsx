import { useEffect, useState, useRef } from 'react';
import { hapticFeedback } from '../../lib/constants';

// Ornek sureler, Mishary Rashid Alafasy audio
const SURAS = [
    { id: '1', name: 'Fâtiha', arabic: 'الفاتحة', url: 'https://server8.mp3quran.net/afs/001.mp3' },
    { id: '36', name: 'Yâsîn', arabic: 'يس', url: 'https://server8.mp3quran.net/afs/036.mp3' },
    { id: '55', name: 'Rahmân', arabic: 'الرحمن', url: 'https://server8.mp3quran.net/afs/055.mp3' },
    { id: '56', name: 'Vâkıa', arabic: 'الواقعة', url: 'https://server8.mp3quran.net/afs/056.mp3' },
    { id: '67', name: 'Mülk', arabic: 'الملك', url: 'https://server8.mp3quran.net/afs/067.mp3' },
];

export function KuranDinlemeView({ onClose }: { onClose: () => void }) {
    const [isVisible, setIsVisible] = useState(false);

    // Audio State
    const [currentSurahIndex, setCurrentSurahIndex] = useState(1); // Default Yasin
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showList, setShowList] = useState(false);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const progressBarRef = useRef<HTMLDivElement>(null);

    const activeSurah = SURAS[currentSurahIndex];

    useEffect(() => {
        requestAnimationFrame(() => requestAnimationFrame(() => setIsVisible(true)));

        // Initialize audio
        audioRef.current = new Audio(activeSurah.url);

        const audio = audioRef.current;

        const setAudioData = () => {
            setDuration(audio.duration);
            setCurrentTime(audio.currentTime);
        };

        const setAudioTime = () => {
            setCurrentTime(audio.currentTime);
            setProgress((audio.currentTime / audio.duration) * 100 || 0);
        };

        const handleEnded = () => {
            setIsPlaying(false);
            setProgress(0);
            setCurrentTime(0);
            playNext(); // Oto devam
        };

        audio.addEventListener('loadeddata', setAudioData);
        audio.addEventListener('timeupdate', setAudioTime);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('loadeddata', setAudioData);
            audio.removeEventListener('timeupdate', setAudioTime);
            audio.removeEventListener('ended', handleEnded);
            audio.pause();
        };
    }, []);

    // Yeni sure seçildiğinde audio source'u güncelle
    useEffect(() => {
        if (audioRef.current) {
            const wasPlaying = !audioRef.current.paused;
            audioRef.current.src = activeSurah.url;
            setProgress(0);
            setCurrentTime(0);

            if (wasPlaying || isPlaying) {
                audioRef.current.play().catch(e => console.log(e));
                setIsPlaying(true);
            }
        }
    }, [currentSurahIndex]);

    const handleClose = () => {
        setIsVisible(false);
        if (audioRef.current) {
            audioRef.current.pause();
        }
        setTimeout(onClose, 500);
    };

    const togglePlay = () => {
        hapticFeedback(10);
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play().catch(e => console.log('Oynatma hatası:', e));
            setIsPlaying(true);
        }
    };

    const playNext = () => {
        hapticFeedback(10);
        setCurrentSurahIndex((prev) => (prev + 1) % SURAS.length);
    };

    const playPrev = () => {
        hapticFeedback(10);
        setCurrentSurahIndex((prev) => (prev - 1 + SURAS.length) % SURAS.length);
    };

    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!progressBarRef.current || !audioRef.current) return;

        hapticFeedback(10);
        const rect = progressBarRef.current.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;

        const newProgress = (clickX / width) * 100;
        const newTime = (newProgress / 100) * audioRef.current.duration;

        audioRef.current.currentTime = newTime;
        setProgress(newProgress);
        setCurrentTime(newTime);
    };

    const formatTime = (timeInSeconds: number) => {
        if (isNaN(timeInSeconds)) return "00:00";
        const m = Math.floor(timeInSeconds / 60);
        const s = Math.floor(timeInSeconds % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden p-0 sm:p-6 md:p-8">
            <div
                className={`absolute inset-0 bg-black/90 dark:bg-black/95 backdrop-blur-2xl transition-opacity duration-700 ease-out z-0 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                onClick={handleClose}
            />

            <div className={`relative w-full h-full sm:h-[95vh] sm:max-w-md md:h-auto md:max-h-[85vh] flex flex-col sm:rounded-[40px] overflow-hidden bg-[#0a0a0c]/80 backdrop-blur-3xl border-0 sm:border border-white/10 shadow-3xl shadow-indigo-900/40 z-10 transform transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) text-white ${isVisible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-20 scale-90 opacity-0'}`}>

                {/* Ambient Blur */}
                <div className={`absolute top-0 inset-x-0 h-full w-full pointer-events-none transition-opacity duration-1000 ${isPlaying ? 'opacity-100' : 'opacity-40'}`}>
                    <div className={`absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen transition-all duration-1000 ${isPlaying ? 'animate-pulse scale-110' : ''}`} />
                    <div className={`absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen transition-all duration-1000 ${isPlaying ? 'animate-pulse scale-110' : ''}`} />
                </div>

                <div className="px-6 py-6 md:px-8 md:py-6 flex items-center justify-between shrink-0 relative z-20">
                    <button onClick={() => { hapticFeedback(10); handleClose(); }} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/20 transition-all active:scale-90">
                        <svg className="w-5 h-5 -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <div className="text-center pointer-events-none">
                        <span className="text-[10px] font-black tracking-[0.2em] uppercase text-white/50 block mb-1">Şu An Çalıyor</span>
                        <span className="text-xs font-semibold text-white/90 font-serif">Kuran Dinleme</span>
                    </div>
                    <button onClick={() => { hapticFeedback(10); setShowList(!showList); }} className={`w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border text-white transition-all active:scale-90 ${showList ? 'border-indigo-400 bg-indigo-500/20 text-indigo-300' : 'border-white/10 hover:bg-white/20'}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                    </button>
                </div>

                {/* Sure List Overlay */}
                <div className={`absolute inset-x-0 bottom-0 bg-black/90 backdrop-blur-3xl z-30 transition-all duration-500 ease-out border-t border-white/10 flex flex-col ${showList ? 'h-[60%] opacity-100' : 'h-0 opacity-0 pointer-events-none'}`}>
                    <div className="p-4 border-b border-white/10 flex justify-between items-center">
                        <h3 className="font-bold text-white uppercase tracking-widest text-xs">Sure Seçimi</h3>
                        <button onClick={() => { hapticFeedback(10); setShowList(false); }} className="w-6 h-6 flex items-center justify-center text-white/50 hover:text-white bg-white/5 rounded-full">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-2">
                        {SURAS.map((surah, idx) => (
                            <button
                                key={surah.id}
                                onClick={() => {
                                    hapticFeedback(10);
                                    setCurrentSurahIndex(idx);
                                    setShowList(false);
                                }}
                                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${idx === currentSurahIndex ? 'bg-indigo-600/30 border border-indigo-400/30 text-indigo-100' : 'bg-white/5 border border-white/5 hover:bg-white/10 text-white/70 hover:text-white'}`}
                            >
                                <span className="font-bold font-serif">{surah.name}</span>
                                <span className="font-arabic text-xl opacity-70">{surah.arabic}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center custom-scrollbar w-full relative z-10 transition-opacity duration-300" style={{ opacity: showList ? 0.2 : 1 }}>

                    <div className="relative w-64 h-64 sm:w-72 sm:h-72 mb-10 w-full max-w-[320px] aspect-square mx-auto">
                        <div className={`absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[3rem] blur-2xl transition-all duration-1000 ${isPlaying ? 'opacity-40 scale-105' : 'opacity-10 scale-95'}`}></div>

                        <div className={`w-full h-full rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden bg-white/5 flex items-center justify-center relative backdrop-blur-md transition-transform duration-700 ease-out ${isPlaying ? 'scale-100' : 'scale-95'}`}>
                            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-transparent to-indigo-500/10"></div>
                            <h1 className="text-7xl font-arabic text-white/10 opacity-60 drop-shadow-sm selection:bg-transparent cursor-default pointer-events-none p-4 text-center leading-normal">
                                {activeSurah.arabic}
                            </h1>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-3xl sm:text-4xl font-bold font-serif text-white tracking-widest drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
                                    {activeSurah.name}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="text-center md:text-left w-full px-2 mb-8 flex justify-between items-end">
                        <div className="w-full text-center">
                            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white mb-2 tracking-wide">{activeSurah.name} Suresi</h2>
                            <p className="text-base sm:text-lg text-white/60 font-medium tracking-wide">Mishary Rashid Alafasy</p>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full px-2 mb-10 relative group">
                        <div
                            className="h-2 w-full bg-white/10 rounded-full overflow-hidden relative cursor-pointer group-hover:h-3 transition-all duration-200"
                            ref={progressBarRef}
                            onClick={handleProgressClick}
                        >
                            <div
                                className="absolute top-0 left-0 h-full bg-indigo-400 rounded-full transition-all duration-100 pointer-events-none"
                                style={{ width: `${progress}%` }}
                            >
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] opacity-100 scale-0 group-hover:scale-100 transition-transform pointer-events-none"></div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between text-[11px] sm:text-xs text-white/50 mt-3 font-mono font-bold tracking-widest">
                            <span>{formatTime(currentTime)}</span>
                            <span>-{formatTime(duration - currentTime)}</span>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-center gap-6 sm:gap-10 w-full mb-4">
                        <button onClick={playPrev} className="text-white/60 hover:text-white transition-colors active:scale-90 p-2">
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M11 5L4 12l7 7v-4h9V9h-9V5z" /></svg>
                        </button>

                        <button
                            onClick={togglePlay}
                            className={`w-20 h-20 sm:w-24 sm:h-24 bg-white text-black rounded-full flex items-center justify-center shadow-[0_10px_40px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 transition-all duration-300 ${isPlaying ? 'scale-100 shadow-[0_10px_50px_rgba(255,255,255,0.5)]' : 'scale-95'}`}
                        >
                            {isPlaying ? (
                                <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                            ) : (
                                <svg className="w-9 h-9 sm:w-11 sm:h-11 ml-2" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                            )}
                        </button>

                        <button onClick={playNext} className="text-white/60 hover:text-white transition-colors active:scale-90 p-2">
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M13 5v4H4v6h9v4l7-7-7-7z" /></svg>
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
