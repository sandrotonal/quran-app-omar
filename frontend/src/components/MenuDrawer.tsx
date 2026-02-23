import { useState, useEffect } from 'react';
import { SURAHS, hapticFeedback } from '../lib/constants';

interface MenuDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onNavigate: (sure: number, ayet: number) => void;
    onOpenQibla: () => void;
    onOpenEsmaulHusna: () => void;
    onOpenMosqueFinder: () => void;
    onOpenPrayerDebt: () => void;
    onOpenReligiousDays: () => void;
    onOpenZikirmatik: () => void;
    onOpenKabeLive: () => void;
    onOpenManeviAkis?: () => void;
    onOpenNamazAsistani?: () => void;
    onOpenRamadanKarti?: () => void;
    onOpenHatimTakip?: () => void;
    onOpenDuaDefteri?: () => void;
    onOpenKuranDinleme?: () => void;
    onOpenSessizZikir?: () => void;
    onOpenIstatistik?: () => void;
}

type TabType = 'surah' | 'juz' | 'favorites' | 'discover';

const JUZ_LIST = Array.from({ length: 30 }, (_, i) => ({ id: i + 1 }));

const JUZ_SURAH_MAP: Record<number, number> = {
    1: 1, 2: 2, 3: 2, 4: 3, 5: 4, 6: 4, 7: 5, 8: 6, 9: 7, 10: 8,
    11: 9, 12: 11, 13: 12, 14: 15, 15: 17, 16: 18, 17: 21, 18: 23,
    19: 25, 20: 27, 21: 29, 22: 33, 23: 36, 24: 39, 25: 41, 26: 46,
    27: 51, 28: 58, 29: 67, 30: 78
};

/* ──────────────────────────────────── ICONS ──────────────────────────────────── */
const IconQibla = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <circle cx="12" cy="12" r="9" />
        <polygon points="12,3 14.5,9.5 12,8.5 9.5,9.5" fill="currentColor" stroke="none" />
        <polygon points="12,21 9.5,14.5 12,15.5 14.5,14.5" fill="currentColor" opacity="0.3" stroke="none" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
    </svg>
);

const IconMosque = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M3 21h18M5 21V11l2-2M19 21V11l-2-2" />
        <path d="M9 21V15a3 3 0 016 0v6" />
        <path d="M8 9a4 4 0 018 0" />
        <path d="M12 5V3" />
        <path d="M10 3h4" />
        <circle cx="12" cy="9" r="1" fill="currentColor" stroke="none" />
    </svg>
);

const IconPrayerDebt = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M3 9h18" />
        <path d="M8 2v3M16 2v3" />
        <path d="M8 14l2 2 4-4" />
    </svg>
);

const IconEsma = () => (
    <svg viewBox="0 0 32 32" fill="currentColor" className="w-7 h-7">
        <text x="50%" y="72%" textAnchor="middle" fontSize="22" fontFamily="'Noto Naskh Arabic', serif" opacity="1">الله</text>
    </svg>
);

const IconCalendar = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
        <path d="M8 12h8M12 8v8" strokeWidth={1.2} opacity="0.4" />
        <path d="M12 2v2M12 20v2M2 12H4M20 12h2" strokeWidth={1.2} />
        <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.2" stroke="none" />
        <path d="M12 9l1.5 3H12" strokeWidth={1.8} />
    </svg>
);

const IconZikir = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 3a9 9 0 019 9" strokeDasharray="3 2" />
        <path d="M12 3a9 9 0 00-9 9" strokeDasharray="3 2" opacity="0.4" />
        <circle cx="12" cy="3" r="1.5" fill="currentColor" stroke="none" />
        <path d="M12 16v2M12 6V4" strokeWidth={1.2} />
    </svg>
);

const IconKabe = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        {/* Body */}
        <rect x="3" y="7" width="18" height="14" rx="1" />
        {/* Kiswa line */}
        <line x1="3" y1="12" x2="21" y2="12" strokeWidth={1} opacity="0.6" />
        {/* Door */}
        <rect x="9.5" y="14" width="5" height="7" rx="0.5" />
        {/* Minarets */}
        <line x1="3" y1="3" x2="3" y2="7" strokeWidth={2} strokeLinecap="round" />
        <line x1="21" y1="3" x2="21" y2="7" strokeWidth={2} strokeLinecap="round" />
        {/* Crescent top */}
        <path d="M10.5 3.5a2 2 0 002 0" strokeWidth={1.2} />
    </svg>
);

