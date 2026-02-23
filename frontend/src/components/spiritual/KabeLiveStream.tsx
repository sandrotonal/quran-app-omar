import { useState, useEffect, useCallback } from 'react';

interface KabeLiveStreamProps {
    onClose: () => void;
}

/* ─── Camera sources ─────────────────────────── */
interface CameraChannel {
    id: string;
    label: string;
    sublabel: string;
    channelHandle: string;
    directUrl: string;
}

const CAMERAS: CameraChannel[] = [
    {
        id: 'qurantv',
        label: 'Mekke Canlı',
        sublabel: 'Resmi KSA Kur\'an TV',
        channelHandle: '@SaudiQuranTv',
        directUrl: 'https://www.youtube.com/@SaudiQuranTv/live',
    },
    {
        id: 'medina',
        label: 'Medine Canlı',
        sublabel: 'Mescid-i Nebevi',
        channelHandle: '@SaudiSunnahTv',
        directUrl: 'https://www.youtube.com/@SaudiSunnahTv/live',
    },
    {
        id: 'makkah247',
        label: 'Mekke 24/7',
        sublabel: 'Harameyn Kayıtları',
        channelHandle: '@MakkahLive',
        directUrl: 'https://www.youtube.com/@MakkahLive/live',
    },
];

const API_BASE = window.location.hostname === 'localhost'
    ? 'http://localhost:3001'
    : `${window.location.protocol}//${window.location.hostname}:3001`;

/* ─── Pulsing live dot ─── */
function LiveDot() {
    return (
        <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-70" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
        </span>
    );
}

/* ─── Kaaba SVG ─── */
function KaabIcon({ className = '' }: { className?: string }) {
    return (
        <svg viewBox="0 0 40 40" className={className} fill="none">
            <defs>
                <linearGradient id="kg1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6ee7b7" />
                    <stop offset="100%" stopColor="#14b8a6" />
                </linearGradient>
            </defs>
            <rect x="6" y="10" width="28" height="24" rx="1.5" fill="url(#kg1)" opacity="0.15" stroke="url(#kg1)" strokeWidth="1.2" />
            <line x1="6" y1="18" x2="34" y2="18" stroke="url(#kg1)" strokeWidth="0.7" opacity="0.6" />
            <line x1="6" y1="24" x2="34" y2="24" stroke="url(#kg1)" strokeWidth="0.4" opacity="0.4" />
            <rect x="16" y="22" width="8" height="12" rx="1" fill="url(#kg1)" opacity="0.5" />
            <circle cx="20" cy="28" r="1" fill="url(#kg1)" />
            <rect x="3" y="6" width="3" height="15" rx="1" fill="url(#kg1)" opacity="0.5" />
            <path d="M4.5 6 L3 8 L6 8 Z" fill="url(#kg1)" />
            <rect x="34" y="6" width="3" height="15" rx="1" fill="url(#kg1)" opacity="0.5" />
            <path d="M35.5 6 L34 8 L37 8 Z" fill="url(#kg1)" />
        </svg>
    );
}

/* ─── Video ID cache ─── */
const videoIdCache: Record<string, { videoId: string; ts: number }> = {};
const CACHE_TTL = 30 * 60 * 1000; // 30 dakika

async function fetchLiveVideoId(channelHandle: string): Promise<string | null> {
    // Önbellekte ve taze mi?
    const cached = videoIdCache[channelHandle];
    if (cached && Date.now() - cached.ts < CACHE_TTL) {
        return cached.videoId;
    }

    try {
        const res = await fetch(`${API_BASE}/api/youtube-live/${encodeURIComponent(channelHandle)}`);
        if (!res.ok) return null;
        const data = await res.json();
        if (data.videoId) {
            videoIdCache[channelHandle] = { videoId: data.videoId, ts: Date.now() };
            return data.videoId;
        }
        return null;
    } catch (err) {
        console.error('Failed to fetch live video ID:', err);
        return null;
    }
}

