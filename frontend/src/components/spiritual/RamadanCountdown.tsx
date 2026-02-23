import { useState, useEffect, useCallback } from 'react';
import { PrayerTimesService } from '../../lib/PrayerTimesService';
import { Coordinates, CalculationMethod, PrayerTimes } from 'adhan';

/* ─── DATES ─── */
const RAMADAN_START = new Date('2026-02-19T00:00:00');
const RAMADAN_END = new Date('2026-03-21T00:00:00');

/* ─── HELPERS ─── */
interface TimeLeft { days: number; hours: number; minutes: number; seconds: number; }

function getTimeLeft(target: Date): TimeLeft {
    const diff = Math.max(0, target.getTime() - Date.now());
    return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
    };
}

function getNextIftarTime(iftarTimeStr: string | null): Date | null {
    if (!iftarTimeStr) return null;
    const now = new Date();
    const [hours, minutes] = iftarTimeStr.split(':').map(Number);
    const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);
    if (target.getTime() < now.getTime()) {
        target.setDate(target.getDate() + 1);
    }
    return target;
}

function getRamadanDay() { return Math.min(30, Math.max(1, Math.floor((Date.now() - RAMADAN_START.getTime()) / 86400000) + 1)); }
function isRamadanActive() { const n = Date.now(); return n >= RAMADAN_START.getTime() && n < RAMADAN_END.getTime(); }
function isRamadanOver() { return Date.now() >= RAMADAN_END.getTime(); }

async function getRamadanTimes(): Promise<{ imsak: string; iftar: string }> {
    const loc = await PrayerTimesService.getUserLocation();
    const pt = new PrayerTimes(new Coordinates(loc.lat, loc.lng), new Date(), CalculationMethod.Turkey());
    const fmt = (d: Date) => d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    return { imsak: fmt(pt.fajr), iftar: fmt(pt.maghrib) };
}

const SK = (k: string) => `ramadan_notif_${k}`;

/* ─── ICONS ─── */
function AllahCalligraphy({ dark }: { dark: boolean }) {
    return (
        <div className="relative flex items-center justify-center w-10 h-10 group cursor-default">
            {/* Ambient golden glow */}
            <div className={`absolute inset-0 rounded-full blur-[10px] animate-pulse pointer-events-none
                ${dark ? 'bg-amber-500/30' : 'bg-amber-500/10'}`} />

            {/* Inner mystical spinning aura */}
            <div className={`absolute -inset-1 rounded-full blur-[1px] animate-[spin_5s_linear_infinite] opacity-70 border-t-2 border-r-2
                ${dark ? 'border-amber-300/40' : 'border-amber-500/30'}`} />

            {/* Glowing Arabic Text */}
            <div className="relative z-10 flex items-center justify-center transform transition-transform duration-700 group-hover:scale-110">
                <span className={`text-3xl font-bold leading-none select-none tracking-tight
                    ${dark ? 'text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                        : 'text-amber-600 drop-shadow-[0_0_4px_rgba(217,119,6,0.3)]'}`}
                    style={{
                        fontFamily: '"Traditional Arabic", "Amiri", "Scheherazade New", serif',
                    }}>
                    اللّٰه
                </span>
            </div>
        </div>
    );
}

function AnimatedBell({ active, dark }: { active: boolean; dark: boolean }) {
    return (
        <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 1.5 : 2}
            className={`w-[14px] h-[14px] transition-transform duration-300 ${active ? 'scale-110 drop-shadow-md' : ''}`} strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
            {active && (
                <circle cx="18" cy="4" r="3" className={`${dark ? 'fill-emerald-400' : 'fill-emerald-500'} animate-pulse`} stroke="none" />
            )}
        </svg>
    );
}

