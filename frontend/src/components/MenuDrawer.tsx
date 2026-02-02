import { useState } from 'react';
import { SURAHS } from '../lib/constants';

interface MenuDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onNavigate: (sure: number, ayet: number) => void;
}

export function MenuDrawer({ isOpen, onClose, onNavigate }: MenuDrawerProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [showPopular, setShowPopular] = useState(true);

    const popularAyets = [
        { sure: 2, ayet: 255, name: 'Ayetel Kürsi' },
        { sure: 1, ayet: 1, name: 'Fatiha Suresi' },
        { sure: 112, ayet: 1, name: 'İhlas Suresi' },
        { sure: 113, ayet: 1, name: 'Felak Suresi' },
        { sure: 114, ayet: 1, name: 'Nas Suresi' },
        { sure: 36, ayet: 1, name: 'Yasin Suresi' },
        { sure: 67, ayet: 1, name: 'Mülk Suresi' },
        { sure: 55, ayet: 1, name: 'Rahman Suresi' },
    ];

    // Turkish-aware toLowerCase for proper search
    const turkishLower = (text: string) => {
        return text
            .replace(/İ/g, 'i')
            .replace(/I/g, 'ı')
            .toLowerCase();
    };

    // Smart search with Turkish character support
    const filteredSurahs = searchTerm.trim()
        ? SURAHS.filter((s) => {
            const search = turkishLower(searchTerm.trim());
            const turkishName = turkishLower(s.turkish);
            const idMatch = s.id.toString() === searchTerm.trim();
            const arabicMatch = s.arabic.includes(searchTerm);

            return turkishName.includes(search) || idMatch || arabicMatch;
        })
        : SURAHS;

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fadeIn"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white dark:bg-slate-800 shadow-2xl z-50 animate-slideInLeft overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-800 dark:to-teal-800 p-6 shadow-lg z-10">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-white">Kur'an Menüsü</h2>
                        <button
                            onClick={onClose}
                            className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                            aria-label="Kapat"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Search */}
                    <input
                        type="text"
                        placeholder="Sure ara (ör: Bakara, 2)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Toggle Buttons */}
                    <div className="flex gap-2 mb-4">
                        <button
                            onClick={() => {
                                setShowPopular(true);
                                setSearchTerm('');
                            }}
                            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${showPopular
                                    ? 'bg-emerald-600 text-white shadow-lg scale-105'
                                    : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300'
                                }`}
                        >
                            Popüler
                        </button>
                        <button
                            onClick={() => setShowPopular(false)}
                            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${!showPopular
                                    ? 'bg-emerald-600 text-white shadow-lg scale-105'
                                    : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300'
                                }`}
                        >
                            Tüm Sureler
                        </button>
                    </div>

                    {showPopular ? (
                        <>
                            <h3 className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-4">
                                Popüler Ayetler
                            </h3>

                            <div className="space-y-3">
                                {popularAyets.map((item) => (
                                    <button
                                        key={`${item.sure}-${item.ayet}`}
                                        onClick={() => {
                                            onNavigate(item.sure, item.ayet);
                                            onClose();
                                        }}
                                        className="w-full text-left px-4 py-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 hover:from-emerald-100 hover:to-teal-100 dark:hover:from-emerald-800/30 dark:hover:to-teal-800/30 rounded-xl border border-emerald-200/50 dark:border-emerald-700/50 transition-all active:scale-95"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="font-bold text-gray-900 dark:text-white">
                                                    {item.name}
                                                </div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                    Sure {item.sure}, Ayet {item.ayet}
                                                </div>
                                            </div>
                                            <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </>
                    ) : (
                        <>
                            <h3 className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-4">
                                {searchTerm ? `${filteredSurahs.length} sonuç` : '114 Sure'}
                            </h3>

                            {filteredSurahs.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-gray-400 dark:text-gray-500 mb-2">
                                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400 font-medium">
                                        "{searchTerm}" için sonuç bulunamadı
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                        Sure adı veya numarası ile tekrar deneyin
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {filteredSurahs.map((surah) => (
                                        <button
                                            key={surah.id}
                                            onClick={() => {
                                                onNavigate(surah.id, 1);
                                                onClose();
                                            }}
                                            className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-emerald-50/30 dark:from-slate-700 dark:to-emerald-900/10 hover:from-emerald-100 hover:to-teal-100 dark:hover:from-emerald-800/20 dark:hover:to-teal-800/20 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all active:scale-95"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-emerald-600 dark:bg-emerald-700 text-white rounded-lg flex items-center justify-center text-xs font-bold">
                                                        {surah.id}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-gray-900 dark:text-white text-sm">
                                                            {surah.turkish}
                                                        </div>
                                                        <div className="text-[10px] text-gray-500 dark:text-gray-400">
                                                            {surah.ayetCount} ayet
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-sm font-arabic text-emerald-700 dark:text-emerald-400" dir="rtl">
                                                    {surah.arabic}
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
