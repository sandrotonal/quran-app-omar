import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

export interface PrayerNotification {
    id: number;
    title: string;
    body: string;
    fireDate: Date;
}

export const NotificationService = {

    // İzinleri kontrol edip ister
    requestPermissions: async () => {
        if (!Capacitor.isNativePlatform()) return true;

        let permStatus = await LocalNotifications.checkPermissions();
        if (permStatus.display !== 'granted') {
            permStatus = await LocalNotifications.requestPermissions();
        }
        return permStatus.display === 'granted';
    },

    // Akıllı saatte ve telefonda bildirimin altında çıkacak Etkileşimli Butonlar
    registerActions: async () => {
        if (!Capacitor.isNativePlatform()) return;
        await LocalNotifications.registerActionTypes({
            types: [
                {
                    id: 'PRAYER_ACTIONS',
                    actions: [
                        { id: 'dismiss', title: 'Kapat / Sustur' },
                        { id: 'open', title: 'Uygulamayı Aç' }
                    ]
                }
            ]
        });
    },

    // Akıllı Saat veya Telefonda gelen interaktif butonlara tıklandığını yakalar
    setupListeners: async () => {
        if (!Capacitor.isNativePlatform()) return;

        // Eğer zaten dinlenmiyorsa ekleyelim
        await LocalNotifications.addListener('localNotificationActionPerformed', (action) => {
            console.log('Bildirim Butonuna Tıklandı:', action.actionId);

            if (action.actionId === 'dismiss') {
                // Sadece bildirimi kapatır
                console.log('Namaz bildirimi susturuldu.');
            } else if (action.actionId === 'open') {
                // İleride uygulamanın Kur'an/Namaz sekmesine spesifik route atılabilir.
                console.log('Uygulamaya girildi.');
            }
        });
    },

    // Günlük Namaz Vakitlerini Alarma/Bildirime Dönüştürür (Akıllı Saat Destekli)
    schedulePrayerAlarms: async (prayers: PrayerNotification[]) => {
        if (!Capacitor.isNativePlatform()) return;

        const hasPermission = await NotificationService.requestPermissions();
        if (!hasPermission) {
            console.warn('Bildirim izni verilmediği için Ezan bildirimleri kurulamadı.');
            return;
        }

        try {
            // Önceki kurulan (veya vadesi geçmiş) eski alarmları temizle
            const pending = await LocalNotifications.getPending();
            if (pending.notifications.length > 0) {
                await LocalNotifications.cancel(pending);
            }

            // Yeni vaktin (bugünün) Namaz bildirimlerini kur
            const notificationsToSchedule = prayers.map(prayer => ({
                id: prayer.id,
                title: prayer.title,
                body: prayer.body,
                schedule: { at: prayer.fireDate, allowWhileIdle: true }, // Exact Alarm
                actionTypeId: 'PRAYER_ACTIONS',
                extra: null
            }));

            // Sadece Gelecekteki vakitleri kur (Geçmişse bildirim kurma)
            const futureNotifications = notificationsToSchedule.filter(n => n.schedule.at.getTime() > new Date().getTime());

            if (futureNotifications.length > 0) {
                await LocalNotifications.schedule({
                    notifications: futureNotifications
                });
                console.log(`✅ ${futureNotifications.length} Vakit için Native (Akıllı Saat) Bildirim Alarmları Kuruldu.`);
            }

        } catch (error) {
            console.error('Bildirim (Local Notification) Kurulum Hatası:', error);
        }
    }
};
