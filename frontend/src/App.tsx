import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { AyetSelector } from './components/AyetSelector';
import { MobileAyetSelector } from './components/MobileAyetSelector';
import { SemanticGraph } from './components/SemanticGraph';
import { AyetCard } from './components/AyetCard';
import { AyetDetailPanel } from './components/AyetDetailPanel';
import { MenuDrawer } from './components/MenuDrawer';
import { SplashScreen } from './components/SplashScreen';
import { Logo } from './components/Logo';
import { getSimilarAyets } from './lib/api';
import { transformToGraphData } from './lib/graphUtils';
import { useResponsive } from './hooks/useResponsive';

const queryClient = new QueryClient();

function AppContent() {
    const [showSplash, setShowSplash] = useState(true);
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

    if (showSplash) {
        return <SplashScreen onFinish={() => setShowSplash(false)} />;
    }

    return (
        <div className={isDark ? 'dark' : ''}>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-amber-50/20 dark:from-slate-950 dark:via-emerald-950/20 dark:to-slate-900 transition-all duration-500 animate-fadeIn">
                {/* Islamic Pattern Overlay */}
                <div className="fixed inset-0 opacity-[0.02] dark:opacity-[0.03] pointer-events-none islamic-pattern"></div>

                {/* Header */}
                <header className="sticky top-0 z-40 bg-transparent backdrop-blur-md border-b border-white/10 transition-all duration-300">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDAgTCA2MCAwIEwgNjAgNjAgTCAwIDYwIFoiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>

                    <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-5 relative">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3 md:gap-4">
                                {/* Menu Button */}
                                <button
                                    onClick={() => setIsMenuOpen(true)}
                                    className="p-2 rounded-full hover:bg-white/10 transition-colors text-slate-800 dark:text-white"
                                    aria-label="Menü"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </button>

                                <div>
                                    <div className="flex items-center gap-2">
                                        {/* Header Logo */}
                                        <Logo className="w-8 h-8 text-emerald-600 dark:text-emerald-400 drop-shadow-sm" />
                                        <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white tracking-wide font-arabic">
                                            Kur'an <span className="font-light opacity-80 text-sm md:text-lg font-sans">Anlam Haritası</span>
                                        </h1>
                                    </div>
                                    <p className="text-emerald-100 text-[10px] md:text-xs mt-0.5 hidden sm:block font-medium opacity-90">
                                        Ayetler Arası Anlamsal Benzerlik Keşfi
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={toggleDarkMode}
                                className="p-2 rounded-full hover:bg-white/10 transition-colors text-slate-800 dark:text-white"
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
                        <MobileAyetSelector
                            onSearch={handleSearch}
                            isLoading={isLoading}
                            activeSure={searchParams?.sure}
                            activeAyet={searchParams?.ayet}
                        />
                    ) : (
                        <AyetSelector
                            onSearch={handleSearch}
                            isLoading={isLoading}
                            activeSure={searchParams?.sure}
                            activeAyet={searchParams?.ayet}
                        />
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
                        <div className="mt-8 md:mt-20 px-4 max-w-5xl mx-auto">
                            <div className="text-center mb-10">
                                <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-3 font-arabic tracking-tight">
                                    Önerilen Okumalar
                                </h2>
                                <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base">
                                    Sık okunan surelere ve ayetlere hızlıca ulaşın
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                                {[
                                    { label: 'Fatiha Suresi', desc: 'Mekki • 7 Ayet', arabic: 'الفاتحة', action: () => handleSearch(1, 1) },
                                    { label: 'Yasin Suresi', desc: 'Mekki • 83 Ayet', arabic: 'يس', action: () => handleSearch(36, 1) },
                                    { label: 'Mülk Suresi', desc: 'Mekki • 30 Ayet', arabic: 'الملك', action: () => handleSearch(67, 1) },
                                    { label: 'Rahman Suresi', desc: 'Medine • 78 Ayet', arabic: 'الرحمن', action: () => handleSearch(55, 1) },
                                    { label: 'Ayetel Kürsi', desc: 'Bakara Suresi • 255. Ayet', arabic: 'آية الكرسي', action: () => handleSearch(2, 255) },
                                    { label: 'Amenerrasulü', desc: 'Bakara Suresi • Son 2 Ayet', arabic: 'آمن الرسول', action: () => handleSearch(2, 285) },
                                    { label: 'İhlas Suresi', desc: 'Mekki • 4 Ayet', arabic: 'الإخلاص', action: () => handleSearch(112, 1) },
                                    { label: 'Felak Suresi', desc: 'Medine • 5 Ayet', arabic: 'الفلق', action: () => handleSearch(113, 1) },
                                    { label: 'Nas Suresi', desc: 'Medine • 6 Ayet', arabic: 'الناس', action: () => handleSearch(114, 1) },
                                ].map((item, index) => (
                                    <button
                                        key={index}
                                        onClick={item.action}
                                        className="group relative flex flex-col items-start p-6 rounded-3xl bg-white/40 dark:bg-slate-800/40 border border-white/20 dark:border-white/5 hover:bg-white/60 dark:hover:bg-slate-800/60 transition-all duration-300 backdrop-blur-sm text-left hover:scale-[1.02] hover:shadow-xl hover:shadow-emerald-900/10 hover:border-emerald-500/30 overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                            <span className="text-6xl font-arabic text-emerald-900 dark:text-emerald-100">{item.arabic}</span>
                                        </div>

                                        <div className="relative z-10 w-full">
                                            <div className="w-10 h-10 mb-4 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/50 dark:to-teal-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-500 shadow-sm">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                </svg>
                                            </div>

                                            <h3 className="text-lg font-bold text-slate-800 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                                {item.label}
                                            </h3>
                                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wider opacity-80 decoration-emerald-500/30">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </button>
                                ))}
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
                <footer className="mt-12 py-8 bg-white/50 dark:bg-[#0f172a] border-t border-gray-200 dark:border-emerald-900/30 relative overflow-hidden backdrop-blur-sm">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-[0.03] dark:opacity-[0.05]"></div>
                    <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="text-center md:text-left">
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1 flex items-center justify-center md:justify-start gap-2">
                                    <Logo className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
                                    Kur'an Anlam Haritası
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
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