const IconManeviAkis = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
);

const IconNamazAsistani = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
        <path d="M12 14c-4.42 0-8 1.79-8 4v2h16v-2c0-2.21-3.58-4-8-4z" />
        <path d="M22 17h-4M2 17h4" />
    </svg>
);

const IconRamadan = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        <circle cx="15" cy="8" r="1.5" fill="currentColor" opacity="0.5" stroke="none" />
    </svg>
);

const IconHatim = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        <path d="M16 8l-4 4-2-2" />
    </svg>
);

const IconDua = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M19 4v16H5V4h14M19 4a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2M15 9H9M15 13H9M11 17H9" />
        <path d="M15 4h-4" />
    </svg>
);

const IconKuranDinleme = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </svg>
);

const IconSessizZikir = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z" />
        <path d="M8 12h8" />
        <path d="M12 8v8" />
        <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.3" stroke="none" />
    </svg>
);

const IconIstatistik = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <path d="M3 9h18" />
        <path d="M9 21V9" />
        <path d="M14 13h4M14 17h2" />
    </svg>
);

/* ─────────────────────────────── DISCOVER DATA ─────────────────────────────── */
interface DiscoverItem {
    key: string;
    label: string;
    desc: string;
    icon: React.ReactNode;
    gradient: string;       // tailwind gradient classes for card bg
    glow: string;           // shadow glow color
    badge?: string;         // optional badge text
}

const DISCOVER_HERO: DiscoverItem = {
    key: 'qibla',
    label: 'Kıble Bulucu',
    desc: 'Gerçek zamanlı pusula ile Mekke yönünü saniyeler içinde tayin et',
    icon: <IconQibla />,
    gradient: '',
    glow: '',
    badge: 'Canlı',
};

interface DiscoverGridItem extends DiscoverItem {
    arabic: string;
    iconColor: string;   // tailwind text color
    iconBg: string;      // tailwind bg
}

