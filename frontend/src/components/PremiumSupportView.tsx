import { useState, useEffect } from 'react';
import { hapticFeedback } from '../lib/constants';
import { Heart, BookOpen, Star } from 'lucide-react';


interface PremiumSupportViewProps {
    onClose: () => void;
}

export function PremiumSupportView({ onClose }: PremiumSupportViewProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [selectedTab, setSelectedTab] = useState<'premium' | 'support'>('premium');
    const [selectedDonation, setSelectedDonation] = useState<number | null>(null);
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

    useEffect(() => {
        // Mount transition
        requestAnimationFrame(() => requestAnimationFrame(() => setIsVisible(true)));
    }, []);

    const handleClose = () => {
        hapticFeedback(10);
        setIsVisible(false);
        setTimeout(onClose, 500);
    };

    const handleAction = (action: string) => {
        hapticFeedback(50);
        alert(`Bu aşamada ${action} işlemi mağaza (App Store/Play Store) entegrasyonu tamamlandığında aktif olacaktır.`);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden font-sans">
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-md transition-opacity duration-500 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                onClick={handleClose}
            ></div>

            {/* Modal */}
            <div
                className={`relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-white dark:bg-[#0A101D] border border-slate-200/50 dark:border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden transition-all duration-500 ease-out transform ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'}`}
            >
                {/* Header Decoration */}
                <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950/30 dark:to-transparent pointer-events-none">
                    <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] mix-blend-overlay"></div>
                </div>

                {/* Top Bar */}
                <div className="relative z-10 flex justify-between items-center p-6 pb-2">
                    <button
                        onClick={handleClose}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100/50 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>

                    <div className="flex bg-slate-100/80 dark:bg-white/5 p-1 rounded-full shadow-inner">
                        <button
                            onClick={() => { hapticFeedback(10); setSelectedTab('premium'); }}
                            className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${selectedTab === 'premium' ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                        >
                            Premium
                        </button>
                        <button
                            onClick={() => { hapticFeedback(10); setSelectedTab('support'); }}
                            className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${selectedTab === 'support' ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                        >
                            Destek Ol
                        </button>
                    </div>
                    <div className="w-10"></div> {/* Spacer for center alignment */}
                </div>

                {/* Content */}
                <div className="relative z-10 flex-1 overflow-y-auto custom-scrollbar p-6 pt-4">

                    {/* PREMIUM TAB */}
                    <div className={`transition-all duration-500 pb-2 ${selectedTab === 'premium' ? 'opacity-100 block' : 'opacity-0 hidden'}`}>

                        {/* Toggle Switch */}
                        <div className="flex justify-center mb-6">
                            <div className="bg-slate-100 dark:bg-[#1A1D21] p-1 rounded-full flex border border-slate-200 dark:border-white/5 relative shadow-inner">
                                <button
                                    onClick={() => { hapticFeedback(10); setBillingCycle('annual'); }}
                                    className={`relative z-10 px-6 py-2 rounded-full text-[13px] font-bold transition-colors duration-300 ${billingCycle === 'annual' ? 'text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                                >
                                    Yıllık
                                </button>
                                <button
                                    onClick={() => { hapticFeedback(10); setBillingCycle('monthly'); }}
                                    className={`relative z-10 px-6 py-2 rounded-full text-[13px] font-bold transition-colors duration-300 ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                                >
                                    Aylık
                                </button>
                                <div className={`absolute top-1 bottom-1 w-1/2 bg-slate-800 dark:bg-[#333333] rounded-full transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] shadow-sm ${billingCycle === 'monthly' ? 'translate-x-full' : 'translate-x-0'}`}></div>
                            </div>
                        </div>

                        {/* Main Subscription Card */}
                        <div className={`rounded-[2rem] p-6 sm:p-7 relative transition-all duration-500 overflow-hidden ${billingCycle === 'annual' ? 'bg-[#121212] border-2 border-emerald-500 shadow-xl dark:border-[#D4FF4D] dark:shadow-[0_0_40px_rgba(212,255,77,0.15)]' : 'bg-white dark:bg-[#1A1A1A] border-2 border-slate-200 dark:border-white/5 shadow-xl'}`}>

                            {/* Decorative Glow for Annual */}
                            {billingCycle === 'annual' && (
                                <div className="absolute top-0 right-0 w-48 h-48 bg-[#D4FF4D]/10 rounded-full blur-[60px] pointer-events-none"></div>
                            )}

                            {/* Card Header & Badge */}
                            <div className="flex flex-row justify-between items-start mb-6 relative z-10 w-full gap-2">
                                <div className="flex-1">
                                    <h3 className={`text-[20px] sm:text-[24px] font-bold mb-1.5 leading-none ${billingCycle === 'annual' ? 'text-white' : 'text-slate-900 dark:text-white'}`}>Quran Premium</h3>
                                    <p className={`text-[12px] sm:text-[13px] leading-tight ${billingCycle === 'annual' ? 'text-[#A0A0A0]' : 'text-slate-500 dark:text-[#A0A0A0]'}`}>Manevi araçlarla ibadetini zirveye taşı.</p>
                                </div>
                                <div className={`transition-opacity duration-300 self-start shrink-0 ${billingCycle === 'annual' ? 'opacity-100' : 'opacity-0'}`}>
                                    <span className="bg-emerald-500 dark:bg-[#D4FF4D] text-white dark:text-[#121212] text-[9.5px] sm:text-[11px] font-black px-3 py-1.5 sm:px-4 sm:py-2 rounded-full uppercase tracking-widest whitespace-nowrap shadow-sm">
                                        %30 İndirim
                                    </span>
                                </div>
                            </div>

                            {/* Pricing */}
                            <div className="mb-8 relative z-10 flex flex-col items-start">
                                <div className="flex items-baseline gap-2.5">
                                    {billingCycle === 'annual' ? (
                                        <>
                                            <span className="text-[26px] text-gray-500 line-through decoration-gray-500 font-medium tracking-tight">₺719</span>
                                            <span className="text-[46px] font-black text-emerald-400 dark:text-[#D4FF4D] tracking-tighter leading-none">₺419<span className="text-2xl font-bold">.99</span></span>
                                        </>
                                    ) : (
                                        <span className={`text-[46px] font-black tracking-tighter leading-none text-slate-900 dark:text-white`}>₺59<span className="text-2xl font-bold">.99</span></span>
                                    )}
                                </div>
                                <p className={`text-[13px] mt-1.5 font-medium ${billingCycle === 'annual' ? 'text-[#A0A0A0]' : 'text-slate-500 dark:text-[#A0A0A0]'}`}>
                                    {billingCycle === 'annual' ? '/ yıl (Aylık sadece ₺34.99)' : '/ ay'}
                                </p>
                            </div>

                            {/* Features List */}
                            <div className="space-y-4.5 mb-8 relative z-10 flex flex-col gap-4">
                                {[
                                    "Reklamsız tamamen saf bir deneyim",
                                    "Gelişmiş Odak Modu ve ses manzaraları",
                                    "Bulut yedekleme (Hatimler ve geçmiş)",
                                    "15 farklı hafızın tüm kıraatlerine erişim",
                                    "Özel zikirmatik hedefleri ve istatistik"
                                ].map((feature, idx) => (
                                    <div key={idx} className="flex items-center gap-3.5">
                                        <div className={`w-[22px] h-[22px] rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${billingCycle === 'annual' ? 'bg-[#D4FF4D]' : 'bg-slate-100 dark:bg-[#333333]'}`}>
                                            <svg className={`w-3.5 h-3.5 ${billingCycle === 'annual' ? 'text-[#121212]' : 'text-slate-700 dark:text-white'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        </div>
                                        <span className={`text-[13px] font-medium ${billingCycle === 'annual' ? 'text-[#E0E0E0]' : 'text-slate-700 dark:text-[#E0E0E0]'}`}>{feature}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Action Button */}
                            <button
                                onClick={() => handleAction(billingCycle === 'annual' ? 'Premium Yıllık Abonelik' : 'Premium Aylık Abonelik')}
                                className={`relative z-10 w-full py-4 rounded-full font-bold text-[15px] transition-all duration-300 active:scale-95 shadow-lg ${billingCycle === 'annual' ? 'bg-white text-[#121212] hover:bg-gray-200' : 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-[#333333] dark:hover:bg-[#444444]'}`}
                            >
                                Aboneliği Başlat
                            </button>
                        </div>

                    </div>

                    {/* SUPPORT TAB */}
                    <div className={`transition-all duration-500 pb-10 ${selectedTab === 'support' ? 'opacity-100 block' : 'opacity-0 hidden'}`}>
                        {/* Dribbble Style Charity List Container */}
                        <div className="bg-[#F6F8F9] dark:bg-slate-900/50 rounded-[32px] p-4 sm:p-5">
                            <div className="flex justify-between items-baseline mb-5 px-1 mt-2">
                                <h3 className="text-[20px] font-bold text-slate-900 dark:text-white tracking-tight">Destek Paketi Seç</h3>
                                <button className="text-[13px] font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-700">Tümü</button>
                            </div>

                            <div className="flex flex-col gap-3 relative z-10">
                                {[
                                    {
                                        id: 50,
                                        icon: <Heart strokeWidth={1.5} />, label: 'Destekçi', price: '₺50',
                                        desc: 'Uygulamanın kahve masraflarına ufak bir destek.',
                                        iconColor: 'text-[#C59B4B] dark:text-[#E2B764]',
                                    },
                                    {
                                        id: 150,
                                        icon: <BookOpen strokeWidth={1.5} />, label: 'Gönül Dostu', price: '₺150',
                                        desc: 'Sunucu giderleri için düzenli bir adım.',
                                        iconColor: 'text-[#3E8B75] dark:text-[#52B498]',
                                    },
                                    {
                                        id: 500,
                                        icon: <Star strokeWidth={1.5} />, label: 'Hayır Sahibi', price: '₺500',
                                        desc: 'Projenin büyümesine sadaka-i cariye niyetiyle katkı.',
                                        iconColor: 'text-[#6B5A8E] dark:text-[#8870B8]',
                                    }
                                ].map((item) => {
                                    const isSelected = selectedDonation === item.id;
                                    const isOtherSelected = selectedDonation !== null && selectedDonation !== item.id;

                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => {
                                                hapticFeedback(10);
                                                setSelectedDonation(item.id);
                                            }}
                                            className={`relative flex items-center p-4 rounded-[28px] transition-all duration-300 text-left w-full border border-transparent
                                                ${isSelected
                                                    ? 'bg-emerald-50/50 border-emerald-500/30 dark:bg-slate-800 dark:border-emerald-500/40 shadow-sm z-20 scale-[1.01]'
                                                    : 'bg-white hover:border-slate-200 shadow-[0_4px_20px_rgb(0,0,0,0.03)] dark:bg-[#1E2530] dark:hover:border-white/10 dark:shadow-none'}
                                                ${isOtherSelected ? 'opacity-50 scale-[0.99]' : ''}
                                            `}
                                        >
                                            <div className={`flex items-center justify-center w-[52px] h-[52px] rounded-full mr-4 flex-shrink-0 transition-all duration-300 border border-slate-100 dark:border-white/5 shadow-sm bg-white dark:bg-[#252D3A] ${item.iconColor} ${isSelected ? 'scale-110 shadow-md' : 'group-hover:scale-105'}`}>
                                                <div className="transform scale-[0.90]">{item.icon}</div>
                                            </div>

                                            <div className="flex-1 pr-2">
                                                <h4 className={`text-[16px] font-bold mb-0.5 tracking-tight ${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-900 dark:text-white'}`}>{item.label}</h4>
                                                <p className="text-[12.5px] text-slate-500 dark:text-slate-400 leading-snug pr-2">{item.desc}</p>
                                            </div>

                                            <div className="text-right pl-2 shrink-0">
                                                <span className={`text-[18px] font-bold tracking-tight ${isSelected ? 'text-emerald-600 dark:text-white' : 'text-slate-900 dark:text-white'}`}>{item.price}</span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Continue Button (Slide up when selected) */}
                        <div className={`transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] overflow-hidden ${selectedDonation ? 'max-h-24 opacity-100 mt-6' : 'max-h-0 opacity-0 mt-0 pointer-events-none'}`}>
                            <button
                                onClick={() => handleAction(`Destek: ₺${selectedDonation}`)}
                                className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 active:scale-95 group"
                            >
                                Destek Ol ve Devam Et
                            </button>
                        </div>

                        {/* Different Amount Button */}
                        <button
                            onClick={() => {
                                setSelectedDonation(null);
                                handleAction('Özel Tutar');
                            }}
                            className={`mt-6 group relative w-full overflow-hidden py-4 rounded-3xl font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-all shadow-sm active:scale-[0.98]
                                ${selectedDonation ? 'hidden' : 'block'}
                            `}
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                Dilediğin Miktarı Destekle
                            </span>
                        </button>

                        {/* Psychological Safety Area & Quote */}
                        <div className="mt-8 text-center space-y-4">
                            <p className="text-[12px] italic font-serif text-slate-500 dark:text-slate-400">
                                "Kim bir iyiliğe vesile olursa, ona da onun sevabı vardır."
                            </p>

                            <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                                <span className="flex items-center gap-1">Güvenli ödeme</span>
                                <span className="flex items-center gap-1">Sunucu giderleri</span>
                                <span className="flex items-center gap-1">Şeffaf kullanım</span>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}
