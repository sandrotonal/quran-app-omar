import React, { useEffect, useState } from 'react';
import { Mosque, MosqueService } from '../../lib/MosqueService';
import { MosqueMap } from './MosqueMap';
import { Locate, Map as MapIcon, List, Navigation, Layers } from 'lucide-react';

interface MosqueFinderProps {
    onClose: () => void;
}

export const MosqueFinder = React.memo(function MosqueFinder({ onClose }: MosqueFinderProps) {
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
    const [mapStyle, setMapStyle] = useState<'classic' | 'poster' | 'darknavy'>('darknavy');
    const [mosques, setMosques] = useState<Mosque[]>([]);
    const [loading, setLoading] = useState(true);
    const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [selectedMosque, setSelectedMosque] = useState<Mosque | null>(null);

    useEffect(() => {
        if (!navigator.geolocation) {
            setError('Tarayıcınız konum servisini desteklemiyor.');
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation({ lat: latitude, lon: longitude });
                try {
                    const data = await MosqueService.getNearbyMosques(latitude, longitude);
                    setMosques(data);
                } catch (err) {
                    console.error(err);
                    setError('Camiler yüklenirken bir sorun oluştu.');
                } finally {
                    setLoading(false);
                }
            },
            (err) => {
                console.error(err);
                setError('Konum alınamadı. Varsayılan konum (İstanbul) kullanılıyor.');
                const defaultLat = 41.0082;
                const defaultLon = 28.9784;
                setUserLocation({ lat: defaultLat, lon: defaultLon });
                MosqueService.getNearbyMosques(defaultLat, defaultLon)
                    .then(data => setMosques(data))
                    .catch(() => setError('Varsayılan konum için camiler yüklenemedi.'))
                    .finally(() => setLoading(false));
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    }, []);

    return (
        <div className="fixed inset-0 z-[60] bg-white dark:bg-[#0D1526] flex flex-col overflow-hidden font-sans animate-fadeIn">

            {/* ─── Header ─── */}
            <div className="relative px-5 pt-5 pb-4 shrink-0 bg-white dark:bg-[#0D1526] border-b border-slate-100 dark:border-white/[0.06]">
                {/* Ambient glow */}
                <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 w-64 h-24 bg-emerald-400/10 dark:bg-emerald-500/[0.08] rounded-full blur-[50px]" />

                <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/[0.08] text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-200 dark:hover:border-emerald-500/30 transition-all active:scale-95"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <div>
                            <h2 className="text-[1.1rem] font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                                Yakın Camiler
                            </h2>
                            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                                Çevrenizdeki ibadet noktaları
                            </p>
                        </div>
                    </div>

                    {/* Control Bar (View & Style) */}
                    <div className="flex items-center gap-2">
                        {/* Style Selector */}
                        <div className="flex bg-slate-100 dark:bg-white/[0.04] p-1 rounded-xl border border-slate-200 dark:border-white/[0.07] gap-0.5 relative group">
                            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 dark:text-slate-400 cursor-pointer hover:bg-white dark:hover:bg-white/5 transition-all">
                                <Layers className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Stil</span>
                            </span>

                            {/* Dropdown Menu (Hover ile açılır) */}
                            <div className="absolute top-full left-0 mt-2 w-32 bg-white dark:bg-[#1A233A] rounded-xl shadow-xl border border-slate-100 dark:border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden flex flex-col py-1">
                                {([['darknavy', 'Ana Tema'], ['poster', 'Poster'], ['classic', 'Klasik']] as const).map(([val, label]) => (
                                    <button
                                        key={val}
                                        onClick={() => setMapStyle(val)}
                                        className={`px-4 py-2 text-xs font-bold text-left transition-colors ${mapStyle === val ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'}`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* View Toggle */}
                        <div className="flex bg-slate-100 dark:bg-white/[0.04] p-1 rounded-xl border border-slate-200 dark:border-white/[0.07] gap-0.5">
                            {([['list', <List key="l" className="w-3.5 h-3.5" />, 'Liste'], ['map', <MapIcon key="m" className="w-3.5 h-3.5" />, 'Harita']] as const).map(([mode, icon, label]) => (
                                <button
                                    key={mode}
                                    onClick={() => setViewMode(mode)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === mode
                                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                                        : 'text-slate-400 dark:text-slate-600 hover:text-slate-700 dark:hover:text-slate-400'
                                        }`}
                                >
                                    {icon}
                                    <span className="hidden sm:inline">{label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── Content ─── */}
            <div className="flex-1 overflow-hidden relative flex flex-col md:flex-row bg-slate-50 dark:bg-[#0a1020]">

                {/* Loading */}
                {loading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-[#0D1526]/80 backdrop-blur-sm z-30">
                        {/* Animated compass loader */}
                        <div className="relative w-20 h-20 mb-5">
                            <div className="absolute inset-0 border-2 border-emerald-100 dark:border-emerald-500/10 rounded-full" />
                            <div className="absolute inset-0 border-2 border-t-emerald-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
                            <div className="absolute inset-3 border border-t-emerald-400/40 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50" />
                            </div>
                        </div>
                        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 animate-pulse">Camiler taranıyor...</p>
                        <p className="text-xs text-slate-400 dark:text-slate-600 mt-1">GPS konumunuz alınıyor</p>
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center z-30">
                        <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-500 flex items-center justify-center mb-5">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Konum Alınamadı</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">{error}</p>
                        <button
                            onClick={onClose}
                            className="mt-6 px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 active:scale-95 transition-all"
                        >
                            Tamam
                        </button>
                    </div>
                )}

                {/* List + Map */}
                {!loading && !error && (
                    <>
                        {/* List Panel */}
                        <div className={`flex-1 overflow-y-auto custom-scrollbar bg-slate-50 dark:bg-[#0a1020]
                            ${viewMode === 'map' ? 'hidden md:block md:w-96 md:flex-none border-r border-slate-100 dark:border-white/[0.06]' : 'block w-full'}`}>

                            {mosques.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-600 p-10 text-center">
                                    <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.06] flex items-center justify-center mb-4">
                                        <Locate className="w-7 h-7" />
                                    </div>
                                    <p className="font-semibold text-sm">Yakınınızda cami bulunamadı.</p>
                                </div>
                            ) : (
                                <div className="p-4 space-y-2.5 pb-24 md:pb-4">

                                    {/* Location Badge */}
                                    {userLocation && (
                                        <div className="group relative overflow-hidden flex items-center gap-3 p-3.5 mb-3
                                            bg-white dark:bg-[#141f35] border border-slate-100 dark:border-white/[0.06]
                                            rounded-2xl shadow-sm">
                                            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                                                <Locate className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Şu anki Konum</p>
                                                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">
                                                    {userLocation.lat.toFixed(4)}, {userLocation.lon.toFixed(4)}
                                                </p>
                                            </div>
                                            <div className="ml-auto w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50" />
                                        </div>
                                    )}

                                    {mosques.map((mosque, index) => {
                                        const isSelected = selectedMosque?.id === mosque.id;
                                        return (
                                            <div
                                                key={mosque.id}
                                                onClick={() => {
                                                    setSelectedMosque(mosque);
                                                    if (window.innerWidth < 768) setViewMode('map');
                                                }}
                                                className={`group relative overflow-hidden p-4 rounded-2xl border cursor-pointer
                                                    bg-white dark:bg-[#141f35]
                                                    hover:border-emerald-200 dark:hover:border-emerald-500/30
                                                    hover:shadow-lg hover:shadow-emerald-500/8 dark:hover:shadow-emerald-900/20
                                                    active:scale-[0.98] transition-all duration-200
                                                    ${isSelected
                                                        ? 'border-emerald-400 dark:border-emerald-500/50 shadow-md shadow-emerald-500/10 bg-emerald-50/30 dark:bg-emerald-500/[0.06]'
                                                        : 'border-slate-100 dark:border-white/[0.06] shadow-sm'
                                                    }`}
                                                style={{
                                                    animationDelay: `${index * 40}ms`,
                                                    transition: 'transform 0.18s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s, border-color 0.2s',
                                                }}
                                            >
                                                {/* Ambient wash */}
                                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-emerald-400/0 group-hover:from-emerald-500/[0.03] group-hover:to-emerald-400/[0.02] transition-all duration-500 pointer-events-none rounded-2xl" />

                                                {/* Arabic watermark */}
                                                <div
                                                    dir="rtl"
                                                    className="absolute -bottom-2 right-2 font-arabic leading-none select-none pointer-events-none
                                                        text-[4rem] text-slate-100/70 dark:text-emerald-400/[0.05]
                                                        group-hover:text-emerald-400/20 dark:group-hover:text-emerald-400/15
                                                        group-hover:scale-110 group-hover:-translate-y-1
                                                        transition-all duration-500 ease-out"
                                                >
                                                    مسجد
                                                </div>

                                                {/* Shimmer */}
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400/[0.05] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none rounded-2xl" />

                                                <div className="relative z-10 flex items-start justify-between mb-3">
                                                    <div className="flex-1 min-w-0 pr-3">
                                                        <h3 className={`font-bold text-[1rem] leading-tight mb-0.5 transition-colors duration-200
                                                            ${isSelected
                                                                ? 'text-emerald-600 dark:text-emerald-400'
                                                                : 'text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-300'
                                                            }`}>
                                                            {mosque.name}
                                                        </h3>
                                                        {mosque.address && (
                                                            <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-snug line-clamp-1 mt-0.5">{mosque.address}</p>
                                                        )}
                                                    </div>

                                                    {/* Distance badge */}
                                                    <div className="shrink-0 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-xl">
                                                        <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 font-mono">
                                                            {(mosque.distance || 0).toFixed(0)}m
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="relative z-10 flex items-center gap-2.5 mt-3">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            window.open(`https://www.google.com/maps/dir/?api=1&destination=${mosque.lat},${mosque.lon}`, '_blank');
                                                        }}
                                                        className="flex-1 py-2.5 px-3 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white rounded-xl text-[12px] font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/30"
                                                    >
                                                        <Navigation className="w-3.5 h-3.5" />
                                                        Yol Tarifi
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedMosque(mosque);
                                                            setViewMode('map');
                                                        }}
                                                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.07] text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-200 dark:hover:border-emerald-500/30 transition-all"
                                                    >
                                                        <MapIcon className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Map Panel */}
                        <div className={`flex-1 bg-slate-100 dark:bg-slate-900 relative
                            ${viewMode === 'list' ? 'hidden md:block' : 'block w-full h-full'}`}>
                            {userLocation && (
                                <MosqueMap
                                    userLat={userLocation.lat}
                                    userLon={userLocation.lon}
                                    mosques={mosques}
                                    selectedMosqueId={selectedMosque?.id}
                                    onSelectMosque={(m) => setSelectedMosque(m)}
                                    mapStyle={mapStyle}
                                />
                            )}

                            {viewMode === 'map' && (
                                <button
                                    onClick={() => setViewMode('list')}
                                    className="md:hidden absolute bottom-6 left-1/2 -translate-x-1/2 bg-white dark:bg-[#141f35] text-slate-900 dark:text-white px-6 py-3 rounded-2xl shadow-xl font-bold text-sm flex items-center gap-2 z-[400] border border-slate-100 dark:border-white/[0.08] hover:border-emerald-200 dark:hover:border-emerald-500/30 transition-all active:scale-95"
                                >
                                    <List className="w-4 h-4" />
                                    Listeye Dön
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
});
