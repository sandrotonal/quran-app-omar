import { AyetContextSection } from './AyetContextSection';

interface AyetDetailPanelProps {
    data: {
        label: string;
        text: string;
        arabic: string;
        similarityScore?: number;
        isCenter?: boolean;
        metadata?: {
            tags?: string[];
            context?: string;
            chain?: {
                next: string;
                nuance: string;
            };
        };
    } | null;
    onClose: () => void;
    onNavigate?: (sure: number, ayet: number) => void;
}

export function AyetDetailPanel({ data, onClose, onNavigate }: AyetDetailPanelProps) {
    if (!data) return null;

    // Parse sure and ayet from label (e.g. "1:1")
    const [sureStr, ayetStr] = data.label.split(':');
    const sure = parseInt(sureStr);
    const ayet = parseInt(ayetStr);



    return (
        <div className="fixed right-0 top-0 h-full w-96 bg-theme-surface shadow-2xl border-l border-theme-border/20 overflow-y-auto z-50 backdrop-blur-xl transition-all duration-300 animate-slideInRight">
            <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-theme-text font-serif">
                            {data.label}
                        </h3>

                    </div>
                    <button
                        onClick={onClose}
                        className="text-theme-muted hover:text-red-500 transition-colors p-1"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {data.isCenter && (
                    <div className="mb-4 px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-md flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                        <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                            Merkez Ayet
                        </p>
                    </div>
                )}

                {/* Similarity Score */}
                {data.similarityScore !== undefined && (
                    <div className="mb-6">
                        <div className="flex justify-between items-end mb-2">
                            <p className="text-xs text-theme-muted uppercase tracking-wider font-semibold">Anlamsal Yakınlık</p>
                            <span className="text-sm font-bold text-emerald-500">
                                %{(data.similarityScore * 100).toFixed(1)}
                            </span>
                        </div>
                        <div className="h-2 bg-theme-bg rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400"
                                style={{ width: `${data.similarityScore * 100}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Arabic Text */}
                <div className="mb-6 bg-theme-bg/30 p-4 rounded-2xl border border-theme-border/10">
                    <p className="text-2xl text-right leading-loose text-theme-text font-arabic" dir="rtl">
                        {data.arabic}
                    </p>
                </div>

                {/* Turkish Meal */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2 opacity-60">
                        <span className="w-4 h-px bg-theme-text/20"></span>
                        <p className="text-xs text-theme-text uppercase tracking-widest">Meal</p>
                    </div>
                    <p className="text-base leading-relaxed text-theme-text/90 font-serif">
                        {data.text}
                    </p>
                </div>

                {/* Unified Context Section */}
                <AyetContextSection sure={sure} ayet={ayet} metadata={data.metadata} onNavigate={onNavigate} />
            </div>
        </div>
    );
}
