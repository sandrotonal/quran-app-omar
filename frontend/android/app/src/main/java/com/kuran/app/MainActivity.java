package com.kuran.app;

import com.getcapacitor.BridgeActivity;

import android.os.Bundle;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Custom Widget Trigger eklentisini Kotlin/Java köprüsüne kayıt et
        registerPlugin(WidgetSyncPlugin.class);
    }
}
