package com.kuran.app;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.widget.RemoteViews;

public class SpiritualWidgetProvider extends AppWidgetProvider {

    public static final String ACTION_INCREMENT_ZIKIR = "com.kuran.app.ACTION_INCREMENT_ZIKIR";

    @Override
    public void onReceive(Context context, Intent intent) {
        super.onReceive(context, intent);
        
        // Zikir Arttırma Eylemi Yakalandığında
        if (ACTION_INCREMENT_ZIKIR.equals(intent.getAction())) {
            SharedPreferences prefs = context.getSharedPreferences("CapacitorStorage", Context.MODE_PRIVATE);
            String countStr = prefs.getString("WIDGET_ZIKIR_COUNT", "0");
            try {
                int count = Integer.parseInt(countStr);
                count++;
                
                // Storage Güncelle
                SharedPreferences.Editor editor = prefs.edit();
                editor.putString("WIDGET_ZIKIR_COUNT", String.valueOf(count));
                editor.apply();

                // Widget'ı Anında Yenile
                AppWidgetManager appWidgetManager = AppWidgetManager.getInstance(context);
                ComponentName thisWidget = new ComponentName(context, SpiritualWidgetProvider.class);
                int[] appWidgetIds = appWidgetManager.getAppWidgetIds(thisWidget);
                onUpdate(context, appWidgetManager, appWidgetIds);
                
                // İleride Wear OS (Akıllı Saat) Data Layer Update buraya eklenecek
            } catch (NumberFormatException ignored) {}
        }
    }

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId);
        }
    }

    static void updateAppWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {

        // 1. SharedPreferences (Capacitor Data Source)
        SharedPreferences prefs = context.getSharedPreferences("CapacitorStorage", Context.MODE_PRIVATE);
        
        // Okuma başarısız olursa varsayılan değerler
        String defaultQuote = "Kalpler ancak Allah'ı anmakla huzur bulur.";

        // React'ten Sync edilen Gerçek Veriler (NativeSyncService.ts)
        String widgetMainText = prefs.getString("WIDGET_AYET_CONTENT", defaultQuote);
        
        String sureName = prefs.getString("WIDGET_SURE_NAME", "MANEVİ");
        String ayetNo = prefs.getString("WIDGET_AYET_NO", "ODAK");
        String subText = sureName + " " + ayetNo;
        
        String prayerName = prefs.getString("WIDGET_NEXT_PRAYER_NAME", "AKŞAMA");
        String prayerTime = prefs.getString("WIDGET_PRAYER_TIME_LEFT", "1:42");
        String prayerCountdown = prayerName + " " + prayerTime;

        // EĞER SON ZİKİR ÇEKİLDİYSE VEYA YENİLENME VARSA ONU GÖSTER (Dinamik)
        String zikirName = prefs.getString("WIDGET_ZIKIR_NAME", null);
        String zikirCount = prefs.getString("WIDGET_ZIKIR_COUNT", null);
        String zikirGoal = prefs.getString("WIDGET_ZIKIR_GOAL", null);
        
        // STREAK (Duolingo Alevi) Verisi
        String currentStreak = prefs.getString("WIDGET_STREAK", "1");
        
        // Zikir Çekildiyse Alt Metni Zikir olarak Değiştir (Akıllı Gösterim)
        if (zikirName != null && zikirCount != null) {
             subText = zikirName + " (" + zikirCount + "/" + zikirGoal + ")";
             // Sadece Zikir yeni çekildiğinde metni değiştirebiliriz ama kalıcı olsun
        }

        // 2. Bound the Native Views (spiritual_widget.xml tasarımı)
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.spiritual_widget);

        // UI textleri güncelle
        views.setTextViewText(R.id.widget_main_text, widgetMainText);
        views.setTextViewText(R.id.widget_sub_text, subText.toUpperCase());
        views.setTextViewText(R.id.widget_prayer_countdown, prayerCountdown);
        views.setTextViewText(R.id.widget_streak, currentStreak + " 🔥");

        // 3. Click Action (Uygulamayı Aç - Ana Başlık)
        Intent intent = new Intent(context, MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        views.setOnClickPendingIntent(R.id.widget_title, pendingIntent);
        
        // 4. Click Action (Zikir Arttır - Doğrudan Widget/Saat Üzerinden)
        Intent incrementIntent = new Intent(context, SpiritualWidgetProvider.class);
        incrementIntent.setAction(ACTION_INCREMENT_ZIKIR);
        PendingIntent incrementPendingIntent = PendingIntent.getBroadcast(context, 0, incrementIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        // Alev ikonuna / SubText Zikir Alanına tıklanınca artırsın
        views.setOnClickPendingIntent(R.id.widget_sub_text, incrementPendingIntent);

        // Güncelle
        appWidgetManager.updateAppWidget(appWidgetId, views);
    }
}
