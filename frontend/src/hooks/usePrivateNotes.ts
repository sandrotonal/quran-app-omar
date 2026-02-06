import { useState, useEffect, useCallback } from 'react';

const STORAGE_PREFIX = 'kuran_app_note_';

export function usePrivateNotes(sure: number, ayet: number) {
    const key = `${STORAGE_PREFIX}${sure}_${ayet}`;
    const [note, setNote] = useState<string>('');
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    // Load initial note
    useEffect(() => {
        const saved = localStorage.getItem(key);
        if (saved) {
            setNote(saved);
        } else {
            setNote('');
        }
    }, [key]);

    // Debounced save function
    const saveNote = useCallback((text: string) => {
        setIsSaving(true);
        localStorage.setItem(key, text);

        // Improve UX by showing "Saved" briefly
        setTimeout(() => {
            setIsSaving(false);
            setLastSaved(new Date());
        }, 500);
    }, [key]);

    // Handle change with debounce
    const handleChange = useCallback((text: string) => {
        setNote(text);

        // Clear existing timer if any (simple debounce logic)
        const timerId = setTimeout(() => {
            saveNote(text);
        }, 1000);

        return () => clearTimeout(timerId);
    }, [saveNote]);

    return {
        note,
        setNote: handleChange,
        isSaving,
        lastSaved
    };
}
