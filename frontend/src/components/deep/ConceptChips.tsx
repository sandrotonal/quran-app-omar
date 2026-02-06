
import { DeepConcept } from '../../lib/deepContentService';
import { useState } from 'react';

interface ConceptChipsProps {
    concepts: DeepConcept[];
}

export function ConceptChips({ concepts }: ConceptChipsProps) {
    return (
        <div className="flex flex-wrap gap-2 justify-center my-4">
            {concepts.map((concept, index) => (
                <ConceptChip key={index} concept={concept} />
            ))}
        </div>
    );
}

function ConceptChip({ concept }: { concept: DeepConcept }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative group">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="
                    px-3 py-1 rounded-full border border-theme-border/50 bg-theme-bg/30 
                    text-xs font-medium text-theme-text/80 hover:bg-theme-bg hover:border-theme-border
                    transition-all duration-300 flex items-center gap-2
                "
            >
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400/50"></span>
                {concept.word}
            </button>

            {/* Tooltip / Popover */}
            <div className={`
                absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 rounded-xl
                bg-theme-surface border border-theme-border/50 shadow-xl backdrop-blur-md
                transition-all duration-300 z-50 origin-bottom
                ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto'}
            `}>
                <div className="text-center">
                    <div className="text-xs text-theme-muted mb-1 font-mono uppercase tracking-wider">{concept.root}</div>
                    <div className="font-bold text-theme-text mb-1">{concept.word}</div>
                    <div className="text-xs text-theme-text/80 leading-relaxed">"{concept.meaning}"</div>
                </div>
                {/* Arrow */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-theme-surface"></div>
            </div>
        </div>
    );
}
