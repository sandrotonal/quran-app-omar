import { useEffect, useState } from 'react';
import { PrayerTimesService, PrayerTimeInfo } from '../../lib/PrayerTimesService';
import { PrayerReminder } from './PrayerReminder';
import { PrayerFocusMode } from './PrayerFocusMode';
import { usePrayerReminder } from '../../hooks/usePrayerReminder';

interface PrayerTimesCardProps {
    onNavigate?: (sure: number, ayet: number) => void;
}

export function PrayerTimesCard({ onNavigate }: PrayerTimesCardProps) {
    const [times, setTimes] = useState<PrayerTimeInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [isManualFocusActive, setIsManualFocusActive] = useState(false);
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

    const {
        isActive: isReminderActive,
        activate: triggerReminder,
        dismiss: dismissReminder,
        snooze,
        toggleMute,
        isMuted,
        content: reminderContent,
        currentTime
    } = usePrayerReminder();

    const [suggestion, setSuggestion] = useState<{ topic: string; ayetLink?: string } | null>(null);
    const [notifPermission, setNotifPermission] = useState(Notification.permission === 'granted');

    useEffect(() => {
        async function loadTimes() {
            try {
                const loc = await PrayerTimesService.getUserLocation();
                const todayTimes = PrayerTimesService.getTimes(loc.lat, loc.lng);
                setTimes(todayTimes);
                const next = todayTimes.find(t => t.isNext);
                const key = next?.name === 'İmsak' ? 'fajr' : next?.name === 'Güneş' ? 'sunrise' : next?.name === 'Öğle' ? 'dhuhr' : next?.name === 'İkindi' ? 'asr' : next?.name === 'Akşam' ? 'maghrib' : next?.name === 'Yatsı' ? 'isha' : 'other';
                setSuggestion(PrayerTimesService.getContextualSuggestion(next ? key : 'isha'));
            } catch (e) {
                console.error("Failed to load prayer times", e);
            } finally {
                setLoading(false);
            }
        }
        loadTimes();
    }, []);

    useEffect(() => {
        const checkTime = () => {
            const now = new Date();
            const currentTimeStr = now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
            const currentPrayer = times.find(t => t.time === currentTimeStr);
            if (currentPrayer && notifPermission) {
                if (!isMuted) {
                    triggerReminder();
                    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
                    audio.volume = 0.5;
                    audio.play().catch(() => { });
                }
                PrayerTimesService.sendNotification("Vakit Girdi", `${currentPrayer.name} vakti girdi.`);
            }
        };
        const timer = setInterval(checkTime, 60000);
        return () => clearInterval(timer);
    }, [times, notifPermission, isMuted, triggerReminder]);

    const handleEnableNotifications = async () => {
        if (notifPermission) { alert("Bildirimler zaten açık."); return; }
        const granted = await PrayerTimesService.requestNotificationPermission();
        setNotifPermission(granted);
        if (granted) {
            PrayerTimesService.sendNotification("Bildirimler Açık", "Namaz vakitlerinde hatırlatma yapacağız.");
            setTimeout(() => triggerReminder(), 2000);
        } else {
            alert("Bildirim izni verilmedi.");
        }
    };

    if (loading) return (
        <div className="rounded-[2rem] overflow-hidden bg-white dark:bg-[#0D1526] border border-slate-100 dark:border-white/5 shadow-xl my-4 animate-pulse">
            <div className="p-6 space-y-4">
                <div className="h-6 w-40 bg-slate-100 dark:bg-white/10 rounded-xl"></div>
                <div className="grid grid-cols-3 gap-3">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-20 bg-slate-100 dark:bg-white/5 rounded-2xl"></div>
                    ))}
                </div>
            </div>
        </div>
    );

    let activeContextPrayer = times.find(t => t.isNext) ?? times[times.length - 1];

    return (
        <div className="relative overflow-hidden rounded-[2rem] bg-white dark:bg-[#0D1526] border border-slate-100 dark:border-white/[0.06] shadow-2xl group transition-all duration-500">

            {/* ─── Animated Ambient Glow ─── */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-400/10 dark:bg-emerald-500/[0.07] rounded-full blur-[80px] animate-[pulse_6s_ease-in-out_infinite]"></div>
                <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-indigo-500/10 dark:bg-indigo-600/[0.07] rounded-full blur-[70px] animate-[pulse_8s_ease-in-out_infinite_2s]"></div>
            </div>

            {/* ─── Header ─── */}
            <div className="relative z-10 flex items-start justify-between px-6 pt-6 pb-3">
                <div>
                    <div className="flex items-center gap-2.5 mb-0.5">
                        {/* Animated accent bar */}
                        <span className="relative w-1 h-7 rounded-full overflow-hidden bg-emerald-100 dark:bg-emerald-900/30">
                            <span className="absolute inset-0 bg-gradient-to-b from-emerald-400 to-emerald-600 animate-[shimmer_3s_ease-in-out_infinite]"></span>
                        </span>
                        <h3 className="text-[1.25rem] font-bold text-slate-900 dark:text-white tracking-tight leading-none">
                            Namaz Vakitleri
                        </h3>
                    </div>
                    <p className="ml-[14px] text-[11px] font-medium text-slate-400 tracking-wide mt-1">
                        Diyanet Takvimi ile uyumlu
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1.5 mt-0.5">

                    {/* 🔔 Bildirim butonu */}
                    <button
                        onClick={handleEnableNotifications}
                        title={notifPermission ? "Bildirimler Açık" : "Bildirimleri Aç"}
                        className={`relative w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 border
                            ${notifPermission
                                ? 'bg-emerald-500/10 dark:bg-emerald-500/15 border-emerald-500/30 dark:border-emerald-500/40 text-emerald-600 dark:text-emerald-400'
                                : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-600 dark:hover:text-emerald-400'
                            }`}
                    >
                        {notifPermission && (
                            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-[#0D1526]">
                                <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75"></span>
                            </span>
                        )}
                        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={notifPermission ? 2.5 : 2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            {!notifPermission && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 6L18 18" />}
                        </svg>
                    </button>

                    {/* ⚡ Odak Modu butonu */}
                    <button
                        onClick={() => setIsManualFocusActive(true)}
                        title="Odak Modu"
                        className="relative w-9 h-9 rounded-xl flex items-center justify-center
                            bg-slate-50 dark:bg-white/5 
                            border border-slate-200 dark:border-white/10 
                            text-slate-500 dark:text-slate-400
                            hover:bg-emerald-50 dark:hover:bg-emerald-500/10 
                            hover:border-emerald-500/30 hover:text-emerald-600 dark:hover:text-emerald-400
                            hover:scale-105 active:scale-95 transition-all duration-200"
                    >
                        <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </button>

                    {/* 🕌 Namaz Modu butonu */}
                    <button
                        onClick={triggerReminder}
                        title="Namaz Modu"
                        className="relative w-9 h-9 rounded-xl flex items-center justify-center
                            bg-slate-50 dark:bg-white/5 
                            border border-slate-200 dark:border-white/10 
                            text-slate-500 dark:text-slate-400
                            hover:bg-emerald-50 dark:hover:bg-emerald-500/10 
                            hover:border-emerald-500/30 hover:text-emerald-600 dark:hover:text-emerald-400
                            hover:scale-105 active:scale-95 transition-all duration-200"
                    >
                        <svg className="w-[17px] h-[17px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 3C9 3 7 5.5 7 8c0 2 1 3.5 2.5 4.5V14h5v-1.5C16 11.5 17 10 17 8c0-2.5-2-5-5-5zM9 14h6v1H9v-1zm1 1h4v1a2 2 0 11-4 0v-1z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* ─── Prayer Grid ─── */}
            <div className="relative z-10 px-5 pb-3">
                <div className="grid grid-cols-3 gap-2.5">
                    {times.map((t, i) => (
                        <div
                            key={i}
                            onMouseEnter={() => setHoveredIdx(i)}
                            onMouseLeave={() => setHoveredIdx(null)}
                            className={`
                                relative flex flex-col items-center justify-center py-4 rounded-2xl select-none
                                transition-all duration-400 ease-out cursor-default
                                ${t.isNext
                                    ? 'bg-gradient-to-b from-emerald-400 to-emerald-600 shadow-[0_8px_24px_-4px_rgba(16,185,129,0.45)] ring-2 ring-emerald-400/30 dark:ring-emerald-500/20 scale-[1.04]'
                                    : hoveredIdx === i
                                        ? 'bg-slate-100 dark:bg-[#1a2540] border border-slate-300 dark:border-white/10 scale-[1.02]'
                                        : 'bg-slate-50 dark:bg-[#141f35] border border-slate-200 dark:border-white/[0.06]'
                                }
                            `}
                            style={{ transition: 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1), background 0.3s, box-shadow 0.3s' }}
                        >
                            {/* Active orb glow */}
                            {t.isNext && (
                                <span className="absolute -inset-px rounded-2xl bg-emerald-400 opacity-20 blur-lg animate-pulse pointer-events-none"></span>
                            )}

                            <span className={`text-[9px] font-extrabold uppercase tracking-[0.15em] mb-1.5 ${t.isNext ? 'text-emerald-50/80' : 'text-slate-400 dark:text-slate-500'}`}>
                                {t.name}
                            </span>
                            <span className={`text-[1.15rem] font-bold font-mono tracking-tight ${t.isNext ? 'text-white' : 'text-slate-800 dark:text-slate-100'}`}>
                                {t.time}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ─── Divider + Context Text ─── */}
            {activeContextPrayer && (
                <div className="relative z-10 px-6 pt-4 pb-5">
                    <div className="flex items-center gap-3 mb-5">
                        <span className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent"></span>
                        <p className="text-[12px] text-slate-400 dark:text-slate-500 italic font-serif px-1 text-center leading-snug">
                            {activeContextPrayer.context}
                        </p>
                        <span className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent"></span>
                    </div>

                    {/* ─── Manevi Odak Card ─── */}
                    {suggestion && (
                        <div
                            onClick={() => {
                                if (onNavigate && suggestion.ayetLink) {
                                    const [sureStr, ayetStr] = suggestion.ayetLink.split(':');
                                    onNavigate(parseInt(sureStr), parseInt(ayetStr));
                                }
                            }}
                            className="group/card relative flex items-center gap-3 p-3.5 rounded-2xl cursor-pointer
                                bg-slate-50 dark:bg-[#141f35]
                                border border-slate-200 dark:border-white/[0.06]
                                hover:border-emerald-300 dark:hover:border-emerald-500/30
                                hover:shadow-[0_4px_20px_-4px_rgba(16,185,129,0.15)]
                                dark:hover:shadow-[0_4px_20px_-4px_rgba(16,185,129,0.1)]
                                transition-all duration-300"
                        >
                            {/* Icon */}
                            <div className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center
                                bg-white dark:bg-[#0D1526] border border-slate-200 dark:border-white/[0.08]
                                text-emerald-500
                                group-hover/card:scale-110 group-hover/card:shadow-[0_0_12px_rgba(16,185,129,0.25)]
                                transition-all duration-300"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>

                            {/* Text */}
                            <div className="flex-1 min-w-0">
                                <h4 className="text-[13px] font-bold text-slate-800 dark:text-slate-100 leading-tight line-clamp-2 group-hover/card:text-emerald-700 dark:group-hover/card:text-emerald-400 transition-colors duration-200">
                                    {suggestion.topic}
                                </h4>
                                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5 tracking-wide">
                                    {suggestion.ayetLink ? `${suggestion.ayetLink} • ` : ''}Manevi Odak
                                </p>
                            </div>

                            {/* Share */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigator.clipboard.writeText(`Vaktin Ayeti: ${suggestion.topic}\nKuran Anlam Haritası`);
                                    const el = document.getElementById('share-path');
                                    if (el) { el.style.stroke = '#10B981'; setTimeout(() => { if (el) el.style.stroke = 'currentColor'; }, 1200); }
                                }}
                                className="shrink-0 w-8 h-8 flex items-center justify-center rounded-xl text-slate-300 dark:text-slate-600 hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all duration-200"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path id="share-path" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* ─── Modals ─── */}
            <PrayerFocusMode
                isActive={isManualFocusActive}
                onExit={() => setIsManualFocusActive(false)}
                currentPrayer={activeContextPrayer?.name}
                suggestion={suggestion || undefined}
            />
            <PrayerReminder
                isActive={isReminderActive}
                onDismiss={dismissReminder}
                onSnooze={snooze}
                onMute={toggleMute}
                isMuted={isMuted}
                content={reminderContent}
                currentTime={currentTime}
                prayerName={activeContextPrayer?.name}
            />
        </div>
    );
}
