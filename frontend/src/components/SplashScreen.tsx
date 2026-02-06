import { useEffect, useState } from 'react';
import { Logo } from './Logo';

interface SplashScreenProps {
    onFinish: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onFinish, 1200);
        }, 4000); // Longer duration for an ethereal experience

        return () => clearTimeout(timer);
    }, [onFinish]);

    return (
        <div
            className={`
                fixed inset-0 z-[100] flex flex-col items-center justify-center bg-theme-bg text-theme-text
                transition-all duration-[1200ms] ease-[cubic-bezier(0.25,1,0.5,1)]
                ${isVisible ? 'opacity-100' : 'opacity-0 scale-100 pointer-events-none'}
            `}
        >
            {/* Deep Space Backdrop */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,rgba(var(--accent),0.05)_0%,transparent_60%)]"></div>
            </div>

            {/* Content Container */}
            <div className="relative flex flex-col items-center justify-center">

                {/* Pure Icon - White to Emerald subtle gradient */}
                <div className="relative mb-20 opacity-0 animate-fadeIn [animation-delay:0.5s]">
                    <div className="absolute inset-0 bg-accent/10 blur-[30px] rounded-full scale-125"></div>
                    <Logo className="w-16 h-16 text-accent" withGlow={true} />
                </div>

                {/* Ultra-Luxury Typography */}
                <div className="flex flex-col items-center gap-8">
                    <h1
                        className="text-3xl font-extralight font-serif text-theme-text opacity-0 animate-[title-reveal_2.5s_cubic-bezier(0.22,1,0.36,1)_forwards] [animation-delay:0.8s] pl-[1.2em]"
                        style={{ textShadow: '0 0 40px rgba(var(--accent),0.1)' }}
                    >
                        KUR'AN
                    </h1>

                    <div className="h-[0.5px] w-12 bg-accent/20 animate-[grow_1.5s_ease-out_forwards] opacity-0 [animation-delay:1.5s]"></div>

                    <p className="text-theme-muted/50 text-[10px] tracking-[1.2em] uppercase font-light animate-fadeIn opacity-0 [animation-delay:2.2s] pl-[1.2em]">
                        ANLAM HARİTASI
                    </p>
                </div>

                {/* Minimalist Loading Step - Invisible Speed Line */}
                <div className="mt-32 w-32 h-[0.5px] bg-white/[0.02] relative overflow-hidden opacity-40">
                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] animate-[shimmer-gold_4s_infinite]"></div>
                </div>
            </div>

            {/* Star Particles - Fewer and Smaller */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute bg-white/20 rounded-full blur-[1px] animate-float"
                        style={{
                            width: `1px`,
                            height: `1px`,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${Math.random() * 15 + 10}s`
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
