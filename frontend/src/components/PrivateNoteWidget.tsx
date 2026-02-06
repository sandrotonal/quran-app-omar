import { useState, useRef, useEffect } from 'react';
import { usePrivateNotes } from '../hooks/usePrivateNotes';

interface PrivateNoteWidgetProps {
    sure: number;
    ayet: number;
}

export function PrivateNoteWidget({ sure, ayet }: PrivateNoteWidgetProps) {
    const { note, setNote, isSaving, lastSaved } = usePrivateNotes(sure, ayet);
    const [isFocused, setIsFocused] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [note]);

    return (
        <div className="mt-8 group animate-fadeIn">
            <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-theme-bg border border-theme-border/50 text-theme-muted">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </span>
                    <span className="text-xs font-bold text-theme-muted uppercase tracking-widest opacity-80">
                        Özel Notunuz
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    {isSaving && (
                        <span className="flex items-center gap-1.5 text-[10px] text-emerald-500 font-medium bg-emerald-500/5 px-2 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            Kaydediliyor
                        </span>
                    )}
                    {!isSaving && lastSaved && (
                        <span className="text-[10px] text-theme-muted opacity-50 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Kaydedildi
                        </span>
                    )}
                </div>
            </div>

            <div className={`
                relative rounded-xl overflow-hidden transition-all duration-300 border
                ${isFocused
                    ? 'bg-theme-surface shadow-lg border-emerald-500/30 ring-1 ring-emerald-500/20'
                    : 'bg-theme-surface/50 border-theme-border/30 hover:bg-theme-surface hover:border-theme-border/50'
                }
            `}>
                <textarea
                    ref={textareaRef}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Bu ayet üzerine tefekkürlerinizi not alın..."
                    className="w-full min-h-[80px] p-4 bg-transparent border-none focus:ring-0 text-base text-theme-text placeholder-theme-muted/60 resize-none leading-relaxed font-serif"
                    spellCheck={false}
                />

                {/* Subtle corner indicator */}
                <div className={`absolute bottom-2 right-2 transition-opacity duration-300 ${isFocused ? 'opacity-100' : 'opacity-0'}`}>
                    <svg className="w-3 h-3 text-emerald-500/50" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83 3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75L3 17.25z" />
                    </svg>
                </div>
            </div>

            <p className="mt-2 text-[10px] text-center text-theme-muted opacity-40">
                Notlarınız sadece bu cihazda saklanır ve sunuculara gönderilmez.
            </p>
        </div>
    );
}
