import { hapticFeedback } from '../lib/constants';

interface AyetPickerProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (ayetNo: number) => void;
    maxAyet: number;
    selectedAyet?: number;
}

export function AyetPicker({ isOpen, onClose, onSelect, maxAyet, selectedAyet = 1 }: AyetPickerProps) {
    const handleSelect = (ayetNo: number) => {
        hapticFeedback(10);
        onSelect(ayetNo);
    };

    if (!isOpen) return null;

    const ayets = Array.from({ length: maxAyet }, (_, i) => i + 1);

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fadeIn"
                onClick={onClose}
            />

            {/* Bottom Sheet */}
            <div className="fixed inset-x-0 bottom-0 z-50 animate-slideUp">
                <div className="bg-white dark:bg-slate-800 rounded-t-3xl shadow-2xl">
                    {/* Handle */}
                    <div className="flex justify-center pt-3 pb-2">
                        <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                    </div>

                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center">
                            Ayet Seç (1-{maxAyet})
                        </h3>
                    </div>

                    {/* Picker Wheel */}
                    <div className="h-64 overflow-y-auto snap-y snap-mandatory px-6 py-4">
                        {ayets.map((ayet) => (
                            <button
                                key={ayet}
                                onClick={() => handleSelect(ayet)}
                                className={`
                  w-full py-4 text-center text-2xl font-bold rounded-xl transition-all snap-center
                  ${ayet === selectedAyet
                                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white scale-105 shadow-lg'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                                    }
                `}
                            >
                                {ayet}
                            </button>
                        ))}
                    </div>

                    {/* Confirm Button */}
                    <div className="p-6 pt-2">
                        <button
                            onClick={onClose}
                            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-transform"
                        >
                            Tamam
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
