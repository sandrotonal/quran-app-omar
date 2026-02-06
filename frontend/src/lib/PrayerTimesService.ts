
import { Coordinates, CalculationMethod, PrayerTimes } from 'adhan';

export interface PrayerTimeInfo {
    name: string;
    time: string; // HH:MM
    date: Date;
    isNext: boolean;
    context: string; // "Günün ilk ışıkları...", "Hesaplaşma vakti..."
}

export const PrayerTimesService = {
    // Default to Istanbul if no location
    defaultLocation: { lat: 41.0082, lng: 28.9784 },

    async getUserLocation(): Promise<{ lat: number, lng: number }> {
        // 1. Try Cache First (Instant Load)
        try {
            const cached = localStorage.getItem('userLocation');
            if (cached) {
                return JSON.parse(cached);
            }
        } catch (e) {
            console.error("Cache read error", e);
        }

        // 2. Fallback to API (Slow)
        return new Promise((resolve) => {
            if (!navigator.geolocation) {
                resolve(this.defaultLocation);
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const loc = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    localStorage.setItem('userLocation', JSON.stringify(loc)); // Save for next time
                    resolve(loc);
                },
                (error) => {
                    console.warn("Location access denied, distinct to default.", error);
                    resolve(this.defaultLocation);
                },
                { timeout: 5000, maximumAge: 60000 } // Add timeout options
            );
        });
    },

    getTimes(lat: number, lng: number, date: Date = new Date()): PrayerTimeInfo[] {
        const coordinates = new Coordinates(lat, lng);
        const params = CalculationMethod.Turkey();
        const prayerTimes = new PrayerTimes(coordinates, date, params);

        const now = new Date();
        const next = prayerTimes.nextPrayer(); // returns 'fajr', 'sunrise', etc.

        // Mapping to our Turkish UI & Context
        const times = [
            { id: 'fajr', name: 'İmsak', time: prayerTimes.fajr, context: "Günün başlangıcı, niyet vakti." },
            { id: 'sunrise', name: 'Güneş', time: prayerTimes.sunrise, context: "Aydınlığın yayılması." },
            { id: 'dhuhr', name: 'Öğle', time: prayerTimes.dhuhr, context: "Günün zirvesi, şükür vakti." },
            { id: 'asr', name: 'İkindi', time: prayerTimes.asr, context: "Zamanın akışı, asra yemin." },
            { id: 'maghrib', name: 'Akşam', time: prayerTimes.maghrib, context: "Günün hasadı, muhasebe." },
            { id: 'isha', name: 'Yatsı', time: prayerTimes.isha, context: "Huzur ve dinlenme." },
        ];

        return times.map(t => ({
            name: t.name,
            time: this.formatTime(t.time),
            date: t.time,
            isNext: next === t.id,
            context: t.context
        }));
    },

    formatTime(date: Date): string {
        return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    },

    // 4️⃣ Bildirim Sistemi (Notification API)
    async requestNotificationPermission(): Promise<boolean> {
        if (!("Notification" in window)) {
            console.log("This browser does not support desktop notification");
            return false;
        }

        if (Notification.permission === "granted") {
            return true;
        }

        if (Notification.permission !== "denied") {
            const permission = await Notification.requestPermission();
            return permission === "granted";
        }

        return false;
    },

    sendNotification(title: string, body: string) {
        if (Notification.permission === "granted") {
            new Notification(title, {
                body: body,
                icon: '/icon.png', // Assuming we have an icon
                silent: false,
            });
        }
    },

    // 3️⃣ Bağlamlı Ayet/Kavram Önerisi (Feature #3 from dene.md)
    getContextualSuggestion(prayerId: string): { topic: string; ayetLink?: string } {
        // Havuzda her vakit için birden fazla seçenek var (Random/Rotation)
        const suggestions: Record<string, { topic: string; ayetLink: string }[]> = {
            fajr: [
                { topic: 'Sabır, Niyet ve Yeni Bir Başlangıç', ayetLink: '94:1' }, // İnşirah
                { topic: 'Sabahın Aydınlığına Yemin Olsun', ayetLink: '89:1' }, // Fecr
                { topic: 'Rabbine Güven ve Yönel', ayetLink: '73:1' }, // Müzzemmil
            ],
            sunrise: [
                { topic: 'Güneşin Doğuşu ve Aydınlık', ayetLink: '93:1' }, // Duha
                { topic: 'Nefsini Arındıran Kurtulur', ayetLink: '91:1' }, // Şems
            ],
            dhuhr: [
                { topic: 'Hayatın Koşturmacasında Bir Mola', ayetLink: '62:9' },
                { topic: 'Namaz Müminler İçin Belirlidir', ayetLink: '4:103' },
            ],
            asr: [
                { topic: 'Zamanın Hızla Akışı ve Kıymeti', ayetLink: '103:1' }, // Asr
                { topic: 'Namazlara ve Orta Namaza Dikkat', ayetLink: '2:238' }, // Bakara (İkindi vurgusu)
            ],
            maghrib: [
                { topic: 'Günün Hasadı, Şükür ve Muhasebe', ayetLink: '14:7' }, // İbrahim
                { topic: 'Yarına Ne Hazırladın?', ayetLink: '59:18' }, // Haşr
                { topic: 'Mülk Allah\'ındır', ayetLink: '67:1' }, // Mülk
            ],
            isha: [
                { topic: 'Gecenin Sessizliği ve Huzur', ayetLink: '25:47' }, // Furkan
                { topic: 'Peygamberin Duası: Teslimiyet', ayetLink: '2:285' }, // Amenerrasulü
                { topic: 'Gece Kalkışı Daha Etkilidir', ayetLink: '73:6' },
            ],
            other: [
                { topic: 'Her An Allah\'ı Anmak', ayetLink: '13:28' },
                { topic: 'Sabır ve Namazla Yardım', ayetLink: '2:153' }
            ]
        };

        const list = suggestions[prayerId] || suggestions['other'];
        // Günlük/Anlık rastgele seçim (Basit random)
        const randomIndex = Math.floor(Math.random() * list.length);
        return list[randomIndex];
    }
};