const DISCOVER_GRID: DiscoverGridItem[] = [
    {
        key: 'manevi_akis',
        label: 'Günün Akışı',
        desc: 'Ayet, hadis, esma ve tefekkür planı',
        icon: <IconManeviAkis />,
        gradient: '', glow: '',
        badge: 'Her Gün',
        arabic: 'يوم',
        iconColor: 'text-amber-500',
        iconBg: 'bg-amber-500/15 border-amber-500/30',
    },
    {
        key: 'ramadan',
        label: 'Ramazan Özel',
        desc: 'İftar duası, teravih sayacı ve fitre',
        icon: <IconRamadan />,
        gradient: '', glow: '',
        badge: 'Sezonluk',
        arabic: 'رمضان',
        iconColor: 'text-emerald-400',
        iconBg: 'bg-emerald-500/15 border-emerald-500/30',
    },
    {
        key: 'namaz_asistani',
        label: 'Namaz Asistanı',
        desc: 'Cemaat takibi, istatistik ve sessiz mod',
        icon: <IconNamazAsistani />,
        gradient: '', glow: '',
        arabic: 'مساعد',
        iconColor: 'text-blue-400',
        iconBg: 'bg-blue-500/15 border-blue-500/30',
    },
    {
        key: 'debt',
        label: 'Kaza Takip',
        desc: 'Borç namazlarını düzenli takip et',
        icon: <IconPrayerDebt />,
        gradient: '', glow: '',
        arabic: 'صلاة',
        iconColor: 'text-sky-400',
        iconBg: 'bg-sky-500/15 border-sky-500/30',
    },
    {
        key: 'hatim',
        label: 'Hatim Takip',
        desc: 'Cüzleri işaretle, kalan hedefini gör',
        icon: <IconHatim />,
        gradient: '', glow: '',
        arabic: 'ختم',
        iconColor: 'text-teal-400',
        iconBg: 'bg-teal-500/15 border-teal-500/30',
    },
    {
        key: 'kuran_dinleme',
        label: "Kur'an Dinle",
        desc: 'Arka plan çalma, uyku ve tekrar modu',
        icon: <IconKuranDinleme />,
        gradient: '', glow: '',
        arabic: 'استماع',
        iconColor: 'text-fuchsia-400',
        iconBg: 'bg-fuchsia-500/15 border-fuchsia-500/30',
    },
    {
        key: 'zikir',
        label: 'Zikirmatik',
        desc: 'Dijital tesbih & zikir sayacı',
        icon: <IconZikir />,
        gradient: '', glow: '',
        badge: 'Yeni',
        arabic: 'ذكر',
        iconColor: 'text-rose-400',
        iconBg: 'bg-rose-500/15 border-rose-500/30',
    },
    {
        key: 'sessiz_zikir',
        label: 'Sessiz Zikir',
        desc: 'Siyah ekran, telefonu çevirerek zikir',
        icon: <IconSessizZikir />,
        gradient: '', glow: '',
        arabic: 'صامت',
        iconColor: 'text-slate-400',
        iconBg: 'bg-slate-500/15 border-slate-500/30',
    },
    {
        key: 'esma',
        label: "Esmâü'l Hüsnâ",
        desc: "Allah'ın 99 güzel ismi",
        icon: <IconEsma />,
        gradient: '', glow: '',
        badge: '99',
        arabic: 'الله',
        iconColor: 'text-amber-400',
        iconBg: 'bg-amber-500/15 border-amber-500/30',
    },
    {
        key: 'dua',
        label: 'Dua Defteri',
        desc: 'Manevi notlarını ve özel dualarını tut',
        icon: <IconDua />,
        gradient: '', glow: '',
        arabic: 'دعاء',
        iconColor: 'text-indigo-400',
        iconBg: 'bg-indigo-500/15 border-indigo-500/30',
    },
    {
        key: 'religious',
        label: 'Dini Günler',
        desc: 'Kandiller ve mübarek takvim',
        icon: <IconCalendar />,
        gradient: '', glow: '',
        arabic: 'نور',
        iconColor: 'text-violet-400',
        iconBg: 'bg-violet-500/15 border-violet-500/30',
    },
    {
        key: 'mosque',
        label: 'Yakın Camiler',
        desc: 'GPS ile çevrendeki camileri keşfet',
        icon: <IconMosque />,
        gradient: '', glow: '',
        badge: 'Harita',
        arabic: 'مسجد',
        iconColor: 'text-emerald-400',
        iconBg: 'bg-emerald-500/15 border-emerald-500/30',
    },
    {
        key: 'kabe',
        label: 'Kabe Canlı Yayın',
        desc: 'Mescid-i Haram\'dan 7/24 canlı',
        icon: <IconKabe />,
        gradient: '', glow: '',
        badge: 'Canlı',
        arabic: 'الكعبة',
        iconColor: 'text-red-400',
        iconBg: 'bg-red-500/15 border-red-500/30',
    },
    {
        key: 'istatistik',
        label: 'Manevi Pano',
        desc: 'Ayet, namaz ve zikir analizi',
        icon: <IconIstatistik />,
        gradient: '', glow: '',
        arabic: 'إحصاء',
        iconColor: 'text-orange-400',
        iconBg: 'bg-orange-500/15 border-orange-500/30',
    },
];

/* ─────────────────────────────── COMPASS BG ─────────────────────────────── */
const CompassBg = () => (
    <svg
        viewBox="0 0 200 200"
        className="absolute -right-10 -bottom-10 w-52 h-52 opacity-10 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none select-none"
        style={{ transform: 'translateZ(0)' }}
    >
        {/* Outer ring */}
        <circle cx="100" cy="100" r="90" fill="none" stroke="white" strokeWidth="1.5" strokeDasharray="4 6" className="group-hover:[animation:spin_8s_linear_infinite]"
            style={{ transformOrigin: '100px 100px', animation: 'none' }} />
        {/* Middle ring */}
        <circle cx="100" cy="100" r="70" fill="none" stroke="white" strokeWidth="0.8" opacity="0.6" />
        {/* Inner ring */}
        <circle cx="100" cy="100" r="50" fill="none" stroke="white" strokeWidth="0.5" opacity="0.4" />
        {/* Cardinal ticks */}
        <line x1="100" y1="12" x2="100" y2="26" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <line x1="100" y1="174" x2="100" y2="188" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <line x1="12" y1="100" x2="26" y2="100" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <line x1="174" y1="100" x2="188" y2="100" stroke="white" strokeWidth="2" strokeLinecap="round" />
        {/* N label */}
        <text x="95" y="10" fill="white" fontSize="10" fontWeight="bold" fontFamily="sans-serif">N</text>
        {/* Needle — north (white) */}
        <polygon points="100,40 104,98 100,94 96,98" fill="white" opacity="0.95" />
        {/* Needle — south (semi-transparent) */}
        <polygon points="100,160 104,102 100,106 96,102" fill="white" opacity="0.3" />
        {/* Center dot */}
        <circle cx="100" cy="100" r="5" fill="white" opacity="0.9" />
        <circle cx="100" cy="100" r="2.5" fill="rgba(0,0,0,0.3)" stroke="none" />
    </svg>
);

