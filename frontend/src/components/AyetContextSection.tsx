import { PrivateNoteWidget } from './PrivateNoteWidget';
import { DeepContentService } from '../lib/deepContentService';
import { DeepQuestion } from './deep/DeepQuestion';
import { ConceptChips } from './deep/ConceptChips';
import { ToneIndicator } from './deep/ToneIndicator';

interface AyetContextSectionProps {
    sure: number;
    ayet: number;
    metadata?: any;
    onNavigate?: (sure: number, ayet: number) => void;
}

export function AyetContextSection({ sure, ayet, metadata, onNavigate }: AyetContextSectionProps) {
    const deepInfo = DeepContentService.getDeepInfo(sure, ayet, metadata);
    const activeChain = deepInfo?.chain;

    const handleChainClick = () => {
        if (activeChain?.next && onNavigate) {
            const [nextSure, nextAyet] = activeChain.next.split(':').map(Number);
            onNavigate(nextSure, nextAyet);
        }
    };

    return (
        <div className="mt-8 space-y-8 animate-fadeIn">

            {/* 1️⃣ Deep Content Zone */}
            {deepInfo && (
                <div>
                    {deepInfo.tone && (
                        <div className="flex justify-center mb-4">
                            <ToneIndicator tone={deepInfo.tone} />
                        </div>
                    )}
                    {deepInfo.question && <DeepQuestion question={deepInfo.question} />}
                    {deepInfo.concepts && deepInfo.concepts.length > 0 && (
                        <ConceptChips concepts={deepInfo.concepts} />
                    )}
                    {deepInfo.modernContext && (
                        <div className="mt-6 text-center">
                            <p className="text-sm font-serif text-theme-text/80 italic leading-relaxed border-l-2 border-theme-border/50 pl-4 inline-block text-left">
                                "{deepInfo.modernContext}"
                            </p>
                        </div>
                    )}
                    {(deepInfo.question || deepInfo.modernContext || (deepInfo.concepts && deepInfo.concepts.length > 0)) && (
                        <div className="w-16 h-px bg-theme-border/30 mx-auto mt-8" />
                    )}
                </div>
            )}

            {/* 2️⃣ Derinlik & Notlar label + Private Notes */}
            <div>
                <div className="flex items-center gap-3 mb-4">
                    <span className="w-4 h-px bg-theme-border" />
                    <span className="text-[9px] font-black text-theme-muted uppercase tracking-[0.28em]">Derinlik &amp; Notlar</span>
                </div>
                <PrivateNoteWidget sure={sure} ayet={ayet} />
            </div>

            {/* 3️⃣ Zincirleme Okuma */}
            {activeChain && (
                <div>
                    {/* Section label */}
                    <div className="flex items-center gap-3 mb-3">
                        <span className="w-4 h-px bg-theme-border" />
                        <span className="text-[9px] font-black text-theme-muted uppercase tracking-[0.28em]">Tematik Zincir</span>
                    </div>

                    <button
                        onClick={handleChainClick}
                        className="w-full group text-left relative overflow-hidden rounded-2xl p-4 transition-all duration-300 active:scale-[0.97]
                            bg-gradient-to-br from-emerald-50/80 to-teal-50/60
                            dark:bg-none dark:bg-[#0c1a28]
                            border border-emerald-200/70 dark:border-emerald-500/20
                            hover:border-emerald-400 dark:hover:border-emerald-400/40
                            shadow-sm shadow-emerald-100/50 dark:shadow-none
                            hover:shadow-md hover:shadow-emerald-100 dark:hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
                    >
                        {/* Subtle radial glow — dark only */}
                        <div className="pointer-events-none absolute inset-0 rounded-2xl hidden dark:block"
                            style={{ background: 'radial-gradient(ellipse 80% 60% at 20% 50%, rgba(16,185,129,0.06) 0%, transparent 70%)' }} />

                        {/* Shimmer on hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/[0.04] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />

                        <div className="flex items-center gap-3.5 relative z-10">
                            {/* Icon */}
                            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110
                                bg-emerald-100 dark:bg-emerald-500/[0.12]
                                border border-emerald-200 dark:border-emerald-500/25">
                                <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[9px] font-black uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
                                        Zincirleme Okuma
                                    </span>
                                    {/* Ayet badge — improved readability */}
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold font-mono px-2 py-[3px] rounded-lg
                                        bg-emerald-100 dark:bg-emerald-500/[0.15]
                                        text-emerald-700 dark:text-emerald-300
                                        border border-emerald-300/60 dark:border-emerald-500/30
                                        shadow-sm shadow-emerald-200/30 dark:shadow-none">
                                        <svg className="w-2.5 h-2.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                        </svg>
                                        {activeChain.next}
                                    </span>
                                </div>
                                <p className="text-[0.85rem] font-medium leading-snug
                                    text-slate-600 dark:text-slate-300
                                    group-hover:text-emerald-700 dark:group-hover:text-emerald-300
                                    transition-colors duration-200 line-clamp-1">
                                    {activeChain.nuance}
                                </p>
                            </div>

                            {/* Arrow */}
                            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 -translate-x-1 group-hover:translate-x-0
                                bg-emerald-100/80 dark:bg-emerald-500/[0.1]
                                group-hover:bg-emerald-200 dark:group-hover:bg-emerald-500/[0.18]">
                                <svg className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 transition-colors"
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </button>
                </div>
            )}
        </div>
    );
}