/* ══════════════════════════════════════════════ */
export function KabeLiveStream({ onClose }: KabeLiveStreamProps) {
    const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));
    const [active, setActive] = useState<string>(CAMERAS[0].id);
    const [isLoading, setLoading] = useState(true);
    const [isVisible, setVisible] = useState(false);
    const [videoId, setVideoId] = useState<string | null>(null);
    const [error, setError] = useState(false);

    const D = dark;
    const cam = CAMERAS.find(c => c.id === active) ?? CAMERAS[0];

    useEffect(() => {
        const obs = new MutationObserver(() => setDark(document.documentElement.classList.contains('dark')));
        obs.observe(document.documentElement, { attributeFilter: ['class'] });
        return () => obs.disconnect();
    }, []);

    useEffect(() => {
        const t = requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
        return () => cancelAnimationFrame(t);
    }, []);

    useEffect(() => {
        // Layout shift (sıkışma) engellemek için scrollbar genişliğini hesapla
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.paddingRight = `${scrollbarWidth}px`;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.paddingRight = '';
            document.body.style.overflow = '';
        };
    }, []);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    // Seçili kanal değiştiğinde video ID'yi çek
    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(false);
        setVideoId(null);

        fetchLiveVideoId(cam.channelHandle).then(id => {
            if (cancelled) return;
            if (id) {
                setVideoId(id);
            } else {
                setError(true);
                setLoading(false);
            }
        });

        return () => { cancelled = true; };
    }, [cam.channelHandle]);

    const handleClose = useCallback(() => {
        setVisible(false);
        setTimeout(onClose, 350);
    }, [onClose]);

    const handleOpenExternal = useCallback(() => {
        window.open(cam.directUrl, '_blank', 'noopener,noreferrer');
    }, [cam.directUrl]);

    const embedUrl = videoId
        ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=0&controls=1&rel=0&modestbranding=1&playsinline=1`
        : null;

    return (
        <div className={`fixed inset-0 z-[100] flex flex-col transition-all duration-350 ease-out
            ${isVisible ? 'opacity-100' : 'opacity-0'}`}>

            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer" onClick={handleClose} />

            {/* Modal */}
            <div className={`relative z-10 flex flex-col w-full h-full transition-transform duration-350 ease-[cubic-bezier(0.32,0.72,0,1)]
                ${isVisible ? 'translate-y-0' : 'translate-y-6'}`}>

                {/* Header */}
                <div className={`relative overflow-hidden shrink-0 px-4 pt-4 pb-3
                    ${D ? 'bg-[#060d1a]/95' : 'bg-white/95'} backdrop-blur-xl
                    border-b ${D ? 'border-white/[0.06]' : 'border-slate-200/80'}`}>

                    <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 w-64 h-32 bg-emerald-500/[0.06] blur-3xl rounded-full" />

                    <div className="relative z-10 flex items-center gap-3.5">
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0
                            ${D ? 'bg-emerald-500/[0.1] border border-emerald-500/20' : 'bg-emerald-50 border border-emerald-200/60'}`}>
                            <KaabIcon className="w-8 h-8" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2.5 flex-wrap">
                                <h2 className={`font-black text-[1.05rem] tracking-tight leading-tight
                                    ${D ? 'text-white' : 'text-slate-800'}`}>
                                    Kabe Canlı Yayın
                                </h2>
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.15em]
                                    ${D
                                        ? 'bg-red-500/15 border border-red-500/30 text-red-400'
                                        : 'bg-red-500 text-white shadow-md shadow-red-500/30'
                                    }`}>
                                    <LiveDot />
                                    Canlı
                                </span>
                            </div>
                            <p className={`text-[11px] font-medium mt-0.5 ${D ? 'text-slate-500' : 'text-slate-400'}`}>
                                {cam.sublabel} — {cam.channelHandle}
                            </p>
                        </div>

                        {/* External + Close */}
                        <div className="flex items-center gap-2 shrink-0">
                            <button
                                onClick={handleOpenExternal}
                                className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all active:scale-95
                                    ${D
                                        ? 'bg-white/[0.05] border border-white/[0.08] text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10'
                                        : 'bg-slate-100 border border-slate-200 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50'
                                    }`}
                                title="YouTube'da Aç"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </button>
                            <button
                                onClick={handleClose}
                                className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all active:scale-95
                                    ${D
                                        ? 'bg-white/[0.05] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/10'
                                        : 'bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-200'
                                    }`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Camera tabs */}
                    <div className="relative z-10 flex gap-2 mt-3.5">
                        {CAMERAS.map((c) => (
                            <button
                                key={c.id}
                                onClick={() => setActive(c.id)}
                                className={`flex-1 py-2 px-2 rounded-xl text-[10px] font-black uppercase tracking-[0.12em] transition-all duration-200 active:scale-95 relative overflow-hidden
                                    ${active === c.id
                                        ? (D
                                            ? 'bg-emerald-500/20 border border-emerald-500/35 text-emerald-300 shadow-sm shadow-emerald-500/10'
                                            : 'bg-emerald-500 border border-emerald-500 text-white shadow-md shadow-emerald-400/40')
                                        : (D
                                            ? 'bg-white/[0.03] border border-white/[0.07] text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/[0.08]'
                                            : 'bg-slate-50 border border-slate-200 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                                        )
                                    }`}
                            >
                                {active === c.id && (
                                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer-fast pointer-events-none" />
                                )}
                                <span className="relative">{c.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Video frame */}
                <div className={`relative flex-1 ${D ? 'bg-black' : 'bg-slate-900'}`}>

                    {/* Loading */}
                    {isLoading && !error && (
                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-black">
                            <KaabIcon className="w-20 h-20 animate-pulse opacity-60" />
                            <div className="flex items-center gap-2">
                                <LiveDot />
                                <span className="text-emerald-400 text-sm font-bold tracking-wider animate-pulse">
                                    Canlı yayın yükleniyor...
                                </span>
                            </div>
                            <div className="w-40 h-1 rounded-full bg-white/10 overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 animate-shimmer-fast rounded-full"
                                    style={{ animationDuration: '1.5s' }} />
                            </div>
                        </div>
                    )}

                    {/* Error — fallback to external */}
                    {error && (
                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-5 bg-black text-center p-6">
                            <KaabIcon className="w-24 h-24 opacity-40" />
                            <div>
                                <h3 className="text-white font-bold text-lg mb-2">
                                    Bu kanal şu anda yayında değil
                                </h3>
                                <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">
                                    Başka bir kanal deneyin veya YouTube'da doğrudan izleyin.
                                </p>
                            </div>
                            <button
                                onClick={handleOpenExternal}
                                className="flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 text-white font-bold text-sm shadow-xl shadow-red-500/30 hover:shadow-red-500/50 active:scale-95 transition-all"
                            >
                                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                </svg>
                                YouTube'da İzle
                            </button>
                        </div>
                    )}

                    {/* Embedded video */}
                    {embedUrl && (
                        <iframe
                            key={videoId}
                            src={embedUrl}
                            className="w-full h-full border-none"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            onLoad={() => setLoading(false)}
                            title={`Kabe Canlı Yayın — ${cam.label}`}
                        />
                    )}
                </div>

                {/* Info bar */}
                <div className={`shrink-0 px-4 py-3 ${D ? 'bg-[#060d1a]/95' : 'bg-white/95'} backdrop-blur-xl border-t ${D ? 'border-white/[0.06]' : 'border-slate-200/80'}`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[10px] font-semibold
                                ${D ? 'bg-white/[0.04] border border-white/[0.07] text-slate-400' : 'bg-slate-50 border border-slate-200 text-slate-500'}`}>
                                <svg className={`w-3 h-3 ${D ? 'text-emerald-400' : 'text-emerald-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Mekke, Suudi Arabistan
                            </div>
                        </div>
                        <div dir="rtl" className={`font-arabic text-lg leading-none ${D ? 'text-emerald-500/40' : 'text-emerald-600/30'}`}>
                            لَبَّيْكَ اللَّهُمَّ
                        </div>
                    </div>
                    <p className={`text-[9.5px] text-center mt-2 leading-relaxed
                        ${D ? 'text-slate-700' : 'text-slate-400'}`}>
                        Yayın YouTube üzerinden uygulama içinde sunulmaktadır
                    </p>
                </div>
            </div>
        </div>
    );
}
