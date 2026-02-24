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
import { AyetContextSection } from './components/AyetContextSection';
import { PrayerTimesCard } from './components/spiritual/PrayerTimesCard';
import { QiblaCompass } from './components/spiritual/QiblaCompass';
import { EsmaulHusnaView } from './components/spiritual/EsmaulHusnaView';
import { MosqueFinder } from './components/spiritual/MosqueFinder';
import { PrayerDebtTracker } from './components/spiritual/PrayerDebtTracker';
import { ReligiousDaysView } from './components/spiritual/ReligiousDaysView';
import { ZikirmatikView } from './components/spiritual/ZikirmatikView';
import { ReligiousDayAlert } from './components/spiritual/ReligiousDayAlert';
import { NotificationManager } from './components/spiritual/NotificationManager';
import { RamadanCountdown } from './components/spiritual/RamadanCountdown';
import { KabeLiveStream } from './components/spiritual/KabeLiveStream';
import { ManeviAkisView } from './components/spiritual/ManeviAkisView';
import { NamazAsistaniView } from './components/spiritual/NamazAsistaniView';
import { RamadanOzelView } from './components/spiritual/RamadanOzelView';
import { HatimTakipView } from './components/spiritual/HatimTakipView';
import { DuaDefteriView } from './components/spiritual/DuaDefteriView';
import { KuranDinlemeView } from './components/spiritual/KuranDinlemeView';
import { SessizZikirView } from './components/spiritual/SessizZikirView';
import { IstatistikPaneliView } from './components/spiritual/IstatistikPaneliView';
import { BottomTabBar } from './components/BottomTabBar';
import { PullToRefresh } from './components/PullToRefresh';

const queryClient = new QueryClient();

