import { DEEP_CONTENT_DATABASE } from '../data/deepContentData';
import { SURAHS } from './constants';
import { AyetMetadata } from './api';

export interface DeepConcept {
    word: string;
    root: string;
    meaning: string;
    firstMention?: string;
}

export interface AyetDeepInfo {
    question?: string;
    concepts?: DeepConcept[];
    tone?: 'warning' | 'glad_tidings' | 'guiding' | 'prayer' | 'gratitude';
    opposition?: string;
    modernContext?: string;
    echoes?: string[];
    chain?: {
        next: string;
        nuance: string;
    };
}

export const DeepContentService = {
    getDeepInfo: (sure: number, ayet: number, legacyMetadata?: AyetMetadata): AyetDeepInfo | null => {
        const key = `${sure}:${ayet}`;
        const manualData = DEEP_CONTENT_DATABASE[key];

        // Start with manual data or empty object
        const result: AyetDeepInfo = manualData ? { ...manualData } : {};

        // ---------------------------------------------------------
        // UNIVERSAL FALLBACKS (Ensure consistent UI for ALL ayets)
        // ---------------------------------------------------------

        // 1. Context Fallback: Use legacy 'context' if 'modernContext' is missing
        if (!result.modernContext && legacyMetadata?.context) {
            result.modernContext = legacyMetadata.context;
        }

        // 2. Concepts Fallback: Convert legacy 'tags' to 'concepts'
        if ((!result.concepts || result.concepts.length === 0) && legacyMetadata?.tags) {
            result.concepts = legacyMetadata.tags.map(tag => ({
                word: tag, // Tag name becomes the concept word
                root: '—', // Placeholder root
                meaning: 'Kur\'an\'da geçen temel kavram.' // Generic meaning
            }));
        }

        // 3. Chain Navigation Fallback (Calculated)
        if (!result.chain) {
            const nextLink = getUniversalNext(sure, ayet);
            if (nextLink) {
                result.chain = {
                    next: nextLink.next,
                    nuance: nextLink.nuance
                };
            }
        }

        // Return result if it has at least SOME content to show
        const hasContent = result.question || (result.concepts && result.concepts.length > 0) || result.tone || result.modernContext || result.chain;
        return hasContent ? result : null;
    }
};

// Helper: Calculate standard next ayet logic
function getUniversalNext(sure: number, ayet: number): { next: string, nuance: string } | null {
    const currentSurah = SURAHS.find(s => s.id === sure);
    if (!currentSurah) return null;

    // Case A: Next Ayet in same Surah
    if (ayet < currentSurah.ayetCount) {
        return {
            next: `${sure}:${ayet + 1}`,
            nuance: "Sıradaki ayet ile devam et..." // Generic nuance
        };
    }

    // Case B: End of Surah -> Next Surah
    if (ayet === currentSurah.ayetCount && sure < 114) {
        const nextSurah = SURAHS.find(s => s.id === sure + 1);
        if (nextSurah) {
            return {
                next: `${sure + 1}:1`,
                nuance: `${nextSurah.turkish} Suresi'ne geçiş...`
            };
        }
    }

    return null; // End of Quran (114:6)
}
