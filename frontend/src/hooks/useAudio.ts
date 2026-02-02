import { useState, useEffect, useRef } from 'react';

interface AudioState {
    isPlaying: boolean;
    duration: number;
    currentTime: number;
    isLoading: boolean;
    error: string | null;
}

export function useAudio(sure: number, ayet: number) {
    const [state, setState] = useState<AudioState>({
        isPlaying: false,
        duration: 0,
        currentTime: 0,
        isLoading: false,
        error: null,
    });

    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Format numbers to 3 digits (e.g. 1 -> 001)
    const pad = (n: number) => n.toString().padStart(3, '0');
    const getAudioUrl = () => `https://everyayah.com/data/Hudhaify_128kbps/${pad(sure)}${pad(ayet)}.mp3`;

    useEffect(() => {
        const url = getAudioUrl();
        if (state.isPlaying) {
            // Stop previous if playing
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        }

        // Reset state on ayet change (but don't auto play)
        setState(prev => ({ ...prev, isPlaying: false, currentTime: 0, duration: 0, error: null }));
    }, [sure, ayet]);


    const togglePlay = async () => {
        if (!audioRef.current || audioRef.current.src !== getAudioUrl()) {
            // New audio
            const url = getAudioUrl();
            const audio = new Audio(url);
            audioRef.current = audio;

            setState(prev => ({ ...prev, isLoading: true, error: null }));

            audio.addEventListener('loadedmetadata', () => {
                setState(prev => ({ ...prev, duration: audio.duration, isLoading: false }));
            });

            audio.addEventListener('timeupdate', () => {
                setState(prev => ({ ...prev, currentTime: audio.currentTime }));
            });

            audio.addEventListener('ended', () => {
                setState(prev => ({ ...prev, isPlaying: false, currentTime: 0 }));
            });

            audio.addEventListener('error', (e) => {
                console.error("Audio error:", e);
                setState(prev => ({ ...prev, isLoading: false, isPlaying: false, error: "Ses dosyası yüklenemedi." }));
            });

            try {
                await audio.play();
                setState(prev => ({ ...prev, isPlaying: true }));
            } catch (err: any) {
                setState(prev => ({ ...prev, isLoading: false, error: "Oynatma hatası: " + err.message }));
            }
        } else {
            // Toggle existing
            if (state.isPlaying) {
                audioRef.current.pause();
            } else {
                await audioRef.current.play();
            }
            setState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
        }
    };

    return { ...state, togglePlay, pad };
}
