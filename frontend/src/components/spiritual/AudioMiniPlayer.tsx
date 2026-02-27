import { useAudio } from '../../context/AudioContext';
import { hapticFeedback } from '../../lib/constants';

export function AudioMiniPlayer({ onExpand }: { onExpand: () => void }) {
    const {
        isPlaying,
        activeSurah,
        togglePlay,
        isAudioModeActive,
        playNext,
        progress
    } = useAudio();

    if (!isAudioModeActive) return null;

    return (
        <div className="fixed bottom-[6.5rem] md:bottom-8 left-6 right-6 z-40 flex justify-center pointer-events-none animate-slideUp">
            {/* The Floating Container */}
            <div
                className="pointer-events-auto w-full max-w-sm h-14 bg-white/95 dark:bg-slate-800/95 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-slate-300/50 dark:border-slate-700/50 backdrop-blur-2xl flex items-center px-3 py-2 cursor-pointer group hover:border-emerald-400/50 dark:hover:border-emerald-500/40 hover:shadow-[0_10px_40px_rgba(16,185,129,0.15)] dark:hover:shadow-[0_10px_40px_rgba(16,185,129,0.2)] transition-all overflow-hidden relative"
                onClick={(e) => {
                    // Prevent expansion if clicking directly on a button (play/pause/next)
                    if ((e.target as Element).closest('button')) return;
                    hapticFeedback(10);
                    onExpand();
                }}
            >
                {/* Progress Bar (at the top edge of the player) */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-slate-300/50 dark:bg-slate-700/50">
                    <div
                        className="h-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] dark:shadow-[0_0_8px_rgba(16,185,129,0.8)] transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Shimmer overlay when playing */}
                <div className={`absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/[0.05] dark:via-teal-500/[0.03] to-emerald-500/0 -translate-x-full transition-transform duration-[2000ms] pointer-events-none ${isPlaying ? 'animate-[shimmer_3s_infinite]' : ''}`} />

                {/* Left side: Icon or Arabic Watermark Hint */}
                <div className="w-10 h-10 shrink-0 bg-emerald-500/10 rounded-xl border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-arabic text-xl mr-3 relative overflow-hidden group-hover:scale-105 transition-transform">
                    {/* Glowing dot if playing */}
                    {isPlaying && <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-emerald-500 dark:bg-emerald-400 rounded-full animate-ping" />}
                    {activeSurah.arabic.substring(0, 2)}
                </div>

                {/* Middle: Text (Scrolling if too long) */}
                <div className="flex-1 min-w-0 pr-2">
                    <h4 className="text-slate-900 dark:text-slate-50 text-sm font-bold truncate tracking-wide transition-colors">
                        {activeSurah.name} <span className="text-xs text-slate-600 dark:text-slate-400 font-normal transition-colors">Suresi</span>
                    </h4>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400/80 uppercase tracking-widest truncate font-semibold transition-colors">
                        {isPlaying ? 'Şu an Çalıyor 🎵' : 'Mishary Rashid Alafasy'}
                    </p>
                </div>

                {/* Right side: Controls */}
                <div className="flex items-center gap-1 shrink-0">
                    <button
                        onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                        className="w-10 h-10 flex items-center justify-center text-slate-800 dark:text-slate-100 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-500/10 rounded-full transition-all active:scale-90"
                    >
                        {isPlaying ? (
                            <svg className="w-5 h-5 drop-shadow-sm dark:drop-shadow-md" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                        ) : (
                            <svg className="w-6 h-6 ml-0.5 drop-shadow-sm dark:drop-shadow-md" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                        )}
                    </button>

                    <button
                        onClick={(e) => { e.stopPropagation(); playNext(); }}
                        className="w-8 h-8 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 hover:bg-slate-100 dark:hover:bg-slate-700/80 rounded-full transition-all active:scale-90 hidden sm:flex"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M13 5v4H4v6h9v4l7-7-7-7z" /></svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