function AppContent() {
    const [showSplash, setShowSplash] = useState(true);
    const [isDark, setIsDark] = useState(true);
    const [searchParams, setSearchParams] = useState<{ sure: number; ayet: number } | null>(null);
    const [selectedNode, setSelectedNode] = useState<any>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showQibla, setShowQibla] = useState(false);
    const [showEsmaulHusna, setShowEsmaulHusna] = useState(false);
    const [showMosqueFinder, setShowMosqueFinder] = useState(false);
    const [showPrayerDebt, setShowPrayerDebt] = useState(false);
    const [showReligiousDays, setShowReligiousDays] = useState(false);
    const [showZikirmatik, setShowZikirmatik] = useState(false);
    const [showKabeLive, setShowKabeLive] = useState(false);
    const [showManeviAkis, setShowManeviAkis] = useState(false);
    const [showNamazAsistani, setShowNamazAsistani] = useState(false);
    const [showRamadanOzel, setShowRamadanOzel] = useState(false);
    const [showHatimTakip, setShowHatimTakip] = useState(false);
    const [showDuaDefteri, setShowDuaDefteri] = useState(false);
    const [showKuranDinleme, setShowKuranDinleme] = useState(false);
    const [showSessizZikir, setShowSessizZikir] = useState(false);
    const [showIstatistik, setShowIstatistik] = useState(false);

    const { isMobile } = useResponsive();

    // Initialize dark mode on mount
    useEffect(() => {
        document.documentElement.classList.add('dark');
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
            <div className="min-h-screen bg-theme-bg text-theme-text transition-colors duration-500 animate-fadeIn relative overflow-x-hidden">
                {/* Islamic Pattern Overlay - Subtle Texture */}
                <div className="fixed inset-0 opacity-[0.03] pointer-events-none islamic-pattern mix-blend-overlay"></div>

                {/* Notifications */}
                <NotificationManager />

                {/* Header */}
                <header className="sticky top-0 z-40 bg-theme-bg/80 backdrop-blur-md border-b border-theme-border/50 transition-all duration-300 supports-[backdrop-filter]:bg-theme-bg/60">
                    <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-5 relative">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3 md:gap-4">
                                {/* Menu Button */}
                                <button
                                    onClick={() => setIsMenuOpen(true)}
                                    className="p-2.5 rounded-xl hover:bg-theme-surface text-theme-text transition-all duration-300 hover:scale-110 active:scale-95 hover:shadow-lg hover:shadow-emerald-500/10 group border border-transparent hover:border-theme-border/50"
                                    aria-label="Menü"
                                >
                                    <div className="w-6 h-5 flex flex-col justify-between group-hover:h-6 transition-all duration-300">
                                        <span className="w-full h-0.5 bg-current rounded-full origin-left transition-all duration-300 group-hover:rotate-6 group-hover:translate-x-0.5"></span>
                                        <span className="w-3/4 h-0.5 bg-current rounded-full transition-all duration-300 group-hover:w-full"></span>
                                        <span className="w-1/2 h-0.5 bg-current rounded-full origin-left transition-all duration-300 group-hover:w-full group-hover:-rotate-6 group-hover:translate-x-0.5"></span>
                                    </div>
                                </button>

                                <div>
                                    <div className="flex items-center gap-2">
                                        {/* Dynamic Navigation Title or Logo */}
                                        {searchParams ? (
                                            <button
                                                onClick={() => {
                                                    setSearchParams(null);
                                                    setSelectedNode(null);
                                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                                }}
                                                className="p-2 -ml-2 rounded-full text-slate-500 hover:text-theme-text hover:bg-theme-surface transition-all active:scale-90 animate-fadeIn"
                                                aria-label="Geri Dön"
                                            >
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                            </button>
                                        ) : (
                                            <div className="flex items-center gap-2 px-2">
                                                {/* Logo Removed as per request */}
                                                <span className="text-sm font-bold tracking-wide hidden sm:inline-block">KUR'AN REHBERİ</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={toggleDarkMode}
                                className="p-2 rounded-full hover:bg-theme-surface transition-colors text-theme-text"
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

                <PullToRefresh onRefresh={async () => {
                    // Simulate network reload or trigger refetch
                    await queryClient.invalidateQueries();
                    await new Promise(resolve => setTimeout(resolve, 800)); // Aesthetic delay
                }}>
                    <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 relative min-h-[calc(100vh-200px)] pb-24 sm:pb-8">
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
                            <div className="mt-8 p-4 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-xl text-center">
                                Bir hata oluştu. Lütfen daha sonra tekrar deneyin.
                            </div>
                        )}

                        {isLoading ? (
                            <div className="flex justify-center mt-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
                            </div>
                        ) : searchParams ? (
                            <div className="mt-8 transition-opacity duration-500 animate-fadeIn">
                                {/* Main Ayet Card & Content Wrapper with Key for Re-animation */}
                                {data?.center && (
                                    <div key={`main-${data.center.sure}-${data.center.ayet}`} className="animate-slideUp">
                                        <AyetCard
                                            sure={data.center.sure}
                                            ayet={data.center.ayet}
                                            arabicText={data.center.arabic}
                                            turkishText={data.center.text}
                                            isMain={true}
                                        />
                                        {/* Context & Notes Section (Visible on Mobile & Desktop Main View) */}
                                        <div className="mb-12 px-2 md:px-0 opacity-0 animate-slideUp" style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}>
                                            <p className="text-sm font-bold text-theme-muted uppercase tracking-widest mb-4 flex items-center gap-2">
                                                <span className="w-8 h-px bg-theme-border"></span>
                                                Derinlik & Notlar
                                                <span className="w-full h-px bg-theme-border opacity-50"></span>
                                            </p>
                                            <AyetContextSection
                                                sure={data.center.sure}
                                                ayet={data.center.ayet}
                                                metadata={data.center.metadata}
                                                onNavigate={handleSearch}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Semantic Graph Visualization - Desktop Only */}
                                <div className="my-12 hidden md:block opacity-0 animate-slideUp" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
                                    <SemanticGraph
                                        nodes={graphData.nodes}
                                        edges={graphData.edges}
                                        onNodeClick={setSelectedNode}
                                    />
                                </div>

                                {/* Similar Ayets List */}
                                <div className="opacity-0 animate-slideUp" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
                                    <h3 className="text-xl font-bold text-theme-text mb-6 flex items-center gap-2">
                                        <span className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                            </svg>
                                        </span>
                                        İlgili Bağlantılar
                                    </h3>

                                    <div className="space-y-4">
                                        {data?.similar?.map((item: any, index: number) => (
                                            <div
                                                key={index}
                                                className="opacity-0 animate-slideUp"
                                                style={{ animationDelay: `${0.5 + (index * 0.1)}s`, animationFillMode: 'forwards' }}
                                            >
                                                <AyetCard
                                                    sure={item.sure}
                                                    ayet={item.ayet}
                                                    arabicText={item.arabic}
                                                    turkishText={item.text}
                                                    similarityScore={item.score}
                                                    onClick={() => handleSearch(item.sure, item.ayet)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-8 md:mt-20 px-4 max-w-5xl mx-auto">
                                {/* Dashboard Prayer Times */}
                                <div className="mb-12 max-w-2xl mx-auto">
                                    <ReligiousDayAlert onClick={() => setShowReligiousDays(true)} />
                                    <RamadanCountdown />
                                    <PrayerTimesCard onNavigate={handleSearch} />
                                </div>

                                <div className="mb-10 text-center relative">
                                    {/* Section heading */}
                                    <div className="inline-flex items-center gap-2 mb-3">
                                        <span className="w-8 h-px bg-gradient-to-r from-transparent to-emerald-400/50"></span>
                                        <p className="text-[10px] font-black text-emerald-500 dark:text-emerald-400 uppercase tracking-[0.25em]">Manevi Yolculuk</p>
                                        <span className="w-8 h-px bg-gradient-to-l from-transparent to-emerald-400/50"></span>
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
                                        Önerilen Okumalar
                                    </h2>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base max-w-sm mx-auto">
                                        Sık okunan surelere ve ayetlere hızlıca ulaşın
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                                    {[
                                        { label: 'Fatiha Suresi', desc: 'Mekki • 7 Ayet', arabic: 'الفاتحة', action: () => handleSearch(1, 1) },
                                        { label: 'Yasin Suresi', desc: 'Mekki • 83 Ayet', arabic: 'يس', action: () => handleSearch(36, 1) },
                                        { label: 'Mülk Suresi', desc: 'Mekki • 30 Ayet', arabic: 'الملك', action: () => handleSearch(67, 1) },
                                        { label: 'Rahman Suresi', desc: 'Medine • 78 Ayet', arabic: 'الرحمن', action: () => handleSearch(55, 1) },
                                        { label: 'Ayetel Kürsi', desc: 'Bakara • 255. Ayet', arabic: 'آية الكرسي', action: () => handleSearch(2, 255) },
                                        { label: 'Amenerrasulü', desc: 'Bakara • Son 2 Ayet', arabic: 'آمن الرسول', action: () => handleSearch(2, 285) },
                                        { label: 'İhlas Suresi', desc: 'Mekki • 4 Ayet', arabic: 'الإخلاص', action: () => handleSearch(112, 1) },
                                        { label: 'Felak Suresi', desc: 'Medine • 5 Ayet', arabic: 'الفلق', action: () => handleSearch(113, 1) },
                                        { label: 'Nas Suresi', desc: 'Medine • 6 Ayet', arabic: 'الناس', action: () => handleSearch(114, 1) },
                                    ].map((item, index) => (
                                        <button
                                            key={index}
                                            onClick={item.action}
                                            className="group relative flex flex-col items-start p-5 md:p-6 rounded-[1.5rem]
                                            bg-white dark:bg-[#141f35]
                                            border border-slate-200/60 dark:border-white/[0.08]
                                            shadow-md shadow-slate-200/40 dark:shadow-none
                                            hover:border-emerald-300 dark:hover:border-emerald-500/40
                                            hover:shadow-xl hover:shadow-emerald-500/15 dark:hover:shadow-emerald-900/40
                                            text-left overflow-hidden active:scale-[0.98]"
                                            style={{ transition: 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s, border-color 0.25s' }}
                                        >
                                            {/* Ambient emerald glow behind arabic — shown on hover */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/[0.04] group-hover:to-emerald-400/[0.04] transition-all duration-500 pointer-events-none" />

                                            {/* Arabic watermark — grows & brightens on hover */}
                                            <div
                                                dir="rtl"
                                                className="absolute -bottom-2 right-1 font-arabic leading-none select-none pointer-events-none
                                                text-[5rem] text-slate-200/60 dark:text-emerald-400/[0.07]
                                                group-hover:text-emerald-400/30 dark:group-hover:text-emerald-400/25
                                                group-hover:scale-110 group-hover:-translate-y-1
                                                transition-all duration-500 ease-out"
                                            >
                                                {item.arabic}
                                            </div>

                                            {/* Shimmer sweep */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/[0.06] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />

                                            {/* Icon — always emerald */}
                                            <div className="relative z-10 w-11 h-11 mb-4 rounded-2xl
                                            bg-emerald-50 dark:bg-emerald-500/10
                                            border border-emerald-100 dark:border-emerald-500/20
                                            text-emerald-600 dark:text-emerald-400
                                            flex items-center justify-center
                                            group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-emerald-500/20
                                            transition-all duration-300"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                </svg>
                                            </div>

                                            <h3 className="relative z-10 text-[1rem] font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-300 mb-1.5 leading-tight transition-colors duration-200">
                                                {item.label}
                                            </h3>
                                            <p className="relative z-10 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                                                {item.desc}
                                            </p>
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
                            onNavigate={handleSearch}
                        />
                    )}

                    {/* Footer */}
                    <footer className="mt-16 relative overflow-hidden">
                        {/* Top gradient divider */}
                        <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

                        {/* Main footer body */}
                        <div className="relative py-10 px-6
                        bg-gradient-to-b from-slate-50/80 to-white
                        dark:from-[#060e18] dark:to-[#0a1524]">

                            {/* Arabesque pattern overlay */}
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-[0.03] dark:opacity-[0.05] pointer-events-none" />

                            {/* Radial glow behind logo */}
                            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-48 h-32 rounded-full pointer-events-none
                            bg-emerald-400/[0.08] dark:bg-emerald-500/[0.06] blur-3xl" />

                            <div className="max-w-sm mx-auto relative z-10 text-center">
                                {/* Logo + Title */}
                                <div className="flex flex-col items-center gap-2 mb-4">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center
                                    bg-emerald-100 dark:bg-emerald-500/[0.12]
                                    border border-emerald-200 dark:border-emerald-500/25
                                    shadow-sm shadow-emerald-200/30 dark:shadow-none
                                    mb-1">
                                        <Logo className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <h3 className="text-[13px] font-bold tracking-[0.15em] uppercase
                                    text-slate-700 dark:text-slate-200">
                                        Kur'an Anlam Haritası
                                    </h3>
                                    <p className="text-[10px] font-medium max-w-[16rem] leading-relaxed
                                    text-slate-400 dark:text-slate-500">
                                        Resmî Mealler &amp; Anlamsal Haritalama Teknolojisi
                                    </p>
                                </div>

                                {/* Ornamental divider */}
                                <div className="flex items-center justify-center gap-2 my-5">
                                    <div className="w-8 h-px bg-gradient-to-r from-transparent to-emerald-400/40" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/30 dark:bg-emerald-400/25" />
                                    <div className="w-8 h-px bg-gradient-to-l from-transparent to-emerald-400/40" />
                                </div>

                                {/* Developer credit */}
                                <div className="flex flex-col items-center gap-1.5">
                                    <span className="text-[8px] tracking-[0.3em] font-bold uppercase
                                    text-slate-400/70 dark:text-slate-600">
                                        Geliştirici
                                    </span>
                                    <span className="text-sm font-bold tracking-[0.08em] font-serif
                                    text-emerald-600 dark:text-emerald-400
                                    hover:text-emerald-500 dark:hover:text-emerald-300
                                    transition-colors cursor-default">
                                        gucluyumhe
                                    </span>
                                </div>

                                {/* Version & year */}
                                <div className="mt-6 text-[9px] font-mono tracking-wider
                                text-slate-300 dark:text-slate-700">
                                    v2.0 · 2026
                                </div>
                            </div>
                        </div>
                    </footer>
                </PullToRefresh>
            </div>

            {/* Bottom Tab Bar (Mobile Only) - Liquid Glassmorphism Edition */}
            <BottomTabBar
                activeTab={showQibla ? 'qibla' : showZikirmatik ? 'zikirmatik' : isMenuOpen ? 'discover' : 'home'}
                onHomeClick={() => {
                    setSearchParams(null);
                    setSelectedNode(null);
                    setIsMenuOpen(false);
                    setShowQibla(false);
                    setShowZikirmatik(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onDiscoverClick={() => {
                    setShowQibla(false);
                    setShowZikirmatik(false);
                    setIsMenuOpen(true);
                }}
                onZikirmatikClick={() => {
                    setIsMenuOpen(false);
                    setShowQibla(false);
                    setShowZikirmatik(true);
                }}
                onQiblaClick={() => {
                    setIsMenuOpen(false);
                    setShowZikirmatik(false);
                    setShowQibla(true);
                }}
                onThemeToggle={toggleDarkMode}
                isDark={isDark}
            />

            {/* Menu Drawer */}
            <MenuDrawer
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                onNavigate={handleSearch}
                onOpenQibla={() => { setIsMenuOpen(false); setShowQibla(true); }}
                onOpenEsmaulHusna={() => { setIsMenuOpen(false); setShowEsmaulHusna(true); }}
                onOpenMosqueFinder={() => { setIsMenuOpen(false); setShowMosqueFinder(true); }}
                onOpenPrayerDebt={() => { setIsMenuOpen(false); setShowPrayerDebt(true); }}
                onOpenReligiousDays={() => { setIsMenuOpen(false); setShowReligiousDays(true); }}
                onOpenZikirmatik={() => { setIsMenuOpen(false); setShowZikirmatik(true); }}
                onOpenKabeLive={() => { setIsMenuOpen(false); setShowKabeLive(true); }}
                onOpenManeviAkis={() => { setIsMenuOpen(false); setShowManeviAkis(true); }}
                onOpenNamazAsistani={() => { setIsMenuOpen(false); setShowNamazAsistani(true); }}
                onOpenRamadanKarti={() => { setIsMenuOpen(false); setShowRamadanOzel(true); }}
                onOpenHatimTakip={() => { setIsMenuOpen(false); setShowHatimTakip(true); }}
                onOpenDuaDefteri={() => { setIsMenuOpen(false); setShowDuaDefteri(true); }}
                onOpenKuranDinleme={() => { setIsMenuOpen(false); setShowKuranDinleme(true); }}
                onOpenSessizZikir={() => { setIsMenuOpen(false); setShowSessizZikir(true); }}
                onOpenIstatistik={() => { setIsMenuOpen(false); setShowIstatistik(true); }}
            />

            {/* Qibla Compass Overlay */}
            {showQibla && (
                <QiblaCompass onClose={() => setShowQibla(false)} />
            )}

            {/* Esmaül Hüsna Overlay */}
            {showEsmaulHusna && (
                <EsmaulHusnaView onClose={() => setShowEsmaulHusna(false)} />
            )}

            {/* Mosque Finder Overlay */}
            {showMosqueFinder && (
                <MosqueFinder onClose={() => setShowMosqueFinder(false)} />
            )}

            {/* Prayer Debt Tracker Overlay */}
            {showPrayerDebt && (
                <PrayerDebtTracker onClose={() => setShowPrayerDebt(false)} />
            )}

            {/* Religious Days Overlay */}
            {showReligiousDays && (
                <ReligiousDaysView onClose={() => setShowReligiousDays(false)} />
            )}

            {/* Zikirmatik Overlay */}
            {showZikirmatik && (
                <ZikirmatikView onClose={() => setShowZikirmatik(false)} />
            )}

            {/* Kabe Canlı Yayın Overlay */}
            {showKabeLive && (
                <KabeLiveStream onClose={() => setShowKabeLive(false)} />
            )}

            {/* Manevi Akış Overlay */}
            {showManeviAkis && (
                <ManeviAkisView onClose={() => setShowManeviAkis(false)} />
            )}

            {/* Namaz Asistanı Overlay */}
            {showNamazAsistani && (
                <NamazAsistaniView onClose={() => setShowNamazAsistani(false)} />
            )}

            {/* Ramazan Özel Overlay */}
            {showRamadanOzel && (
                <RamadanOzelView onClose={() => setShowRamadanOzel(false)} />
            )}

            {/* Hatim Takip Overlay */}
            {showHatimTakip && (
                <HatimTakipView onClose={() => setShowHatimTakip(false)} />
            )}

            {/* Dua Defteri Overlay */}
            {showDuaDefteri && (
                <DuaDefteriView onClose={() => setShowDuaDefteri(false)} />
            )}

            {/* Kuran Dinleme Overlay */}
            {showKuranDinleme && (
                <KuranDinlemeView onClose={() => setShowKuranDinleme(false)} />
            )}

            {/* Sessiz Zikir Overlay */}
            {showSessizZikir && (
                <SessizZikirView onClose={() => setShowSessizZikir(false)} />
            )}

            {/* İstatistik Paneli Overlay */}
            {showIstatistik && (
                <IstatistikPaneliView onClose={() => setShowIstatistik(false)} />
            )}
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
