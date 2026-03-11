import { useEffect, useState } from 'react';
import { hapticFeedback } from '../lib/constants';

interface BottomTabBarProps {
    activeTab: 'home' | 'discover' | 'zikirmatik' | 'qibla' | 'theme';
    onHomeClick: () => void;
    onDiscoverClick: () => void;
    onZikirmatikClick: () => void;
    onQiblaClick: () => void;
    onThemeToggle: () => void;
    isDark: boolean;
}

export function BottomTabBar({
    activeTab,
    onHomeClick,
    onDiscoverClick,
    onZikirmatikClick,
    onQiblaClick,
    onThemeToggle,
    isDark
}: BottomTabBarProps) {
    const getIndex = () => {
        switch (activeTab) {
            case 'home': return 0;
            case 'zikirmatik': return 1;
            case 'discover': return 2;
            case 'qibla': return 3;
            case 'theme': return 4;
            default: return 0;
        }
    };

    const [liquidIndex, setLiquidIndex] = useState(getIndex());

    useEffect(() => {
        if (activeTab !== 'theme') {
            setLiquidIndex(getIndex());
        }
    }, [activeTab]);

    const handleThemeClick = () => {
        hapticFeedback(10);
        setLiquidIndex(4);
        onThemeToggle();
        // Tema tıklandıktan sonra animasyonun dönmesi için orijinal activeTab'e dön
        setTimeout(() => {
            setLiquidIndex(getIndex());
        }, 600);
    };

    // Nav Items Data
    const navItems = [
        {
            id: 'home',
            action: () => { hapticFeedback(10); onHomeClick(); },
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            )
        },
        {
            id: 'zikirmatik',
            action: () => { hapticFeedback(10); onZikirmatikClick(); },
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <circle cx="12" cy="12" r="9" strokeWidth={1.8} />
                    <circle cx="12" cy="12" r="3" strokeWidth={1.8} fill="currentColor" fillOpacity={0.2} />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 9v6m-3-3h6" />
                </svg>
            )
        },
        {
            id: 'discover',
            action: () => { hapticFeedback(10); onDiscoverClick(); },
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <rect x="3" y="3" width="7" height="7" rx="2" strokeWidth={1.8} />
                    <rect x="14" y="3" width="7" height="7" rx="2" strokeWidth={1.8} />
                    <rect x="14" y="14" width="7" height="7" rx="2" strokeWidth={1.8} />
                    <rect x="3" y="14" width="7" height="7" rx="2" strokeWidth={1.8} />
                </svg>
            )
        },
        {
            id: 'qibla',
            action: () => { hapticFeedback(10); onQiblaClick(); },
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <circle cx="12" cy="12" r="9" strokeWidth={1.8} />
                    <path d="M12 7l2.5 8.5-2.5-1.5-2.5 1.5L12 7z" strokeWidth={1.8} strokeLinejoin="round" />
                </svg>
            )
        },
        {
            id: 'theme',
            action: handleThemeClick,
            icon: isDark ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
            )
        }
    ];

    return (
        <div className="fixed bottom-0 left-0 w-screen max-w-[100vw] z-50 px-6 pb-6 sm:hidden pointer-events-none">

            {/* Main Bar Container - Matching Dribbble Shot 
                Aydınlık/Karanlık moda tam uyumlu "Light" UI
            */}
            <div className={`relative w-full h-[64px] mx-auto 
                ${isDark
                    ? 'bg-[#151b2e] border-white/5 shadow-xl shadow-black/30'
                    : 'bg-white/85 border-slate-200/80 shadow-2xl shadow-slate-500/20 ring-1 ring-slate-900/5'
                }
                backdrop-blur-2xl border
                rounded-[2rem]
                pointer-events-auto select-none flex items-center transition-colors duration-500`}
            >

                {/* Magic Floating Active Circle (Liquid bubble with pulse) */}
                <div className="absolute inset-x-0 top-0 h-full pointer-events-none overflow-visible">
                    <div
                        className={`absolute w-[48px] h-[48px] rounded-full z-10 shadow-lg flex items-center justify-center
                            ${isDark ? 'shadow-[#34d399]/40' : 'shadow-[#34d399]/50'}
                        `}
                        style={{
                            left: `calc(10% + ${liquidIndex * 20}%)`,
                            transform: 'translateX(-50%) translateY(-50%)',
                            top: '50%',
                            transition: 'left 0.65s cubic-bezier(0.34, 1.56, 0.64, 1)', // Ultra Snappy Spring
                            background: '#34d399' // Solid neon green
                        }}
                    >
                        {/* Premium Inner Glow / Pulse Ring */}
                        <div className="absolute w-[60px] h-[60px] rounded-full border border-[#34d399]/30 animate-ping" style={{ animationDuration: '3s' }}></div>
                        <div className="absolute inset-1 rounded-full bg-gradient-to-tr from-emerald-500 to-emerald-300 shadow-inner opacity-90"></div>
                    </div>
                </div>

                {/* Navigation Items (Icons Only) */}
                <div className="relative w-full h-full flex items-center justify-between z-20">
                    {navItems.map((item, i) => {
                        const isActive = liquidIndex === i;
                        return (
                            <button
                                key={item.id}
                                onClick={item.action}
                                className="relative flex-1 h-full flex items-center justify-center group outline-none"
                                aria-label={`Tab ${i}`}
                            >
                                {/* Floating Icon Container - Bouncy pop effect */}
                                <div className={`flex flex-col items-center transition-all duration-500 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]
                                    ${isActive ? '-translate-y-[0.35rem]' : 'translate-y-0 group-hover:-translate-y-1'}
                                `}>
                                    <div className={`relative flex items-center justify-center transition-all duration-500 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]
                                        ${isActive
                                            ? 'text-white drop-shadow-md scale-[1.20]'
                                            : isDark
                                                ? 'text-slate-400/80 group-hover:text-white/90 scale-[0.95] group-hover:scale-105'
                                                : 'text-slate-500 group-hover:text-emerald-600 scale-[0.95] group-hover:scale-105'
                                        }
                                    `}>
                                        {item.icon}
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>

            </div>
        </div>
    );
}
