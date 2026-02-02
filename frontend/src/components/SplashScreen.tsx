import { useEffect, useState } from 'react';
import { Logo } from './Logo';

interface SplashScreenProps {
    onFinish: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Start exit animation slightly before unmounting
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onFinish, 700); // Wait for transition to finish
        }, 2200);

        return () => clearTimeout(timer);
    }, [onFinish]);

    return (
        <div
            className={`
                fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0f172a] text-white
                transition-opacity duration-700 ease-in-out
                ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
            `}
        >
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-[0.05] animate-pulse-slow"></div>

            {/* Logo Container */}
            <div className={`relative flex flex-col items-center transition-all duration-1000 transform ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-10'}`}>
                {/* Glow Effect */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>

                {/* Icon/Logo using Component */}
                <div className="relative mb-6">
                    <Logo className="w-24 h-24 text-emerald-400" withGlow={true} />
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-200 via-white to-emerald-200 bg-clip-text text-transparent tracking-widest font-arabic mb-2">
                    KUR'AN
                </h1>
                <p className="text-emerald-500/80 text-sm tracking-[0.3em] uppercase font-light">
                    ANLAM HARİTASI
                </p>

                {/* Loading Bar */}
                <div className="mt-12 w-32 h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-600 to-teal-400 w-full origin-left animate-[grow_2s_ease-out_forwards]"></div>
                </div>
            </div>
        </div>
    );
}
