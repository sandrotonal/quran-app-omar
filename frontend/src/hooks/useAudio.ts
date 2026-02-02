import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

interface AudioState {
    isPlaying: boolean;
    duration: number;
    currentTime: number;
    isLoading: boolean;
    error: string | null;
}

interface Worker {
    text: string;
    timestamp_from: number;
    timestamp_to: number;
}

// 7 = Mishary Rashid Alafasy (Popüler ve kaliteli)
const RECITER_ID = 7;

export function useAudio(sure: number, ayet: number) {
    const [state, setState] = useState<AudioState>({
        isPlaying: false,
        duration: 0,
        currentTime: 0,
        isLoading: false,
        error: null,
    });

    const [segments, setSegments] = useState<any[]>([]);
    const [activeWordIndex, setActiveWordIndex] = useState<number>(-1);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);

    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Fetch Audio URL & Timings when Component Mounts (Lazy Load on Play actually better)
    // But for smooth UX, let's fetch url on play.

    useEffect(() => {
        // Reset state on sure/ayet change
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        setState(prev => ({ ...prev, isPlaying: false, currentTime: 0, duration: 0, error: null, isLoading: false }));
        setSegments([]);
        setActiveWordIndex(-1);
        setAudioUrl(null);
    }, [sure, ayet]);

    const fetchAudioData = async () => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));

            // 1. Get Verse Data with Words & Timings (using wbwaudio=true for word by word audio timestamps if available, but audio=7 provides segments)
            // Kuran.com API v4
            // We need segments. 
            // https://api.quran.com/api/v4/verses/by_key/2:255?audio=7&words=true&word_fields=text_uthmani,timestamp_from,timestamp_to

            const response = await axios.get(`https://api.quran.com/api/v4/verses/by_key/${sure}:${ayet}?words=true&audio=${RECITER_ID}&word_fields=text_uthmani,location`);

            const verseData = response.data.verse;

            // Extract Audio URL
            if (!verseData.audio || !verseData.audio.url) {
                throw new Error("Ses dosyası bulunamadı");
            }

            // Quran.com audio URLs are sometimes relative
            let url = verseData.audio.url;
            if (url.startsWith('//')) url = 'https:' + url;
            else if (!url.startsWith('http')) url = 'https://verses.quran.com/' + url; // Common base URL for segments

            // NOTE: The main recitation audio URL might be different from timestamps source.
            // Let's use the 'audio' object from verse which contains 'segments'.

            // Actually, timestamps are inside the 'audio' object in 'segments' array
            // Format: [ [word_index, start_ms, end_ms, segment_percentage], ... ]
            const audioSegments = verseData.audio.segments || []; // [ [1, 0, 500], [2, 500, 1200] ]
            const words = verseData.words || [];

            // Merge timing with words (excluding end bookmark)
            const mergedSegments = words
                .filter((w: any) => w.char_type_name !== 'end')
                .map((word: any, index: number) => {
                    // Find segment for this word (segments use 1-based indexing related to word position usually)
                    // The segments array from API: [ [wordIndex, startTimeMs, endTimeMs, duration], ... ]
                    // wordIndex in segments matches the index in words array (usually 1-based or 0-based depending on response)

                    // Let's look at segments data structure from API v4
                    // It returns segments: [ [1, 10, 1000], [2, 1000, 2000] ] where 1 is word position.

                    const segment = audioSegments.find((s: any) => s[0] === index + 1);

                    return {
                        text: word.text_uthmani,
                        startTime: segment ? segment[1] / 1000 : 0, // Convert ms to seconds
                        endTime: segment ? segment[2] / 1000 : 0,
                    };
                });

            setAudioUrl(url);
            setSegments(mergedSegments);
            return url;

        } catch (err: any) {
            console.error("Fetch audio error:", err);
            throw new Error("Ses verisi alınamadı: " + err.message);
        }
    };

    const togglePlay = async () => {
        try {
            let url = audioUrl;

            // First time play
            if (!url) {
                url = await fetchAudioData();
            }

            if (!audioRef.current && url) {
                const audio = new Audio(url);
                audioRef.current = audio;

                audio.addEventListener('loadedmetadata', () => {
                    setState(prev => ({ ...prev, duration: audio.duration, isLoading: false }));
                });

                audio.addEventListener('timeupdate', () => {
                    const time = audio.currentTime;
                    setState(prev => ({ ...prev, currentTime: time }));

                    // Find active word
                    // We rely on segments state here
                    // IMPORTANT: We need to access the LATEST segments state. 
                    // Since specific logic inside listener might capture stale closure, we iterate external array or use ref?
                    // Actually React state update is fine.
                });

                audio.addEventListener('ended', () => {
                    setState(prev => ({ ...prev, isPlaying: false, currentTime: 0 }));
                    setActiveWordIndex(-1);
                });

                audio.addEventListener('error', (e) => {
                    setState(prev => ({ ...prev, isLoading: false, isPlaying: false, error: "Oynatma hatası" }));
                });

                await audio.play();
                setState(prev => ({ ...prev, isPlaying: true }));
            } else if (audioRef.current) {
                if (state.isPlaying) {
                    audioRef.current.pause();
                    setState(prev => ({ ...prev, isPlaying: false }));
                } else {
                    await audioRef.current.play();
                    setState(prev => ({ ...prev, isPlaying: true }));
                }
            }

        } catch (error: any) {
            setState(prev => ({ ...prev, isLoading: false, error: error.message }));
        }
    };

    // Sync active word index based on currentTime
    useEffect(() => {
        if (segments.length > 0 && state.isPlaying) {
            const index = segments.findIndex(
                s => state.currentTime >= s.startTime && state.currentTime <= s.endTime
            );

            // If between words or not found, keep previous or -1?
            // Better to keep highlight until next starts or strictly follow time?
            // Strict follow is better for "Karaoke"
            setActiveWordIndex(index);
        } else if (!state.isPlaying && state.currentTime === 0) {
            setActiveWordIndex(-1);
        }
    }, [state.currentTime, segments, state.isPlaying]);

    return {
        ...state,
        togglePlay,
        segments, // Kelime listesi ve zamanlamalar
        activeWordIndex, // Şu an okunan kelimenin indexi
        audioUrl
    };
}
