import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { SURAHS, hapticFeedback } from '../lib/constants';

// Oynatılabilir veriyi hazırlayalım
const SURAS = SURAHS.map(surah => ({
    id: String(surah.id),
    name: surah.turkish,
    arabic: surah.arabic,
    url: `https://server8.mp3quran.net/afs/${String(surah.id).padStart(3, '0')}.mp3`
}));

interface AudioContextType {
    currentSurahIndex: number;
    setCurrentSurahIndex: (index: number) => void;
    isPlaying: boolean;
    progress: number;
    currentTime: number;
    duration: number;
    togglePlay: () => void;
    playNext: () => void;
    playPrev: () => void;
    seekTime: (time: number) => void;
    activeSurah: typeof SURAS[0];
    isAudioModeActive: boolean; // Mini-player'in veya sistemin gorunurlugu icin
    setIsAudioModeActive: (active: boolean) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
    const [currentSurahIndex, setCurrentSurahIndex] = useState(35); // Varsayılan: Yasin Suresi
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isAudioModeActive, setIsAudioModeActive] = useState(false);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const activeSurah = SURAS[currentSurahIndex];

    // Ses nesnesini sadece bir kere (istemci tarafında) oluşturun
    useEffect(() => {
        audioRef.current = new Audio();

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
            playNext(); // Otomatik olarak sonrakine geç
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

    // Kaynak (src) değiştiğinde tetiklenir
    useEffect(() => {
        if (audioRef.current) {
            const wasPlaying = isPlaying;
            audioRef.current.src = activeSurah.url;
            setProgress(0);
            setCurrentTime(0);

            if (wasPlaying && isAudioModeActive) {
                audioRef.current.play().catch(e => console.log(e));
                setIsPlaying(true);
            }
        }
    }, [currentSurahIndex, activeSurah.url]);

    // Oynatma Durumu Değiştiğinde (Play/Pause)
    useEffect(() => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.play().catch(e => console.log('Oynatma hatası:', e));
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    // Uygulama kapandığında sesi durdurmak vs. için (isteğe bağlı)
    useEffect(() => {
        if (!isAudioModeActive && !isPlaying && audioRef.current) {
            // Eger sistem tamamen kapatildiysa (Kullanici mini playeri de carpidan kapattiysa)
            // audioRef.current.pause(); 
            // setIsPlaying(false);
        }
    }, [isAudioModeActive]);


    const togglePlay = () => {
        hapticFeedback(10);
        setIsPlaying(prev => !prev);
    };

    const playNext = () => {
        hapticFeedback(10);
        setCurrentSurahIndex((prev) => (prev + 1) % SURAS.length);
        setIsPlaying(true);
    };

    const playPrev = () => {
        hapticFeedback(10);
        setCurrentSurahIndex((prev) => (prev - 1 + SURAS.length) % SURAS.length);
        setIsPlaying(true);
    };

    const seekTime = (newTime: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime = newTime;
            setCurrentTime(newTime);
            setProgress((newTime / duration) * 100 || 0);
        }
    };

    return (
        <AudioContext.Provider value={{
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
            isAudioModeActive,
            setIsAudioModeActive
        }}>
            {children}
        </AudioContext.Provider>
    );
}

export function useAudio() {
    const context = useContext(AudioContext);
    if (context === undefined) {
        throw new Error('useAudio must be used within an AudioProvider');
    }
    return context;
}

export { SURAS }; // Componentler icerisinden de Sura listesine erisilebilsin diye ihraç ediyoruz
