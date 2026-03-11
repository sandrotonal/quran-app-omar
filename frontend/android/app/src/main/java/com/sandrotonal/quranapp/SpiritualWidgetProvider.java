package com.sandrotonal.quranapp;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.widget.RemoteViews;

public class SpiritualWidgetProvider extends AppWidgetProvider {

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        // Here we update all instances of the widget
        for (int appWidgetId : appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId);
        }
    }

    static void updateAppWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {

        // 1. SharedPreferences (Capacitor Data Source)
        // Capacitor Preferences plugin creates a specific preference file named "CapacitorStorage"
        SharedPreferences prefs = context.getSharedPreferences("CapacitorStorage", Context.MODE_PRIVATE);
        
        // Default fallbacks if PWA isn't opened yet
        String defaultQuote = "Kalpler ancak Allah'ı anmakla huzur bulur.";
        String defaultAyetInfo = "RAD 28";
        String defaultCountdown = "AKŞAMA 1:42";

        // Read real data synced from JS/React Side (NativeSyncService.ts)
        String widgetMainText = prefs.getString("WIDGET_AYET_CONTENT", defaultQuote);
        String subText = prefs.getString("WIDGET_SURE_NAME", "RAD") + " " + prefs.getString("WIDGET_AYET_NO", "28");
        String prayerCountdown = prefs.getString("WIDGET_NEXT_PRAYER_NAME", "AKŞAMA") + " " + prefs.getString("WIDGET_PRAYER_TIME_LEFT", "1:42");

        // 2. Bound the Native Views
        // R.layout.spiritual_widget is the sleek Dark Navy Glassmorphism XML UI
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.spiritual_widget);

        // Update the textual elements on the Widget
        views.setTextViewText(R.id.widget_main_text, widgetMainText);
        views.setTextViewText(R.id.widget_sub_text, subText.toUpperCase());
        views.setTextViewText(R.id.widget_prayer_countdown, prayerCountdown);

        // 3. Set Click Action (Open App when clicked)
        Intent intent = new Intent(context, MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        views.setOnClickPendingIntent(R.id.widget_title, pendingIntent);
        
        // Instruct the AppWidgetManager to perform the update
        appWidgetManager.updateAppWidget(appWidgetId, views);
    }
}
