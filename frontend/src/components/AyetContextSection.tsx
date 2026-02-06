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
    // We pass 'metadata' (legacy) so the service can use it as fallback for Deep features
    const deepInfo = DeepContentService.getDeepInfo(sure, ayet, metadata);

    // Determine chain data: specific DeepInfo overrides generic metadata
    const activeChain = deepInfo?.chain;

    // Parse chain info if exists for navigation
    const handleChainClick = () => {
        if (activeChain?.next && onNavigate) {
            const [nextSure, nextAyet] = activeChain.next.split(':').map(Number);
            onNavigate(nextSure, nextAyet);
        }
    };

    return (
        <div className="mt-8 space-y-10 animate-fadeIn">
            {/* 1️⃣ Deep Content Zone (Sessiz & Derin) */}
            {deepInfo && (
                <div>
                    {/* Tone Indicator (Subtle Header) */}
                    {deepInfo.tone && (
                        <div className="flex justify-center mb-4">
                            <ToneIndicator tone={deepInfo.tone} />
                        </div>
                    )}

                    {/* The Silent Question (Centerpiece) */}
                    {deepInfo.question && (
                        <DeepQuestion question={deepInfo.question} />
                    )}

                    {/* Concept Chips (Interactive) */}
                    {deepInfo.concepts && deepInfo.concepts.length > 0 && (
                        <ConceptChips concepts={deepInfo.concepts} />
                    )}

                    {/* Modern Context (If available) */}
                    {deepInfo.modernContext && (
                        <div className="mt-6 text-center">
                            <p className="text-sm font-serif text-theme-text/80 italic leading-relaxed border-l-2 border-theme-border/50 pl-4 inline-block text-left">
                                "{deepInfo.modernContext}"
                            </p>
                        </div>
                    )}

                    {/* Separator - Only show if we displayed something above */}
                    {(deepInfo.question || deepInfo.modernContext || (deepInfo.concepts && deepInfo.concepts.length > 0)) && (
                        <div className="w-16 h-px bg-theme-border/30 mx-auto mt-8"></div>
                    )}
                </div>
            )}

            {/* 2️⃣ Private Notes (Gizli Notlar) */}
            <PrivateNoteWidget sure={sure} ayet={ayet} />

            {/* 3️⃣ Thematic Chain (Zincirleme Okuma) */}
            {activeChain && (
                <div className="pt-2">
                    <button
                        onClick={handleChainClick}
                        className="w-full group bg-theme-bg/30 hover:bg-theme-bg border border-theme-border/20 hover:border-indigo-500/30 rounded-xl p-4 transition-all duration-300 text-left relative overflow-hidden"
                    >
                        {/* Hover Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-indigo-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

                        <div className="flex items-center gap-4 relative z-10">
                            {/* Icon Box */}
                            <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform flex-shrink-0">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-500 uppercase tracking-wide">
                                        Zincirleme Okuma
                                    </span>
                                    <span className="text-xs text-theme-muted font-mono bg-theme-border/20 px-1.5 rounded">
                                        {activeChain.next}
                                    </span>
                                </div>
                                <p className="text-sm font-medium text-theme-text group-hover:text-indigo-500 transition-colors line-clamp-1">
                                    {activeChain.nuance}
                                </p>
                            </div>

                            <div className="opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                                <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </button>
                </div>
            )}
        </div>
    );
}
