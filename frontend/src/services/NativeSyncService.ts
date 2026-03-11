import { Preferences } from '@capacitor/preferences';
import { Capacitor, registerPlugin } from '@capacitor/core';

// Custom Android Local Plugin (Tetikleyici)
const WidgetSyncPlugin = registerPlugin<any>('WidgetSyncPlugin');

/**
 * Android Native Widget ve Akıllı Saat (Wear OS) Senkronizasyon Servisi
 * Frontend'deki verileri (React state/Context) Android SharedPreferences'a yazar.
 * Android tarafında (Java/Kotlin) AppWidgetProvider bu verileri doğrudan okuyup kullanır.
 */
export const NativeSyncService = {

    // Kalan Namaz Vaktini (Countdown) Android'e gönderir (Örn: "01:25")
    syncPrayerCountdown: async (timeLeftString: string, nextPrayerName: string) => {
        try {
            await Preferences.set({ key: 'WIDGET_PRAYER_TIME_LEFT', value: timeLeftString });
            await Preferences.set({ key: 'WIDGET_NEXT_PRAYER_NAME', value: nextPrayerName });

            if (Capacitor.isNativePlatform()) {
                await WidgetSyncPlugin.updateWidget();
            }

            console.log('✅ Namaz Widget verisi Android\'e senkronize edildi:', timeLeftString, nextPrayerName);
        } catch (error) {
            console.error('Namaz senkronizasyon hatası:', error);
        }
    },

    // Zikirmatik verilerini Akıllı Saat ve Widget için senkronize eder
    syncZikirData: async (currentCount: number, goal: number, zikirName: string) => {
        try {
            await Preferences.set({ key: 'WIDGET_ZIKIR_COUNT', value: currentCount.toString() });
            await Preferences.set({ key: 'WIDGET_ZIKIR_GOAL', value: goal.toString() });
            await Preferences.set({ key: 'WIDGET_ZIKIR_NAME', value: zikirName });

            if (Capacitor.isNativePlatform()) {
                await WidgetSyncPlugin.updateWidget();
            }

            console.log('✅ Zikir Widget verisi Android\'e senkronize edildi:', currentCount, '/', goal);
        } catch (error) {
            console.error('Zikir senkronizasyon hatası:', error);
        }
    },

    // Günlük Ayet / Sure bilgisini Widget'a gönderir
    syncDailyQuran: async (sureName: string, ayetNo: number, content: string) => {
        try {
            await Preferences.set({ key: 'WIDGET_SURE_NAME', value: sureName });
            await Preferences.set({ key: 'WIDGET_AYET_NO', value: ayetNo.toString() });
            await Preferences.set({ key: 'WIDGET_AYET_CONTENT', value: content });

            if (Capacitor.isNativePlatform()) {
                await WidgetSyncPlugin.updateWidget();
            }
        } catch (error) {
            console.error('Kuran senkronizasyon hatası:', error);
        }
    },

    // Uygulamaya Günlük Giriş / Zikir Serisini (Streak) Widget'a gönderir (Duolingo Tarzı)
    syncStreak: async (currentStreak: number) => {
        try {
            await Preferences.set({ key: 'WIDGET_STREAK', value: currentStreak.toString() });

            if (Capacitor.isNativePlatform()) {
                await WidgetSyncPlugin.updateWidget();
            }

            console.log('🔥 Streak (Günlük Seri) Android\'e senkronize edildi:', currentStreak);
        } catch (error) {
            console.error('Streak senkronizasyon hatası:', error);
        }
    }

};
