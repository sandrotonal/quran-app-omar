interface AyetDetailPanelProps {
    data: {
        label: string;
        text: string;
        arabic: string;
        similarityScore?: number;
        isCenter?: boolean;
    } | null;
    onClose: () => void;
}

export function AyetDetailPanel({ data, onClose }: AyetDetailPanelProps) {
    if (!data) return null;

    return (
        <div className="fixed right-0 top-0 h-full w-96 bg-theme-surface shadow-2xl border-l border-theme-border/20 overflow-y-auto z-50 backdrop-blur-xl">
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-theme-text">
                        {data.label}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-theme-muted hover:text-theme-text transition-colors text-2xl"
                    >
                        ×
                    </button>
                </div>

                {data.isCenter && (
                    <div className="mb-4 px-3 py-2 bg-blue-500/10 border border-blue-500/20 rounded-md">
                        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                            Merkez Ayet
                        </p>
                    </div>
                )}

                {data.similarityScore !== undefined && (
                    <div className="mb-4">
                        <p className="text-sm text-theme-muted mb-2">
                            Benzerlik Skoru
                        </p>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-emerald-400 to-teal-500"
                                    style={{ width: `${data.similarityScore * 100}%` }}
                                />
                            </div>
                            <span className="font-bold text-theme-text">
                                {(data.similarityScore * 100).toFixed(1)}%
                            </span>
                        </div>
                    </div>
                )}

                <div className="mb-6">
                    <p className="text-sm text-theme-muted mb-2">
                        Arapça Metin
                    </p>
                    <p className="text-2xl text-right leading-loose text-theme-text font-arabic">
                        {data.arabic}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-theme-muted mb-2">
                        Türkçe Meal
                    </p>
                    <p className="text-base leading-relaxed text-theme-text/80 font-serif">
                        {data.text}
                    </p>
                </div>
            </div>
        </div>
    );
}
