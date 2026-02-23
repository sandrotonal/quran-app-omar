
import { useEffect, useState, useRef } from 'react';
import { QiblaService } from '../../lib/QiblaService';
import { PrayerTimesService } from '../../lib/PrayerTimesService';

interface QiblaCompassProps {
    onClose: () => void;
}

export function QiblaCompass({ onClose }: QiblaCompassProps) {
    const [qiblaAngle, setQiblaAngle] = useState<number | null>(null);
    const [compassHeading, setCompassHeading] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Low-Pass Filter refs
    const lastHeading = useRef<number>(0);
    const smoothingFactor = 0.1; // Lower = smoother but slower

    useEffect(() => {
        const init = async () => {
            try {
                const loc = await PrayerTimesService.getUserLocation();
                const angle = await QiblaService.getQiblaDirection(loc.lat, loc.lng);
                if (angle !== null) {
                    setQiblaAngle(angle);
                } else {
                    setError("Kıble açısı alınamadı.");
                }
            } catch (err) {
                setError("Konum alınamadı. Lütfen GPS izni verin.");
            } finally {
                setLoading(false);
            }
        };
        init();

        const handleOrientation = (event: DeviceOrientationEvent) => {
            let heading = 0;

            // @ts-ignore
            if (event.webkitCompassHeading) {
                // @ts-ignore
                heading = event.webkitCompassHeading;
            } else if (event.alpha !== null) {
                heading = 360 - event.alpha;
            }

            // Smoothing Logic (Low-Pass Filter)
            // Handle 360->0 wrap-around
            let diff = heading - lastHeading.current;
            if (diff > 180) diff -= 360;
            if (diff < -180) diff += 360;

            lastHeading.current += diff * smoothingFactor;

            // Normalize to 0-360
            if (lastHeading.current >= 360) lastHeading.current -= 360;
            if (lastHeading.current < 0) lastHeading.current += 360;

            setCompassHeading(lastHeading.current);
        };

        // Check for sensor support
        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', handleOrientation, true);
        } else {
            setError("Cihazınızda pusula sensörü bulunamadı.");
        }

        return () => window.removeEventListener('deviceorientation', handleOrientation, true);
    }, []);

    const isAligned = qiblaAngle !== null && Math.abs((compassHeading - qiblaAngle + 360) % 360) < 5;

    return (
        <div className="fixed inset-0 z-[60] bg-theme-bg/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
            <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-full bg-theme-surface hover:bg-theme-border transition-colors z-50"
            >
                <svg className="w-6 h-6 text-theme-text" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <h2 className="text-2xl font-bold font-serif mb-2 text-emerald-500">Kıble Bulucu</h2>
            <p className="text-sm text-theme-muted mb-10 max-w-xs">
                Cihazınızı yere paralel tutun ve kalibrasyon için 8 işareti çizin.
            </p>

            {loading ? (
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            ) : error ? (
                <div className="p-4 bg-red-50 dark:bg-red-900/10 text-red-500 rounded-xl border border-red-100 dark:border-red-900/30">
                    <p className="font-bold">Hata</p>
                    <p className="text-sm">{error}</p>
                </div>
            ) : (
                <div className="relative w-72 h-72">
                    {/* Rotating Compass Dial */}
                    <div
                        className="w-full h-full rounded-full border-4 border-slate-200 dark:border-theme-border bg-slate-50 dark:bg-theme-surface shadow-2xl relative transition-transform duration-75 ease-linear will-change-transform"
                        style={{ transform: `rotate(${-compassHeading}deg)` }}
                    >
                        {/* Degree marks */}
                        {[...Array(72)].map((_, i) => (
                            <div key={i} className="absolute top-1/2 left-1/2 origin-[0_0]" style={{ transform: `rotate(${i * 5}deg)` }}>
                                <div className={`absolute -translate-x-1/2 ${i % 6 === 0 ? 'w-[1.5px] h-3 bg-slate-400 dark:bg-white/25' : 'w-px h-1.5 bg-slate-300 dark:bg-white/10'}`}
                                    style={{ top: '-140px' }} />
                            </div>
                        ))}

                        {/* Cardinals */}
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 flex flex-col items-center">
                            <span className="text-red-500 font-bold text-lg drop-shadow">N</span>
                            <div className="w-1 h-3 bg-red-500 rounded-full"></div>
                        </div>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-slate-500 dark:text-theme-muted text-xs font-bold">S</div>
                        <div className="absolute top-1/2 right-4 -translate-y-1/2 text-slate-500 dark:text-theme-muted text-xs font-bold">E</div>
                        <div className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-500 dark:text-theme-muted text-xs font-bold">W</div>

                        {/* Qibla Indicator */}
                        {qiblaAngle !== null && (
                            <div
                                className="absolute top-1/2 left-1/2 w-1 h-[50%] origin-bottom"
                                style={{ transform: `translateX(-50%) rotate(${qiblaAngle}deg) translateY(-100%)` }}
                            >
                                <div className="absolute top-6 left-1/2 -translate-x-1/2 flex flex-col items-center">
                                    {/* Pulsing outer ring — visible in both modes */}
                                    <div className="absolute -inset-2 rounded-full animate-ping opacity-20 bg-emerald-500 dark:bg-emerald-400" />
                                    <div className="absolute -inset-3 rounded-full animate-pulse bg-emerald-400/20 dark:bg-emerald-500/15 blur-sm" />

                                    {/* Kabe icon with strong glow */}
                                    <div className="w-10 h-10 relative animate-pulse">
                                        <div className="absolute inset-0 bg-emerald-500 dark:bg-emerald-400 blur-lg opacity-50 dark:opacity-40 rounded-full" />
                                        <div className="absolute -inset-1 bg-emerald-400/30 dark:bg-emerald-500/20 rounded-full blur-md" />
                                        <svg className="w-10 h-10 text-emerald-600 dark:text-emerald-400 relative z-10 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M4 4h16v16H4z" />
                                            <path d="M4 8h16M4 12h16M10 4v16" stroke="white" strokeWidth="0.5" strokeOpacity="0.6" />
                                        </svg>
                                    </div>

                                    {/* Small label */}
                                    <span className="mt-1 text-[7px] font-black tracking-[0.15em] uppercase text-emerald-700 dark:text-emerald-300 bg-white/80 dark:bg-emerald-900/60 px-1.5 py-0.5 rounded-full shadow-sm whitespace-nowrap">
                                        KABE
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Center Point */}
                        <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-slate-700 dark:bg-white rounded-full -translate-x-1/2 -translate-y-1/2 z-20 shadow-md"></div>
                    </div>

                    {/* Static Phone Indicator */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 pointer-events-none">
                        <div className={`transition-all duration-300 ${isAligned ? 'scale-110 opacity-100' : 'scale-100 opacity-30'}`}>
                            <div className="w-1.5 h-7 bg-emerald-500 mx-auto rounded-full mb-1 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-12 h-8">
                {isAligned ? (
                    <div className="text-emerald-500 font-bold text-lg animate-bounce flex items-center justify-center gap-2">
                        <span>✨ Kıbleye Yöneldiniz!</span>
                    </div>
                ) : (
                    <div className="text-theme-muted text-sm font-mono">
                        {Math.round(qiblaAngle || 0)}° açısına dönün
                    </div>
                )}
            </div>

            <div className="mt-2 text-xs text-theme-muted/50 font-mono">
                Pusula: {Math.round(compassHeading)}° | Doğruluk: {smoothingFactor * 100}%
            </div>
        </div>
    );
}
