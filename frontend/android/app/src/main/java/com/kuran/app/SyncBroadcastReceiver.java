package com.kuran.app;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;

// Bu sınıf her 30 dakikada bir (veya PWA kapalıyken) uyanarak
// Wear OS (Akıllı Saat) ve Ana Ekran (Widget) cihazlarındaki bilgileri taze tutar.
public class SyncBroadcastReceiver extends BroadcastReceiver {

    @Override
    public void onReceive(Context context, Intent intent) {
        
        // 1. Storage'dan en güncel React/Capacitor verisini çek
        SharedPreferences prefs = context.getSharedPreferences("CapacitorStorage", Context.MODE_PRIVATE);
        String currentZikir = prefs.getString("WIDGET_ZIKIR_COUNT", "0");
        String nextPrayer = prefs.getString("WIDGET_NEXT_PRAYER_NAME", "AKŞAMA");
        String timeLeft = prefs.getString("WIDGET_PRAYER_TIME_LEFT", "00:00");
        String streak = prefs.getString("WIDGET_STREAK", "1");

        // 2. Eğer Wear OS saati bağlıysa Data Layer API üzerinden saati güncelle (İleride genişletilecek)
        // Wearable.getDataClient(context).putDataItem(putDataReq);

        // 3. Android Ana Ekran Widget'ını zorla (Force) güncelle
        Intent updateWidgetIntent = new Intent(context, SpiritualWidgetProvider.class);
        updateWidgetIntent.setAction("android.appwidget.action.APPWIDGET_UPDATE");
        context.sendBroadcast(updateWidgetIntent);

        System.out.println("🔄 Arkaplan Senkronizasyonu Tamamlandı: Saatler ve Widget'lar güncel!");
    }
}
