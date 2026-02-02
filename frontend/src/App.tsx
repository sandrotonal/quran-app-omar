import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { AyetSelector } from './components/AyetSelector';
import { MobileAyetSelector } from './components/MobileAyetSelector';
import { SemanticGraph } from './components/SemanticGraph';
import { AyetCard } from './components/AyetCard';
import { AyetDetailPanel } from './components/AyetDetailPanel';
import { MenuDrawer } from './components/MenuDrawer';
import { getSimilarAyets } from './lib/api';
import { transformToGraphData } from './lib/graphUtils';
import { useResponsive } from './hooks/useResponsive';

const queryClient = new QueryClient();

function AppContent() {
    const [isDark, setIsDark] = useState(true);
    const [searchParams, setSearchParams] = useState<{ sure: number; ayet: number } | null>(null);
    const [selectedNode, setSelectedNode] = useState<any>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const { isMobile } = useResponsive();

    // Initialize dark mode on mount
    useEffect(() => {
        document.documentElement.classList.add('dark');
        console.log('Mobile detected:', isMobile);
    }, [isMobile]);

    const { data, isLoading, isError } = useQuery({
        queryKey: ['similarAyets', searchParams],
        queryFn: () => getSimilarAyets(searchParams!.sure, searchParams!.ayet),
        enabled: !!searchParams,
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    });

    const graphData = data ? transformToGraphData(data) : { nodes: [], edges: [] };

    const handleSearch = (sure: number, ayet: number) => {
        setSearchParams({ sure, ayet });
        setSelectedNode(null);
        setIsMenuOpen(false); // Close menu if open
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top
    };

    const toggleDarkMode = () => {
        const newDark = !isDark;
        setIsDark(newDark);
        if (newDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    return (
        <div className={isDark ? 'dark' : ''}>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-amber-50/20 dark:from-slate-950 dark:via-emerald-950/20 dark:to-slate-900 transition-all duration-500">
                {/* Islamic Pattern Overlay */}
                <div className="fixed inset-0 opacity-[0.02] dark:opacity-[0.03] pointer-events-none islamic-pattern"></div>

                {/* Header */}
                <header className="sticky top-0 z-40 bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 dark:from-emerald-900 dark:via-emerald-800 dark:to-teal-900 shadow-2xl border-b-4 border-amber-400/30">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDAgTCA2MCAwIEwgNjAgNjAgTCAwIDYwIFoiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>

                    <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-5 relative">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3 md:gap-4">
                                {/* Menu Button */}
                                <button
                                    onClick={() => setIsMenuOpen(true)}
                                    className="p-2 md:p-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-all duration-300 shadow-lg hover:shadow-xl text-white active:scale-95"
                                    aria-label="Menü"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </button>

                                <div>
                                    <h1 className="text-lg md:text-2xl font-bold text-white drop-shadow-lg tracking-tight">
                                        Kur'an Anlam Haritası
                                    </h1>
                                    <p className="text-emerald-100 text-[10px] md:text-xs mt-0.5 hidden sm:block font-medium opacity-90">
                                        Ayetler Arası Anlamsal Benzerlik Keşfi
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={toggleDarkMode}
                                className="p-2 md:p-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-all duration-300 shadow-lg hover:shadow-xl text-white active:scale-95"
                                aria-label={isDark ? 'Aydınlık Mod' : 'Karanlık Mod'}
                            >
                                {isDark ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 relative z-10 min-h-[calc(100vh-200px)]">
                    {/* Conditional Selector */}
                    {isMobile ? (
                        <MobileAyetSelector onSearch={handleSearch} isLoading={isLoading} />
                    ) : (
                        <AyetSelector onSearch={handleSearch} isLoading={isLoading} />
                    )}

                    {isError && (
                        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-100 px-4 md:px-6 py-4 rounded-r-lg mb-6 shadow-lg flex items-center gap-3 animate-fadeIn">
                            <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                                <p className="font-bold">Bir hata oluştu</p>
                                <p className="text-sm mt-0.5 opacity-90">Lütfen tekrar deneyin veya farklı bir ayet seçin.</p>
                            </div>
                        </div>
                    )}

                    {/* Results */}
                    {data && (
                        <div className="animate-fadeIn">
                            {isMobile ? (
                                <div className="space-y-6">
                                    {/* Main Ayet Card */}
                                    <AyetCard
                                        sure={data.center.sure}
                                        ayet={data.center.ayet}
                                        arabicText={data.center.arabic}
                                        turkishText={data.center.text}
                                        isMain={true}
                                    />

                                    {/* Similar Ayets Section */}
                                    {data.similar.length > 0 && (
                                        <>
                                            <div className="flex items-center gap-4 mt-8 mb-6">
                                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
                                                <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-full border border-emerald-200/50 dark:border-emerald-700/50">
                                                    <span className="text-lg">✨</span>
                                                    <h3 className="text-sm font-bold text-emerald-800 dark:text-emerald-200 uppercase tracking-wide">
                                                        Benzer Ayetler
                                                    </h3>
                                                </div>
                                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
                                            </div>

                                            <div className="space-y-4">
                                                {data.similar.map((ayet) => (
                                                    <AyetCard
                                                        key={`${ayet.sure}-${ayet.ayet}`}
                                                        sure={ayet.sure}
                                                        ayet={ayet.ayet}
                                                        arabicText={ayet.arabic}
                                                        turkishText={ayet.text}
                                                        similarityScore={ayet.similarityScore}
                                                        isMain={false}
                                                    />
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <div className="mb-8 p-1 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700">
                                    <SemanticGraph
                                        nodes={graphData.nodes}
                                        edges={graphData.edges}
                                        onNodeClick={setSelectedNode}
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {!searchParams && (
                        <div className="text-center py-20 md:py-32 animate-fadeIn">
                            <div className="inline-block p-8 md:p-10 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-emerald-100 dark:border-emerald-800 transform hover:scale-105 transition-transform duration-500">
                                <div className="w-16 h-16 mx-auto mb-6 bg-emerald-100 dark:bg-emerald-900/50 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <p className="text-xl md:text-2xl text-gray-800 dark:text-white font-bold px-4 mb-3">
                                    Anlamsal Yolculuğa Başlayın
                                </p>
                                <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 px-4 max-w-md mx-auto leading-relaxed">
                                    Kur'an ayetleri arasındaki derin anlamsal bağları yapay zeka teknolojisi ile keşfedin.
                                </p>
                            </div>
                        </div>
                    )}
                </main>

                {/* Detail Panel - Desktop Only */}
                {!isMobile && (
                    <AyetDetailPanel
                        data={selectedNode}
                        onClose={() => setSelectedNode(null)}
                    />
                )}

                {/* Footer */}
                <footer className="mt-12 py-8 bg-slate-900 dark:bg-slate-950 border-t border-emerald-900/50 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-5"></div>
                    <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="text-center md:text-left">
                                <h3 className="text-lg font-bold text-white mb-1 flex items-center justify-center md:justify-start gap-2">
                                    <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                    Kur'an Anlam Haritası
                                </h3>
                                <p className="text-sm text-gray-400">
                                    Diyanet İşleri Başkanlığı Meali & NLP Teknolojisi
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="flex items-center justify-center gap-3 mb-2">
                                    <div className="h-px w-10 bg-emerald-800"></div>
                                    <span className="text-xs text-emerald-600 font-medium tracking-widest uppercase">Geliştirici</span>
                                    <div className="h-px w-10 bg-emerald-800"></div>
                                </div>
                                <span className="text-xl font-bold bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 bg-clip-text text-transparent drop-shadow-sm font-tracking-wide">
                                    gucluyumhe
                                </span>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>

            {/* Menu Drawer */}
            <MenuDrawer
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                onNavigate={handleSearch}
            />
        </div>
    );
}

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AppContent />
        </QueryClientProvider>
    );
}

export default App;
