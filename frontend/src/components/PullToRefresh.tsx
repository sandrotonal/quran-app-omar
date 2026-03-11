import React, { useState, useEffect, useCallback } from 'react';
import { hapticFeedback } from '../lib/constants';

interface PullToRefreshProps {
    children: React.ReactNode;
    onRefresh: () => Promise<void>;
}

export function PullToRefresh({ children, onRefresh }: PullToRefreshProps) {
    const [startY, setStartY] = useState(0);
    const [pullDistance, setPullDistance] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Config
    const pullThreshold = 75; // How far to pull to trigger refresh
    const maxPull = 120;

    const onTouchStart = (e: React.TouchEvent) => {
        // Only allow pull-to-refresh if we are at the very top of the page
        if (window.scrollY === 0) {
            setStartY(e.touches[0].clientY);
        }
    };

    const onTouchMove = (e: React.TouchEvent) => {
        if (startY === 0 || isRefreshing) return;

        const currentY = e.touches[0].clientY;
        const diff = currentY - startY;

        // If pulling down
        if (diff > 0 && window.scrollY === 0) {
            // Add some resistance
            const pulled = Math.min(diff * 0.4, maxPull);
            setPullDistance(pulled);

            // Haptic bump when crossing threshold
            if (pullDistance < pullThreshold && pulled >= pullThreshold) {
                hapticFeedback(10);
            }
        }
    };

    const onTouchEnd = useCallback(async () => {
        if (pullDistance >= pullThreshold && !isRefreshing) {
            hapticFeedback(20);
            setIsRefreshing(true);
            setPullDistance(50); // Keep it visible while refreshing

            try {
                await onRefresh();
            } finally {
                setIsRefreshing(false);
                setPullDistance(0);
            }
        } else {
            // Not pulled enough, reset
            setPullDistance(0);
        }
        setStartY(0);
    }, [pullDistance, isRefreshing, onRefresh]);

    // Handle momentum scroll that might bypass touch events
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0 && pullDistance > 0) {
                setPullDistance(0);
                setStartY(0);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [pullDistance]);

    return (
        <div
            className="w-full relative"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            {/* Pull Indicator Layer */}
            <div
                className="absolute top-0 left-0 w-full flex justify-center items-end"
                style={{
                    height: `${maxPull}px`,
                    transform: `translateY(${pullDistance - maxPull}px)`,
                    opacity: pullDistance > 10 ? 1 : 0,
                    transition: isRefreshing ? 'transform 0.3s ease, opacity 0.3s ease' : 'none'
                }}
            >
                <div className={`
                    w-10 h-10 mb-4 rounded-full flex items-center justify-center
                    bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700
                    text-emerald-500 transition-all duration-300
                    ${isRefreshing ? 'animate-spin shadow-emerald-500/30' : ''}
                    ${pullDistance >= pullThreshold && !isRefreshing ? 'scale-110 shadow-emerald-500/20' : 'scale-100'}
                `}>
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        style={{
                            transform: isRefreshing ? 'none' : `rotate(${pullDistance * 3}deg)`
                        }}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                </div>
            </div>

            {/* Content Layer */}
            <div
                style={{
                    transform: `translateY(${pullDistance}px)`,
                    transition: isRefreshing ? 'transform 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28)' : (pullDistance === 0 ? 'transform 0.2s ease-out' : 'none')
                }}
            >
                {children}
            </div>
        </div>
    );
}
