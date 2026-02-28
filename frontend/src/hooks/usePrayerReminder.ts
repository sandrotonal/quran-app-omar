import { useState, useEffect, useCallback } from 'react';
import { SecureStorage } from '../utils/SecureStorage';

// Collection of short, impactful spiritual content (Ayat/Hadith/Dua)
const SPIRITUAL_CONTENT = [
    { text: "Kalpler ancak Allah'ı anmakla huzur bulur.", source: "Ra'd, 28" },
    { text: "Şüphesiz namaz, müminler üzerine vakitleri belli bir farzdır.", source: "Nisa, 103" },
    { text: "Beni anın ki, ben de sizi anayım.", source: "Bakara, 152" },
    { text: "Sabır ve namaz ile Allah'tan yardım isteyin.", source: "Bakara, 45" },
    { text: "Secde et ve yaklaş.", source: "Alak, 19" },
    { text: "Namaz, gözümün nurudur.", source: "Hadis-i Şerif" },
    { text: "Rabbim! Beni ve soyumu namazı dosdoğru kılanlardan eyle.", source: "İbrahim, 40" }
];

export function usePrayerReminder() {
    const [isActive, setIsActive] = useState(false);
    const [content, setContent] = useState(SPIRITUAL_CONTENT[0]);
    const [timeLeft, setTimeLeft] = useState(20); // Auto-close timer

    // Select daily content when activated (based on day of month)
    const activate = useCallback(() => {
        const dayOfMonth = new Date().getDate();
        const dailyIndex = dayOfMonth % SPIRITUAL_CONTENT.length;
        setContent(SPIRITUAL_CONTENT[dailyIndex]);
        setTimeLeft(20);
        setIsActive(true);
    }, []);

    const dismiss = useCallback(() => {
        setIsActive(false);
    }, []);

    // Auto-close timer logic
    useEffect(() => {
        if (!isActive) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    setIsActive(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isActive]);

    // Format current time for the "AN" section (HH:mm strictly)
    const [currentTime, setCurrentTime] = useState(new Date());
    useEffect(() => {
        if (!isActive) return;

        // Update every second to keep sync, but display only minutes
        const clock = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(clock);
    }, [isActive]);

    // Mute Logic (Persist to localStorage)
    const [isMuted, setIsMuted] = useState(() => {
        // SecureStorage.getItem directly returns the parsed value (e.g., boolean true/false)
        return SecureStorage.getItem('prayer_reminder_muted') === true;
    });

    const toggleMute = useCallback(() => {
        setIsMuted(prev => {
            const newState = !prev;
            // SecureStorage.setItem stores the actual boolean value
            SecureStorage.setItem('prayer_reminder_muted', newState);
            if (newState) setIsActive(false); // Close if muting
            return newState;
        });
    }, []);

    const snooze = useCallback((durationMinutes: number = 10) => {
        setIsActive(false);
        // In a real app, you'd set a specific timeout or alignment.
        // For now, we simulate "Snoozed" by just closing, assuming the 
        // system notification manager would handle the re-alert.
        console.log(`Prayer Reminder SNOOZED for ${durationMinutes} minutes.`);
    }, []);

    return {
        isActive, // Allow manual activation to bypass mute
        activate,
        dismiss,
        snooze,
        toggleMute,
        isMuted,
        content,
        timeLeft,
        currentTime: currentTime.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    };
}
