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
        <div className="fixed right-0 top-0 h-full w-96 bg-white dark:bg-slate-800 shadow-2xl border-l border-gray-200 dark:border-gray-700 overflow-y-auto z-50">
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {data.label}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
                    >
                        ×
                    </button>
                </div>

                {data.isCenter && (
                    <div className="mb-4 px-3 py-2 bg-blue-100 dark:bg-blue-900 rounded-md">
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                            Merkez Ayet
                        </p>
                    </div>
                )}

                {data.similarityScore !== undefined && (
                    <div className="mb-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            Benzerlik Skoru
                        </p>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                                    style={{ width: `${data.similarityScore * 100}%` }}
                                />
                            </div>
                            <span className="font-bold text-gray-900 dark:text-white">
                                {(data.similarityScore * 100).toFixed(1)}%
                            </span>
                        </div>
                    </div>
                )}

                <div className="mb-6">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Arapça Metin
                    </p>
                    <p className="text-lg text-right leading-loose text-gray-900 dark:text-white font-arabic">
                        {data.arabic}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Türkçe Meal
                    </p>
                    <p className="text-base leading-relaxed text-gray-900 dark:text-white">
                        {data.text}
                    </p>
                </div>
            </div>
        </div>
    );
}