/* ─────────────────────────────── HERO CARD ─────────────────────────────── */
function HeroCard({ item, onAction }: { item: DiscoverItem; onAction: (key: string) => void }) {
    return (
        <button
            onClick={() => onAction(item.key)}
            className={`
                group relative w-full overflow-hidden rounded-3xl p-5 text-left active:scale-[0.97]
                bg-gradient-to-br from-emerald-50 to-teal-50
                dark:bg-none
                border border-emerald-200 dark:border-emerald-500/30
                shadow-md shadow-emerald-100 dark:shadow-[0_8px_32px_rgba(0,0,0,0.35)]
            `}
            style={{
                background: undefined,
                transition: 'transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s',
            }}
        >
            {/* Dark mode deep bg overlay */}
            <div className="pointer-events-none absolute inset-0 rounded-3xl hidden dark:block"
                style={{ background: 'linear-gradient(135deg, #0d1f2d 0%, #0a1a2a 100%)' }} />

            {/* Hover border brightens — dark only */}
            <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 hidden dark:block"
                style={{ boxShadow: '0 0 0 1px rgba(52,211,153,0.55) inset' }} />

            {/* Radial glow behind icon */}
            <div className="pointer-events-none absolute top-0 left-0 w-48 h-48 -translate-x-8 -translate-y-8 rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 65%)' }} />

            {/* Compass BG */}
            <div
                className="transition-transform duration-[4000ms] ease-linear group-hover:[transform:rotate(360deg)] opacity-20 dark:opacity-55"
                style={{ position: 'absolute', inset: 0 }}
            >
                <CompassBg />
            </div>

            {/* Shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400/[0.08] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />

            {/* Top row: icon + badge */}
            <div className="relative z-10 flex items-start justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-300
                    bg-emerald-100 dark:bg-emerald-500/15
                    border border-emerald-300 dark:border-emerald-500/40
                    text-emerald-600 dark:text-emerald-400"
                >
                    <IconQibla />
                </div>
                {item.badge && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest uppercase animate-pulse
                        bg-emerald-100 dark:bg-emerald-500/15
                        border border-emerald-300 dark:border-emerald-500/35
                        text-emerald-700 dark:text-emerald-300">
                        {item.badge}
                    </span>
                )}
            </div>

            {/* Text */}
            <div className="relative z-10">
                <h3 className="text-slate-800 dark:text-white font-bold text-[1.15rem] leading-tight mb-1.5">{item.label}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-[12px] leading-relaxed max-w-[14rem]">{item.desc}</p>
            </div>

            {/* CTA */}
            <div className="relative z-10 mt-4 flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400/70 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors duration-200">
                <span className="text-[11px] font-black tracking-[0.2em] uppercase">Aç</span>
                <svg className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
            </div>
        </button>
    );
}

