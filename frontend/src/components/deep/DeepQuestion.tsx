
import { useEffect, useState } from 'react';

interface DeepQuestionProps {
    question: string;
}

export function DeepQuestion({ question }: DeepQuestionProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(false);
        const timer = setTimeout(() => setIsVisible(true), 500); // Slight delay for effect
        return () => clearTimeout(timer);
    }, [question]);

    return (
        <div className={`
            font-serif text-lg md:text-xl text-center italic text-theme-muted/80
            transition-all duration-1000 ease-in-out my-6
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        `}>
            {question}
        </div>
    );
}