/* ─── CIRCULAR HUD (Centerpiece) ─── */
function HUDDayRing({ day, progress, dark }: { day: number; progress: number; dark: boolean }) {
    const r = 45; // Reduced from 60
    const c = 2 * Math.PI * r;
    const offset = c - (progress / 100) * c;
    const [dashOffset, setDashOffset] = useState(c);

    useEffect(() => {
        const timer = setTimeout(() => setDashOffset(offset), 100);
        return () => clearTimeout(timer);
    }, [offset, c]);

    return (
        <div className="relative flex items-center justify-center w-28 h-28 shrink-0 select-none">
            {/* Outer Glow */}
            <div className={`absolute inset-0 rounded-full blur-[20px] animate-pulse pointer-events-none 
                ${dark ? 'bg-emerald-500/20' : 'bg-emerald-400/30'}`} />

            {/* Orbiting dashed ring */}
            <svg className="absolute inset-0 w-full h-full animate-[spin_20s_linear_infinite]" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="48" fill="none" strokeWidth="1" strokeDasharray="3 5"
                    className={dark ? "stroke-emerald-500/40" : "stroke-emerald-600/30"} />
            </svg>

            {/* Orbiting tracker dot */}
            <svg className="absolute inset-0 w-full h-full animate-[spin_10s_linear_infinite_reverse]" viewBox="0 0 100 100">
                <circle cx="50" cy="2" r="2.5" className={`drop-shadow-[0_0_6px_rgba(16,185,129,0.8)] ${dark ? 'fill-emerald-400' : 'fill-emerald-500'}`} />
            </svg>

            {/* Progress Solid Ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 drop-shadow-[0_0_10px_rgba(16,185,129,0.4)]" viewBox="0 0 100 100">
                <defs>
                    <linearGradient id="hudGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={dark ? "#34d399" : "#10b981"} />
                        <stop offset="100%" stopColor={dark ? "#059669" : "#047857"} />
                    </linearGradient>
                </defs>
                <circle cx="50" cy="50" r={r} fill="none" strokeWidth="3" className={dark ? "stroke-white/[0.03]" : "stroke-slate-900/5"} />
                <circle cx="50" cy="50" r={r} fill="none" stroke="url(#hudGrad)" strokeWidth="3" strokeLinecap="round"
                    strokeDasharray={`${c} ${c}`} style={{ strokeDashoffset: dashOffset, transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }} />
            </svg>

            {/* Main Center */}
            <div className={`absolute w-[70px] h-[70px] rounded-full flex flex-col items-center justify-center shadow-inner border backdrop-blur-md
                ${dark ? 'bg-[#06141d]/80 border-white/[0.08] shadow-black/50' : 'bg-white/80 border-emerald-100 shadow-emerald-900/5'}`}>
                <span className={`text-4xl font-black tabular-nums tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-b ${dark ? 'from-white to-slate-400' : 'from-emerald-900 to-emerald-700'}`}>
                    {day}
                </span>
                <span className={`text-[8px] font-black uppercase tracking-[0.2em] mt-0.5 ${dark ? 'text-emerald-400/80' : 'text-emerald-600'}`}>
                    Gün
                </span>
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════════════════════════════ */
export function RamadanCountdown() {
    const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));
    const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft(RAMADAN_START));
    const [iftarTimeLeft, setIftarTimeLeft] = useState<TimeLeft | null>(null);
    const [ramadanActive, setActive] = useState(isRamadanActive());
    const [ramadanDay, setDay] = useState(getRamadanDay());
    const [ramadanTimes, setTimes] = useState<{ imsak: string; iftar: string } | null>(null);

    const [permission, setPerm] = useState<NotificationPermission>(Notification.permission);
    const [iftarNotif, setIftar] = useState(() => localStorage.getItem(SK('iftar')) === '1');
    const [sahurNotif, setSahur] = useState(() => localStorage.getItem(SK('sahur')) === '1');

    useEffect(() => {
        const obs = new MutationObserver(() => setDark(document.documentElement.classList.contains('dark')));
        obs.observe(document.documentElement, { attributeFilter: ['class'] });
        return () => obs.disconnect();
    }, []);

    useEffect(() => { if (ramadanActive) getRamadanTimes().then(setTimes).catch(console.error); }, [ramadanActive]);

    useEffect(() => {
        const id = setInterval(() => {
            const a = isRamadanActive();
            setActive(a);
            if (!a && !isRamadanOver()) setTimeLeft(getTimeLeft(RAMADAN_START));
            if (a) setDay(getRamadanDay());
            if (a && ramadanTimes?.iftar) {
                const target = getNextIftarTime(ramadanTimes.iftar);
                if (target) setIftarTimeLeft(getTimeLeft(target));
            }
        }, 1000);
        return () => clearInterval(id);
    }, [ramadanTimes]);

    const toggle = useCallback(async (type: 'iftar' | 'sahur') => {
        let p = permission;
        if (p === 'default') {
            p = (await PrayerTimesService.requestNotificationPermission()) ? 'granted' : 'denied';
            setPerm(p);
        }
        if (p === 'denied') return;
        if (type === 'iftar') {
            const next = !iftarNotif; setIftar(next); localStorage.setItem(SK('iftar'), next ? '1' : '0');
        } else {
            const next = !sahurNotif; setSahur(next); localStorage.setItem(SK('sahur'), next ? '1' : '0');
        }
    }, [iftarNotif, sahurNotif, permission]);

    if (isRamadanOver()) return null;
    const D = dark;

    return (
        <div className={`relative w-full rounded-[1.8rem] mb-4 p-[1px] overflow-hidden transition-colors duration-700 animate-slide-up group
            ${D ? 'bg-gradient-to-br from-[#041217] via-[#091b22] to-[#04090c] shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
                : 'bg-gradient-to-br from-emerald-50 via-white to-slate-50 shadow-xl shadow-emerald-200/40'}`}>

            {/* ── Outer Border Glow Frame ── */}
            <div className={`absolute inset-0 rounded-[1.8rem] border-[1.5px] pointer-events-none z-20 
                ${D ? 'border-white/[0.03]' : 'border-emerald-500/10'}`} />

            <div className={`relative w-full h-full rounded-[1.75rem] px-5 py-4 overflow-hidden z-10 border transition-colors
                ${D ? 'bg-[#0B151C]/60 border-emerald-500/10 backdrop-blur-xl' : 'bg-white/40 border-emerald-200/50 backdrop-blur-xl'}`}>

                {/* ── Dynamic Abstract Lights ── */}
                <div className="absolute inset-0 pointer-events-none z-0">
                    <div className={`absolute top-0 right-[-10%] w-[60%] h-[60%] blur-[80px] rounded-full animate-breathe mix-blend-screen
                        ${D ? 'bg-emerald-500/20' : 'bg-emerald-400/30'}`} />
                    <div className={`absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] blur-[80px] rounded-full animate-pulse mix-blend-screen
                        ${D ? 'bg-teal-600/20' : 'bg-teal-300/30'}`} />

                    {/* Floating Magical Particles */}
                    {[...Array(15)].map((_, i) => (
                        <div key={i} className={`absolute w-[1.5px] h-[1.5px] rounded-full opacity-0 animate-float-up
                            ${D ? 'bg-emerald-200 shadow-[0_0_6px_#34d399]' : 'bg-emerald-500 shadow-[0_0_4px_#10b981]'}`}
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDuration: `${Math.random() * 5 + 3}s`,
                                animationDelay: `${Math.random() * 3}s`,
                                animationIterationCount: 'indefinite'
                            }} />
                    ))}

                    {/* Subtle Dot Grid */}
                    <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '16px 16px', color: D ? 'white' : 'black' }} />
                </div>

                <div className="relative z-10 flex flex-col h-full items-center">

                    {/* ── 1) HEADER SECTION ── */}
                    <div className="flex justify-between items-center w-full mb-3 relative">
                        {/* Live Radar Badge */}
                        {ramadanActive && (
                            <div className="absolute top-0 right-0">
                                <div className={`relative flex items-center justify-center px-2 py-1 rounded-full border shadow-sm backdrop-blur-md overflow-hidden group-hover:scale-105 transition-transform
                                    ${D ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white border-emerald-300'}`}>
                                    <div className={`absolute inset-0 opacity-20 animate-[spin_3s_linear_infinite] rounded-full
                                        ${D ? 'bg-[conic-gradient(from_0deg,transparent_0deg,transparent_270deg,#34d399_360deg)]' : 'bg-[conic-gradient(from_0deg,transparent_0deg,transparent_270deg,#10b981_360deg)]'}`} />
                                    <div className="flex items-center gap-1 relative z-10">
                                        <div className="relative flex h-1.5 w-1.5">
                                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${D ? 'bg-emerald-400' : 'bg-emerald-500'}`} />
                                            <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${D ? 'bg-emerald-400' : 'bg-emerald-500'}`} />
                                        </div>
                                        <span className={`text-[8px] font-black uppercase tracking-widest ${D ? 'text-emerald-400' : 'text-emerald-600'}`}>CANLI</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-2.5">
                            <div className="scale-75 origin-left">
                                <AllahCalligraphy dark={D} />
                            </div>
                            <div className="flex flex-col -ml-1">
                                <h2 className={`text-lg leading-tight font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r drop-shadow-sm
                                    ${D ? 'from-white to-emerald-200' : 'from-slate-800 to-emerald-800'}`}>
                                    {ramadanActive ? 'Ramazan-ı Şerif' : 'Ramazan\'a Kalan'}
                                </h2>
                                <p className={`text-[8px] font-bold uppercase tracking-[0.2em]
                                    ${D ? 'text-emerald-400/80' : 'text-emerald-600/80'}`}>
                                    {ramadanActive ? `1447 Hicri • ${ramadanDay}. Gün` : '1447 Hicri • 20 Şubat'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ── 2) CENTERPIECE (HUD) ── */}
                    {ramadanActive ? (
                        <div className="flex flex-col items-center justify-center w-full mb-4 relative">
                            <HUDDayRing day={ramadanDay} progress={Math.min(100, (ramadanDay / 30) * 100)} dark={D} />

                            {/* Glowing Percent Badge */}
                            <div className={`mt-2.5 px-3 py-1 rounded-full border backdrop-blur-md transform transition-transform hover:scale-105
                                ${D ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.3)]'
                                    : 'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-sm'}`}>
                                <span className="text-[8px] font-bold tracking-[0.2em] uppercase">%{Math.round((ramadanDay / 30) * 100)} Tamamlandı</span>
                            </div>

                            {/* ── 3) CLEAN BORDERLESS COUNTDOWN TIMER ── */}
                            {iftarTimeLeft && (
                                <div className="mt-4 flex flex-col items-center group/timer select-none">
                                    <span className={`text-[8px] font-black uppercase tracking-[0.25em] mb-1 opacity-80
                                        ${D ? 'text-emerald-400' : 'text-emerald-600'}`}>İftara Kalan Süre</span>
                                    <div className={`font-mono text-3xl leading-none font-bold tracking-widest tabular-nums
                                        ${D ? 'text-white/95 drop-shadow-[0_0_8px_rgba(255,255,255,0.15)]' : 'text-slate-800 drop-shadow-sm'}`}>
                                        {String(iftarTimeLeft.hours).padStart(2, '0')}:
                                        {String(iftarTimeLeft.minutes).padStart(2, '0')}:
                                        {String(iftarTimeLeft.seconds).padStart(2, '0')}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-6 mb-2">
                            <div className="flex gap-4 w-full justify-center">
                                {[
                                    { v: timeLeft.days, l: 'GÜN' },
                                    { v: timeLeft.hours, l: 'SAAT' },
                                    { v: timeLeft.minutes, l: 'DAK' },
                                    { v: timeLeft.seconds, l: 'SAN' }
                                ].map((item, i) => (
                                    <div key={i} className="flex flex-col items-center">
                                        <span className={`text-2xl font-bold tabular-nums drop-shadow-sm ${D ? 'text-white/95' : 'text-slate-800'}`}>
                                            {String(item.v).padStart(2, '0')}
                                        </span>
                                        <span className={`text-[8px] font-bold uppercase tracking-wider mt-0.5 ${D ? 'text-emerald-500' : 'text-emerald-600'}`}>
                                            {item.l}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── 4) MINIMAL MODERN TAB (Sahur & Iftar) ── */}
                    {ramadanTimes && (
                        <div className={`flex w-full items-center justify-between mt-auto pt-4 border-t relative z-10
                            ${D ? 'border-white/[0.04]' : 'border-emerald-500/10'}`}>

                            {/* SAHUR */}
                            <div className="flex-1 flex flex-col items-center group">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <span className={`text-[9px] font-bold uppercase tracking-[0.15em] ${D ? 'text-slate-400' : 'text-slate-500'}`}>
                                        SAHUR
                                    </span>
                                    <button onClick={() => toggle('sahur')} className={`p-1.5 rounded-full transition-all active:scale-90
                                        ${sahurNotif
                                            ? (D ? 'text-emerald-400 bg-emerald-500/10' : 'text-emerald-600 bg-emerald-50')
                                            : (D ? 'text-slate-500 hover:text-emerald-400 bg-white/[0.02]' : 'text-slate-400 hover:text-emerald-600 bg-slate-50')}`}>
                                        <AnimatedBell active={sahurNotif} dark={D} />
                                    </button>
                                </div>
                                <div className={`text-[1.35rem] font-bold tabular-nums tracking-wide leading-none ${D ? 'text-white/90' : 'text-slate-800'}`}>
                                    {ramadanTimes.imsak}
                                </div>
                            </div>

                            {/* DIVIDER */}
                            <div className={`w-[1px] h-8 ${D ? 'bg-white/[0.04]' : 'bg-emerald-500/10'}`} />

                            {/* IFTAR */}
                            <div className="flex-1 flex flex-col items-center group">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <span className={`text-[9px] font-bold uppercase tracking-[0.15em] ${D ? 'text-slate-400' : 'text-slate-500'}`}>
                                        İFTAR
                                    </span>
                                    <button onClick={() => toggle('iftar')} className={`p-1.5 rounded-full transition-all active:scale-90
                                        ${iftarNotif
                                            ? (D ? 'text-emerald-400 bg-emerald-500/10' : 'text-emerald-600 bg-emerald-50')
                                            : (D ? 'text-slate-500 hover:text-emerald-400 bg-white/[0.02]' : 'text-slate-400 hover:text-emerald-600 bg-slate-50')}`}>
                                        <AnimatedBell active={iftarNotif} dark={D} />
                                    </button>
                                </div>
                                <div className={`text-[1.35rem] font-bold tabular-nums tracking-wide leading-none ${D ? 'text-white/90' : 'text-slate-800'}`}>
                                    {ramadanTimes.iftar}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