/* ─────────────────────────────── LIST CARD ─────────────────────────────── */
function ListCard({ item, onAction }: { item: DiscoverGridItem; onAction: (key: string) => void }) {
    return (
        <button
            onClick={() => onAction(item.key)}
            className="group relative w-full flex items-center gap-3.5 px-4 py-3.5 overflow-hidden rounded-2xl text-left active:scale-[0.98]
                bg-white dark:bg-white/[0.028]
                border border-slate-100 dark:border-white/[0.07]
                hover:border-slate-200 dark:hover:border-white/[0.12]
                hover:shadow-sm dark:hover:shadow-none"
            style={{ transition: 'transform 0.18s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s, border-color 0.25s' }}
        >
            {/* Hover wash — light: barely visible, dark: subtle white */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300
                bg-slate-50/80 dark:bg-white/[0.03]" />

            {/* Arabic watermark */}
            <div
                dir="rtl"
                className="absolute right-12 top-1/2 -translate-y-1/2 font-arabic leading-none select-none pointer-events-none
                    text-[3.2rem] text-slate-600 dark:text-white
                    opacity-[0.04] group-hover:opacity-[0.08]
                    group-hover:scale-110
                    transition-all duration-500 ease-out"
            >
                {item.arabic}
            </div>

            {/* Shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/[0.02] dark:via-white/[0.04] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none rounded-2xl" />

            {/* Icon — each card has its own color */}
            <div
                className={`relative z-10 shrink-0 w-11 h-11 rounded-xl border flex items-center justify-center ${item.iconColor} ${item.iconBg} group-hover:scale-110 transition-all duration-300`}
            >
                {item.icon}
            </div>

            {/* Text */}
            <div className="relative z-10 flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                    <h3 className="font-semibold text-[13.5px] text-slate-800 dark:text-white/90 group-hover:text-slate-900 dark:group-hover:text-white leading-tight transition-colors duration-200 truncate">
                        {item.label}
                    </h3>
                    {item.badge && (
                        <span className={`shrink-0 text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md border ${item.iconColor} ${item.iconBg}`}>
                            {item.badge}
                        </span>
                    )}
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-snug mt-0.5 truncate">
                    {item.desc}
                </p>
            </div>

            {/* Chevron */}
            <svg
                className={`relative z-10 shrink-0 w-4 h-4 text-slate-600 ${item.iconColor.replace('text-', 'group-hover:text-')} group-hover:translate-x-0.5 transition-all duration-200`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
        </button>
    );
}

/* ─────────────────────────────── MAIN COMPONENT ─────────────────────────────── */
export function MenuDrawer({
    isOpen, onClose, onNavigate,
    onOpenQibla, onOpenEsmaulHusna, onOpenMosqueFinder,
    onOpenPrayerDebt, onOpenReligiousDays, onOpenZikirmatik, onOpenKabeLive,
    onOpenManeviAkis, onOpenNamazAsistani, onOpenRamadanKarti, onOpenHatimTakip, onOpenDuaDefteri, onOpenKuranDinleme, onOpenSessizZikir, onOpenIstatistik
}: MenuDrawerProps) {
    const [activeTab, setActiveTab] = useState<TabType>('surah');
    const [searchTerm, setSearchTerm] = useState('');
    const [favorites, setFavorites] = useState<{ sure: number, ayet: number, date: number }[]>([]);
    const [render, setRender] = useState(isOpen);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen && activeTab === 'favorites') {
            try {
                const stored = localStorage.getItem('favorites');
                if (stored) setFavorites(JSON.parse(stored));
            } catch (e) { console.error(e); }
        }
    }, [isOpen, activeTab]);

    useEffect(() => {
        if (isOpen) {
            setRender(true);
            requestAnimationFrame(() => requestAnimationFrame(() => setIsVisible(true)));
        } else {
            setIsVisible(false);
            const t = setTimeout(() => setRender(false), 500);
            return () => clearTimeout(t);
        }
    }, [isOpen]);

    const turkishLower = (text: string) => text.replace(/İ/g, 'i').replace(/I/g, 'ı').toLowerCase();

    const filteredSurahs = SURAHS.filter((s) => {
        if (!searchTerm) return true;
        const q = turkishLower(searchTerm.trim());
        return turkishLower(s.turkish).includes(q) || s.id.toString() === q || s.arabic.includes(searchTerm);
    });

    const handleNavigate = (sure: number, ayet: number) => {
        hapticFeedback(10);
        onNavigate(sure, ayet);
        onClose();
    };

    const handleDiscover = (key: string) => {
        hapticFeedback(10);
        onClose();
        if (key === 'qibla') onOpenQibla();
        else if (key === 'mosque') onOpenMosqueFinder();
        else if (key === 'debt') onOpenPrayerDebt();
        else if (key === 'esma') onOpenEsmaulHusna();
        else if (key === 'religious') onOpenReligiousDays();
        else if (key === 'zikir') onOpenZikirmatik();
        else if (key === 'kabe') onOpenKabeLive();
        else if (key === 'manevi_akis') onOpenManeviAkis?.();
        else if (key === 'namaz_asistani') onOpenNamazAsistani?.();
        else if (key === 'ramadan') onOpenRamadanKarti?.();
        else if (key === 'hatim') onOpenHatimTakip?.();
        else if (key === 'dua') onOpenDuaDefteri?.();
        else if (key === 'kuran_dinleme') onOpenKuranDinleme?.();
        else if (key === 'sessiz_zikir') onOpenSessizZikir?.();
        else if (key === 'istatistik') onOpenIstatistik?.();
    };

    if (!render) return null;

    const TABS = [
        { id: 'surah', label: 'Sureler' },
        { id: 'juz', label: 'Cüzler' },
        { id: 'favorites', label: 'Favoriler' },
        { id: 'discover', label: 'Keşfet' }
    ] as const;

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/65 backdrop-blur-sm z-50 transition-opacity duration-500 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className={`
                    fixed inset-y-0 left-0 w-80 max-w-[88vw] z-50
                    bg-white dark:bg-[#0D1526]
                    border-r border-slate-100 dark:border-white/[0.06]
                    shadow-2xl overflow-hidden flex flex-col
                    transform transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] will-change-transform
                    ${isVisible ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                {/* ─── Header ─── */}
                <div className="relative overflow-hidden px-5 pt-5 pb-4 shrink-0">
                    <div className="pointer-events-none absolute -top-8 -right-8 w-36 h-36 bg-emerald-400/10 dark:bg-emerald-500/[0.07] rounded-full blur-[50px]" />
                    <div className="flex items-center justify-between mb-4 relative z-10">
                        <div>
                            <h2 className="text-[1.2rem] font-bold text-slate-900 dark:text-white tracking-tight">Kur'an Rehberi</h2>
                            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">114 Sure • 6236 Ayet</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/[0.08] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 active:scale-95 transition-all"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {activeTab !== 'discover' && (
                        <div className="relative z-10">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Sure ara (ör: Yasin)..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.07] rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400/50 transition-all text-sm"
                            />
                        </div>
                    )}
                </div>

                {/* ─── Tabs ─── */}
                <div className="flex px-3 pb-2 gap-0.5 shrink-0">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => { setActiveTab(tab.id); hapticFeedback(5); }}
                            className={`flex-1 py-2 px-2 whitespace-nowrap rounded-lg text-[11px] font-bold tracking-wide transition-all duration-200 relative
                                ${activeTab === tab.id
                                    ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10'
                                    : 'text-slate-400 dark:text-slate-600 hover:text-slate-700 dark:hover:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/[0.03]'
                                }`}
                        >
                            {tab.label}
                            {activeTab === tab.id && (
                                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-500 rounded-full shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Divider */}
                <div className="h-px bg-slate-100 dark:bg-white/[0.06] mx-3 shrink-0" />

                {/* ─── Content ─── */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden bg-white dark:bg-[#0D1526] custom-scrollbar">

                    {/* ── SURELER ── */}
                    {activeTab === 'surah' && (
                        <div className="space-y-1.5 p-3 pb-20">
                            {filteredSurahs.length === 0 ? (
                                <div className="text-center py-14 text-slate-400 dark:text-slate-500">
                                    <p className="text-3xl mb-2">😔</p>
                                    <p className="font-semibold text-sm">Sonuç bulunamadı</p>
                                </div>
                            ) : (
                                filteredSurahs.map((surah) => (
                                    <button
                                        key={surah.id}
                                        onClick={() => handleNavigate(surah.id, 1)}
                                        className="w-full group flex items-center justify-between p-3.5
                                            bg-slate-50 dark:bg-[#141f35]
                                            border border-slate-100 dark:border-white/[0.05]
                                            hover:bg-emerald-50 dark:hover:bg-emerald-500/[0.08]
                                            hover:border-emerald-200 dark:hover:border-emerald-500/20
                                            rounded-2xl transition-all duration-200 active:scale-[0.98]"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white font-bold text-[12px] flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
                                                {surah.id}
                                            </div>
                                            <div className="text-left">
                                                <h3 className="text-[14px] font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors leading-tight">
                                                    {surah.turkish}
                                                </h3>
                                                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                                                    {surah.ayetCount} Ayet
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-base font-arabic text-slate-300 dark:text-slate-600 group-hover:text-emerald-500/70 dark:group-hover:text-emerald-400/60 transition-colors" dir="rtl">
                                            {surah.arabic}
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    )}

                    {/* ── CÜZLER ── */}
                    {activeTab === 'juz' && (
                        <div className="grid grid-cols-3 gap-2 p-3 pb-20">
                            {JUZ_LIST.map((juz) => (
                                <button
                                    key={juz.id}
                                    onClick={() => handleNavigate(JUZ_SURAH_MAP[juz.id] || 1, 1)}
                                    className="aspect-square flex flex-col items-center justify-center gap-1
                                        bg-slate-50 dark:bg-[#141f35]
                                        border border-slate-100 dark:border-white/[0.05]
                                        hover:bg-emerald-50 dark:hover:bg-emerald-500/10
                                        hover:border-emerald-200 dark:hover:border-emerald-500/20
                                        rounded-2xl transition-all duration-200 active:scale-95 group"
                                >
                                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 group-hover:text-emerald-500 uppercase tracking-wider">CÜZ</span>
                                    <span className="text-xl font-bold text-slate-800 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 font-serif transition-colors">{juz.id}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* ── FAVORİLER ── */}
                    {activeTab === 'favorites' && (
                        <div className="space-y-2 p-3 pb-20">
                            {favorites.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                                    <div className="w-16 h-16 bg-slate-50 dark:bg-[#141f35] border border-slate-100 dark:border-white/[0.05] rounded-full flex items-center justify-center mb-4 text-slate-300 dark:text-slate-600">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-1.5">Favori Listeniz Boş</h3>
                                    <p className="text-sm text-slate-400 dark:text-slate-500 leading-relaxed">Ayetleri okurken kalp ikonuna tıklayarak buraya ekleyin.</p>
                                </div>
                            ) : (
                                favorites.map((fav, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleNavigate(fav.sure, fav.ayet)}
                                        className="w-full text-left p-4
                                            bg-slate-50 dark:bg-[#141f35]
                                            border border-slate-100 dark:border-white/[0.05]
                                            hover:border-rose-200 dark:hover:border-rose-500/20
                                            hover:bg-rose-50/50 dark:hover:bg-rose-500/[0.05]
                                            rounded-2xl transition-all duration-200 group active:scale-[0.98]"
                                    >
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <span className="px-2 py-0.5 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-500 dark:text-rose-400 text-[10px] font-bold rounded-md uppercase tracking-wider">
                                                ❤ Favori
                                            </span>
                                            <span className="text-[11px] text-slate-400 dark:text-slate-500">
                                                {new Date(fav.date).toLocaleDateString('tr-TR')}
                                            </span>
                                        </div>
                                        <h4 className="font-bold text-slate-800 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors text-sm">
                                            {SURAHS.find(s => s.id === fav.sure)?.turkish} Suresi, {fav.ayet}. Ayet
                                        </h4>
                                    </button>
                                ))
                            )}
                        </div>
                    )}

                    {/* ══════════════════ KEŞFET ══════════════════ */}
                    {activeTab === 'discover' && (
                        <div className="p-3 pb-24 space-y-3">

                            {/* Top label */}
                            <div className="flex items-center gap-2 px-1 pt-1 mb-1">
                                <span className="w-4 h-px bg-gradient-to-r from-transparent to-emerald-400/60" />
                                <p className="text-[9px] font-black text-emerald-500 dark:text-emerald-400 uppercase tracking-[0.25em]">İslami Araçlar</p>
                                <span className="flex-1 h-px bg-gradient-to-r from-emerald-400/20 to-transparent" />
                            </div>

                            {/* HERO — Kıble Bulucu */}
                            <HeroCard item={DISCOVER_HERO} onAction={handleDiscover} />

                            {/* TOOL LIST */}
                            <div className="space-y-2">
                                {DISCOVER_GRID.map((item) => (
                                    <ListCard key={item.key} item={item} onAction={handleDiscover} />
                                ))}
                            </div>

                            {/* Footer tagline */}
                            <div className="text-center pt-2">
                                <p className="text-[10px] text-slate-300 dark:text-slate-600 font-medium tracking-wider">
                                    ✦ Manevi yolculuğunuz için ✦
                                </p>
                            </div>
                        </div>
                    )}
                    {/* ══════════════════════════════════════════ */}

                </div>
            </div>
        </>
    );
}
