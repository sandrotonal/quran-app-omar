import { useEffect, useRef } from 'react';
import { PrayerTimesService } from '../../lib/PrayerTimesService';
import { PrayerDebtService, PrayerType } from '../../lib/PrayerDebtService';

// Map PrayerTimesService Names (Turkish) to PrayerDebtService Types
const PRAYER_MAP: Record<string, PrayerType> = {
    'İmsak': 'sabah',
    'Öğle': 'ogle',
    'İkindi': 'ikindi',
    'Akşam': 'aksam',
    'Yatsı': 'yatsi'
};

// Curated Daily Verses
const DAILY_VERSES = [
    { text: "Rabbin, kendisinden başkasına asla ibadet etmemenizi, anaya-babaya iyi davranmanızı kesin olarak emretti.", source: "İsra, 23" },
    { text: "Şüphesiz Allah, adaleti, iyilik yapmayı, yakınlara yardım etmeyi emreder.", source: "Nahl, 90" },
    { text: "Ey iman edenler! Sabır ve namazla (Allah'tan) yardım dileyin.", source: "Bakara, 153" },
    { text: "Kim zerre ağırlığınca bir hayır işlerse, onun mükâfatını görecektir.", source: "Zilzal, 7" },
    { text: "Kalpler ancak Allah'ı anmakla huzur bulur.", source: "Ra'd, 28" },
    { text: "Allah, sabredenlerle beraberdir.", source: "Bakara, 153" },
    { text: "Bilsin ki insan için kendi çalışmasından başka bir şey yoktur.", source: "Necm, 39" },
    { text: "O, hanginizin daha güzel amel yapacağını sınamak için ölümü ve hayatı yaratandır.", source: "Mülk, 2" }
];

export function NotificationManager() {
    const lastNotifiedTime = useRef<string>('');

    useEffect(() => {
        // Request permission on mount
        PrayerTimesService.requestNotificationPermission();

        const checkAndNotify = async () => {
            const now = new Date();
            // Format HH:MM
            const currentTime = now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

            // --- DAILY VERSE CHECK (at 10:00 AM) ---
            if (currentTime === '10:00') {
                const todayStr = now.toDateString();
                const lastDailyDate = localStorage.getItem('last_daily_verse_date');

                if (lastDailyDate !== todayStr) {
                    // Send Daily Verse
                    const randomVerse = DAILY_VERSES[Math.floor(Math.random() * DAILY_VERSES.length)];
                    PrayerTimesService.sendNotification(
                        "Günün Ayeti 🌿",
                        `"${randomVerse.text}" (${randomVerse.source})`
                    );
                    localStorage.setItem('last_daily_verse_date', todayStr);
                }
            }

            // Prevent double notification in the same minute
            if (lastNotifiedTime.current === currentTime) return;

            // Get location and times
            const loc = await PrayerTimesService.getUserLocation();
            const times = PrayerTimesService.getTimes(loc.lat, loc.lng, now);

            // Find if any prayer matches current time
            const currentPrayer = times.find(t => t.time === currentTime);

            if (currentPrayer) {
                lastNotifiedTime.current = currentTime; // Mark as notified

                let prayerName = currentPrayer.name;
                let title = prayerName;
                let body = currentPrayer.context; // Default context message

                // --- RAMADAN OVERRIDES ---
                if (prayerName === 'Akşam' && localStorage.getItem('ramadan_notif_iftar') === '1') {
                    title = 'İftar Vakti 🌙';
                    body = 'Allah orucunuzu kabul etsin. Hayırlı iftarlar!';
                } else if (prayerName === 'İmsak' && localStorage.getItem('ramadan_notif_sahur') === '1') {
                    title = 'İmsak Vakti 🌙';
                    body = 'Yeme-içme vakti sona erdi, niyet zamanı. Hayırlı ramazanlar!';
                } else {
                    // Check for Debt Integration (Only if not overridden by Ramadan context)
                    const debtType = PRAYER_MAP[prayerName];
                    if (debtType) {
                        const debts = PrayerDebtService.getDebts();
                        const debt = debts.find(d => d.type === debtType);

                        if (debt && debt.count > 0) {
                            body = `${prayerName} vakti girdi. ${debt.count} adet kaza borcunuz var. Bu vakti eda ederken niyet edebilirsiniz.`;
                        } else {
                            body = `${prayerName} vakti girdi. ${currentPrayer.context}`;
                        }
                    } else if (prayerName === 'Güneş') {
                        body = "Güneş doğdu. İşrak vakti yaklaşıyor.";
                    }
                }

                PrayerTimesService.sendNotification(
                    title,
                    body
                );
            }
        };

        // --- TEST METHOD EXPOSED TO WINDOW ---
        (window as any).testNotification = () => {
            PrayerTimesService.requestNotificationPermission().then(granted => {
                if (granted) {
                    PrayerTimesService.sendNotification('Test Bildirimi 🔔', 'Uygulama bildirimleriniz sorunsuz çalışıyor!');
                } else {
                    alert('Bildirim izni verilmemiş. Tarayıcı ayarlarından izinleri kontrol edin.');
                }
            });
        };

        // Check every 20 seconds to be precise enough but not spammy
        const intervalId = setInterval(checkAndNotify, 20000);

        // Initial check
        checkAndNotify();

        return () => clearInterval(intervalId);
    }, []);

    // Render nothing (headless component)
    return null;
}
