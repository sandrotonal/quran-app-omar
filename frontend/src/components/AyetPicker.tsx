import { hapticFeedback } from '../lib/constants';
import { createPortal } from 'react-dom';

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

    return createPortal(
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] animate-fadeIn"
                onClick={onClose}
            />

            {/* Bottom Sheet */}
            <div className="fixed inset-x-0 bottom-0 z-[70] animate-slideUp">
                <div className="bg-white dark:bg-[#0D1526] rounded-t-[2rem] shadow-2xl border-t border-slate-100 dark:border-white/[0.07] overflow-hidden">

                    {/* Handle */}
                    <div className="flex justify-center pt-3 pb-1">
                        <div className="w-10 h-1 bg-slate-200 dark:bg-white/20 rounded-full"></div>
                    </div>

                    {/* Header */}
                    <div className="px-6 pt-3 pb-4 border-b border-slate-100 dark:border-white/[0.06]">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white text-center tracking-tight">
                            Ayet Seç
                            <span className="ml-2 text-sm font-medium text-slate-400 dark:text-slate-500">(1–{maxAyet})</span>
                        </h3>
                    </div>

                    {/* Scroll Wheel */}
                    <div className="relative">
                        {/* Top fade */}
                        <div className="pointer-events-none absolute top-0 inset-x-0 h-10 bg-gradient-to-b from-white dark:from-[#0D1526] to-transparent z-10"></div>
                        {/* Bottom fade */}
                        <div className="pointer-events-none absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-white dark:from-[#0D1526] to-transparent z-10"></div>

                        <div className="h-64 overflow-y-auto snap-y snap-mandatory px-5 py-3 space-y-1 scroll-smooth">
                            {ayets.map((ayet) => (
                                <button
                                    key={ayet}
                                    onClick={() => handleSelect(ayet)}
                                    className={`
                                        w-full py-3.5 text-center text-xl font-bold rounded-xl snap-center
                                        transition-all duration-200 active:scale-[0.97]
                                        ${ayet === selectedAyet
                                            ? 'bg-gradient-to-r from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/25 scale-[1.02]'
                                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/[0.05]'
                                        }
                                    `}
                                >
                                    {ayet}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Confirm Button */}
                    <div className="px-5 pb-8 pt-3 border-t border-slate-100 dark:border-white/[0.06]">
                        <button
                            onClick={onClose}
                            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 active:scale-[0.97] transition-all duration-200 text-base tracking-wide"
                        >
                            Tamam
                        </button>
                    </div>
                </div>
            </div>
        </>,
        document.body
    );
}
