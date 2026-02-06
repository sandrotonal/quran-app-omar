
interface ToneIndicatorProps {
    tone: 'warning' | 'glad_tidings' | 'guiding' | 'prayer' | 'gratitude';
}

const TONE_CONFIG = {
    warning: { color: 'text-rose-500', bg: 'bg-rose-500', label: 'Uyarı', icon: '!' },
    glad_tidings: { color: 'text-emerald-500', bg: 'bg-emerald-500', label: 'Müjde', icon: '✨' },
    guiding: { color: 'text-blue-500', bg: 'bg-blue-500', label: 'Yol Gösterme', icon: '🧭' },
    prayer: { color: 'text-violet-500', bg: 'bg-violet-500', label: 'Dua', icon: '🤲' },
    gratitude: { color: 'text-amber-500', bg: 'bg-amber-500', label: 'Şükür', icon: '🙏' },
};

export function ToneIndicator({ tone }: ToneIndicatorProps) {
    const config = TONE_CONFIG[tone];
    if (!config) return null;

    return (
        <div className="flex items-center gap-1.5" title={`Ayetin Tonu: ${config.label}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${config.bg}`}></span>
            <span className={`text-[10px] font-bold uppercase tracking-widest ${config.color} opacity-70`}>
                {config.label}
            </span>
        </div>
    );
}
